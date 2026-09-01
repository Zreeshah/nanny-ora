import type { Metadata } from "next";
import Link from "next/link";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Nanny vs Babysitter: The Difference in NZ";
const description = "The difference between a nanny and a babysitter: regular care, responsibilities, experience and how to choose for your family.";
const path = "/nanny-vs-babysitter";

export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };

const faqs: GuideFaq[] = [
  { question: "What is the main difference between a nanny and a babysitter?", answer: "A nanny is usually engaged for regular, planned childcare and becomes part of the family’s weekly routine. A babysitter is commonly used for occasional, shorter-term supervision. The actual duties, frequency and degree of control matter more than the title." },
  { question: "Can a babysitter become a nanny?", answer: "Yes. A family may start with occasional bookings and later agree a regular role. Before the change, revisit availability, duties, pay, checks, safety information and whether the working arrangement has employee features." },
  { question: "Do I need to vet a babysitter?", answer: "The depth of checking should reflect the role and level of responsibility. For any person caring for your child, meet them, seek relevant references, agree emergency information and watch how they communicate. Regular or sole-charge care calls for a more structured process." },
  { question: "Is a nanny always an employee?", answer: "No title decides legal status on its own. Regular care in a family’s home at set times can have employee features, but the real relationship must be assessed. NannyOra’s payroll guide explains the questions to work through." },
  { question: "Can a nanny do occasional babysitting?", answer: "Often, provided both sides agree the time, rate and duties. Avoid assuming that extra evening, weekend or overnight work is automatically included in a regular arrangement." },
];

const rows = [
  { heading: "Typical purpose", nanny: "Ongoing childcare that supports a family’s ordinary routine.", babysitter: "Occasional supervision for an evening, event, appointment or short gap." },
  { heading: "Planning", nanny: "Usually has agreed regular hours, duties, communication and care routines.", babysitter: "Usually covers a defined booking with a narrower handover." },
  { heading: "Childcare role", nanny: "May include child meals, school pickup, outings, naps, homework and child-related tidying when agreed.", babysitter: "Usually keeps children safe and settled during the booked time; extra duties should be explicit." },
  { heading: "Checks and fit", nanny: "A structured selection process is useful because the relationship is recurring and often sole-charge.", babysitter: "Still meet, check relevant experience and share safety information; depth should match the booking." },
];

