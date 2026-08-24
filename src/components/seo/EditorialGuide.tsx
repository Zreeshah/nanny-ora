import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { ImageBand } from "@/components/ui/ImageBand";
import { JsonLd } from "@/components/seo/JsonLd";

export type GuideFaq = { question: string; answer: string };
export type GuideLink = { href: string; label: string; description: string };

export function EditorialGuide({
  eyebrow,
  title,
  description,
  imageTags,
  imageSeed,
  highlights,
  toc,
  schemas,
  children,
  faqs,
  related,
  ctaTitle,
  ctaBody,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageTags: string[];
  imageSeed: string;
  highlights: string[];
  toc: { id: string; label: string }[];
  schemas: object[];
  children: ReactNode;
  faqs: GuideFaq[];
  related: GuideLink[];
  ctaTitle: string;
  ctaBody: string;
}) {
  return (
    <>
      <JsonLd data={schemas} />
      <div className="pb-20 md:pb-28">
        <header className="pt-12 md:pt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><ChevronRight className="w-3.5 h-3.5" aria-hidden="true" /></li>
                <li><Link href="/find-a-nanny" className="hover:text-primary transition-colors">For families</Link></li>
                <li><ChevronRight className="w-3.5 h-3.5" aria-hidden="true" /></li>
                <li aria-current="page" className="text-foreground/75">{title}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                {eyebrow}
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {description}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">
                  Browse nanny profiles <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" />
                </Link>
                <Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">
                  Register your family
                </Link>
              </div>
            </div>

            <ImageBand tags={imageTags} seed={imageSeed} aspect="aspect-[16/7]" priority className="mt-12" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {highlights.map((item) => (
                <div key={item} className="bg-card rounded-2xl border border-border/35 p-4 shadow-sm flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-foreground/80 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20 grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
          <aside className="lg:sticky lg:top-28 bg-secondary/40 rounded-3xl border border-border/30 p-5" aria-label="On this page">
            <p className="font-heading font-bold text-foreground mb-3">On this page</p>
            <ol className="space-y-2.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors leading-snug block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="min-w-0">{children}</article>
        </div>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-18 md:mt-24" aria-labelledby="frequently-asked-questions">
          <SectionHeading id="frequently-asked-questions">Frequently asked questions</SectionHeading>
          <Accordion items={faqs} className="mt-7" />
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-18 md:mt-24" aria-labelledby="related-guides">
          <SectionHeading id="related-guides">Continue planning your nanny hire</SectionHeading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="group bg-card rounded-3xl border border-border/35 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-3">
                  {item.label}
                  <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-18 md:mt-24">
          <div className="bg-primary rounded-[2rem] p-8 sm:p-10 md:p-12 text-center shadow-lg">
            <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">{ctaTitle}</h2>
            <p className="text-white/80 leading-relaxed mt-3 max-w-2xl mx-auto">{ctaBody}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              <Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-accent-light hover:-translate-y-0.5 transition-all">
                Find a nanny <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" />
              </Link>
              <Link href="/post-a-job" className="inline-flex items-center justify-center rounded-full bg-white/95 text-primary font-semibold px-7 py-3.5 min-h-[48px] hover:bg-white hover:-translate-y-0.5 transition-all">
                Post a childcare job
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="scroll-mt-28 font-heading text-3xl sm:text-4xl text-foreground leading-tight tracking-tight">{children}</h2>;
}

export function Subheading({ children }: { children: ReactNode }) {
  return <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-9 mb-3 leading-tight">{children}</h3>;
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[15px] sm:text-base text-muted-foreground leading-[1.8] mb-5 ${className}`}>{children}</p>;
}

export function GuideSection({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-16 md:mb-20" aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      {intro ? <div className="mt-5">{intro}</div> : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 my-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-[15px] sm:text-base text-foreground/78 leading-relaxed">
          <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent flex-shrink-0">
            <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function InfoCard({ title, children, tone = "default" }: { title: string; children: ReactNode; tone?: "default" | "important" | "soft" }) {
  const toneClass = tone === "important" ? "bg-amber-50/70 border-amber-200/60" : tone === "soft" ? "bg-secondary/45 border-border/30" : "bg-card border-border/35";
  return (
    <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${toneClass}`}>
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">{title}</h3>
      <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="space-y-4 my-6">
      {items.map((item, index) => (
        <li key={item.title} className="bg-card rounded-3xl border border-border/35 p-5 sm:p-6 shadow-sm flex gap-4">
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{index + 1}</span>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-1.5">{item.title}</h3>
            <div className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-semibold hover:text-primary-light transition-colors">
      {children}<ExternalLink className="inline w-3.5 h-3.5 ml-1 -mt-0.5" aria-hidden="true" />
    </a>
  );
}
