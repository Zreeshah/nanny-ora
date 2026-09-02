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

const title = "Nanny Vetting NZ: A Parent’s Complete Guide";
const description = "Learn how to vet a nanny in New Zealand, from identity and work history to references, qualifications, Police vetting, interviews and a practical risk assessment.";
const path = "/nanny-vetting";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What does nanny vetting include?", answer: "A strong nanny vetting process checks identity, relevant work history, referee feedback, claimed qualifications or professional registrations, Police vetting where available and appropriate, interview evidence, and the overall risks and fit for the role. No single check should make the decision by itself." },
  { question: "Are all NannyOra nannies Police vetted?", answer: "No. NannyOra shows different verification levels, and a Listed profile is not the same as a Premium Vetted or Specialist profile. Police vetting belongs to the relevant deeper verification pathway. Read the badge and the completed checks shown on the individual profile before shortlisting." },
  { question: "Is a Police vet a clearance certificate?", answer: "No. New Zealand Police does not issue Police clearance certificates through the Vetting Service. A vet is a point-in-time report supplied to an authorised agency for a specific purpose. Police does not decide whether a person is suitable for a nanny role." },
  { question: "Can a family request a Police vet directly?", answer: "The Police Vetting Service accepts requests from authorised agencies, not individuals. An authorised agency must obtain the person’s signed consent and submit the request for an eligible purpose. Individuals who want their own conviction history use the Ministry of Justice criminal record process instead." },
  { question: "Can I reuse a Police vet from another employer?", answer: "Police says vetting information is specific to the requesting agency and role, may differ between requests, and should not be shared between agencies. Each authorised agency should obtain consent and request its own current report." },
  { question: "How many references should a nanny have?", answer: "Quality matters more than a magic number. Ask for recent, role-relevant referees who directly observed the nanny caring for children. NannyOra’s operational vetting system includes at least one non-family referee check; families may ask for additional nominated referees where the role warrants it." },
  { question: "Should I still interview a vetted nanny?", answer: "Yes. Vetting verifies evidence; an interview tests communication, judgment, expectations and fit with your family. Follow it with a paid trial and clear employment terms before regular care begins." },
  { question: "Does vetting guarantee that a nanny will be safe?", answer: "No process can guarantee future behaviour. Vetting reduces uncertainty when it combines multiple checks, a considered decision, a safe start and ongoing communication. Parents should continue monitoring the arrangement and respond promptly to concerns." },
];

const vettingSteps = [
  { title: "Verify identity", body: "Confirm that the person matches reliable, current identity documents. The aim is to connect every later check to the correct individual—not to collect more personal information than the role requires." },
  { title: "Check work history", body: "Ask for dates, duties, children’s age groups and reasons for leaving. Discuss any unexplained gaps without assuming that a gap is a problem. Look for a coherent history that can be tested with referees." },
  { title: "Confirm professional registrations", body: "Where a nanny claims a current teaching registration, ECE qualification or specialist credential, verify it with the relevant issuing body. A qualification should be both genuine and relevant to the care your child needs." },
  { title: "Speak with nominated referees", body: "Contact a non-family referee who directly observed the candidate’s work. Confirm the relationship, dates and duties before asking about reliability, judgment, communication, boundaries and whether they would rehire." },
  { title: "Complete the relevant Police vet", body: "For NannyOra’s applicable deeper verification pathway, NannyOra obtains its own New Zealand Police vet with consent. Treat the result as one input into a broader assessment, never as a pass-or-fail safety certificate." },
  { title: "Run a safety-focused interview", body: "Use behavioural and scenario questions to explore how the candidate thinks. Ask for real examples involving emergencies, behaviour, safe sleep, transport, medication, confidentiality and communication with parents." },
  { title: "Make a documented risk assessment", body: "Bring the evidence together. Consider inconsistencies, unresolved gaps, the level of access to children, transport, overnight or sole-charge care, specialist needs, and any controls that must be in place before deciding." },
];

