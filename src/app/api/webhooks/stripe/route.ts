import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/payments/stripe";
import { activateMembership, recordPayment, setMembershipStatus } from "@/lib/payments/activate";
import { settleStripeBooking } from "@/server/actions/booking";
import { settleStripeTier } from "@/server/actions/tier";
import type { PlanId } from "@/lib/membership";

// Stripe needs the raw body to verify the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    // Never trust an unverified webhook — this is a money path.
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Checkout finished — either a membership subscription or a one-time booking.
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;

        // One-time booking payment (mode=payment): settle the booking + record the fee.
        if (s.metadata?.kind === "BOOKING" && s.metadata?.bookingId) {
          await settleStripeBooking({
            bookingId: s.metadata.bookingId,
            providerRef: s.id,
            amountCents: s.amount_total ?? 0,
          });
          break;
        }

        // One-time nanny tier purchase.
        if (s.metadata?.kind === "TIER" && s.metadata?.nannyProfileId && s.metadata?.tierId) {
          await settleStripeTier({
            nannyProfileId: s.metadata.nannyProfileId,
            tierId: s.metadata.tierId,
            providerRef: s.id,
            amountCents: s.amount_total ?? 0,
          });
          break;
        }

        // Membership: grant access immediately. Money is NOT recorded here — invoice.paid
        // fires for the same charge and is the single source of truth for payments.
        const userId = s.metadata?.userId;
        const planId = s.metadata?.planId as PlanId | undefined;
        if (!userId || !planId) break;

        await activateMembership({
          userId,
          planId,
          provider: "STRIPE",
          providerCustomerId: typeof s.customer === "string" ? s.customer : null,
          providerSubscriptionId: typeof s.subscription === "string" ? s.subscription : null,
        });
        break;
      }

      // Every successful charge — the first one AND renewals. Extends access and is
      // the only place a membership Payment row is written.
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice & { subscription?: string };
        const subId = typeof inv.subscription === "string" ? inv.subscription : null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        const userId = sub.metadata?.userId;
        const planId = sub.metadata?.planId as PlanId | undefined;
        if (!userId || !planId) break;

        const periodEndUnix = (sub as any).current_period_end as number | undefined;

        await activateMembership({
          userId,
          planId,
          provider: "STRIPE",
          providerCustomerId: typeof sub.customer === "string" ? sub.customer : null,
          providerSubscriptionId: subId,
          periodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,
        });

        await recordPayment({
          userId,
          provider: "STRIPE",
          providerRef: inv.id ?? `${subId}:${inv.created}`,
          amountCents: inv.amount_paid ?? 0,
          description: inv.billing_reason === "subscription_create"
            ? `${planId.charAt(0) + planId.slice(1).toLowerCase()} membership`
            : "Membership renewal",
        });
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice & { subscription?: string };
        if (typeof inv.subscription === "string") {
          await setMembershipStatus({ providerSubscriptionId: inv.subscription }, "PAST_DUE");
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        // Cancel-at-period-end: keep access until the period actually ends.
        await setMembershipStatus(
          { providerSubscriptionId: sub.id },
          sub.status === "active" || sub.status === "trialing" ? "ACTIVE" : "PAST_DUE",
          sub.cancel_at_period_end
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await setMembershipStatus({ providerSubscriptionId: sub.id }, "CANCELED");
        break;
      }
    }
  } catch (err) {
    // Return 500 so Stripe retries rather than dropping a paid event on the floor.
    console.error(`Stripe webhook handler failed (${event.type}):`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
