"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Check, CreditCard } from "lucide-react";
import { startMembershipCheckout } from "@/server/actions/membership";
import type { ProviderId } from "@/lib/payments/types";

type PlanView = {
  id: string;
  name: string;
  price: string;
  perMonth: string;
  months: number;
  badge: string | null;
  blurb: string;
  savings: string | null;
};

const PROVIDER_LABEL: Record<ProviderId, string> = {
  STRIPE: "Pay by card",
  PAYPAL: "PayPal",
};

export function PlanCards({
  plans,
  benefits,
  providers,
  signedIn,
  alreadyMember,
}: {
  plans: PlanView[];
  benefits: string[];
  providers: ProviderId[];
  signedIn: boolean;
  alreadyMember: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(plans.find((p) => p.badge === "Most Popular")?.id ?? plans[0].id);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function checkout(planId: string, provider: ProviderId) {
    if (!signedIn) {
      router.push(`/login?callbackUrl=/membership`);
      return;
    }
    setError("");
    setBusy(`${planId}:${provider}`);

    const res = await startMembershipCheckout(planId, provider);
    if (res.success && (res.data as any)?.url) {
      window.location.href = (res.data as any).url; // hand off to the provider
      return;
    }
    setError(res.error || "Could not start checkout.");
    setBusy(null);
  }

  if (alreadyMember) {
    return (
      <Card className="max-w-md mx-auto rounded-3xl border-border/40 p-8 text-center">
        <h2 className="font-heading text-xl text-foreground mb-2">You&apos;re already a member</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your plan, renewal date and invoices from your dashboard.
        </p>
        <Link href="/dashboard/parent/membership">
          <Button variant="primary" size="lg" fullWidth className="rounded-full">
            Manage membership
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          const popular = plan.badge === "Most Popular";

          return (
            <div key={plan.id} onClick={() => setSelected(plan.id)} className="contents">
            <Card
              padding="none"
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 flex flex-col cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                  : "border-border/40 bg-card hover:border-primary/30"
              }`}
            >
              {popular && isSelected && <BorderBeam />}

              {plan.badge && (
                <span
                  className={`self-start inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                    popular ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <h2 className="font-heading text-lg font-bold text-foreground mb-1">{plan.name}</h2>

              <div className="flex items-baseline gap-1.5 mt-2 mb-1">
                <span className="font-heading text-4xl text-foreground">{plan.price}</span>
                {plan.months > 1 && (
                  <span className="text-sm text-muted-foreground">/{plan.months} months</span>
                )}
                {plan.months === 1 && <span className="text-sm text-muted-foreground">/month</span>}
              </div>

              {plan.months > 1 && (
                <p className="text-xs text-muted-foreground mb-1">{plan.perMonth}/month effective</p>
              )}

              {plan.savings ? (
                <p className="text-xs font-semibold text-primary mb-4">
                  Save {plan.savings} vs monthly
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mb-4">Billed monthly</p>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed mb-5">{plan.blurb}</p>

              <ul className="space-y-2 mb-6 mt-auto">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                {providers.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Payments are being set up — check back shortly.
                  </p>
                )}
                {providers.map((provider, i) => (
                  <Button
                    key={provider}
                    variant={i === 0 ? (popular ? "primary" : "accent") : "outline"}
                    fullWidth
                    isLoading={busy === `${plan.id}:${provider}`}
                    disabled={Boolean(busy)}
                    onClick={(e) => {
                      e.stopPropagation();
                      checkout(plan.id, provider);
                    }}
                    className="rounded-full"
                  >
                    {i === 0 && <CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />}
                    {PROVIDER_LABEL[provider]}
                  </Button>
                ))}
              </div>
            </Card>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive mt-6" role="alert">
          {error}
        </p>
      )}
      {!signedIn && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          You&apos;ll be asked to sign in first.{" "}
          <Link href="/register-family" className="text-primary font-semibold hover:underline">
            Create a free family account
          </Link>
        </p>
      )}
    </>
  );
}