export default function NannyVettingPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-21" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Vetting", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra trust guide"
      title={title}
      description={description}
      imageTags={["vetting", "verified", "trust", "professional"]}
      imageSeed="nanny-vetting-guide"
      highlights={["Seven evidence layers", "Visible profile status", "NZ-specific guidance", "Parents keep the final decision"]}
      toc={[
        { id: "what-nanny-vetting-means", label: "What nanny vetting means" },
        { id: "nannyora-vetting-process", label: "NannyOra’s seven checks" },
        { id: "police-vetting", label: "Police vetting explained" },
        { id: "reference-checks", label: "Reference checks" },
        { id: "read-verification-status", label: "Read profile status" },
        { id: "parent-checklist", label: "Parent checklist" },
        { id: "red-flags", label: "Red flags and decisions" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Use structured questions to test experience, judgment and family fit." },
        { href: "/nanny-safety", label: "Nanny safety guide", description: "Plan safe routines, emergency information, transport and handovers." },
        { href: "/nanny-contract", label: "Nanny contract guide", description: "Put hours, duties, pay and expectations into a clear written agreement." },
        { href: "/verification-process", label: "NannyOra verification process", description: "See how verification works on the platform." },
        { href: "/trust-and-safety", label: "Trust and safety", description: "Understand NannyOra’s profile levels and shared responsibilities." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland profiles and inspect the status shown on each one." },
      ]}
      ctaTitle="Start with evidence, then choose the right fit"
      ctaBody="Browse NannyOra profiles, compare visible verification information and meet candidates whose experience fits your family."
    >
      <GuideSection
        id="what-nanny-vetting-means"
        title="What nanny vetting really means"
        intro={<Prose>Nanny vetting is a structured way to test whether the information a candidate provides is genuine, relevant and consistent—and whether the whole picture supports placing that person in a position of trust. It is more than a background check and more than reading a polished profile.</Prose>}
      >
        <Prose>
          Good vetting answers several different questions. Is this the person named in the application? Does their work history make sense? Did previous families observe the qualities being claimed? Are qualifications current? Is there information from Police that is relevant to the role? How does the person reason through realistic childcare situations? Finally, do those pieces support a considered suitability decision for this particular work?
        </Prose>
        <Prose>
          These questions cannot be collapsed into a single green tick. A person may have a current first aid certificate but limited newborn experience. A positive reference may describe after-school care rather than sole-charge infant care. A Police vet may disclose no relevant information at the time it is produced, but it cannot predict future behaviour. The role, the child and the evidence must be considered together.
        </Prose>
        <InfoCard title="NannyOra is a platform—not the household employer" tone="soft">
          NannyOra makes profile discovery and verification information more transparent. The family still decides whom to interview and hire, confirms the match, and meets any employment, payroll and household safety responsibilities. Start by reading the verification badge and the individual checks shown on a profile.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="nannyora-vetting-process"
        title="NannyOra’s seven-part vetting process"
        intro={<Prose>NannyOra’s operational safety-check system separates seven evidence areas. A check can be not started, submitted, verified, rejected or—only where appropriate—not applicable. That distinction matters: a document being uploaded is not the same as NannyOra having verified it.</Prose>}
      >
        <Steps items={vettingSteps} />
        <Prose>
          This process is designed to make gaps visible, not to imply that every registered person has completed every check. You can see the fuller platform process on <Link href="/verification-process" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s verification page</Link> and learn how badges are used in the <Link href="/trust-and-safety" className="text-primary underline underline-offset-2 font-semibold">trust and safety guide</Link>.
        </Prose>
      </GuideSection>

      <GuideSection
        id="police-vetting"
        title="What a New Zealand Police vet can—and cannot—tell you"
        intro={<Prose>A New Zealand Police vet can disclose information held by Police that is relevant to the authorised agency’s eligible purpose. It is not the same as an individual requesting their own Ministry of Justice criminal record, and New Zealand Police does not issue a “Police clearance certificate.”</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <InfoCard title="What it can do">
            Add role-relevant, point-in-time information to an agency’s suitability assessment. The requesting agency confirms identity, obtains signed consent and reviews the result in context.
          </InfoCard>
          <InfoCard title="What it cannot do" tone="important">
            Guarantee safety, predict future conduct, replace references and interviews, or tell the agency whether to appoint the person. That final suitability decision belongs to the agency or hiring decision-maker.
          </InfoCard>
        </div>
        <Prose>
          Police says only an authorised agency can submit a vetting request, after obtaining the subject’s consent. The report is specific to the requesting agency, role and purpose; results should not be passed from one agency to another. All vets are point-in-time checks with no universal validity period or expiry date. Read the current <SourceLink href="https://www.police.govt.nz/advice-services/businesses-and-organisations/nz-police-vetting-service/vetting-process">New Zealand Police vetting process</SourceLink> before relying on a report.
        </Prose>
        <Checklist items={[
          "Confirm which organisation requested the vet and for what role or purpose.",
          "Check the profile’s actual status rather than accepting a general statement that someone is ‘vetted’.",
          "Do not ask a candidate to forward a confidential report from an unrelated agency.",
          "Consider the date and what has changed since the point-in-time result.",
          "Use the result alongside identity, history, references, interview evidence and your paid trial.",
        ]} />
      </GuideSection>

      <GuideSection
        id="reference-checks"
        title="How to conduct useful nanny reference checks"
        intro={<Prose>A reference check should verify facts before it asks for opinions. Get the candidate’s consent, contact their nominated referee directly and establish how the referee knows the candidate. The New Zealand Privacy Commissioner advises employers to collect only information relevant to the role and not contact other people without express consent.</Prose>}
      >
        <Subheading>Start with the relationship</Subheading>
        <Checklist items={[
          "How did you work with the candidate, and for how long?",
          "What were the children’s ages and the nanny’s regular duties?",
          "Were the dates, schedule and reason for leaving consistent with the application?",
          "Did you directly observe the nanny’s work, or are you repeating someone else’s view?",
        ]} />
        <Subheading>Then test performance and judgment</Subheading>
        <Checklist items={[
          "How reliable were they when plans changed, a child was unwell or a parent was delayed?",
          "How did they communicate incidents, concerns and routine updates?",
          "Can you give an example of how they responded to challenging behaviour or distress?",
          "How did they manage privacy, boundaries, transport and household instructions?",
          "Was there anything you would manage differently if employing them again?",
          "Would you rehire them for this type of role? Why or why not?",
        ]} />
        <Prose>
          Take factual notes, distinguish direct observations from impressions and store candidate information securely. The Privacy Commissioner’s <SourceLink href="https://www.privacy.org.nz/resources-and-learning/a-z-topics/recruitment/">recruitment privacy guidance</SourceLink> explains consent, relevant collection and appropriate handling of applications and checks.
        </Prose>
      </GuideSection>

      <GuideSection
        id="read-verification-status"
        title="How to read a NannyOra verification status"
        intro={<Prose>NannyOra uses levels so families can see the difference between a profile that is listed and one that has completed deeper checks. The badge is a starting point: open the profile and review the check details rather than relying on the badge name alone.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Listed">
            The nanny has registered and profile information can be shown. Vetting documents have not necessarily been verified by the NannyOra team. Treat self-reported information as information to confirm.
          </InfoCard>
          <InfoCard title="Verified">
            Identity and references have been reviewed, with valid qualifications confirmed where claimed. Check the exact evidence shown and its relevance to your role.
          </InfoCard>
          <InfoCard title="Premium Vetted">
            Deeper checks have been completed, including NannyOra’s applicable Police-vetting pathway and multiple evidence points. It is still not a safety guarantee.
          </InfoCard>
          <InfoCard title="Specialist Care">
            Premium checks plus verified specialist credentials relevant to care such as ECE, teaching or neurodiverse support. Confirm that the specialist background matches your child’s actual needs.
          </InfoCard>
        </div>
      </GuideSection>

      <GuideSection
        id="parent-checklist"
        title="A parent’s vetting checklist before making an offer"
        intro={<Prose>Use the same core process for every candidate. Consistency makes comparisons fairer and helps you notice evidence rather than simply reacting to confidence or personality.</Prose>}
      >
        <Checklist items={[
          "Write the role first: children’s ages, hours, duties, transport, sole-charge periods and specialist needs.",
          "Read the full profile and record the status of each required check.",
          "Confirm identity and work eligibility through an appropriate process.",
          "Compare the candidate’s work history with the experience your role actually needs.",
          "Verify relevant qualifications, registrations, first aid and driver details where claimed.",
          "Complete reference checks with consent and resolve inconsistencies respectfully.",
          <>Use structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> and write evidence-based notes.</>,
          "Arrange a short paid trial with clear time, rate, duties, supervision and emergency information.",
          <>Document the final role in a suitable <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract or employment agreement</Link>.</>,
          <>Prepare the household using the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety checklist</Link>.</>,
        ]} />
      </GuideSection>

      <GuideSection
        id="red-flags"
        title="Red flags, context and the final decision"
        intro={<Prose>A red flag is information that needs to be understood—not always an automatic rejection. Focus on whether the candidate is honest, whether the explanation can be verified, and whether the unresolved risk is acceptable for this particular role.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <InfoCard title="Pause and investigate">
            Conflicting dates, reluctance to provide role-relevant evidence, a referee who cannot confirm the work, unexplained qualification claims, pressure to skip checks, or dismissive answers about safety all deserve follow-up.
          </InfoCard>
          <InfoCard title="Avoid unfair assumptions" tone="soft">
            A career break, overseas history, a short placement or a nervous interview is not automatically unsafe. Ask neutral questions, seek relevant evidence and do not collect or use protected personal information that is unrelated to performance.
          </InfoCard>
        </div>
        <Prose>
          If important evidence remains unresolved, do not rush because you need care immediately. Narrow the duties, delay the start, obtain advice or choose another candidate. Once care begins, keep communication open: review incidents, changes in circumstances, your child’s responses and whether the arrangement still matches the role you vetted.
        </Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
