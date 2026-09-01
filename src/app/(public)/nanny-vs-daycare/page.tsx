import type { Metadata } from "next";
import Link from "next/link";
import {
  Checklist,
  EditorialGuide,
  GuideSection,
  InfoCard,
  Prose,
  Steps,
  type GuideFaq,
} from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "Nanny vs Daycare NZ: Which Is Right for You?";
const description = "Compare a nanny and daycare in New Zealand: routines, flexibility, one-to-one attention, social time, cost and how to choose.";
const path = "/nanny-vs-daycare";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "Is a nanny better than daycare?", answer: "Neither is automatically better. A nanny can suit a family that values care at home, an individual routine or agreed flexibility. Daycare can suit a family that values a regular group setting and a centre-led programme. Compare the options against your child, schedule, budget and appetite for household administration." },
  { question: "Is a nanny more flexible than daycare?", answer: "A nanny’s hours and duties can be agreed around one family’s needs, while centres usually operate within published hours and policies. Flexibility still needs to be realistic, paid and documented; it is not unlimited availability." },
  { question: "Does daycare give children more social interaction?", answer: "A centre typically gives a child regular time with a group of peers. A nanny can build social time through playgroups, parks, classes and community activities when these are agreed and suitable for the child. The quality of interaction matters more than simply the format." },
  { question: "Do I become an employer if I hire a nanny?", answer: "Often, a regular nanny arrangement has employee features. The legal position depends on the real working relationship, not the job title. Read NannyOra’s payroll guide and use current Employment New Zealand or professional advice before care starts." },
  { question: "Can I combine daycare and a nanny?", answer: "Yes. Some families use centre days for peer time and a nanny for shorter days, school holidays, pickup or home-based continuity. Be clear about guaranteed hours, travel, handovers and what happens when one part of the arrangement changes." },
];

const comparison = [
  { title: "Where care happens", nanny: "At your home and in your local community.", daycare: "At an early learning centre with its own programme, setting and policies." },
  { title: "Attention and routine", nanny: "Built around your child or siblings, family routines and agreed activities.", daycare: "Shared within a group and a centre timetable." },
  { title: "Hours and change", nanny: "Hours can be agreed to fit your schedule, within fair and lawful work arrangements.", daycare: "Usually follows fixed opening hours, enrolment terms and centre policies." },
  { title: "Peer time", nanny: "Can be planned through outings and local activities.", daycare: "Usually happens naturally within a regular peer group." },
  { title: "Parent responsibilities", nanny: "The family may have recruitment, employment, payroll and household-safety responsibilities.", daycare: "The family buys a service and follows the provider’s enrolment and centre policies." },
];

