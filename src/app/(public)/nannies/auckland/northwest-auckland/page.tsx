import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { NannyCard } from "@/components/cards/NannyCard";
import { ImageBand } from "@/components/ui/ImageBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicNannies } from "@/lib/data/nannies";
import {
  getNorthwestAucklandCoverage,
  getNorthwestAucklandNannies,
  hasIndexableNorthwestAucklandCoverage,
  HOBSONVILLE_PATH,
  NORTHWEST_AUCKLAND_AREAS,
  NORTHWEST_AUCKLAND_PATH,
} from "@/lib/northwest-auckland";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { ArrowRight, CalendarCheck, FileText, MapPin, Search, ShieldCheck, Users } from "lucide-react";

const title = "Nannies in Northwest Auckland";
const description = "Plan in-home childcare in Hobsonville, Whenuapai, Westgate, Huapai and Kumeū. Northwest Auckland nanny profiles are being added to NannyOra.";

export const revalidate = 300;

const faqs = [
  {
    question: "Are NannyOra nannies currently available in Northwest Auckland?",
    answer: "NannyOra does not currently show an active public profile that explicitly lists Hobsonville, Hobsonville Point, Whenuapai, Westgate, Huapai or Kumeū. This local directory is being prepared. Families can browse the wider Auckland directory and register their care brief while local profile coverage grows.",
  },
  {
    question: "Which Northwest Auckland areas will this directory cover?",
    answer: "This page is for families looking for a nanny in Hobsonville, Hobsonville Point, Whenuapai, Westgate, Huapai and Kumeū. A nanny will appear here only when their own profile lists one of those places as a base suburb or stated travel area.",
  },
  {
    question: "Can I still start looking for a nanny?",
    answer: "Yes. Start with a clear care brief: your children’s ages, required days and hours, preferred start date, duties, travel needs and any must-have experience. You can browse the Auckland directory and register your family so you are ready to enquire when a suitable profile is available.",
  },
  {
    question: "How will I know whether a nanny can travel to my suburb?",
    answer: "Check the nanny’s stated suburb and areas covered, then confirm the practical route, parking, school pickup and start and finish times directly. A broad regional label is not the same as a confirmed local travel commitment.",
  },
  {
    question: "What should I check before I shortlist a nanny?",
    answer: "Read the verification level and completed checks shown on the individual profile, then ask role-relevant interview questions and consider a paid trial. A Listed profile is different from a Premium Vetted or Specialist Care profile, and any Police vet is only one input to a wider hiring decision.",
  },
];

