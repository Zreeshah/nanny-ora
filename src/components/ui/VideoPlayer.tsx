import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

/**
 * Self-hosted video. ponytail: native <video> — no player lib. preload="none"
 * means nothing downloads until the visitor hits play; the poster carries the
 * first paint. Swap src to a YouTube embed if bandwidth ever becomes the issue.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  description,
  uploadDate,
  durationISO,
  className = "",
}: {
  src: string;
  poster: string;
  title: string;
  description: string;
  /** ISO date — required by VideoObject schema. */
  uploadDate: string;
  /** ISO 8601 duration, e.g. "PT1M1S". */
  durationISO: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: title,
          description,
          thumbnailUrl: `${SITE_URL}${poster}`,
          contentUrl: `${SITE_URL}${src}`,
          uploadDate,
          duration: durationISO,
          publisher: { "@type": "Organization", name: "NannyOra", url: SITE_URL },
        }}
      />
      <video
        controls
        preload="none"
        playsInline
        poster={poster}
        aria-label={title}
        className="w-full aspect-video rounded-3xl border border-border/40 bg-foreground/5 shadow-sm"
      >
        <source src={src} type="video/mp4" />
        Your browser doesn&apos;t support video playback.
      </video>
    </div>
  );
}
