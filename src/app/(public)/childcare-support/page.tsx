import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LifeBuoy, ShieldCheck, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Childcare Support Options — NannyOra",
  description:
    "Some recurring or full-time home-based care arrangements may qualify for additional childcare support. Eligibility is assessed privately by the NannyOra team.",
};

const points = [
  {
    icon: Clock,
    title: "For recurring or full-time care",
    desc: "Some families arranging ongoing or full-time home-based care may qualify for additional support toward their arrangement.",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility depends on your household",
    desc: "Whether support applies depends on your household circumstances and the current rules that govern this kind of assistance.",
  },
  {
    icon: MessageCircle,
    title: "Assessed privately by our team",
    desc: "There are no forms to chase or portals to navigate. If you're curious, we quietly assess eligibility for you as part of your placement.",
  },
];

export default function ChildcareSupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Soft header — informational, not promotional */}
      <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/15">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Optional Support</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-5 leading-tight">
          Childcare support options
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          NannyOra is a private nanny placement service first. For select qualifying families,
          there may also be optional pathways to additional childcare support — offered quietly,
          as concierge-style guidance rather than a headline.
        </p>
      </div>

      {/* Quiet informational cards */}
      <div className="space-y-4 mb-14">
        {points.map((p) => (
          <div
            key={p.title}
            className="flex items-start gap-4 bg-secondary/25 border border-border/25 rounded-3xl p-6"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <p.icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-base font-bold text-foreground mb-1">{p.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gentle, low-key next step — no aggressive subsidy CTA */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
          Available for select qualifying families. The simplest way to find out is to start a
          placement — we'll let you know privately if any support pathways may apply.
        </p>
        <Link href="/register-family">
          <Button variant="outline" size="lg" className="rounded-full bg-white/40">
            Start your placement
          </Button>
        </Link>
      </div>
    </div>
  );
}
