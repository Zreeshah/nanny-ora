import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";
import { NANNY_TIERS } from "@/lib/tiers";

const nzd = (cents: number) => `NZ$${(cents / 100).toFixed(0)}`;

// Reads from NANNY_TIERS (the same data the product charges from) so public pricing
// can never drift from what nannies actually pay. Pure/presentational — safe to use
// in both server pages (pricing, how-it-works) and the client apply page.
const FREE = {
  id: "FREE",
  name: "Free — Basic",
  price: "Free",
  blurb: "Apply, get approved, and start receiving enquiries from local families — at no cost.",
  badge: null as string | null,
  features: [
    "Apply and build your profile",
    "Appear in the nanny directory",
    "Receive family enquiries",
    "Set your own hourly rate",
    "10% booking fee (from earnings)",
  ],
};

export function NannyTiers({ className = "" }: { className?: string }) {
  const columns = [
    FREE,
    ...NANNY_TIERS.map((t) => ({
      id: t.id,
      name: t.name,
      price: `${nzd(t.priceCents)} one-off`,
      blurb: t.blurb,
      badge: t.badge ?? null,
      features: t.features,
    })),
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch ${className}`}>
      {columns.map((c) => {
        const premium = c.id === "PREMIUM";
        return (
          <Card
            key={c.id}
            className={`flex flex-col p-6 rounded-3xl border ${
              premium ? "border-primary/40 bg-primary/[0.03]" : "border-border/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading text-lg font-bold text-foreground">{c.name}</h3>
              {c.badge && <Badge variant="premium" size="sm">{c.badge}</Badge>}
            </div>
            <div className="font-heading text-3xl text-foreground mb-1">{c.price}</div>
            <p className="text-xs text-muted-foreground mb-1">
              {c.id === "FREE" ? "always free" : "no monthly fee"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed my-4">{c.blurb}</p>
            <ul className="space-y-2 mt-auto">
              {c.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-foreground">
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
