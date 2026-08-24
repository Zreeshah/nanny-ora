import type { Metadata } from "next";
import Link from "next/link";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Nanny vs Au Pair: Which Childcare Arrangement Fits Your Family?";
const description = "Compare a professional nanny and an au pair arrangement: childcare role, live-in boundaries, privacy, accommodation, planning and the questions New Zealand families should resolve first.";
const path = "/nanny-vs-au-pair";

export const metadata: Metadata = { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "article" } };

const faqs: GuideFaq[] = [
  { question: "What is the difference between a nanny and an au pair?", answer: "A nanny is usually a professional childcare worker hired for an agreed role, often living out. An au pair arrangement commonly includes living with a host family and a cultural-exchange element. Individual arrangements vary, so confirm the actual duties, accommodation, hours and expectations rather than relying on the label." },
  { question: "Is an au pair cheaper than a nanny?", answer: "Do not compare only one payment figure. An au pair arrangement may involve accommodation, food, transport, privacy, household costs and immigration requirements, while a nanny role has its own pay and employment obligations. Price the full arrangement and get current advice for the facts of your situation." },
  { question: "Can an au pair provide sole-charge childcare?", answer: "The answer depends on the individual’s experience, the agreed arrangement and any current visa conditions. Families should not assume that a live-in arrangement proves childcare competence; check current Immigration New Zealand requirements and assess the person’s actual experience and fit." },
  { question: "Does a live-in nanny have to be available all the time?", answer: "No. Living in the home does not mean being on duty at all times. Define paid work, off-duty time, meals, nights, visitors, private spaces and how urgent changes are handled before the arrangement starts." },
  { question: "What should be in a live-in care agreement?", answer: "Cover the childcare role, paid hours, pay, accommodation terms, private space, food, transport, household access, visitors, off-duty time, notice and what happens if the living arrangement ends. Get appropriate employment or immigration advice for your circumstances." },
];

const rows = [
  { title: "Core arrangement", nanny: "A childcare role agreed directly with a family; usually a professional service relationship.", auPair: "A live-in host-family arrangement that may include childcare and a cultural-exchange element." },
  { title: "Living situation", nanny: "Often lives out, although live-in roles can be agreed separately.", auPair: "Commonly lives in the host family’s home, making privacy and boundaries central." },
  { title: "Selection focus", nanny: "Relevant childcare experience, reliability, communication and role-specific checks.", auPair: "The same childcare evidence plus suitability for sharing a home and any current visa requirements." },
  { title: "What must be written down", nanny: "Hours, pay, duties, expenses, safety and employment terms.", auPair: "All of the nanny points, plus accommodation, food, private space, visitors and household boundaries." },
];

