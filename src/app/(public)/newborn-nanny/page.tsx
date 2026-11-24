import type { Metadata } from "next";
import Link from "next/link";
import {
  Checklist,
  EditorialGuide,
  GuideSection,
  InfoCard,
  Prose,
  SourceLink,
  Steps,
  type GuideFaq,
} from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Newborn Nanny NZ: Care, Routines, Costs and Hiring";
const description =
  "Plan newborn nanny care in New Zealand: what the role covers, routines and handover, safe sleep, costs, questions to ask and how to hire with clear boundaries.";
const path = "/newborn-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What does a newborn nanny do?", answer: "A newborn nanny provides agreed in-home care for a baby in the first months: feeding support as directed by the parents, nappy changes, settling, safe sleep routines, washing and resetting baby items, and a clear handover record. The exact duties must be agreed in advance." },
  { question: "Is a newborn nanny the same as a midwife or Plunket nurse?", answer: "No. A nanny provides agreed childcare; they are not automatically a registered midwife, nurse or medical professional. For feeding, health or development concerns, seek advice from the appropriate health professional." },
  { question: "How much does a newborn nanny cost in NZ?", answer: "There is no single newborn-nanny rate. Cost depends on hours, recent newborn experience, overnight or weekend work, the number of children and the responsibilities agreed. Build a budget around the full arrangement rather than one shift." },
  { question: "When should I hire a newborn nanny?", answer: "Start the search before the baby arrives or in the first weeks, so there is time to interview, check references, agree the role and plan the first days. A rushed hire in an exhausted household is the hardest time to make a careful decision." },
  { question: "What should I ask a newborn nanny in an interview?", answer: "Ask about recent newborn experience, feeding and settling routines they have followed, safe sleep practice, what they would do if a baby would not settle or seemed unwell, and which tasks they would refer back to a parent or health professional." },
];

