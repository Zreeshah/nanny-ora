import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { VERIFICATION_LEVEL_LABELS } from "@/lib/constants";
import {
  Shield, FileCheck, UserCheck, Lock, Eye, CheckCircle, ClipboardCheck,
  MessageCircle, BadgeCheck, Star, Users, Info
} from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";
import { ShinyText } from "@/components/ui/ShinyText";

export const metadata: Metadata = {
  title: "Trust & Safety — Safe Childcare on NannyOra",
  description: "Learn how NannyOra verifies nannies, protects parents, and maintains a secure, trust-focused childcare community in Auckland.",
};

const verificationDetails = [
  {
    level: "LISTED" as const,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    accentColor: "border-l-slate-300",
    icon: Info,
    description: "Nanny has successfully registered. Profile information is listed. Vetting documents have not yet been verified by our admin team.",
  },
  {
    level: "VERIFIED" as const,
    badgeColor: "bg-emerald-50 text-badge-verified border-emerald-100",
    accentColor: "border-l-badge-verified",
    icon: CheckCircle,
    description: "Carer identity is checked. References are reviewed and verified. Valid qualifications (such as First Aid certificate) have been confirmed.",
  },
  {
    level: "PREMIUM_VETTED" as const,
    badgeColor: "bg-amber-50 text-badge-premium border-amber-100",
    accentColor: "border-l-badge-premium",
    icon: Star,
    description: "Full checks complete. Police vet or safety check reviewed by our admin team. Multiple references confirmed. Highly experienced NZ carer.",
  },
  {
    level: "SPECIALIST" as const,
    badgeColor: "bg-blue-50 text-badge-specialist border-blue-100",
    accentColor: "border-l-badge-specialist",
    icon: BadgeCheck,
    description: "All premium vetting checks plus verified specialist credentials — such as ECE degrees, teaching registrations, or neurodiverse care certifications.",
  },
];

export default function TrustAndSafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 border border-primary/20">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Trust &amp; <ShinyText>safety</ShinyText>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Your family&apos;s peace of mind is our foundation. Here is how we verify credentials, protect personal details, and foster a safe Auckland childcare community.
        </p>
      </div>

      {/* Contextual image */}
      <ImageBand
        tags={["trust", "safety", "vetting", "verified"]}
        seed="trust-and-safety"
        aspect="aspect-[16/7]"
        priority
        className="mb-16"
      />

      {/* Verification Levels */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-2xl text-foreground">Verification levels</h2>
        </div>
        <div className="space-y-4">
          {verificationDetails.map((v) => (
            <Card
              key={v.level}
              padding="none"
              className={`flex items-start gap-4 p-5 sm:p-6 bg-card border-l-4 ${v.accentColor} border-t border-r border-b border-border/40 rounded-r-2xl rounded-l-none hover:shadow-sm transition-all`}
            >
              <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-primary border border-border/25`}>
                <v.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="font-bold text-foreground text-base leading-none">
                    {VERIFICATION_LEVEL_LABELS[v.level]}
                  </h3>
                  <Badge variant="outline" className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border ${v.badgeColor}`}>
                    Level status
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* What We Check */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <FileCheck className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-2xl text-foreground">What we review</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: FileCheck, title: "Identity Documents", desc: "Photo ID (Passport or Driver Licence) is reviewed to verify identity details." },
            { icon: UserCheck, title: "References Contacted", desc: "We speak directly to professional references to confirm care records." },
            { icon: BadgeCheck, title: "Specialist Qualifications", desc: "ECE certificates and teaching registrations are cross-checked with official boards." },
            { icon: Shield, title: "NZ Police Vetting", desc: "For premium and specialist levels, a clean, recent Police Vet check is verified." },
            { icon: CheckCircle, title: "First Aid & CPR", desc: "Current child-focused First Aid certifications are checked and verified." },
            { icon: ClipboardCheck, title: "Thoughtfully Reviewed Profiles", desc: "Every biography, photo, and tag is carefully reviewed before a profile goes live." },
          ].map((item) => (
            <Card key={item.title} className="hover:border-primary/25 hover:shadow-sm transition-all rounded-2xl border-border/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-primary border border-border/25">
                  <item.icon className="w-4.5 h-4.5 stroke-[1.8]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Family Responsibility */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="font-heading text-2xl text-foreground">Parent checklist</h2>
        </div>
        <Card className="bg-secondary/40 border border-border/30 rounded-3xl p-6.5">
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground">
              While NannyOra reviews certifications and references, we strongly encourage families to:
            </p>
            <ul className="space-y-3 pl-1">
              {[
                "Conduct a comprehensive video call or in-person coffee meet before hiring",
                "Book a short paid trial session (e.g. 2–3 hours) to observe nanny-children interaction",
                "Review original training certificates, first aid, or registrations together on your first meet",
                "Contact references independently if your family requires specialized security assurances",
                "Listen to your children's feedback and trust your parenting instincts"
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 stroke-[2]" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      {/* Privacy & Data */}
      <section className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-2xl text-foreground">Privacy & secure communication</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Lock, title: "Personal Details Stay Private", desc: "Your home address, exact child names, and contact channels are never visible to the public." },
            { icon: Eye, title: "Controlled Vetting Records", desc: "Personal documents and police reports are only accessed by manual admin checkers and never exposed." },
            { icon: MessageCircle, title: "Secure Chat Channels", desc: "Initial contact stays on NannyOra. Feel free to exchange phone details once mutual fit is established." },
            { icon: Shield, title: "Encrypted Storage", desc: "Sensitive document files are stored in access-restricted buckets using security best-practices." },
          ].map((item) => (
            <Card key={item.title} className="rounded-2xl border-border/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-primary border border-border/25">
                  <item.icon className="w-4.5 h-4.5 stroke-[1.8]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Note Disclaimer */}
      <section>
        <Card className="border-l-4 border-l-accent border-t border-r border-b border-accent/20 bg-accent/5 p-6 rounded-r-3xl rounded-l-none">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-accent flex-shrink-0 mt-0.5 stroke-[1.8]" aria-hidden="true" />
            <div>
              <h3 className="font-bold text-foreground text-sm mb-2">Platform notice</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                NannyOra is a platform connecting independent families and childcare professionals. While we carefully review uploaded credentials, we do not employ nannies, act as an agency, or guarantee safety outcomes. Families retain final hiring authority and are responsible for matching, tax, and employment declarations.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
