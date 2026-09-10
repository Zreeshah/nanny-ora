import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Heart, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { NannyCard } from "@/components/cards/NannyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicNannies } from "@/lib/data/nannies";
import { breadcrumbSchema } from "@/lib/seo";
import type { NannyProfilePublic } from "@/types";

export type LocationHubConfig = {
  city: string;
  path: string;
  areas: string[];
  areaIntro: string;
  localContext: string;
  careIntro: string;
  planningIntro: string;
  considerations: { title: string; body: string }[];
  heroImageClass: string;
};

function matchesLocation(nanny: NannyProfilePublic, areas: string[]) {
  return [nanny.suburb, ...nanny.areasCovered].some((area) => {
    const normalised = area.toLowerCase().trim();
    return areas.some((locationArea) => normalised.includes(locationArea.toLowerCase()));
  });
}

function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl mb-8">
      {eyebrow ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">{eyebrow}</span> : null}
      <h2 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">{title}</h2>
      {children ? <div className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">{children}</div> : null}
    </div>
  );
}

export async function LocationNannyHub({ config }: { config: LocationHubConfig }) {
  const profiles = (await getPublicNannies()).filter((nanny) => matchesLocation(nanny, config.areas));
  const title = `Nannies in ${config.city} — Plan Your Search`;
  const description = `Explore nanny care in ${config.city}, understand how to hire with confidence, and share your family’s care brief with NannyOra as local availability develops.`;
  const profileItems = profiles.slice(0, 6).map((nanny, index) => ({ "@type": "ListItem", position: index + 1, url: `https://www.nannyora.co.nz/nannies/${nanny.slug}`, name: nanny.name }));
  const faqs = [
    { question: `Can I find a nanny in ${config.city} through NannyOra?`, answer: `NannyOra is preparing its ${config.city} service. This page will show ${config.city} profiles automatically when they are publicly live. At present, the active local directory is for greater Auckland; ${config.city} families can still register their care brief so NannyOra understands the support they need.` },
    { question: `Which ${config.city} areas can I include in my care brief?`, answer: `You can share the area that is practical for your family, including ${config.areas.slice(1).join(", ")}. Availability will depend on future active profiles and the travel areas each nanny chooses.` },
    { question: `How do I hire a nanny in ${config.city} safely?`, answer: "Start with a clear role, check evidence relevant to your child, use structured interview questions, speak with referees and arrange a paid trial where appropriate. A written agreement and household safety plan should be in place before regular care starts." },
    { question: `How much does a nanny cost in ${config.city}?`, answer: "There is no single local rate. Experience, hours, number of children, responsibilities, travel, specialist needs and the employment arrangement all affect the total. Compare the whole role, not only an advertised hourly figure." },
    { question: "Are all NannyOra profiles verified?", answer: "No. NannyOra displays different verification levels, so a listed profile is not the same as a Premium Vetted or Specialist Care profile. Read the individual profile and completed checks before you shortlist." },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: `Nannies in ${config.city}`, path: config.path }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `https://www.nannyora.co.nz${config.path}`, ...(profileItems.length ? { mainEntity: { "@type": "ItemList", itemListElement: profileItems } } : {}) }]} />
      <div className="pb-20 md:pb-28">
        <header className="pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7"><ol className="flex items-center gap-1.5 text-xs text-muted-foreground"><li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-foreground/75">Nannies in {config.city}</li></ol></nav>
            <div className="grid lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-14 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {config.city} nanny hub</div>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">Nannies in {config.city}</h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{config.localContext}</p>
                <div className="flex flex-wrap gap-3 mt-8"><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Share your care brief <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">Browse active profiles</Link></div>
              </div>
              <div className={`rounded-[2rem] border border-border/35 p-7 sm:p-9 shadow-sm ${config.heroImageClass}`}>
                <p className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Build a clearer care plan</p>
                <div className="space-y-5">{[{ title: "Your family rhythm", body: "Work, school, travel, activities and the moments that need reliable care." }, { title: "Your child’s needs", body: "Age, routines, interests, communication and any support that helps the day go well." }, { title: "The role", body: "Hours, transport, duties, relevant experience, safety information and budget." }].map((item, index) => <div key={item.title} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{index + 1}</span><div><h2 className="font-heading text-lg font-bold text-foreground">{item.title}</h2><p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.body}</p></div></div>)}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
          <section className="mb-20 md:mb-24" aria-labelledby="profiles-heading">
            <SectionHeading eyebrow="Profile availability" title={`${config.city} nanny profiles`}><p>This section uses the real NannyOra directory. A profile appears only when the nanny has listed {config.city} or a relevant local area as their suburb or travel area.</p></SectionHeading>
            {profiles.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{profiles.slice(0, 6).map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div> : <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center rounded-[2rem] border border-amber-200/70 bg-amber-50/60 p-7 sm:p-9"><div><div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2"><ShieldCheck className="w-4 h-4" aria-hidden="true" /> Current availability</div><h2 className="font-heading text-2xl text-foreground">{config.city} profiles are not publicly live yet</h2><p className="text-sm text-foreground/75 leading-relaxed mt-3 max-w-2xl">NannyOra currently has active local coverage in greater Auckland. We will not display Auckland profiles here as if they are {config.city} matches. Register your care brief to tell us the area, schedule and experience your family needs as local availability develops.</p></div><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 min-h-[46px] shrink-0">Register your family <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Link></div>}
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="why-heading">
            <SectionHeading eyebrow="In-home childcare" title={`Why ${config.city} families may choose a nanny`}><p>{config.careIntro}</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ title: "One consistent caregiver", body: "Care can be shaped around the child’s rhythm, familiar environment and family communication." }, { title: "A practical daily rhythm", body: "Agree care around the transitions that matter: morning, pickup, meals, play and handover." }, { title: "Clearer schedule planning", body: "Set agreed hours, guaranteed time and notice expectations that reflect the real household week." }, { title: "A considered family fit", body: "Interview for values, communication and actual care scenarios—not experience on paper alone." }].map((item) => <div key={item.title} className="rounded-3xl border border-border/35 bg-card p-5 shadow-sm"><div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4"><Heart className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">If you are deciding between formats, compare a <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny and daycare</Link>, a <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny and babysitter</Link>, or a <Link href="/nanny-vs-au-pair" className="text-primary underline underline-offset-2 font-semibold">nanny and au pair</Link>.</p>
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="areas-heading">
            <SectionHeading eyebrow="Local planning" title={`Areas of ${config.city} families can include in a care brief`}><p>{config.areaIntro}</p></SectionHeading>
            <div className="flex flex-wrap gap-3">{config.areas.slice(1).map((area) => <span key={area} className="rounded-full border border-border/40 bg-card px-4 py-2 text-sm font-semibold text-foreground/75">{area}</span>)}</div>
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="considerations-heading">
            <SectionHeading eyebrow="A local brief" title={`Details that make a ${config.city} care brief more useful`}><p>Good local content starts with useful planning detail, not unsupported promises about local availability. These prompts help a family explain the practical shape of the role to a future candidate.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 gap-4">{config.considerations.map((item) => <div key={item.title} className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm"><h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p></div>)}</div>
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="hiring-heading">
            <SectionHeading eyebrow="A considered hire" title={`How to prepare for a nanny search in ${config.city}`}><p>{config.planningIntro}</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{[{ icon: Users, title: "Write the brief", body: "Set out your children’s ages, local area, schedule, transport and the care that will make the week work." }, { icon: Search, title: "Review evidence", body: "Compare relevant experience, availability, references and visible verification details." }, { icon: Check, title: "Meet with purpose", body: "Use structured questions, then agree a paid trial where it is appropriate." }, { icon: Heart, title: "Start with clarity", body: "Put duties, pay, safety information and regular check-ins into a written plan." }].map((step, index) => <div key={step.title} className="relative rounded-3xl border border-border/35 bg-card p-6 shadow-sm"><span className="absolute top-3 right-4 font-heading text-5xl font-black text-secondary">0{index + 1}</span><div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 relative"><step.icon className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground relative mb-2">{step.title}</h3><p className="text-sm text-muted-foreground leading-relaxed relative">{step.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">Prepare with <Link href="/how-to-hire-a-nanny" className="text-primary underline underline-offset-2 font-semibold">the nanny hiring process</Link>, <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview questions</Link>, <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting guidance</Link>, a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">written agreement</Link> and the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">safety guide</Link>.</p>
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="cost-heading">
            <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 items-start"><div><SectionHeading eyebrow="Cost planning" title={`What affects the cost of hiring a nanny in ${config.city}?`}><p>There is no single city rate. A fair arrangement reflects the actual job: relevant experience, number of children, hours, responsibilities, travel and any specialist support.</p></SectionHeading><Link href="/nanny-cost" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">Plan your full nanny budget <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div><div className="rounded-3xl border border-border/35 bg-secondary/35 p-6 sm:p-8"><ul className="space-y-4">{["Relevant experience and qualifications", "Regular, short-notice or non-standard hours", "Childcare duties, transport and household expectations", "Specialist support, overnight care or multiple children", "Leave, payroll and genuine work expenses"].map((item) => <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed"><span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0"><Check className="w-3 h-3 stroke-[3]" aria-hidden="true" /></span>{item}</li>)}</ul></div></div>
          </section>

          <section className="mb-20 md:mb-24" aria-labelledby="safety-heading">
            <SectionHeading eyebrow="Trust and safety" title="Good matching begins with evidence"><p>As local profiles become active, NannyOra will show verification levels rather than suggesting every person has completed identical checks. A Police or background check is valuable evidence, but it cannot guarantee future behaviour; safety also depends on a clear role, appropriate references, household information and ongoing communication.</p></SectionHeading>
            <div className="rounded-3xl border border-border/35 bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center justify-between"><p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">Use NannyOra’s guide to understand identity, history, references, qualifications and the applicable Police-vetting pathway before a regular start date.</p><Link href="/nanny-vetting" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 min-h-[46px] shrink-0">Understand vetting <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Link></div>
          </section>

          <section className="max-w-4xl mx-auto" aria-labelledby="faq-heading"><SectionHeading eyebrow="Local FAQs" title={`Nanny care in ${config.city}: common questions`} /><Accordion items={faqs} /></section>

          <section className="max-w-4xl mx-auto mt-16 md:mt-20"><div className="bg-primary rounded-[2rem] p-8 sm:p-10 md:p-12 text-center shadow-lg"><h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">Tell us what care would make a difference</h2><p className="text-white/80 leading-relaxed mt-3 max-w-2xl mx-auto">Share your local area, schedule and family care brief. This helps NannyOra understand the support families need as local availability develops.</p><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-accent-light hover:-translate-y-0.5 transition-all mt-7">Register your family <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link></div></section>
        </main>
      </div>
    </>
  );
}

export function locationMetadata(config: LocationHubConfig): Metadata {
  const title = `Nannies in ${config.city} — Plan Your Search`;
  const description = `Explore nanny care in ${config.city}, understand how to hire with confidence, and share your family’s care brief with NannyOra as local availability develops.`;
  return { title, description, alternates: { canonical: config.path }, openGraph: { title, description, url: config.path, type: "website" } };
}
