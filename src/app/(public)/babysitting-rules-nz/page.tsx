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

const title = "Babysitting Rules NZ: House Rules, Safety and Pay Basics";
const description =
  "Set clear babysitting rules in New Zealand: household expectations, safety essentials, pay, time boundaries and what to agree before the booking starts.";
const path = "/babysitting-rules-nz";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "Do babysitting rules need to be written down?", answer: "For a one-off evening, a clear message is usually enough. For regular bookings, write the rules into the booking confirmation or agreement so neither side has to remember a verbal conversation. Written rules prevent most misunderstandings about hours, duties and pay." },
  { question: "Can I set screen-time rules for a babysitter?", answer: "Yes. Screen use, visitors, outings, food, bedtime and phone use are all reasonable things to agree in advance. State them plainly before the booking so the sitter can decide whether the role suits them." },
  { question: "What should I do if a babysitter breaks a rule?", answer: "Talk about it promptly and specifically. Distinguish a small misunderstanding from a safety issue: a missed snack routine is different from leaving a child unsupervised or ignoring an allergy instruction. Record what was agreed, and do not rebook if a safety rule was broken without a credible explanation." },
  { question: "Do the rules change if the babysitter is a teenager?", answer: "The household rules stay the same, but the support around them should change. A younger sitter needs clearer instructions, a reachable parent, a defined finish time and a safe way home. Parents should also consider the sitter’s age, maturity and experience when deciding what the booking involves." },
  { question: "Should babysitting rules cover pay and late finishes?", answer: "Yes. Agree the rate, the planned finish time, what happens if parents are delayed, the rate for additional time and safe transport home before the booking. Pay rules agreed afterwards are a common source of disagreement." },
];

