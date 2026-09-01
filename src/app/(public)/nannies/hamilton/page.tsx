import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { NannyCard } from "@/components/cards/NannyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicNannies } from "@/lib/data/nannies";
import { breadcrumbSchema } from "@/lib/seo";
import type { NannyProfilePublic } from "@/types";
import { ArrowRight, CalendarCheck, Check, Heart, MapPin, Search, ShieldCheck, Users } from "lucide-react";

const title = "Nannies in Hamilton — Plan Your Search";
const description = "Explore nanny care in Hamilton, understand how to hire with confidence, and share your family’s care brief with NannyOra as Hamilton availability develops.";
const path = "/nannies/hamilton";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "website", images: [{ url: "/images/hamilton-nanny-family-hero.png", width: 1536, height: 1024, alt: "Family planning nanny care at home" }] },
};

export const revalidate = 300;

const HAMILTON_AREAS = ["hamilton", "hamilton east", "rototuna", "flagstaff", "chartwell", "hillcrest", "dinsdale", "st andrews", "nawton"];

const careOptions = [
  { title: "Regular in-home care", body: "A nanny can become a consistent part of the weekday routine when you agree the hours, duties and communication clearly." },
  { title: "After-school support", body: "Care can centre on pickup, a settled afternoon, activities, homework and the handover home." },
  { title: "Care for younger children", body: "For newborns and infants, focus on recent relevant experience, parent-led routines and calm communication." },
  { title: "Specialist-informed support", body: "A thoughtful match can consider ECE, sensory-aware or neurodiverse-care experience where it is relevant to your child." },
];

const hiringSteps = [
  { icon: Users, title: "Write the brief", body: "Set out your children’s ages, Hamilton area, schedule, transport and the care that will make the week work." },
  { icon: Search, title: "Review the match", body: "When profiles are available, compare the experience, verification details and care types that matter to your family." },
  { icon: CalendarCheck, title: "Meet with purpose", body: "Use structured questions, then agree a paid trial where it is appropriate for the role." },
  { icon: Heart, title: "Start with clarity", body: "Put duties, pay, safety information and regular check-ins into a clear working plan." },
];

const faqs = [
  { question: "Can I find a nanny in Hamilton through NannyOra?", answer: "NannyOra is preparing its Hamilton service. This page will show Hamilton profiles automatically when they are publicly live. At present, the active local directory is for greater Auckland; Hamilton families can still register their care brief so NannyOra understands the support they need." },
  { question: "Which Hamilton areas can I include in my care brief?", answer: "You can share the area that is most practical for your family, including Hamilton East, Rototuna, Flagstaff, Chartwell, Hillcrest, Dinsdale, St Andrews or Nawton. Availability will depend on future active profiles and the travel areas each nanny chooses." },
  { question: "How do I hire a nanny in Hamilton safely?", answer: "Start with a clear role, check evidence that is relevant to your child, use structured interview questions, speak with referees and arrange a paid trial where appropriate. A written agreement and household safety plan should be in place before regular care starts." },
  { question: "How much does a nanny cost in Hamilton?", answer: "There is no single rate. Experience, hours, number of children, responsibilities, travel, specialist needs and the employment arrangement all affect the total. Compare the whole role, not just an advertised hourly figure." },
  { question: "Are all NannyOra profiles verified?", answer: "No. NannyOra displays different verification levels, so a listed profile is not the same as a Premium Vetted or Specialist Care profile. Read the individual profile and completed checks before you shortlist." },
  { question: "Can a Hamilton family register before profiles are live?", answer: "Yes. The family registration form lets you describe your suburb, schedule and care needs. It is a way to share your requirements; it is not a guarantee of a current Hamilton placement or response timeframe." },
];

function servesHamilton(nanny: NannyProfilePublic) {
  return [nanny.suburb, ...nanny.areasCovered].some((area) => {
    const normalised = area.toLowerCase().trim();
    return HAMILTON_AREAS.some((hamiltonArea) => normalised.includes(hamiltonArea));
  });
}

