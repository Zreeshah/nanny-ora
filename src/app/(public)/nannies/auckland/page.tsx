import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { NannyCard } from "@/components/cards/NannyCard";
import { ImageBand } from "@/components/ui/ImageBand";
import { getPublicNannies } from "@/lib/data/nannies";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, CalendarCheck, Check, Heart, MapPin, Search, ShieldCheck, Users } from "lucide-react";

const title = "Nannies in Auckland — Trusted Local Care";
const description = "Find nanny care in Auckland with NannyOra. Browse verified local profiles, compare experience and care types, and start your search.";
const path = "/nannies/auckland";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "website" },
};

export const revalidate = 300;

const careOptions = [
  { title: "Recurring nanny care", body: "Regular in-home care shaped around your children, workdays and family routine." },
  { title: "Part-time and flexible care", body: "Agreed weekly hours, shorter days or support alongside preschool, school or whānau care." },
  { title: "After-school care", body: "School pickup, afternoon routines, activities, homework and the transition home." },
  { title: "Newborn and infant care", body: "Look for relevant baby experience, calm communication and a clear parent-led routine." },
  { title: "Weekend, night or backup care", body: "Some profiles may suit non-standard hours; confirm availability and duties directly." },
  { title: "Specialist support", body: "Explore ECE, sensory-aware and neurodiverse-care experience when your child needs a more focused match." },
];

const steps = [
  { number: "01", icon: Users, title: "Share your family brief", body: "Set out your children’s ages, suburb, schedule, duties, transport and any specialist support before shortlisting." },
  { number: "02", icon: Search, title: "Browse local profiles", body: "Use the directory and profile details to compare experience, care types, availability and the verification level shown." },
  { number: "03", icon: CalendarCheck, title: "Enquire and meet", body: "Contact suitable nannies through the NannyOra family journey, ask structured questions and arrange a conversation." },
  { number: "04", icon: Heart, title: "Trial and arrange care", body: "Where appropriate, agree a paid trial, then document the role, safety information and ongoing expectations." },
];

const areas = [
  { name: "Central Auckland", suburbs: [["mount-eden", "Mount Eden"], ["ponsonby", "Ponsonby"], ["grey-lynn", "Grey Lynn"], ["parnell", "Parnell"], ["epsom", "Epsom"], ["newmarket", "Newmarket"], ["remuera", "Remuera"]] },
  { name: "North Shore", suburbs: [["devonport", "Devonport"], ["takapuna", "Takapuna"], ["albany", "Albany"], ["birkenhead", "Birkenhead"]] },
  { name: "East Auckland", suburbs: [["mission-bay", "Mission Bay"], ["st-heliers", "St Heliers"], ["meadowbank", "Meadowbank"], ["kohimarama", "Kohimarama"]] },
  { name: "West and wider Auckland", suburbs: [["henderson", "Henderson"], ["titirangi", "Titirangi"], ["mt-albert", "Mt Albert"], ["ellerslie", "Ellerslie"]] },
];

const faqs = [
  { question: "How do I find a nanny in Auckland?", answer: "Start with your children’s ages, required days, suburb, duties and must-have experience. Browse NannyOra’s Auckland directory, read each profile’s verification information and availability, then enquire with the candidates who fit your actual week." },
  { question: "Does NannyOra serve my Auckland suburb?", answer: "NannyOra currently serves greater Auckland. The directory includes area pathways, but actual availability depends on the active profiles and each nanny’s travel area. Search nearby suburbs if your first choice has no suitable profile." },
  { question: "Are all NannyOra nannies vetted?", answer: "Profiles show different verification levels. A listed profile is not the same as a Premium Vetted or Specialist Care profile. Read the status and completed checks on the individual profile, then use interviews, references and a paid trial as part of your decision." },
  { question: "Can I find a part-time or after-school nanny in Auckland?", answer: "Some profiles include recurring, after-school or other care types. Use the directory to find relevant experience, then confirm the exact schedule, school pickup, transport, guaranteed hours and holiday coverage directly." },
  { question: "Can I find newborn or specialist care in Auckland?", answer: "Yes, where a current profile has relevant experience. Explore the specialist-care pathways for ECE, sensory-aware and neurodiverse childcare, and ask candidates for concrete examples that match your child’s needs." },
  { question: "How much does a nanny cost in Auckland?", answer: "There is no single Auckland rate. Experience, hours, number of children, responsibilities, travel, specialist needs and the employment arrangement all affect the full cost. Compare the complete role, not only the advertised hourly rate, and review NannyOra’s pricing information for platform fees." },
  { question: "How quickly can I find a nanny?", answer: "Timing depends on your brief, availability, profile fit, conversations and any checks or trial you need. NannyOra does not promise a universal placement timeframe, so begin with a clear brief and allow time for a careful decision." },
];

