import Image from "next/image";
import { pickImages } from "@/lib/images";
import { Reveal } from "./Reveal";

/**
 * Drop-in contextual image section. Pass the page's topic `tags` + a unique `seed`
 * and it renders one (or a `count` collage) of topic-matched local photos, with a
 * subtle hover-zoom, wrapped in a scroll reveal. Colours/theme untouched.
 */
export function ImageBand({
  tags,
  seed,
  count = 1,
  aspect = "aspect-[16/9]",
  priority = false,
  className = "",
}: {
  tags: string[];
  seed: string;
  count?: number;
  aspect?: string;
  priority?: boolean;
  className?: string;
}) {
  const images = pickImages({ tags, count, seed });
  const grid =
    count >= 3 ? "grid-cols-2 md:grid-cols-3" : count === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <Reveal className={className}>
      <div className={`grid ${grid} gap-4`}>
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`group relative w-full ${aspect} overflow-hidden rounded-3xl border border-border/20 shadow-lg bg-muted`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={priority && i === 0}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes={count >= 3 ? "(max-width: 768px) 50vw, 33vw" : count === 2 ? "50vw" : "100vw"}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl pointer-events-none" />
          </div>
        ))}
      </div>
    </Reveal>
  );
}
