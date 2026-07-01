import { Sun, Palette, Moon, Trees, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "A Day With a NannyOra Family" — a warm storytelling timeline that makes the
 * service feel real. Horizontal on desktop, vertical on mobile. Tokens only.
 */
const MOMENTS = [
  { time: "8:00", icon: Sun, title: "School prep", desc: "Calm mornings, breakfast, and a gentle drop-off." },
  { time: "10:00", icon: Palette, title: "Sensory play", desc: "Hands-on, soothing activities tuned to your child." },
  { time: "1:00", icon: Moon, title: "Nap routine", desc: "Predictable wind-downs that actually work." },
  { time: "3:00", icon: Trees, title: "Park walk", desc: "Fresh air, movement, and a change of scene." },
  { time: "6:00", icon: Sparkles, title: "Evening transition", desc: "A quiet handover into a peaceful evening." },
];

export default function DayInLife() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <span>A Day With NannyOra</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 leading-[1.1]">
            What a calm day looks like
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Gentle, predictable rhythm — the everyday routine your children can rely on.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal connector (desktop) */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {MOMENTS.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.time} delay={i * 90} direction="up">
                  <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-0">
                    <span className="relative z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-card shadow-sm text-primary md:mb-4">
                      <Icon className="w-6 h-6 stroke-[1.6]" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-accent tracking-wide">{m.time}</span>
                      <h3 className="font-heading text-base font-bold text-foreground mt-0.5 mb-1">{m.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[16rem]">{m.desc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
