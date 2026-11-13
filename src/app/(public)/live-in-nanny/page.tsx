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

const title = "Live-In Nanny: What Families Should Agree Before Hiring";
const description = "A New Zealand guide to hiring a live-in nanny: work hours, accommodation, privacy, pay, household boundaries and the agreement families should make first.";
const path = "/live-in-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What is a live-in nanny?", answer: "A live-in nanny lives in the family home while providing agreed childcare. The living arrangement does not change the need for clear work hours, pay, duties, rest, privacy and an employment or accommodation arrangement suited to the facts." },
  { question: "Is a live-in nanny available all the time?", answer: "No. Living in a home is not the same as being on duty. Families and nannies should define working hours, off-duty time, night responsibilities, meals, private space, visitors and how urgent requests are handled before the arrangement begins." },
  { question: "Can accommodation be part of a live-in nanny’s pay?", answer: "Accommodation and deductions can have employment, tax and tenancy implications. Any arrangement should be clear, reasonable and documented. Use current Employment New Zealand guidance and obtain appropriate advice for the actual arrangement before agreeing deductions." },
  { question: "What should a live-in nanny agreement include?", answer: "Include childcare duties, paid hours, pay, rest and time off, accommodation and private space, meals, transport, household access, visitors, privacy, notice, safety and what happens if either the job or living arrangement ends." },
  { question: "How is a live-in nanny different from an au pair?", answer: "A live-in nanny is a childcare role with agreed employment terms. An au pair arrangement may also involve home sharing and a cultural-exchange element. Do not rely on labels; assess the actual role, accommodation, employment and any immigration requirements." },
];