function SectionHeading({ eyebrow, title: heading, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl mb-8">
      {eyebrow ? <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">{eyebrow}</span> : null}
      <h2 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">{heading}</h2>
      {children ? <div className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">{children}</div> : null}
    </div>
  );
}

export default async function HamiltonNanniesPage() {
  const allNannies = await getPublicNannies();
  const hamiltonNannies = allNannies.filter(servesHamilton);
  const profileItems = hamiltonNannies.slice(0, 6).map((nanny, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.nannyora.co.nz/nannies/${nanny.slug}`,
    name: nanny.name,
  }));
  const schemas = [
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Nannies in Hamilton", path }]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `https://www.nannyora.co.nz${path}`,
      ...(profileItems.length > 0 ? { mainEntity: { "@type": "ItemList", itemListElement: profileItems } } : {}),
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="pb-20 md:pb-28">
        <header className="pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7"><ol className="flex items-center gap-1.5 text-xs text-muted-foreground"><li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-foreground/75">Nannies in Hamilton</li></ol></nav>
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Hamilton nanny hub</div>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">Nannies in Hamilton</h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">Plan a considered nanny search around your family’s real routine. NannyOra is preparing for Hamilton, with a practical place to understand the process and share the care your family needs.</p>
                <div className="flex flex-wrap gap-3 mt-8"><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Share your care brief <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">Browse active profiles</Link></div>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] border border-border/20 shadow-xl bg-muted"><Image src="/images/hamilton-nanny-family-hero.png" alt="Family discussing a nanny care routine at home" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /><div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none" /></div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
          <section id="hamilton-nanny-profiles" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="profiles-heading">
            <SectionHeading eyebrow="Profile availability" title="Hamilton nanny profiles"><p>This section uses the real NannyOra directory. It shows a Hamilton profile only when the nanny has listed Hamilton or one of the relevant local areas as their suburb or travel area.</p></SectionHeading>
            {hamiltonNannies.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{hamiltonNannies.slice(0, 6).map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div> : <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center rounded-[2rem] border border-amber-200/70 bg-amber-50/60 p-7 sm:p-9"><div><div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2"><ShieldCheck className="w-4 h-4" aria-hidden="true" /> Current availability</div><h3 className="font-heading text-2xl text-foreground">Hamilton profiles are not publicly live yet</h3><p className="text-sm text-foreground/75 leading-relaxed mt-3 max-w-2xl">NannyOra currently has active local coverage in greater Auckland. We will not display Auckland profiles here as if they are Hamilton matches. Register your care brief to tell us the neighbourhood, schedule and experience your family needs as Hamilton availability develops.</p></div><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 min-h-[46px] shrink-0">Register your family <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Link></div>}
          </section>

          <section id="why-hire-a-nanny-in-hamilton" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="why-heading">
            <SectionHeading eyebrow="In-home childcare" title="Why Hamilton families may choose a nanny"><p>In-home care can be especially helpful when a family needs one routine that spans work, school, activities and home life. It is less about a generic childcare label and more about the practical support that helps your particular week run smoothly.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ title: "One consistent caregiver", body: "Care can be shaped around the child’s rhythm, familiar home environment and family communication." }, { title: "A practical school-day rhythm", body: "Agree care around pickup, a calmer afternoon, snacks, activities and the handover home." }, { title: "Support for changing schedules", body: "Set hours and notice expectations that reflect your work and household commitments." }, { title: "A deliberate family fit", body: "Interview for values, communication and real care scenarios—not only experience on paper." }].map((item) => <div key={item.title} className="rounded-3xl border border-border/35 bg-card p-5 shadow-sm"><div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4"><Heart className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">If you are still deciding which format fits, explore the practical differences between a <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny and daycare</Link>, a <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny and babysitter</Link>, or a <Link href="/nanny-vs-au-pair" className="text-primary underline underline-offset-2 font-semibold">nanny and au pair</Link>.</p>
          </section>

          <section id="hamilton-care-options" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="care-heading">
            <SectionHeading eyebrow="Care options" title="Think in care needs, not just nanny titles"><p>These are useful ways to describe a family brief. They are not promises that every care type is currently available in Hamilton; future matching depends on the live local profiles and the role you need filled.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{careOptions.map((option) => <div key={option.title} className="rounded-3xl border border-border/35 bg-card p-5 shadow-sm"><h3 className="font-heading text-lg font-bold text-foreground mb-2">{option.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{option.body}</p></div>)}</div>
          </section>

          <section id="hamilton-planning-visual" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="planning-heading">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-center"><div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] border border-border/20 shadow-lg bg-muted"><Image src="/images/hamilton-after-school-care.png" alt="Nanny and child planning an after-school activity at home" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 48vw" /><div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none" /></div><div><SectionHeading eyebrow="A care-plan visual" title="Turn a busy week into a clear care brief"><p>Before you look for a nanny, map the moments that most need support. This simple planning view is designed to help Hamilton families explain their actual needs, without assuming that one solution fits every household.</p></SectionHeading><div className="relative pl-9 space-y-5 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-px before:bg-border">{[{ label: "Family schedule", body: "Work, school, travel, activities and the times where care needs to be reliable." }, { label: "Child’s routine", body: "Meals, rest, transitions, interests, communication and any support already around them." }, { label: "Care requirements", body: "Days, guaranteed hours, transport, experience, safety information and budget." }].map((item, index) => <div key={item.label} className="relative"><span className="absolute -left-9 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span><h3 className="font-heading text-lg font-bold text-foreground">{item.label}</h3><p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.body}</p></div>)}</div></div></div>
          </section>

          <section id="how-to-hire-a-nanny-in-hamilton" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="how-heading">
            <SectionHeading eyebrow="A considered hire" title="How to hire a nanny in Hamilton"><p>The core hiring process is the same wherever your family is based: define the role, assess relevant evidence, meet carefully and begin with written clarity. NannyOra’s active guidance pages can help you prepare before profiles are live locally.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{hiringSteps.map((step, index) => <div key={step.title} className="relative rounded-3xl border border-border/35 bg-card p-6 shadow-sm"><span className="absolute top-3 right-4 font-heading text-5xl font-black text-secondary">0{index + 1}</span><div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 relative"><step.icon className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground relative mb-2">{step.title}</h3><p className="text-sm text-muted-foreground leading-relaxed relative">{step.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">Prepare with <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview questions for families</Link>, the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link>, a practical <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">written agreement</Link> and the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">first-day safety guide</Link>.</p>
          </section>

          <section id="hamilton-vetting-and-safety" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="trust-heading">
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start"><div><SectionHeading eyebrow="Trust and safety" title="Good matching begins with evidence"><p>As Hamilton profiles become active, NannyOra will show verification levels rather than suggesting every person has completed identical checks. The deeper platform process combines identity, work history, relevant professional registration, references, the applicable Police vetting pathway, interview and risk assessment.</p></SectionHeading><Link href="/nanny-vetting" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">Understand the nanny vetting process <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div><div className="rounded-3xl border border-border/35 bg-secondary/35 p-6 sm:p-8"><ul className="space-y-4">{["Compare the profile’s actual verification information", "Ask for experience relevant to the child and the role", "Speak with appropriate referees", "Use a paid trial when it suits the arrangement", "Document safety, emergency and communication expectations"].map((item) => <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed"><span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0"><Check className="w-3 h-3 stroke-[3]" aria-hidden="true" /></span>{item}</li>)}</ul><p className="text-xs text-muted-foreground leading-relaxed mt-6">No background or Police check can guarantee future behaviour. Safe care also relies on sound hiring decisions, clear household information and ongoing communication.</p></div></div>
          </section>

          <section id="hamilton-nanny-cost" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="cost-heading">
            <SectionHeading eyebrow="Cost planning" title="What affects the cost of hiring a nanny in Hamilton?"><p>There is no single Hamilton nanny rate. A fair arrangement reflects the actual job: the experience needed, number of children, hours, schedule, responsibilities, travel and any specialist requirements.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{["Relevant experience and qualifications", "Regular, short-notice or non-standard hours", "Childcare duties, transport and household expectations", "Specialist support, overnight care or multiple children"].map((factor) => <div key={factor} className="rounded-2xl border border-border/35 bg-card p-4 text-sm font-semibold text-foreground/80">{factor}</div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">Plan for the whole employment arrangement, not only the hourly rate. NannyOra’s <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">platform pricing</Link> covers membership features, while the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> explains employment and payment questions that can apply to regular care.</p>
          </section>

          <section id="hamilton-areas" className="mb-20 md:mb-24 scroll-mt-28" aria-labelledby="areas-heading">
            <SectionHeading eyebrow="Your local brief" title="Hamilton areas families may include"><p>When you register, share the area that is practical for your family and any travel constraints. This helps describe your care need; it does not mean NannyOra is currently promising coverage in every neighbourhood.</p></SectionHeading>
            <div className="flex flex-wrap gap-2">{["Hamilton East", "Rototuna", "Flagstaff", "Chartwell", "Hillcrest", "Dinsdale", "St Andrews", "Nawton"].map((area) => <span key={area} className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-semibold text-foreground/75"><MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />{area}</span>)}</div>
          </section>

          <section id="hamilton-faqs" className="max-w-3xl mb-20 md:mb-24 scroll-mt-28" aria-labelledby="faq-heading"><SectionHeading eyebrow="Hamilton nanny questions" title="Frequently asked questions" /><Accordion items={faqs} /></section>

          <section className="max-w-4xl mx-auto"><div className="bg-primary rounded-[2rem] p-8 sm:p-10 md:p-12 text-center shadow-lg"><h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">Tell us what care would make a difference</h2><p className="text-white/80 leading-relaxed mt-3 max-w-2xl mx-auto">Register your Hamilton family brief with the suburb, schedule and experience you need. We’ll use it to understand local care demand as the Hamilton service develops.</p><div className="flex flex-wrap items-center justify-center gap-3 mt-7"><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-accent-light hover:-translate-y-0.5 transition-all">Register your family <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/parent-resources" className="inline-flex items-center justify-center rounded-full bg-white/95 text-primary font-semibold px-7 py-3.5 min-h-[48px] hover:bg-white hover:-translate-y-0.5 transition-all">Explore parent resources</Link></div></div></section>
        </main>
      </div>
    </>
  );
}
