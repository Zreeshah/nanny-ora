import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NannyCard } from "@/components/cards/NannyCard";
import { getPublicNannies } from "@/lib/data/nannies";
import { ArrowRight, Heart, Sparkles, Smile, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ImageBand } from "@/components/ui/ImageBand";

export const metadata: Metadata = {
  title: "Sensory-Aware Nannies Auckland — Calm, Specialist Childcare",
  description: "Find sensory-aware nannies in Auckland who create calm, structured environments for children with sensory processing needs. Verified on NannyOra.",
};

export const revalidate = 300;

export default async function SensoryAwareNannyPage() {
  const nannies = await getPublicNannies({ specialistTag: "sensory_aware" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-100/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calm & Supportive Care</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          Sensory-aware nannies
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Find Auckland nannies who specialize in creating calm, structured care environments for children with sensory processing differences, avoiding triggers and supporting emotional regulation.
        </p>
      </div>

      {/* Contextual hero image */}
      <ImageBand
        tags={["sensory", "neurodiverse", "specialist", "care"]}
        seed="sensory-aware-nanny"
        aspect="aspect-[16/7]"
        priority
        className="mb-16"
      />

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: Smile,
            title: "Emotional Regulation",
            desc: "Trained to identify sensory overload early and use gentle co-regulation techniques to help children feel safe.",
          },
          {
            icon: ShieldAlert,
            title: "Low-Stimulus Routines",
            desc: "A focus on balancing active time with quiet, low-sensory environments to prevent neurological exhaustion.",
          },
          {
            icon: Heart,
            title: "Patient & Adaptable",
            desc: "Nannies who adapt activities and clothing/food transitions to accommodate individual tactile, auditory, and visual needs.",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl border-border/40 p-5 bg-card">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-100/30">
              <item.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* List */}
      <div className="border-t border-border/20 pt-16 mb-12">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-8 text-center sm:text-left">
          Available sensory-aware nannies
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
