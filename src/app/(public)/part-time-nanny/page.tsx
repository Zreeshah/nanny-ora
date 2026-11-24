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

const title = "Part-Time Nanny NZ: School Hours, Split Shifts and Fair Pay";
const description =
  "Plan a part-time nanny in New Zealand: common patterns, guaranteed hours, pay, employment setup and how to hire for school hours or split shifts.";
const path = "/part-time-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What counts as a part-time nanny role?", answer: "A part-time nanny works regular but fewer hours than a full-time role — commonly school hours, mornings, afternoons or two to three days a week. The defining feature is regularity: set days and hours agreed in advance, rather than occasional bookings." },
  { question: "Is a part-time nanny cheaper than a full-time nanny?", answer: "The weekly total is usually lower, but the hourly rate may be higher. Shorter windows limit a nanny’s other work and require travel for a small number of paid hours, so compare the whole weekly role — guaranteed hours, duties and travel — not just the advertised rate." },
  { question: "Should part-time hours be guaranteed?", answer: "Yes, where the family wants reliability. Guaranteed hours give the nanny predictable income and give the family a nanny who can commit to the schedule. Without guaranteed hours, the arrangement is closer to casual cover and should be planned — and paid — as such." },
  { question: "What should a part-time nanny contract include?", answer: "The agreed days and hours, guaranteed time, duties, pay and pay cycle, leave and public-holiday treatment, transport and expenses, notice, safety information and how changes will be agreed. Record the agreement in writing before regular care starts." },
  { question: "Can a part-time nanny also do school pickup?", answer: "Yes, if it is specifically agreed. School pickup involves collection authority, transport, car seats and a handover plan, so it should be part of the written role rather than an assumption added later." },
];

