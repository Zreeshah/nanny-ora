import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { NannyCard } from "@/components/cards/NannyCard";
import { ImageBand } from "@/components/ui/ImageBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicNannies } from "@/lib/data/nannies";
import {
  getHobsonvilleCoverage,
  getHobsonvilleNannies,
  hasIndexableHobsonvilleCoverage,
  HOBSONVILLE_AREAS,
  HOBSONVILLE_PATH,
  NORTHWEST_AUCKLAND_PATH,
} from "@/lib/northwest-auckland";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { ArrowRight, CalendarCheck, ClipboardList, MapPin, Search, Users } from "lucide-react";

const title = "Nannies in Hobsonville | Find a Local Nanny";
const description = "Plan in-home childcare in Hobsonville and Hobsonville Point. NannyOra will list profiles here only when they explicitly confirm local coverage.";

export const revalidate = 300;

const faqs = [
  {
    question: "Are NannyOra nannies currently available in Hobsonville?",
    answer: "NannyOra does not currently show a public profile that explicitly lists Hobsonville or Hobsonville Point. This page is ready to show local profiles as they are added. Families can browse the wider Auckland directory and register a clear care brief in the meantime.",
  },
  {
    question: "Will a nanny who covers West Auckland automatically appear here?",
    answer: "No. Broad West Auckland or Auckland coverage alone is not treated as a confirmed Hobsonville match. A profile appears here only when the nanny lists Hobsonville or Hobsonville Point as their suburb or stated travel area.",
  },
  {
    question: "What should I confirm about a Hobsonville nanny’s travel?",
    answer: "Discuss the exact pickup or drop-off route, parking, travel time, start and finish times, and whether the arrangement still works when school, activities or household routines change. Confirm those details directly before you shortlist.",
  },
  {
    question: "Can I hire a nanny for after-school care in Hobsonville?",
    answer: "Yes, families can seek care around the school-day schedule. Set out the required pickup window, transport expectations, homework or activity support, meal routine and finish time in your care brief so candidates can judge whether the role is a practical fit.",
  },
  {
    question: "How do I check a nanny before an interview?",
    answer: "Read the verification level and completed checks shown on the individual profile, then use role-relevant interview questions, references and a paid trial where appropriate. A Police vet is one part of a wider, thoughtful hiring process.",
  },
];

