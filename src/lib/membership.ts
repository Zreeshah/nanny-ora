import "server-only";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

// ============================================================
// Plans — single source of truth (page, checkout, dashboard all read this)
// ============================================================

export type PlanId = "MONTHLY" | "QUARTERLY" | "ANNUAL";

export type Plan = {
  id: PlanId;
  name: string;
  priceCents: number;
  months: number;
  interval: "month" | "year";
  intervalCount: number;
  badge?: string;
  blurb: string;
};

export const MEMBERSHIP_PLANS: Plan[] = [
  {
    id: "MONTHLY",
    name: "Monthly",
    priceCents: 3900,
    months: 1,
    interval: "month",
    intervalCount: 1,
    blurb: "Full access, billed monthly.",
  },
  {
    id: "QUARTERLY",
    name: "Quarterly",
    priceCents: 8900,
    months: 3,
    interval: "month",
    intervalCount: 3,
    badge: "Most Popular",
    blurb: "Our most popular plan — ideal for an active search.",
  },
  {
    id: "ANNUAL",
    name: "Annual",
    priceCents: 14900,
    months: 12,
    interval: "year",
    intervalCount: 1,
    badge: "Best Value",
    blurb: "Best value for families who want care sorted for the year.",
  },
];

/** Everything a membership unlocks — shown on the plans page and in the upgrade modal. */
export const MEMBERSHIP_BENEFITS = [
  "Unlimited nanny messaging",
  "View full nanny profiles & contact details",
  "Shortlist favourite nannies",
  "Request meet-and-greets",
  "Post childcare jobs",
  "Secure bookings with verified nannies",
  "Priority support",
];

export { SERVICE_FEE_PCT } from "@/lib/booking"; // canonical lives in booking.ts (pure)

export const getPlan = (id: string): Plan | undefined =>
  MEMBERSHIP_PLANS.find((p) => p.id === id);

const MONTHLY_CENTS = MEMBERSHIP_PLANS[0].priceCents;

/** What a plan saves vs paying monthly for the same span. 0 for the monthly plan. */
export function planSavingsCents(plan: Plan): number {
  return Math.max(0, MONTHLY_CENTS * plan.months - plan.priceCents);
}

export const formatNzd = (cents: number): string =>
  `NZ$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

// ============================================================
// The gate — one place that decides "is this user a paid member?"
// ============================================================

export type MembershipInfo = {
  isMember: boolean;
  plan: PlanId | null;
  status: string;
  renewsAt: Date | null;
  cancelAtPeriodEnd: boolean;
  provider: string | null;
};

const NONE: MembershipInfo = {
  isMember: false,
  plan: null,
  status: "INACTIVE",
  renewsAt: null,
  cancelAtPeriodEnd: false,
  provider: null,
};

/** Membership state for a given user. A member is ACTIVE and not past their period end. */
export async function getMembershipFor(userId: string): Promise<MembershipInfo> {
  const m = await prisma.membership.findUnique({ where: { userId } });
  if (!m) return NONE;

  const notExpired = !m.currentPeriodEnd || m.currentPeriodEnd.getTime() > Date.now();
  return {
    isMember: m.status === "ACTIVE" && notExpired,
    plan: m.plan as PlanId,
    status: m.status,
    renewsAt: m.currentPeriodEnd,
    cancelAtPeriodEnd: m.cancelAtPeriodEnd,
    provider: m.provider,
  };
}

/** Membership state for the signed-in user. Safe for guests (returns not-a-member). */
export async function getMembership(): Promise<MembershipInfo> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    // ponytail: demo-/backup- ids aren't real User rows — treat as non-members.
    if (!userId || userId.startsWith("demo-") || userId.startsWith("backup-")) return NONE;
    return await getMembershipFor(userId);
  } catch {
    return NONE;
  }
}

export const isMember = async (): Promise<boolean> => (await getMembership()).isMember;

/**
 * Master switch for the gate. OFF by default so the system can ship and be tested
 * in production (checkout + dashboard fully work) WITHOUT locking existing free
 * parents out of messaging/shortlisting. Set MEMBERSHIP_ENFORCED=true (with live
 * payment keys in place) to actually enforce — takes effect with no redeploy.
 */
export const membershipEnforced = (): boolean => process.env.MEMBERSHIP_ENFORCED === "true";

/** The message shown wherever a locked feature is hit. */
export const UPGRADE_MESSAGE =
  "Become a member to unlock this. Membership includes unlimited messaging, full profiles, shortlisting, meet-and-greets and secure bookings.";

/**
 * Server-side gate for member-only actions. Returns null when allowed, or an
 * ActionResult-shaped error to return straight from the action.
 *
 * Every member-only server action calls this first — one choke point, so a new
 * locked feature can't accidentally ship ungated.
 */
export async function requireMembership(): Promise<
  { success: false; error: string; upgradeRequired?: boolean } | null
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Please sign in to continue." };
  }
  // Soft-launch: until enforcement is switched on, no one is gated.
  if (!membershipEnforced()) return null;
  // Nannies and admins are never blocked by a parent membership.
  const role = (session.user as any).role;
  if (role === "ADMIN" || role === "NANNY") return null;

  const { isMember: ok } = await getMembership();
  if (!ok) return { success: false, error: UPGRADE_MESSAGE, upgradeRequired: true };
  return null;
}
