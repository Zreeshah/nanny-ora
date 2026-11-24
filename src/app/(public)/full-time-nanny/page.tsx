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

const title = "Full-Time Nanny NZ: Hours, Duties, Costs and Hiring";
const description =
  "Plan a full-time nanny in New Zealand: what the role covers, typical hours, costs, employment setup and how to hire with a clear written agreement.";
const path = "/full-time-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What counts as a full-time nanny role in New Zealand?", answer: "There is no single legal definition. In practice, a full-time nanny works regular, substantial hours — commonly around 35 to 45 hours a week — with set days, defined duties and a written agreement. The exact hours, duties and pay should be agreed for the specific role rather than assumed from the label." },
  { question: "How much does a full-time nanny cost in NZ?", answer: "There is no single national rate. Cost depends on hours, the children’s ages and needs, experience, location, transport and duties. Build a total weekly budget from the agreed hours and rate, then add leave, public holidays and payroll costs where they apply." },
  { question: "Is a full-time nanny an employee or a contractor?", answer: "Worker status is decided from the real working relationship and current legal tests, not from a preferred label. A regular nanny working personally in a family home at set times often has employee features. Confirm the status before calculating the budget." },
  { question: "What should a full-time nanny contract include?", answer: "Hours and guaranteed time, duties, pay and pay cycle, leave, public holidays, sick leave, transport and expenses, notice, trial arrangements, safety information and how changes will be agreed. Record the agreement in writing before regular care starts." },
  { question: "How do I hire a full-time nanny?", answer: "Write a clear brief, shortlist against the non-negotiables, interview with structured questions, speak with referees, check relevant evidence, arrange a paid trial and put the role in writing. A rushed hire for a full-time role is the most expensive kind of mistake." },
];

