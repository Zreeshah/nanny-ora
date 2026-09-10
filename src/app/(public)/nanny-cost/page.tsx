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

const title = "Nanny Cost NZ: What It Costs to Employ a Nanny";
const description =
  "Understand nanny costs in NZ: hourly rates, full-time and part-time budgets, employer costs, specialist care and questions to settle before agreeing pay.";
const path = "/nanny-cost";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "How much does a nanny cost in New Zealand?", answer: "There is no single national nanny rate. Pay depends on the child’s age and needs, relevant experience, hours, location, number of children, transport, duties and whether the role includes non-standard or short-notice work. Build a total employment budget rather than choosing from an hourly figure alone." },
  { question: "What hourly rate should I pay a nanny?", answer: "Start with the legal minimum that applies, then compare recent local roles with similar hours and responsibilities. Current Auckland job advertisements can span roughly the high-$20s to mid-$30s per hour, but those listings are a market snapshot—not a NannyOra rate card or a guarantee for every role." },
  { question: "Is a full-time nanny cheaper than a part-time nanny?", answer: "A full-time arrangement can produce a more predictable weekly budget, while part-time or split-shift care may need a higher hourly rate to reflect travel, schedule gaps or limited guaranteed hours. Compare the whole weekly role, not just the advertised rate." },
  { question: "What costs should I budget for besides a nanny’s wages?", answer: "Depending on the arrangement, include leave, public holidays, payroll administration, KiwiSaver or ACC obligations, mileage, parking, children’s activities, agreed training and backup care. Confirm worker status before calculating the budget." },
  { question: "Does NannyOra pricing include the nanny’s wages?", answer: "No. NannyOra platform charges are separate from the pay and employment costs agreed between a family and nanny. See the NannyOra Pricing page for current membership, registration and booking fees." },
  { question: "Do newborn or specialist nannies cost more?", answer: "They can. A role may attract a higher rate when it calls for recent newborn experience, verified qualifications, specialist-informed support, complex routines, overnight work or responsibility for multiple children. The relevant evidence and actual scope matter more than the label." },
  { question: "Should I pay a nanny for a trial?", answer: "Yes, when the person provides childcare or other useful work. Agree the duration, duties, supervision and hourly rate beforehand. A paid recruitment trial is different from a formal employment-law trial period." },
  { question: "Can I call a nanny a contractor to avoid employer costs?", answer: "No. Worker status is decided from the real working relationship and current legal tests, not a preferred label. A regular nanny working personally in a family home at set times often has employee features." },
];

const costFactors = [
  { title: "Relevant experience", body: "Recent work with your child’s age group, reliability in similar routines and evidence from referees often matter more than a general number of years in childcare." },
  { title: "Hours and certainty", body: "Guaranteed, predictable hours are different from short shifts, split shifts, changing rosters, weekends, nights or last-minute cover." },
  { title: "Children and responsibilities", body: "Multiple children, newborns, school runs, meals, activities, household coordination and transport all change the scope of the job." },
  { title: "Location and travel", body: "Commute, parking, use of a personal vehicle and the practical travel area affect the role. Do not assume one city’s listing rate applies everywhere." },
  { title: "Specialist-informed support", body: "ECE experience, first aid, sensory-aware or neurodiverse-care experience and the ability to work within a clear care plan may change the market for a role." },
  { title: "The full employment offer", body: "A fair rate sits alongside agreed leave, reimbursements, work boundaries, communication and a role a person can realistically sustain." },
];

