import "server-only";
import Stripe from "stripe";
import type { PaymentProvider, CheckoutRequest } from "./types";

const key = process.env.STRIPE_SECRET_KEY;

/** Null when unconfigured, so the app boots (and the UI hides Stripe) without keys. */
export const stripe = key ? new Stripe(key) : null;

export const stripeProvider: PaymentProvider = {
  id: "STRIPE",

  isConfigured: () => Boolean(key),

  async createMembershipCheckout({ userId, email, plan, successUrl, cancelUrl }: CheckoutRequest) {
    if (!stripe) throw new Error("Stripe is not configured.");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          // Inline price — avoids having to pre-create Products/Prices in the Stripe
          // dashboard and keeps MEMBERSHIP_PLANS the single source of truth.
          price_data: {
            currency: "nzd",
            unit_amount: plan.priceCents,
            product_data: { name: `NannyOra ${plan.name} Membership` },
            recurring: { interval: plan.interval, interval_count: plan.intervalCount },
          },
        },
      ],
      // Echoed back on the webhook — how we know who paid for what.
      metadata: { userId, planId: plan.id },
      subscription_data: { metadata: { userId, planId: plan.id } },
      allow_promotion_codes: true, // discount codes, free
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return { url: session.url };
  },

  async cancelMembership(providerSubscriptionId: string) {
    if (!stripe) throw new Error("Stripe is not configured.");
    await stripe.subscriptions.update(providerSubscriptionId, { cancel_at_period_end: true });
  },
};
