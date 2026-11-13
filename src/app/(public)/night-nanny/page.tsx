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

const title = "Night Nanny for Newborns: Overnight Care, Costs and Questions";
const description = "Understand newborn night-nanny care in New Zealand: overnight duties, safe-sleep planning, costs, questions to ask and how to hire with clear boundaries.";
const path = "/night-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What does a night nanny do for a newborn?", answer: "The role varies by family. It can include settling support, nappy changes, an agreed feeding routine, bottle preparation where directed, keeping a care log and a calm morning handover. The duties, whether the caregiver is awake, and what happens if the baby is unwell must be agreed in advance." },
  { question: "Is a night nanny the same as a baby nurse?", answer: "Not necessarily. Names are used differently. A nanny provides agreed in-home childcare; they are not automatically a registered nurse, midwife or medical professional. For medical, feeding or postnatal concerns, seek advice from the appropriate health professional." },
  { question: "How much does overnight newborn care cost?", answer: "There is no single overnight-care rate. Cost depends on whether the caregiver is awake or on call, the duration, newborn experience, feeding and settling responsibilities, travel, the number of children and the regularity of the booking. Agree the complete scope before agreeing pay." },
  { question: "Can a night nanny care for a breastfeeding baby?", answer: "A family can agree practical support around a parent-led feeding plan, such as bringing the baby to the parent, changing and resettling afterwards. The arrangement should respect the family’s chosen feeding plan and never replace clinical or lactation advice." },
  { question: "What safe-sleep information should I give a night nanny?", answer: "Show the caregiver the baby’s normal sleep setup, the family’s current safe-sleep plan, emergency contacts and the circumstances in which they should wake or call a parent. Keep the plan aligned with advice from your midwife, doctor, Plunket nurse or other qualified health professional." },
];