export default function NannyCostPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-09-11" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Cost", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra cost guide"
      title={title}
      description={description}
      imageTags={["family", "planning", "nanny", "budget"]}
      imageSeed="nanny-cost-nz"
      highlights={["Market context, not promises", "Total-budget planning", "NZ employer considerations", "Questions for a fair offer"]}
      toc={[
        { id: "cost-vs-platform-pricing", label: "Nanny cost vs platform pricing" },
        { id: "hourly-rates", label: "Hourly-rate context" },
        { id: "what-changes-cost", label: "What changes the cost" },
        { id: "full-time-part-time", label: "Full-time vs part-time" },
        { id: "employer-costs", label: "Employer-side costs" },
        { id: "budget", label: "Build your budget" },
        { id: "agreeing-rate", label: "Agreeing a fair rate" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Compare available profiles against a clear care brief." },
        { href: "/how-to-hire-a-nanny", label: "How to hire a nanny", description: "Move from budget planning to a careful hiring process." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand PAYE, IR56, KiwiSaver, ACC and records." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Put pay, hours, duties and changes in writing." },
        { href: "/specialist-nanny-care", label: "Specialist nanny care", description: "Plan a role around relevant individual support." },
        { href: "/pricing", label: "NannyOra pricing", description: "Review NannyOra membership and booking charges separately." },
      ]}
      ctaTitle="Budget for the role you actually need"
      ctaBody="Define the hours, duties and support your family needs, then compare profiles and discuss pay with the full arrangement in view."
    >
      <GuideSection
        id="cost-vs-platform-pricing"
        title="Nanny cost and NannyOra pricing are different things"
        intro={<Prose>A nanny cost is what a family pays to employ or engage the caregiver. It includes the agreed pay and, where relevant, the obligations and practical expenses that come with the arrangement. NannyOra pricing is what the platform charges for its own membership, registration or booking features.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="What it costs to employ a nanny"><Prose>Consider gross pay, paid hours, leave and public-holiday treatment, payroll, mileage, activities, training, employer contributions or levies where applicable, and a backup-care plan.</Prose></InfoCard>
          <InfoCard title="What NannyOra charges" tone="soft"><Prose>Membership, nanny registration or upgrade options, and booking-related fees are platform charges. Read the <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">NannyOra pricing page</Link> for the current platform offer rather than adding those fees into a nanny’s wage.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="hourly-rates" title="Typical nanny hourly-rate context in New Zealand" intro={<Prose>There is no official national nanny-rate table and NannyOra does not set a mandatory rate. The right number comes from a clear role, recent local market evidence and the legal minimum that applies to the employee or worker.</Prose>}>
        <Prose>From 1 April 2026, the adult minimum wage is NZ$23.95 per hour before tax. That is a legal floor for eligible employees, not a typical experienced-nanny rate or a complete budget. See <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage rates</SourceLink> before making an offer.</Prose>
        <InfoCard title="Auckland listing snapshot—not a rate card" tone="important"><Prose>Recent Auckland nanny job advertisements can show rates from roughly NZ$28 to NZ$35+ per hour for different scopes and schedules. For example, current Red Robin listings include roles around $28–$30, $30–$35 and $34 per hour. Treat advertised jobs as a starting point for comparing similar work, not a national average, a promise of availability or a rate NannyOra endorses. Check live <SourceLink href="https://redrobin.co.nz/jobs-board/">New Zealand nanny job listings</SourceLink> close to your hiring date.</Prose></InfoCard>
        <Prose>Auckland can have a particularly competitive market because of commute, travel and demand, but families should not assume that another location will be cheaper or that an Auckland range automatically transfers. Compare the actual local role, candidate pool and travel area. As NannyOra expands beyond Auckland, local pages should show only real availability and current local context.</Prose>
      </GuideSection>

      <GuideSection id="what-changes-cost" title="What makes one nanny role cost more than another" intro={<Prose>Pay reflects the role you are asking someone to take on. These factors help explain differences without treating a child or a caregiver as a commodity.</Prose>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{costFactors.map((factor) => <InfoCard key={factor.title} title={factor.title}>{factor.body}</InfoCard>)}</div>
      </GuideSection>

      <GuideSection id="full-time-part-time" title="Full-time versus part-time nanny costs" intro={<Prose>The lowest hourly number is not always the lowest realistic weekly cost. A job needs to be attractive and workable for the person travelling to and caring for your children.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Full-time or regular long days"><Prose>Regular guaranteed hours can make income and scheduling more predictable for both sides. Your budget still needs to cover actual hours, public holidays, leave and any changes agreed in the employment terms.</Prose></InfoCard>
          <InfoCard title="Part-time, school-hour or split-shift care"><Prose>Shorter windows can be excellent for a family, but may have a different hourly market because they limit other work and require travel for a small number of paid hours. Be upfront about guaranteed hours and holidays.</Prose></InfoCard>
          <InfoCard title="Overnight, weekend or emergency care"><Prose>Define whether the caregiver is expected to be awake, what duties apply, when breaks occur, minimum booking time and what happens if plans change. Avoid calling availability “flexible” when the actual expectation is open-ended.</Prose></InfoCard>
          <InfoCard title="Newborn or specialist support"><Prose>Recent comparable experience, clear boundaries and practical care plans matter. Read the <Link href="/specialist-nanny-care" className="text-primary underline underline-offset-2 font-semibold">specialist nanny care guide</Link> before assuming a label alone explains the rate.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="employer-costs" title="Employer-side costs families should plan for" intro={<Prose>Many regular nanny arrangements have employee features. First decide the real worker status; then make the budget match the obligations that follow. Calling a worker a contractor does not decide the legal result.</Prose>}>
        <Checklist items={["Gross wages for the agreed paid hours, including the correct treatment of additional hours.", "Annual holidays, sick leave, public holidays and other minimum rights where the nanny is an employee.", "PAYE, KiwiSaver and ACC responsibilities that apply to your payroll route.", "Payroll software, an accountant or time spent running records correctly.", "Approved mileage, parking, transport, children’s activities and genuine work expenses.", "Training, first-aid renewal, insurance considerations or backup care if the role requires them."]} />
        <Prose>Some part-time private domestic workers, including qualifying nannies, may use the IR56 route; that does not make them self-employed. The eligibility details include work in the employer’s home, direct payment and no more than 30 average hours a week for each employer. Read <SourceLink href="https://www.ird.govt.nz/roles/ir56-workers/private-domestic-workers">IRD’s current private domestic worker guidance</SourceLink> and use the detailed <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> before setting up pay.</Prose>
      </GuideSection>

      <GuideSection id="budget" title="Build a realistic nanny budget" intro={<Prose>Use a weekly or monthly model rather than an isolated hourly number. This gives you a more honest basis for comparing a nanny with other childcare options.</Prose>}>
        <Steps items={[{ title: "Write the paid schedule", body: "List regular hours, likely additional hours, school holidays, early starts, late finishes, overnight duties and the minimum hours you can genuinely guarantee." }, { title: "Agree the gross pay basis", body: "Document the hourly rate or salary, pay cycle, overtime or additional-hours approach, expenses and how cancellations or schedule changes are handled." }, { title: "Add employer and practical costs", body: "Check the employment, leave, payroll, KiwiSaver and ACC responsibilities that apply, then include transport, activities, training and backup care." }, { title: "Separate platform fees", body: <>Review <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">NannyOra pricing</Link> separately from the caregiver’s compensation, so neither side misunderstands the offer.</> }, { title: "Revisit after the trial", body: "If the duties, hours or child’s needs change, discuss the impact in good faith and record any agreed change rather than letting the role quietly expand." }]} />
      </GuideSection>

      <GuideSection id="agreeing-rate" title="Questions to ask before agreeing on a rate" intro={<Prose>A fair pay conversation is clearer when neither side has to guess the work. Ask these questions before an offer, then record the answers in the agreement.</Prose>}>
        <Checklist items={["Which hours are guaranteed, and which are optional or subject to change?", "What care is sole charge, and what support is available from a parent or whānau?", "Which child-related duties are included, and what tasks are outside the role?", "Is school transport required? Who provides the vehicle, car seats, mileage and insurance?", "What experience, first aid or specialist background is essential for this child and routine?", "How are additional hours, public holidays, overnight care and school holidays paid?", "Which expenses are reimbursed, and how will receipts or mileage be approved?", "Who is responsible for payroll, tax, KiwiSaver and records under the actual arrangement?", "When will the family and nanny review pay, duties and the working arrangement?"]} />
        <Prose>Once the role and rate are agreed, use a written <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>. Before choosing a person, work through structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">interview questions</Link> and the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting process</Link>, then start the search through <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link>.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