export default function NannyVsDaycarePage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-24" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny vs Daycare", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="Childcare comparison guide"
      title={title}
      description={description}
      imageTags={["family", "childcare", "play", "home"]}
      imageSeed="nanny-vs-daycare"
      highlights={["Compare the real day", "Consider your child’s routine", "Include the full commitment", "Make a confident next step"]}
      toc={[
        { id: "the-core-difference", label: "The core difference" },
        { id: "side-by-side", label: "Nanny vs daycare" },
        { id: "when-a-nanny-fits", label: "When a nanny may fit" },
        { id: "when-daycare-fits", label: "When daycare may fit" },
        { id: "decision-process", label: "A practical decision process" },
        { id: "combine-care", label: "Combining care options" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter", description: "Separate regular childcare from occasional supervision." },
        { href: "/nanny-vs-au-pair", label: "Nanny vs au pair", description: "Compare a professional nanny role with a live-in household arrangement." },
        { href: "/specialist-nanny-care", label: "Specialist nanny care", description: "Plan a careful match when your child needs individual support." },
        { href: "/nanny-payroll", label: "Nanny payroll guide", description: "Understand the household responsibilities that can come with a regular nanny." },
        { href: "/parent-resources", label: "Parent resources", description: "Keep planning with NannyOra’s family guides and checklists." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse Auckland nanny profiles when in-home care is the better fit." },
      ]}
      ctaTitle="See whether in-home care fits your family"
      ctaBody="Browse NannyOra profiles in Auckland, then interview and trial the people whose experience and availability fit your real week."
    >
      <GuideSection id="the-core-difference" title="The core difference between a nanny and daycare" intro={<Prose>A nanny provides agreed childcare for one family, usually in the child’s own home. Daycare, or early learning centre care, is a service delivered in a group setting with its own routines, staff and policies. The right choice is not a verdict on either format—it is a decision about how your family’s ordinary Tuesday needs to work.</Prose>}>
        <Prose>
          Start with the experience your child needs. Some children settle best with familiar surroundings, a slower transition and a routine that can move with naps, feeds, school pickup or appointments. Others thrive on a regular group environment, centre activities and seeing familiar peers each day. Many families value elements of both.
        </Prose>
        <Prose>
          The practical difference is just as important. With a nanny, you agree the hours, duties, pay and boundaries directly with the person caring for your child. With daycare, you enrol in a provider’s service and work within its opening hours, availability and policies. Both need planning; the responsibilities are simply different.
        </Prose>
      </GuideSection>

      <GuideSection id="side-by-side" title="Nanny vs daycare: side-by-side">
        <div className="space-y-4">
          {comparison.map((row) => (
            <div key={row.title} className="grid md:grid-cols-[0.8fr_1fr_1fr] gap-4 rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-foreground">{row.title}</h3>
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Nanny</p><p className="text-sm text-muted-foreground leading-relaxed">{row.nanny}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Daycare</p><p className="text-sm text-muted-foreground leading-relaxed">{row.daycare}</p></div>
            </div>
          ))}
        </div>
        <Prose>
          Compare total value rather than an advertised hourly figure alone. A nanny arrangement can include pay, leave, payroll, mileage, activities and backup cover. Centre care has its own fees, enrolment terms, closure dates and practical travel. Write down every regular cost and every point where the day can break down before deciding.
        </Prose>
      </GuideSection>

      <GuideSection id="when-a-nanny-fits" title="When a nanny may be the better fit" intro={<Prose>A nanny can be a strong match when continuity at home is more useful than a standard group timetable. It is especially worth considering when the role has a clear, recurring shape.</Prose>}>
        <Checklist items={[
          "Your child’s naps, feeds, transitions or medical routines are easier to manage at home.",
          "You need school pickup, after-school care, holiday cover or a schedule that does not align with centre hours.",
          "Siblings have different ages, locations or activities and you want one coordinated routine.",
          <>You need a deliberate match for newborn, sensory-aware or neurodiverse support; see <Link href="/specialist-nanny-care" className="text-primary underline underline-offset-2 font-semibold">specialist nanny care</Link> for the questions to ask.</>,
          "You value one-to-one attention and want to agree outings, meals, screen boundaries and daily communication directly.",
        ]} />
        <InfoCard title="Flexibility still needs a boundary" tone="important">
          A nanny is not an on-call solution by default. Agree guaranteed hours, start and finish times, notice for changes, overtime, travel and what happens when a child is unwell. A clear written agreement protects the relationship as well as the routine.
        </InfoCard>
      </GuideSection>

      <GuideSection id="when-daycare-fits" title="When daycare may be the better fit" intro={<Prose>Daycare can be a good choice when a consistent centre-based routine and a regular group environment are your priorities. It can also be simpler for a family that does not want to manage a direct employment relationship.</Prose>}>
        <Checklist items={[
          "Your work and travel schedule fits the centre’s standard opening hours reliably.",
          "Your child enjoys regular time with a group and responds well to a centre setting.",
          "You prefer a provider-led programme and are comfortable following centre policies for handovers, illness and holidays.",
          "You want to purchase a childcare service rather than recruit, employ and supervise an individual worker.",
          "A local centre has availability and a practical commute for your family.",
        ]} />
      </GuideSection>

      <GuideSection id="decision-process" title="A practical way to choose" intro={<Prose>Make the choice with the people who will live the routine: your child where appropriate, both parents or caregivers, and anyone who regularly helps with pickup or backup care. Use evidence from your actual week, not an idealised schedule.</Prose>}>
        <Steps items={[
          { title: "Map the week", body: "Record work hours, commute, school or activity times, nap windows, meals, appointments and the care gaps that are currently hardest." },
          { title: "Rank your top three needs", body: "Choose from routine at home, peer interaction, schedule flexibility, cost predictability, specialist support, location, backup cover and less administration." },
          { title: "Price the whole arrangement", body: "Include every predictable cost and the time you will spend organising it. Do not assume two headline prices represent the same service." },
          { title: "Test the experience", body: "Visit centres, ask about the things that affect your child’s day, and meet potential nannies. A paid nanny trial helps you observe communication and your child’s response." },
          { title: "Plan the first month", body: "Whether you enrol or hire, allow for a settling-in period, short handovers and a review point rather than expecting a perfect transition on day one." },
        ]} />
      </GuideSection>

      <GuideSection id="combine-care" title="You do not have to choose only one format" intro={<Prose>Hybrid care can make sense when it solves a specific problem. A family might use centre days for peer time and a nanny for the days that need school pickup, shorter hours, home routines or holiday coverage.</Prose>}>
        <Prose>
          The key is to make the overlap deliberate. Tell each caregiver what information must be handed over, which routines must stay consistent, who can collect the child, and who makes a decision if a parent cannot be reached. If you employ a nanny regularly, use the <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract guide</Link>, the <Link href="/nanny-payroll" className="text-primary underline underline-offset-2 font-semibold">payroll guide</Link> and the <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">safety checklist</Link> before care begins.
        </Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
