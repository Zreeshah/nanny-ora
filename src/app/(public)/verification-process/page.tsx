import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageBand } from "@/components/ui/ImageBand";
import { Reveal } from "@/components/ui/Reveal";
import { ShinyText } from "@/components/ui/ShinyText";
import StatsTicker from "@/components/home/StatsTicker";
import {
  Fingerprint, Video, PhoneCall, ShieldCheck, GraduationCap, CalendarCheck,
  Heart, ArrowRight, Check, Lock, Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Verification Process — How NannyOra Vets Every Nanny",
  description:
    "See exactly how NannyOra verifies every Auckland nanny: identity, interviews, reference calls, NZ Police vetting, qualifications, trial sessions, and ongoing feedback — and how each step protects your family.",
};

const METRICS = [
  { value: 7, suffix: "", label: "Verification layers" },
  { value: 100, suffix: "%", label: "Identity-checked carers" },
  { value: 2, suffix: "+", label: "References personally called" },
];

const CHECKS = [
  {
    icon: Fingerprint,
    title: "Identity Verification",
    what: "Government photo ID — passport or driver licence — is reviewed and matched to the person.",
    why: "Confirms the nanny is exactly who they claim to be. It's the foundation every other check builds on.",
    protects: "No fake or borrowed identities ever reach your family.",
  },
  {
    icon: Video,
    title: "Face-to-Face Interview",
    what: "A video or in-person interview assessing character, warmth, communication, and approach to care.",
    why: "Certificates don't show temperament — a real conversation does.",
    protects: "You only meet carers who present as calm, genuine, and child-focused.",
  },
  {
    icon: PhoneCall,
    title: "Reference Calls",
    what: "We personally phone previous families and employers — never relying on written forms alone.",
    why: "Real people describe real behaviour over months, not a one-line note.",
    protects: "Patterns of reliability — or red flags — surface before you ever meet.",
  },
  {
    icon: ShieldCheck,
    title: "NZ Police Vetting",
    what: "A New Zealand Police vet under the Children's Act 2014, obtained by NannyOra for every carer. Each service must obtain its own report — vets from other employers cannot be shared.",
    why: "It's the legal safeguarding standard for anyone working with children in NZ.",
    protects: "Serious history is caught by the same check schools and ECE centres use.",
  },
  {
    icon: GraduationCap,
    title: "Qualification Review",
    what: "First aid readiness assessed at induction — carers gain full certification within 4 months. Any ECE, teaching, or specialist certificates verified against issuing bodies.",
    why: "Anyone can list a qualification — we confirm it's real and current.",
    protects: "Specialist and ECE claims on a profile are verified, not assumed.",
  },
  {
    icon: CalendarCheck,
    title: "Trial Session",
    what: "A short, paid trial so you watch the nanny with your children before committing.",
    why: "The only test that truly matters is how your child actually responds.",
    protects: "You confirm the fit first-hand — no long-term commitment on trust alone.",
  },
  {
    icon: Heart,
    title: "Ongoing Feedback",
    what: "Family feedback is monitored after matching, and profiles reflect current standing.",
    why: "Trust isn't a one-time gate — it's maintained over time.",
    protects: "Standards stay high long after the first booking.",
  },
];

export default function VerificationProcessPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 border border-primary/20">
            <ShieldCheck className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The NannyOra Trust Standard</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            How we verify <ShinyText>every nanny</ShinyText>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Trust is everything in childcare. Here is exactly how every Auckland carer is checked before they meet your family — and how each step protects you.
          </p>
        </div>

        <ImageBand
          tags={["trust", "safety", "vetting", "verified"]}
          seed="verification-process"
          aspect="aspect-[16/7]"
          priority
          className="mb-14"
        />

        {/* Trust metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-card rounded-3xl p-6 text-center shadow-sm">
              <div className="font-heading text-3xl sm:text-4xl text-primary font-bold">
                <StatsTicker value={m.value} suffix={m.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 leading-tight">{m.label}</div>
            </div>
          ))}
          <div className="bg-primary rounded-3xl p-6 text-center shadow-sm flex flex-col justify-center">
            <div className="font-heading text-lg sm:text-xl text-primary-foreground font-bold leading-tight">
              Children&apos;s Act 2014
            </div>
            <div className="text-xs text-white/70 mt-1.5">Trusted vetting standard</div>
          </div>
        </div>

        {/* Process diagram — the 7 layers at a glance */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground text-center mb-10">
            The 7-layer process
          </h2>
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
            <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-2">
              {CHECKS.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.title} className="flex flex-col items-center text-center">
                    <span className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-card shadow-sm text-primary mb-3">
                      <Icon className="w-6 h-6 stroke-[1.6]" aria-hidden="true" />
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight px-1">{c.title}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Detailed checks — what / why it matters / how you're protected */}
        <div className="space-y-6">
          {CHECKS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={(i % 2) * 60} direction="up">
                <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4 mb-5">
                    <span className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-primary">
                      <Icon className="w-6 h-6 stroke-[1.6]" aria-hidden="true" />
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-accent-foreground text-[11px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                    </span>
                    <div className="pt-1">
                      <h3 className="font-heading text-xl font-bold text-foreground">{c.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{c.what}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:pl-18">
                    <div className="bg-secondary/40 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Why it matters
                      </div>
                      <p className="text-sm text-foreground/75 leading-relaxed">{c.why}</p>
                    </div>
                    <div className="bg-emerald-50/60 rounded-2xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" /> How you&apos;re protected
                      </div>
                      <p className="text-sm text-foreground/75 leading-relaxed">{c.protects}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Your role */}
        <div className="mt-20 bg-secondary/40 rounded-[2rem] p-8 md:p-10">
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-3">Your role matters too</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            We verify credentials and history — but the final decision is always yours. We recommend every family:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              "Meet by video or coffee before hiring",
              "Book a short paid trial to watch the fit first-hand",
              "Review original certificates together on your first meet",
              "Listen to your children and trust your instincts",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/75">
                <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-4">
            Verified carers, ready to meet your family
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/find-a-nanny">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg">
                Browse verified nannies
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/trust-and-safety">
              <Button variant="outline" size="lg" className="rounded-full">
                Trust &amp; safety details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
