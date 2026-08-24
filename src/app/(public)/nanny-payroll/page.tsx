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
  Subheading,
  type GuideFaq,
} from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Nanny Payroll NZ: PAYE, IR56, KiwiSaver and Records";
const description = "Understand nanny payroll in New Zealand, including worker status, the IR56 private domestic worker route, household employer payroll, PAYE, leave records, KiwiSaver and ACC.";
const path = "/nanny-payroll";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "Who pays PAYE for a nanny in New Zealand?", answer: "It depends on the arrangement. A nanny who meets every condition for an IR56 private domestic worker calculates, files and pays their own PAYE and other deductions. If the nanny is an employee who does not qualify for IR56, the household employer will generally need to register, deduct and report payroll amounts. A genuine contractor manages their own tax, but contractor status must be legally correct." },
  { question: "What is an IR56 nanny?", answer: "IR56 is a tax process for certain employees, including qualifying part-time private domestic workers. The nanny must work in the employer’s private home, do work unrelated to the employer’s business, be paid directly by the employer and work no more than 30 hours a week on average for each employer. They register with IRD and manage their own monthly obligations." },
  { question: "Is an IR56 worker self-employed?", answer: "No. Inland Revenue says an IR56 worker pays their own tax on wages or salary and cannot be an IR56 worker if they are self-employed. IR56 changes who handles PAYE; it does not by itself make the nanny a contractor or remove employment rights." },
  { question: "What if my nanny works more than 30 hours a week?", answer: "If a private domestic employee works more than 30 hours a week on average for one employer, they do not meet that IR56 condition. Inland Revenue’s current guide says that employer is responsible for PAYE and other deductions. Check the full facts and register as an employer where required." },
  { question: "Do I have to provide a nanny payslip?", answer: "New Zealand does not generally require every employer to issue a payslip, but employers must keep complete wage, time, holiday and leave records and show them to the employee on request. A clear payslip is good practice and reduces misunderstandings." },
  { question: "How long do nanny payroll records need to be kept?", answer: "Employment New Zealand says wage and time, holiday and leave records must be kept for six years. Tax and KiwiSaver records can have different or longer requirements—Inland Revenue’s guidance commonly requires seven years—so build the system to meet the longest applicable period." },
  { question: "Does a nanny get holiday pay and sick leave?", answer: "Employees receive statutory leave and holiday rights when the relevant eligibility rules are met. IR56 employees are still employees. Do not assume every casual or part-time arrangement can simply add 8% holiday pay; that method is lawful only in defined situations." },
  { question: "Does NannyOra run payroll for families?", answer: "NannyOra is a discovery and matching platform, not the household employer. Families and nannies must establish the correct worker status and payroll route. Use Inland Revenue, Employment New Zealand, ACC or a New Zealand payroll professional for advice on the individual arrangement." },
];

const setupSteps = [
  { title: "Confirm worker status", body: "Decide whether the real relationship is employment or genuine contracting under current New Zealand tests. Do not use tax convenience to choose the label." },
  { title: "Test the IR56 conditions", body: "If the nanny is an employee, check whether every private-domestic-worker condition is met. Record the answer, especially average weekly hours for this household." },
  { title: "Set up the correct payer", body: "Either the eligible nanny registers and follows IR56, or the household registers as an employer and runs PAYE. A genuine contractor invoices and manages business tax." },
  { title: "Connect the employment agreement", body: "Configure gross pay, guaranteed hours, pay cycle, leave, public holidays, additional hours, reimbursements and authorised deductions from the signed agreement." },
  { title: "Run and review every pay", body: "Approve hours, calculate gross-to-net pay, file on time, make payments, update leave and preserve detailed records. Recheck the setup whenever hours or status change." },
];

