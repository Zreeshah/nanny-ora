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

const title = "Emergency Nanny NZ: Last-Minute and Backup Childcare";
const description =
  "Plan emergency nanny care in New Zealand: what counts as emergency cover, how to prepare a backup plan, what to agree on short notice and how to keep safety first.";
const path = "/emergency-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What counts as emergency nanny care?", answer: "Short-notice care when the usual arrangement falls through: a sick child who cannot attend care, a nanny who is unwell, a school closure, a parent’s urgent work commitment or a family emergency. The defining feature is urgency, not the type of care itself." },
  { question: "How quickly can an emergency nanny start?", answer: "It depends on availability, the time of day and whether the family already has a backup plan. Families with a prepared brief, a known sitter and current safety information can usually arrange cover far faster than families starting from scratch in a crisis." },
  { question: "How much does emergency nanny care cost?", answer: "There is no single emergency rate. Short notice, non-standard hours, travel and the urgency of the request all affect what is fair. Agree the rate, the hours and the finish time before the sitter starts — even when time is short." },
  { question: "Should I skip safety checks for emergency care?", answer: "No. Urgency is a reason to have checks prepared in advance, not a reason to skip them. Share emergency contacts, allergies, medication and collection authority, and use a sitter whose verification information you have already reviewed where possible." },
  { question: "What is the best backup plan for childcare emergencies?", answer: "A short written plan: one or two trusted sitters who know your children, a current safety sheet, a clear brief for the day and an agreed way to pay. Review the plan every few months so the information stays current." },
];

