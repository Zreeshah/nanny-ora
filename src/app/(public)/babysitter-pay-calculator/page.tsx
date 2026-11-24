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
import PayCalculator from "./PayCalculator";

const title = "Babysitter Pay Calculator NZ: Estimate Babysitting and Nanny Pay";
const description =
  "Estimate babysitting or nanny pay in New Zealand from hours and an hourly rate, using the Auckland listing snapshot and the current minimum wage as reference points.";
const path = "/babysitter-pay-calculator";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "Is this calculator a rate card?", answer: "No. It estimates gross pay from the hours and hourly rate you enter. The only reference figures it shows are the adult minimum wage (NZ$23.95 per hour from 1 April 2026) and the Auckland listing snapshot of roughly NZ$28–$35+ per hour from recent job advertisements. Agree the actual rate with the other party." },
  { question: "Does the calculator include tax?", answer: "No. The figures are gross pay before tax, and they do not include KiwiSaver, ACC, leave, public holidays or expenses. Work through the full employment setup in the nanny payroll guide before finalising a regular arrangement." },
  { question: "What rate should I enter?", answer: "Enter the rate you have agreed or are considering. If you have not agreed one yet, the Auckland listing snapshot of roughly NZ$28–$35+ per hour is a starting point for comparing similar work — not a national average or a rate NannyOra endorses." },
  { question: "How is the monthly figure calculated?", answer: "Weekly pay multiplied by 52 weeks, divided by 12 months. Occasional bookings are calculated from the hours per booking and the number of bookings per month you enter." },
  { question: "What if the rate is below the minimum wage?", answer: "The calculator will warn you. The adult minimum wage from 1 April 2026 is NZ$23.95 per hour before tax, and it is a legal floor for eligible employees. Check Employment New Zealand’s current minimum-wage guidance before agreeing pay." },
];

export default function BabysitterPayCalculatorPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitter Pay Calculator", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand pay tool"
      title={title}
      description={description}
      imageTags={["family", "planning", "budget", "care"]}
      imageSeed="babysitter-pay-calculator"
      highlights={["Gross pay estimates", "Regular or occasional care", "Minimum-wage check built in", "Auckland snapshot for context"]}
      toc={[
        { id: "calculator", label: "Estimate your pay" },
        { id: "what-figures-used", label: "What figures the calculator uses" },
        { id: "what-it-does-not-cover", label: "What it does not cover" },
        { id: "agree-a-rate", label: "Agree a fair rate" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a budget around the real hours, duties and employment arrangement." },
        { href: "/babysitting-rates-nz", label: "Babysitting rates NZ", description: "Work through what affects a fair rate for an evening or overnight booking." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand PAYE, IR56, KiwiSaver, ACC and records." },
        { href: "/babysitter-auckland", label: "Babysitter Auckland", description: "Find evening, weekend and occasional care in Auckland." },
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Decide whether your need is occasional help or a regular role." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles when you need a considered childcare match." },
      ]}
      ctaTitle="Agree the rate, then agree the role"
      ctaBody="Use the estimate as a starting point for the conversation — then record the hours, duties and pay in writing before care starts."
    >
      <GuideSection id="calculator" title="Estimate babysitting or nanny pay" intro={<Prose>Choose regular weekly care or occasional babysitting, set the hourly rate and the hours, and the calculator estimates gross pay per week, per month and per year.</Prose>}>
        <PayCalculator />
      </GuideSection>

      <GuideSection id="what-figures-used" title="What figures the calculator uses" intro={<Prose>The calculator uses only two reference figures, both taken from NannyOra’s own live cost guide. It invents no rates of its own.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Adult minimum wage: NZ$23.95 per hour"><Prose>From 1 April 2026, the adult minimum wage is NZ$23.95 per hour before tax. That is a legal floor for eligible employees, not a typical experienced-nanny rate. See <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage rates</SourceLink> before making an offer.</Prose></InfoCard>
          <InfoCard title="Auckland listing snapshot: roughly NZ$28–$35+ per hour"><Prose>Recent Auckland nanny job advertisements can show rates from roughly NZ$28 to NZ$35+ per hour for different scopes and schedules. Treat advertised jobs as a starting point for comparing similar work, not a national average, a promise of availability or a rate NannyOra endorses.</Prose></InfoCard>
        </div>
        <Prose>Everything else in the calculator comes from the numbers you enter. If you change the rate or the hours, the estimate changes with them — the tool does not adjust for experience, location, duties or the number of children. Those factors belong in the conversation, not in a formula.</Prose>
      </GuideSection>

      <GuideSection id="what-it-does-not-cover" title="What the calculator does not cover" intro={<Prose>Gross pay is only part of the cost of a regular arrangement. The calculator deliberately leaves the rest out, because those costs depend on the employment setup rather than the hourly rate.</Prose>}>
        <Checklist items={[
          "Tax, PAYE and the payroll route that applies to the arrangement.",
          "KiwiSaver and ACC responsibilities where they apply.",
          "Annual holidays, sick leave, public holidays and other minimum rights where the nanny is an employee.",
          "Approved mileage, parking, transport, children’s activities and genuine work expenses.",
          "Training, first-aid renewal, insurance considerations or backup care if the role requires them.",
        ]} />
        <Prose>Work through the full picture in the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> and the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> before finalising a regular role. Some part-time private domestic workers may use the IR56 route; the eligibility details include work in the employer’s home, direct payment and no more than 30 average hours a week for each employer.</Prose>
      </GuideSection>

      <GuideSection id="agree-a-rate" title="How to agree a fair rate" intro={<Prose>An estimate is a starting point for a conversation, not the end of one. The fairest rate is the one both sides understand and can sustain.</Prose>}>
        <Steps items={[
          { title: "Describe the real work", body: "Share the children’s ages, the hours, the duties, transport and anything that affects safe care before discussing a number." },
          { title: "Compare similar roles", body: "Use the Auckland listing snapshot as background, then compare recent local roles with similar hours and responsibilities." },
          { title: "Agree the whole arrangement", body: "Confirm guaranteed hours, additional hours, late finishes, public holidays, expenses and how changes will be handled." },
          { title: "Record it in writing", body: <>For occasional care, confirm the booking in a message. For a regular role, use a written <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>.</> },
        ]} />
        <Prose>For occasional bookings, the <Link href="/babysitting-rates-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rates guide</Link> explains the factors to work through. For regular care, start the search through <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> once the role and the budget are clear.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