export default function NightNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-14" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Night Nanny for Newborns", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Newborn care planning guide"
      title={title}
      description={description}
      imageTags={["real-nanny-baby", "newborn", "night-care", "family", "home"]}
      imageSeed="night-nanny-newborn-care"
      highlights={["Define overnight duties", "Keep safe sleep parent-led", "Price the actual shift", "Plan the morning handover"]}
      toc={[
        { id: "what-night-care-includes", label: "What overnight care includes" },
        { id: "care-not-clinical-advice", label: "Care is not clinical advice" },
        { id: "safe-sleep-plan", label: "Share a safe-sleep plan" },
        { id: "cost-and-hours", label: "Costs and hours" },
        { id: "questions-to-ask", label: "Questions to ask" },
        { id: "first-night", label: "Plan the first night" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and discuss whether their stated care experience fits your brief." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency contacts, boundaries and a first-day home guide." },
        { href: "/nanny-interview-questions", label: "Interview questions", description: "Ask for specific examples of judgment, communication and routine care." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Put overnight hours, responsibilities and changes in writing." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Work through pay and recordkeeping for a regular arrangement." },
      ]}
      ctaTitle="Find support that fits your family’s overnight plan"
      ctaBody="Write down the hours, practical duties and support you need, then use the directory to compare profiles and have an informed conversation."
    >
      <GuideSection id="what-night-care-includes" title="What overnight newborn care can include" intro={<Prose>Night-nanny care is practical, agreed support in the family home. It can help a household manage the exhausting early weeks, but the role needs specific boundaries because “overnight help” can mean very different things to different families.</Prose>}>
        <Checklist items={[
          "A planned feeding and settling routine directed by the parent or relevant health professional.",
          "Nappy changes, bringing baby to a parent for feeds, bottle preparation when instructed, and resettling afterwards.",
          "Keeping a simple handover record of agreed events such as feeds, sleeps, nappies or concerns.",
          "Washing or resetting baby-care items only where that is expressly included in the role.",
          "A calm morning handover so the parent knows what happened and what needs attention next.",
        ]} />
        <InfoCard title="Define awake, on-call and rest time" tone="important">Do not use “sleeping over” as a substitute for a real shift description. Confirm whether the caregiver is expected to remain awake, respond when called, or has an agreed opportunity to rest; then set the pay, facilities and expectations accordingly.</InfoCard>
      </GuideSection>

      <GuideSection id="care-not-clinical-advice" title="A night nanny provides childcare, not clinical advice" intro={<Prose>The terms “night nanny”, “newborn nanny” and “baby nurse” are not a guarantee of a particular health qualification. Assess the person’s actual experience and the care they have agreed to provide.</Prose>}>
        <Prose>A nanny should not be asked to diagnose illness, prescribe treatment, change a feeding plan, provide medical care beyond their training or replace a midwife, GP, Plunket nurse, lactation consultant or emergency service. Give written directions for routine care and a clear escalation plan for anything outside that scope.</Prose>
        <Prose>If a newborn is unwell or you are worried about feeding, sleep or development, seek qualified health advice. <SourceLink href="https://www.plunket.org.nz/plunket-and-you/services-we-offer/plunketline/">PlunketLine</SourceLink> is available to parents and caregivers of children under five in Aotearoa New Zealand for health and parenting questions.</Prose>
      </GuideSection>

      <GuideSection id="safe-sleep-plan" title="Share your current safe-sleep plan" intro={<Prose>Every caregiver needs the same safe-sleep information. The plan should come from the parents and current health guidance, not be improvised in the middle of the night.</Prose>}>
        <Prose>Whānau Āwhina Plunket advises that pēpi sleep on their back in their own flat, firm sleep space, with their face clear of pillows, toys and loose blankets. Read <SourceLink href="https://www.plunket.org.nz/caring-for-your-child/safe-sleep/foundations-for-safe-sleep/">Plunket’s Foundations for Safe Sleep</SourceLink> with your own midwife, doctor or Plunket nurse’s advice in mind.</Prose>
        <Checklist items={[
          "Show the caregiver the baby’s usual sleep space and the routine you want followed for every sleep.",
          "Explain feeding instructions, medications, allergies and who has authority to make decisions.",
          "Give clear thresholds for waking a parent, calling a health professional or seeking emergency help.",
          "Keep parents reachable and leave current contact details, the home address and backup contacts visible.",
          "Review the plan together before the first shift and whenever the baby’s needs change.",
        ]} />
      </GuideSection>

      <GuideSection id="cost-and-hours" title="Night-nanny costs: agree the whole shift" intro={<Prose>Overnight care is not one standard product. The cost must reflect the actual time, responsibility and working conditions involved.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Awake care versus on-call support"><Prose>A caregiver who is expected to be awake and actively caring through the night has a different role from someone with a defined on-call arrangement. Put the distinction in writing.</Prose></InfoCard>
          <InfoCard title="Newborn experience and scope"><Prose>Relevant experience can matter, but ask for concrete examples and set limits around medical or specialist tasks. A title alone does not establish competence.</Prose></InfoCard>
          <InfoCard title="Travel, timing and frequency"><Prose>Late starts, early finishes, short-notice requests, regular bookings and safe transport all influence what is workable and fair.</Prose></InfoCard>
          <InfoCard title="Regular employment setup"><Prose>For repeating shifts, consider the full pay, leave, payroll and recordkeeping arrangement rather than treating every night as isolated.</Prose></InfoCard>
        </div>
        <Prose>Use the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> to build a broader budget. A written <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link> should record paid hours, additional hours, cancellation or rescheduling, rest arrangements and responsibilities.</Prose>
      </GuideSection>

      <GuideSection id="questions-to-ask" title="Questions to ask a night nanny" intro={<Prose>Open questions are more useful than a checklist of labels. Ask how the candidate has handled comparable situations and whether the proposed care plan is within their experience.</Prose>}>
        <Checklist items={[
          "Which ages and overnight routines have you supported, and what were your agreed duties?",
          "How do you record and hand over feeds, sleeps, nappies or concerns to parents?",
          "What would you do if a baby would not settle, a parent was unreachable or you noticed a health concern?",
          "Which tasks are you comfortable doing, and which would you refer back to a parent or health professional?",
          "What do you need from the family to work safely and respectfully overnight?",
          "How do you prefer to agree hours, rest time, travel home and changes to a shift?",
        ]} />
        <Prose>Use the full <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> and the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting guide</Link> to assess evidence, references and fit proportionately to the role.</Prose>
      </GuideSection>

      <GuideSection id="first-night" title="Plan the first night before it begins" intro={<Prose>The first shift should be calm and well prepared. A written family guide reduces guesswork and lets everyone focus on the baby.</Prose>}>
        <Steps items={[
          { title: "Meet before the shift", body: "Walk through the baby’s routine, sleep space, supplies, home access, house rules and the caregiver’s questions before the first overnight booking." },
          { title: "Write the escalation plan", body: "Set out when to wake a parent, who to call for health advice, what counts as urgent and where to find all emergency information." },
          { title: "Set the practical boundaries", body: "Agree the shift start and finish, meals, rest space, privacy, phone use, visitors, transport and whether any tasks are outside the care role." },
          { title: "Review together in the morning", body: "Talk through what worked, what changed and whether the next shift needs a different plan. Record material changes to the agreement." },
        ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
