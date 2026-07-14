import "server-only";
import { stripeProvider } from "./stripe";
import { paypalProvider } from "./paypal";
import type { PaymentProvider, ProviderId } from "./types";

export type { PaymentProvider, ProviderId, CheckoutRequest } from "./types";

const PROVIDERS: Record<ProviderId, PaymentProvider> = {
  STRIPE: stripeProvider,
  PAYPAL: paypalProvider,
};

export function getProvider(id: ProviderId): PaymentProvider {
  const p = PROVIDERS[id];
  if (!p) throw new Error(`Unknown payment provider: ${id}`);
  if (!p.isConfigured()) throw new Error(`${id} is not configured on this environment.`);
  return p;
}

/** Which providers have keys — the plans page only offers these. */
export const configuredProviders = (): ProviderId[] =>
  (Object.keys(PROVIDERS) as ProviderId[]).filter((id) => PROVIDERS[id].isConfigured());

/** Absolute base URL for building return/cancel links (works locally and on Vercel). */
export function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}
