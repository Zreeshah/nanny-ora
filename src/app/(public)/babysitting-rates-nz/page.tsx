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

const title = "Babysitting Rates NZ: How Much to Charge or Pay";
const description = "Use this New Zealand babysitting rates guide to agree a fair rate for an evening, overnight or regular booking, including duties, timing and safety.";
const path = "/babysitting-rates-nz";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What is a fair babysitting rate in New Zealand?", answer: "There is no single nationwide babysitting rate. A fair rate reflects the sitter’s experience, the child’s age and needs, the number of children, the time of day, the duties, transport and whether the booking is occasional or regular. Agree the full job before agreeing a number." },
  { question: "Do overnight babysitting rates differ from evening rates?", answer: "They can. First agree whether the sitter is expected to be awake and working throughout the night, is on call, or has an agreed opportunity to sleep. The care plan, feeds, settling, safety responsibilities and next-day handover all affect the arrangement." },
  { question: "Can I ask a babysitter to do housework?", answer: "Only if it is specifically agreed. Occasional bookings usually focus on the children’s care, meals and bedtime. Extra household work should be discussed honestly, included in the booking scope and reflected in the rate." },
  { question: "When does babysitting become a nanny role?", answer: "A recurring, planned role with regular hours, routines, school pickup or broader responsibility may be closer to a nanny arrangement. Review the duties, pay, safety checks and employment setup rather than relying on the word babysitter." },
  { question: "Should a babysitter be paid for late finishes?", answer: "Set this out before the booking. Agree the planned finish time, what happens if parents are delayed, the rate for additional time, safe transport home and a minimum booking period if one applies." },
];

const rateFactors = [
  { title: "The children and care needs", body: "Babies, multiple children, allergies, medication instructions, difficult bedtimes or a child who needs close one-to-one support can change the responsibility of the booking." },
  { title: "The time and length of the booking", body: "A short notice, late-night, weekend, public-holiday or overnight booking can affect what is realistic. Record start and finish times instead of treating availability as open-ended." },
  { title: "The work actually included", body: "Settle meals, bath time, bedtime, homework, child-related tidying, transport and any activities. Do not add adult household tasks after a sitter has accepted a childcare booking." },
  { title: "Experience and responsibility", body: "Relevant childcare experience, calm judgment, first-aid training where claimed, reliable communication and the confidence to follow a family’s safety plan all matter more than a generic label." },
  { title: "Travel and practical costs", body: "Discuss transport to and from the booking, safe travel after a late finish, parking, mileage and whether the sitter will use a family vehicle before confirming the rate." },
  { title: "Whether the arrangement is recurring", body: "A regular after-school or weekly role needs a fuller conversation about guaranteed hours, duties, pay, checks and employment responsibilities than a one-off evening booking." },
];

