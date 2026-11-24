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
  type GuideFaq,
} from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Legal Age to Babysit in NZ: What the Law Actually Says";
const description =
  "Understand the legal age to babysit in New Zealand: no set babysitting age in law, the under-14 supervision rule, Police guidance and how parents should judge readiness.";
const path = "/legal-age-to-babysit-nz";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What is the legal age to babysit in New Zealand?", answer: "New Zealand law does not set a specific legal age for babysitting. The relevant law makes it an offence to leave a child under 14 without making reasonable provision for their supervision and care. New Zealand Police advise that a babysitter should be at least 14 and someone the family trusts." },
  { question: "Can a 14-year-old babysit?", answer: "Fourteen is the age Police point to as a minimum, but it is not a guarantee of readiness. Parents must still judge the teenager’s maturity, experience, the children’s needs, the length of the booking and whether the sitter can handle an unexpected problem." },
  { question: "Can a child babysit their younger siblings?", answer: "There is no set legal age for sibling babysitting either. The same test applies: the older child must be able to provide reasonable supervision and care, and the parents remain responsible for making safe arrangements. A short evening is very different from a full day or an overnight stay." },
  { question: "What happens if a child is left without proper supervision?", answer: "Parents, guardians and caregivers can be fined up to $2,000 under the Summary Offences Act 1981 if they do not make safe care arrangements for a child under 14. The law looks at whether reasonable provision was made, how long the child was left and the circumstances." },
  { question: "Does a young babysitter need to be paid the minimum wage?", answer: "Pay rules depend on the arrangement and the sitter’s age and employment status. Check Employment New Zealand’s current minimum-wage guidance before agreeing pay, and agree the rate, hours and finish time in advance." },
];

export default function LegalAgeToBabysitNzPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Legal Age to Babysit NZ", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand parent guide"
      title={title}
      description={description}
      imageTags={["babysitting", "family", "home", "safety"]}
      imageSeed="legal-age-to-babysit-nz"
      highlights={["No set legal babysitting age", "Under-14 supervision rule", "Police advise 14 as a minimum", "Maturity matters more than age"]}
      toc={[
        { id: "short-answer", label: "The short answer" },
        { id: "under-14-rule", label: "The under-14 rule" },
        { id: "judging-readiness", label: "Judging readiness" },
        { id: "siblings", label: "Siblings babysitting siblings" },
        { id: "pay-and-work-rules", label: "Pay and work rules" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/babysitting-rules-nz", label: "Babysitting rules NZ", description: "Set the house rules, safety rules and pay rules for the booking." },
        { href: "/babysitter-responsibilities", label: "Babysitter responsibilities", description: "See what the role covers and what is not automatically included." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare emergency information, boundaries and a first-day home guide." },
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Understand what evidence to check before a regular arrangement." },
        { href: "/babysitter-pay-calculator", label: "Babysitter pay calculator", description: "Estimate pay for a booking from hours and an hourly rate." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles when you need a considered childcare match." },
      ]}
      ctaTitle="Age is a starting point, not a decision"
      ctaBody="Check the law, then judge the person, the children and the booking — and when in doubt, choose the more experienced sitter."
    >
      <GuideSection id="short-answer" title="The short answer: there is no set legal babysitting age" intro={<Prose>New Zealand law does not name a legal age for babysitting. No statute says “a babysitter must be 16” or “a babysitter must be 18”. Instead, the law places the responsibility on the adult who arranges the care.</Prose>}>
        <Prose>It is illegal to leave a child under the age of 14 without making reasonable provision for their supervision and care. That rule applies whether the child is left alone, left with another child, or left with a young person who cannot provide reasonable care. New Zealand Police advise that a babysitter should be at least 14 years old and somebody the family trusts and the children feel happy with.</Prose>
        <InfoCard title="Fourteen is a floor, not a qualification" tone="important">Being 14 does not automatically make a teenager ready to babysit. Maturity, experience, the children’s ages and needs, the length of the booking and the ability to respond to an emergency all matter more than the birthday itself.</InfoCard>
      </GuideSection>

      <GuideSection id="under-14-rule" title="The under-14 supervision rule, explained" intro={<Prose>The rule is about reasonable provision, not about a single number. Parents, guardians and caregivers must make safe arrangements for a child under 14, and the arrangements must fit the circumstances.</Prose>}>
        <Prose>What counts as reasonable depends on the child’s age, the length of time, the place, the risks involved and who is providing the care. Leaving a 13-year-old with a trusted 16-year-old sibling for two hours in the evening is a different decision from leaving a toddler with a 14-year-old for a full day. The New Zealand Government’s guidance on <SourceLink href="https://www.govt.nz/browse/family-and-whanau/childcare-and-supervision/leaving-children-by-themselves/">leaving children by themselves</SourceLink> explains the rule and points to Oranga Tamariki guidance on appropriate supervision for different ages.</Prose>
        <Prose>Parents, guardians and caregivers who do not make safe care arrangements for a child under 14 can be fined up to $2,000 under the Summary Offences Act 1981. The fine is a reminder that the responsibility sits with the adult who made the arrangement, not with the young person who was asked to babysit.</Prose>
      </GuideSection>

      <GuideSection id="judging-readiness" title="How to judge whether a young person is ready to babysit" intro={<Prose>Because the law leaves the decision to parents, the practical question is readiness. Use the same judgment for a 14-year-old as for any sitter — and add extra support where the sitter is young.</Prose>}>
        <Checklist items={[
          "Is the sitter mature and responsible enough to stay focused for the whole booking, including when a child is distressed or a plan changes?",
          "Has the sitter cared for children of these ages before, even informally, and can a family or referee confirm it?",
          "Does the sitter know what to do in an emergency, who to call and when to call for help rather than waiting?",
          "Are the children comfortable with the sitter, and does the sitter understand the house rules, allergies and routines?",
          "Is a parent reachable for the whole booking, with a backup adult available if the parent cannot be reached?",
          "Is the booking short, local and well defined — or long, complex and better suited to an experienced adult sitter?",
        ]} />
        <Prose>Start small: a short evening with settled children, a parent nearby, a clear finish time and a safe way home. Build up to longer or more demanding bookings only when the sitter has shown they can handle the easier ones. The <Link href="/babysitting-rules-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rules guide</Link> and the <Link href="/babysitter-responsibilities" className="text-primary underline underline-offset-2 font-semibold">babysitter responsibilities guide</Link> explain what to agree before any booking, whatever the sitter’s age.</Prose>
      </GuideSection>

      <GuideSection id="siblings" title="Siblings babysitting siblings" intro={<Prose>Many families first face this question at home: can the 14-year-old look after the 8-year-old while the parents go out? The law gives the same answer — there is no set age, and the parents must make reasonable provision for supervision and care.</Prose>}>
        <Prose>Consider the age gap, the younger child’s needs, the length of time, the time of day and whether the older sibling wants the responsibility. A willing, capable teenager looking after a settled school-age sibling for two hours is very different from a reluctant teenager left with a toddler for a whole day. If the older sibling is not ready, or the younger child needs close care, an adult sitter is the safer choice.</Prose>
      </GuideSection>

      <GuideSection id="pay-and-work-rules" title="Pay and work rules for young babysitters" intro={<Prose>Age also affects pay. A young person doing real childcare work should be paid fairly for the booking, and the rate, hours and finish time should be agreed in advance — just as for an adult sitter.</Prose>}>
        <Steps items={[
          { title: "Agree the rate first", body: "Confirm the hourly rate, the total for the planned booking and the treatment of late finishes before the sitter accepts." },
          { title: "Check current pay guidance", body: <>Pay rules depend on the arrangement and the sitter’s age and employment status. Check <SourceLink href="https://www.employment.govt.nz/pay-and-hours/pay-and-wages/minimum-wage/minimum-wage-rates-and-types">Employment New Zealand’s current minimum-wage guidance</SourceLink> rather than relying on an old rate card.</> },
          { title: "Keep bookings proportionate", body: "Short, defined bookings with a clear finish time and safe transport home are appropriate for a young sitter. Long nights, sole-charge baby care and complex needs are better suited to an experienced adult." },
          { title: "Record the arrangement", body: "Even for a teenager, put the date, hours, duties, pay and emergency contacts in a message so everyone is working from the same plan." },
        ]} />
        <Prose>The <Link href="/babysitter-pay-calculator" className="text-primary underline underline-offset-2 font-semibold">babysitter pay calculator</Link> can estimate the booking cost once the rate and hours are agreed. For regular care, the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> covers the household information every caregiver needs.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