export default function PartTimeNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Part-Time Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Nanny services guide"
      title={title}
      description={description}
      imageTags={["nanny", "family", "home", "care"]}
      imageSeed="part-time-nanny"
      highlights={["Guarantee the hours you need", "Price the whole week", "Define duties precisely", "Keep the role sustainable"]}
      toc={[
        { id: "what-part-time-means", label: "What part-time means" },
        { id: "common-patterns", label: "Common part-time patterns" },
        { id: "pay-and-hours", label: "Pay and guaranteed hours" },
        { id: "how-to-hire", label: "How to hire" },
        { id: "contract-and-safety", label: "Contract and safety" },
        { id: "when-part-time-grows", label: "When part-time grows" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare availability against your weekly brief." },
        { href: "/full-time-nanny", label: "Full-time nanny", description: "Compare a regular, substantial-hours arrangement." },
        { href: "/after-school-nanny", label: "After-school nanny care", description: "Plan regular pickup, homework and holiday care." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Record hours, duties, pay and changes in writing." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand PAYE, IR56, KiwiSaver, ACC and records." },
      ]}
      ctaTitle="Make part-time hours work for both sides"
      ctaBody="Guarantee the hours you genuinely need, define the duties precisely, and agree pay for the real week — not an ideal one."
    >
      <GuideSection id="what-part-time-means" title="What a part-time nanny role means" intro={<Prose>A part-time nanny provides regular, planned care for fewer hours than a full-time role. The work is the same kind of care — routines, school runs, meals, play and handover — compressed into a shorter or split week.</Prose>}>
        <Prose>Part-time suits families who need cover for school hours, two or three set days, mornings or afternoons, or a parent’s part-time working pattern. It also suits nannies who study, care for their own family or combine two part-time roles. The arrangement works when both sides are honest about the hours they can genuinely commit to.</Prose>
        <InfoCard title="Regularity is what makes it a nanny role" tone="soft">A part-time nanny is not a babysitter on retainer. Set days, set hours and a written agreement distinguish the role from occasional bookings — and they are what make it reliable for the family and liveable for the nanny.</InfoCard>
      </GuideSection>

      <GuideSection id="common-patterns" title="Common part-time patterns" intro={<Prose>Most part-time roles fall into a few shapes. Naming the shape helps both sides see whether the hours are genuinely workable before anyone commits.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="School hours"><Prose>Care during the school day, typically 9am to 3pm, for preschool children or for school-age children on teacher-only days and holidays. The nanny’s day is structured around the child’s routine rather than the school run.</Prose></InfoCard>
          <InfoCard title="Mornings or afternoons"><Prose>A half-day pattern: mornings before preschool or school, or afternoons from pickup through dinner and bedtime. The <Link href="/after-school-nanny" className="text-primary underline underline-offset-2 font-semibold">after-school nanny guide</Link> covers the afternoon pattern in detail.</Prose></InfoCard>
          <InfoCard title="Two or three set days"><Prose>Full days on fixed weekdays, with the other days covered by a parent, whānau or another arrangement. The handover between caregivers needs a shared routine and a written record.</Prose></InfoCard>
          <InfoCard title="Split shifts"><Prose>Morning and afternoon blocks with a gap in the middle. Split shifts are the hardest pattern to sustain: the nanny travels twice for the same day, so guaranteed hours and travel arrangements matter even more.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="pay-and-hours" title="Part-time pay and guaranteed hours" intro={<Prose>Part-time pay is often misunderstood. A shorter week does not automatically mean a lower hourly rate — and a low hourly rate does not automatically mean a cheap arrangement.</Prose>}>
        <Prose>Shorter windows can command a different hourly market because they limit other work and require travel for a small number of paid hours. A nanny who travels across Auckland for a two-hour shift has real costs that a full-day role does not. Be upfront about guaranteed hours, holidays and the minimum you can genuinely commit to.</Prose>
        <Prose>From 1 April 2026, the adult minimum wage is NZ$23.95 per hour before tax — a legal floor for eligible employees, not a typical experienced-nanny rate. Check <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage rates</SourceLink> before making an offer, and build the full budget with the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link>. Some part-time private domestic workers may use the IR56 route; the eligibility details include work in the employer’s home, direct payment and no more than 30 average hours a week for each employer — read the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> before setting up pay.</Prose>
        <InfoCard title="Guaranteed hours protect both sides" tone="important">If the family cancels often or the hours drift week to week, the nanny cannot plan their income and will eventually leave. Guarantee the hours you need, pay for them, and agree in writing how changes and cancellations are handled.</InfoCard>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire a part-time nanny" intro={<Prose>Hiring for part-time hours needs the same care as a full-time hire, with one extra question: is this schedule genuinely workable for the person you are asking to commit to it?</Prose>}>
        <Steps items={[
          { title: "Write the week honestly", body: "List the exact days, hours, school or care locations, transport needs and the duties that fit inside the available time. Do not list a full-time job inside part-time hours." },
          { title: "Shortlist for availability first", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles. Check stated availability and experience against the real schedule before discussing anything else.</> },
          { title: "Interview for the pattern", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the candidate would handle a late parent, a sick child, a changed school plan or a gap between shifts.</> },
          { title: "Check evidence and referees", body: <>Read the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> and speak with a non-family referee who directly observed the candidate’s work with children.</> },
          { title: "Arrange a paid trial", body: "Agree the trial days, hours, duties, supervision and hourly rate beforehand. A trial in the real pattern shows whether the schedule works far better than a conversation about it." },
        ]} />
      </GuideSection>

      <GuideSection id="contract-and-safety" title="Contract and safety for a part-time role" intro={<Prose>Put the role in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">written nanny agreement</Link>: days and hours, guaranteed time, duties, pay and pay cycle, leave and public-holiday treatment, transport and expenses, notice, safety information and how changes will be agreed.</Prose>}>
        <Prose>Prepare the household with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> — emergency contacts, allergies, medication, collection authority and the handover routine. A part-time nanny who works two or three days a week still needs the full safety picture, not a shortened version of it.</Prose>
      </GuideSection>

      <GuideSection id="when-part-time-grows" title="When a part-time role grows" intro={<Prose>Part-time roles often grow: an extra day, a longer afternoon, school-holiday cover, a new baby. Each change should be discussed and recorded rather than absorbed silently.</Prose>}>
        <Prose>If the hours and duties now look like a full-time role, revisit the arrangement as one — read the <Link href="/full-time-nanny" className="text-primary underline underline-offset-2 font-semibold">full-time nanny guide</Link> and agree the new hours, pay and written terms together. A role that grows without a conversation is the fastest way to lose a good nanny.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