export default function LiveInNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-14" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Live-In Nanny", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Live-in childcare guide"
      title={title}
      description={description}
      imageTags={["real-home-care", "nanny", "family", "home", "planning"]}
      imageSeed="live-in-nanny"
      highlights={["Separate work and home time", "Protect privacy and rest", "Settle accommodation clearly", "Write down the whole arrangement"]}
      toc={[
        { id: "living-in-is-not-on-call", label: "Living in is not being on call" },
        { id: "what-to-agree", label: "What to agree" },
        { id: "accommodation-and-pay", label: "Accommodation and pay" },
        { id: "privacy-and-household-life", label: "Privacy and household life" },
        { id: "how-to-hire", label: "How to hire" },
        { id: "review-and-change", label: "Review and change" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vs-au-pair", label: "Nanny vs au pair", description: "Compare a live-in childcare role with a host-family arrangement." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Put work hours, duties, pay and changes in a written agreement." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand the questions around status, PAYE and records." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Build a complete budget beyond an hourly figure." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare the home, contacts and care boundaries for a safe start." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse available profiles and discuss the specific role directly." },
      ]}
      ctaTitle="Start with the right live-in conversation"
      ctaBody="Write the care role and home arrangements clearly, then use NannyOra to begin a considered search for the person who may be a fit."
    >
      <GuideSection id="living-in-is-not-on-call" title="Living in does not mean being on duty all the time" intro={<Prose>A live-in nanny arrangement can give a family practical continuity, particularly around long days or changing schedules. It also brings the workplace into a person’s home. The success of the arrangement depends on treating both sides with clarity and respect.</Prose>}>
        <Prose>Living in is an accommodation arrangement, not a promise of constant availability. A nanny needs genuine off-duty time, rest and privacy. A family needs reliable childcare during the hours it has agreed to pay for. Make that boundary visible from the first conversation rather than trying to negotiate it after everyone is sharing a roof.</Prose>
        <InfoCard title="Do not use availability as an undefined benefit" tone="important">If the family needs early mornings, evenings, overnight response or flexible extra hours, define exactly what that means, how it will be requested, whether it is optional and how it will be paid. “You live here anyway” is not a fair substitute for an agreed role.</InfoCard>
      </GuideSection>

      <GuideSection id="what-to-agree" title="What a live-in nanny arrangement should cover" intro={<Prose>There are two connected parts: the childcare job and the living arrangement. Both deserve their own clear terms.</Prose>}>
        <Checklist items={[
          "The children, care duties, paid hours, regular days and who supervises or gives instructions.",
          "Additional hours, night responsibilities, weekends, school holidays, breaks and time off.",
          "Pay, pay cycle, expenses, vehicle use, mileage, food and any agreed work-related costs.",
          "The room or accommodation provided, shared areas, access to the home and a suitable rest space.",
          "Meals, laundry, kitchen use, household rules, visitors, noise, privacy and social-media expectations.",
          "Notice, a review process and what happens if either the employment or accommodation arrangement ends.",
        ]} />
        <Prose>The detailed <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract guide</Link> can help you turn the job side of the role into a written agreement. Because live-in arrangements have added legal and practical complexity, obtain appropriate advice for your circumstances.</Prose>
      </GuideSection>

      <GuideSection id="accommodation-and-pay" title="Accommodation, pay and deductions" intro={<Prose>It can be tempting to discuss a live-in role as one combined package. It is safer and fairer to separate the wage for work from the terms for accommodation, food and any deductions.</Prose>}>
        <Prose>Employment New Zealand explains that accommodation deductions need to be agreed and reasonable, and that an accommodation agreement should be separate from—or able to be separated from—the employment agreement. It also notes that tax and tenancy issues may need consideration. Read <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">the current Employment New Zealand guidance on pay, accommodation and deductions</SourceLink> before making an offer.</Prose>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Price the childcare job"><Prose>Set the gross pay, paid hours, additional-hours approach, holidays, expenses and review dates. Use the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> to build the full family budget.</Prose></InfoCard>
          <InfoCard title="Document the accommodation"><Prose>Describe the room, shared spaces, utilities, meals, any deductions, notice and what happens if the work relationship changes. Never leave a live-in arrangement to an informal assumption.</Prose></InfoCard>
        </div>
        <Prose>For recurring employment, work through the actual payroll and recordkeeping responsibilities using the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link>. It is a planning resource, not individual legal or tax advice.</Prose>
      </GuideSection>

      <GuideSection id="privacy-and-household-life" title="Privacy, rest and ordinary household life" intro={<Prose>The relationship can be warmer and more integrated than a live-out role, but that makes boundaries more—not less—important.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="For the nanny"><Prose>Private space, time away from the household, clear off-duty hours, reasonable access to facilities and the freedom to have a personal life are fundamental to a sustainable arrangement.</Prose></InfoCard>
          <InfoCard title="For the family"><Prose>Families need confidence about visitors, keys, home security, children’s privacy, routines, vehicle use, photos and who is present in the home. These should be agreed, not guessed.</Prose></InfoCard>
          <InfoCard title="For the children"><Prose>Explain the arrangement in age-appropriate language and keep adult workplace or housing concerns out of the child’s role. Consistent routines and handovers matter.</Prose></InfoCard>
          <InfoCard title="For everyone"><Prose>Set a respectful route for raising concerns early. Small issues about dishes, noise or schedule changes are easier to solve before they become a conflict about the job or home.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire a live-in nanny carefully" intro={<Prose>A live-in arrangement asks two questions: is this person a strong childcare match, and can we share a home respectfully? Treat both as essential.</Prose>}>
        <Steps items={[
          { title: "Write the role and home brief", body: "Set out the childcare schedule, children’s routines, home location, room offered, shared spaces, household norms, pets, transport and non-negotiable boundaries." },
          { title: "Assess relevant childcare evidence", body: <>Use a structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview</Link>, references and proportionate <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting</Link> to assess the real care role.</> },
          { title: "Discuss the home honestly", body: "Talk through privacy, food, visitors, schedules, work-from-home parents, family culture and how each person uses the shared space. Both sides should be able to ask direct questions." },
          { title: "Put terms in writing before moving in", body: "Settle the employment and accommodation terms, get appropriate advice where needed, and agree a review point once the arrangement is underway." },
        ]} />
        <Prose>NannyOra’s directory can help you begin a wider nanny search, but a profile alone does not confirm that someone wants or is available for a live-in role. Discuss the arrangement directly and never imply an option that has not been confirmed.</Prose>
      </GuideSection>

      <GuideSection id="review-and-change" title="Review the arrangement and record changes" intro={<Prose>Families, children and work schedules change. A live-in arrangement needs a regular, calm way to revisit what is working.</Prose>}>
        <Prose>Schedule an early review after the first few weeks, then check in at agreed intervals. Talk about hours, children’s routines, rest, accommodation, meals, transport and any scope changes. Where a change affects the role or living terms, record the agreement rather than relying on memory.</Prose>
        <Prose>If you are deciding between a live-in nanny and an au pair arrangement, read <Link href="/nanny-vs-au-pair" className="text-primary underline underline-offset-2 font-semibold">nanny versus au pair</Link>. Immigration requirements, employment rights and accommodation obligations depend on the real arrangement, so check current official guidance and seek professional advice where appropriate.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
