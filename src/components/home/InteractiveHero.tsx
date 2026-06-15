"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, GraduationCap, Sparkles, Heart, Star, Users } from "lucide-react";
import StatsTicker from "./StatsTicker";

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
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left Side: Staggered Content */}
          <div className="md:col-span-7 flex flex-col text-left">
            {/* Tagline */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/40 text-primary text-xs font-bold tracking-wider uppercase mb-6 w-fit transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-primary" />
              <span>Nanny Care Perfected</span>
            </div>

            {/* Main Headline */}
            <h1 
              className={`font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.08] mb-6 transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Trusted nanny care <br />
              for Auckland families
            </h1>

            {/* Subtext */}
            <p 
              className={`text-muted-foreground text-base sm:text-lg mb-8 max-w-lg leading-relaxed transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              Find qualified, highly vetted Auckland nannies. We specialize in ECE educators and supportive, sensory-aware care for neurodiverse children.
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

          {/* Right Side: Interactive Floating Cards Block */}
          <div className="md:col-span-5 relative h-[380px] md:h-[450px] w-full flex items-center justify-center">
            {/* Visual Center Circle (Mother-Child symbol) */}
            <div 
              className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-secondary border-2 border-border/30 flex items-center justify-center shadow-lg transition-all duration-1000 delay-200 ease-out z-10 ${
                mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-primary/5 flex flex-col items-center justify-center text-center p-3">
                <Heart className="w-8 h-8 text-primary animate-pulse stroke-[1.5]" />
                <span className="font-heading text-xs text-foreground mt-2 font-bold leading-tight">Vetted & Safe</span>
              </div>
            </div>

            {/* Floating Card 1: Vetting (Upper Left) */}
            <div 
              className={`absolute top-[5%] left-[5%] z-20 transition-all duration-1000 delay-[500ms] ease-out animate-float-slow ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-3.5 flex items-center gap-3 w-48 hover:shadow-xl hover:border-primary/20 transition-all cursor-default">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Police Vetted</h4>
                  <p className="text-[10px] text-muted-foreground">100% Background checked</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2: ECE (Middle Right) */}
            <div 
              className={`absolute top-[35%] right-[2%] z-20 transition-all duration-1000 delay-[600ms] ease-out animate-float-medium ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-3.5 flex items-center gap-3 w-52 hover:shadow-xl hover:border-primary/20 transition-all cursor-default">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">ECE Professionals</h4>
                  <p className="text-[10px] text-muted-foreground">Qualified teachers & carers</p>
                </div>
              </div>
            </div>

            {/* Floating Card 3: Sensory Aware (Bottom Left) */}
            <div 
              className={`absolute bottom-[10%] left-[8%] z-20 transition-all duration-1000 delay-[700ms] ease-out animate-float-slow ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-3.5 flex items-center gap-3 w-52 hover:shadow-xl hover:border-primary/20 transition-all cursor-default">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Sensory-Aware</h4>
                  <p className="text-[10px] text-muted-foreground">ADHD & Autism care trained</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
