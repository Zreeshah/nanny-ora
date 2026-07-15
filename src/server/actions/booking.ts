"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { requireMembership } from "@/lib/membership";
import { getProvider, appUrl } from "@/lib/payments";
import type { ProviderId } from "@/lib/payments";
import { captureBookingOrder, refundPaypalCapture } from "@/lib/payments/paypal";
import { refundStripe } from "@/lib/payments/stripe";
import { recordPayment } from "@/lib/payments/activate";
import {
  quoteBooking,
  canTransition,
  MIN_BOOKING_HOURS,
  MAX_BOOKING_HOURS,
  PAYOUT_HOLD_HOURS,
} from "@/lib/booking";
import type { ActionResult } from "./auth";

type CreateBookingInput = {
  nannyId: string;
  date: string; // yyyy-mm-dd
  hours: number;
  startTime?: string;
  notes?: string;
  provider: ProviderId;
};

/**
 * Create a booking and start payment. Member-gated. The booking is created as
 * PENDING_PAYMENT; only a confirmed payment (Stripe webhook / PayPal capture)
 * moves it to REQUESTED where the nanny can see it. Returns { url } to redirect to.
 */
export async function createBooking(input: CreateBookingInput): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email;
    if (!userId || !email) return { success: false, error: "Please sign in to book." };
    if ((session!.user as any).role !== "PARENT") {
      return { success: false, error: "Only family accounts can make bookings." };
    }

    // Booking is a member-only feature.
    const gate = await requireMembership();
    if (gate) return gate;

    const { nannyId, date, provider } = input;
    const hours = Math.floor(Number(input.hours));

    if (!Number.isFinite(hours) || hours < MIN_BOOKING_HOURS || hours > MAX_BOOKING_HOURS) {
      return { success: false, error: `Hours must be between ${MIN_BOOKING_HOURS} and ${MAX_BOOKING_HOURS}.` };
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { success: false, error: "Please choose a valid date." };
    }
    // Must be today or later (compare date-only to avoid TZ off-by-one).
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) return { success: false, error: "Please choose a future date." };

    const nanny = await prisma.nannyProfile.findUnique({
      where: { id: nannyId },
      include: { user: { select: { name: true } } },
    });
    if (!nanny || !["APPROVED", "VERIFIED", "SPECIALIST"].includes(nanny.adminStatus)) {
      return { success: false, error: "This nanny isn't available for booking." };
    }

    // Snapshot the rate NOW so a later rate change doesn't alter an existing booking.
    const { subtotalCents, feeCents, totalCents } = quoteBooking(nanny.hourlyRate, hours);

    const booking = await prisma.booking.create({
      data: {
        parentId: userId,
        nannyId,
        date,
        startTime: input.startTime ?? "",
        hours,
        hourlyRate: nanny.hourlyRate,
        subtotalCents,
        feeCents,
        totalCents,
        status: "PENDING_PAYMENT",
        notes: (input.notes ?? "").slice(0, 1000),
      },
    });

    const { url } = await getProvider(provider).createBookingCheckout({
      bookingId: booking.id,
      email,
      amountCents: totalCents,
      nannyName: nanny.user.name.split(" ")[0],
      successUrl: `${appUrl()}/dashboard/parent/bookings?booking=${booking.id}`,
      cancelUrl: `${appUrl()}/dashboard/parent/bookings?cancelled=1`,
    });

    return { success: true, data: { url, bookingId: booking.id } };
  } catch (error) {
    console.error("createBooking error:", error);
    return { success: false, error: "Could not start your booking. Please try again." };
  }
}

/** Mark a paid booking REQUESTED and record the charge. Idempotent on providerRef. */
async function settleBooking(args: {
  bookingId: string;
  userId: string;
  provider: ProviderId;
  providerRef: string;
  amountCents: number;
}): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { id: args.bookingId } });
  if (!booking || booking.parentId !== args.userId) return;

  const created = await recordPayment({
    userId: args.userId,
    provider: args.provider,
    providerRef: args.providerRef,
    amountCents: args.amountCents,
    kind: "BOOKING",
    feeCents: booking.feeCents,
    bookingId: booking.id,
    description: "Childcare booking",
  });

  // Only advance the booking the first time we see this payment.
  if (created && booking.status === "PENDING_PAYMENT") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "REQUESTED", payoutStatus: "HELD" },
    });
  }
}

/**
 * PayPal return: capture the approved order and settle the booking. Called from
 * the bookings page when PayPal redirects back with ?token=<orderId>.
 */
export async function confirmPaypalBooking(orderId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Please sign in." };
    if (!/^[A-Z0-9]+$/i.test(orderId)) return { success: false, error: "Invalid order reference." };

    const result = await captureBookingOrder(orderId);
    if (!result.captured || !result.bookingId) {
      return { success: false, error: "Payment could not be captured." };
    }

    await settleBooking({
      bookingId: result.bookingId,
      userId,
      provider: "PAYPAL",
      providerRef: `paypal_capture_${result.captureId ?? orderId}`,
      amountCents: result.amountCents,
    });

    return { success: true, data: { bookingId: result.bookingId } };
  } catch (error) {
    console.error("confirmPaypalBooking error:", error);
    return { success: false, error: "Could not confirm your booking payment." };
  }
}

