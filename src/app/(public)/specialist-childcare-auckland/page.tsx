import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NannyCard } from "@/components/cards/NannyCard";
import { getSampleNannies } from "@/lib/data/sample-nannies";
import { Brain, Heart, Shield, ArrowRight, Sparkles, Award } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export const metadata: Metadata = {
  title: "Specialist Childcare Auckland — Sensory-Aware & Neurodiverse Nannies",
  description: "Find specialist childcare in Auckland. NannyOra connects families with vetted nannies experienced in sensory-aware care, neurodiverse support, ECE, and early intervention.",
};

export default function SpecialistChildcarePage() {
  // Filter nannies with specialist backgrounds
  const specialistNannies = getSampleNannies().filter((n) => n.neurodiverseExperience || n.eceExperience);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Top Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-badge-specialist text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Specialized Care Networks</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          Specialist childcare in Auckland
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Connecting Auckland parents with nannies who have verified, active experience supporting neurodiverse children, sensory processing needs, and early childhood education.
        </p>
      </div>

      {/* Contextual hero image */}
      <ImageBand
        tags={["specialist", "sensory", "ece", "care"]}
        seed="specialist-childcare"
        aspect="aspect-[16/7]"
        priority
        className="mb-16"
      />

      {/* Specialist Segments Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          {
            icon: Brain,
            title: "Neurodiverse Support",
            desc: "Experienced nannies supporting children with Autism, ADHD, and sensory processing differences.",
            href: "/neurodiverse-childcare-auckland",
            color: "text-badge-specialist",
            bgColor: "bg-blue-50 border-blue-100/30",
          },
          {
            icon: Heart,
            title: "Sensory-Aware Care",
            desc: "Nannies focused on sensory regulation, creating calm, stable, and low-stimulus environments.",
            href: "/sensory-aware-nanny-auckland",
            color: "text-teal-600",
            bgColor: "bg-teal-50 border-teal-100/30",
          },
          {
            icon: Award,
            title: "ECE & Teacher Support",
            desc: "ECE-qualified educators and registered teachers bringing educational frameworks into home care.",
            href: "/ece-nanny-auckland",
            color: "text-badge-premium",
            bgColor: "bg-amber-50 border-amber-100/30",
          },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <Card
              hover
              className={`h-full border border-border/40 p-6.5 rounded-3xl group-hover:border-primary/20 hover:shadow-md transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center mb-5 border group-hover:scale-105 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
              </div>
              <h2 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-1.5">
                {item.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Specialist Listings Section */}
      <section className="mb-16 border-t border-border/20 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground">
              Featured specialist nannies
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
              Vetted Auckland carers possessing ECE background or neurodiverse experience.
            </p>
          </div>
          <Link href="/find-a-nanny" className="text-xs sm:text-sm font-bold text-primary hover:text-primary-light transition-colors">
            Advanced Filters →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialistNannies.map((nanny) => (
            <NannyCard key={nanny.id} nanny={nanny} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <div className="text-center">
        <Link href="/find-a-nanny">
          <Button variant="accent" size="lg" className="rounded-full shadow-lg shadow-accent/10">
            Browse all nannies
            <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
