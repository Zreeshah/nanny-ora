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

const title = "Nanny Contract NZ: What to Include";
const description = "A New Zealand guide to nanny contracts and employment agreements, including duties, hours, pay, leave, privacy, transport, safety, changes and ending employment.";
const path = "/nanny-contract";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "Do I need a contract for a nanny in New Zealand?", answer: "If the nanny is an employee, every employee must have a written employment agreement. The agreement must contain legally required clauses and cannot remove minimum employment rights. Even for a genuine contractor, put the arrangement in writing—but the label does not determine the worker’s legal status." },
  { question: "Is a nanny usually an employee or contractor?", answer: "It depends on the real arrangement and current legal tests. A regular nanny who works personally in the family’s home at set times, under the family’s direction, often has employee features. From 21 February 2026, a statutory gateway test applies first to new contractor questions, followed by common-law tests where its criteria are not all met." },
  { question: "Can I use a generic nanny contract template?", answer: "A template can be a starting point, but it must match the actual arrangement and current New Zealand law. Generic documents often miss guaranteed hours, school-holiday changes, sole-charge breaks, mileage, car restraints, privacy, household cameras, emergency authority and child-specific duties." },
  { question: "What duties should a nanny contract include?", answer: "List core childcare duties and any agreed child-related tasks, such as meals, laundry, school transport, activities and tidying used spaces. If general housekeeping is required, define it before the offer and ensure the pay and schedule realistically cover it." },
  { question: "Should guaranteed hours be in the agreement?", answer: "Yes, where hours are agreed. Record the number of guaranteed hours, days, start and finish times, any flexibility, and what happens if the family cancels care or asks for additional hours. Avoid vague availability expectations." },
  { question: "Can a nanny have a 90-day trial period?", answer: "A trial period can only be used if current legal conditions are satisfied. Employment New Zealand says it must be agreed and included in an employment agreement signed before work starts, apply to a person who has not worked for that employer before, and last no more than 90 calendar days. Migrant-worker restrictions and other conditions may apply." },
  { question: "Can I include confidentiality and no-photo rules?", answer: "Yes. Define how family information, children’s images, school details, access codes and private conversations may be used and stored. Make the rules proportionate, reciprocal where appropriate and consistent with the Privacy Act and any disclosed household monitoring." },
  { question: "How do I end a nanny employment agreement?", answer: "Follow the agreement and New Zealand employment law. Notice wording does not remove good-faith, fair-process or minimum-right obligations. The correct process depends on whether the reason is performance, misconduct, redundancy, incapacity or another situation, so obtain advice before acting." },
];

const setupSteps = [
  { title: "Confirm worker status", body: "Apply the current New Zealand employee-or-contractor tests to the real relationship. Do this before choosing a document title or payroll method." },
  { title: "Agree the job", body: "Settle the children, location, duties, schedule, start date, reporting line, transport and any specialist requirements. Resolve assumptions before drafting clauses." },
  { title: "Build lawful employment terms", body: "Include every mandatory term and ensure minimum employment rights still apply. Add nanny-specific details that make the household arrangement workable." },
  { title: "Review and sign before work", body: "Give the nanny a reasonable opportunity to review the intended agreement and obtain advice. Both parties should keep the signed current version." },
  { title: "Update changes in writing", body: "If hours, duties, pay or the family’s needs change, discuss the effect in good faith and record any agreed variation instead of relying on informal messages." },
];

