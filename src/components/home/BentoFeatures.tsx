"use client";

import { Card } from "@/components/ui/Card";
import { ShieldCheck, GraduationCap, Brain, Award, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BentoFeatures() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Strict Vetting Standards",
      description: "Every carer goes through face-to-face interviews, double reference reviews, identity checks, and police vetting.",
      tag: "Security First",
      color: "emerald",
      href: "/trust-and-safety",
      className: "md:col-span-2 md:row-span-1 bg-gradient-to-br from-emerald-50/20 via-transparent to-transparent",
    },
    {
      icon: GraduationCap,
      title: "ECE Educators",
      description: "Access registered teachers and carers certified in Early Childhood Education.",
      tag: "Professional Care",
      color: "blue",
      href: "/ece-nanny-auckland",
      className: "md:col-span-1 md:row-span-1 bg-gradient-to-br from-blue-50/20 via-transparent to-transparent",
    },
    {
      icon: Brain,
      title: "Sensory-Aware & Neurodiverse Care",
      description: "Dedicated nannies trained in ADHD, Autism, and sensory processing needs to create calm, structured spaces.",
      tag: "Specialist Care",
      color: "teal",
      href: "/sensory-aware-nanny-auckland",
      className: "md:col-span-1 md:row-span-2 bg-gradient-to-br from-teal-50/25 via-transparent to-transparent flex flex-col justify-between",
    },
    {
      icon: Award,
      title: "Auckland Experienced Carers",
      description: "Professionals with 5 to 15+ years of active, hands-on childcare experience in local suburbs.",
      tag: "High Trust",
      color: "amber",
      href: "/specialist-childcare-auckland",
      className: "md:col-span-2 md:row-span-1 bg-gradient-to-br from-amber-50/20 via-transparent to-transparent",
    },
  ];

  const colorConfig = {
    emerald: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "text-emerald-700 bg-emerald-100/50" },
    blue: { bg: "bg-blue-50 text-blue-600 border-blue-100", label: "text-blue-700 bg-blue-100/50" },
    teal: { bg: "bg-teal-50 text-teal-600 border-teal-100", label: "text-teal-700 bg-teal-100/50" },
    amber: { bg: "bg-amber-50 text-amber-600 border-amber-100", label: "text-amber-700 bg-amber-100/50" },
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Standards</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.1] mb-5">
            Specialist care, backed by high-trust experience
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
            We vet beyond the basics to bring you specialist Auckland nannies who match your child&apos;s educational and emotional needs.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px] md:auto-rows-[240px]">
          {items.map((item, index) => {
            const Icon = item.icon;
            const colors = colorConfig[item.color as keyof typeof colorConfig];

            return (
              <Link 
                key={index} 
                href={item.href}
                className={`group border border-border/40 hover:border-primary/20 bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 overflow-hidden flex flex-col justify-between relative ${item.className}`}
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${colors.bg} flex items-center justify-center border transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="w-5.5 h-5.5" aria-hidden="true" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colors.label}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Arrow Indicator */}
                <div className="flex justify-end mt-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center border border-border/30">
                    <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
