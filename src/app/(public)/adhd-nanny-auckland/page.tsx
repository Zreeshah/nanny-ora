import type { Metadata } from "next";
import Link from "next/link";
import { NannyCard } from "@/components/cards/NannyCard";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { getPublicNannies } from "@/lib/data/nannies";
import { articleSchema, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo";

const title = "ADHD Nanny Auckland: Find Relevant In-Home Care";
const description = "Explore Auckland nanny profiles that list ADHD Support Experience. Learn how to plan a practical, respectful in-home childcare role and assess a suitable match.";
const path = "/adhd-nanny-auckland";

export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };
export const revalidate = 300;

const faqs: GuideFaq[] = [
  { question: "What is an ADHD nanny?", answer: "An ADHD nanny is a nanny whose profile lists ADHD Support Experience and whose childcare experience may be relevant to a particular family’s brief. It is not a clinical role. The family and nanny should agree the actual duties, routines, communication and boundaries before regular care starts." },
  { question: "Can a nanny treat ADHD or provide behaviour therapy?", answer: "No. A nanny provides childcare, not diagnosis, treatment or therapy. They can follow parent-provided routines and agreed care information, communicate what they observe and work respectfully alongside an existing support team where that is appropriate to the role." },
  { question: "How do I find an ADHD nanny in Auckland?", answer: "Describe the practical job first: the child’s age, hours, location, school or activity travel, the routines that help the day work and any experience that is essential. Then review profiles, ask candidates for comparable examples, check the verification details shown and arrange a paid trial where appropriate." },
  { question: "What should I ask an ADHD nanny in an interview?", answer: "Ask how the nanny learns a family’s routine, communicates changes, keeps track of school or activity logistics, gives parents a useful handover and knows when to ask for help. Specific examples from comparable childcare roles are more useful than broad claims of being good with ADHD." },
  { question: "Should I share my child’s diagnosis with a nanny?", answer: "Share only what is relevant to safe, respectful care. Practical details about routines, communication, safety, privacy and when to contact a parent are often more useful than a label alone. Agree expectations about confidential information before providing more personal detail." },
  { question: "Are all ADHD-support profiles on NannyOra equally verified?", answer: "No. NannyOra displays a verification level on each profile. A Listed profile is not the same as a Premium Vetted or Specialist Care profile, and an ADHD-support tag does not replace interviews, reference checks or a paid trial. Read the completed checks on the individual profile before shortlisting." },
];

