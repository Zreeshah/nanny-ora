import "server-only";
import { prisma } from "@/lib/db/prisma";
import { getPlan, type PlanId } from "@/lib/membership";
import type { ProviderId } from "./types";

/** Add a plan's span to a date — the renewal date after a successful charge. */
export function addPlanSpan(from: Date, planId: PlanId): Date {
  const plan = getPlan(planId);
  const end = new Date(from);
  end.setMonth(end.getMonth() + (plan?.months ?? 1));
  return end;
}

type ActivateArgs = {
  userId: string;
  planId: PlanId;
  provider: ProviderId;
  providerSubscriptionId?: string | null;
  providerCustomerId?: string | null;
  /** From the provider when known; otherwise derived from the plan span. */
  periodEnd?: Date | null;
};

/**
 * Grant/extend access. Provisioning ONLY — deliberately does not touch money.
 *
 * Providers emit two events per purchase (Stripe: checkout.session.completed +
 * invoice.paid; PayPal: SUBSCRIPTION.ACTIVATED + PAYMENT.SALE.COMPLETED). Both
 * mean "this person is a member", so both call this — it's an idempotent upsert.
 * Only the invoice/sale event calls recordPayment(), so one charge = one row.
 */
export async function activateMembership(args: ActivateArgs): Promise<void> {
  const { userId, planId, provider, providerSubscriptionId, providerCustomerId, periodEnd } = args;

  const renewsAt = periodEnd ?? addPlanSpan(new Date(), planId);

  const fields = {
    plan: planId,
    status: "ACTIVE",
    provider,
    providerCustomerId: providerCustomerId ?? undefined,
    providerSubscriptionId: providerSubscriptionId ?? undefined,
    currentPeriodEnd: renewsAt,
    cancelAtPeriodEnd: false,
  };

  await prisma.membership.upsert({
    where: { userId },
    create: { userId, ...fields },
    update: fields,
  });
}

type PaymentArgs = {
  userId: string;
  provider: ProviderId;
  /** The provider's charge id — the idempotency key. A replayed webhook is a no-op. */
  providerRef: string;
  amountCents: number;
  kind?: string;
  description?: string;
  feeCents?: number;
  bookingId?: string;
};

/**
 * Record one charge. Unique on providerRef, so webhook retries can't double-bill.
 * Returns true if it created a new row, false if this charge was already recorded.
 */
export async function recordPayment(args: PaymentArgs): Promise<boolean> {
  const { userId, provider, providerRef, amountCents, kind = "MEMBERSHIP", description, feeCents, bookingId } = args;

  const seen = await prisma.payment.findUnique({ where: { providerRef } });
  if (seen) return false;

  await prisma.payment.create({
    data: {
      userId,
      kind,
      provider,
      providerRef,
      amountCents,
      feeCents: feeCents ?? 0,
      bookingId: bookingId ?? null,
      currency: "NZD",
      status: "PAID",
      description: description ?? "Membership",
    },
  });
  return true;
}

/** Flip a membership out of ACTIVE (cancelled / expired / payment failed). */
export async function setMembershipStatus(
  where: { userId?: string; providerSubscriptionId?: string },
  status: "CANCELED" | "EXPIRED" | "PAST_DUE" | "ACTIVE",
  cancelAtPeriodEnd?: boolean
): Promise<void> {
  const membership = where.userId
    ? await prisma.membership.findUnique({ where: { userId: where.userId } })
    : await prisma.membership.findFirst({
        where: { providerSubscriptionId: where.providerSubscriptionId },
      });
  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: { status, ...(cancelAtPeriodEnd !== undefined ? { cancelAtPeriodEnd } : {}) },
  });
}
