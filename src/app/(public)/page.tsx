import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { FaqGroups } from "@/components/FaqGroups";
import {
  Heart,
  Brain,
  GraduationCap,
  Award,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, faqSchema } from "@/lib/seo";
import { parentFaqs, nannyFaqs } from "@/lib/faq";
import { getPublicNannies } from "@/lib/data/nannies";
import { NannyCard } from "@/components/cards/NannyCard";
import InteractiveHero from "@/components/home/InteractiveHero";
import TrustStrip from "@/components/home/TrustStrip";
import TrustStandard from "@/components/home/TrustStandard";
import SpecialistExpertise from "@/components/home/SpecialistExpertise";
import DayInLife from "@/components/home/DayInLife";
import LifestyleGallery from "@/components/home/LifestyleGallery";
import BentoFeatures from "@/components/home/BentoFeatures";
import MarqueeTestimonials from "@/components/home/MarqueeTestimonials";
import { Reveal } from "@/components/ui/Reveal";
import { ShinyText } from "@/components/ui/ShinyText";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { pickImages } from "@/lib/images";

const homeSensoryImage = pickImages({ tags: ["sensory", "neurodiverse", "specialist"], count: 1, seed: "home-sensory" })[0];
const finalCtaImage = pickImages({ tags: ["family", "find", "trust", "care"], count: 1, seed: "home-final-cta" })[0];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "NannyOra — Trusted Nanny Care in Auckland" },
  description:
    "Explore Auckland nanny profiles with clear verification levels, relevant experience, and specialist childcare support for your family.",
};

const faqItems = [
  {
    question: "How are nannies verified on NannyOra?",
    answer:
      "NannyOra displays a verification level on every public profile so families can see what has been reviewed. A Listed profile is registered but may not yet have admin-verified documents. Higher levels can show completed identity, reference, qualification, First Aid and Police-vetting checks. Read the individual profile and its completed checks before shortlisting.",
  },
  {
    question: "What is a sensory-aware or specialist care nanny?",
    answer:
      "Some nanny profiles list specialist experience, such as sensory-aware care, ECE, autism or ADHD support. Read the individual profile, ask for concrete examples that are relevant to your child, and confirm any qualification or verification information shown before you decide whether the match is suitable.",
  },
  {
    question: "How much does it cost to use NannyOra?",
    answer:
      "Creating a family account and browsing public profiles is free. Parent membership unlocks features including messaging, full profiles, shortlisting, meet-and-greet requests, job posts and secure bookings. Nanny rates are set by individual nannies; see the current pricing page before joining.",
  },
  {
    question: "What areas does NannyOra cover?",
    answer:
      "Current public directory profiles are in greater Auckland. NannyOra also provides planning guides for Hamilton, Christchurch and Wellington; those guides do not promise local profile availability. Check the relevant directory page before you shortlist a nanny.",
  },
];

