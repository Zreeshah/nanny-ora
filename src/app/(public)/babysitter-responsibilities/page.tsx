import type { Metadata } from "next";
import Link from "next/link";
import {
  Checklist,
  EditorialGuide,
  GuideSection,
  InfoCard,
  Prose,
  Steps,
  type GuideFaq,
} from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Babysitter Responsibilities: What the Role Covers (and What It Doesn’t)";
const description =
  "Understand babysitter responsibilities in New Zealand: core duties, age-specific care, safety, communication and the tasks that need to be agreed separately.";
const path = "/babysitter-responsibilities";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What are a babysitter’s main responsibilities?", answer: "Supervising the children safely, following the family’s routines for meals, play and bedtime, managing agreed hygiene and settling tasks, keeping a simple record of the evening and contacting a parent promptly when something needs a decision." },
  { question: "Should a babysitter cook, clean or do laundry?", answer: "Only if it is specifically agreed. Occasional bookings usually focus on the children’s care, meals and bedtime. Adult household work, deep cleaning and laundry are outside the usual role unless they are discussed honestly and reflected in the rate." },
  { question: "Is a babysitter responsible for homework?", answer: "Homework support can be part of the booking if it is agreed in advance. Say what is expected — supervision, help with a specific task, or simply a quiet time for the child to work — and allow realistic time for it." },
  { question: "What should a babysitter do if a child is unwell?", answer: "Follow the family’s written instructions, keep the child comfortable and safe, and contact a parent promptly. A babysitter should not diagnose illness, change medication instructions or decide on medical care beyond the agreed plan and their own training." },
  { question: "Do babysitter responsibilities change for babies?", answer: "Yes. Baby care involves feeds, nappy changes, settling, safe sleep and closer supervision, so the briefing needs to be more detailed. The family should show the sitter the baby’s routine, sleep space and escalation plan before the booking." },
];

export default function BabysitterResponsibilitiesPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitter Responsibilities", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand parent guide"
      title={title}
      description={description}
      imageTags={["babysitting", "family", "home", "care"]}
      imageSeed="babysitter-responsibilities"
      highlights={["Core duties, clearly defined", "Age-specific expectations", "Safety comes first", "Agree extras separately"]}
      toc={[
        { id: "core-responsibilities", label: "Core responsibilities" },
        { id: "not-included", label: "What is not automatically included" },
        { id: "age-specific-care", label: "Care by age group" },
        { id: "safety-and-communication", label: "Safety and communication" },
        { id: "when-responsibilities-change", label: "When responsibilities change" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/babysitting-rules-nz", label: "Babysitting rules NZ", description: "Set the house rules, safety rules and pay rules for the booking." },
        { href: "/babysitter-reference-letter", label: "Babysitter reference letter", description: "Ask for or write a reference that describes the actual work." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, boundaries and a first-day home guide." },
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Decide whether your need is occasional help or a regular role." },
        { href: "/after-school-nanny", label: "After-school nanny care", description: "Plan regular pickup, homework and holiday care as a nanny role." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles when you need a considered childcare match." },
      ]}
      ctaTitle="Define the role before the booking starts"
      ctaBody="A short list of responsibilities, agreed in advance, prevents most misunderstandings — and lets the sitter do their best work."
    >
      <GuideSection id="core-responsibilities" title="A babysitter’s core responsibilities" intro={<Prose>Every babysitting booking has the same centre: keep the children safe, follow the family’s routines and hand over clearly when parents return. Everything else is agreed around that core.</Prose>}>
        <Checklist items={[
          "Supervising the children at all times during the booking, including knowing where each child is.",
          "Following agreed routines for meals, snacks, play, bath time and bedtime.",
          "Managing nappy changes, toileting, dressing and comfort items as the family has shown.",
          "Keeping the children’s areas tidy and resetting the rooms used during the booking.",
          "Recording feeds, sleeps, medication given as directed, incidents and anything parents should know.",
          "Contacting a parent promptly when a decision, a problem or a change of plan needs their input.",
        ]} />
        <Prose>Responsibilities should be written into the booking message. A sitter who knows the list can prepare; a sitter who discovers it mid-evening has to improvise.</Prose>
      </GuideSection>

      <GuideSection id="not-included" title="What is not automatically included" intro={<Prose>Many disagreements come from tasks a family assumed were included and a sitter assumed were not. The safest approach is to treat anything beyond direct childcare as an extra that needs its own agreement.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Usually outside the role"><Prose>Adult laundry, deep cleaning, gardening, running family errands, cooking adult meals, caring for pets beyond a brief check, and supervising other people’s children who arrive unexpectedly.</Prose></InfoCard>
          <InfoCard title="Agree separately if needed"><Prose>School or activity transport, homework support, preparing children’s meals from scratch, bath time for a child who needs close support, and any task that adds significant time or responsibility. Discuss these honestly and reflect them in the rate.</Prose></InfoCard>
        </div>
        <Prose>The <Link href="/babysitting-rules-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rules guide</Link> explains how to record the agreed list so it does not have to be renegotiated every booking.</Prose>
      </GuideSection>

      <GuideSection id="age-specific-care" title="How responsibilities change with the child’s age" intro={<Prose>A booking for a baby and a booking for two school-age children are different jobs. The briefing should match the age group, not a generic idea of “looking after kids”.</Prose>}>
        <Steps items={[
          { title: "Babies", body: "Feeds, nappy changes, settling and safe sleep need a detailed, written routine. Show the sitter the sleep space, the feeding plan and the escalation thresholds before the booking." },
          { title: "Toddlers", body: "Close supervision, consistent boundaries, meal and nap routines, and safe play. Toddlers move quickly and test limits, so the sitter needs to know the house rules and the child’s comfort strategies." },
          { title: "Preschool children", body: "Play, stories, simple routines and clear expectations around sharing, screens and bedtime. The sitter should know what the child can do alone and what needs an adult nearby." },
          { title: "School-age children", body: "Homework support where agreed, activities, snacks, screen boundaries and a calm wind-down. Older children still need supervision and a clear plan for who to call and what to do if something goes wrong." },
        ]} />
        <Prose>For repeated overnight support, the <Link href="/night-nanny" className="text-primary underline underline-offset-2 font-semibold">night-nanny guide</Link> explains how overnight duties differ from an evening booking.</Prose>
      </GuideSection>

      <GuideSection id="safety-and-communication" title="Safety and communication responsibilities" intro={<Prose>Safety is the one responsibility that never changes with the booking. A sitter’s judgment in an unexpected moment matters more than any task list.</Prose>}>
        <Checklist items={[
          "Know the emergency contacts, the home address, allergies and medication instructions before parents leave.",
          "Keep a phone charged and reachable, and know when to call a parent versus when to seek emergency help.",
          "Never leave a child unsupervised, including in a vehicle, a bath or a room with a known hazard.",
          "Follow the family’s instructions on visitors, outings, screen use and who may collect a child.",
          "Record incidents honestly and hand over in person so parents hear what happened directly.",
        ]} />
        <Prose>Prepare the household with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>. If the sitter’s background matters for the role, the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> explains what evidence to check and how to read it.</Prose>
      </GuideSection>

      <GuideSection id="when-responsibilities-change" title="When responsibilities change, renegotiate the role" intro={<Prose>A babysitting booking that quietly grows into school pickup, regular hours, household coordination or sole-charge care for a baby is no longer the same job. That is the point to pause and reset the arrangement.</Prose>}>
        <Prose>Discuss the new duties, the hours, the pay and the checks that now apply, and record the change in writing. A recurring role with set hours and broader responsibility is usually better planned as a nanny arrangement — read <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny versus babysitter</Link> and the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> before the next booking.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
