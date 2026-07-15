import "server-only";
import type { PaymentProvider, CheckoutRequest, BookingCheckoutRequest, TierCheckoutRequest } from "./types";
import type { Plan } from "@/lib/membership";

// ponytail: PayPal's REST API over fetch — the official SDK adds a dependency for
// what is four endpoints. Auth token is short-lived and re-fetched as needed.

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

export const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const configured = () => Boolean(CLIENT_ID && CLIENT_SECRET);

async function token(): Promise<string> {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  return (await res.json()).access_token;
}

export async function paypalFetch(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${PAYPAL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await token()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal ${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

// --- Product + billing plans, created on first use and reused thereafter ---------
// Avoids making the operator pre-create anything in the PayPal dashboard. Cached in
// module scope; on a cold start we look the existing ones up by name instead of
// creating duplicates.

const PRODUCT_NAME = "NannyOra Membership";
const planIdCache = new Map<string, string>();
let productIdCache: string | null = null;

async function getOrCreateProduct(): Promise<string> {
  if (productIdCache) return productIdCache;

  const list = await paypalFetch("/v1/catalogs/products?page_size=20");
  const found = (list.products ?? []).find((p: any) => p.name === PRODUCT_NAME);
  if (found) return (productIdCache = found.id);

  const created = await paypalFetch("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name: PRODUCT_NAME,
      description: "Parent membership for the NannyOra platform",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  return (productIdCache = created.id);
}

const paypalPlanName = (plan: Plan) => `NannyOra ${plan.name} Membership`;

async function getOrCreatePlan(plan: Plan): Promise<string> {
  const cached = planIdCache.get(plan.id);
  if (cached) return cached;

  const productId = await getOrCreateProduct();
  const list = await paypalFetch(`/v1/billing/plans?product_id=${productId}&page_size=20`);
  const found = (list.plans ?? []).find(
    (p: any) => p.name === paypalPlanName(plan) && p.status === "ACTIVE"
  );
  if (found) {
    planIdCache.set(plan.id, found.id);
    return found.id;
  }

  const created = await paypalFetch("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: productId,
      name: paypalPlanName(plan),
      status: "ACTIVE",
      billing_cycles: [
        {
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // renew indefinitely
          frequency: {
            interval_unit: plan.interval === "year" ? "YEAR" : "MONTH",
            interval_count: plan.intervalCount,
          },
          pricing_scheme: {
            fixed_price: { value: (plan.priceCents / 100).toFixed(2), currency_code: "NZD" },
          },
        },
      ],
      payment_preferences: { auto_bill_outstanding: true, setup_fee_failure_action: "CONTINUE" },
    }),
  });
  planIdCache.set(plan.id, created.id);
  return created.id;
}

export const paypalProvider: PaymentProvider = {
  id: "PAYPAL",

  isConfigured: configured,

  async createMembershipCheckout({ userId, email, plan, successUrl, cancelUrl }: CheckoutRequest) {
    if (!configured()) throw new Error("PayPal is not configured.");

    const planId = await getOrCreatePlan(plan);
    const sub = await paypalFetch("/v1/billing/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        plan_id: planId,
        subscriber: { email_address: email },
        custom_id: `${userId}:${plan.id}`, // echoed back on the webhook
        application_context: {
          brand_name: "NannyOra",
          user_action: "SUBSCRIBE_NOW",
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const approve = (sub.links ?? []).find((l: any) => l.rel === "approve");
    if (!approve?.href) throw new Error("PayPal did not return an approval URL.");
    return { url: approve.href };
  },

  async cancelMembership(providerSubscriptionId: string) {
    await paypalFetch(`/v1/billing/subscriptions/${providerSubscriptionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: "Cancelled by member" }),
    });
  },

  async createBookingCheckout({ bookingId, amountCents, nannyName, successUrl, cancelUrl }: BookingCheckoutRequest) {
    if (!configured()) throw new Error("PayPal is not configured.");

    // Orders v2, intent CAPTURE — funds are captured on return (captureBookingOrder).
    const order = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: bookingId, // echoed back so we can match the booking
            description: `Booking with ${nannyName}`.slice(0, 127),
            amount: { currency_code: "NZD", value: (amountCents / 100).toFixed(2) },
          },
        ],
        application_context: {
          brand_name: "NannyOra",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const approve = (order.links ?? []).find((l: any) => l.rel === "approve" || l.rel === "payer-action");
    if (!approve?.href) throw new Error("PayPal did not return an approval URL.");
    return { url: approve.href, ref: order.id };
  },

  async createTierCheckout({ nannyProfileId, tierId, tierName, amountCents, successUrl, cancelUrl }: TierCheckoutRequest) {
    if (!configured()) throw new Error("PayPal is not configured.");

    const order = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: `tier:${nannyProfileId}:${tierId}`, // parsed on return
            description: `NannyOra ${tierName}`.slice(0, 127),
            amount: { currency_code: "NZD", value: (amountCents / 100).toFixed(2) },
          },
        ],
        application_context: {
          brand_name: "NannyOra",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const approve = (order.links ?? []).find((l: any) => l.rel === "approve" || l.rel === "payer-action");
    if (!approve?.href) throw new Error("PayPal did not return an approval URL.");
    return { url: approve.href, ref: order.id };
  },
};

/** Capture an approved booking order on return. Returns { captured, bookingId, amountCents, captureId }. */
export async function captureBookingOrder(orderId: string): Promise<{
  captured: boolean;
  bookingId: string | null;
  amountCents: number;
  captureId: string | null;
}> {
  const res = await paypalFetch(`/v2/checkout/orders/${orderId}/capture`, { method: "POST" });
  const pu = (res.purchase_units ?? [])[0];
  const capture = pu?.payments?.captures?.[0];
  const amount = capture?.amount?.value ?? pu?.amount?.value ?? "0";
  return {
    captured: res.status === "COMPLETED",
    bookingId: pu?.custom_id ?? capture?.custom_id ?? null,
    amountCents: Math.round(parseFloat(amount) * 100),
    captureId: capture?.id ?? null,
  };
}

/** Read an order's status/custom_id without capturing (idempotency check). */
export async function getBookingOrder(orderId: string): Promise<any> {
  return paypalFetch(`/v2/checkout/orders/${orderId}`);
}

/**
 * Send a nanny her earnings via PayPal Payouts. Draws from the platform PayPal
 * balance. `senderItemId` is our idempotency key (PayPal rejects a duplicate),
 * so a retried cron run can't double-pay. Returns the payout batch id.
 */
export async function sendPayout(args: {
  email: string;
  amountCents: number;
  senderItemId: string;
  note?: string;
}): Promise<{ batchId: string }> {
  if (!configured()) throw new Error("PayPal is not configured.");

  const res = await paypalFetch("/v1/payments/payouts", {
    method: "POST",
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: args.senderItemId,
        email_subject: "You've been paid for a NannyOra booking",
        email_message: args.note ?? "Your booking earnings from NannyOra.",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: { value: (args.amountCents / 100).toFixed(2), currency: "NZD" },
          receiver: args.email,
          sender_item_id: args.senderItemId,
          note: args.note ?? "NannyOra booking earnings",
        },
      ],
    }),
  });

  const batchId = res.batch_header?.payout_batch_id;
  if (!batchId) throw new Error("PayPal did not return a payout batch id.");
  return { batchId };
}
