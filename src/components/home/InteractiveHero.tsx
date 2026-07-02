"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, GraduationCap, Heart, Star, Users, Brain, BadgeCheck } from "lucide-react";
import StatsTicker from "./StatsTicker";
import { ShinyText } from "@/components/ui/ShinyText";
import { pickImages } from "@/lib/images";

const heroImages = pickImages({
  tags: ["care", "family", "trust", "professional"],
  count: 2,
  seed: "home-hero-collage",
});

export default function InteractiveHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger staggered animations on mount
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/10 to-muted/40 py-16 md:py-28 min-h-[85vh] flex items-center">
      {/* ===== Organic Morphed Blobs representing Nanny, Baby & Parent (Liquid Merging) ===== */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none filter blur-2xl md:blur-3xl">
        {/* Blob 1: Parent (Warm Peach/Coral) */}
        <div 
          className="absolute top-[10%] left-[5%] md:left-[15%] w-72 h-72 md:w-96 md:h-96 bg-accent/25 animate-morph-blob-1 animate-float-slow"
          style={{ transformOrigin: "center" }}
        />
        {/* Blob 2: Baby (Soft Muted Sage) */}
        <div 
          className="absolute top-[30%] left-[25%] md:left-[35%] w-64 h-64 md:w-80 md:h-80 bg-primary/20 animate-morph-blob-2 animate-float-medium"
          style={{ transformOrigin: "center" }}
        />
        {/* Blob 3: Nanny (Warm Pastel Yellow/Cream) */}
        <div 
          className="absolute top-[15%] left-[45%] md:left-[55%] w-80 h-80 md:w-[450px] md:h-[450px] bg-badge-premium/15 animate-morph-blob-3 animate-float-slow"
          style={{ transformOrigin: "center" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Left Side: Staggered Content */}
          <div className="md:col-span-7 flex flex-col text-left">
            {/* Tagline */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/40 text-primary text-xs font-bold tracking-wider uppercase mb-6 w-fit transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-primary" />
              <span>Private Nanny Placement</span>
            </div>

            {/* Main Headline */}
            <h1 
              className={`font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.08] mb-6 transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Trusted nanny care <br />
              for <ShinyText>Auckland families</ShinyText>
            </h1>

            {/* Subtext */}
            <p 
              className={`text-muted-foreground text-base sm:text-lg mb-8 max-w-lg leading-relaxed transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Premium, agency-verified nannies for flexible home-based care — matched privately to your family. Streamlined onboarding, ECE educators, and calm sensory-aware support, without the bureaucracy.
            </p>

            {/* Action Buttons */}
            <div 
              className={`flex flex-wrap items-center gap-4 mb-10 transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <Link href="/find-a-nanny">
                <Button variant="accent" size="lg" className="rounded-full shadow-lg">
                  Find a Nanny
                </Button>
              </Link>
              <Link href="/apply-as-nanny">
                <Button variant="outline" size="lg" className="rounded-full bg-white/40">
                  Become a Nanny
                </Button>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div 
              className={`flex items-center gap-6 text-xs text-muted-foreground transition-all duration-700 delay-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-foreground leading-none">
                    <StatsTicker value={100} suffix="+" />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Families Vouched</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-foreground leading-none">100%</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Vetted Standards</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-bold text-foreground leading-none">
                    <StatsTicker value={49} suffix=" / 10" duration={1500} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Parent Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Layered photo collage with floating trust badges */}
          <div className="md:col-span-5 relative h-[440px] sm:h-[520px] md:h-[560px] w-full">
            {/* Main portrait photo */}
            <div
              className={`absolute top-4 right-2 md:right-4 w-[66%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-white/60 rotate-[2deg] transition-all duration-1000 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Image
                src={heroImages[0].src}
                alt={heroImages[0].alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>

            {/* Secondary square photo */}
            <div
              className={`absolute bottom-2 left-0 md:left-2 w-[50%] aspect-square rounded-[1.75rem] overflow-hidden shadow-lg ring-1 ring-white/60 -rotate-[3deg] transition-all duration-1000 delay-150 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Image
                src={heroImages[1].src}
                alt={heroImages[1].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 24vw"
              />
            </div>

            {/* Floating badge: Police Checked */}
            <div className={`absolute top-[9%] left-[1%] z-20 animate-float-slow transition-all duration-1000 delay-[500ms] ease-out ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="bg-card/95 backdrop-blur rounded-2xl shadow-lg px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5" /></span>
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-none">Police Checked</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Children&apos;s Act 2014</p>
                </div>
              </div>
            </div>

            {/* Floating badge: ECE Qualified */}
            <div className={`absolute top-[45%] right-[-3%] z-20 animate-float-medium transition-all duration-1000 delay-[640ms] ease-out ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="bg-card/95 backdrop-blur rounded-2xl shadow-lg px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><GraduationCap className="w-4.5 h-4.5" /></span>
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-none">ECE Qualified</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Registered educators</p>
                </div>
              </div>
            </div>

            {/* Floating badge: ADHD-Aware */}
            <div className={`absolute bottom-[7%] right-[12%] z-20 animate-float-slow transition-all duration-1000 delay-[760ms] ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="bg-card/95 backdrop-blur rounded-2xl shadow-lg px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><Brain className="w-4.5 h-4.5" /></span>
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-none">ADHD-Aware</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Sensory-trained care</p>
                </div>
              </div>
            </div>

            {/* Floating pill: 7-Step Verified */}
            <div className={`absolute top-[-1%] right-[24%] z-20 animate-float-medium transition-all duration-1000 delay-[880ms] ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
              <div className="bg-primary text-primary-foreground rounded-full shadow-lg px-3.5 py-1.5 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold">7-Step Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
