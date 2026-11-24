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

const title = "Babysitter Reference Letter: Template, Example and What to Ask";
const description =
  "Write or request a babysitter reference letter in New Zealand: what it should cover, a template to copy, a worked example and how families should use it.";
const path = "/babysitter-reference-letter";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What should a babysitter reference letter include?", answer: "The referee’s relationship to the sitter, the dates and type of care, the children’s ages, the duties performed, reliability, communication, safety judgment and whether the referee would rehire the sitter. Specific examples are more useful than general praise." },
  { question: "How many reference letters does a babysitter need?", answer: "One strong, recent reference from a family who directly observed the sitter’s work is more useful than several vague ones. Families may ask for a second referee where the role involves babies, sole-charge care or complex needs." },
  { question: "Can a family contact the referee directly?", answer: "Yes, with the sitter’s consent. A short call lets the family confirm the relationship, the dates and the duties, then ask about reliability, judgment and any concerns. Written letters alone do not always reveal the full picture." },
  { question: "Should a reference letter mention pay?", answer: "It does not need to. Pay is agreed separately between the family and the sitter. The letter should focus on the care provided, the sitter’s conduct and the referee’s honest assessment." },
  { question: "What if a sitter has no previous family to ask?", answer: "Ask for a referee who has observed the sitter with children in another setting — for example, a teacher, a coach, a volunteer coordinator or a supervisor from relevant work. Be honest about limited experience and arrange a paid trial with clear supervision." },
];

export default function BabysitterReferenceLetterPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Babysitter Reference Letter", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="New Zealand parent guide"
      title={title}
      description={description}
      imageTags={["babysitting", "family", "home", "care"]}
      imageSeed="babysitter-reference-letter"
      highlights={["Specific examples beat praise", "Confirm facts before opinions", "Call the referee too", "Keep references honest"]}
      toc={[
        { id: "what-good-reference-covers", label: "What a good reference covers" },
        { id: "template", label: "Reference letter template" },
        { id: "worked-example", label: "Worked example" },
        { id: "how-families-use-it", label: "How families should use it" },
        { id: "requesting-a-reference", label: "Requesting a reference" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Understand reference checks as part of a wider vetting process." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Ask structured questions to test experience and judgment." },
        { href: "/babysitter-responsibilities", label: "Babysitter responsibilities", description: "Know the duties a reference should describe." },
        { href: "/babysitting-rules-nz", label: "Babysitting rules NZ", description: "Set the house rules and safety rules for the booking." },
        { href: "/apply-as-nanny", label: "Apply as a nanny", description: "Sitters can register a profile and share their experience." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare verification information." },
      ]}
      ctaTitle="A reference is evidence, not a formality"
      ctaBody="Ask for specifics, speak with the referee, and weigh the reference alongside the interview and a paid trial."
    >
      <GuideSection id="what-good-reference-covers" title="What a good babysitter reference covers" intro={<Prose>A useful reference letter answers the questions a family actually needs answered: did this person care for children like mine, did they do it reliably, and would the family trust them again?</Prose>}>
        <Checklist items={[
          "Who the referee is, how they know the sitter and how long they worked together.",
          "The dates, the frequency of bookings and the type of care provided.",
          "The children’s ages and any specific needs the sitter managed.",
          "The duties performed: meals, bath time, bedtime, transport, homework or overnight care.",
          "Reliability: punctuality, communication, handling of changed plans and late finishes.",
          "Judgment: how the sitter responded to a distressed child, an unexpected problem or an emergency.",
          "Whether the referee would rehire the sitter — and for what kind of role.",
        ]} />
        <Prose>General praise without detail is weak evidence. “She was lovely” tells a family far less than “She cared for our two-year-old every Friday evening for eight months, managed the bedtime routine independently and called us promptly when our son was unwell.”</Prose>
      </GuideSection>

      <GuideSection id="template" title="Babysitter reference letter template" intro={<Prose>Copy the template below and replace the bracketed details with the real facts. Keep the letter to one page and keep every claim specific and honest.</Prose>}>
        <InfoCard title="Reference letter template">
          <p className="mb-3">[Date]</p>
          <p className="mb-3">To whom it may concern,</p>
          <p className="mb-3">I am writing to recommend [sitter’s full name], who provided babysitting care for our family from [start date] to [end date]. During that time, [first name] cared for our [number] children, aged [ages], on [frequency, for example every Friday evening].</p>
          <p className="mb-3">[First name]’s regular duties included [meals, bath time, bedtime routine, homework support, transport — list only what actually happened]. [He/She/They] was reliable, communicated clearly about arrival times and any changes, and followed our household and safety instructions.</p>
          <p className="mb-3">One example that reflects [first name]’s approach is [a specific, real example: how the sitter handled a distressed child, a changed plan or an unexpected problem].</p>
          <p className="mb-3">I would happily recommend [first name] for [the type of role, for example occasional evening babysitting for school-age children]. I am happy to be contacted to discuss this reference further.</p>
          <p className="mb-3">Kind regards,<br />[Referee’s full name]<br />[Relationship to the sitter, for example parent of children cared for]<br />[Phone number] · [Email address]</p>
        </InfoCard>
        <Prose>Leave out anything that cannot be verified. A reference should describe observed work, not repeat claims the referee did not witness.</Prose>
      </GuideSection>

      <GuideSection id="worked-example" title="Worked example" intro={<Prose>The example below shows the template filled in with realistic detail. The names and dates are placeholders — the point is the level of specificity, not the wording.</Prose>}>
        <InfoCard title="Example reference" tone="soft">
          <p className="mb-3">12 March 2026</p>
          <p className="mb-3">To whom it may concern,</p>
          <p className="mb-3">I am writing to recommend Ana, who provided evening babysitting for our family from June 2025 to February 2026. During that time, Ana cared for our two children, aged four and seven, most Friday evenings from 6pm to 10pm.</p>
          <p className="mb-3">Ana’s regular duties included dinner, bath time and the bedtime routine for our younger child, and reading and homework supervision for our older child. She arrived on time for every booking, messaged us promptly when traffic delayed her once, and always left a short written handover.</p>
          <p className="mb-3">One evening our younger child woke distressed at 9pm. Ana settled her calmly, followed our instructions, and called us to let us know rather than waiting until we returned. That judgment is why we continued booking her.</p>
          <p className="mb-3">I would happily recommend Ana for regular evening babysitting for preschool and school-age children, and I am happy to be contacted to discuss this reference.</p>
          <p className="mb-3">Kind regards,<br />Sarah M., parent</p>
        </InfoCard>
        <Prose>Notice what the example does: it gives dates, ages, hours, duties and one concrete incident. A family reading it can picture the actual work and ask follow-up questions.</Prose>
      </GuideSection>

      <GuideSection id="how-families-use-it" title="How families should use a reference letter" intro={<Prose>A letter is a starting point, not a verdict. Use it alongside the interview, the profile’s verification information and a paid trial.</Prose>}>
        <Steps items={[
          { title: "Check the facts first", body: "Confirm the relationship, the dates, the children’s ages and the duties. If the letter is vague on any of these, ask the sitter and the referee to clarify." },
          { title: "Call the referee", body: "A short call reveals more than a letter. Ask about reliability when plans changed, communication about incidents, and whether the referee would rehire the sitter for your type of role." },
          { title: "Test the claims in interview", body: <>Use structured <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the sitter handled situations like the ones described in the letter.</> },
          { title: "Weigh it with the rest of the evidence", body: <>Read the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">nanny vetting guide</Link> to understand how references fit with identity, work history, qualifications and Police vetting where applicable.</> },
        ]} />
        <Prose>Be alert to warning signs: a referee who cannot confirm the dates or duties, a letter that reads as though the sitter wrote it, pressure to skip the call, or a reference from a family member presented as an independent referee. NannyOra’s operational vetting system includes at least one non-family referee check — families may ask for additional nominated referees where the role warrants it.</Prose>
      </GuideSection>

      <GuideSection id="requesting-a-reference" title="How sitters can request a reference" intro={<Prose>A good reference is easier to obtain when the sitter asks early and makes it easy for the family to say yes.</Prose>}>
        <Checklist items={[
          "Ask a family you worked for recently and regularly, not one from years ago.",
          "Ask in person or by message, and offer the template above so the family knows what to include.",
          "Ask whether the family is comfortable being contacted by future families.",
          "Thank them, and let them know the outcome of your applications where appropriate.",
          "Keep the letter and the referee’s contact details current — an out-of-date reference loses value quickly.",
        ]} />
        <Prose>When handling references, collect only information relevant to the role and keep candidate information secure. The Privacy Commissioner’s <SourceLink href="https://www.privacy.org.nz/resources-and-learning/a-z-topics/recruitment/">recruitment privacy guidance</SourceLink> explains consent, relevant collection and appropriate handling of applications and checks.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
