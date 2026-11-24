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

const title = "Babysitter Auckland: Evening, Weekend and Occasional Care";
const description =
  "Find a babysitter in Auckland for evenings, weekends and school holidays: what babysitters do, how they differ from nannies, rates, safety checks and how to book.";
const path = "/babysitter-auckland";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What is the difference between a babysitter and a nanny in Auckland?", answer: "A babysitter usually provides occasional, short-term care — an evening, a weekend afternoon or a school-holiday day. A nanny usually works a regular, planned role with set hours, routines and broader responsibilities. The right choice depends on how often you need care and how much structure the role requires." },
  { question: "How much does a babysitter cost in Auckland?", answer: "There is no single Auckland babysitting rate. The rate depends on the children’s ages and needs, the number of children, the time of day, the duties, transport and whether the booking is a one-off or regular. Agree the full booking before agreeing a number." },
  { question: "How do I find a babysitter in Auckland?", answer: "Write a short brief with the date, hours, children’s ages, location and duties, then browse profiles that list casual babysitting as a care type. Compare stated experience, availability and verification information, then interview and agree the booking in writing." },
  { question: "Should a babysitter have first aid training?", answer: "First aid training is useful evidence, but it is not a guarantee of competence and not every sitter will hold a current certificate. Ask what first aid training they hold, when it was completed and what they would do in a realistic emergency for your child." },
  { question: "Can a babysitter collect my child from school?", answer: "Only if that is specifically agreed. School pickup involves collection authority, transport, car seats and a handover plan, so it is closer to an after-school nanny arrangement than a simple evening booking. Discuss it explicitly before the booking." },
];

