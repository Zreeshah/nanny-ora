import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FileText, Search, MessageCircle, Heart, ArrowRight,
  UserPlus, ClipboardCheck, Upload, CheckCircle, HelpCircle,
} from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";
import { FaqGroups } from "@/components/FaqGroups";
import { ShinyText } from "@/components/ui/ShinyText";

export const metadata: Metadata = {
  title: "How NannyOra Works — Childcare Connected with Trust",
  description: "Learn how NannyOra connects Auckland families with verified, specialist nannies. Simple process steps for parents and professional nannies.",
};

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Our Community Playbook</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          How <ShinyText>NannyOra</ShinyText> works
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Connecting Auckland families with specialist, ECE-qualified, and sensory-aware nannies through a high-trust process designed for safety and visual simplicity.
        </p>
      </div>

      {/* Contextual image */}
      <ImageBand
        tags={["how-it-works-band"]}
        seed="how-it-works"
        aspect="aspect-[16/9]"
        priority
        className="mb-20"
      />

      {/* For Parents Section */}
      <section className="mb-24 relative">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <span>For Parents</span>
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
            Finding <ShinyText>trusted care</ShinyText>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Follow our four-step process to discover local, verified Auckland nannies who match your family&apos;s specific needs.
          </p>
        </div>

        {/* Steps Visual Grid with Timeline Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 stagger-children">
          {[
            {
              icon: FileText,
              step: "01",
              title: "Tell Us What You Need",
              desc: "Register your family and share details about your children, required hours, and any specialist support needed.",
            },
            {
              icon: Search,
              step: "02",
              title: "Browse Local Nannies",
              desc: "Search our directory of verified Auckland nannies. Filter profiles by experience level, training, and suburb.",
            },
            {
              icon: MessageCircle,
              step: "03",
              title: "Send an Enquiry",
              desc: "Connect directly with suitable nannies through our secure message portal or post a job listing to receive applications.",
            },
            {
              icon: Heart,
              step: "04",
              title: "Meet & Arrange Care",
              desc: "Schedule a video call or coffee meet, conduct a short paid trial session, and finalize care arrangements with confidence.",
            },
          ].map((item) => (
            <Card
              key={item.step}
              hover
              padding="none"
              className="relative overflow-hidden bg-card border border-border/40 p-6 rounded-3xl flex flex-col items-start min-h-[260px] group transition-all duration-300 hover:border-accent/20"
            >
              {/* Large Step Overlay */}
              <div className="absolute -top-3 -right-3 text-7xl font-heading text-secondary font-black opacity-45 pointer-events-none select-none group-hover:text-accent/10 transition-colors">
                {item.step}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-accent/5 text-accent flex items-center justify-center mb-6 border border-accent/10 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                <item.icon className="w-5.5 h-5.5 stroke-[1.8]" aria-hidden="true" />
              </div>

              <h3 className="font-heading text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/register-family">
            <Button variant="accent" size="lg" className="rounded-full shadow-lg shadow-accent/10">
              Register as a Family
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Horizontal Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-16" />

      {/* For Nannies Section */}
      <section className="relative">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <span>For Nannies</span>
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-4">
            Joining our <ShinyText>community</ShinyText>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apply as a carer and highlight your qualifications, certifications, and experience to connect with local parents.
          </p>
        </div>

        {/* Steps Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 stagger-children">
          {[
            {
              icon: UserPlus,
              step: "01",
              title: "Apply Online",
              desc: "Fill in our standard application form detailing your child-caring experience, ECE qualifications, and availability.",
            },
            {
              icon: ClipboardCheck,
              step: "02",
              title: "Build Your Profile",
              desc: "Create a professional carer profile, listing your hourly rates, suburb coverage, and specific care specialties.",
            },
            {
              icon: Upload,
              step: "03",
              title: "Verify Documents",
              desc: "Upload copy of photo ID, police vets, first aid, and professional references for secure manual admin review.",
            },
            {
              icon: CheckCircle,
              step: "04",
              title: "Get Live & Match",
              desc: "Once verified, your profile will be published, enabling local Auckland families to contact you for care.",
            },
          ].map((item) => (
            <Card
              key={item.step}
              hover
              padding="none"
              className="relative overflow-hidden bg-card border border-border/40 p-6 rounded-3xl flex flex-col items-start min-h-[260px] group transition-all duration-300 hover:border-primary/20"
            >
              {/* Large Step Overlay */}
              <div className="absolute -top-3 -right-3 text-7xl font-heading text-secondary font-black opacity-45 pointer-events-none select-none group-hover:text-primary/10 transition-colors">
                {item.step}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <item.icon className="w-5.5 h-5.5 stroke-[1.8]" aria-hidden="true" />
              </div>

              <h3 className="font-heading text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/apply-as-nanny">
            <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/10">
              Apply as a Nanny
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-24 border-t border-border/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span>FAQ</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-3">
              Employment, payroll, and day-to-day answers for families and nannies.
            </p>
          </div>
          <FaqGroups />
        </div>
      </section>
    </div>
  );
}