export default function EmergencyNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Emergency Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Nanny services guide"
      title={title}
      description={description}
      imageTags={["nanny", "family", "home", "care"]}
      imageSeed="emergency-nanny"
      highlights={["Prepare the plan before you need it", "Keep safety information current", "Agree pay even in a rush", "Have a named backup sitter"]}
      toc={[
        { id: "what-emergency-care-means", label: "What emergency care means" },
        { id: "prepare-before-you-need-it", label: "Prepare before you need it" },
        { id: "agree-on-short-notice", label: "Agreeing care on short notice" },
        { id: "safety-in-a-rush", label: "Safety in a rush" },
        { id: "cost-and-payment", label: "Costs and payment" },
        { id: "build-a-backup-plan", label: "Build a backup plan" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and identify a backup sitter before you need one." },
        { href: "/weekend-nanny", label: "Weekend nanny", description: "Plan regular weekend and school-holiday cover." },
        { href: "/night-nanny", label: "Night nanny", description: "Plan overnight newborn support with clear boundaries." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, boundaries and a first-day home guide." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Understand what evidence to check before a regular arrangement." },
        { href: "/babysitter-auckland", label: "Babysitter Auckland", description: "Compare occasional evening and weekend babysitting with a regular role." },
      ]}
      ctaTitle="Emergencies are easier with a plan already written"
      ctaBody="Write the backup plan now — the sitter, the safety sheet and the brief — so a difficult morning becomes a phone call, not a crisis."
    >
      <GuideSection id="what-emergency-care-means" title="What emergency nanny care means" intro={<Prose>Emergency care is short-notice, backup childcare when the usual arrangement cannot happen. A child is sick and cannot attend care, a nanny is unwell, a school closes, a parent’s meeting cannot move, or a family emergency changes the day.</Prose>}>
        <Prose>The care itself is usually ordinary: supervision, meals, play, rest and a handover. What makes it “emergency” care is the timing — the family needs someone reliable, quickly, with little or no notice. That urgency is exactly why the plan should exist before the morning it is needed.</Prose>
        <InfoCard title="Emergency care is a plan, not a person" tone="soft">No single nanny can be available at all hours. The families who cope best have a written backup plan: a named sitter, current safety information and a brief that can be sent in one message.</InfoCard>
      </GuideSection>

      <GuideSection id="prepare-before-you-need-it" title="Prepare before you need emergency care" intro={<Prose>The best time to arrange emergency cover is a calm week when nothing is wrong. Preparation takes an hour; a crisis morning takes the whole day.</Prose>}>
        <Steps items={[
          { title: "Name one or two backup sitters", body: "Identify sitters who already know your children, or whose profiles, experience and verification information you have reviewed. A familiar face is far better than a stranger in a rush." },
          { title: "Write a one-page safety sheet", body: "Emergency contacts, the home address, allergies, medication, the children’s routines and who may collect them. Keep it current and somewhere a sitter can find it." },
          { title: "Write a short day brief", body: "The children’s ages, the likely hours, meals, activities, transport and what a good day looks like. A brief that can be sent in one message saves the frantic phone call." },
          { title: "Agree the basics in advance", body: "The hourly rate, the minimum booking, the finish time and how the sitter will be paid. Agreeing these calmly is far easier than negotiating them in a crisis." },
          { title: "Review every few months", body: "Children grow, routines change, allergies change and sitters move on. A backup plan that is six months out of date is barely a plan at all." },
        ]} />
      </GuideSection>

      <GuideSection id="agree-on-short-notice" title="Agreeing care on short notice" intro={<Prose>When the call comes, keep the conversation short and specific. The sitter needs to know whether the day is workable before they accept — and the family needs to know the sitter can actually do it.</Prose>}>
        <Checklist items={[
          "The date, start time and likely finish time — and what happens if the day runs long.",
          "The children’s ages, any illness or special needs, and what the day will involve.",
          "The location, transport, meals and any outings or appointments.",
          "The rate, the minimum booking and how the sitter will be paid.",
          "The safety sheet, emergency contacts and who to call if something goes wrong.",
        ]} />
        <Prose>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to identify backup sitters in advance, and the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how a candidate would handle a sick child, a changed plan or a parent who is unreachable.</Prose>
      </GuideSection>

      <GuideSection id="safety-in-a-rush" title="Safety in a rush" intro={<Prose>Urgency is a reason to have safety information ready, not a reason to skip it. A sitter who arrives without emergency contacts, allergy information or collection authority cannot care safely, however experienced they are.</Prose>}>
        <Checklist items={[
          "Share the safety sheet before the sitter arrives, not after they have started.",
          "Confirm allergies, medication and medical conditions in writing, even if you have discussed them before.",
          "State who may collect the children and when the sitter should call a parent immediately.",
          "Show the sitter the first-aid supplies, exits and any household hazards on arrival.",
          "Keep a parent reachable for the whole booking, with a backup adult available if the parent cannot be reached.",
        ]} />
        <Prose>Prepare the household with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>. Where possible, use a sitter whose verification information you have already reviewed — the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> explains what to check and how to read a profile’s status.</Prose>
      </GuideSection>

      <GuideSection id="cost-and-payment" title="Emergency care costs and payment" intro={<Prose>Emergency care usually costs more than planned care. Short notice, non-standard hours, travel at unusual times and the urgency of the request all affect what is fair — and a sitter who drops other plans to help deserves to be paid properly for it.</Prose>}>
        <Prose>Agree the rate, the hours, the minimum booking and the payment timing before the sitter starts, even when time is short. A one-line message confirming the rate and hours prevents the most common post-booking disagreement. For a recurring arrangement, build the full budget with the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> and the <Link href="/babysitter-pay-calculator" className="text-primary underline underline-offset-2 font-semibold">babysitter pay calculator</Link> once the rate and hours are agreed.</Prose>
      </GuideSection>

      <GuideSection id="build-a-backup-plan" title="Build a backup plan that actually works" intro={<Prose>A backup plan is only useful if it is current, reachable and realistic. Test it before you need it: send the brief to your backup sitter, confirm they are still available for short-notice work and check that the safety sheet is accurate.</Prose>}>
        <Prose>If the family’s needs change — a new baby, a new school, a new suburb — update the plan. And if emergency cover becomes frequent, the arrangement may no longer be an emergency: a regular <Link href="/part-time-nanny" className="text-primary underline underline-offset-2 font-semibold">part-time nanny</Link> or a <Link href="/weekend-nanny" className="text-primary underline underline-offset-2 font-semibold">weekend nanny</Link> role may serve the family better than repeated last-minute calls.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
