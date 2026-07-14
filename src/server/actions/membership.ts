"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { getPlan, getMembership, MEMBERSHIP_PLANS, type PlanId } from "@/lib/membership";
import { getProvider, configuredProviders, appUrl } from "@/lib/payments";
import { paypalFetch } from "@/lib/payments/paypal";
import { activateMembership, recordPayment } from "@/lib/payments/activate";
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
    // Stale session (account deleted while logged in) — the checkout would succeed but
    // activation would fail on a missing user. Tell them to refresh their session.
    const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!exists) {
      return { success: false, error: "Your session is out of date. Please sign out and sign in again." };
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

/**
 * Confirm a PayPal subscription right after the buyer is redirected back, instead
 * of waiting for the webhook. PayPal appends ?subscription_id=I-XXX to the return
 * URL; we verify it with PayPal and activate immediately. The webhook stays as the
 * backstop (renewals, cancellations, and first-charge recording if this misses).
 *
 * Idempotent: activateMembership upserts, and the payment is keyed by the PayPal
 * transaction id — the SAME key the PAYMENT.SALE.COMPLETED webhook uses — so this
 * and the webhook can both run without double-billing.
 */
export async function confirmPaypalSubscription(subscriptionId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "Please sign in." };
    if (!/^I-[A-Z0-9]+$/i.test(subscriptionId)) {
      return { success: false, error: "Invalid subscription reference." };
    }

    const sub = await paypalFetch(`/v1/billing/subscriptions/${subscriptionId}`);

    // Security: the subscription's custom_id is "<userId>:<planId>" set at creation.
    // It MUST belong to the signed-in user — otherwise anyone could activate off
    // someone else's subscription id.
    const [subUser, subPlanRaw] = String(sub.custom_id ?? "").split(":");
    if (!subUser || subUser !== userId) {
      return { success: false, error: "This subscription isn't linked to your account." };
    }
    if (sub.status !== "ACTIVE" && sub.status !== "APPROVED") {
      return { success: false, error: `Your subscription is ${String(sub.status).toLowerCase()}, not active yet.` };
    }

    const planId = subPlanRaw as PlanId;
    const plan = getPlan(planId);

    await activateMembership({
      userId,
      planId,
      provider: "PAYPAL",
      providerSubscriptionId: subscriptionId,
      providerCustomerId: sub.subscriber?.payer_id ?? null,
      periodEnd: sub.billing_info?.next_billing_time
        ? new Date(sub.billing_info.next_billing_time)
        : null,
    });

    // Record the first charge now (best-effort). Keyed by the PayPal transaction id so
    // it de-dupes cleanly against the PAYMENT.SALE.COMPLETED webhook if that arrives.
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 2 * 24 * 60 * 60 * 1000);
      const txns = await paypalFetch(
        `/v1/billing/subscriptions/${subscriptionId}/transactions?start_time=${start.toISOString()}&end_time=${end.toISOString()}`
      );
      const txn = (txns.transactions ?? []).find((t: any) => t.status === "COMPLETED") ?? (txns.transactions ?? [])[0];
      if (txn?.id) {
        const cents =
          Math.round(parseFloat(txn.amount_with_breakdown?.gross_amount?.value ?? "0") * 100) ||
          plan?.priceCents ||
          0;
        await recordPayment({
          userId,
          provider: "PAYPAL",
          providerRef: `paypal_sale_${txn.id}`,
          amountCents: cents,
          description: `${plan?.name ?? planId} membership`,
        });
      }
    } catch (e) {
      console.error("PayPal first-charge fetch failed (non-fatal, webhook will cover):", e);
    }

    return { success: true, data: { activated: true } };
  } catch (error) {
    console.error("confirmPaypalSubscription error:", error);
    return { success: false, error: "Could not confirm your PayPal subscription." };
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
