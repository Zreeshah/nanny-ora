import type { Metadata } from "next";
import Link from "next/link";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Specialist Nanny Care: Finding the Right Individual Support";
const description = "Learn how to find specialist nanny care for a child who needs individual support, including newborn care, ECE experience, sensory-aware support and neurodiverse experience.";
const path = "/specialist-nanny-care";

export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };

const faqs: GuideFaq[] = [
  { question: "What is a specialist nanny?", answer: "A specialist nanny has experience, qualifications or strengths that are directly relevant to a family’s childcare brief—such as ECE experience, newborn care, sensory-aware support or neurodiverse childcare experience. The useful question is whether the evidence matches your child’s day-to-day needs." },
  { question: "Can a nanny provide therapy or medical treatment?", answer: "A nanny’s role should stay within their training, agreed duties and safe boundaries. A nanny can follow parent-provided routines and care plans where appropriate, but should not be presented as a replacement for a registered health or education professional." },
  { question: "How do I hire a nanny for a neurodiverse child?", answer: "Write a strengths-based brief, explain practical routines and sensory needs, ask candidates for specific examples of relevant experience, contact referees, arrange a paid trial and agree communication and escalation boundaries. NannyOra currently supports families in greater Auckland." },
  { question: "Should I share my child’s diagnosis with a nanny?", answer: "Share only what is relevant to helping the nanny provide safe, respectful care. Practical information about communication, triggers, regulation, strengths, medication, emergency plans and professional boundaries is often more useful than a label alone." },
  { question: "Are specialist NannyOra profiles available throughout New Zealand?", answer: "NannyOra currently serves greater Auckland. The site’s Auckland specialist-care pages can help families browse active local profiles; future locations should not be treated as current availability." },
];

const careAreas = [
  { title: "Newborn and infant care", body: "Experience with feeds, naps, settling, developmentally appropriate play and parent-led routines. Ask about recent, comparable roles and safe-sleep knowledge." },
  { title: "ECE and teaching background", body: "Experience planning play, supporting learning and understanding early childhood development. Verify any claimed qualification or registration and keep the role grounded in the family’s needs." },
  { title: "Sensory-aware support", body: "Care that takes a child’s sensory preferences, transitions, environment and communication seriously. Ask for examples, not just a broad label." },
  { title: "Neurodiverse experience", body: "Practical experience supporting a child’s individual strengths, routines and regulation. A fit still depends on the child, the family plan and the nanny’s actual scope." },
  { title: "Multiple children and complex routines", body: "Experience coordinating different ages, school schedules, appointments or sibling needs. Confirm how the nanny prioritises safety and communicates changes." },
  { title: "Additional support needs", body: "A role may need careful coordination with parents and existing professionals. Be clear about what the nanny can do, when to ask for help and what remains outside the role." },
];