const planningSteps = [
  {
    icon: ClipboardList,
    title: "Set out the weekly rhythm",
    body: "Include the children’s ages, care days, pickup windows, meals, activities, household routines and preferred start date.",
  },
  {
    icon: MapPin,
    title: "Make travel practical",
    body: "Be clear about the exact route, transport expectations, parking and how changes to the day will be handled.",
  },
  {
    icon: Search,
    title: "Compare real profile details",
    body: "Look at experience, stated care types, availability, travel coverage and verification information before you enquire.",
  },
  {
    icon: CalendarCheck,
    title: "Interview for the actual role",
    body: "Use your written brief to discuss communication, routines, reliability and a paid trial where it is appropriate.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const nannies = getHobsonvilleNannies(await getPublicNannies());
  const isIndexable = hasIndexableHobsonvilleCoverage(nannies);
  const liveDescription = nannies.length > 0
    ? `Browse ${nannies.length} current Hobsonville nanny profile${nannies.length === 1 ? "" : "s"} that explicitly list Hobsonville or Hobsonville Point coverage on NannyOra.`
    : description;

  return {
    title,
    description: liveDescription,
    alternates: { canonical: HOBSONVILLE_PATH },
    robots: isIndexable ? undefined : { index: false, follow: true },
    openGraph: { title, description: liveDescription, url: HOBSONVILLE_PATH, type: "website" },
  };
}

export default async function HobsonvilleNanniesPage() {
  const nannies = getHobsonvilleNannies(await getPublicNannies());
  const coverage = getHobsonvilleCoverage(nannies);
  const hasProfiles = nannies.length > 0;
  const isIndexable = hasIndexableHobsonvilleCoverage(nannies);
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Nannies in Auckland", path: "/nannies/auckland" },
      { name: "Northwest Auckland", path: NORTHWEST_AUCKLAND_PATH },
      { name: "Hobsonville", path: HOBSONVILLE_PATH },
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: hasProfiles ? "Current NannyOra profiles that explicitly list Hobsonville or Hobsonville Point coverage." : description,
      url: `https://www.nannyora.co.nz${HOBSONVILLE_PATH}`,
      about: { "@type": "Thing", name: "In-home childcare in Hobsonville, Auckland" },
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
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/nannies/auckland" className="hover:text-primary transition-colors">Nannies in Auckland</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={NORTHWEST_AUCKLAND_PATH} className="hover:text-primary transition-colors">Northwest Auckland</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground/75">Hobsonville</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Hobsonville care planning</div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">Nannies in Hobsonville</h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">{hasProfiles ? "Browse NannyOra profiles that explicitly list Hobsonville or Hobsonville Point coverage. Compare the practical profile information shown, then confirm the route and weekly schedule before you enquire." : "Planning in-home childcare in Hobsonville or Hobsonville Point? This focused local guide is ready for confirmed local profiles. NannyOra does not currently have a public profile that explicitly lists either area."}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Browse Auckland nannies <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link>
                <Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">Register your family</Link>
              </div>
            </div>
            <ImageBand tags={["suburb", "auckland", "family", "care"]} seed="hobsonville-nannies" count={2} aspect="aspect-[16/6]" priority className="mt-12" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
          {!hasProfiles && (
            <section aria-labelledby="coming-soon-heading" className="mb-20 md:mb-24 rounded-[2rem] border border-accent/25 bg-accent/10 p-7 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Local profiles coming soon</p>
                  <h2 id="coming-soon-heading" className="font-heading text-3xl sm:text-4xl text-foreground">A Hobsonville listing should mean a real local travel commitment.</h2>
                  <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">This page will not treat a broad Auckland or West Auckland label as proof that a nanny can take on a Hobsonville role. Profiles appear here only when the nanny has explicitly named Hobsonville or Hobsonville Point as a base or travel area.</p>
                </div>
                <div className="rounded-3xl border border-border/35 bg-card p-6">
                  <Users className="h-6 w-6 text-accent mb-4" aria-hidden="true" />
                  <h3 className="font-heading text-xl text-foreground">When will this page be indexed?</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">It will become search-indexable once NannyOra has at least two public profiles with explicit Hobsonville or Hobsonville Point coverage.</p>
                </div>
              </div>
            </section>
          )}

          {hasProfiles && (
            <section aria-labelledby="profiles-heading" className="mb-20 md:mb-24">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
                <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Current profile coverage</p><h2 id="profiles-heading" className="font-heading text-3xl sm:text-4xl text-foreground">Nanny profiles for Hobsonville</h2><p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">The profiles below explicitly list {coverage.join(" or ") || "Hobsonville coverage"}. Confirm the exact route, weekly hours and role requirements directly before you shortlist.</p></div>
                {!isIndexable && <Badge variant="outline" size="md">Local directory growing</Badge>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{nannies.map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div>
            </section>
          )}

          <section aria-labelledby="areas-heading" className="mb-20 md:mb-24 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">The local area</p>
              <h2 id="areas-heading" className="font-heading text-3xl sm:text-4xl text-foreground">One Hobsonville page, with a useful local focus</h2>
              <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">This page is deliberately limited to Hobsonville and Hobsonville Point. It supports a practical search for in-home childcare without creating thin pages for every nearby area. For the wider cluster, use the Northwest Auckland hub.</p>
              <div className="mt-6 flex flex-wrap gap-3">{HOBSONVILLE_AREAS.map((area) => <Badge key={area} variant="outline" size="md">{area}</Badge>)}</div>
              <Link href={NORTHWEST_AUCKLAND_PATH} className="mt-7 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors">View the Northwest Auckland nanny hub <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-3xl bg-primary p-7 sm:p-9 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">After-school and family routine planning</p>
              <h3 className="font-heading text-2xl">A short route can still be an important conversation.</h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/80">Ask how a candidate would manage pickup timing, activities, meals, communication, rainy-day changes and the handover at the end of the day. The answers should fit your family&apos;s actual rhythm, not just a map pin.</p>
            </div>
          </section>

          <section aria-labelledby="steps-heading" className="mb-20 md:mb-24">
            <div className="max-w-3xl mb-8"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Prepare a clear brief</p><h2 id="steps-heading" className="font-heading text-3xl sm:text-4xl text-foreground">How to plan a Hobsonville nanny search</h2><p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">The most useful local search is specific enough for a nanny to assess the job honestly. These details also give your family a stronger basis for comparing candidates.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{planningSteps.map((step, index) => <div key={step.title} className="relative rounded-3xl border border-border/35 bg-card p-6 shadow-sm"><span className="font-heading text-5xl font-black text-secondary absolute right-4 top-3">0{index + 1}</span><div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent"><step.icon className="h-5 w-5" aria-hidden="true" /></div><h3 className="relative font-heading text-lg font-bold text-foreground mb-2">{step.title}</h3><p className="relative text-sm leading-relaxed text-muted-foreground">{step.body}</p></div>)}</div>
          </section>

          <section aria-labelledby="guides-heading" className="mb-20 md:mb-24 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-border/35 bg-card p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Make a thoughtful choice</p><h2 id="guides-heading" className="font-heading text-3xl text-foreground">Location is only one part of a safe, suitable match.</h2><p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">Use the same care with verification, interviews, references, employment planning and a paid trial where appropriate as you do with travel and availability.</p><Link href="/how-to-hire-a-nanny" className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary-light transition-colors">Follow the nanny hiring process <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div>
            <div className="rounded-3xl bg-secondary p-7 sm:p-9"><h2 className="font-heading text-2xl text-foreground">Useful guides for families</h2><p className="mt-3 text-sm text-muted-foreground leading-relaxed">Build your shortlist with reliable, role-relevant information—not a postcode alone.</p><div className="mt-6 grid gap-3 text-sm font-semibold"><Link href="/how-it-works" className="text-primary hover:text-primary-light transition-colors">See how NannyOra matching works</Link><Link href="/nanny-vetting" className="text-primary hover:text-primary-light transition-colors">Read how NannyOra vetting works</Link><Link href="/nanny-interview-questions" className="text-primary hover:text-primary-light transition-colors">Prepare nanny interview questions</Link><Link href="/nanny-cost" className="text-primary hover:text-primary-light transition-colors">Plan the full cost of a nanny</Link><Link href="/nanny-payroll" className="text-primary hover:text-primary-light transition-colors">Understand nanny payroll responsibilities</Link><Link href="/pricing" className="text-primary hover:text-primary-light transition-colors">Review NannyOra platform pricing</Link><Link href="/parent-resources" className="text-primary hover:text-primary-light transition-colors">Explore parent resources</Link><Link href="/find-a-nanny" className="text-primary hover:text-primary-light transition-colors">Browse current Auckland nannies</Link></div></div>
          </section>

          <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto mb-20 md:mb-24"><p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Hobsonville nanny questions</p><h2 id="faq-heading" className="font-heading text-3xl sm:text-4xl text-foreground mb-8">Frequently asked questions</h2><Accordion items={faqs} /></section>

          <section className="max-w-4xl mx-auto"><div className="rounded-[2rem] bg-secondary p-8 sm:p-10 md:p-12 text-center border border-border/35"><h2 className="font-heading text-3xl md:text-4xl text-foreground">Start your Hobsonville nanny search with a clear brief.</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-relaxed">Local profiles are coming soon. You can still browse current Auckland nannies or register your family so your requirements are ready when a suitable local match appears.</p><div className="mt-7 flex flex-wrap items-center justify-center gap-3"><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Browse Auckland nannies <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] hover:bg-accent-light hover:-translate-y-0.5 transition-all">Register your family</Link></div></div></section>
        </main>
      </div>
    </>
  );
}
