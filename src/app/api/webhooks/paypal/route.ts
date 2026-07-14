import { NextResponse } from "next/server";
import { paypalFetch } from "@/lib/payments/paypal";
import { activateMembership, recordPayment, setMembershipStatus } from "@/lib/payments/activate";
import { getPlan, type PlanId } from "@/lib/membership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** PayPal's own signature check — the event is only trusted if this returns SUCCESS. */
async function verify(headers: Headers, rawBody: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  // Guard: an empty/garbage body (health checks, probes) must fail cleanly, not throw.
  let parsedEvent: unknown;
  try {
    parsedEvent = JSON.parse(rawBody);
  } catch {
    return false;
  }
  if (!headers.get("paypal-transmission-sig")) return false;

  const res = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      webhook_id: webhookId,
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_time: headers.get("paypal-transmission-time"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      cert_url: headers.get("paypal-cert-url"),
      auth_algo: headers.get("paypal-auth-algo"),
      webhook_event: parsedEvent,
    }),
  });
  return res.verification_status === "SUCCESS";
}

/** custom_id is "<userId>:<planId>" — set when we created the subscription. */
function parseCustomId(customId?: string): { userId: string; planId: PlanId } | null {
  if (!customId) return null;
  const [userId, planId] = customId.split(":");
  if (!userId || !planId) return null;
  return { userId, planId: planId as PlanId };
}

export async function POST(req: Request) {
  if (!process.env.PAYPAL_CLIENT_ID) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  }

  const raw = await req.text();

  let ok = false;
  try {
    ok = await verify(req.headers, raw);
  } catch (err) {
    console.error("PayPal webhook verification error:", err);
  }
  if (!ok) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(raw);
  const resource = event.resource ?? {};

  try {
    switch (event.event_type) {
      // Subscriber approved — grant access. Money is NOT recorded here:
      // PAYMENT.SALE.COMPLETED fires for the same charge and is the single source of
      // truth for payments, so recording in both would double-count the purchase.
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const ids = parseCustomId(resource.custom_id);
        if (!ids) break;

        await activateMembership({
          userId: ids.userId,
          planId: ids.planId,
          provider: "PAYPAL",
          providerSubscriptionId: resource.id,
          providerCustomerId: resource.subscriber?.payer_id ?? null,
          periodEnd: resource.billing_info?.next_billing_time
            ? new Date(resource.billing_info.next_billing_time)
            : null,
        });
        break;
      }

      // Every successful charge — the first one AND renewals. Extends access and is
      // the only place a membership Payment row is written.
      case "PAYMENT.SALE.COMPLETED": {
        const ids = parseCustomId(resource.custom_id);
        const subId = resource.billing_agreement_id;
        if (!ids || !subId) break;

        const plan = getPlan(ids.planId);
        const amountCents =
          Math.round(parseFloat(resource.amount?.total ?? "0") * 100) || plan?.priceCents || 0;

        await activateMembership({
          userId: ids.userId,
          planId: ids.planId,
          provider: "PAYPAL",
          providerSubscriptionId: subId,
        });

        await recordPayment({
          userId: ids.userId,
          provider: "PAYPAL",
          providerRef: `paypal_sale_${resource.id}`,
          amountCents,
          description: `${plan?.name ?? ids.planId} membership`,
        });
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await setMembershipStatus({ providerSubscriptionId: resource.id }, "CANCELED");
        break;

      case "BILLING.SUBSCRIPTION.EXPIRED":
        await setMembershipStatus({ providerSubscriptionId: resource.id }, "EXPIRED");
        break;

      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await setMembershipStatus({ providerSubscriptionId: resource.id }, "PAST_DUE");
        break;
    }
  } catch (err) {
    console.error(`PayPal webhook handler failed (${event.event_type}):`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