export default function SpecialistNannyCarePage() {
  const schemas = [articleSchema({ headline: title, description, path, datePublished: "2026-08-24" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Specialist Nanny Care", path }]), faqSchema(faqs)];
  return (
    <EditorialGuide eyebrow="Individual childcare support" title={title} description={description} imageTags={["sensory", "newborn", "ece", "care"]} imageSeed="specialist-nanny-care" highlights={["Start with your child", "Test relevant experience", "Respect safe boundaries", "Plan a supported start"]}
      toc={[{ id: "what-specialist-means", label: "What specialist care means" }, { id: "care-areas", label: "Areas of experience" }, { id: "write-a-brief", label: "Write a useful care brief" }, { id: "select-a-match", label: "Select the right match" }, { id: "safe-boundaries", label: "Safe boundaries and communication" }, { id: "auckland-care", label: "Specialist care in Auckland" }]}
      schemas={schemas} faqs={faqs}
      related={[
        { href: "/specialist-childcare-auckland", label: "Specialist childcare in Auckland", description: "Browse Auckland profiles with ECE or neurodiverse-care experience." },
        { href: "/sensory-aware-nanny-auckland", label: "Sensory-aware nannies", description: "Explore the considerations for sensory-aware support in Auckland." },
        { href: "/neurodiverse-childcare-auckland", label: "Neurodiverse childcare", description: "Find Auckland care shaped around individual strengths and routines." },
        { href: "/ece-nanny-auckland", label: "ECE nannies", description: "Discover Auckland nannies with ECE or teaching experience." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Check evidence, references and verification status before an offer." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare a safe home guide and emergency plan for the first day." },
      ]}
      ctaTitle="Find care built around your child’s real day" ctaBody="NannyOra currently supports greater Auckland families. Browse profiles, discuss the care brief and trial the match before regular care begins.">
      <GuideSection id="what-specialist-means" title="Specialist nanny care starts with the child—not a label" intro={<Prose>Specialist care means looking for experience and support that are genuinely relevant to your child’s life. It may be newborn know-how, an ECE background, sensory-aware practice, neurodiverse childcare experience, confidence with multiple children or a calm approach to an established care plan.</Prose>}>
        <Prose>The word “specialist” should not promise more than a nanny can safely provide. A nanny can be an important, trusted part of a child’s daily support team. They are not automatically a therapist, clinician or teacher, and they should never be asked to work outside their training or the agreed role.</Prose>
        <InfoCard title="Match evidence to the actual care brief" tone="soft">A qualification or badge is a useful starting point, not a substitute for fit. Ask whether the person has worked with children of a similar age, in similar routines and with comparable responsibilities. Then use a paid trial to see the relationship in real life.</InfoCard>
      </GuideSection>
      <GuideSection id="care-areas" title="Areas where families may look for additional experience">
        <div className="grid sm:grid-cols-2 gap-4">{careAreas.map((area) => <InfoCard key={area.title} title={area.title}>{area.body}</InfoCard>)}</div>
        <Prose>NannyOra’s platform uses specific profile information rather than treating all specialist claims alike. Families can look for indicators such as ECE experience, neurodiverse childcare experience and current first aid status, then read the profile and discuss what is relevant. Use the individual profile’s completed checks and visible verification level as part of your decision.</Prose>
      </GuideSection>
      <GuideSection id="write-a-brief" title="Write a care brief that helps the right nanny say yes" intro={<Prose>A clear brief makes a specialist match more respectful and more likely to work. It tells a candidate what the child enjoys and needs without turning the first conversation into an unnecessary disclosure of private information.</Prose>}>
        <Checklist items={["Describe your child’s age, strengths, interests and the parts of the day that usually go well.", "Set out the actual schedule: care hours, school or preschool, appointments, transport and any sole-charge periods.", "Explain useful routines for food, sleep, transitions, communication, play, comfort and regulation.", "List safety-critical information such as allergies, medication instructions, emergency contacts and escalation steps.", "State the experience or qualifications that are essential, preferred or simply nice to have.", "Be clear about the nanny’s role alongside parents, whānau, educators and health professionals." ]} />
      </GuideSection>
      <GuideSection id="select-a-match" title="How to select a specialist nanny match" intro={<Prose>Take a deliberate, evidence-led approach. The person with the longest childcare CV is not always the best person for your child’s particular needs and your household’s communication style.</Prose>}>
        <Steps items={[{ title: "Search for relevant signals", body: "Use profiles to identify the experience that maps to your brief, then read the full profile rather than relying on one filter." }, { title: "Interview for real situations", body: <>Use <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">structured interview questions</Link> about transitions, sensory preferences, distress, routine changes, family feedback and when the nanny would ask for help.</> }, { title: "Check evidence", body: <>Use the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> to review identity, references, qualifications and the verification details relevant to the role.</> }, { title: "Run a paid trial", body: "Agree the time, pay, supervision and goals in advance. Observe whether the nanny listens, follows the plan, notices cues and communicates calmly without forcing interaction." }, { title: "Document the working plan", body: <>Use a written <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link> and a practical home guide so responsibilities, boundaries and reviews are clear.</> }]} />
      </GuideSection>
      <GuideSection id="safe-boundaries" title="Safe boundaries, communication and ongoing support" intro={<Prose>Strong specialist care is collaborative. Parents remain responsible for major decisions and for sharing the information a nanny needs to do the agreed job safely. The nanny should know exactly when to call a parent, when to follow a written plan and when the situation is outside their role.</Prose>}>
        <Checklist items={["Share concise, current care information and update it when routines, medication or contact details change.", "Agree a simple daily handover: what happened, what worked, any incident, and anything that needs follow-up.", "Keep professional boundaries clear around medical, educational and behavioural decisions.", "Set a review point after the first week and first month; adjust the plan before small mismatches become bigger problems.", <>Use NannyOra’s <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">safety guide</Link> to prepare your home, emergency information and transport arrangements.</>]} />
      </GuideSection>
      <GuideSection id="auckland-care" title="Specialist nanny care in Auckland" intro={<Prose>NannyOra currently supports families in greater Auckland. If you are looking for individual support there, begin with the live specialist-care pathways and speak directly with candidates about the experience that matters to your child.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4"><InfoCard title="Browse specialist childcare"><Link href="/specialist-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">View specialist childcare in Auckland</Link>, where the current directory focuses on profiles with ECE or neurodiverse-care experience.</InfoCard><InfoCard title="Use a focused pathway"><Link href="/sensory-aware-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">Sensory-aware care</Link>, <Link href="/neurodiverse-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">neurodiverse childcare</Link> and <Link href="/ece-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">ECE nannies</Link> can help frame the search.</InfoCard></div>
      </GuideSection>
    </EditorialGuide>
  );
}
