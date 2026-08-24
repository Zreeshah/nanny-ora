import type { Metadata } from "next";
import Link from "next/link";
import { EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Parent Resources: Guides for Hiring and Working With a Nanny";
const description = "Practical NannyOra resources for parents: choosing childcare, vetting, nanny interview questions, contracts, payroll, safety and individual support planning.";
const path = "/parent-resources";

export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };

const faqs: GuideFaq[] = [
  { question: "Where should I start when hiring a nanny?", answer: "Start with your family care brief: children’s ages, schedule, location, essential duties, budget, transport and safety needs. Then browse profiles, shortlist against the same criteria, interview, check evidence and arrange a paid trial before regular care begins." },
  { question: "Which parent resources are most important before a nanny starts?", answer: "The core set is a clear role brief, appropriate vetting, structured interview questions, a written agreement, correct payroll setup where relevant, and a household safety and emergency guide." },
  { question: "Are NannyOra resources legal advice?", answer: "No. These guides are practical starting points for New Zealand families. Employment, tax, privacy, immigration and health obligations can depend on the arrangement, so check current official guidance or seek professional advice where needed." },
  { question: "Can I use these resources for a babysitter or au pair?", answer: "Many principles apply—clear expectations, safety information, references and respectful communication. The details should match the role. Use the comparison guides before assuming that a regular nanny, occasional babysitter and live-in arrangement carry the same responsibilities." },
];