export default function FullTimeNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Full-Time Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Nanny services guide"
      title={title}
      description={description}
      imageTags={["nanny", "family", "home", "care"]}
      imageSeed="full-time-nanny"
      highlights={["Define the full week first", "Budget the whole role", "Confirm worker status", "Put the role in writing"]}
      toc={[
        { id: "what-full-time-means", label: "What full-time means" },
        { id: "typical-week", label: "A typical full-time week" },
        { id: "cost-and-employment", label: "Costs and employment setup" },
        { id: "how-to-hire", label: "How to hire" },
        { id: "trial-and-contract", label: "Trial and contract" },
        { id: "keeping-role-sustainable", label: "Keeping the role sustainable" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare availability against your weekly brief." },
        { href: "/part-time-nanny", label: "Part-time nanny", description: "Compare a shorter or school-hours arrangement." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand PAYE, IR56, KiwiSaver, ACC and records." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Record hours, duties, pay and changes in writing." },
        { href: "/nanny-interview-questions", label: "Interview questions", description: "Ask structured questions about judgment, communication and fit." },
      ]}
      ctaTitle="Hire for the whole week, not just the hours"
      ctaBody="Write the role as it will actually run — hours, duties, travel and leave — then compare profiles against that brief."
    >
      <GuideSection id="what-full-time-means" title="What a full-time nanny role means" intro={<Prose>A full-time nanny is the family’s primary in-home caregiver during the working week. The role is defined by regularity and scope: set days, predictable hours, responsibility for routines and a relationship with the children that develops over months, not single bookings.</Prose>}>
        <Prose>Most full-time roles run around 35 to 45 hours a week, but the number is less important than the shape. A role with four long days, school runs, activities and household coordination is a different job from five short mornings. Write the week as it will actually run before discussing pay.</Prose>
        <InfoCard title="Full-time is a commitment on both sides" tone="soft">The family commits to guaranteed hours and a stable arrangement; the nanny commits their working week to one household. That mutual commitment is why the brief, the trial and the written agreement matter more for a full-time role than for occasional care.</InfoCard>
      </GuideSection>

      <GuideSection id="typical-week" title="What a typical full-time week can include" intro={<Prose>The duties should be listed explicitly. A nanny who expects childcare plus light child-related tasks will be surprised by full household management — and a family who expects it should say so before hiring.</Prose>}>
        <Checklist items={[
          "Morning routines, breakfast, school or early-learning drop-offs and pickups.",
          "Daytime care, play, learning activities, outings and rest or nap routines.",
          "Meals and snacks, children’s laundry, tidying children’s areas and resetting rooms used.",
          "Homework support, reading, activities and transport to sports or lessons.",
          "Keeping a simple daily record and handing over to parents at the end of the day.",
          "Following the family’s safety plan, allergy and medication instructions and emergency procedures.",
        ]} />
        <Prose>Tasks outside direct childcare — adult laundry, deep cleaning, cooking family meals, gardening or administration — should be discussed separately, allowed realistic time and reflected in the pay. The <Link href="/after-school-nanny" className="text-primary underline underline-offset-2 font-semibold">after-school nanny guide</Link> covers the school-week pattern in more detail for families whose main need is afternoons.</Prose>
      </GuideSection>

      <GuideSection id="cost-and-employment" title="Full-time nanny costs and employment setup" intro={<Prose>A full-time budget is a weekly model, not an hourly number. The lowest hourly figure is not always the lowest realistic weekly cost, because guaranteed hours, leave and payroll all belong in the same budget.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="The pay basis"><Prose>Agree the gross hourly rate or salary, the guaranteed hours, the pay cycle and how additional hours, public holidays and school holidays are treated. From 1 April 2026, the adult minimum wage is NZ$23.95 per hour before tax — a legal floor for eligible employees, not a typical experienced-nanny rate.</Prose></InfoCard>
          <InfoCard title="The employment setup"><Prose>Many regular nanny arrangements have employee features. First decide the real worker status, then make the budget match the obligations that follow: leave, sick leave, public holidays, PAYE, KiwiSaver and ACC where applicable.</Prose></InfoCard>
          <InfoCard title="Practical costs"><Prose>Include approved mileage, parking, transport, children’s activities, agreed training and backup care. A role that requires a vehicle, car seats or regular travel has costs beyond the wage.</Prose></InfoCard>
          <InfoCard title="Market context"><Prose>Recent Auckland nanny job advertisements can show rates from roughly NZ$28 to NZ$35+ per hour for different scopes and schedules. Treat advertised roles as a starting point for comparing similar work, not a national average or a rate NannyOra endorses.</Prose></InfoCard>
        </div>
        <Prose>Build the full budget with the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> and work through the payroll route in the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link>. Check <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage rates</SourceLink> before making an offer.</Prose>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire a full-time nanny" intro={<Prose>A full-time hire deserves a slower, more deliberate process than a babysitting booking. The cost of a wrong hire — disruption for the children, a second recruitment round and a broken routine — is far higher than the time a careful process takes.</Prose>}>
        <Steps items={[
          { title: "Write the week on one page", body: "Include the children’s ages, hours, school or care locations, transport, duties, home location and when a parent usually arrives home." },
          { title: "Shortlist against the non-negotiables", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles. Check stated availability, relevant experience and verification information, then discuss the role directly.</> },
          { title: "Interview for real situations", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the candidate would handle a sick child, a changed plan, sibling conflict or a parent delayed at work.</> },
          { title: "Check evidence and referees", body: <>Read the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> and speak with a non-family referee who directly observed the candidate’s work with children.</> },
          { title: "Arrange a paid trial", body: "Agree the duration, duties, supervision and hourly rate beforehand. A trial shows how the role actually works far better than an interview alone." },
        ]} />
      </GuideSection>

      <GuideSection id="trial-and-contract" title="Trial and written agreement" intro={<Prose>Agree the trial before it starts: the days, the hours, the duties, who supervises, the pay and what happens afterwards. Pay the nanny for trial work that involves childcare or other useful work.</Prose>}>
        <Prose>Once the role is agreed, record it in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>: hours and guaranteed time, duties, pay and pay cycle, leave, public holidays, sick leave, transport and expenses, notice, safety information and how changes will be agreed. The <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> covers the household information and emergency plan to prepare before the first regular day.</Prose>
      </GuideSection>

      <GuideSection id="keeping-role-sustainable" title="Keeping a full-time role sustainable" intro={<Prose>A full-time nanny role works when it is liveable for the person doing it. Regular hours, clear boundaries, predictable pay and respectful communication matter as much as the initial hire.</Prose>}>
        <Prose>Review the arrangement together after the first month and then at sensible intervals: have the duties changed, are the hours still as agreed, is travel workable, and does the pay still reflect the role? Record agreed changes rather than letting the role quietly expand. If the family’s needs change, a <Link href="/part-time-nanny" className="text-primary underline underline-offset-2 font-semibold">part-time arrangement</Link> or a different care pattern may fit better than stretching a full-time role beyond its design.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
