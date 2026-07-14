"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { getPlan, getMembership, MEMBERSHIP_PLANS } from "@/lib/membership";
import { getProvider, configuredProviders, appUrl } from "@/lib/payments";
import type { ProviderId } from "@/lib/payments";
import type { ActionResult } from "./auth";

/** Which payment buttons to show on the plans page. */
export async function getPaymentOptions(): Promise<ActionResult> {
  return { success: true, data: configuredProviders() };
}

/**
 * Begin a membership purchase. Returns { url } for the client to redirect to.
 * The membership is NOT activated here — only the provider's verified webhook
 * does that, so a user can't self-grant access by hitting the success URL.
 */
export async function startMembershipCheckout(
  planId: string,
  provider: ProviderId
): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email;

    if (!userId || !email) {
      return { success: false, error: "Please sign in to become a member." };
    }
    if (userId.startsWith("demo-") || userId.startsWith("backup-")) {
      return { success: false, error: "This account cannot purchase a membership." };
    }

    const plan = getPlan(planId);
    if (!plan) return { success: false, error: "Unknown plan." };

    const existing = await getMembership();
    if (existing.isMember) {
      return { success: false, error: "You already have an active membership." };
    }

    const { url } = await getProvider(provider).createMembershipCheckout({
      userId,
      email,
      plan,
      successUrl: `${appUrl()}/dashboard/parent/membership?checkout=success`,
      cancelUrl: `${appUrl()}/membership?checkout=cancelled`,
    });

    return { success: true, data: { url } };
  } catch (error) {
    console.error("startMembershipCheckout error:", error);
    return { success: false, error: "Could not start checkout. Please try again." };
  }
}

/** Cancel at period end — the member keeps access until their renewal date. */
export async function cancelMembership(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Please sign in." };

    const m = await prisma.membership.findUnique({ where: { userId } });
    if (!m || m.status !== "ACTIVE") {
      return { success: false, error: "You don't have an active membership." };
    }

    if (m.provider && m.providerSubscriptionId) {
      await getProvider(m.provider as ProviderId).cancelMembership(m.providerSubscriptionId);
    }

    await prisma.membership.update({
      where: { id: m.id },
      data: { cancelAtPeriodEnd: true },
    });

    return { success: true, data: { cancelAtPeriodEnd: true } };
  } catch (error) {
    console.error("cancelMembership error:", error);
    return { success: false, error: "Could not cancel. Please contact support." };
  }
}

/** Everything the dashboard Membership section renders. */
export async function getMembershipDashboard(): Promise<ActionResult> {
  const empty = {
    isMember: false,
    plan: null,
    planName: null,
    status: "INACTIVE",
    renewsAt: null,
    cancelAtPeriodEnd: false,
    provider: null,
    payments: [] as any[],
    plans: MEMBERSHIP_PLANS,
  };

  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || userId.startsWith("demo-") || userId.startsWith("backup-")) {
      return { success: true, data: empty };
    }

    const [m, payments] = await Promise.all([
      getMembership(),
      prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      success: true,
      data: {
        ...m,
        planName: m.plan ? getPlan(m.plan)?.name ?? m.plan : null,
        plans: MEMBERSHIP_PLANS,
        payments: payments.map((p) => ({
          id: p.id,
          date: p.createdAt,
          description: p.description,
          amountCents: p.amountCents,
          currency: p.currency,
          status: p.status,
          provider: p.provider,
        })),
      },
    };
  } catch (error) {
    console.error("getMembershipDashboard error:", error);
    return { success: true, data: empty };
  }
}