export default function NannyPayrollPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-21" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Payroll", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra NZ payroll guide"
      title={title}
      description={description}
      imageTags={["professional", "nanny", "family", "planning"]}
      imageSeed="nanny-payroll-nz"
      highlights={["IR56 decision guide", "Household payroll steps", "Leave and record checks", "Official NZ sources"]}
      toc={[
        { id: "start-with-status", label: "Start with worker status" },
        { id: "ir56", label: "IR56 explained" },
        { id: "household-employer", label: "Household employer payroll" },
        { id: "gross-to-net", label: "Gross-to-net pay" },
        { id: "leave-holidays", label: "Leave and public holidays" },
        { id: "kiwisaver-acc", label: "KiwiSaver and ACC" },
        { id: "records", label: "Records and payslips" },
        { id: "payroll-checklist", label: "Payday checklist" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-contract", label: "Nanny contract", description: "Set the gross pay, hours, leave, expenses and employment terms first." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Discuss pay expectations and practical duties before an offer." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Complete role-relevant checks before the regular start date." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare the in-home working environment and emergency plan." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare experience, availability and rates." },
        { href: "/pricing", label: "NannyOra pricing", description: "See current platform pricing, which is separate from nanny wages." },
      ]}
      ctaTitle="Build the care arrangement on clear numbers"
      ctaBody="Find a nanny whose experience and availability fit, agree the role in writing, then use the correct New Zealand payroll pathway."
    >
      <GuideSection
        id="start-with-status"
        title="Nanny payroll starts with worker status—not software"
        intro={<Prose>Before calculating PAYE, decide what the working relationship really is. The same person cannot be treated as an employee for some rights and casually called a contractor to avoid other obligations.</Prose>}
      >
        <Prose>
          Regular in-home nanny care often has employee features because the household sets the location, recurring hours and duties and expects the nanny to perform the work personally. However, each arrangement needs to be tested under current New Zealand law. The statutory contractor gateway test has applied since 21 February 2026; if all of its criteria are not met, the common-law tests determine the true nature of the relationship.
        </Prose>
        <Prose>
          Read Employment New Zealand’s current <SourceLink href="https://www.employment.govt.nz/starting-employment/types-of-worker/employee-or-contractor">employee-or-contractor test</SourceLink> and document the conclusion. The <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract guide</Link> explains how the status decision affects the written agreement.
        </Prose>
        <div className="grid sm:grid-cols-3 gap-4">
          <InfoCard title="Employee, IR56 eligible">
            The nanny remains an employee but uses the special private-domestic-worker process to calculate, file and pay their own PAYE and applicable deductions.
          </InfoCard>
          <InfoCard title="Employee, household payroll">
            The family is the employer and generally registers with Inland Revenue, makes deductions, files employment information and pays the nanny net wages.
          </InfoCard>
          <InfoCard title="Genuine contractor">
            A self-employed business invoices for services and manages its own tax. This route is only appropriate when the actual facts meet the legal tests.
          </InfoCard>
        </div>
        <InfoCard title="IR56 is not contractor status" tone="important">
          Inland Revenue expressly says an IR56 worker pays tax on wages or salary and cannot be an IR56 worker if self-employed. Keep the employment-law analysis separate from the question of who sends PAYE to IRD.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="ir56"
        title="When a nanny may be an IR56 private domestic worker"
        intro={<Prose>IR56 is designed for certain workers who are employees but handle their own PAYE. Inland Revenue includes qualifying part-time nannies in the private domestic worker category.</Prose>}
      >
        <Subheading>All four conditions must apply</Subheading>
        <Checklist items={[
          "The nanny works in the employer’s private home.",
          "The work is not related to a business operated by the employer.",
          "The employer pays the nanny directly.",
          "The nanny does not work more than 30 hours a week on average for each employer.",
        ]} />
        <Prose>
          Hours are tested for each employer. Inland Revenue gives the example that a domestic worker can exceed 30 total hours across several households and still qualify when they do not exceed the threshold for any one employer. By contrast, if the nanny works more than 30 hours on average for one household, that household is responsible for PAYE under the current guide.
        </Prose>
        <Prose>
          An eligible nanny registers as an IR56 worker, calculates their own PAYE and other applicable deductions, files employment information and pays Inland Revenue. Current IRD guidance says monthly employment information is due within 10 working days after the end of the month in which payment was received, and payment is due by the 20th of the following month. Confirm those dates rather than relying on a saved checklist. See <SourceLink href="https://www.ird.govt.nz/roles/ir56-workers/private-domestic-workers">IRD’s private domestic worker criteria</SourceLink> and <SourceLink href="https://www.ird.govt.nz/roles/ir56-workers">IR56 obligations</SourceLink>.
        </Prose>
        <InfoCard title="What the family should still do" tone="soft">
          Put gross pay, hours, leave and expenses in the employment agreement; pay the agreed gross amount on time; keep evidence of hours and payments; make sure the nanny understands who handles PAYE; and revisit the decision if weekly hours or the way care is delivered changes.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="household-employer"
        title="When the household needs to run employer payroll"
        intro={<Prose>If the nanny is an employee and does not qualify for IR56, the household generally takes on the normal employer payroll role. More than 30 average weekly hours for one household is an important trigger, but other facts can also prevent IR56 eligibility.</Prose>}
      >
        <Steps items={setupSteps} />
        <Subheading>Typical employer setup tasks</Subheading>
        <Checklist items={[
          "Register as an employer with Inland Revenue before required deductions and filings begin.",
          "Collect the employee’s IRD number, tax-code declaration and relevant KiwiSaver information securely.",
          "Configure the employee’s gross rate, pay cycle, ordinary hours and lawful deductions.",
          "Track actual days and hours, including additional hours and public-holiday work.",
          "Calculate gross pay, PAYE and other deductions using current rates or compliant NZ payroll software.",
          "Pay net wages and agreed reimbursements to the correct bank account.",
          "File employment information and pay employer deductions by the current deadlines.",
          "Update leave balances and retain the underlying records.",
        ]} />
        <Prose>
          For electronic payday filing, Inland Revenue currently requires employment information within two working days of each payday. Check <SourceLink href="https://www.ird.govt.nz/employing-staff/payday-filing">IRD’s payday filing page</SourceLink> because deadlines and processes can change.
        </Prose>
      </GuideSection>

      <GuideSection
        id="gross-to-net"
        title="From agreed nanny rate to net pay"
        intro={<Prose>Start with the gross wage in the signed agreement. Gross pay is not the amount the nanny receives after deductions, and reimbursements for genuine work expenses should not be confused with wages.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Build gross earnings">
            Ordinary paid hours, additional hours, paid leave, public-holiday entitlements, allowances and any other taxable payment must be classified correctly for the period.
          </InfoCard>
          <InfoCard title="Apply lawful deductions">
            PAYE may include tax and the ACC earners’ levy. KiwiSaver, student loan, child support or other amounts can apply. Non-statutory deductions generally require a lawful basis and written consent.
          </InfoCard>
          <InfoCard title="Keep expenses separate">
            Record approved mileage, parking, children’s activities and purchases with receipts or another agreed process. Do not expect the nanny to fund routine family costs from net wages.
          </InfoCard>
          <InfoCard title="Pay and explain the result">
            Pay on the agreed day and give a clear breakdown of hours, gross pay, deductions, reimbursements, net pay and relevant leave information.
          </InfoCard>
        </div>
        <Subheading>Do not compare platform fees with nanny wages</Subheading>
        <Prose>
          NannyOra membership or booking charges are separate from the nanny’s gross pay and household employment costs. Review <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">current NannyOra platform pricing</Link> independently, then build a total childcare budget that includes wages, leave, payroll support, KiwiSaver or ACC obligations where applicable, mileage, activities and backup care.
        </Prose>
      </GuideSection>

      <GuideSection
        id="leave-holidays"
        title="Leave, public holidays and changing schedules"
        intro={<Prose>Payroll must reflect employment rights and the nanny’s actual work pattern. Part-time and IR56 status do not erase employee entitlements.</Prose>}
      >
        <Checklist items={[
          "Record when annual-holiday entitlement dates arise and what leave is taken and paid.",
          "Track sick leave and other statutory leave where eligibility requirements are met.",
          "Identify otherwise working days before calculating public-holiday entitlements.",
          "Record hours worked on a public holiday and any alternative-holiday balance.",
          "Use the correct holiday-pay calculation for variable or changing hours.",
          "Update payroll when guaranteed hours, regular days or the employment type changes.",
        ]} />
        <InfoCard title="Do not add 8% automatically" tone="important">
          Pay-as-you-go annual holiday pay is lawful only for defined types of employment and must be agreed and shown correctly. A person being called “casual” or working part-time does not automatically make 8% the right method. Check Employment New Zealand’s current holiday guidance or use a payroll professional.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="kiwisaver-acc"
        title="KiwiSaver and ACC in a nanny arrangement"
        intro={<Prose>These obligations depend on the worker and payroll route, and rates change. Use current official calculators rather than copying a percentage from an old article.</Prose>}
      >
        <Subheading>KiwiSaver</Subheading>
        <Prose>
          A household running employer payroll needs to check whether a new employee is already a KiwiSaver member, whether automatic enrolment applies, what deductions are required and whether compulsory employer contributions apply. Inland Revenue’s <SourceLink href="https://www.ird.govt.nz/kiwisaver/kiwisaver-for-employers">KiwiSaver for employers</SourceLink> page contains the current process and rates.
        </Prose>
        <Prose>
          Private domestic IR56 workers use a different joining and reporting pathway. IRD says they opt in directly with a provider and include applicable KiwiSaver amounts with their IR56 employment information. Use the dedicated <SourceLink href="https://www.ird.govt.nz/roles/ir56-workers/joining-kiwisaver-if-youre-an-ir56-worker">IR56 KiwiSaver guidance</SourceLink> for the current responsibilities of both parties.
        </Prose>
        <Subheading>ACC</Subheading>
        <Prose>
          PAYE commonly includes the ACC earners’ levy, while employer or private domestic worker circumstances can also produce ACC Work levy responsibilities. The payer, classification and amounts depend on the arrangement. Review <SourceLink href="https://www.acc.co.nz/for-business/received-an-invoice/calculate-your-levies">ACC’s levy guidance for employers and private domestic workers</SourceLink> or ask ACC to confirm the correct account treatment.
        </Prose>
      </GuideSection>

      <GuideSection
        id="records"
        title="Nanny timesheets, records and payslips"
        intro={<Prose>Good records are the evidence that the nanny was paid and received leave correctly. A bank transfer alone does not show which hours, deductions or entitlements produced the amount.</Prose>}
      >
        <Checklist items={[
          "Each day worked and the actual number of hours worked that day.",
          "Ordinary, additional, overnight, travel and public-holiday hours as applicable.",
          "Gross wages for each pay period and how they were calculated.",
          "PAYE, KiwiSaver, student loan, child support and any other deduction or contribution.",
          "Reimbursements, mileage, allowances and the supporting approval or receipt.",
          "Annual holidays, sick leave, other leave and alternative-holiday balances and payments.",
          "Employment agreement, variations, tax forms and relevant KiwiSaver notices.",
          "Filed employment information and proof of payments to the nanny, IRD or providers.",
        ]} />
        <Prose>
          Employment New Zealand says wage and time, holiday and leave records must be kept for six years, even after the employee leaves. Tax and KiwiSaver records may need to be kept for seven years. Read the <SourceLink href="https://www.employment.govt.nz/starting-employment/rights-and-responsibilities/record-keeping">official record-keeping requirements</SourceLink> and design your system for all applicable retention periods.
        </Prose>
        <InfoCard title="Payslips are good practice" tone="soft">
          Although a payslip is not generally mandatory, a clear statement each payday helps both sides check the gross pay, hours, deductions, reimbursements, net pay and leave. The employee can request access to required wage, time and leave records whether or not a payslip was issued.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="payroll-checklist"
        title="A practical nanny payday checklist"
        intro={<Prose>Use this operational sequence for each pay period, adapting the filing steps to IR56 or household-employer payroll.</Prose>}
      >
        <Checklist items={[
          "Approve the nanny’s daily hours and resolve any discrepancy before calculation.",
          "Add paid leave, public-holiday treatment, allowances and approved additional hours.",
          "Separate genuine expense reimbursements from gross wages.",
          "Calculate current PAYE and other deductions using the correct tax code and official rules.",
          "Calculate any applicable KiwiSaver employer contribution or other employer amount.",
          "Pay gross wages for IR56 or net wages for employer-run payroll, as the correct route requires.",
          "Provide a clear pay breakdown and update leave balances.",
          "File employment information and pay deductions by the applicable deadline.",
          "Store the timesheet, calculation, payment and filing evidence securely.",
          "Reassess status if hours, payer, location or the nature of the working relationship changes.",
        ]} />
        <InfoCard title="When to use a payroll professional" tone="important">
          Get tailored help when status is uncertain, hours cross the IR56 threshold, pay varies materially, the nanny works overnight or travels, the family provides accommodation, there are multiple employing adults, historic records need correction, or employment is ending with complex leave balances.
        </InfoCard>
      </GuideSection>
    </EditorialGuide>
  );
}