/** Settle a Stripe booking payment — called by the Stripe webhook. */
export async function settleStripeBooking(args: {
  bookingId: string;
  providerRef: string;
  amountCents: number;
}): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { id: args.bookingId } });
  if (!booking) return;
  await settleBooking({
    bookingId: args.bookingId,
    userId: booking.parentId,
    provider: "STRIPE",
    providerRef: args.providerRef,
    amountCents: args.amountCents,
  });
}

/**
 * Refund a paid booking whose payment is still HELD (nanny declined / someone
 * cancelled). Idempotent: claims payoutStatus HELD→REFUNDED first, so it can't
 * double-refund, and rolls back if the provider refund fails so it can retry.
 */
async function refundBooking(bookingId: string): Promise<void> {
  const payment = await prisma.payment.findFirst({
    where: { bookingId, kind: "BOOKING", status: "PAID" },
  });
  if (!payment || !payment.providerRef) return; // never paid → nothing to refund
  const providerRef = payment.providerRef;

  const claim = await prisma.booking.updateMany({
    where: { id: bookingId, payoutStatus: "HELD" },
    data: { payoutStatus: "REFUNDED" },
  });
  if (claim.count === 0) return; // already refunded or paid out

  try {
    if (payment.provider === "STRIPE") {
      await refundStripe(providerRef);
    } else if (payment.provider === "PAYPAL") {
      await refundPaypalCapture(providerRef.replace("paypal_capture_", ""));
    }
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } });
  } catch (err) {
    // ponytail: on failure, roll the claim back to HELD so a retry/admin can refund
    // later rather than the booking looking refunded when the money never moved.
    await prisma.booking.updateMany({ where: { id: bookingId, payoutStatus: "REFUNDED" }, data: { payoutStatus: "HELD" } }).catch(() => {});
    console.error(`refund failed for booking ${bookingId}:`, err);
    throw err;
  }
}

/** Advance a booking (nanny accept/decline, parent cancel/approve). Validated. */
export async function updateBookingStatus(bookingId: string, to: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Please sign in." };
    const role = (session!.user as any).role;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { nanny: { select: { userId: true } } },
    });
    if (!booking) return { success: false, error: "Booking not found." };

    const isParent = role === "PARENT" && booking.parentId === userId;
    const isNanny = role === "NANNY" && booking.nanny.userId === userId;
    if (!isParent && !isNanny) return { success: false, error: "Not your booking." };

    const actor = isNanny ? "nanny" : "parent";
    if (!canTransition(booking.status, to, actor)) {
      return { success: false, error: "That change isn't allowed for this booking." };
    }

    // On parent approval, schedule the payout: held for PAYOUT_HOLD_HOURS so a
    // late quality dispute can still block it (fix #6). The cron releases it after.
    const data: { status: string; payoutReleaseAt?: Date } = { status: to };
    if (to === "COMPLETED") {
      data.payoutReleaseAt = new Date(Date.now() + PAYOUT_HOLD_HOURS * 60 * 60 * 1000);
    }

    await prisma.booking.update({ where: { id: bookingId }, data });

    // Nanny declined or someone cancelled a paid booking → refund the parent.
    if (to === "DECLINED" || to === "CANCELLED") {
      try {
        await refundBooking(bookingId);
      } catch {
        // status change stands; refund will be retried / handled by admin.
        return { success: true, data: { status: to, refundPending: true } };
      }
    }

    return { success: true, data: { status: to } };
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    return { success: false, error: "Could not update the booking." };
  }
}

const shape = (b: any) => ({
  id: b.id,
  date: b.date,
  startTime: b.startTime,
  hours: b.hours,
  hourlyRate: b.hourlyRate,
  subtotalCents: b.subtotalCents,
  feeCents: b.feeCents,
  totalCents: b.totalCents,
  status: b.status,
  notes: b.notes,
  createdAt: b.createdAt,
});

/** Bookings the current parent has made. Hides never-paid (PENDING_PAYMENT) ones. */
export async function getParentBookings(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: true, data: [] };

    const rows = await prisma.booking.findMany({
      where: { parentId: userId, status: { not: "PENDING_PAYMENT" } },
      include: { nanny: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return {
      success: true,
      data: rows.map((b) => ({ ...shape(b), nannyId: b.nannyId, nannyName: b.nanny.user.name })),
    };
  } catch (error) {
    console.error("getParentBookings error:", error);
    return { success: true, data: [] };
  }
}

/** Bookings for the current nanny. Also hides unpaid ones. */
export async function getNannyBookings(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: true, data: [] };

    const profile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) return { success: true, data: [] };

    const rows = await prisma.booking.findMany({
      where: { nannyId: profile.id, status: { not: "PENDING_PAYMENT" } },
      include: { parent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return {
      success: true,
      // Nanny sees her earnings = subtotal (the platform fee isn't hers).
      data: rows.map((b) => ({ ...shape(b), parentName: b.parent.name })),
    };
  } catch (error) {
    console.error("getNannyBookings error:", error);
    return { success: true, data: [] };
  }
}
