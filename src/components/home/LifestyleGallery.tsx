import Image from "next/image";
import { pickImages } from "@/lib/images";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Masonry lifestyle gallery — emotional storytelling imagery for "life feeling".
 * Pinterest-style uneven cards via CSS columns; images from the local library.
 */
const gallery = pickImages({
  tags: ["care", "family", "find", "professional", "sensory", "newborn", "ece"],
  count: 8,
  seed: "home-lifestyle-gallery",
});

// Varied aspect ratios give the uneven, candid Pinterest rhythm.
const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[4/3]"];

export default function LifestyleGallery() {
  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <span>Life with NannyOra</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 leading-[1.1]">
            Real calm, real Auckland families
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            The quiet, everyday moments of trusted care — the kind your family remembers.
          </p>
        </div>

        <Reveal>
          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {gallery.map((img, i) => (
              <div
                key={img.src}
                className={`relative ${ASPECTS[i % ASPECTS.length]} w-full mb-4 rounded-3xl overflow-hidden shadow-sm break-inside-avoid group`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
