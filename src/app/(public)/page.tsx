import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import {
  Shield,
  Heart,
  Star,
  Users,
  Brain,
  GraduationCap,
  Award,
  MapPin,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { formatRate } from "@/lib/utils";
import InteractiveHero from "@/components/home/InteractiveHero";
import BentoFeatures from "@/components/home/BentoFeatures";
import MarqueeTestimonials from "@/components/home/MarqueeTestimonials";
import { ImageBand } from "@/components/ui/ImageBand";
import { Reveal } from "@/components/ui/Reveal";
import { ShinyText } from "@/components/ui/ShinyText";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { pickImages } from "@/lib/images";

const homeSensoryImage = pickImages({ tags: ["sensory", "neurodiverse", "specialist"], count: 1, seed: "home-sensory" })[0];

export const metadata: Metadata = {
  title: "NannyOra — Trusted Nanny Care for Auckland Families",
  description:
    "Find trusted, specialist nannies in Auckland — including sensory-aware, ECE, and highly experienced childcare support. Verified local nannies for your family.",
};

// Featured nannies with Pexels profile images
const featuredNannies = [
  {
    id: "nanny-001",
    name: "Sarah M.",
    suburb: "Remuera",
    hourlyRate: 35,
    yearsExperience: 8,
    bio: "Passionate early childhood educator with 8+ years caring for children of all ages.",
    verificationLevel: "VERIFIED" as const,
    specialistTags: ["ECE Background", "Baby Experience"],
    imageUrl: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "nanny-002",
    name: "Emma T.",
    suburb: "Ponsonby",
    hourlyRate: 42,
    yearsExperience: 12,
    bio: "Registered teacher with specialist training in sensory-aware childcare.",
    verificationLevel: "SPECIALIST" as const,
    specialistTags: ["Sensory-Aware", "Registered Teacher"],
    imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  },
  {
    id: "nanny-003",
    name: "Mia J.",
    suburb: "Devonport",
    hourlyRate: 30,
    yearsExperience: 5,
    bio: "Warm nanny who loves outdoor activities and creative play. First aid certified.",
    verificationLevel: "PREMIUM_VETTED" as const,
    specialistTags: ["First Aid", "After-School"],
    imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  },
];

const faqItems = [
  {
    question: "How are nannies verified on NannyOra?",
    answer:
      "All nannies go through a multi-step review process. We check references, review qualifications, and verify identity documents. Our verification levels range from Listed to Specialist Care Nanny, so you can see exactly what checks have been completed.",
  },
  {
    question: "What is a sensory-aware or specialist care nanny?",
    answer:
      "These are nannies with specific training and experience supporting children who may be neurodiverse, have sensory processing needs, or benefit from a calm, structured care environment. They may include registered teachers, early intervention professionals, and carers with autism or ADHD support experience.",
  },
  {
    question: "How much does it cost to use NannyOra?",
    answer:
      "Creating a parent account and browsing nanny profiles is free. Nanny rates are set by each individual nanny and are shown on their profile. We're working on premium features for the future, but the core platform is free for families.",
  },
  {
    question: "What areas does NannyOra cover?",
    answer:
      "NannyOra currently serves the greater Auckland area, including suburbs like Remuera, Ponsonby, Grey Lynn, Devonport, Takapuna, Epsom, Mount Eden, and more. We're expanding across Auckland and plan to serve other NZ cities in the future.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-4 md:space-y-8">
      {/* ===== HERO SECTION ===== */}
      <InteractiveHero />

      {/* ===== BENTO SPECIALIST CARE SECTION ===== */}
      <BentoFeatures />

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
              Find qualified, specialist childcare in Auckland with eight simple, high-trust steps.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Create family profile", desc: "Share details about your children and schedules." },
              { title: "Tell us what you need", desc: "Detail any specialist care, ECE, or school pick-ups." },
              { title: "Browse local nannies", desc: "Filter checked profiles in your Auckland suburb." },
              { title: "Review nanny profiles", desc: "See verification checks, experience levels, and rates." },
              { title: "Send enquiries or post jobs", desc: "Connect directly or invite applicants to apply." },
              { title: "Connect & meet", desc: "Conduct initial video chats or in-person coffee meets." },
              { title: "Book a trial session", desc: "Run a short paid trial to verify children-nanny fit." },
              { title: "Arrange ongoing care", desc: "Set schedules and rates directly with the carer." },
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
        </div>
      </section>

      {/* ===== REAL CARE ACROSS AUCKLAND — PHOTO BAND ===== */}
      <section className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageBand
            tags={["find", "family", "professional", "care", "suburb"]}
            seed="home-collage"
            count={3}
            aspect="aspect-[4/3]"
          />
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
                Families with neurodiverse children or those with sensory processing needs deserve carers who truly understand. Our specialist nannies bring trained, lived experience to support your children in a calm, comforting, and structured environment.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Brain, label: "Sensory-aware approaches", desc: "Trained in sensory regulation" },
                  { icon: Sparkles, label: "Autism & ADHD experience", desc: "Support for neurodiverse kids" },
                  { icon: GraduationCap, label: "Early intervention support", desc: "Developmental milestone focus" },
                  { icon: Heart, label: "Calm, structured settings", desc: "Stable care and routines" },
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

      {/* ===== FEATURED AUCKLAND NANNIES ===== */}
      <section className="py-16 md:py-24 bg-secondary/15 border-t border-border/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Featured <ShinyText>Auckland nannies</ShinyText>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Meet some of the trusted, verified carers in our Auckland community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNannies.map((nanny, i) => (
              <Card key={nanny.id} hover padding="none" className="relative overflow-hidden bg-card border border-border/40">
                <BorderBeam duration={14} delay={i * 4} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    {/* Circular profile photo */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-border bg-muted">
                      <Image
                        src={nanny.imageUrl}
                        alt={nanny.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="font-semibold text-foreground text-base tracking-tight">{nanny.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        <span>{nanny.suburb}</span>
                      </div>
                      <VerificationBadge level={nanny.verificationLevel} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-4 p-2.5 bg-secondary/30 rounded-xl border border-border/20">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      {nanny.yearsExperience}+ years exp
                    </span>
                    <span className="font-bold text-primary">{formatRate(nanny.hourlyRate)}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 min-h-[48px]">
                    {nanny.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {nanny.specialistTags.map((tag) => (
                      <Badge key={tag} variant="specialist" size="sm">{tag}</Badge>
                    ))}
                  </div>

                  <Link href={`/nannies/${nanny.id}`}>
                    <Button variant="outline" fullWidth size="sm" className="rounded-full">
                      View profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

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

      {/* ===== TESTIMONIALS MARQUEE ===== */}
      <MarqueeTestimonials />

      {/* ===== DUAL CTA — FOR FAMILIES / FOR NANNIES ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For families */}
            <Card className="relative overflow-hidden border-t-4 border-t-accent hover:border-accent/40 bg-card rounded-3xl p-6.5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <BorderBeam duration={12} colorFrom="var(--accent)" colorTo="var(--accent-light)" />
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="w-4.5 h-4.5 text-accent fill-accent" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">For Auckland families</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Search verified, local nannies by suburb",
                  "Filter by specialist skills & ECE support",
                  "View full profiles with check status",
                  "Post a job and receive direct applications",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Link href="/register-family">
                  <Button variant="accent" size="md" className="rounded-full shadow-sm shadow-accent/10">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* For nannies */}
            <Card className="relative overflow-hidden border-t-4 border-t-primary hover:border-primary/40 bg-card rounded-3xl p-6.5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <BorderBeam duration={12} colorFrom="var(--primary)" colorTo="var(--primary-light)" />
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-4.5 h-4.5 text-primary fill-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">For specialist nannies</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Create a verified professional carer profile",
                  "Highlight ECE skills, training, & certifications",
                  "Get matched with local Auckland families",
                  "Set your own rates and availability schedules",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Link href="/apply-as-nanny">
                  <Button variant="primary" size="md" className="rounded-full shadow-sm shadow-primary/10">
                    Apply now
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Card>
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
        </div>
      </section>

      {/* ===== FINAL CTA BANNER ===== */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary via-primary-dark to-primary rounded-3xl p-10 md:p-14 text-center text-primary-foreground relative overflow-hidden shadow-xl">
            <BorderBeam size={300} duration={10} colorFrom="rgba(255,255,255,0.9)" colorTo="var(--accent-light)" />
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full filter blur-xl pointer-events-none translate-x-12 -translate-y-12" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full filter blur-lg pointer-events-none -translate-x-8 translate-y-8" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="font-heading text-3xl sm:text-4xl mb-4 leading-tight">
                Ready to find calm, trusted care?
              </h2>
              <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md">
                Join Auckland families who&apos;ve found their perfect specialist or ECE nanny through NannyOra.
              </p>
              <Link href="/find-a-nanny">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 hover:-translate-y-0.5 active:translate-y-0 shadow-lg font-semibold rounded-full px-8 py-3.5"
                >
                  Get started today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
