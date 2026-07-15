// Nanny pricing tiers — one-time upfront payment, no monthly fee. Pure module
// (no server-only) so the client tier page and server actions share it.

export type TierId = "LISTED" | "PREMIUM";

export type Tier = {
  id: TierId;
  name: string;
  priceCents: number;
  badge?: string;
  blurb: string;
  features: string[];
};

export const NANNY_TIERS: Tier[] = [
  {
    id: "LISTED",
    name: "Standard — Listed",
    priceCents: 5000, // $50
    blurb: "Covers vetting and our induction manual. Standard search visibility.",
    features: [
      "Vetting + induction manual",
      "Public profile in the directory",
      "Receive enquiries & bookings",
      "Standard search visibility",
      "10% booking fee (from earnings)",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    priceCents: 20000, // $200
    badge: "Best for bookings",
    blurb:
      "Includes your mandatory childcare First Aid training ($150 value) + $50 vetting. Non-refundable once training is booked.",
    features: [
      "Everything in Standard",
      "Childcare First Aid training included",
      "‘Verified Premium’ badge",
      "Top priority search placement",
      "Access to top-tier bookings",
      "10% booking fee (from earnings)",
    ],
  },
];

export const getTier = (id: string): Tier | undefined => NANNY_TIERS.find((t) => t.id === id);

/** Priority weight for search ordering — Premium floats above Listed above unpaid. */
export function tierRank(tier: string | null | undefined): number {
  if (tier === "PREMIUM") return 2;
  if (tier === "LISTED") return 1;
  return 0;
}