const resources = [
  { group: "Choose your care", links: [
    { href: "/nanny-vs-daycare", label: "Nanny vs daycare", body: "Compare individual home care with a group centre routine." },
    { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", body: "Work out whether your need is regular care or occasional help." },
    { href: "/nanny-vs-au-pair", label: "Nanny vs au pair", body: "Understand the added decisions in a live-in arrangement." },
    { href: "/specialist-nanny-care", label: "Specialist nanny care", body: "Plan an individual match for additional support needs." },
  ] },
  { group: "Hire with confidence", links: [
    { href: "/nanny-vetting", label: "Nanny vetting", body: "Check identity, references, qualifications and verification evidence." },
    { href: "/nanny-interview-questions", label: "Nanny interview questions", body: "Ask useful questions about care, safety and communication." },
    { href: "/verification-process", label: "NannyOra verification", body: "See how profile checks and verification status are presented." },
    { href: "/trust-and-safety", label: "Trust and safety", body: "Understand shared responsibilities for a safe match." },
  ] },
  { group: "Set up the arrangement", links: [
    { href: "/nanny-contract", label: "Nanny contract guide", body: "Put hours, duties, pay and expectations into writing." },
    { href: "/nanny-payroll", label: "Nanny payroll guide", body: "Work through tax, status and household-employer questions." },
    { href: "/nanny-safety", label: "Nanny safety guide", body: "Prepare emergency details, routines, transport and the first day." },
    { href: "/childcare-support", label: "Childcare support options", body: "Explore support information for eligible Auckland families." },
  ] },
];

export default function ParentResourcesPage() {
  const schemas = [articleSchema({ headline: title, description, path, datePublished: "2026-08-24" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Parent Resources", path }]), faqSchema(faqs)];
  return (
    <EditorialGuide eyebrow="NannyOra family hub" title={title} description={description} imageTags={["family", "planning", "care", "home"]} imageSeed="parent-resources" highlights={["Choose with clarity", "Hire with evidence", "Set up a fair role", "Keep support practical"]}
      toc={[{ id: "where-to-start", label: "Where to start" }, { id: "resource-library", label: "Resource library" }, { id: "hiring-path", label: "Your hiring path" }, { id: "working-relationship", label: "A strong working relationship" }, { id: "when-you-need-help", label: "When you need more help" }]}
      schemas={schemas} faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland profiles and use the filters to start a shortlist." },
        { href: "/how-it-works", label: "How NannyOra works", description: "Understand profile discovery, enquiries and the platform journey." },
        { href: "/specialist-nanny-care", label: "Specialist nanny care", description: "Plan a careful match for individual support needs." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "See the evidence to collect before making an offer." },
        { href: "/nanny-contract", label: "Nanny contract guide", description: "Create written clarity for a regular role." },
        { href: "/nanny-safety", label: "Nanny safety guide", description: "Prepare your home and the first handover." },
      ]}
      ctaTitle="Turn a care gap into a clear plan" ctaBody="Start with your family’s real schedule, then browse Auckland nanny profiles when you are ready to meet candidates.">
      <GuideSection id="where-to-start" title="Start with the problem your family needs childcare to solve" intro={<Prose>Good childcare planning starts before you open a profile or book a tour. Name the pressure points in your week: work and commute, school pickup, naps, holidays, a child’s routines, care for siblings, an upcoming return to work or a need for individual support.</Prose>}>
        <Prose>Once the problem is clear, the resources below help you make decisions in the right order. They are designed to sit together: comparison guides help you choose a format, vetting and interview guides help you choose a person, and contract, payroll and safety guides help you make the arrangement workable after the match.</Prose>
      </GuideSection>
      <GuideSection id="resource-library" title="The parent resource library" intro={<Prose>Use the guide that matches the decision in front of you. Each link leads to a live NannyOra page, so you can move deeper without being sent to a planned or generic topic page.</Prose>}>
        <div className="space-y-10">{resources.map((section) => <div key={section.group}><h3 className="font-heading text-2xl font-bold text-foreground mb-4">{section.group}</h3><div className="grid sm:grid-cols-2 gap-4">{section.links.map((item) => <Link key={item.href} href={item.href} className="group rounded-3xl border border-border/35 bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"><h4 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</h4><p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.body}</p></Link>)}</div></div>)}</div>
      </GuideSection>
      <GuideSection id="hiring-path" title="A simple path from ‘we need help’ to a settled first month" intro={<Prose>You do not need to do everything at once. Work through the next sensible decision, keep notes, and give the child and caregiver enough time to settle into a clear routine.</Prose>}>
        <Steps items={[{ title: "Define the care brief", body: "List ages, schedule, location, duties, transport, must-have experience, budget and the support already around your child." }, { title: "Choose the format", body: <>Use the <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny vs daycare</Link>, babysitter and au pair comparisons to decide which model fits your real week.</> }, { title: "Search and shortlist", body: <>When individual care is right, <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">browse NannyOra profiles</Link> and assess every candidate against the same essentials.</> }, { title: "Interview, check and trial", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview guide</Link>, appropriate <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting</Link> and a paid trial before agreeing regular care.</> }, { title: "Set up the relationship", body: <>Use the <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">contract</Link>, <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">payroll</Link> and <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">safety</Link> resources before the first day.</> }]} />
      </GuideSection>
      <GuideSection id="working-relationship" title="What makes a nanny arrangement work after the hire" intro={<Prose>The strongest matches are not the ones where nobody needs to ask a question. They are the ones where expectations are specific enough for a nanny to act confidently and a parent to raise concerns early.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4"><InfoCard title="Keep the plan visible">Use a simple home guide for routines, allergies, medication, transport, screen boundaries, contacts and who can collect your child. Update it when something changes.</InfoCard><InfoCard title="Make feedback ordinary">Create short daily handovers and regular check-ins. Discuss what is working, what your child is finding hard and whether the agreed duties or hours need a documented change.</InfoCard><InfoCard title="Respect the role">A nanny is a childcare professional or worker, not automatically a general household manager. Agree extra tasks, costs and schedule changes before they become expectations.</InfoCard><InfoCard title="Review the fit">A trial or first month is a chance to see how the arrangement feels for everyone. Be fair, direct and timely when a change is needed.</InfoCard></div>
      </GuideSection>
      <GuideSection id="when-you-need-help" title="When you need more support" intro={<Prose>Some family situations need a more individual search. That may be a newborn transition, sensory-aware care, neurodiverse experience, a complicated school routine or an eligible support pathway. Use the relevant resources, then speak plainly with candidates about what they have actually done and what they can safely take on.</Prose>}>
        <Prose>For Auckland families, NannyOra’s <Link href="/specialist-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">specialist childcare</Link>, <Link href="/ece-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">ECE nanny</Link>, <Link href="/sensory-aware-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">sensory-aware</Link> and <Link href="/neurodiverse-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">neurodiverse childcare</Link> pathways help you start a more focused conversation. NannyOra currently serves greater Auckland.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