export default async function HomePage() {
  const featuredNannies = (await getPublicNannies())
    .filter((nanny) => (nanny.placementStatus || "AVAILABLE") === "AVAILABLE")
    .slice(0, 3);

  return (
    <div className="space-y-4 md:space-y-8">
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          faqSchema([...parentFaqs, ...nannyFaqs]),
        ]}
      />
      {/* ===== HERO SECTION ===== */}
      <InteractiveHero />

      {/* ===== TRUSTED-BY REASSURANCE STRIP ===== */}
      <TrustStrip />

      {/* ===== INTRO VIDEO (for parents) ===== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">
            How NannyOra works for <ShinyText>your family</ShinyText>
          </h2>
          <p className="text-sm text-muted-foreground">
            A one-minute look at how we vet nannies and match them to your family.
          </p>
        </div>
        <VideoPlayer
          src="/videos/for-parents.mp4"
          poster="/videos/for-parents-poster.jpg"
          title="NannyOra for parents — how it works"
          description="How Auckland families find and book verified, specialist nannies on NannyOra."
          uploadDate="2026-08-31"
          durationISO="PT1M9S"
        />
      </section>

      {/* ===== BENTO SPECIALIST CARE SECTION ===== */}
      <BentoFeatures />

      {/* ===== SIGNATURE 7-LAYER TRUST STANDARD ===== */}
      <TrustStandard />

      {/* ===== SPECIALIST EXPERTISE ===== */}
      <SpecialistExpertise />

      {/* ===== HOW NANNYORA WORKS ===== */}
      <section className="py-16 md:py-24 bg-secondary/35 border-y border-border/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span>Our Process</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              How <ShinyText>NannyOra</ShinyText> works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Private nanny placement, made simple. Four calm steps — no unnecessary bureaucracy.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Share your childcare needs", desc: "Tell us about your family, schedule, and any specialist care." },
              { title: "Review profiles with clarity", desc: "Compare relevant experience, visible verification levels, and the care details that matter to your family." },
              { title: "Meet & confirm your caregiver", desc: "Chat, meet, and choose the nanny who feels right for your home." },
              { title: "Begin care with ongoing support", desc: "Start care with continued support from the NannyOra team." },
            ].map((step, i) => (
              <div key={i} className="group relative bg-card border border-border/40 p-6 rounded-3xl hover:border-primary/20 hover:shadow-md transition-all duration-300">
                <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary text-primary font-bold text-xs flex items-center justify-center border border-border/25 group-hover:scale-105 transition-all">
                  {i + 1}
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2 pr-6 mt-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Optional support note — kept subtle, not a CTA */}
          <p className="text-center text-xs text-muted-foreground/80 mt-10 max-w-xl mx-auto">
            Some recurring care arrangements may qualify for additional support.{" "}
            <Link href="/childcare-support" className="font-semibold text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
              Explore childcare support options
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ===== SPECIALIST SENSORY-AWARE CHILDCARE ===== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left — Image */}
            <div className="md:col-span-5 relative w-full aspect-[4/3] md:aspect-[5/6] rounded-3xl overflow-hidden shadow-lg border border-border/20">
              <Image
                src={homeSensoryImage.src}
                alt={homeSensoryImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            {/* Right — Copy */}
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-badge-specialist text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Specialized Support</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-5 leading-[1.1]">
                Specialist sensory-aware childcare
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                Families can use profile information to identify experience that may be relevant to sensory needs, neurodiversity or a calm, structured routine. Discuss the child&apos;s individual support plan, the caregiver&apos;s practical experience and appropriate professional boundaries before making a decision.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, label: "Sensory-aware approaches", desc: "Ask how routines are adapted" },
                  { icon: Sparkles, label: "Autism & ADHD experience", desc: "Check the profile and examples" },
                  { icon: GraduationCap, label: "Relevant background", desc: "Confirm claimed qualifications" },
                  { icon: Heart, label: "Calm, structured settings", desc: "Agree the care plan together" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 items-start p-3 bg-secondary/20 rounded-2xl border border-border/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-badge-specialist flex items-center justify-center flex-shrink-0 border border-blue-100/30">
                      <item.icon className="w-4.5 h-4.5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/specialist-childcare-auckland">
                <Button variant="outline" size="md" className="rounded-full bg-white/40">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CURRENT AUCKLAND NANNY PROFILES ===== */}
      <section className="py-16 md:py-24 bg-secondary/15 border-t border-border/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Current <ShinyText>Auckland nanny profiles</ShinyText>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Browse current public profiles and compare the experience, availability and verification information each nanny has provided.
            </p>
          </div>

          {featuredNannies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNannies.map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto rounded-3xl border border-border/35 bg-card p-7 sm:p-9 text-center">
              <h3 className="font-heading text-2xl text-foreground">No public profiles are available to feature right now</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">You can still create a clear care brief and return to the directory when a suitable profile is available.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/find-a-nanny">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg">
                Browse all nannies
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== A DAY WITH A NANNYORA FAMILY ===== */}
      <DayInLife />

      {/* ===== LIFESTYLE GALLERY ===== */}
      <LifestyleGallery />

      {/* ===== SHORTLIST GUIDANCE ===== */}
      <MarqueeTestimonials />

      {/* ===== DUAL CTA — FOR FAMILIES / FOR NANNIES (asymmetric) ===== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6">
            {/* For families — warm beige, larger */}
            <div className="relative overflow-hidden md:col-span-3 bg-secondary rounded-[2rem] p-8 md:p-10 flex flex-col">
              <BorderBeam duration={14} colorFrom="var(--accent)" colorTo="var(--accent-light)" />
              <div className="w-11 h-11 rounded-2xl bg-accent/15 flex items-center justify-center mb-5">
                <Heart className="w-5 h-5 text-accent fill-accent" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2">For Auckland families</span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-5 leading-tight max-w-sm">
                Care that finally feels calm.
              </h3>
              <ul className="space-y-2.5 mb-8 max-w-sm">
                {[
                  "Compare displayed verification levels and profile details",
                  "Filter by location, care type and relevant experience",
                  "Use interviews, references and a paid trial to assess fit",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/75">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register-family" className="mt-auto">
                <Button variant="accent" size="lg" className="rounded-full shadow-sm shadow-accent/10">
                  Find your nanny
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {/* For nannies — muted sage, smaller */}
            <div className="relative overflow-hidden md:col-span-2 bg-emerald-50/70 rounded-[2rem] p-8 md:p-10 flex flex-col">
              <BorderBeam duration={14} colorFrom="var(--primary)" colorTo="var(--primary-light)" />
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Award className="w-5 h-5 text-primary fill-primary" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">For specialist nannies</span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-5 leading-tight">
                Do work you love.
              </h3>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Build a verified professional profile",
                  "Match with local families who value you",
                  "Set your own rates & availability",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/75">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/apply-as-nanny" className="mt-auto">
                <Button variant="primary" size="lg" className="rounded-full shadow-sm shadow-primary/10">
                  Apply now
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-24 bg-background border-t border-border/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground">
              Questions families ask
            </h2>
          </div>
          <Reveal>
            <Accordion items={faqItems} />
          </Reveal>
          <Reveal className="mt-10">
            <FaqGroups />
          </Reveal>
          <div className="text-center mt-8">
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors">
              More questions? See how NannyOra works
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA — EMOTIONAL, WITH PHOTOGRAPHY ===== */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl min-h-[380px] md:min-h-[440px] flex items-center">
            {/* Emotional background photography */}
            <Image
              src={finalCtaImage.src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/92 via-primary-dark/88 to-primary/92" />
            <BorderBeam size={340} duration={10} colorFrom="rgba(255,255,255,0.9)" colorTo="var(--accent-light)" />

            <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-16 md:py-20 flex flex-col items-center">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-[1.15] font-bold" style={{ color: "#FFFFFF" }}>
                Find someone your children will genuinely love.
              </h2>
              <p className="text-white/85 text-sm sm:text-base mb-8 max-w-md">
                Calm, trusted, specialist care — thoughtfully matched to your family across Auckland.
              </p>
              <Link href="/find-a-nanny">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0 shadow-lg font-semibold rounded-full px-8 py-3.5"
                >
                  Find your nanny
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