function SectionHeading({ eyebrow, title: heading, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl mb-8">
      {eyebrow && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">{eyebrow}</span>}
      <h2 className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">{heading}</h2>
      {children && <div className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">{children}</div>}
    </div>
  );
}

export default async function AucklandNanniesPage() {
  const nannies = await getPublicNannies();
  const profileItems = nannies.slice(0, 6).map((nanny, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.nannyora.co.nz/nannies/${nanny.slug}`,
    name: nanny.name,
  }));
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Nannies in Auckland", path }]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `https://www.nannyora.co.nz${path}`,
      about: { "@type": "Service", name: "Nanny care in Auckland", areaServed: { "@type": "City", name: "Auckland", addressCountry: "NZ" } },
      ...(profileItems.length > 0 ? { mainEntity: { "@type": "ItemList", itemListElement: profileItems } } : {}),
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="pb-20 md:pb-28">
        <header className="pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-7"><ol className="flex items-center gap-1.5 text-xs text-muted-foreground"><li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-foreground/75">Nannies in Auckland</li></ol></nav>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Auckland nanny directory</div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.05] tracking-tight mb-6">Nannies in Auckland</h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">Find in-home childcare across greater Auckland with NannyOra. Browse real local profiles, compare relevant experience and care types, and take the next step when a nanny fits your family’s routine.</p>
              <div className="flex flex-wrap gap-3 mt-8"><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-primary-light hover:-translate-y-0.5 transition-all">Find a nanny <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/how-it-works" className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/50 font-semibold px-7 py-3.5 min-h-[48px] hover:bg-muted hover:-translate-y-0.5 transition-all">How NannyOra works</Link></div>
            </div>
            <ImageBand tags={["suburb", "auckland", "agency", "find"]} seed="nannies-auckland" count={3} aspect="aspect-[16/6]" priority className="mt-12" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
          <section id="auckland-nanny-profiles" aria-labelledby="profiles-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8"><SectionHeading eyebrow="Start here" title="Browse Auckland nanny profiles"><p>Compare the information shown on each profile: suburb, experience, care types, availability, rate and verification level. A profile is a starting point for a conversation—not a promise that the nanny is available for every schedule.</p></SectionHeading><Link href="/find-a-nanny" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors shrink-0">Open the full directory <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div>
            {nannies.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{nannies.slice(0, 6).map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div> : <div className="rounded-3xl border border-border/35 bg-secondary/35 p-8 text-center"><p className="text-muted-foreground">There are no profiles to display in this directory right now. Use the full search to check nearby availability or register your family so your care brief is ready.</p><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold px-6 py-3 mt-5">Search Auckland nannies <ArrowRight className="w-4 h-4 ml-2" /></Link></div>}
          </section>

          <section id="why-auckland-families-choose-nanny-care" aria-labelledby="why-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="In-home childcare" title="Why Auckland families choose nanny care"><p>A nanny can make the day easier when care needs to happen at home, around school, or outside standard centre hours. The value is in the fit: one adult, an agreed routine and a role that reflects your children rather than a generic timetable.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ title: "One-to-one attention", body: "Care can follow your child’s pace, interests, naps, feeds and transitions." }, { title: "A flexible home routine", body: "Agree care around work, school pickup, activities and the parts of the week that need the most help." }, { title: "Continuity for children", body: "A familiar caregiver can support consistent handovers, routines and communication with parents." }, { title: "Support for working parents", body: "Keep the practical day moving with childcare, child-related meals, outings and agreed transport." }].map((item) => <div key={item.title} className="bg-card rounded-3xl border border-border/35 p-5 shadow-sm"><div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4"><Heart className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">A nanny is not the only good childcare option. If you are still deciding, compare the practical differences in our <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny vs daycare guide</Link> and <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny vs babysitter guide</Link>.</p>
          </section>

          <section id="auckland-nanny-care-types" aria-labelledby="care-types-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="Care options" title="Nanny care in Auckland can take different shapes"><p>Use care type as a starting filter, then check the individual profile and discuss the actual hours and duties. NannyOra’s live directory—not this list—determines which options are currently available.</p></SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{careOptions.map((option) => <div key={option.title} className="rounded-3xl border border-border/35 bg-card p-5 shadow-sm"><h3 className="font-heading text-lg font-bold text-foreground mb-2">{option.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{option.body}</p></div>)}</div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 mt-6"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"><div><h3 className="font-heading text-2xl font-bold mb-2">Looking for more individual support?</h3><p className="text-sm text-white/80 leading-relaxed max-w-2xl">Read how to plan a specialist match, including ECE, sensory-aware and neurodiverse-care experience, before you shortlist.</p></div><Link href="/specialist-nanny-care" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-6 py-3 min-h-[44px] shrink-0">Specialist nanny care <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Link></div></div>
          </section>

          <section id="how-nannyora-works-in-auckland" aria-labelledby="process-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="The local journey" title="How NannyOra works for Auckland families"><p>The Auckland directory helps you move from a broad care need to a considered conversation. The final hiring decision remains with your family, and each employment arrangement should be documented appropriately.</p></SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{steps.map((step) => <div key={step.number} className="relative bg-card rounded-3xl border border-border/35 p-6 shadow-sm"><span className="font-heading text-5xl font-black text-secondary absolute top-3 right-4">{step.number}</span><div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 relative"><step.icon className="w-5 h-5" aria-hidden="true" /></div><h3 className="font-heading text-lg font-bold text-foreground mb-2 relative">{step.title}</h3><p className="text-sm text-muted-foreground leading-relaxed relative">{step.body}</p></div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] mt-6">Before committing, use <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">structured interview questions</Link>, review the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">NannyOra vetting guide</Link>, and prepare the role with the <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract</Link> and <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">safety guide</Link>.</p>
          </section>

          <section id="auckland-trust-and-vetting" aria-labelledby="trust-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start"><div><SectionHeading eyebrow="Trust matters" title="Read the verification information before you shortlist"><p>NannyOra profiles can show different verification levels. The platform’s seven-part safety-check system covers identity, work history, professional registration where relevant, referee checks, the applicable Police vetting pathway, interview and risk assessment.</p></SectionHeading><Link href="/nanny-vetting" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">See how nanny vetting works <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div><div className="rounded-3xl border border-border/35 bg-secondary/35 p-6 sm:p-8"><ul className="space-y-4">{["Open the profile and read its verification level", "Check experience relevant to your child’s age and routine", "Ask for role-relevant references and examples", "Use a paid trial where appropriate", "Keep a written safety and employment plan"].map((item) => <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed"><span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0"><Check className="w-3 h-3 stroke-[3]" aria-hidden="true" /></span>{item}</li>)}</ul><div className="flex items-start gap-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 p-4 mt-6"><ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" /><p className="text-xs text-amber-900/80 leading-relaxed">A Police vet is one point-in-time input, not a guarantee of future behaviour. Families still need to interview, check fit and supervise the arrangement.</p></div></div></div>
          </section>

          <section id="auckland-nanny-cost" aria-labelledby="cost-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="Plan the full role" title="How much does a nanny cost in Auckland?"><p>Nanny rates vary by the actual role. Experience, number of children, hours, responsibilities, location and specialist requirements all affect what a fair arrangement may cost. Non-standard hours, travel, activities and backup care can also change the total.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{["Experience and relevant qualifications", "Hours, schedule and guaranteed work", "Children, duties and transport", "Specialist, overnight or short-notice care"].map((factor) => <div key={factor} className="bg-card rounded-2xl border border-border/35 p-4 text-sm font-semibold text-foreground/80">{factor}</div>)}</div>
            <p className="text-[15px] text-muted-foreground leading-[1.8]">Compare the full cost of the arrangement, including any employment, payroll, leave, mileage or activity considerations. NannyOra’s <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">platform pricing</Link> explains membership features; it is separate from the nanny’s pay and household employment responsibilities. The national <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> is the right place to understand those obligations.</p>
          </section>

          <section id="auckland-areas" aria-labelledby="areas-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="Greater Auckland" title="Browse Auckland areas"><p>NannyOra currently serves greater Auckland. These area pathways help families narrow a search, while profile availability and each nanny’s travel area determine whether a match is practical.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 gap-5">{areas.map((area) => <div key={area.name} className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm"><h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-accent" aria-hidden="true" />{area.name}</h3><div className="flex flex-wrap gap-2">{area.suburbs.map(([slug, suburb]) => <Link key={slug} href={`/nannies/auckland/${slug}`}><Badge variant="outline" size="md" className="cursor-pointer hover:border-primary transition-colors">{suburb}</Badge></Link>)}</div></div>)}</div>
            <p className="text-xs text-muted-foreground mt-4">A suburb page is a directory pathway, not a promise that a nanny is currently available there. Search nearby areas when your first choice has no suitable profile.</p>
          </section>

          <section id="auckland-parent-resources" aria-labelledby="resources-heading" className="mb-20 md:mb-24 scroll-mt-28">
            <SectionHeading eyebrow="Keep planning" title="Resources for Auckland parents"><p>The right resource depends on the decision in front of you. NannyOra’s parent hub brings the practical guides together, while these pages cover the parts of a nanny arrangement that deserve extra care.</p></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[{ href: "/parent-resources", label: "Parent resources", body: "The complete planning hub." }, { href: "/nanny-interview-questions", label: "Interview questions", body: "Test judgment and family fit." }, { href: "/nanny-contract", label: "Nanny contract", body: "Put the role in writing." }, { href: "/nanny-safety", label: "Nanny safety", body: "Prepare the first day." }].map((item) => <Link key={item.href} href={item.href} className="group rounded-3xl border border-border/35 bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"><h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</h3><p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.body}</p></Link>)}</div>
          </section>

          <section id="auckland-faqs" aria-labelledby="faq-heading" className="max-w-3xl mb-20 md:mb-24 scroll-mt-28"><SectionHeading eyebrow="Auckland nanny questions" title="Frequently asked questions" /><Accordion items={faqs} /></section>

          <section className="max-w-4xl mx-auto"><div className="bg-primary rounded-[2rem] p-8 sm:p-10 md:p-12 text-center shadow-lg"><h2 className="font-heading text-3xl md:text-4xl text-primary-foreground">Ready to find the right nanny in Auckland?</h2><p className="text-white/80 leading-relaxed mt-3 max-w-2xl mx-auto">Start with your family’s real schedule, browse local profiles and take the next step when the experience, availability and care approach fit.</p><div className="flex flex-wrap items-center justify-center gap-3 mt-7"><Link href="/find-a-nanny" className="inline-flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold px-7 py-3.5 min-h-[48px] shadow-sm hover:bg-accent-light hover:-translate-y-0.5 transition-all">Find a nanny <ArrowRight className="w-4.5 h-4.5 ml-2" aria-hidden="true" /></Link><Link href="/register-family" className="inline-flex items-center justify-center rounded-full bg-white/95 text-primary font-semibold px-7 py-3.5 min-h-[48px] hover:bg-white hover:-translate-y-0.5 transition-all">Register your family</Link></div></div></section>
        </main>
      </div>
    </>
  );
}
