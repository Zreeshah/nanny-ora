import Link from "next/link";
import { Baby, Brain, Sparkles, Clock, BookOpen, Languages, Moon, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Specialist Expertise" — what sets NannyOra apart from generic nannying.
 * Calm, soft-tinted expertise cards (tokens/existing tints only). Doubles as
 * SEO surface, linking to the relevant landing pages where they exist.
 */
const EXPERTISE = [
  { icon: Baby, title: "Newborn Care", desc: "Gentle routines for the first precious months.", tint: "bg-amber-50 text-amber-600", href: "/find-a-nanny" },
  { icon: Brain, title: "ADHD Support", desc: "Structure and calm for busy, brilliant minds.", tint: "bg-teal-50 text-teal-600", href: "/neurodiverse-childcare-auckland" },
  { icon: Sparkles, title: "Autism Support", desc: "Sensory-aware, predictable, comforting care.", tint: "bg-blue-50 text-blue-600", href: "/sensory-aware-nanny-auckland" },
  { icon: Clock, title: "After-School Care", desc: "Warm pick-ups, homework help, and downtime.", tint: "bg-emerald-50 text-emerald-600", href: "/find-a-nanny" },
  { icon: BookOpen, title: "Montessori Learning", desc: "Play-led, independence-building activities.", tint: "bg-amber-50 text-amber-600", href: "/ece-nanny-auckland" },
  { icon: Languages, title: "Bilingual Care", desc: "Everyday language woven into gentle play.", tint: "bg-teal-50 text-teal-600", href: "/find-a-nanny" },
  { icon: Moon, title: "Overnight Care", desc: "Calm bedtimes and reassuring night support.", tint: "bg-blue-50 text-blue-600", href: "/find-a-nanny" },
  { icon: Users, title: "Twins & Multiples", desc: "Experienced hands for double the love.", tint: "bg-emerald-50 text-emerald-600", href: "/find-a-nanny" },
];

export default function SpecialistExpertise() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <span>Specialist Expertise</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 leading-[1.1]">
            Care shaped around your child
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Not generic babysitting — specialist Auckland nannies matched to exactly the support your family needs.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {EXPERTISE.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(i % 4) * 70} direction="up">
                <Link
                  href={item.href}
                  className="group block h-full bg-card rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  <span className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4 ${item.tint} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-5.5 h-5.5 stroke-[1.7]" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
