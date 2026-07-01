import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Elegant testimonial cards led by an emotional headline. Replaces the earlier
 * repeating marquee — fewer, larger, calmer cards with a soft silhouette
 * avatar, suburb, and child age. Tokens only.
 */
const testimonials = [
  {
    headline: "Our evenings became peaceful again.",
    quote: "Emma's sensory-aware approach transformed bedtime with our autistic son. The calm she brings is incredible.",
    author: "Liam & Sarah H.",
    location: "Remuera",
    relation: "Parents of Leo, 4",
  },
  {
    headline: "Centre-quality learning, at home.",
    quote: "Aroha brought her ECE background straight into our living room. Our twins adore her and we trust her completely.",
    author: "Ngaire T.",
    location: "Ponsonby",
    relation: "Mother of twins, 3",
  },
  {
    headline: "Absolute peace of mind.",
    quote: "The police vetting and verification gave us total confidence. Mia has been amazing with our toddler.",
    author: "David & Jess M.",
    location: "Devonport",
    relation: "Parents of Sophie, 2",
  },
  {
    headline: "A weight lifted from our shoulders.",
    quote: "Our son has ADHD and struggles with transitions. Our nanny brought routines that just worked.",
    author: "Rachel L.",
    location: "Mount Eden",
    relation: "Mother of Mason, 6",
  },
  {
    headline: "She extends their learning through play.",
    quote: "As a registered teacher, Sarah doesn't just watch our kids — she grows them. Highly recommend.",
    author: "Matthew K.",
    location: "Epsom",
    relation: "Father of Oliver & Lily",
  },
];

export default function MarqueeTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-accent" />
            <span>Trust &amp; Connection</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground">
            Loved by Auckland families
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={(i % 3) * 80} direction="up">
              <figure className="h-full flex flex-col bg-card rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 text-accent mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current stroke-none" />
                  ))}
                </div>
                <blockquote className="flex-1">
                  <p className="font-heading text-xl sm:text-2xl text-foreground leading-snug mb-3">
                    &ldquo;{t.headline}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.quote}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-border/30">
                  <span className="w-11 h-11 rounded-full bg-secondary text-primary font-heading font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {getInitials(t.author)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.relation} · {t.location}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
