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

const title = "Weekend Nanny NZ: Saturday, Sunday and School-Holiday Care";
const description =
  "Plan weekend nanny care in New Zealand: common patterns, duties, costs, safety and how to hire for Saturdays, Sundays and school holidays.";
const path = "/weekend-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What does a weekend nanny do?", answer: "A weekend nanny provides planned care on Saturdays, Sundays or public holidays — often full days covering meals, play, outings, activities and bedtime. The duties, hours and transport should be agreed in advance, just as for a weekday role." },
  { question: "How much does a weekend nanny cost in NZ?", answer: "There is no single weekend rate. Cost depends on hours, the children’s ages and needs, experience, transport, duties and whether the work falls on a public holiday. Agree the rate, the hours and the public-holiday treatment before the booking." },
  { question: "Can a weekend nanny also cover school holidays?", answer: "Often, but it should not be assumed. School-holiday care usually means longer days, different activities and different transport. Discuss holiday availability, duties and pay before confirming the role." },
  { question: "Is weekend nanny work different from babysitting?", answer: "Yes, when it is regular and planned. A one-off Saturday evening is a babysitting booking; a regular weekend role with set hours, routines and responsibilities is a nanny arrangement and should be planned — and paid — as one." },
  { question: "How do I hire a weekend nanny?", answer: "Write a brief with the days, hours, children’s ages, activities and transport needs, then shortlist profiles whose stated availability matches weekends. Interview with structured questions, check a referee, arrange a paid trial and put the role in writing." },
];

