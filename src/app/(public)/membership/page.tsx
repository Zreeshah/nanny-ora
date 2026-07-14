import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { MEMBERSHIP_PLANS, MEMBERSHIP_BENEFITS, planSavingsCents, formatNzd, getMembership } from "@/lib/membership";
import { configuredProviders } from "@/lib/payments";
import { PlanCards } from "./PlanCards";
import { ShinyText } from "@/components/ui/ShinyText";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Membership — Unlock Verified Auckland Nannies",
  description:
    "Become a NannyOra member to message verified nannies, shortlist favourites, request meet-and-greets, post jobs and make secure bookings. From NZ$39/month.",
};

export default async function MembershipPage() {
  const session = await auth();
  const { isMember } = await getMembership();

  // Plans are computed server-side so the page, checkout and dashboard can never drift.
  const plans = MEMBERSHIP_PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    price: formatNzd(p.priceCents),
    perMonth: formatNzd(Math.round(p.priceCents / p.months)),
    months: p.months,
    badge: p.badge ?? null,
    blurb: p.blurb,
    savings: planSavingsCents(p) > 0 ? formatNzd(planSavingsCents(p)) : null,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Membership</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-5 leading-tight">
          Unlock <ShinyText>verified nannies</ShinyText>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          NannyOra isn&apos;t an open marketplace. Every nanny completes our full compliance
          process before they appear. Membership gives you direct access to them.
        </p>
      </div>

      <PlanCards
        plans={plans}
        benefits={MEMBERSHIP_BENEFITS}
        providers={configuredProviders()}
        signedIn={Boolean(session?.user?.id)}
        alreadyMember={isMember}
      />

      <p className="text-center text-xs text-muted-foreground mt-10 max-w-md mx-auto leading-relaxed">
        Cancel anytime — you keep access until the end of your paid period. Prices in NZD and
        include GST. Browsing nanny profiles is always free.
      </p>
    </div>
  );
}
