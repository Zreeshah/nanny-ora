"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Finding Emma was a blessing for our family. Her sensory-aware approach transformed our evenings with our autistic son. The level of calm she brings is incredible.",
    author: "Liam & Sarah H.",
    location: "Remuera",
    relation: "Parents of Leo (4)",
  },
  {
    quote: "Aroha has ECE qualified learning background and brought centre-quality education straight into our living room. Our twins adore her, and we trust her completely.",
    author: "Ngaire T.",
    location: "Ponsonby",
    relation: "Mother of twins (3)",
  },
  {
    quote: "The police vetting and verification process on NannyOra gave us absolute peace of mind. We connected with Mia, and she has been amazing with our toddler.",
    author: "David & Jess M.",
    location: "Devonport",
    relation: "Parents of Sophie (2)",
  },
  {
    quote: "Our child has ADHD and struggles with transitions. Our specialist nanny brought routines that just worked. It feels like a weight has been lifted from our shoulders.",
    author: "Rachel L.",
    location: "Mount Eden",
    relation: "Mother of Mason (6)",
  },
  {
    quote: "As a registered teacher, Sarah doesn't just watch our children — she extends their learning through play and structured activities. Highly recommend NannyOra!",
    author: "Matthew K.",
    location: "Epsom",
    relation: "Father of Oliver & Lily",
  },
];

export default function MarqueeTestimonials() {
  // Double the list to create a seamless infinite scrolling loop
  const scrollItems = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gradient-to-b from-secondary/10 to-background border-t border-border/25 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">
          <Star className="w-3.5 h-3.5 fill-accent" />
          <span>Trust & Connection</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground">
          Loved by Auckland families
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Hear from parents who found calm, trusted, and qualified specialist support for their children.
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="relative flex w-full overflow-x-hidden py-4 mask-gradient">
        {/* Track 1 */}
        <div className="flex gap-6 animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap min-w-full">
          {scrollItems.map((item, index) => (
            <div
              key={index}
              className="inline-block w-[350px] sm:w-[420px] bg-card border border-border/40 p-6 rounded-3xl shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-300 whitespace-normal flex-shrink-0"
            >
              <div className="flex items-center gap-1 text-amber-500 mb-3.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                ))}
              </div>
              
              <div className="relative mb-4">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/5 pointer-events-none stroke-[3]" />
                <p className="text-sm text-muted-foreground italic leading-relaxed pl-4 relative z-10">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-border/40 pt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-foreground">{item.author}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{item.relation}</div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-secondary px-2.5 py-1 rounded-full border border-border/20">
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
