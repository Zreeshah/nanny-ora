import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, ArrowRight, Check } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";
import { ShinyText } from "@/components/ui/ShinyText";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { NannyTiers } from "@/components/pricing/NannyTiers";
import { MEMBERSHIP_PLANS, MEMBERSHIP_BENEFITS, planSavingsCents, formatNzd } from "@/lib/membership";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "NannyOra pricing — browsing is free for families; membership unlocks contact and bookings. Nannies apply free, with optional Listed and Premium tiers.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  const plans = MEMBERSHIP_PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    price: formatNzd(p.priceCents),
    perMonth: formatNzd(Math.round(p.priceCents / p.months)),
    months: p.months,
    badge: p.badge ?? null,
    savings: planSavingsCents(p) > 0 ? formatNzd(planSavingsCents(p)) : null,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])]} />
      <div className="text-center mb-14">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Simple, <ShinyText>Transparent Pricing</ShinyText>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Families browse verified nannies for free. Nannies apply for free. You only pay for the
          premium features you choose.
        </p>
      </div>

      <ImageBand tags={["family", "find", "professional", "care"]} seed="pricing" aspect="aspect-[16/6]" className="mb-16" />

      {/* ===== FOR FAMILIES ===== */}
      <section className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            For Families
          </span>
          <h2 className="font-heading text-3xl text-foreground mb-2">Parent membership</h2>
          <p className="text-sm text-muted-foreground">
            Browsing profiles is always free. Membership unlocks messaging, full profiles, contact
            details, shortlisting, meet-and-greets, job posts, and secure bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-6">
          {plans.map((plan) => {
            const popular = plan.badge === "Most Popular";
            return (
              <Card
                key={plan.id}
                className={`flex flex-col p-6 rounded-3xl relative overflow-hidden border ${
                  popular ? "border-primary/50 shadow-md ring-4 ring-primary/5" : "border-border/40"
                }`}
              >
                {popular && <BorderBeam duration={12} />}
                {plan.badge && (
                  <span
                    className={`self-start inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                      popular ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-1 mb-1">
                  <span className="font-heading text-4xl text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.months === 1 ? "/month" : `/${plan.months} months`}
                  </span>
                </div>
                {plan.savings ? (
                  <p className="text-xs font-semibold text-primary mb-5">
                    {plan.perMonth}/mo · save {plan.savings} vs monthly
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-5">Billed monthly</p>
                )}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {MEMBERSHIP_BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/membership" className="mt-auto">
                  <Button variant={popular ? "primary" : "outline"} fullWidth className="rounded-full">
                    Become a member <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Cancel anytime — you keep access until the end of your paid period. Prices in NZD.
        </p>
      </section>

      {/* ===== FOR NANNIES ===== */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            For Nannies
          </span>
          <h2 className="font-heading text-3xl text-foreground mb-2">Apply free, upgrade when you want</h2>
          <p className="text-sm text-muted-foreground">
            Registering and receiving enquiries is free. When you&apos;re ready, a one-off payment
            joins our vetted pool or the Premium pool — there&apos;s never a monthly nanny fee.
          </p>
        </div>

        <NannyTiers />

        <div className="flex items-center justify-center gap-3 mt-6 text-xs text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-badge-verified" aria-hidden="true" />
          One-off payments · no monthly fee · a 10% service fee applies to completed bookings
        </div>

        <div className="text-center mt-10">
          <Link href="/apply-as-nanny">
            <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/10">
              Apply as a Nanny <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
