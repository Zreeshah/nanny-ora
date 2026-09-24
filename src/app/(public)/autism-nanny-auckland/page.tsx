import type { Metadata } from "next";
import Link from "next/link";
import { NannyCard } from "@/components/cards/NannyCard";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { getPublicNannies } from "@/lib/data/nannies";
import { articleSchema, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo";

const title = "Autism Nanny Auckland: Find Relevant In-Home Care";
const description = "Explore Auckland nanny profiles that list Autism Support Experience. Learn how to define a respectful, practical in-home care role and assess a suitable match.";
const path = "/autism-nanny-auckland";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

export const revalidate = 300;

const faqs: GuideFaq[] = [
  {
    question: "What is an autism nanny?",
    answer: "An autism nanny is a nanny whose profile lists relevant autism-support experience and whose practical childcare approach suits a particular family. It is not a clinical role. The nanny’s duties, experience, boundaries and communication plan should be agreed with the family before care begins.",
  },
  {
    question: "Can a nanny provide autism therapy or treatment?",
    answer: "No. A nanny is a childcare professional, not a replacement for a registered health, education or therapeutic professional. A nanny can follow parent-provided routines and agreed care information, and work respectfully alongside an existing support team where that is appropriate to the role.",
  },
  {
    question: "How do I find an autism nanny in Auckland?",
    answer: "Start with a clear brief: your child’s age, strengths, practical routines, required hours, location, communication preferences and the experience that is essential. Review profiles that list relevant experience, ask for specific examples in an interview, check visible verification information and arrange a paid trial where appropriate.",
  },
  {
    question: "Do I need to share my child’s diagnosis?",
    answer: "Share only the information that is relevant to safe, respectful care. Practical details about communication, routines, support needs, safety information and when to contact a parent are often more useful than a label alone. Discuss privacy expectations before sharing personal information.",
  },
  {
    question: "What should I ask an autism nanny in an interview?",
    answer: "Ask about comparable childcare roles, how the nanny learns a family’s routines, how they communicate a concern, how they handle an unexpected change, and when they would contact a parent or defer to a professional. Look for specific, respectful examples rather than broad claims.",
  },
  {
    question: "Are all NannyOra autism-support profiles equally verified?",
    answer: "No. NannyOra displays a verification level on each profile. A Listed profile is different from a Premium Vetted or Specialist Care profile, and a specialist tag does not replace your own interview, reference checks and trial. Review the checks shown on the individual profile before you shortlist.",
  },
];

export default async function AutismNannyAucklandPage() {
  const autismNannies = await getPublicNannies({ specialistTag: "autism_support" });
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-09-25" }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Find a Nanny", path: "/find-a-nanny" },
      { name: "Autism Nanny Auckland", path },
    ]),
    serviceSchema({
      name: "Autism Nanny Experience in Auckland",
      description: "Auckland nanny profiles that list Autism Support Experience, with practical guidance for families assessing a respectful in-home care match.",
      path,
      serviceType: "Specialist in-home childcare",
    }),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Auckland specialist childcare"
      title="Autism nannies in Auckland"
      description="Find in-home care that starts with your child’s real day. NannyOra helps Auckland families explore profiles that list Autism Support Experience, then assess the practical fit with care, clarity and respect."
      imageTags={["sensory", "neurodiverse", "specialist"]}
      imageSeed="autism-nanny-auckland"
      highlights={[
        "Experience matched to your brief",
        "Childcare—not clinical treatment",
        "Visible profile verification levels",
        "A clear plan before regular care",
      ]}
      toc={[
        { id: "what-this-page-is-for", label: "What this page is for" },
        { id: "available-profiles", label: "Profiles with relevant experience" },
        { id: "write-the-brief", label: "Write a useful care brief" },
        { id: "choose-a-match", label: "Choose a respectful match" },
        { id: "boundaries-and-safety", label: "Boundaries and safety" },
        { id: "auckland-practicalities", label: "Auckland practicalities" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse the Auckland directory and read the full profile before you shortlist." },
        { href: "/nannies/auckland", label: "Nannies in Auckland", description: "Plan a local nanny search around your suburb, schedule and family routine." },
        { href: "/specialist-childcare-auckland", label: "Specialist childcare", description: "Explore wider Auckland pathways for individual childcare support." },
        { href: "/neurodiverse-childcare-auckland", label: "Neurodiverse childcare", description: "Consider broader neurodiverse-care experience and the individual fit." },
        { href: "/adhd-nanny-auckland", label: "ADHD nannies", description: "Find the separate Auckland pathway for ADHD-support experience." },
        { href: "/sensory-aware-nanny-auckland", label: "Sensory-aware nannies", description: "Explore care considerations around environment, transitions and routines." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Use practical questions to test relevant experience and communication." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Understand the evidence and verification information to review before hiring." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, home boundaries and a safer first day." },
      ]}
      ctaTitle="Find a nanny who fits your family’s real routine"
      ctaBody="NannyOra currently supports greater Auckland families. Browse relevant profiles, share a clear care brief and take time to assess the relationship before regular care begins."
    >
      <GuideSection
        id="what-this-page-is-for"
        title="An autism nanny role should be practical, respectful and clearly defined"
        intro={<Prose>Families often search for an autism nanny because ordinary childcare options do not reflect the routines, communication preferences or transitions that shape their child&apos;s day. The useful goal is not to find a generic label. It is to find a nanny with relevant, demonstrated childcare experience who can work within a thoughtful family plan.</Prose>}
      >
        <Prose>An autism-support label on a profile is a starting point, not proof that every nanny will suit every child. Ask what the nanny has actually done in comparable roles, what they understand about the proposed hours and responsibilities, and how they would learn your family&apos;s established routine. A good match is built around your child&apos;s strengths, your household&apos;s communication style and the boundaries of the childcare role.</Prose>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="What a nanny can do" tone="soft">Provide agreed childcare, follow parent-provided routines, support predictable transitions, communicate observations and create a calm, respectful day at home or during planned activities.</InfoCard>
          <InfoCard title="What stays outside the role" tone="important">A nanny should not be presented as a therapist, clinician or replacement for a registered education or health professional. Keep professional plans, medication directions and escalation boundaries clear.</InfoCard>
        </div>
      </GuideSection>

      <GuideSection
        id="available-profiles"
        title="Auckland nanny profiles with Autism Support Experience"
        intro={<Prose>This section uses the live NannyOra directory. A profile appears here only when the nanny has selected Autism Support Experience on their profile. Read the full profile, its verification level and the visible evidence before deciding whether to make contact.</Prose>}
      >
        {autismNannies.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {autismNannies.slice(0, 6).map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-200/70 bg-amber-50/60 p-6 sm:p-8">
            <h3 className="font-heading text-xl font-bold text-foreground">No active profile currently lists this experience</h3>
            <p className="text-sm text-foreground/75 leading-relaxed mt-3">That does not establish that no suitable Auckland nanny exists. It means NannyOra will not imply a current match where a profile has not selected this experience. Browse the wider directory, describe the experience you need in your care brief and ask candidates for specific, relevant examples.</p>
            <Link href="/find-a-nanny" className="inline-flex items-center mt-5 text-sm font-bold text-primary underline underline-offset-2">Browse Auckland profiles</Link>
          </div>
        )}
      </GuideSection>

      <GuideSection
        id="write-the-brief"
        title="Write a care brief that helps the right nanny assess the role"
        intro={<Prose>A clear brief is kinder to your child, your family and the nanny. It gives a candidate enough practical context to decide whether they can do the role well without requiring more private information than is needed at the first stage.</Prose>}
      >
        <Checklist items={[
          "Start with your child’s age, interests, strengths and the parts of the day that usually go well.",
          "Set out the actual care pattern: days, hours, sole-charge periods, school or preschool, activities, travel and handover times.",
          "Explain useful communication preferences, transitions, routines, comfort items and the approaches your family already finds helpful.",
          "State the experience that is essential, preferred or simply helpful—such as recent comparable care, First Aid, driving or confidence with school-age routines.",
          "Share safety-critical information only with the people who need it, including emergency contacts, allergies, medication instructions and when to call a parent.",
          "Clarify how the nanny should communicate with parents and, where relevant, how they should work alongside whānau, teachers or existing professionals.",
        ]} />
        <InfoCard title="You decide what personal information to share" tone="soft">A diagnosis is not a substitute for a practical care brief. Share information that helps a nanny provide respectful, safe care, and agree privacy expectations before providing detailed personal or health information.</InfoCard>
      </GuideSection>

      <GuideSection
        id="choose-a-match"
        title="How to choose a nanny with relevant autism-support experience"
        intro={<Prose>Look for evidence and fit rather than a broad promise. The best match is someone who can explain their relevant childcare experience clearly, listen to your family and work within the role you have agreed.</Prose>}
      >
        <Steps items={[
          { title: "Search beyond a single label", body: <>Use the <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">nanny directory</Link> to review whole profiles, including care types, availability, travel area, experience and verification level. Related pathways such as <Link href="/neurodiverse-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">neurodiverse childcare</Link> and <Link href="/sensory-aware-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">sensory-aware care</Link> can help you frame the search.</> },
          { title: "Ask for comparable examples", body: <>Use <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">structured interview questions</Link> about routines, communication, unexpected changes, handovers and when the nanny would ask for help. Ask for real examples, not a general statement that they are “good with autism”.</> },
          { title: "Review the evidence that matters", body: <>Check the individual profile&apos;s completed verification details, then use the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting guide</Link> to discuss references, qualifications and the experience relevant to this role. A specialist tag does not replace your own due diligence.</> },
          { title: "Arrange a paid trial", body: "Agree the time, rate, supervision, routine and goals in advance. Notice whether the nanny listens, follows the agreed plan, communicates calmly and respects your child’s pace without forcing interaction." },
          { title: "Put the working plan in writing", body: <>Use a clear <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link> to document hours, duties, pay, confidentiality, reviews and notice. Keep the daily care guide separate so it can be updated as routines change.</> },
        ]} />
      </GuideSection>

      <GuideSection
        id="boundaries-and-safety"
        title="Clear boundaries make specialist childcare safer"
        intro={<Prose>A nanny can be a valuable part of a child&apos;s support network, but parents remain responsible for major decisions and for providing the information needed to do the agreed job safely. The nanny should know what they can decide independently, when to contact a parent and when a situation is outside their role.</Prose>}
      >
        <Checklist items={[
          "Create a concise daily guide for routines, meals, communication, school or activity handovers and the adults authorised to collect your child.",
          "Record emergency contacts, allergies, medication directions and escalation steps in a format the nanny can use confidently.",
          "Agree consent and privacy expectations, including what can be shared with school, whānau, support workers or other adults.",
          "Schedule regular handovers and an early review point so small mismatches can be discussed before they grow.",
          <>Use the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> to prepare your home, emergency information and transport arrangements before the first shift.</>,
        ]} />
      </GuideSection>

      <GuideSection
        id="auckland-practicalities"
        title="Auckland practicalities that shape a good match"
        intro={<Prose>Auckland nanny care is local and logistical. A promising candidate still needs a workable route to your home, school, preschool or activities, and a schedule that fits the family&apos;s actual week. Be candid about commute, parking, school runs, driving, guaranteed hours and holiday coverage.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Start with the local directory"><Link href="/nannies/auckland" className="text-primary underline underline-offset-2 font-semibold">Browse nannies in Auckland</Link> to plan your search around suburb and travel area. Availability depends on current profiles and the nanny&apos;s chosen coverage, not a generic city-wide promise.</InfoCard>
          <InfoCard title="Plan the whole employment arrangement">The total role includes more than a profile rate. Review the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">cost of employing a nanny</Link>, plus agreed hours, leave, work expenses and communication expectations before making an offer.</InfoCard>
        </div>
      </GuideSection>
    </EditorialGuide>
  );
}
