import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Calm, practical shortlist guidance in the visual slot that previously held
 * unverified testimonial copy. The cards give families an honest next step
 * without presenting placeholder reviews as customer evidence.
 */
const shortlistSteps = [
  {
    headline: "Describe the real week.",
    quote: "Set out the children’s ages, regular hours, transport, routines and the moments where care needs to be dependable.",
    label: "1. Write the brief",
  },
  {
    headline: "Read the evidence shown.",
    quote: "Compare the profile’s stated travel area, experience, availability and verification level—without assuming every profile has the same checks.",
    label: "2. Compare profiles",
  },
  {
    headline: "Meet with a purpose.",
    quote: "Use consistent interview questions, speak with appropriate referees and make time to discuss the practical details of the role.",
    label: "3. Assess the fit",
  },
  {
    headline: "Start with clear terms.",
    quote: "If you decide to proceed, agree pay, duties, safety information, a paid trial where appropriate and written employment terms before regular care begins.",
    label: "4. Begin clearly",
  },
];

export default function MarqueeTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>A considered nanny search</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground">
            A clear path to a confident choice
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shortlistSteps.map((step, i) => (
            <Reveal key={step.label} delay={(i % 3) * 80} direction="up">
              <figure className="h-full flex flex-col bg-card rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <CheckCircle2 className="w-5 h-5 text-accent mb-4" aria-hidden="true" />
                <blockquote className="flex-1">
                  <p className="font-heading text-xl sm:text-2xl text-foreground leading-snug mb-3">
                    {step.headline}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.quote}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-border/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{step.label}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
