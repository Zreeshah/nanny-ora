// Pure booking logic — no server-only imports, so the client booking widget and the
// server actions share ONE fee calculation and ONE status model.

/** Platform service fee on bookings (spec: 8–12%). Single source of truth. */
export const SERVICE_FEE_PCT = 0.1;

export const MIN_BOOKING_HOURS = 1;
export const MAX_BOOKING_HOURS = 12;

export type Quote = { subtotalCents: number; feeCents: number; totalCents: number };

/**
 * Price a booking from a nanny's NZD/hr rate and a number of hours.
 * Fee is rounded to the cent; total is subtotal + fee.
 */
export function quoteBooking(hourlyRateNzd: number, hours: number): Quote {
  const subtotalCents = Math.round(hourlyRateNzd * 100) * hours;
  const feeCents = Math.round(subtotalCents * SERVICE_FEE_PCT);
  return { subtotalCents, feeCents, totalCents: subtotalCents + feeCents };
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
