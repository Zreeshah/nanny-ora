import { BadgeCheck, ShieldCheck, HeartPulse, GraduationCap, PhoneCall, Users, Brain } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Soft "Trusted by Auckland families" reassurance strip, placed directly under
 * the hero. Minimal icons, warm background, no hard borders — removes anxiety
 * up front without adding dense text. Colours use existing tokens only.
 */
const CHECKS = [
  { icon: BadgeCheck, label: "Verified IDs" },
  { icon: ShieldCheck, label: "Police Vetting" },
  { icon: HeartPulse, label: "First Aid" },
  { icon: GraduationCap, label: "ECE Qualified" },
  { icon: PhoneCall, label: "Reference Checked" },
  { icon: Users, label: "Face-to-Face Interview" },
  { icon: Brain, label: "Sensory-Aware Care" },
];

export default function TrustStrip() {
  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-8">
            Every NannyOra carer is
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
            {CHECKS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2.5 w-24 text-center group">
                <span className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center text-primary shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold text-foreground/80 leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
