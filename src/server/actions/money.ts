"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import type { ActionResult } from "./auth";

/**
 * Money-flow overview for the admin dashboard.
 *
 * Platform revenue = membership fees + tier fees + the booking service fee (NOT the
 * whole booking amount — most of that is the nanny's earnings). Payouts owed/paid
 * are the nanny earnings (booking subtotal − fee).
 */
export async function getMoneyOverview(): Promise<ActionResult> {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return { success: false, error: "Unauthorised" };
    }

    const [membership, tier, bookingAgg, releasedAgg, heldAgg, recent, counts] = await Promise.all([
      prisma.payment.aggregate({ _sum: { amountCents: true }, _count: true, where: { kind: "MEMBERSHIP", status: "PAID" } }),
      prisma.payment.aggregate({ _sum: { amountCents: true }, _count: true, where: { kind: "TIER", status: "PAID" } }),
      // booking fee = platform income; amount = gross the parent paid
      prisma.payment.aggregate({ _sum: { amountCents: true, feeCents: true }, _count: true, where: { kind: "BOOKING", status: "PAID" } }),
      // payouts already released to nannies
      prisma.booking.aggregate({ _sum: { subtotalCents: true, feeCents: true }, _count: true, where: { payoutStatus: "RELEASED" } }),
      // earnings still held (owed to nannies, not yet paid)
      prisma.booking.aggregate({ _sum: { subtotalCents: true, feeCents: true }, _count: true, where: { payoutStatus: "HELD", status: { notIn: ["PENDING_PAYMENT", "DECLINED", "CANCELLED"] } } }),
      prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 12, include: { user: { select: { name: true } } } }),
      Promise.all([
        prisma.membership.count({ where: { status: "ACTIVE" } }),
        prisma.nannyProfile.count({ where: { tier: "PREMIUM" } }),
        prisma.nannyProfile.count({ where: { tier: "LISTED" } }),
        prisma.booking.count({ where: { status: { notIn: ["PENDING_PAYMENT"] } } }),
      ]),
    ]);

    const membershipRev = membership._sum.amountCents ?? 0;
    const tierRev = tier._sum.amountCents ?? 0;
    const bookingFeeRev = bookingAgg._sum.feeCents ?? 0;
    const bookingGross = bookingAgg._sum.amountCents ?? 0;

    const paidOut = (releasedAgg._sum.subtotalCents ?? 0) - (releasedAgg._sum.feeCents ?? 0);
    const heldForNannies = (heldAgg._sum.subtotalCents ?? 0) - (heldAgg._sum.feeCents ?? 0);
    const [activeMembers, premiumNannies, listedNannies, bookingCount] = counts;

    return {
      success: true,
      data: {
        platformRevenueCents: membershipRev + tierRev + bookingFeeRev,
        breakdown: {
          membershipCents: membershipRev,
          tierCents: tierRev,
          bookingFeeCents: bookingFeeRev,
        },
        grossProcessedCents: membershipRev + tierRev + bookingGross,
        paidOutCents: paidOut,
        heldForNanniesCents: heldForNannies,
        counts: {
          activeMembers,
          premiumNannies,
          listedNannies,
          bookings: bookingCount,
          memberPayments: membership._count,
          tierPayments: tier._count,
          bookingPayments: bookingAgg._count,
        },
        recent: recent.map((p) => ({
          id: p.id,
          date: p.createdAt,
          who: p.user?.name ?? "—",
          kind: p.kind,
          amountCents: p.amountCents,
          feeCents: p.feeCents,
          provider: p.provider,
          status: p.status,
        })),
      },
    };
  } catch (error) {
    console.error("getMoneyOverview error:", error);
    return { success: false, error: "Could not load money overview." };
  }
}
