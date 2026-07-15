"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { getProvider, appUrl } from "@/lib/payments";
import type { ProviderId } from "@/lib/payments";
import { captureBookingOrder } from "@/lib/payments/paypal";
import { recordPayment } from "@/lib/payments/activate";
import { getTier, NANNY_TIERS, type TierId } from "@/lib/tiers";
import type { ActionResult } from "./auth";

/** Start a one-time nanny tier purchase. Nanny-only. Returns { url } to redirect to. */
export async function startTierCheckout(tierId: string, provider: ProviderId): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email;
    if (!userId || !email) return { success: false, error: "Please sign in." };
    if ((session!.user as any).role !== "NANNY") {
      return { success: false, error: "Only nanny accounts can buy a tier." };
    }
    if (userId.startsWith("demo-") || userId.startsWith("backup-")) {
      return { success: false, error: "This account cannot purchase a tier." };
    }

    const tier = getTier(tierId);
    if (!tier) return { success: false, error: "Unknown tier." };

    const profile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) return { success: false, error: "Complete your profile first." };

    const { url } = await getProvider(provider).createTierCheckout({
      nannyProfileId: profile.id,
      tierId: tier.id,
      tierName: tier.name,
      email,
      amountCents: tier.priceCents,
      successUrl: `${appUrl()}/dashboard/nanny/tier?paid=1`,
      cancelUrl: `${appUrl()}/dashboard/nanny/tier?cancelled=1`,
    });
    return { success: true, data: { url } };
  } catch (error) {
    console.error("startTierCheckout error:", error);
    return { success: false, error: "Could not start checkout. Please try again." };
  }
}

/** Apply a paid tier to a nanny profile + record the payment. Idempotent on providerRef. */
async function settleTier(args: {
  nannyProfileId: string;
  tierId: TierId;
  provider: ProviderId;
  providerRef: string;
  amountCents: number;
}): Promise<void> {
  const profile = await prisma.nannyProfile.findUnique({
    where: { id: args.nannyProfileId },
    select: { userId: true },
  });
  if (!profile) return;

  const created = await recordPayment({
    userId: profile.userId,
    provider: args.provider,
    providerRef: args.providerRef,
    amountCents: args.amountCents,
    kind: "TIER",
    description: `${getTier(args.tierId)?.name ?? args.tierId} tier`,
  });

  if (created) {
    await prisma.nannyProfile.update({
      where: { id: args.nannyProfileId },
      data: { tier: args.tierId, tierPaidAt: new Date() },
    });
  }
}

/** PayPal return: capture the tier order and apply it. custom_id = "tier:<profileId>:<tierId>". */
export async function confirmPaypalTier(orderId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Please sign in." };
    if (!/^[A-Z0-9]+$/i.test(orderId)) return { success: false, error: "Invalid order reference." };

    const result = await captureBookingOrder(orderId);
    if (!result.captured || !result.bookingId) {
      return { success: false, error: "Payment could not be captured." };
    }

    const [kind, nannyProfileId, tierId] = String(result.bookingId).split(":");
    if (kind !== "tier" || !nannyProfileId || !tierId) {
      return { success: false, error: "This payment isn't a tier purchase." };
    }

    // Security: the tier must be for THIS nanny's own profile.
    const profile = await prisma.nannyProfile.findUnique({
      where: { id: nannyProfileId },
      select: { userId: true },
    });
    if (!profile || profile.userId !== userId) {
      return { success: false, error: "This purchase isn't linked to your account." };
    }

    await settleTier({
      nannyProfileId,
      tierId: tierId as TierId,
      provider: "PAYPAL",
      providerRef: `paypal_capture_${result.captureId ?? orderId}`,
      amountCents: result.amountCents,
    });
    return { success: true, data: { tierId } };
  } catch (error) {
    console.error("confirmPaypalTier error:", error);
    return { success: false, error: "Could not confirm your tier payment." };
  }
}

/** Settle a Stripe tier payment — called by the Stripe webhook. */
export async function settleStripeTier(args: {
  nannyProfileId: string;
  tierId: string;
  providerRef: string;
  amountCents: number;
}): Promise<void> {
  await settleTier({
    nannyProfileId: args.nannyProfileId,
    tierId: args.tierId as TierId,
    provider: "STRIPE",
    providerRef: args.providerRef,
    amountCents: args.amountCents,
  });
}

/** Current tier + the options, for the tier page. */
export async function getNannyTier(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: true, data: { tier: "NONE", tiers: NANNY_TIERS } };
    const profile = await prisma.nannyProfile.findUnique({
      where: { userId },
      select: { tier: true, tierPaidAt: true },
    });
    return {
      success: true,
      data: { tier: profile?.tier ?? "NONE", tierPaidAt: profile?.tierPaidAt ?? null, tiers: NANNY_TIERS },
    };
  } catch (error) {
    console.error("getNannyTier error:", error);
    return { success: true, data: { tier: "NONE", tiers: NANNY_TIERS } };
  }
}
