import Link from "next/link";
import {
  Fingerprint, Video, PhoneCall, ShieldCheck, GraduationCap, CalendarCheck, Heart, Sparkles, ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "The NannyOra Trust Standard" — a signature 7-layer verification timeline.
 * Soft cards on a calm vertical connector, staggered reveal. Emotionally-visible
 * trust asset. Tokens only, no new colours.
 */
const LAYERS = [
  { icon: Fingerprint, title: "Identity Verification", desc: "Government photo ID checked and confirmed before anything else." },
  { icon: Video, title: "Video or In-Person Interview", desc: "A real conversation to understand character, warmth, and approach." },
  { icon: PhoneCall, title: "Reference Calls", desc: "We personally call previous families and employers — no forms alone." },
  { icon: ShieldCheck, title: "Police Vetting", desc: "NZ Police vetting under the Children's Act 2014 for every carer." },
  { icon: GraduationCap, title: "Qualification Review", desc: "First aid readiness assessed — carers receive baseline induction and gain certification within 4 months. Any ECE, teaching, or specialist certificates verified against issuing bodies." },
  { icon: CalendarCheck, title: "Trial Session", desc: "A short paid trial so you see the fit with your children first-hand." },
  { icon: Heart, title: "Parent Feedback Monitoring", desc: "Ongoing family feedback keeps standards high, long after matching." },
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
            Our 7-layer safety check
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Trust is everything in childcare. Before a carer ever meets your family, they pass through seven calm, thorough layers of verification.
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
            See exactly how each check protects your family
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
