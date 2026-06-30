import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NannyCard } from "@/components/cards/NannyCard";
import { getSampleNannies } from "@/lib/data/sample-nannies";
import { ArrowRight, GraduationCap, Star, BookOpen, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ImageBand } from "@/components/ui/ImageBand";

export const metadata: Metadata = {
  title: "ECE Nannies Auckland — Early Childhood Education Qualified",
  description: "Find ECE-qualified nannies and registered teachers in Auckland. Experienced early childhood educators providing enriching home-based care via NannyOra.",
};

export default function EceNannyPage() {
  const nannies = getSampleNannies({ specialistTag: "ece_background" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-badge-premium text-xs font-bold uppercase tracking-wider mb-4 border border-amber-100/50">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Educational Excellence</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          ECE nannies in Auckland
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Find nannies with early childhood education (ECE) qualifications and registered teacher status. Bring center-quality learning frameworks straight into your home.
        </p>
      </div>

      {/* Contextual hero image */}
      <ImageBand
        tags={["ece", "teacher", "specialist", "professional"]}
        seed="ece-nanny-auckland"
        aspect="aspect-[16/7]"
        priority
        className="mb-16"
      />

      {/* Info Section about ECE Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: BookOpen,
            title: "Te Whāriki Framework",
            desc: "ECE nannies plan developmental milestones aligned with New Zealand's early childhood curriculum.",
          },
          {
            icon: Star,
            title: "Registered Teachers",
            desc: "Experienced teachers bringing professional classroom structure, lesson plans, and care standards.",
          },
          {
            icon: Lightbulb,
            title: "Developmental Play",
            desc: "Focus on play-based learning, sensory exploration, and creative expression designed for early milestones.",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl border-border/40 p-5 bg-card">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-badge-premium flex items-center justify-center mb-4 border border-amber-100/30">
              <item.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* Nanny Cards Grid */}
      <div className="border-t border-border/20 pt-16 mb-12">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-8 text-center sm:text-left">
          Available ECE-qualified nannies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nannies.map((n) => (
            <NannyCard key={n.id} nanny={n} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/find-a-nanny">
          <Button variant="primary" size="lg" className="rounded-full shadow-lg">
            View all Auckland nannies
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
