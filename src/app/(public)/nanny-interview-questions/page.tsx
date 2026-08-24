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

const title = "Nanny Interview Questions: A Practical Guide for NZ Families";
const description = "Prepare for a nanny interview with structured questions about experience, routines, safety, emergencies, communication, duties, employment expectations and family fit.";
const path = "/nanny-interview-questions";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What should I ask when interviewing a nanny?", answer: "Ask about recent age-relevant experience, daily routines, behaviour guidance, safety, emergencies, communication, transport, duties, availability and employment expectations. Use open questions and ask for specific examples rather than yes-or-no assurances." },
  { question: "How long should a nanny interview take?", answer: "A first video call may take 20 to 30 minutes. A serious in-person interview often needs 45 to 75 minutes, plus time for the candidate’s questions. Do not compress a high-trust hiring decision into a rushed conversation." },
  { question: "Should my child be at the interview?", answer: "Complete the main adult conversation without relying on your child to assess the candidate. A brief, low-pressure introduction can be useful, followed by a separate paid trial where you can observe interaction safely." },
  { question: "Can I ask a nanny about their family or relationship status?", answer: "Keep questions connected to the role. Ask whether the candidate can meet the required schedule and duties, not about pregnancy plans, relationship status, religion, ethnicity, disability or other personal characteristics that are not necessary to assess the work." },
  { question: "Can I take notes during the interview?", answer: "Yes. Tell the candidate, use a consistent scorecard and record job-relevant evidence. Keep notes confidential, secure them from unauthorised access and do not retain personal information longer than needed." },
  { question: "When should I check references?", answer: "Usually after a strong interview and before a final offer. Get the candidate’s consent and contact nominated referees. Compare what the referee says with the experience and examples discussed in the interview." },
  { question: "Should a nanny trial be paid?", answer: "Yes when the candidate provides childcare or other useful work. Agree the time, rate, duties, supervision and emergency information in advance. A recruitment trial session is different from a formal employment-law trial period." },
  { question: "What is a good sign in a nanny interview?", answer: "Strong candidates give specific, proportionate examples; ask thoughtful questions; understand boundaries; communicate incidents clearly; admit what they would need to learn; and connect their approach to the child’s age and the family’s instructions." },
];

const process = [
  { title: "Create a role brief", body: "Write the children’s ages, exact hours, core duties, transport, pets, work location, specialist requirements, likely start date and proposed employment arrangement. Mark what is essential and what can be learned." },
  { title: "Use a short first call", body: "Confirm availability, location, broad experience, rate expectations and interest in the role. Explain the next stages so neither side spends time on a basic mismatch." },
  { title: "Hold a structured interview", body: "Ask every serious candidate the same core questions, then add age- and role-specific scenarios. Give enough time for follow-up questions and the candidate’s questions." },
  { title: "Verify, trial and decide", body: "Complete the relevant checks, contact nominated referees and arrange a paid trial. Compare evidence against your scorecard before making a written offer." },
];

export default function NannyInterviewQuestionsPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-21" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Interview Questions", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra parent guide"
      title={title}
      description={description}
      imageTags={["professional", "interview", "nanny", "family"]}
      imageSeed="nanny-interview-questions"
      highlights={["60+ practical prompts", "Age-specific scenarios", "Fair comparison scorecard", "Paid-trial guidance"]}
      toc={[
        { id: "prepare", label: "Prepare the interview" },
        { id: "experience-questions", label: "Experience questions" },
        { id: "care-questions", label: "Care and development" },
        { id: "safety-questions", label: "Safety and emergencies" },
        { id: "role-questions", label: "Duties and employment" },
        { id: "scenario-questions", label: "Scenario questions" },
        { id: "evaluate", label: "Evaluate the answers" },
        { id: "paid-trial", label: "Plan a paid trial" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Verify identity, history, references, qualifications and relevant Police information." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Turn the agreed role into clear written employment terms." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, home routines, safe sleep and transport." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse local profiles and build a shortlist for interview." },
        { href: "/verification-process", label: "Verification process", description: "Understand the evidence NannyOra reviews at each stage." },
        { href: "/how-it-works", label: "How NannyOra works", description: "See the journey from family registration to a suitable match." },
      ]}
      ctaTitle="Ready to build your shortlist?"
      ctaBody="Compare NannyOra profiles by care needs, availability and visible verification status, then use this guide for a consistent interview."
    >
      <GuideSection
        id="prepare"
        title="Prepare before you ask the first question"
        intro={<Prose>A useful interview begins with a clear job. If the hours, duties and employment expectations are vague, even a skilled candidate cannot give meaningful answers—and two candidates may think they are interviewing for different roles.</Prose>}
      >
        <Steps items={process} />
        <Subheading>Send useful information in advance</Subheading>
        <Prose>
          Share a concise role summary without disclosing sensitive information about your child. Include age group, suburb, normal schedule, core childcare duties, transport needs, pets, whether a parent works from home, and any essential experience. Save detailed health plans, school information and home access details until you have a legitimate need and a secure way to share them.
        </Prose>
        <InfoCard title="Use one core interview for every candidate" tone="soft">
          A consistent structure reduces memory bias and helps you compare evidence fairly. Ask the same essential questions in the same order, score the answers after each interview, then note any role-specific follow-up separately.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="experience-questions"
        title="Questions about nanny experience and reliability"
        intro={<Prose>“How many years have you been a nanny?” is only a starting point. Ask what the person actually did, who observed the work and what they learned. Recent experience with the right age group can matter more than a long but unrelated history.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Career and role history">
            <ul className="space-y-2">
              <li>• Tell me about your two most relevant childcare roles.</li>
              <li>• How old were the children when you started?</li>
              <li>• What did a normal week involve?</li>
              <li>• Which parts were sole charge?</li>
              <li>• Why did each arrangement end?</li>
            </ul>
          </InfoCard>
          <InfoCard title="Reliability and change">
            <ul className="space-y-2">
              <li>• Tell me about a time you could not attend work.</li>
              <li>• How much notice could you give?</li>
              <li>• How do you manage a parent running late?</li>
              <li>• What schedule changes can you accept?</li>
              <li>• What does reliable communication look like to you?</li>
            </ul>
          </InfoCard>
          <InfoCard title="Learning and qualifications">
            <ul className="space-y-2">
              <li>• Which training has most influenced your care?</li>
              <li>• Which qualifications or registrations are current?</li>
              <li>• When did you last complete child first aid?</li>
              <li>• What would you like more training in?</li>
              <li>• How do you keep your knowledge current?</li>
            </ul>
          </InfoCard>
          <InfoCard title="References and checks">
            <ul className="space-y-2">
              <li>• Who directly observed your most relevant work?</li>
              <li>• May we contact your nominated referees?</li>
              <li>• Is there context we should know before calling?</li>
              <li>• Which checks are already complete on NannyOra?</li>
              <li>• Is any evidence still being verified?</li>
            </ul>
          </InfoCard>
        </div>
        <Prose className="mt-6">
          Compare claims with the visible profile status and complete the steps in the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">NannyOra nanny vetting guide</Link>. Ask permission before contacting referees or checking information outside the application.
        </Prose>
      </GuideSection>

      <GuideSection
        id="care-questions"
        title="Questions about routines, development and behaviour"
        intro={<Prose>The best answers describe observation, age-appropriate expectations, respectful boundaries and communication with parents. Listen for a flexible approach rather than a one-size-fits-all philosophy.</Prose>}
      >
        <Checklist items={[
          "How do you learn a new child’s cues, temperament and routine?",
          "How would you plan a balanced day for a child of this age?",
          "How do you support play without directing every moment?",
          "Tell me about a transition—such as naps, toilet learning or starting school—that you helped a child through.",
          "How do you respond when a toddler hits, bites or refuses to leave the park?",
          "How do you handle different rules in different households?",
          "What is your approach to screens, food and treats when the family has clear guidance?",
          "How would you support homework while protecting downtime after school?",
          "How do you include children with sensory, communication or regulation differences?",
          "What information would you record or share at the end of a day?",
        ]} />
        <Subheading>Questions for newborn and infant care</Subheading>
        <Checklist items={[
          "Tell me about your most recent newborn or infant role and exactly what you handled.",
          "How do you follow a family’s feeding plan while staying within your professional boundaries?",
          "What does safe sleep look like for every nap?",
          "How do you respond when a baby’s usual sleep or feeding pattern changes?",
          "Which signs would make you contact a parent, Healthline or emergency services?",
          "How do you record feeds, nappies, sleep and medication if medication is authorised?",
        ]} />
      </GuideSection>

      <GuideSection
        id="safety-questions"
        title="Nanny safety and emergency interview questions"
        intro={<Prose>Do not settle for “I would stay calm.” Ask candidates to talk through the sequence of actions, what they would do first, whom they would contact and what they would document.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <InfoCard title="Immediate response">
            <ul className="space-y-2">
              <li>• What would you do if a child was choking?</li>
              <li>• When would you call 111 before calling me?</li>
              <li>• How would you respond to an allergic reaction?</li>
              <li>• What would you take during an evacuation?</li>
              <li>• How would you manage another child at the same time?</li>
            </ul>
          </InfoCard>
          <InfoCard title="Everyday prevention">
            <ul className="space-y-2">
              <li>• What hazards do you look for in a new home?</li>
              <li>• How do you check a car restraint before travel?</li>
              <li>• What are your rules around phones and supervision?</li>
              <li>• How do you manage medicine instructions?</li>
              <li>• How do you protect family privacy and photos?</li>
            </ul>
          </InfoCard>
        </div>
        <Prose>
          A strong candidate knows the limit of their role. They should call 111 for an urgent medical emergency, follow the child’s authorised plan, inform parents promptly and record what happened. Use the full <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> to prepare your home and emergency handover.
        </Prose>
      </GuideSection>

      <GuideSection
        id="role-questions"
        title="Questions about duties, communication and employment"
        intro={<Prose>Many nanny placements fail because the practical job was never discussed clearly. Be specific about child-related tasks, household boundaries, hours and how changes will be handled.</Prose>}
      >
        <Checklist items={[
          "Which duties do you see as normal child-related nanny work?",
          "Are you comfortable with the exact school, activity or appointment transport in this role?",
          "What is your understanding of light child-related tidying versus general housework?",
          "Which personal phone uses are reasonable while you are responsible for children?",
          "How should we communicate routine updates, minor concerns and urgent incidents?",
          "What do you need from parents to do your best work?",
          "Are you available for the guaranteed days and start and finish times?",
          "How should extra hours, cancellations, mileage and expenses be handled?",
          "What pay range and pay cycle are you seeking for the role described?",
          "What notice would you expect if the family’s schedule or employment needs changed?",
        ]} />
        <InfoCard title="The nanny should interview your family too" tone="soft">
          Experienced candidates often ask about parenting style, guaranteed hours, leave, household cameras, allergies, transport, how disagreements are resolved and whether parents work from home. Thoughtful questions are evidence of preparation—not a lack of flexibility.
        </InfoCard>
        <Prose className="mt-6">
          If the match progresses, put the agreed details into a written <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny employment agreement</Link> and set up the appropriate <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">payroll process</Link> before regular work starts.
        </Prose>
      </GuideSection>

      <GuideSection
        id="scenario-questions"
        title="Scenario questions that reveal nanny judgment"
        intro={<Prose>Good scenarios have enough detail to require judgment but not one secret “correct” answer. Ask what the candidate would do, why, what could change the response and when they would involve you.</Prose>}
      >
        <div className="space-y-4">
          <InfoCard title="A toddler refuses lunch, becomes upset and throws the plate">
            What would you do in the moment? How would you protect the child’s relationship with food, maintain the boundary and tell the parent what happened?
          </InfoCard>
          <InfoCard title="The school says an unfamiliar adult has arrived to collect the child">
            How would you verify authority? What would you do if the parent could not be reached immediately? What information would you share with the school?
          </InfoCard>
          <InfoCard title="A baby’s breathing looks unusual during a nap">
            What would you check immediately? When would you call 111? How would you manage the other child and communicate with the parents?
          </InfoCard>
          <InfoCard title="A parent asks you to use a method you believe is unsafe">
            How would you raise the concern? What would you refuse to do? Which authoritative guidance or professional advice would you seek?
          </InfoCard>
          <InfoCard title="A child tells you something worrying and asks you to keep it secret">
            How would you respond without leading the child or promising secrecy? Who would you tell, and how would you record the child’s own words?
          </InfoCard>
          <InfoCard title="You scratch the family car while transporting the children">
            What do you do first? When and how do you tell the parent? How should vehicle, insurance, mileage and incident expectations have been agreed beforehand?
          </InfoCard>
        </div>
      </GuideSection>

      <GuideSection
        id="evaluate"
        title="How to evaluate nanny interview answers"
        intro={<Prose>Do not score only how warm or polished the candidate seems. Warmth matters, but the purpose of the interview is to collect evidence about safe performance and a sustainable working relationship.</Prose>}
      >
        <Subheading>A simple five-part scorecard</Subheading>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="1. Essential fit">Availability, location, age-group experience, transport and non-negotiable skills match the actual job.</InfoCard>
          <InfoCard title="2. Evidence">Answers include specific examples that can be tested against work history, qualifications and references.</InfoCard>
          <InfoCard title="3. Judgment">The candidate identifies priorities, knows when to seek help and adapts rather than applying rigid rules.</InfoCard>
          <InfoCard title="4. Communication">They explain incidents clearly, listen to the family, raise disagreements respectfully and protect confidentiality.</InfoCard>
          <InfoCard title="5. Employment fit">Expectations about duties, hours, pay, leave, changes and professional boundaries can form a fair arrangement.</InfoCard>
          <InfoCard title="Overall confidence" tone="soft">Record what supports the rating, what remains unverified and what the paid trial needs to test. “I liked them” is not enough evidence by itself.</InfoCard>
        </div>
        <Subheading>Questions to avoid</Subheading>
        <Prose>
          Keep collection necessary and role-related. The Office of the Privacy Commissioner says recruitment information should be relevant, transparent and protected. Do not casually investigate social accounts, ask candidates for passwords, contact unnamed people without express consent or retain applications indefinitely. Review its <SourceLink href="https://www.privacy.org.nz/resources-and-learning/a-z-topics/recruitment/">New Zealand recruitment privacy guidance</SourceLink>.
        </Prose>
      </GuideSection>

      <GuideSection
        id="paid-trial"
        title="Move from interview to a short paid trial"
        intro={<Prose>An interview shows how a candidate explains their approach. A paid trial shows how they enter the home, connect with your child, notice hazards, follow instructions and communicate in real time.</Prose>}
      >
        <Checklist items={[
          "Agree in writing on the date, start and finish time, pay rate and payment method.",
          "Define the childcare tasks and whether the parent remains present.",
          "Provide emergency contacts, allergies, health information and clear supervision boundaries.",
          "Observe without manufacturing stressful tests or expecting an instant bond.",
          "Notice whether the nanny follows the child’s cues, asks useful questions and handles uncertainty calmly.",
          "Debrief privately with the candidate and, in an age-appropriate way, your child.",
          "Record what the trial confirmed and what still needs verification before an offer.",
        ]} />
        <InfoCard title="Paid trial session versus legal trial period" tone="important">
          A recruitment trial involving useful childcare should be paid. It is not the same as an employment-law trial period. Employment New Zealand says a formal trial period must meet specific conditions and be included in an agreement signed before the employee starts work. Read the current official guidance or obtain advice before using one.
        </InfoCard>
      </GuideSection>
    </EditorialGuide>
  );
}