export default function NannyContractPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-21" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Contract", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra employment guide"
      title={title}
      description={description}
      imageTags={["professional", "family", "nanny", "agreement"]}
      imageSeed="nanny-contract-nz"
      highlights={["NZ employment context", "Nanny-specific clauses", "Plain-language checklist", "Payroll handoff"]}
      toc={[
        { id: "contract-or-agreement", label: "Contract or agreement?" },
        { id: "employee-or-contractor", label: "Employee or contractor" },
        { id: "required-terms", label: "Required terms" },
        { id: "nanny-specific-clauses", label: "Nanny-specific clauses" },
        { id: "hours-pay-leave", label: "Hours, pay and leave" },
        { id: "safety-privacy-transport", label: "Safety and privacy" },
        { id: "trial-changes-ending", label: "Trial, changes and ending" },
        { id: "before-signing", label: "Before signing" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Set up PAYE, records, KiwiSaver and ACC for the actual arrangement." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Resolve duties, hours and working style before making an offer." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Complete appropriate evidence checks before the regular start date." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Turn home, emergency and transport expectations into a safe handover." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse NannyOra profiles and compare suitable candidates." },
        { href: "/childcare-support", label: "Childcare support", description: "Review relevant New Zealand childcare support pathways." },
      ]}
      ctaTitle="Find the person before finalising the paperwork"
      ctaBody="Use NannyOra to discover a suitable nanny, then create an agreement that reflects the real role and gives both sides clarity from day one."
    >
      <GuideSection
        id="contract-or-agreement"
        title="Is a nanny contract the same as an employment agreement?"
        intro={<Prose>Families often search for a “nanny contract,” but the legally important question is the worker’s status. If the nanny is an employee, the document is an employment agreement and New Zealand employment law sets minimum content and rights. Calling it a service contract does not change the real relationship.</Prose>}
      >
        <Prose>
          Employment New Zealand states that every employee must have a written employment agreement. It must include required clauses, the employer must retain the current signed terms, and the employee must receive a copy on request. Minimum rights—such as lawful pay and holidays—apply even when the agreement forgets them or says something inconsistent.
        </Prose>
        <InfoCard title="This guide is a planning checklist, not a contract template" tone="important">
          A good agreement depends on the actual household, employment type and current law. Use Employment New Zealand’s official tools or an employment professional to produce and review the document. NannyOra connects families and carers; it does not become the nanny’s employer or provide individual legal advice.
        </InfoCard>
        <Steps items={setupSteps} />
      </GuideSection>

      <GuideSection
        id="employee-or-contractor"
        title="Decide whether the nanny is an employee or contractor"
        intro={<Prose>Worker status affects the document, payroll, leave, minimum rights and how the arrangement can end. Decide it from the real facts—not which option appears simpler.</Prose>}
      >
        <Prose>
          A regular nanny arrangement often includes employee indicators: the family sets the location and hours, defines the work, expects the named nanny to perform it personally, supervises key decisions and pays for time. A genuine independent contractor normally operates a business with meaningful control over how services are provided and exposure to business risk. There is no single fact that settles every case.
        </Prose>
        <Prose>
          New Zealand’s statutory contractor gateway test came into force on 21 February 2026. If every gateway criterion is met, the worker is treated as a specified contractor. If any criterion is not met, the common-law tests still determine the true nature of the relationship. Review the current <SourceLink href="https://www.employment.govt.nz/starting-employment/types-of-worker/employee-or-contractor">Employment New Zealand employee-or-contractor guidance</SourceLink> for the full test.
        </Prose>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Employee features">
            Set recurring hours; work performed personally; family control over place, routine and duties; integration into family life; limited ability to make an independent profit or loss.
          </InfoCard>
          <InfoCard title="Contractor features">
            A genuine business arrangement; contractual freedom consistent with the gateway or common-law tests; real independence; ability to decline or structure work as allowed; responsibility for business costs and risk.
          </InfoCard>
        </div>
        <Prose className="mt-6">
          The special IR56 tax route for some part-time private domestic employees does not turn them into contractors. Worker status and who sends PAYE to Inland Revenue are related questions, but they are not the same question. The <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> explains that distinction.
        </Prose>
      </GuideSection>

      <GuideSection
        id="required-terms"
        title="What a New Zealand employment agreement must cover"
        intro={<Prose>An individual employment agreement must contain legally required terms. Official tools should be used for the precise current wording; the checklist below helps families collect the facts needed for a nanny role.</Prose>}
      >
        <Checklist items={[
          "The full legal names of the household employer and the employee.",
          "A description of the work to be performed.",
          "The place or places of work, including regular travel if applicable.",
          "Agreed hours: guaranteed hours, days, start and finish times, and any real flexibility.",
          "The wage rate or salary, pay cycle and method of payment.",
          "Required public-holiday wording and other mandatory employment clauses.",
          "The employment relationship problem-resolution process and required explanation.",
          "A valid reason and end method for any fixed-term arrangement.",
          "Any trial or probationary term, only if lawful and correctly agreed.",
          "Any other terms the parties agree, provided they do not remove minimum rights.",
        ]} />
        <Prose>
          Employment New Zealand’s <SourceLink href="https://www.employment.govt.nz/starting-employment/employment-agreements/creating-an-employment-agreement">creating an employment agreement</SourceLink> page identifies mandatory, recommended and optional clauses and links to the official Employment Agreement Builder.
        </Prose>
      </GuideSection>

      <GuideSection
        id="nanny-specific-clauses"
        title="Nanny-specific clauses that prevent misunderstandings"
        intro={<Prose>The statutory minimum is not a complete operating guide for in-home childcare. Add clear, practical terms that reflect the children, household and level of trust involved.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Children and care scope">
            Name the children or define the covered children, their age groups, normal routines and the main objective of the role. Record who has authority to change the care plan.
          </InfoCard>
          <InfoCard title="Child-related duties">
            Define meals, bottles, nappies, children’s laundry, activity planning, school pickup, homework and tidying used spaces. Separate those from general housekeeping.
          </InfoCard>
          <InfoCard title="Schedule changes">
            Explain notice for extra hours, overtime, cancellations, school holidays, parental travel, overnight care and what happens if a parent returns early.
          </InfoCard>
          <InfoCard title="Expenses and property">
            Cover mileage, parking, activities, groceries, petty cash, keys, alarm codes, devices and the return of family property when employment ends.
          </InfoCard>
          <InfoCard title="Communication">
            Agree on daily handovers, written logs, urgent contact, incident reports, scheduled reviews and how either side should raise concerns.
          </InfoCard>
          <InfoCard title="Professional boundaries">
            Set expectations for visitors, personal phone use, smoking and vaping, alcohol or impairment, side work during hours, and contact with children outside the role.
          </InfoCard>
        </div>
        <Subheading>Housework needs exact words</Subheading>
        <Prose>
          “Light housekeeping” means different things to different people. If the nanny is expected to clean adult spaces, prepare family meals, shop for the household or manage general laundry, list those duties and make sure there is paid time to perform them without reducing child supervision. Do not allow a role to expand informally after the start date.
        </Prose>
      </GuideSection>

      <GuideSection
        id="hours-pay-leave"
        title="Hours, pay, leave and cancellations"
        intro={<Prose>Write the normal week in a way that both parties can calculate. “Approximately 20 flexible hours” is rarely enough when one person needs dependable income and the other needs dependable care.</Prose>}
      >
        <Checklist items={[
          "Guaranteed weekly hours and the normal schedule.",
          "How additional hours are offered, accepted, recorded and paid.",
          "What happens when the family cancels hours that were guaranteed.",
          "How lateness, overnight time, travel time and sleepovers are treated.",
          "The gross rate, pay day, payroll deductions and payslip process.",
          "Mileage rate or direct reimbursement for approved work travel and expenses.",
          "Annual holidays, public holidays, sick leave and other statutory leave as applicable.",
          "Rest and meal breaks, including realistic cover during sole-charge care.",
          "Notice and process for requesting leave and reporting sickness.",
        ]} />
        <InfoCard title="Sole-charge breaks need a practical plan" tone="important">
          A nanny cannot be completely relieved of responsibility while remaining the only adult responsible for the child. Discuss how lawful rest and meal breaks will work in reality—for example, whether a parent provides relief—and record the arrangement clearly.
        </InfoCard>
        <Prose className="mt-6">
          Do not hard-code internet examples of current rates or add “8% holiday pay” by default. Minimum wage changes, and pay-as-you-go holiday pay is permitted only in defined circumstances. Confirm the current rules and feed the final terms into your <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll setup</Link>.
        </Prose>
      </GuideSection>

      <GuideSection
        id="safety-privacy-transport"
        title="Safety, privacy, transport and emergency authority"
        intro={<Prose>An employment agreement should set the durable expectations. A separate home handbook can hold changing operational details such as contacts, routines and care-plan instructions.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Health and emergencies">
            Define access to medical information, emergency contacts, when 111 takes priority, parent notification, first aid expectations, medication authority and incident reporting.
          </InfoCard>
          <InfoCard title="Transport">
            Specify approved drivers and vehicles, licence and insurance expectations, car-restraint responsibilities, authorised trips, mileage, breakdowns and infringement handling.
          </InfoCard>
          <InfoCard title="Confidentiality">
            Protect children’s identities, addresses, school details, routines, health information, access credentials and private household information during and after employment.
          </InfoCard>
          <InfoCard title="Photos, devices and social media">
            State whether photos may be taken, on whose device, how they may be sent, when they must be deleted and that nothing is posted publicly without explicit permission.
          </InfoCard>
          <InfoCard title="Cameras and monitoring">
            Disclose any household monitoring, its purpose and how recordings are handled. Do not treat hidden or excessive surveillance as a substitute for trust and lawful privacy practice.
          </InfoCard>
          <InfoCard title="Safeguarding concerns">
            Explain how the nanny should report unsafe instructions, injuries, disclosures or concerns, and make clear that urgent child safety takes priority over protecting anyone’s reputation.
          </InfoCard>
        </div>
        <Prose className="mt-6">
          The agreement and home guide should align with your <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety plan</Link>. Review plans after a move, new diagnosis, new child, changed school, vehicle change or material change in duties.
        </Prose>
      </GuideSection>

      <GuideSection
        id="trial-changes-ending"
        title="Trial periods, role changes and ending employment"
        intro={<Prose>These clauses are most valuable when they create a fair process. They should not promise that an employer can ignore statutory rights.</Prose>}
      >
        <Subheading>Trial and probationary periods</Subheading>
        <Prose>
          Employment New Zealand says a formal trial period must be agreed in an employment agreement signed before the employee starts, can last no more than 90 calendar days and cannot be used for someone who has worked for that employer before. Employees must still be paid and retain most employment rights. There are further restrictions, including for some migrant workers. Check the current <SourceLink href="https://www.employment.govt.nz/starting-employment/hiring/trial-periods">trial-period guidance</SourceLink> before including one.
        </Prose>
        <Subheading>Changes to the role</Subheading>
        <Prose>
          A new baby, changed work schedule or additional housekeeping can materially change the job. Discuss the proposal, provide relevant information, consider the nanny’s feedback and document any agreed change to duties, hours or pay. A broad “other duties as required” phrase is not a good substitute for good-faith discussion.
        </Prose>
        <Subheading>Ending the arrangement</Subheading>
        <Prose>
          Include notice obligations and what happens to final pay, expenses, property, access codes and confidential information. The reason for ending employment determines the lawful process. Performance concerns, misconduct and redundancy are not interchangeable, and a notice clause alone does not guarantee a fair dismissal. Get current advice before taking action.
        </Prose>
      </GuideSection>

      <GuideSection
        id="before-signing"
        title="Final checklist before the nanny starts"
        intro={<Prose>Use the contract as the bridge between a good hiring conversation and a reliable first month.</Prose>}
      >
        <Checklist items={[
          "The worker-status decision is documented and the agreement matches the real relationship.",
          "The role, place, guaranteed hours, duties and gross pay are specific and internally consistent.",
          "Mandatory clauses come from current New Zealand guidance, not an overseas template.",
          "The nanny had a genuine opportunity to ask questions and obtain independent advice.",
          "Any fixed-term or trial wording meets current legal requirements.",
          "Leave, public holidays, breaks, cancellations, mileage and expenses are workable in practice.",
          "Privacy, cameras, photos, transport, health information and emergency authority are clear.",
          "Both parties signed before work and received the current version.",
          <>Your <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">payroll and record-keeping process</Link> is ready for the first pay.</>,
          "A separate first-day handover covers routines, contacts, keys, alarms, allergies and immediate hazards.",
        ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
