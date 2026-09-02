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

const title = "How to Hire a Nanny in New Zealand: A Safe, Practical Guide";
const description =
  "Learn how to hire a nanny in New Zealand, from defining your family brief and comparing profiles to vetting, interviews, paid trials, contracts and payroll.";
const path = "/how-to-hire-a-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  {
    question: "What is the first step when hiring a nanny?",
    answer:
      "Write a clear family care brief with the children’s ages, exact hours, location, duties, transport, specialist needs, start date and realistic total budget. A clear brief helps you compare candidates fairly and prevents misunderstandings later.",
  },
  {
    question: "Where can I find a nanny in New Zealand?",
    answer:
      "You can browse NannyOra profiles, post a family job and contact suitable candidates. NannyOra currently has active family-facing coverage in greater Auckland; other locations should be treated as planned until local profiles and support are live.",
  },
  {
    question: "What checks should I complete before hiring a nanny?",
    answer:
      "Use a proportionate process that may include identity, work history, relevant qualifications, first aid, driver information, referee calls and an NZ Police vet obtained for the role where appropriate. A Police vet is one point-in-time check, not a complete safety guarantee.",
  },
  {
    question: "Should I interview a nanny before checking references?",
    answer:
      "Usually, have an initial interview first so you can confirm basic fit and obtain consent to contact nominated referees. Complete relevant checks and references before a final offer, then use a paid trial to observe the arrangement in practice.",
  },
  {
    question: "Should a nanny trial be paid?",
    answer:
      "Yes, when the candidate provides childcare or other useful work. Agree the time, duties, rate, supervision and emergency information in advance. A paid trial session is separate from any formal employment-law trial period.",
  },
  {
    question: "Is a nanny an employee or a contractor?",
    answer:
      "The real working relationship determines status. A regular nanny who works personally in the family home at set times under family direction often has employee features. Review current Employment New Zealand guidance and get advice if the position is uncertain.",
  },
  {
    question: "Do I need a written nanny contract?",
    answer:
      "If the nanny is an employee, a written employment agreement is required. It should describe the real role, hours, pay, duties, leave, safety, privacy, transport and how changes or ending employment will be handled.",
  },
  {
    question: "How much does it cost to hire a nanny?",
    answer:
      "The rate depends on experience, schedule, location, duties, number and ages of children and specialist skills. Budget beyond gross wages for leave, public holidays, payroll, mileage, activities and other obligations that apply to your arrangement.",
  },
  {
    question: "Can a nanny care for a newborn or child with additional needs?",
    answer:
      "Yes, when the nanny has directly relevant experience and the role is within their training and agreed scope. Ask for specific examples, verify claimed credentials, share practical care information and agree when parents or professionals must be contacted.",
  },
  {
    question: "What happens if the nanny is not the right fit?",
    answer:
      "Raise concerns early, review the agreement and follow New Zealand employment obligations before changing or ending the arrangement. NannyOra can support a new search, but platform access does not replace the family’s employer responsibilities.",
  },
];

const steps = [
  {
    title: "Define the role before searching",
    body: (
      <>
        Write the care brief: children’s ages and routines; days, start and finish times; proposed start date; home and school locations; sole-charge periods; child-related duties; school or activity transport; pets; parent work-from-home arrangements; required experience, language or qualifications; and the total budget. Separate must-haves from preferences.
      </>
    ),
  },
  {
    title: "Choose the care format",
    body: (
      <>
        Decide whether you need regular full-time care, a part-time nanny, after-school support, overnight help, emergency cover or a specialist match. If you are still deciding between formats, compare a <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny and daycare</Link> or read the <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny versus babysitter guide</Link>.
      </>
    ),
  },
  {
    title: "Search and shortlist relevant profiles",
    body: (
      <>
        <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">Browse NannyOra profiles</Link> using the filters that matter to the brief. Read the complete profile, visible verification level, availability and travel information. Shortlist against the same criteria rather than choosing only on an advertised hourly rate.
      </>
    ),
  },
  {
    title: "Interview for judgment and fit",
    body: (
      <>
        Start with a short video call, then meet in person before offering regular work. Use the structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask about routines, behaviour, safety, communication, transport, availability and boundaries. Give the candidate time to ask questions about your family too.
      </>
    ),
  },
  {
    title: "Complete proportionate checks",
    body: (
      <>
        Review the evidence relevant to the role, contact nominated referees with consent and confirm qualifications or first aid where claimed. NannyOra’s <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> explains why identity, work history, references and Police vetting should be considered together.
      </>
    ),
  },
  {
    title: "Run a paid trial",
    body: (
      <>
        Agree the trial’s time, pay, duties, supervision and emergency contacts in writing. Observe whether the nanny notices safety issues, follows your instructions, communicates calmly and respects your child’s cues. A trial is evidence for a decision, not a promise that the relationship will be perfect.
      </>
    ),
  },
  {
    title: "Put the arrangement in writing",
    body: (
      <>
        Confirm worker status, then sign a suitable <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny employment agreement</Link> before regular work starts. Set up <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">payroll and tax responsibilities</Link>, and prepare the household using the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>.
      </>
    ),
  },
];

