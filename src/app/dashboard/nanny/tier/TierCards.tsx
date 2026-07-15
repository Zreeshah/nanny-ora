"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, CreditCard, CheckCircle } from "lucide-react";
import { startTierCheckout, confirmPaypalTier } from "@/server/actions/tier";
import { NANNY_TIERS } from "@/lib/tiers";
import type { ProviderId } from "@/lib/payments/types";

const money = (c: number) => `NZ$${(c / 100).toFixed(0)}`;
const PROVIDER_LABEL: Record<ProviderId, string> = { STRIPE: "Pay by card", PAYPAL: "PayPal" };

export function TierCards({
  currentTier,
  providers,
}: {
  currentTier: string;
  providers: ProviderId[];
}) {
  const params = useSearchParams();
  const [tier, setTier] = useState(currentTier);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  // PayPal returns with ?token=<orderId> — capture it.
  useEffect(() => {
    const token = params.get("token");
    if (!token) return;
    setConfirming(true);
    confirmPaypalTier(token).then((res) => {
      if (res.success) setTier((res.data as any).tierId);
      else setError(res.error || "Could not confirm payment.");
      setConfirming(false);
    });
  }, [params]);

  async function buy(tierId: string, provider: ProviderId) {
    setError("");
    setBusy(`${tierId}:${provider}`);
    const res = await startTierCheckout(tierId, provider);
    if (res.success && (res.data as any)?.url) {
      window.location.href = (res.data as any).url;
      return;
    }
    setError(res.error || "Could not start checkout.");
    setBusy(null);
  }

  const paidTier = NANNY_TIERS.find((t) => t.id === tier);

  return (
    <>
      {paidTier && (
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 mb-6">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">You&apos;re on the {paidTier.name} tier</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tier === "PREMIUM"
                ? "Verified Premium badge and top search placement are active."
                : "Your profile is listed with standard visibility."}
            </p>
          </div>
        </Card>
      )}
      {confirming && <p className="text-sm text-muted-foreground mb-4">Confirming your payment…</p>}
      {params.get("cancelled") && !paidTier && (
        <p className="text-sm text-muted-foreground mb-4">Payment cancelled — no tier was purchased.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NANNY_TIERS.map((t) => {
          const isCurrent = tier === t.id;
          const isUpgrade = tier === "LISTED" && t.id === "PREMIUM";
          return (
            <Card
              key={t.id}
              className={`rounded-3xl p-6 flex flex-col border ${
                t.id === "PREMIUM" ? "border-primary/40 bg-primary/[0.03]" : "border-border/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-heading text-lg font-bold text-foreground">{t.name}</h2>
                {t.badge && <Badge variant="premium">{t.badge}</Badge>}
              </div>
              <div className="font-heading text-4xl text-foreground mb-1">{money(t.priceCents)}</div>
              <p className="text-xs text-muted-foreground mb-4">one-off · no monthly fee</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.blurb}</p>

              <ul className="space-y-2 mb-6 mt-auto">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button variant="outline" fullWidth disabled className="rounded-full">
                  Your current tier
                </Button>
              ) : tier === "PREMIUM" && t.id === "LISTED" ? (
                <p className="text-xs text-muted-foreground text-center">Included in your Premium tier.</p>
              ) : (
                <div className="space-y-2">
                  {isUpgrade && (
                    <p className="text-[11px] text-muted-foreground text-center">
                      Upgrade pays the full Premium price (First Aid + badge).
                    </p>
                  )}
                  {providers.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">Payments are being set up.</p>
                  )}
                  {providers.map((provider, i) => (
                    <Button
                      key={provider}
                      variant={i === 0 ? "primary" : "outline"}
                      fullWidth
                      isLoading={busy === `${t.id}:${provider}`}
                      disabled={Boolean(busy)}
                      onClick={() => buy(t.id, provider)}
                      className="rounded-full"
                    >
                      {i === 0 && <CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />}
                      {PROVIDER_LABEL[provider]} · {money(t.priceCents)}
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {error && <p className="text-center text-sm text-destructive mt-6" role="alert">{error}</p>}
    </>
  );
}