export default function BabysittingRulesNzPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitting Rules NZ", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand parent guide"
      title={title}
      description={description}
      imageTags={["babysitting", "family", "home", "safety"]}
      imageSeed="babysitting-rules-nz"
      highlights={["Agree rules before the booking", "Safety rules come first", "Put pay and time in writing", "Keep rules proportionate"]}
      toc={[
        { id: "why-rules-matter", label: "Why written rules help" },
        { id: "house-rules", label: "House rules to agree" },
        { id: "safety-rules", label: "Safety rules every booking needs" },
        { id: "pay-and-time", label: "Pay and time rules" },
        { id: "when-rules-break", label: "When a rule is broken" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/babysitter-responsibilities", label: "Babysitter responsibilities", description: "See what the role covers and what is not automatically included." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, boundaries and a first-day home guide." },
        { href: "/babysitting-rates-nz", label: "Babysitting rates NZ", description: "Work through what affects a fair rate for the booking." },
        { href: "/legal-age-to-babysit-nz", label: "Legal age to babysit NZ", description: "Understand the law and maturity questions for young sitters." },
        { href: "/babysitter-pay-calculator", label: "Babysitter pay calculator", description: "Estimate pay for a booking from hours and an hourly rate." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles when you need a considered childcare match." },
      ]}
      ctaTitle="Make the next booking easier for everyone"
      ctaBody="Write the rules once, reuse them for every booking, and update them when the children, the routine or the arrangement changes."
    >
      <GuideSection id="why-rules-matter" title="Why written babysitting rules help" intro={<Prose>Most babysitting problems are not about bad intentions. They are about two people imagining different bookings: one expects a quiet evening with settled children, the other expects cooking, homework, bath time and a late finish.</Prose>}>
        <Prose>Clear rules protect both sides. The family gets the care they actually need, and the sitter knows exactly what is expected before accepting. Rules do not need to be long or formal — a short, specific list in the booking message is enough for most occasional care.</Prose>
        <InfoCard title="Rules are an agreement, not a test" tone="soft">Share the rules before the booking, not after the sitter arrives. A sitter who knows the expectations can accept or decline honestly; a sitter who discovers them mid-evening cannot.</InfoCard>
      </GuideSection>

      <GuideSection id="house-rules" title="House rules to agree before the booking" intro={<Prose>Household rules are the everyday expectations that make an evening run smoothly. Keep them specific to your children rather than copying a generic list.</Prose>}>
        <Checklist items={[
          "Meals and snacks: what to serve, allergies, foods to avoid and kitchen rules.",
          "Bedtime: the routine, the time, what helps a child settle and what to do if they will not sleep.",
          "Screens and devices: what children may watch or play, for how long, and the sitter’s own phone use during the booking.",
          "Visitors and outings: whether friends may visit, whether the sitter may leave the house with the children and where they may go.",
          "Pets, house areas and belongings: which rooms are in use, how to handle pets and what is off limits.",
          "Hygiene and tidying: nappy changes, bath time, clearing children’s dishes and resetting the rooms used.",
        ]} />
        <Prose>If a rule matters enough to cause a problem when it is broken, it matters enough to state in advance. The <Link href="/babysitter-responsibilities" className="text-primary underline underline-offset-2 font-semibold">babysitter responsibilities guide</Link> explains which tasks are part of the role and which need to be agreed separately.</Prose>
      </GuideSection>

      <GuideSection id="safety-rules" title="Safety rules every booking needs" intro={<Prose>Safety rules are not negotiable and should never be left to assumption. Even a sitter who has worked for the family before needs current information, because children, routines and homes change.</Prose>}>
        <Checklist items={[
          "Emergency contacts, the home address, a reachable parent and a backup adult.",
          "Allergies, medication, medical conditions and exactly what to do if a problem arises.",
          "Who is authorised to collect a child, and when the sitter should call a parent immediately.",
          "The location of first-aid supplies, exits, smoke alarms and any household hazards.",
          "What to do if a child is unwell, distressed or will not settle — and when to seek help rather than wait.",
          "House access, alarms, locked areas and what to do if someone unknown comes to the door.",
        ]} />
        <Prose>Prepare these with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>. For a sitter’s background, read the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> before the first booking rather than after a concern arises.</Prose>
      </GuideSection>

      <GuideSection id="pay-and-time" title="Pay and time rules" intro={<Prose>Money and time cause more babysitting disputes than any other topic. Agreeing them in advance is a kindness to both sides.</Prose>}>
        <Steps items={[
          { title: "Confirm the rate", body: "Agree the hourly rate and the total for the planned booking before the sitter accepts. Use the babysitting rates guide to work through what is fair for the actual work." },
          { title: "Set a finish time", body: "Record the planned finish time and what happens if parents are delayed, including the rate for additional time and safe transport home." },
          { title: "Agree a minimum booking", body: "If a minimum period applies, say so. A sitter travelling for a one-hour booking has different costs from one booked for a full evening." },
          { title: "Confirm payment timing", body: "Agree when and how the sitter will be paid, and who pays for approved expenses such as parking or mileage." },
        ]} />
        <Prose>If the sitter is an employee, the current applicable minimum wage and other employment rights may apply. Check <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage guidance</SourceLink> rather than relying on an old rate card. The <Link href="/babysitter-pay-calculator" className="text-primary underline underline-offset-2 font-semibold">babysitter pay calculator</Link> can estimate the booking cost once the rate and hours are agreed.</Prose>
      </GuideSection>

      <GuideSection id="when-rules-break" title="When a rule is broken" intro={<Prose>A broken rule is information, not automatically a reason to end the relationship. The response should match the seriousness of what happened.</Prose>}>
        <Prose>Start by asking what happened and listening to the answer. A sitter who misunderstood a bedtime routine needs clearer instructions; a sitter who ignored an allergy instruction, left a child unsupervised or was unreachable needs a different conversation. Record what was agreed, update the written rules and decide whether to rebook.</Prose>
        <Prose>For regular care, put the rules into a written agreement. The <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract guide</Link> explains how to record hours, duties and expectations so they do not have to be renegotiated every week.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
