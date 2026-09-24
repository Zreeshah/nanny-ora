import Link from "next/link";
import {
  Fingerprint, Video, PhoneCall, ShieldCheck, GraduationCap, CalendarCheck, Heart, Sparkles, ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "The NannyOra Trust Standard" — seven practical checks families can use when
 * assessing a profile. The completed checks are always shown by the profile's
 * individual verification level.
 */
const LAYERS = [
  { icon: Fingerprint, title: "Identity evidence", desc: "For profiles whose level shows identity verified, NannyOra has reviewed government photo ID." },
  { icon: Video, title: "Meet and interview", desc: "A conversation helps you assess communication, warmth and approach to care before making a decision." },
  { icon: PhoneCall, title: "Reference checks", desc: "Where reference checks are shown as complete, ask how the referee knew the nanny and what care they observed." },
  { icon: ShieldCheck, title: "Police vetting", desc: "Police-vetting or safety-check review is shown on Premium Vetted and Specialist Care profiles, not on every listed profile." },
  { icon: GraduationCap, title: "Qualifications and First Aid", desc: "Check the profile for credentials marked as verified, and discuss the experience most relevant to your child." },
  { icon: CalendarCheck, title: "A paid trial", desc: "A short paid trial can help your family see whether the routine, communication and fit feel right." },
  { icon: Heart, title: "Ongoing check-ins", desc: "Keep discussing routines, safety information and any concerns as the arrangement develops." },
];

export default function TrustStandard() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/25">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The NannyOra Trust Standard</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-5 leading-[1.1]">
            Safer hiring, profile by profile
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Trust is everything in childcare. NannyOra shows a verification level on each profile, so you can see what has been reviewed. Listed profiles are registered but may not have admin-verified documents; higher levels show more completed checks.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-2 sm:pl-0">
          {/* Connector line */}
          <div
            className="absolute left-[27px] sm:left-[31px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-primary/20 to-transparent"
            aria-hidden="true"
          />
          <ol className="space-y-5 md:space-y-6">
            {LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <li key={layer.title}>
                  <Reveal delay={i * 70} direction="up">
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Node */}
                      <div className="relative z-10 flex-shrink-0">
                        <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-card shadow-sm text-primary">
                          <Icon className="w-6 h-6 stroke-[1.6]" aria-hidden="true" />
                        </span>
                        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center shadow-sm">
                          {i + 1}
                        </span>
                      </div>
                      {/* Card */}
                      <div className="flex-1 bg-card/70 rounded-3xl p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-card">
                        <h3 className="font-heading text-lg font-bold text-foreground mb-1.5">
                          {layer.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {layer.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="text-center mt-12">
          <Link href="/verification-process" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
            See verification levels and what they mean
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
