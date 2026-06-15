import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NannyCard } from "@/components/cards/NannyCard";
import { getSampleNannies } from "@/lib/data/sample-nannies";
import { ArrowRight, Brain, Sparkles, HeartHandshake, Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Neurodiverse Childcare Auckland — Experienced Nannies",
  description: "Find nannies in Auckland with experience in neurodiverse childcare, including autism and ADHD support. Verified specialist carers on NannyOra.",
};

export default function NeurodiverseChildcarePage() {
  const nannies = getSampleNannies({ specialistTag: "neurodiverse" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-badge-specialist text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100/50">
          <Brain className="w-3.5 h-3.5" />
          <span>Neurodiverse Support Specialists</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          Neurodiverse childcare
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Connect with vetted Auckland nannies experienced in supporting neurodivergent children. Dedicated carers trained to guide and nurture children with Autism, ADHD, and other learning differences.
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: Sparkles,
            title: "Autism & ADHD Support",
            desc: "Carers who understand executive dysfunction, hyper-focus, and custom communication cues, facilitating calm routines.",
          },
          {
            icon: HeartHandshake,
            title: "Co-regulation & Safety",
            desc: "Nannies focused on positive support, child-led exploration, and empathetic boundary setting without punitive discipline.",
          },
          {
            icon: Compass,
            title: "Early Intervention Focus",
            desc: "Liaising with speech therapists, occupational therapists, and behavior specialists to maintain consistency at home.",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl border-border/40 p-5 bg-card">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-badge-specialist flex items-center justify-center mb-4 border border-blue-100/30">
              <item.icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      {/* Nanny list */}
      <div className="border-t border-border/20 pt-16 mb-12">
        <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-8 text-center sm:text-left">
          Available neurodiverse-support nannies
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