export default function HowToHireANannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-09-02" }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Find a Nanny", path: "/find-a-nanny" },
      { name: "How to Hire a Nanny", path },
    ]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra parent guide"
      title={title}
      description={description}
      imageTags={["family", "planning", "nanny", "home"]}
      imageSeed="how-to-hire-a-nanny"
      highlights={["Start with a clear brief", "Check evidence", "Use a paid trial", "Set up a fair role"]}
      toc={[
        { id: "what-good-hire-looks-like", label: "What a good hire looks like" },
        { id: "hiring-steps", label: "The hiring process" },
        { id: "what-to-check", label: "What to check" },
        { id: "choose-nanny-type", label: "Choose the right nanny type" },
        { id: "cost-and-employment", label: "Cost and employment" },
        { id: "first-month", label: "The first month" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland profiles and start a shortlist." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Ask consistent questions about care, safety and fit." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Review identity, references, qualifications and Police information." },
        { href: "/nanny-contract", label: "Nanny contract guide", description: "Put hours, duties, pay and boundaries in writing." },
        { href: "/nanny-payroll", label: "Nanny payroll", description: "Understand status, PAYE, records and employer setup." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare your home, emergency information and first handover." },
      ]}
      ctaTitle="Ready to find the right care?"
      ctaBody="Write your family brief, then browse NannyOra profiles or register your family to begin a considered search."
    >
      <GuideSection
        id="what-good-hire-looks-like"
        title="A good nanny hire is a considered match, not a rushed rescue"
        intro={<Prose>Families often begin looking when a work deadline, school pickup or newborn routine has already become difficult. Speed matters, but the safest shortcut is a clear process. A nanny needs to understand the role, and you need evidence that their experience, availability and approach fit your child’s actual day.</Prose>}
      >
        <Prose>The word “professional” should describe the way the arrangement is planned and supported, not just a profile headline. A strong hire combines relevant experience, respectful communication, appropriate checks, a realistic schedule, a paid trial and written terms. NannyOra helps families discover and compare carers; the family still makes the final hiring decision and remains responsible for the employment relationship.</Prose>
        <InfoCard title="Keep the child at the centre" tone="soft">Describe strengths, routines, communication and practical support needs. Share only information that is relevant and necessary, and explain sensitive care details through a secure, respectful process.</InfoCard>
      </GuideSection>

      <GuideSection id="hiring-steps" title="How to hire a nanny: the complete process" intro={<Prose>Work through these steps in order, while staying flexible about the person who best fits the role. The process is useful for a full-time family nanny, part-time after-school care, a newborn nanny or a short-term arrangement.</Prose>}>
        <Steps items={steps} />
      </GuideSection>

      <GuideSection id="what-to-check" title="What to check before making an offer" intro={<Prose>Checks should be relevant to the duties and consistent across candidates. They are there to test information and reduce avoidable risk—not to create a false promise of certainty.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Identity and work history"><Checklist items={["Confirm identity through an appropriate document process.", "Ask for dates, duties and age groups in recent roles.", "Follow up on unexplained gaps or conflicting information neutrally."]} /></InfoCard>
          <InfoCard title="References and qualifications"><Checklist items={["Obtain consent before contacting nominated referees.", "Ask what the referee directly observed and whether they would rehire.", "Verify relevant ECE, teaching, first aid or specialist claims where needed."]} /></InfoCard>
          <InfoCard title="Police vetting"><Prose>Read the candidate’s actual NannyOra verification status. A Police vet must be obtained for the requesting service and role; an old report from another organisation is not automatically reusable. Read <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">how NannyOra describes vetting</Link> and keep the result in context.</Prose></InfoCard>
          <InfoCard title="Practical suitability"><Checklist items={["Confirm availability, travel and punctuality for the real schedule.", "Check driving, car-seat and insurance expectations where transport is required.", "Ask how the nanny communicates incidents, changes and end-of-day handovers."]} /></InfoCard>
        </div>
        <Prose className="mt-7">For employment, privacy and tax questions, use current official guidance. <SourceLink href="https://www.employment.govt.nz/starting-employment">Employment New Zealand’s starting-employment guidance</SourceLink> is a useful reference, but the correct answer can depend on the arrangement and should not be guessed from a job title.</Prose>
      </GuideSection>

      <GuideSection id="choose-nanny-type" title="Choose a nanny type that matches your week" intro={<Prose>The right nanny type is determined by the work you need done, not by the most impressive label. Be explicit about hours and responsibilities so candidates can decide whether the role suits them.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Full-time or part-time"><Prose>A full-time nanny may cover most working days; a part-time nanny may fit around preschool, school, another caregiver or a parent’s roster. State guaranteed hours and what happens in holidays or when plans change.</Prose></InfoCard>
          <InfoCard title="After-school or weekend care"><Prose>Include school permissions, collection times, homework, activities, meals, transport, term dates and public-holiday expectations. Short shifts can still require careful travel planning.</Prose></InfoCard>
          <InfoCard title="Newborn, infant or night care"><Prose>Ask for recent, age-relevant examples. Discuss feeds, safe sleep, settling, handovers, overnight duties, parent preferences and when the nanny would call for help.</Prose></InfoCard>
          <InfoCard title="Specialist or emergency support"><Prose>For sensory-aware, neurodiverse, disability-informed or short-notice care, define the child’s practical strengths and needs, the nanny’s scope and the support available from parents or professionals. See <Link href="/specialist-nanny-care" className="text-primary underline underline-offset-2 font-semibold">specialist nanny care</Link> for planning prompts.</Prose></InfoCard>
        </div>
      </GuideSection>

      <GuideSection id="cost-and-employment" title="Plan the cost and employment setup together" intro={<Prose>Hourly pay is only one part of the decision. A reliable budget reflects the schedule, duties and legal responsibilities you are actually offering.</Prose>}>
        <Checklist items={["Compare experience and responsibilities, not only the advertised rate.", "Allow for agreed hours, leave, public holidays and any minimum entitlements that apply.", "Budget for payroll support, records, mileage, parking, activities and training where relevant.", "Decide how additional hours, cancellations, school holidays and overnight work will be handled.", <>Use the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> and <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">contract guide</Link> before finalising the offer.</>]} />
        <InfoCard title="Do not choose worker status for convenience" tone="important"><Prose>A regular nanny may have employee features even if a listing calls them a contractor. The real relationship, current legal tests and the way work is controlled matter. If you are unsure, get advice before work begins.</Prose></InfoCard>
      </GuideSection>

      <GuideSection id="first-month" title="Make the first month work for the child and nanny" intro={<Prose>A considered hire still needs a supported start. Children, parents and nannies are all learning a new rhythm, so make expectations visible and give feedback early.</Prose>}>
        <Subheading>Prepare a simple home guide</Subheading>
        <Checklist items={["Daily rhythm: meals, naps, school, activities, comfort and screen boundaries.", "Safety: allergies, medication authority, emergency contacts, exits, first aid and safe transport.", "Practicalities: keys, alarms, parking, pets, approved visitors, photos and privacy.", "Communication: daily handover format, what requires an immediate call and regular review dates."]} />
        <Subheading>Review the match without blame</Subheading>
        <Prose>Agree a check-in after the first week and again after the first month or any stated trial period. Talk about what your child is showing you, which routines are working, whether duties fit the paid hours and what support the nanny needs. If a change is needed, record it in writing and follow the agreement and New Zealand employment obligations.</Prose>
        <InfoCard title="NannyOra is part of the journey, not a substitute for family judgment" tone="soft">Use NannyOra to discover profiles, ask questions and begin an enquiry. Confirm the role, complete appropriate checks, agree terms and make the final decision based on your family’s evidence and experience.</InfoCard>
      </GuideSection>
    </EditorialGuide>
  );
}