export default function NannyVsAuPairPage() {
  const schemas = [articleSchema({ headline: title, description, path, datePublished: "2026-08-24" }), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny vs Au Pair", path }]), faqSchema(faqs)];
  return (
    <EditorialGuide eyebrow="Childcare comparison guide" title={title} description={description} imageTags={["family", "home", "care", "travel"]} imageSeed="nanny-vs-au-pair" highlights={["Compare the whole arrangement", "Protect home privacy", "Test childcare fit", "Confirm current obligations"]}
      toc={[{ id: "two-different-arrangements", label: "Two different arrangements" }, { id: "side-by-side", label: "Nanny vs au pair" }, { id: "professional-nanny", label: "When a nanny fits" }, { id: "live-in-arrangement", label: "When an au pair may fit" }, { id: "questions-before", label: "Questions to resolve first" }, { id: "make-it-safe", label: "Make the arrangement safe" }]}
      schemas={schemas} faqs={faqs}
      related={[
        { href: "/nanny-vs-daycare", label: "Nanny vs daycare", description: "Compare individual in-home care with a group centre experience." },
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Understand recurring care compared with occasional help." },
        { href: "/nanny-contract", label: "Nanny contract guide", description: "Put the childcare role and working arrangements in writing." },
        { href: "/nanny-payroll", label: "Nanny payroll guide", description: "Work through status, pay and household obligations." },
        { href: "/nanny-safety", label: "Nanny safety guide", description: "Prepare safe routines and clear emergency information." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland nanny profiles for professional in-home care." },
      ]}
      ctaTitle="Find a professional nanny for the role you need" ctaBody="Browse NannyOra’s Auckland profiles to compare relevant experience, availability and visible verification information before you meet.">
      <GuideSection id="two-different-arrangements" title="A nanny role and an au pair arrangement are not interchangeable" intro={<Prose>Both can involve childcare in a family home, but the arrangement around the care can be very different. A nanny is generally engaged for a defined childcare job. An au pair arrangement commonly also involves sharing a home with a host family and may include a cultural-exchange element.</Prose>}>
        <Prose>That distinction changes the decision. A professional nanny match is primarily about your children, schedule, duties and working relationship. An au pair match also asks whether everyone can comfortably share domestic space, food, household rhythms and privacy. Neither model is inherently right or wrong; both become difficult when the unspoken parts are left unspoken.</Prose>
        <InfoCard title="Check the current rules for your situation" tone="important">Immigration and employment responsibilities depend on the actual arrangement and can change. If a prospective au pair has visa conditions, confirm those directly with current Immigration New Zealand guidance before promising hours or duties. A label or informal online description is not a substitute for checking.</InfoCard>
      </GuideSection>
      <GuideSection id="side-by-side" title="Nanny vs au pair: what changes in practice">
        <div className="space-y-4">{rows.map((row) => <div key={row.title} className="grid md:grid-cols-[0.8fr_1fr_1fr] gap-4 rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm"><h3 className="font-heading text-lg font-bold text-foreground">{row.title}</h3><div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Nanny</p><p className="text-sm text-muted-foreground leading-relaxed">{row.nanny}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Au pair</p><p className="text-sm text-muted-foreground leading-relaxed">{row.auPair}</p></div></div>)}</div>
      </GuideSection>
      <GuideSection id="professional-nanny" title="When a professional nanny may be the better fit" intro={<Prose>A nanny can be the clearer choice when you want the household to remain private outside of work and the central need is reliable, skilled childcare.</Prose>}>
        <Checklist items={["You need consistent care that can be designed around school, work, naps, transport or multiple children.", "You want to assess and pay for directly relevant childcare experience rather than treat care as a secondary part of a home-sharing arrangement.", "Your family prefers defined work hours and a clear separation between employment and home life.", <>Your child needs particular experience, such as newborn, ECE or neurodiverse support; start with <Link href="/specialist-nanny-care" className="text-primary underline underline-offset-2 font-semibold">specialist nanny care</Link>.</>, "You can provide the structure of a written agreement and a safe, respectful workplace." ]} />
      </GuideSection>
      <GuideSection id="live-in-arrangement" title="When a live-in or au pair arrangement may be worth considering" intro={<Prose>A live-in arrangement can work when the family genuinely has suitable accommodation, clear household boundaries and a reason for care and home life to overlap. It needs more preparation, not less.</Prose>}>
        <Checklist items={["You can offer a private, suitable sleeping space and a realistic level of household privacy.", "Everyone in the home is comfortable sharing meals, common spaces and daily routines with another adult.", "You can define work time separately from off-duty time and respect it consistently.", "You have checked the individual’s current eligibility and any visa requirements before agreeing duties.", "You are ready to plan what happens if the childcare relationship or living arrangement needs to end." ]} />
      </GuideSection>
      <GuideSection id="questions-before" title="Questions to resolve before anyone moves in" intro={<Prose>Talk through uncomfortable details before they become personal conflicts. A good conversation is not a sign of distrust; it is how both sides decide whether the arrangement is workable.</Prose>}>
        <Steps items={[{ title: "Define paid care", body: "List regular work hours, on-call expectations, nights, transport, child-related tasks and what requires separate agreement." }, { title: "Define living arrangements", body: "Agree the bedroom, bathroom access, kitchen use, food, laundry, heating, parking, keys, visitors, quiet times and areas that are private." }, { title: "Define off-duty time", body: "Decide when the caregiver can make personal plans, whether family requests can be declined and how urgent changes are raised." }, { title: "Confirm legal and immigration position", body: "Use current official advice for the individual and arrangement. Do not make promises based on a generic description of an au pair role." }, { title: "Put it in writing", body: <>Use the <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract guide</Link> as a starting point for work terms, then add the accommodation details that a live-in arrangement needs.</> }]} />
      </GuideSection>
      <GuideSection id="make-it-safe" title="Make the arrangement safe and sustainable" intro={<Prose>Whether a caregiver lives in or out, children need a safe, calm adult and parents need honest communication. The fact that someone is staying in your home should never replace careful matching or safety planning.</Prose>}>
        <Checklist items={[<>Use the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting process</Link> to test identity, references and relevant experience.</>, "Interview for real situations: emergencies, child distress, privacy, transport, feedback and boundaries.", "Use a paid trial before a long-term commitment where possible.", <>Prepare emergency contacts, medication instructions, household safety information and handovers with the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link>.</>, "Schedule a review in the first weeks so small concerns can be discussed early and respectfully." ]} />
      </GuideSection>
    </EditorialGuide>
  );
}
