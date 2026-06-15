import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "NannyOra pricing — free for families to browse. Nanny applications are free. Premium features coming soon.",
};

// Phase 2: Stripe membership and Stripe Connect booking payments will be added here.

const plans = [
  {
    name: "Parent Account",
    price: "Free",
    period: "",
    description: "Browse verified nannies, send enquiries, and post jobs.",
    features: [
      "Create a family profile",
      "Browse the nanny directory",
      "View nanny profiles",
      "Send enquiries",
      "Post childcare jobs",
      "Filter by specialist care",
    ],
    cta: "Register Free",
    ctaHref: "/register-family",
    variant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Premium Family",
    price: "$19",
    period: "/month",
    description: "Priority matching, instant messaging, and exclusive nannies.",
    features: [
      "Everything in Free",
      "Priority enquiry responses",
      "Direct messaging with nannies",
      "Access to premium-only nannies",
      "Booking management tools",
      "Priority support",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    variant: "accent" as const,
    highlighted: true,
    comingSoon: true,
  },
  {
    name: "Nanny Application",
    price: "Free",
    period: "",
    description: "Apply, build your profile, and connect with local families.",
    features: [
      "Apply to join NannyOra",
      "Build a verified profile",
      "Set your own hourly rate",
      "Receive family enquiries",
      "Showcase specialist skills",
      "Earn verification badges",
    ],
    cta: "Apply Now",
    ctaHref: "/apply-as-nanny",
    variant: "outline" as const,
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          NannyOra is free to use for families and nannies. Premium features are on the way.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col relative border border-border/40 ${
              plan.highlighted ? "border-accent/50 shadow-md ring-4 ring-accent/5" : ""
            }`}
          >
            {plan.comingSoon && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="premium" size="md">Coming Soon</Badge>
              </div>
            )}

            <div className="mb-6">
              <h2 className="font-heading text-lg mb-2 text-foreground font-bold">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-heading text-4xl text-foreground">{plan.price}</span>
                {plan.period && <span className="text-sm font-semibold text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs">
                  <Check className="w-4 h-4 text-badge-verified flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href={plan.ctaHref} className="mt-auto">
              <Button
                variant={plan.variant}
                fullWidth
                disabled={plan.comingSoon}
                className="rounded-full"
              >
                {plan.cta}
                {!plan.comingSoon && <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />}
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* Agency Placement */}
      <Card className="text-center bg-secondary/30 border border-border/20 rounded-3xl p-8">
        <h2 className="font-heading text-2xl text-foreground mb-2">Agency Placement Service</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto leading-relaxed">
          Need help finding the perfect nanny? Our team can provide a curated shortlist and hands-on matching support.
        </p>
        <Link href="/register-family">
          <Button variant="primary" className="rounded-full shadow-md">
            Contact Us <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