export default function BabysittingRatesNzPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-14" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitting Rates NZ", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand parent guide"
      title={title}
      description={description}
      imageTags={["real-shared-reading", "babysitting", "family", "home", "care"]}
      imageSeed="babysitting-rates-nz"
      highlights={["Price the real booking", "Agree late finishes early", "Plan safe handovers", "Know when care becomes regular"]}
      toc={[
        { id: "start-with-the-booking", label: "Start with the booking" },
        { id: "what-affects-rates", label: "What affects babysitting rates" },
        { id: "overnight-care", label: "Evening and overnight care" },
        { id: "agree-a-rate", label: "Agree a fair rate" },
        { id: "regular-care", label: "When care becomes regular" },
        { id: "safe-handover", label: "Prepare a safe handover" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Decide whether your need is occasional help or a regular childcare role." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Budget for a recurring nanny arrangement separately from a babysitting booking." },
        { href: "/after-school-nanny", label: "After-school nanny care", description: "Plan regular pickup, snack, homework and holiday care." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Share the emergency information every caregiver needs." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand payroll questions if a role becomes ongoing." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles when you need a considered childcare match." },
      ]}
      ctaTitle="Start with a clear childcare brief"
      ctaBody="Define the children, hours, duties and handover you need, then browse NannyOra profiles for care that fits the real role."
    >
      <GuideSection id="start-with-the-booking" title="A babysitting rate starts with a clear booking" intro={<Prose>Before asking what a babysitter costs, describe the work. A sitter cannot give a fair answer to “Friday night” if they do not know the children’s ages, the likely hours, whether dinner and bedtime are included, or how they will get home.</Prose>}>
        <Prose>For an occasional booking, a simple agreed hourly rate may be right. For a regular role, the conversation needs to be broader: guaranteed hours, responsibilities, safety information and the employment setup may all matter. The most useful question is not “What is the cheapest rate?” but “What is the responsibility we are asking someone to take on?”</Prose>
        <InfoCard title="Avoid using a generic online average as the offer" tone="important">Published averages can be old, regional or based on very different work. Use them only as background. Compare your actual booking with recent local options, then agree a rate that recognises the person’s time, experience and responsibilities.</InfoCard>
      </GuideSection>

      <GuideSection id="what-affects-rates" title="What affects babysitting rates in NZ" intro={<Prose>Two bookings that both run from 6pm to 10pm can be completely different jobs. These are the details to talk through before either side commits.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">{rateFactors.map((factor) => <InfoCard key={factor.title} title={factor.title}>{factor.body}</InfoCard>)}</div>
        <Prose>If the sitter is an employee, the current applicable minimum wage and other employment rights may apply. Employment New Zealand updates the rates each year; check <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">the current minimum-wage guidance</SourceLink> rather than relying on an old social post or rate card.</Prose>
      </GuideSection>

      <GuideSection id="overnight-care" title="Evening, late-night and overnight babysitting" intro={<Prose>Overnight care should never be priced as one vague block of time. The family and caregiver need a shared understanding of what “overnight” means in practice.</Prose>}>
        <Checklist items={[
          "Is the caregiver expected to stay awake, be on call, or have an agreed rest period?",
          "Who will handle feeds, settling, nappies, medication or a child who wakes distressed?",
          "What is the planned finish time, and what happens if the parents are delayed?",
          "Will the caregiver have a suitable rest space, food and safe transport home?",
          "What information, emergency contacts and consent boundaries need to be written down?",
        ]} />
        <Prose>For a newborn or repeated overnight support, use the more detailed <Link href="/night-nanny" className="text-primary underline underline-offset-2 font-semibold">night-nanny guide</Link>. It helps families distinguish practical overnight help from medical advice or clinical care.</Prose>
      </GuideSection>

      <GuideSection id="agree-a-rate" title="A simple way to agree a fair babysitting rate" intro={<Prose>A clear conversation makes a booking easier for everyone. Put the agreement in a message or booking confirmation so the important details are not lost.</Prose>}>
        <Steps items={[
          { title: "Share the full brief", body: "Include the children’s ages, the date, start and likely finish time, meals, bedtime, pets, transport and anything that affects safe care." },
          { title: "Confirm the responsibilities", body: "List what is included and what is not. Be explicit about school or activity transport, medication, screen use, visitors and any family vehicle." },
          { title: "Agree pay and changes", body: "Confirm the rate, payment timing, any minimum booking period, late-finish treatment, approved expenses and how extra time will be agreed." },
          { title: "Plan the handover", body: "Share emergency contacts, allergies, routines, house access and who may collect the children. Keep your phone available during the booking." },
        ]} />
      </GuideSection>

      <GuideSection id="regular-care" title="When babysitting becomes a regular nanny role" intro={<Prose>Families often begin with an occasional sitter and then discover they need dependable weekly support. That is a good time to reset the arrangement rather than silently extending the original booking.</Prose>}>
        <Prose>Recurring school pickup, regular daytime care, fixed hours or responsibility for routines may be better planned as a nanny role. Read <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny versus babysitter</Link>, use the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> to build a realistic budget, and discuss the correct setup through the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link>.</Prose>
        <Prose>Some qualifying private domestic workers, including nannies, can use the IR56 route. Eligibility is specific: it includes work in the employer’s home, direct payment, non-business work and an average of no more than 30 hours per week for each employer. Read <SourceLink href="https://www.ird.govt.nz/roles/ir56-workers/private-domestic-workers">IRD’s current private domestic worker guidance</SourceLink> and get advice for the facts of the arrangement if you are unsure.</Prose>
      </GuideSection>

      <GuideSection id="safe-handover" title="Prepare a safe handover, even for one evening" intro={<Prose>A rate is only one part of a good babysitting booking. The caregiver needs enough information to make sound decisions while you are away.</Prose>}>
        <Checklist items={[
          "Emergency contacts, the home address and any medical or allergy information.",
          "The child’s food, bedtime and comfort routines, plus any boundaries around screens, visitors and outings.",
          "Who is authorised to collect the child and when the caregiver should call a parent immediately.",
          "The location of first-aid supplies, exits, smoke alarms and any household hazards.",
          <>A chance to ask questions, with a fuller <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety checklist</Link> for recurring care.</>,
        ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