export default async function AdhdNannyAucklandPage() {
  const adhdNannies = await getPublicNannies({ specialistTag: "adhd_support" });
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-09-25" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "ADHD Nanny Auckland", path }]),
    serviceSchema({ name: "ADHD Nanny Experience in Auckland", description: "Auckland nanny profiles that list ADHD Support Experience, with practical guidance for families assessing an in-home childcare match.", path, serviceType: "Specialist in-home childcare" }),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Auckland specialist childcare"
      title="ADHD nannies in Auckland"
      description="Find in-home childcare built around the real shape of your family’s day. NannyOra helps Auckland families explore profiles that list ADHD Support Experience, then assess whether the person, routine and role are a good fit."
      imageTags={["adhd", "specialist", "care"]}
      imageSeed="adhd-nanny-auckland"
      highlights={["Relevant experience, not a generic label", "Clear routines and communication", "Childcare—not clinical treatment", "A considered trial before regular care"]}
      toc={[{ id: "what-adhd-support-means", label: "What ADHD-support experience means" }, { id: "available-profiles", label: "Profiles with relevant experience" }, { id: "shape-the-role", label: "Shape the role around the real day" }, { id: "assess-the-match", label: "Assess the match" }, { id: "safe-boundaries", label: "Safe boundaries and communication" }, { id: "auckland-planning", label: "Auckland planning" }]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles, availability and completed verification details before you shortlist." },
        { href: "/nannies/auckland", label: "Nannies in Auckland", description: "Plan a local search around your suburb, travel needs and actual schedule." },
        { href: "/specialist-childcare-auckland", label: "Specialist childcare", description: "Explore Auckland pathways for individual in-home childcare support." },
        { href: "/neurodiverse-childcare-auckland", label: "Neurodiverse childcare", description: "Consider broader experience that may be relevant to your family’s brief." },
        { href: "/sensory-aware-nanny-auckland", label: "Sensory-aware nannies", description: "Explore care considerations around environment, transitions and routines." },
        { href: "/ece-nanny-auckland", label: "ECE nannies", description: "Learn how an ECE background may be relevant to a child’s home-care role." },
        { href: "/autism-nanny-auckland", label: "Autism nannies", description: "Find the separate Auckland pathway for autism-support experience." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare home boundaries, emergency information and a safer first day." },
      ]}
      ctaTitle="Find care that works with your family’s actual week"
      ctaBody="NannyOra currently supports greater Auckland families. Browse relevant profiles, define the practical role and take time to assess the relationship before regular care begins."
    >
      <GuideSection id="what-adhd-support-means" title="ADHD-support experience is about practical childcare, not a diagnosis" intro={<Prose>Families may search for an ADHD nanny when they need care that can hold together school, activities, transitions, meals, play and the return home. The most useful match is not created by a label alone. It comes from relevant experience, a workable schedule and a nanny who can learn the routines that matter to your child.</Prose>}>
        <Prose>An ADHD-support tag on a profile is a reason to ask better questions, not a guarantee of fit or expertise beyond the childcare role. Ask candidates what comparable roles involved, how they learned the household routine and how they kept parents informed when plans changed. A supportive match respects your child’s strengths and stays within the duties you agree together.</Prose>
        <div className="grid sm:grid-cols-2 gap-4"><InfoCard title="A nanny’s practical role" tone="soft">A nanny can provide agreed childcare, keep to family routines, manage planned school or activity logistics, communicate observations and help a child move through the everyday parts of the day with care and respect.</InfoCard><InfoCard title="Professional roles stay clear" tone="important">A nanny is not a clinician, therapist or behaviour specialist. Parents remain responsible for major decisions, and any medical, educational or therapeutic plan must stay within the directions and professionals who own it.</InfoCard></div>
      </GuideSection>

      <GuideSection id="available-profiles" title="Auckland nanny profiles with ADHD Support Experience" intro={<Prose>This section uses the live NannyOra directory. A profile appears only when the nanny has selected ADHD Support Experience. Review the whole profile, its verification level and the specific experience shown before deciding whether to make contact.</Prose>}>
        {adhdNannies.length > 0 ? <div className="grid sm:grid-cols-2 gap-5">{adhdNannies.slice(0, 6).map((nanny) => <NannyCard key={nanny.id} nanny={nanny} />)}</div> : <div className="rounded-3xl border border-amber-200/70 bg-amber-50/60 p-6 sm:p-8"><h3 className="font-heading text-xl font-bold text-foreground">No active profile currently lists this experience</h3><p className="text-sm text-foreground/75 leading-relaxed mt-3">NannyOra will not present a current ADHD-support match unless a public profile has selected that experience. Browse the wider Auckland directory, describe the practical experience you need in your care brief and ask candidates for specific examples that relate to the role.</p><Link href="/find-a-nanny" className="inline-flex items-center mt-5 text-sm font-bold text-primary underline underline-offset-2">Browse Auckland profiles</Link></div>}
      </GuideSection>

      <GuideSection id="shape-the-role" title="Shape the nanny role around the times of day that need support" intro={<Prose>A vague request for someone “good with ADHD” makes it hard for the right candidate to judge the role fairly. A useful brief names the actual tasks, transitions and handovers that make a weekday demanding, then distinguishes what is essential from what is simply helpful.</Prose>}>
        <div className="grid sm:grid-cols-3 gap-4"><InfoCard title="Before and after school">Set out the morning start, pickup authority, transport, food, homework expectations, activities and who handles the handover home.</InfoCard><InfoCard title="Instructions that travel well">Describe the routines, checklists, reminders or visual cues your family already uses, plus what should happen when the usual plan changes.</InfoCard><InfoCard title="A realistic care load">Be explicit about the number of children, sole-charge time, household tasks, driving, holiday coverage and guaranteed hours. These affect whether the role is workable.</InfoCard></div>
        <Checklist items={["Describe your child’s age, interests, strengths and the parts of the day they enjoy.", "List the fixed commitments: care hours, school or preschool, activities, appointments, transport and parent handovers.", "Explain the family routines that help with getting started, moving between activities, meals, play, homework and winding down.", "State what the nanny should communicate at handover, how to contact parents and what situations require a call straight away.", "Separate the childcare role from adult household tasks or professional support that has not been agreed and priced.", "Share safety-critical information only with people who need it, including allergies, medication directions, emergency contacts and authorised adults."]} />
      </GuideSection>

      <GuideSection id="assess-the-match" title="Assess the person, the communication and the routine together" intro={<Prose>Relevant experience matters, but a strong working relationship also needs calm communication and a plan both sides can maintain. Use the interview and paid trial to see how a candidate listens, clarifies expectations and responds to ordinary changes in the day.</Prose>}>
        <Steps items={[
          { title: "Read beyond a specialist tag", body: <>Start with the <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">Auckland nanny directory</Link>, then compare availability, travel area, childcare experience and visible verification details. <Link href="/ece-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">ECE experience</Link>, <Link href="/neurodiverse-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">neurodiverse-care experience</Link> and <Link href="/sensory-aware-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">sensory-aware care</Link> may be useful related pathways depending on your brief.</> },
          { title: "Interview for ordinary situations", body: <>Use <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">practical interview questions</Link> about late pickups, competing activities, incomplete homework, changes to the usual plan, parent handovers and when the nanny would ask for help. Look for specific examples rather than broad promises.</> },
          { title: "Check the evidence", body: <>Use the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting guide</Link> to understand profile levels, references and credentials. A profile tag is helpful context, but it does not replace your own interview, reference conversation and judgement.</> },
          { title: "Trial the real routine", body: "Arrange a paid trial with agreed hours, rate, supervision and a realistic slice of the day. Notice how the nanny follows the plan, communicates a question and treats your child with patience and respect." },
          { title: "Agree the ongoing plan", body: <>Record the hours, duties, pay, confidentiality and notice in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">written nanny agreement</Link>. Keep a separate living care guide for routines and handovers, so it can change without rewriting the whole agreement.</> },
        ]} />
      </GuideSection>

      <GuideSection id="safe-boundaries" title="Safe boundaries and regular communication" intro={<Prose>Good childcare does not depend on a nanny trying to solve every problem alone. Agree what the nanny can decide during a shift, what needs parent approval and what information should be shared at the end of the day. This makes the arrangement safer and fairer for everyone.</Prose>}>
        <Checklist items={["Create a simple care guide covering the day’s routine, contact details, emergency steps, school or activity authority and authorised adults.", "Agree a useful handover: what happened, what went well, what changed and what needs follow-up from a parent.", "Keep health, medication, education and therapeutic decisions within parent direction and the relevant professional’s scope.", "Set privacy expectations before sharing personal details with a nanny or asking them to communicate with outside adults.", <>Use NannyOra&apos;s <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> to prepare the home, emergency information and transport arrangements before the first shift.</>]} />
      </GuideSection>

      <GuideSection id="auckland-planning" title="Plan the Auckland logistics before you make an offer" intro={<Prose>Auckland care roles often turn on practical details: traffic, school-run distance, parking, public transport, activity locations and the time a parent realistically gets home. Discuss these early so a promising candidate is not asked to carry an impossible schedule.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4"><InfoCard title="Local search, honest availability"><Link href="/nannies/auckland" className="text-primary underline underline-offset-2 font-semibold">Browse Auckland nanny profiles</Link> by suburb and travel area. A city page is not a promise that every profile can cover every school run, so confirm the individual nanny&apos;s route and hours.</InfoCard><InfoCard title="Budget for the complete role">Rate is only one part of the arrangement. Review the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">cost of hiring a nanny</Link> alongside guaranteed hours, leave, driving or work expenses and the responsibilities you are asking the nanny to take on.</InfoCard></div>
      </GuideSection>
    </EditorialGuide>
  );
}
