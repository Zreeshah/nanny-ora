// Pure booking logic — no server-only imports, so the client booking widget and the
// server actions share ONE fee calculation and ONE status model.

/** Platform service fee on bookings (spec: 8–12%). Single source of truth. */
export const SERVICE_FEE_PCT = 0.1;

export const MIN_BOOKING_HOURS = 1;
export const MAX_BOOKING_HOURS = 12;

/** Hold a payout this long after parent approval, so a late dispute can block it. */
export const PAYOUT_HOLD_HOURS = 48;

// self-check (run: npx tsx src/lib/booking.ts) — browser-safe guard so importing
// this module in a client component never touches process.argv.
// NZ$30/hr × 5h → parent pays $150, platform keeps $15, nanny nets $135.
if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("booking.ts")) {
  const q = quoteBooking(30, 5);
  console.assert(q.subtotalCents === 15000 && q.totalCents === 15000, "parent pays subtotal");
  console.assert(q.feeCents === 1500, "10% fee");
  console.assert(q.earningsCents === 13500, "nanny nets subtotal − fee");
  console.assert(quoteBooking(27.5, 3).earningsCents === 7425, "fractional rate");
  console.log("booking quote self-check passed");
}

export type Quote = {
  subtotalCents: number; // rate × hours — what the PARENT pays (no surcharge)
  feeCents: number; // platform's 10% cut, deducted from the nanny
  earningsCents: number; // what the NANNY receives = subtotal − fee
  totalCents: number; // == subtotal; the amount actually charged to the parent
};

/**
 * Price a booking from a nanny's NZD/hr rate and hours.
 * The parent pays the subtotal; the 10% platform fee comes OUT of the nanny's
 * earnings (fee-from-earnings model), so the nanny nets subtotal − fee.
 */
export function quoteBooking(hourlyRateNzd: number, hours: number): Quote {
  const subtotalCents = Math.round(hourlyRateNzd * 100) * hours;
  const feeCents = Math.round(subtotalCents * SERVICE_FEE_PCT);
  return { subtotalCents, feeCents, earningsCents: subtotalCents - feeCents, totalCents: subtotalCents };
}

export const centsToNzd = (cents: number): string =>
  `NZ$${(cents / 100).toFixed(2)}`;

// ============================================================
// Booking status workflow. The full future flow is modelled here; the UI wires a
// subset now (create → pay → REQUESTED → nanny accept/decline → parent complete).
// The later stages (in-progress, nanny-completed, review) are valid values ready
// to be activated without a schema or type change.
// ============================================================

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "REQUESTED"
  | "ACCEPTED"
  | "UPCOMING"
  | "IN_PROGRESS"
  | "COMPLETED_BY_NANNY"
  | "AWAITING_PARENT_APPROVAL"
  | "COMPLETED"
  | "REVIEW_REQUESTED"
  | "DECLINED"
  | "CANCELLED";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In progress",
  COMPLETED_BY_NANNY: "Completed by nanny",
  AWAITING_PARENT_APPROVAL: "Awaiting your approval",
  COMPLETED: "Completed",
  REVIEW_REQUESTED: "Review requested",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
};

/**
 * Who may move a booking from a given status to which next statuses. The action
 * layer validates against this so an invalid transition can't be forced.
 */
export const BOOKING_TRANSITIONS: Record<
  BookingStatus,
  { nanny?: BookingStatus[]; parent?: BookingStatus[] }
> = {
  PENDING_PAYMENT: {}, // moved by the payment webhook/return only
  REQUESTED: { nanny: ["ACCEPTED", "DECLINED"], parent: ["CANCELLED"] },
  ACCEPTED: { nanny: ["IN_PROGRESS", "CANCELLED"], parent: ["CANCELLED"] },
  UPCOMING: { nanny: ["IN_PROGRESS", "CANCELLED"], parent: ["CANCELLED"] },
  IN_PROGRESS: { nanny: ["COMPLETED_BY_NANNY"] },
  COMPLETED_BY_NANNY: { parent: ["COMPLETED"] },
  AWAITING_PARENT_APPROVAL: { parent: ["COMPLETED"] },
  COMPLETED: {},
  REVIEW_REQUESTED: {},
  DECLINED: {},
  CANCELLED: {},
};

/** Is a status change by this role allowed from where the booking currently sits? */
export function canTransition(
  from: string,
  to: string,
  role: "nanny" | "parent"
): boolean {
  const allowed = BOOKING_TRANSITIONS[from as BookingStatus]?.[role] ?? [];
  return allowed.includes(to as BookingStatus);
}
