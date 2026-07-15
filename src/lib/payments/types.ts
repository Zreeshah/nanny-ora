import type { Plan } from "@/lib/membership";

export type ProviderId = "STRIPE" | "PAYPAL";

export type CheckoutRequest = {
  userId: string;
  email: string;
  plan: Plan;
  successUrl: string;
  cancelUrl: string;
};

export type BookingCheckoutRequest = {
  bookingId: string;
  email: string;
  amountCents: number;
  nannyName: string;
  successUrl: string;
  cancelUrl: string;
};

export type TierCheckoutRequest = {
  nannyProfileId: string;
  tierId: string;
  tierName: string;
  email: string;
  amountCents: number;
  successUrl: string;
  cancelUrl: string;
};

/**
 * The one interface every payment provider implements. Adding a provider (or a
 * new flow like booking payments / compliance deposits) means adding a method
 * here and implementing it per provider — no call-site changes.
 */
export interface PaymentProvider {
  id: ProviderId;
  /** Is this provider configured (keys present)? Unconfigured providers are hidden in the UI. */
  isConfigured(): boolean;
  /** Start a membership subscription. Returns the URL to redirect the user to. */
  createMembershipCheckout(req: CheckoutRequest): Promise<{ url: string }>;
  /** Cancel at period end. Members keep access until renewsAt. */
  cancelMembership(providerSubscriptionId: string): Promise<void>;
  /**
   * Start a one-time booking payment. Funds land in the platform account and are
   * held until the booking completes (payout automation is a later phase).
   * Returns the redirect URL and the provider reference to persist on the payment.
   */
  createBookingCheckout(req: BookingCheckoutRequest): Promise<{ url: string; ref: string }>;
  /** One-time nanny tier purchase ($50 Listed / $200 Premium). */
  createTierCheckout(req: TierCheckoutRequest): Promise<{ url: string; ref: string }>;
}