const nextSteps = [
  {
    icon: FileText,
    title: "Write a useful care brief",
    body: "Set out the practical details first: children’s ages, required days, school or activity transport, household routines, duties and preferred start date.",
  },
  {
    icon: Search,
    title: "Browse the wider Auckland directory",
    body: "Use actual profile information to compare experience, care types, stated travel areas, availability and the verification level shown.",
  },
  {
    icon: CalendarCheck,
    title: "Confirm travel and schedule fit",
    body: "Ask directly about the route, parking, pickup windows, guaranteed hours and whether the nanny can meet your actual weekly routine.",
  },
  {
    icon: ShieldCheck,
    title: "Shortlist carefully",
    body: "Use interviews, references, a paid trial where appropriate and a written plan before care begins—not a location label alone.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const nannies = getNorthwestAucklandNannies(await getPublicNannies());
  const isIndexable = hasIndexableNorthwestAucklandCoverage(nannies);
  const liveDescription = nannies.length > 0
    ? `Browse ${nannies.length} current Northwest Auckland nanny profile${nannies.length === 1 ? "" : "s"} covering Hobsonville, Whenuapai, Westgate, Huapai or Kumeū. Compare profile details on NannyOra.`
    : description;

  return {
    title,
    description: liveDescription,
    alternates: { canonical: NORTHWEST_AUCKLAND_PATH },
    robots: isIndexable ? undefined : { index: false, follow: true },
    openGraph: { title, description: liveDescription, url: NORTHWEST_AUCKLAND_PATH, type: "website" },
  };
}

export default async function NorthwestAucklandNanniesPage() {
  const nannies = getNorthwestAucklandNannies(await getPublicNannies());
  const coverage = getNorthwestAucklandCoverage(nannies);
  const hasProfiles = nannies.length > 0;
  const isIndexable = hasIndexableNorthwestAucklandCoverage(nannies);
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Nannies in Auckland", path: "/nannies/auckland" },
      { name: "Nannies in Northwest Auckland", path: NORTHWEST_AUCKLAND_PATH },
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: hasProfiles
        ? `Current NannyOra profiles that explicitly list a Northwest Auckland locality.`
        : description,
      url: `https://www.nannyora.co.nz${NORTHWEST_AUCKLAND_PATH}`,
      about: { "@type": "Thing", name: "In-home childcare in Northwest Auckland" },
      ...(hasProfiles ? {
        mainEntity: {
          "@type": "ItemList",
          itemListElement: nannies.map((nanny, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://www.nannyora.co.nz/nannies/${nanny.slug}`,
            name: nanny.name,
          })),
        },
      } : {}),
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="pb-20 md:pb-28">
        <header className="pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/nannies/auckland" className="hover:text-primary transition-colors">Nannies in Auckland</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground/75">Northwest Auckland</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Northwest Auckland care planning</div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">Nannies in Northwest Auckland</h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">{hasProfiles ? "Browse NannyOra profiles that explicitly list a Northwest Auckland area. Compare the experience, travel coverage, availability and verification information shown before you enquire." : "Planning in-home childcare around Hobsonville, Whenuapai, Westgate, Huapai or Kumeū? NannyOra is preparing this local directory. We do not currently have a public profile that explicitly lists one of these areas."}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Browse Auckland nannies <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link>
                <Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">Register your family</Link>
              </div>
            </div>
            <ImageBand tags={["suburb", "auckland", "family", "find"]} seed="northwest-auckland-nannies" count={2} aspect="aspect-[16/6]" priority className="mt-12" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
          {!hasProfiles && (
            <section aria-labelledby="coming-soon-heading" className="mb-20 md:mb-24 rounded-[2rem] border border-accent/25 bg-accent/10 p-7 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Local profiles coming soon</p>
                  <h2 id="coming-soon-heading" className="font-heading text-3xl sm:text-4xl text-foreground">A local listing should reflect real local coverage.</h2>
                  <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">Rather than presenting broad Auckland coverage as a confirmed Northwest match, this page will show profiles only when a nanny explicitly lists one of these areas. In the meantime, you can make your care brief clear and use the wider directory to explore current Auckland options.</p>
                </div>
                <div className="rounded-3xl border border-border/35 bg-card p-6">
                  <Users className="h-6 w-6 text-accent mb-4" aria-hidden="true" />
                  <h3 className="font-heading text-xl text-foreground">What changes when profiles are added?</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">This page automatically displays only profiles with explicit Northwest coverage. It will become search-indexable once there are at least three profiles across two named localities.</p>
                </div>
              </div>
            </section>
          )}

          {hasProfiles && (
            <section aria-labelledby="profiles-heading" className="mb-20 md:mb-24">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
                <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Current profile coverage</p><h2 id="profiles-heading" className="font-heading text-3xl sm:text-4xl text-foreground">Nanny profiles for Northwest Auckland</h2><p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">The current profiles below explicitly list {coverage.join(", ") || "a Northwest Auckland locality"}. Confirm the specific travel route, schedule and role directly before you shortlist.</p></div>
                {!isIndexable && <Badge variant="outline" size="md">Local directory growing</Badge>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{nannies.map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div>
            </section>
          )}

          <section aria-labelledby="areas-heading" className="mb-20 md:mb-24">
            <div className="max-w-3xl mb-8"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">The local cluster</p><h2 id="areas-heading" className="font-heading text-3xl sm:text-4xl text-foreground">Northwest Auckland areas this page is built for</h2><p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">This is one regional hub, not a set of near-identical suburb pages. It gives families a single place to plan care across the connected Northwest area while NannyOra builds verified local profile coverage.</p></div>
            <div className="flex flex-wrap gap-3">{NORTHWEST_AUCKLAND_AREAS.map((area) => <Badge key={area} variant="outline" size="md">{area}</Badge>)}</div>
            <div className="mt-7 max-w-2xl rounded-3xl border border-border/35 bg-card p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Hobsonville care planning</p>
              <h3 className="mt-2 font-heading text-2xl text-foreground">Looking specifically for Hobsonville?</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Visit the dedicated Hobsonville guide for a more focused plan around local travel, after-school timing and when this page will show confirmed Hobsonville profiles.</p>
              <Link href={HOBSONVILLE_PATH} className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors">Explore Hobsonville nanny planning <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </section>

          <section aria-labelledby="next-steps-heading" className="mb-20 md:mb-24">
            <div className="max-w-3xl mb-8"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Start with the right information</p><h2 id="next-steps-heading" className="font-heading text-3xl sm:text-4xl text-foreground">What to do while local profiles are being added</h2><p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">A useful search begins with the practical details that determine fit. This helps NannyOra families compare wider Auckland profiles honestly and makes a future local match easier to assess.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{nextSteps.map((step, index) => <div key={step.title} className="relative rounded-3xl border border-border/35 bg-card p-6 shadow-sm"><span className="font-heading text-5xl font-black text-secondary absolute right-4 top-3">0{index + 1}</span><div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><step.icon className="h-5 w-5" aria-hidden="true" /></div><h3 className="relative font-heading text-lg font-bold text-foreground mb-2">{step.title}</h3><p className="relative text-sm leading-relaxed text-muted-foreground">{step.body}</p></div>)}</div>
          </section>

          <section aria-labelledby="supporting-guides-heading" className="mb-20 md:mb-24 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-primary p-7 sm:p-9 text-primary-foreground"><p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">Plan a careful match</p><h2 id="supporting-guides-heading" className="font-heading text-3xl">Location is only one part of a good fit.</h2><p className="mt-4 text-sm sm:text-base leading-relaxed text-white/80">A nanny&apos;s route needs to work, but so do their experience, availability, communication and approach to your child&apos;s routine. Use the wider Auckland directory to start a considered shortlist—not a rushed placement.</p><Link href="/nannies/auckland" className="mt-6 inline-flex items-center font-semibold text-accent-foreground hover:text-white transition-colors">Explore Nannies in Auckland <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="rounded-3xl border border-border/35 bg-card p-7 sm:p-9"><h2 className="font-heading text-2xl text-foreground">Useful guides for Northwest families</h2><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Before you meet a candidate, understand the checks, questions and employment planning that help create a safer, clearer arrangement.</p><div className="mt-6 grid gap-3 text-sm font-semibold"><Link href="/how-to-hire-a-nanny" className="text-primary hover:text-primary-light transition-colors">Follow the nanny hiring process</Link><Link href="/nanny-vetting" className="text-primary hover:text-primary-light transition-colors">Read how NannyOra vetting works</Link><Link href="/nanny-interview-questions" className="text-primary hover:text-primary-light transition-colors">Prepare interview questions</Link><Link href="/nanny-cost" className="text-primary hover:text-primary-light transition-colors">Plan the full cost of a nanny</Link></div></div>
          </section>

          <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto mb-20 md:mb-24"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Northwest Auckland nanny questions</p><h2 id="faq-heading" className="font-heading text-3xl sm:text-4xl text-foreground mb-8">Frequently asked questions</h2><Accordion items={faqs} /></section>

          <section className="max-w-4xl mx-auto"><div className="rounded-[2rem] bg-secondary p-8 sm:p-10 md:p-12 text-center border border-border/35"><h2 className="font-heading text-3xl md:text-4xl text-foreground">Start your Northwest Auckland nanny search with a clear brief.</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-relaxed">Local profiles are coming soon. You can still explore current Auckland nannies or register your family so your care requirements are ready when the right match appears.</p><div className="mt-7 flex flex-wrap items-center justify-center gap-3"><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Browse Auckland nannies <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] hover:bg-accent-light hover:-translate-y-0.5 transition-all">Register your family</Link></div></div></section>
        </main>
      </div>
    </>
  );
}