export default function NewbornNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Newborn Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Newborn care planning guide"
      title={title}
      description={description}
      imageTags={["real-nanny-baby", "newborn", "family", "home"]}
      imageSeed="newborn-nanny"
      highlights={["Define newborn duties clearly", "Keep safe sleep parent-led", "Care is not clinical advice", "Plan the first weeks together"]}
      toc={[
        { id: "what-newborn-care-includes", label: "What newborn care includes" },
        { id: "care-not-clinical-advice", label: "Care is not clinical advice" },
        { id: "routines-and-handover", label: "Routines and handover" },
        { id: "safe-sleep-plan", label: "Safe sleep" },
        { id: "cost-and-hours", label: "Costs and hours" },
        { id: "how-to-hire", label: "How to hire" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and discuss whether their stated newborn experience fits your brief." },
        { href: "/night-nanny", label: "Night nanny", description: "Plan overnight newborn support with clear awake and rest boundaries." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency contacts, boundaries and a first-day home guide." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/specialist-nanny-care", label: "Specialist nanny care", description: "Plan a role around relevant individual support." },
        { href: "/nanny-interview-questions", label: "Interview questions", description: "Ask for specific examples of judgment, communication and routine care." },
      ]}
      ctaTitle="Give the first weeks a clear plan"
      ctaBody="Write down the hours, routines and support you need, then compare profiles and have an informed conversation before the baby arrives."
    >
      <GuideSection id="what-newborn-care-includes" title="What newborn nanny care can include" intro={<Prose>Newborn care is practical, agreed support in the family home during the first months. It can help a household manage feeding, settling and rest, but the role needs specific boundaries because a newborn’s needs change quickly.</Prose>}>
        <Checklist items={[
          "Feeding support as directed by the parents, including bottle preparation where instructed and bringing the baby to a parent for feeds.",
          "Nappy changes, bathing support, dressing and keeping baby-care items clean and ready.",
          "Settling support following the family’s agreed routine, and keeping a simple record of feeds, sleeps, nappies and concerns.",
          "Supervising the baby at all times during the booking, including during naps.",
          "Light child-related tidying: washing bottles, resetting the nursery and preparing the next feed or change.",
          "A calm handover so parents know what happened, what changed and what needs attention next.",
        ]} />
        <InfoCard title="Newborn care is hands-on and constant" tone="soft">A newborn cannot be left unsupervised, and a nanny caring for a baby cannot take on unrelated household work at the same time. Agree the duties honestly and allow realistic time for them.</InfoCard>
      </GuideSection>

      <GuideSection id="care-not-clinical-advice" title="A newborn nanny provides childcare, not clinical advice" intro={<Prose>The terms “newborn nanny”, “maternity nanny” and “baby nurse” are not a guarantee of a particular health qualification. Assess the person’s actual experience and the care they have agreed to provide.</Prose>}>
        <Prose>A nanny should not be asked to diagnose illness, change a feeding plan, provide medical care beyond their training or replace a midwife, GP, Plunket nurse, lactation consultant or emergency service. Give written directions for routine care and a clear escalation plan for anything outside that scope.</Prose>
        <Prose>If a baby is unwell or you are worried about feeding, sleep or development, seek qualified health advice. <SourceLink href="https://www.plunket.org.nz/plunket-and-you/services-we-offer/plunketline/">PlunketLine</SourceLink> is available to parents and caregivers of children under five in Aotearoa New Zealand for health and parenting questions.</Prose>
      </GuideSection>

      <GuideSection id="routines-and-handover" title="Routines and handover for a newborn" intro={<Prose>Newborn routines are the heart of the role. A written routine lets the nanny follow the family’s plan rather than improvising, and a short handover record keeps both sides informed.</Prose>}>
        <Steps items={[
          { title: "Write the routine down", body: "Record feeds, settling, nappy changes, sleep, bath time and any medication or allergy instructions. Update the written routine when the baby’s needs change." },
          { title: "Agree who decides what", body: "Set out which decisions the nanny can make alone, which need a parent’s input and which need a health professional. Do not leave this to guesswork in the middle of the night." },
          { title: "Keep a simple log", body: "Agree what the nanny records — feeds, sleeps, nappies, concerns — and how parents will see it. A short note at handover is enough." },
          { title: "Review together regularly", body: "Talk through what is working, what has changed and whether the routine or the hours need adjusting. Newborn needs change fast; the plan should change with them." },
        ]} />
      </GuideSection>

      <GuideSection id="safe-sleep-plan" title="Share your current safe-sleep plan" intro={<Prose>Every caregiver needs the same safe-sleep information. The plan should come from the parents and current health guidance, not be improvised by the nanny.</Prose>}>
        <Prose>Whānau Āwhina Plunket advises that pēpi sleep on their back in their own flat, firm sleep space, with their face clear of pillows, toys and loose blankets. Read <SourceLink href="https://www.plunket.org.nz/caring-for-your-child/safe-sleep/foundations-for-safe-sleep/">Plunket’s Foundations for Safe Sleep</SourceLink> with your own midwife, doctor or Plunket nurse’s advice in mind.</Prose>
        <Checklist items={[
          "Show the caregiver the baby’s usual sleep space and the routine you want followed for every sleep.",
          "Explain feeding instructions, medications, allergies and who has authority to make decisions.",
          "Give clear thresholds for waking a parent, calling a health professional or seeking emergency help.",
          "Keep parents reachable and leave current contact details, the home address and backup contacts visible.",
          "Review the plan together before the first shift and whenever the baby’s needs change.",
        ]} />
      </GuideSection>

      <GuideSection id="cost-and-hours" title="Newborn nanny costs and hours" intro={<Prose>Newborn care is not one standard product. The cost must reflect the actual time, responsibility and working conditions involved — and the role often changes as the baby grows.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Hours and patterns"><Prose>Daytime support, overnight care, weekend cover and short-notice help are different roles with different demands. Agree the pattern, the guaranteed hours and what happens when the baby’s routine changes.</Prose></InfoCard>
          <InfoCard title="Experience and scope"><Prose>Recent newborn experience can matter, but ask for concrete examples and set limits around medical or specialist tasks. A title alone does not establish competence.</Prose></InfoCard>
          <InfoCard title="Overnight work"><Prose>For repeated overnight support, use the <Link href="/night-nanny" className="text-primary underline underline-offset-2 font-semibold">night-nanny guide</Link> to define awake, on-call and rest time before agreeing pay.</Prose></InfoCard>
          <InfoCard title="Regular employment setup"><Prose>For a repeating role, consider the full pay, leave, payroll and recordkeeping arrangement rather than treating every shift as isolated. The <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> explains how to build the budget.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire a newborn nanny" intro={<Prose>Start before the baby arrives if you can. A careful hire in a calm household is far easier than one made in the exhausted first weeks.</Prose>}>
        <Steps items={[
          { title: "Write the brief early", body: "Include the expected timing, hours, feeding approach, sleep plan, home location, transport and the support you expect in the first weeks." },
          { title: "Shortlist for recent newborn experience", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles. Check stated experience with newborns, availability and verification information.</> },
          { title: "Interview for real situations", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the candidate would handle a baby who will not settle, a feeding concern or a parent who is unreachable.</> },
          { title: "Check references and evidence", body: <>Read the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> and speak with a referee who directly observed the candidate caring for a newborn.</> },
          { title: "Agree the role in writing", body: <>Record hours, duties, pay, safety information and changes in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>, and prepare the household with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>.</> },
        ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