export default function NannyVsBabysitterPage() {
  const schemas = [articleSchema({ headline: title, description, path, datePublished: "2026-08-24" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny vs Babysitter", path }]), faqSchema(faqs)];
  return (
    <EditorialGuide eyebrow="Childcare comparison guide" title={title} description={description} imageTags={["babysitting", "family", "home", "care"]} imageSeed="nanny-vs-babysitter" highlights={["Regular care vs occasional help", "Choose by the real role", "Set expectations early", "Keep children’s safety central"]}
      toc={[{ id: "titles-are-not-rules", label: "Titles are not rules" }, { id: "key-differences", label: "Key differences" }, { id: "when-nanny-fits", label: "When a nanny fits" }, { id: "when-babysitter-fits", label: "When a babysitter fits" }, { id: "moving-to-regular-care", label: "Moving to regular care" }, { id: "safe-start", label: "A safe start for either role" }]}
      schemas={schemas} faqs={faqs}
      related={[
        { href: "/nanny-vs-daycare", label: "Nanny vs daycare", description: "Compare home-based, individual care with a centre routine." },
        { href: "/nanny-vs-au-pair", label: "Nanny vs au pair", description: "Understand the added considerations of a live-in arrangement." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Use references, interview evidence and visible verification information." },
        { href: "/nanny-interview-questions", label: "Interview questions", description: "Ask questions that reveal safety judgment and communication." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare the home, emergency contacts and first handover." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland profiles for planned, recurring care." },
      ]}
      ctaTitle="Find care that matches the job you actually need done" ctaBody="If your family needs reliable, planned care each week, browse NannyOra profiles and compare experience, availability and verification details.">
      <GuideSection id="titles-are-not-rules" title="A title is not the whole job description" intro={<Prose>“Nanny” and “babysitter” are useful everyday words, but they do not create a fixed legal or professional boundary. What matters is the real arrangement: how often the person works, who sets the hours and duties, how much responsibility they hold, and whether care is part of your family’s regular routine.</Prose>}>
        <Prose>A babysitter is often booked for a contained period: an evening out, an appointment, a wedding or a short care gap. A nanny is usually hired for repeat care and may be responsible for the rhythm of a larger part of the day. That can mean meals, naps, school pickup, activities, homework, child-related tidying and a detailed parent handover—all agreed in advance.</Prose>
        <InfoCard title="Choose the role before choosing the label" tone="soft">Write the exact days, hours, children’s ages, sole-charge time, transport, routine tasks and backup expectations. Then decide whether the need is genuinely occasional or a continuing position that deserves a nanny-style hiring process.</InfoCard>
      </GuideSection>
      <GuideSection id="key-differences" title="Nanny vs babysitter: the practical differences">
        <div className="space-y-4">{rows.map((row) => <div key={row.heading} className="grid md:grid-cols-[0.8fr_1fr_1fr] gap-4 rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm"><h3 className="font-heading text-lg font-bold text-foreground">{row.heading}</h3><div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Nanny</p><p className="text-sm text-muted-foreground leading-relaxed">{row.nanny}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Babysitter</p><p className="text-sm text-muted-foreground leading-relaxed">{row.babysitter}</p></div></div>)}</div>
        <Prose>Neither role is “less important.” An occasional sitter may need to handle bedtime, an allergy plan or an anxious child, while a nanny may only be needed for a calm after-school window. Match the level of selection, preparation and payment to the responsibility you are asking someone to take.</Prose>
      </GuideSection>
      <GuideSection id="when-nanny-fits" title="When a nanny is likely the better fit" intro={<Prose>Look for a nanny when care is a dependable part of your week and your child benefits from continuity with one adult.</Prose>}>
        <Checklist items={["You need care on recurring days or for a sustained period.", "The role includes school or preschool pickup, activities, meals, naps, homework or regular outings.", "Your schedule changes from centre hours or needs care in your own home.", "Your child needs a consistent routine, careful handovers or individual support.", <>You are ready to interview, run a paid trial, use appropriate <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting</Link> and document the role.</>]} />
      </GuideSection>
      <GuideSection id="when-babysitter-fits" title="When a babysitter is likely the better fit" intro={<Prose>A babysitter can be ideal when the job is specific, short and occasional. It is a way to create breathing room without designing a whole regular childcare arrangement.</Prose>}>
        <Checklist items={["You need an evening, event, appointment or one-off daytime booking covered.", "The main task is supervision, play, a simple meal and bedtime during a defined window.", "A parent or trusted caregiver can give a clear handover and remain reachable.", "You do not need recurring school pickup, daytime routine ownership or ongoing childcare planning.", "The sitter’s experience fits the child’s age and the complexity of the booking." ]} />
      </GuideSection>
      <GuideSection id="moving-to-regular-care" title="When occasional babysitting becomes a regular nanny role" intro={<Prose>It is common for a family to start with a trusted babysitter and later need more regular help. Treat that as a new conversation, not an automatic extension of the original arrangement.</Prose>}>
        <Steps items={[{ title: "Reconfirm availability", body: "Ask whether the person wants consistent hours and can realistically commit to the schedule." }, { title: "Rewrite the role", body: "Set out paid hours, guaranteed hours, duties, transport, expenses, communication and boundaries." }, { title: "Complete the right checks", body: <>For recurring sole-charge care, use NannyOra’s <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">vetting guide</Link> and a structured interview.</> }, { title: "Set up employment correctly", body: <>Regular home-based care may have employee features. Work through the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">nanny payroll guide</Link> and get current advice if unsure.</> }, { title: "Plan the first month", body: "Provide a home guide, agree a paid trial or transition period, and review how the arrangement feels for the child and caregiver." }]} />
      </GuideSection>
      <GuideSection id="safe-start" title="A safe, clear start for either role" intro={<Prose>Even a brief booking deserves a proper handover. Safety comes from information, preparation and communication—not from assuming that a familiar face knows your household.</Prose>}>
        <Checklist items={["Share emergency contacts, allergies, medication instructions and the child’s current routines.", "Explain who may collect the child, what areas or activities are off limits, and when to call you immediately.", "Show the sitter or nanny essential household safety information, first aid supplies and exits.", "Agree photos, screens, visitors, transport and any use of the family car before the booking starts.", <>Use the fuller <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety checklist</Link> for regular care.</>]} />
      </GuideSection>
    </EditorialGuide>
  );
}