export default function WeekendNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Weekend Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Nanny services guide"
      title={title}
      description={description}
      imageTags={["nanny", "family", "home", "care"]}
      imageSeed="weekend-nanny"
      highlights={["Define weekend hours clearly", "Plan activities and outings", "Agree holiday cover early", "Keep the role sustainable"]}
      toc={[
        { id: "what-weekend-care-covers", label: "What weekend care covers" },
        { id: "common-patterns", label: "Common weekend patterns" },
        { id: "cost-and-pay", label: "Costs and pay" },
        { id: "safety-and-planning", label: "Safety and planning" },
        { id: "school-holiday-cover", label: "School-holiday cover" },
        { id: "how-to-hire", label: "How to hire" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare weekend availability against your brief." },
        { href: "/emergency-nanny", label: "Emergency nanny", description: "Prepare a backup plan for last-minute and short-notice care." },
        { href: "/after-school-nanny", label: "After-school nanny care", description: "Plan regular pickup, homework and holiday care." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/babysitter-auckland", label: "Babysitter Auckland", description: "Compare occasional evening and weekend babysitting with a regular role." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, boundaries and a first-day home guide." },
      ]}
      ctaTitle="Make weekends easier to plan"
      ctaBody="Write the weekend brief — days, hours, activities and transport — then compare profiles against the real role."
    >
      <GuideSection id="what-weekend-care-covers" title="What weekend nanny care covers" intro={<Prose>Weekend care is planned, regular care on Saturdays and Sundays. Unlike a weekday role, it often centres on full days: late mornings, outings, activities, meals and the evening wind-down.</Prose>}>
        <Checklist items={[
          "Full-day supervision, meals, snacks and the children’s routines for the day.",
          "Outings, parks, sports, lessons and activities — including transport and any entry costs.",
          "Play, reading, homework catch-up and age-appropriate activities at home.",
          "Bath time, bedtime and a handover record for parents returning home.",
          "Following the family’s instructions on allergies, medication, screens, visitors and outings.",
        ]} />
        <Prose>Weekend care should be defined just as carefully as weekday care. A vague “help on Saturdays” leaves both sides guessing about start times, duties, transport and what happens when plans change.</Prose>
      </GuideSection>

      <GuideSection id="common-patterns" title="Common weekend patterns" intro={<Prose>Most weekend roles fall into a few shapes. Naming the shape helps both sides see whether the hours are genuinely workable.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="One set weekend day"><Prose>Care every Saturday or every Sunday, usually a full day. The nanny’s week is built around that day, so the hours, start time and finish time should be fixed rather than drifting week to week.</Prose></InfoCard>
          <InfoCard title="Both weekend days"><Prose>Full weekend cover, often for parents who work weekends or need two days of dependable care. The role needs rest breaks, realistic activity planning and a clear finish time each day.</Prose></InfoCard>
          <InfoCard title="Weekend mornings or afternoons"><Prose>A half-day pattern: sports and activities in the morning, or afternoon cover while parents work or attend commitments. Travel and handover need the same attention as a full day.</Prose></InfoCard>
          <InfoCard title="Weekend plus school holidays"><Prose>A weekend role that extends into school-holiday weekdays. Holiday days are usually longer and involve different activities, so agree the holiday pattern and pay separately from the weekend pattern.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="cost-and-pay" title="Weekend nanny costs and pay" intro={<Prose>Weekend work is not the same as weekday work. The nanny gives up their own weekend, travels at times when public transport is limited and often manages full, active days — so the pay conversation should reflect the real role.</Prose>}>
        <Prose>Agree the hourly rate, the guaranteed hours, the treatment of public holidays and the costs of activities, transport, parking and entry fees before the role starts. For a regular arrangement, check the employment, leave and payroll responsibilities that apply — the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> explains PAYE, IR56, KiwiSaver, ACC and records, and the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> explains how to build a full budget.</Prose>
        <InfoCard title="Agree public holidays in advance" tone="important">Public holidays carry their own rules and expectations. Do not assume a weekend rate automatically covers them — agree the treatment, the pay and the notice for public-holiday work before the role starts.</InfoCard>
      </GuideSection>

      <GuideSection id="safety-and-planning" title="Safety and planning for weekend care" intro={<Prose>Weekend care often involves more outings and transport than weekday care, so the safety plan needs to cover movement as well as the home.</Prose>}>
        <Checklist items={[
          "Emergency contacts, the home address, allergies, medication and who may collect the children.",
          "Transport: who provides the vehicle, car seats, licences, insurance, parking and approved mileage or expenses.",
          "Outing rules: where the nanny may go, how far, what to do if plans change and when to call a parent.",
          "Sun, water and activity safety for the season, including hats, sunscreen, hydration and supervision near water.",
          "A charged phone, a defined finish time and safe transport home after an evening finish.",
        ]} />
        <Prose>Prepare the household with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>, and check the profile’s verification information with the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> before the first weekend.</Prose>
      </GuideSection>

      <GuideSection id="school-holiday-cover" title="School-holiday cover" intro={<Prose>School holidays are where a weekend arrangement often needs a different plan. The nanny may be available for longer days, may not be available, or may need a revised role and schedule.</Prose>}>
        <Prose>Discuss holiday availability, activity budgets, transport, additional children and how much notice each side needs during the hiring process — not the week before the holidays. For a new or changed arrangement, revisit the agreement and pay rather than assuming “flexible” covers everything.</Prose>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire a weekend nanny" intro={<Prose>Hire for the weekend as deliberately as for the week. The children’s routine, the activities and the transport all depend on a nanny who can genuinely commit to the pattern.</Prose>}>
        <Steps items={[
          { title: "Write the weekend brief", body: "Include the days, hours, children’s ages, activities, transport, home location and when parents usually return." },
          { title: "Shortlist for weekend availability", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles. Check stated weekend availability and relevant experience before discussing anything else.</> },
          { title: "Interview for real weekends", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the candidate would handle a changed activity plan, a tired child, a late parent or a wet-weather weekend.</> },
          { title: "Arrange a paid trial weekend", body: "Agree the trial day, hours, duties, supervision and hourly rate beforehand. A real weekend shows whether the pattern works far better than a conversation about it." },
          { title: "Put the role in writing", body: <>Record days, hours, duties, pay, transport, holidays and changes in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>.</> },
        ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