export default function BabysitterAucklandPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitter Auckland", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Auckland babysitting guide"
      title={title}
      description={description}
      imageTags={["babysitting", "family", "home", "care"]}
      imageSeed="babysitter-auckland"
      highlights={["Occasional care, planned well", "Know babysitter vs nanny", "Agree rates before booking", "Check safety information first"]}
      toc={[
        { id: "what-a-babysitter-does", label: "What a babysitter does" },
        { id: "babysitter-or-nanny", label: "Babysitter or nanny?" },
        { id: "rates-in-auckland", label: "Babysitting rates in Auckland" },
        { id: "safety-and-vetting", label: "Safety and vetting" },
        { id: "how-to-book", label: "How to book" },
        { id: "auckland-areas", label: "Auckland areas" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and filter for casual babysitting as a care type." },
        { href: "/nannies/auckland", label: "Nannies in Auckland", description: "See current Auckland profiles and the suburbs they cover." },
        { href: "/babysitting-rates-nz", label: "Babysitting rates NZ", description: "Work through what affects a fair rate for an evening or overnight booking." },
        { href: "/babysitter-pay-calculator", label: "Babysitter pay calculator", description: "Estimate pay for a booking from hours and an hourly rate." },
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Decide whether your need is occasional help or a regular role." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare the emergency information every caregiver needs." },
      ]}
      ctaTitle="Book occasional care with a clear plan"
      ctaBody="Write a short brief with the date, hours, children and duties, then compare profiles against the real booking — not a generic rate."
    >
      <GuideSection id="what-a-babysitter-does" title="What a babysitter does in Auckland" intro={<Prose>A babysitter provides short-term, occasional care in the family home. The most common Auckland bookings are an evening out, a weekend afternoon, a daytime appointment or a school-holiday day when regular care is unavailable.</Prose>}>
        <Checklist items={[
          "Supervising children safely and following the family’s routines for meals, play and bedtime.",
          "Managing bath time, settling and the evening wind-down where agreed.",
          "Keeping a simple record of what happened and handing over to parents on their return.",
          "Following the family’s instructions on allergies, medication, screens, visitors and outings.",
          "Knowing who to call, where emergency information is kept and when to contact a parent immediately.",
        ]} />
        <Prose>The booking should be defined before the sitter arrives. A vague “watch the kids on Friday” leaves both sides guessing about finish times, duties, transport home and what happens if plans change.</Prose>
        <InfoCard title="Babysitting is a defined booking, not open-ended availability" tone="soft">Agree the date, start and finish time, children’s ages, duties, transport and pay before the booking. If the role grows into regular school pickup, set hours or broader household duties, it is closer to a nanny arrangement and should be planned — and paid — as one.</InfoCard>
      </GuideSection>

      <GuideSection id="babysitter-or-nanny" title="Babysitter or nanny: which fits your Auckland family?" intro={<Prose>Families often start with a babysitter and later realise they need a nanny. The distinction is about regularity and responsibility, not about which label sounds more professional.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Choose a babysitter when"><Prose>Care is occasional or short-term: date nights, appointments, weekend cover, a school-holiday day or backup when a regular arrangement is unavailable. The duties are contained and the schedule is agreed booking by booking.</Prose></InfoCard>
          <InfoCard title="Choose a nanny when"><Prose>Care is regular and planned: set weekly hours, school pickup, routines, activities or responsibility for a child’s development over time. A nanny role needs a fuller conversation about guaranteed hours, checks, pay and a written agreement.</Prose></InfoCard>
        </div>
        <Prose>Read <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny versus babysitter</Link> for a fuller comparison. If your need is regular, the <Link href="/part-time-nanny" className="text-primary underline underline-offset-2 font-semibold">part-time nanny guide</Link> and the <Link href="/after-school-nanny" className="text-primary underline underline-offset-2 font-semibold">after-school nanny guide</Link> describe the more structured options.</Prose>
      </GuideSection>

      <GuideSection id="rates-in-auckland" title="Babysitting rates in Auckland" intro={<Prose>There is no single Auckland babysitting rate and no official rate table. A fair rate reflects the actual booking, not an average copied from another family’s very different evening.</Prose>}>
        <Prose>Experience, the children’s ages and needs, the number of children, the time of day, late finishes, weekend or public-holiday timing, transport and the duties included all affect what is reasonable. A sitter caring for a baby with a complex bedtime routine is doing different work from a sitter supervising two settled school-age children for two hours.</Prose>
        <Prose>Use the <Link href="/babysitting-rates-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rates guide</Link> to work through the factors, and the <Link href="/babysitter-pay-calculator" className="text-primary underline underline-offset-2 font-semibold">babysitter pay calculator</Link> to estimate pay from hours and an hourly rate. For a recurring role, the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> explains how to build a full employment budget instead.</Prose>
        <InfoCard title="Agree late finishes before the booking" tone="important">Set the planned finish time, what happens if parents are delayed, the rate for additional time and safe transport home. A sitter should never have to negotiate pay or a way home at midnight.</InfoCard>
      </GuideSection>

      <GuideSection id="safety-and-vetting" title="Safety and vetting for an Auckland babysitter" intro={<Prose>Occasional care still involves trust. A short booking is not a reason to skip the basic checks — it is a reason to keep them simple and focused.</Prose>}>
        <Checklist items={[
          "Read the verification information shown on the profile rather than assuming every sitter has completed the same checks.",
          "Ask for a reference from a family the sitter has actually worked for, and speak with them directly.",
          "Confirm first aid training where it is claimed, and ask what the sitter would do in a realistic emergency.",
          "Share emergency contacts, allergies, medication, the home address and who may collect the children.",
          "Agree the handover: what the sitter should record and when they should call a parent immediately.",
        ]} />
        <Prose>NannyOra shows different verification levels, so a listed profile is not the same as a Premium Vetted or Specialist profile. The <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> explains the seven checks and how to read a profile’s status, and the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> covers the household information every caregiver needs.</Prose>
      </GuideSection>

      <GuideSection id="how-to-book" title="How to book a babysitter in Auckland" intro={<Prose>A clear brief makes the booking easier for both sides. The sitter can decide whether the work suits them, and the family can compare candidates on the same terms.</Prose>}>
        <Steps items={[
          { title: "Write the booking on one page", body: "Include the date, start and finish time, children’s ages, location, meals, bedtime, pets, transport and anything that affects safe care." },
          { title: "Browse and shortlist", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles that list casual babysitting. Check stated availability, experience and verification information before you enquire.</> },
          { title: "Meet or call first", body: <>Use structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview questions</Link> to ask how the sitter would handle a distressed child, a late parent, a power cut or a child who will not settle.</> },
          { title: "Agree the booking in writing", body: <>Record hours, duties, pay, late-finish treatment, transport and emergency contacts in the booking message. For recurring care, use a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">written nanny agreement</Link> instead.</> },
          { title: "Review after the first booking", body: "Talk through what worked, whether the hours and duties matched the brief and whether you would book the same sitter again." },
        ]} />
      </GuideSection>

      <GuideSection id="auckland-areas" title="Babysitters across Auckland suburbs" intro={<Prose>Auckland families usually need a sitter who can travel to their suburb reliably, especially for evening bookings when public transport is limited. Check the travel area stated on each profile rather than assuming a sitter covers the whole city.</Prose>}>
        <Prose>Current Auckland profiles cover suburbs including <Link href="/nannies/auckland/remuera" className="text-primary underline underline-offset-2 font-semibold">Remuera</Link>, <Link href="/nannies/auckland/epsom" className="text-primary underline underline-offset-2 font-semibold">Epsom</Link>, <Link href="/nannies/auckland/takapuna" className="text-primary underline underline-offset-2 font-semibold">Takapuna</Link>, <Link href="/nannies/auckland/albany" className="text-primary underline underline-offset-2 font-semibold">Albany</Link>, <Link href="/nannies/auckland/ellerslie" className="text-primary underline underline-offset-2 font-semibold">Ellerslie</Link> and <Link href="/nannies/auckland/newmarket" className="text-primary underline underline-offset-2 font-semibold">Newmarket</Link>. Browse <Link href="/nannies/auckland" className="text-primary underline underline-offset-2 font-semibold">nannies in Auckland</Link> to compare profiles by suburb, experience and availability, and confirm travel and finish-time arrangements directly with the sitter.</Prose>
        <Prose>For overnight or late-night support, read the <Link href="/night-nanny" className="text-primary underline underline-offset-2 font-semibold">night-nanny guide</Link>. For last-minute cover, the <Link href="/emergency-nanny" className="text-primary underline underline-offset-2 font-semibold">emergency nanny guide</Link> explains how to prepare a backup plan before you need one.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
