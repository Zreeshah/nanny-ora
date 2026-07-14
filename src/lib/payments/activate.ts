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
  amountCents: number;
  /** Provider's charge id — the idempotency key. A replayed webhook is a no-op. */
  providerRef: string;
  description?: string;
};

/**
 * Mark a membership active and record the payment. Safe to call twice with the same
 * providerRef (webhooks retry) — the Payment row is unique on providerRef, and the
 * Membership is an upsert.
 */
export async function activateMembership(args: ActivateArgs): Promise<void> {
  const {
    userId, planId, provider, providerSubscriptionId, providerCustomerId,
    periodEnd, amountCents, providerRef, description,
  } = args;

  // Idempotency: if we've already booked this charge, do nothing.
  const seen = await prisma.payment.findUnique({ where: { providerRef } });
  if (seen) return;

  const renewsAt = periodEnd ?? addPlanSpan(new Date(), planId);

  await prisma.membership.upsert({
    where: { userId },
    create: {
      userId,
      plan: planId,
      status: "ACTIVE",
      provider,
      providerCustomerId: providerCustomerId ?? undefined,
      providerSubscriptionId: providerSubscriptionId ?? undefined,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: false,
    },
    update: {
      plan: planId,
      status: "ACTIVE",
      provider,
      providerCustomerId: providerCustomerId ?? undefined,
      providerSubscriptionId: providerSubscriptionId ?? undefined,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: false,
    },
  });

  await prisma.payment.create({
    data: {
      userId,
      kind: "MEMBERSHIP",
      provider,
      providerRef,
      amountCents,
      currency: "NZD",
      status: "PAID",
      description: description ?? `${getPlan(planId)?.name ?? planId} membership`,
    },
  });
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
