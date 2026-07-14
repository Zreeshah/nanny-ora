import { BadgeCheck, ShieldCheck, HeartPulse, GraduationCap, Users, Brain, Moon, Baby } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Soft "Trusted by Auckland families" reassurance strip, placed directly under
 * the hero. Two rows: baseline checks (every carer) + advanced expertise (optional).
 * Minimal icons, warm background, no hard borders. Tokens only.
 */
const BASELINE = [
  { icon: BadgeCheck, label: "Verified IDs" },
  { icon: ShieldCheck, label: "Police Vetted" },
  { icon: Users, label: "Face-to-Face Interviewed" },
  { icon: HeartPulse, label: "First Aid Ready" },
];

const ADVANCED = [
  { icon: GraduationCap, label: "ECE Qualified Carers" },
  { icon: Brain, label: "Neurodiversity & Inclusive Practice" },
  { icon: Moon, label: "Baby Sleep Support" },
  { icon: Baby, label: "Maternity & Postnatal Care" },
];

function Row({ items, caption }: { items: typeof BASELINE; caption: string }) {
  return (
    <div className="mb-8 last:mb-0">
      <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-6">
        {caption}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
        {items.map(({ icon: Icon, label }) => (
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
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Row items={BASELINE} caption="Every NannyOra carer is" />
          <div className="my-8 h-px bg-border/40 max-w-xs mx-auto" aria-hidden="true" />
          <Row items={ADVANCED} caption="Looking for advanced educational expertise?" />
        </Reveal>
      </div>
    </section>
  );
}
