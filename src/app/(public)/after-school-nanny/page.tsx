import type { Metadata } from "next";
import Link from "next/link";
import { Checklist, EditorialGuide, GuideSection, InfoCard, Prose, Steps, type GuideFaq } from "@/components/seo/EditorialGuide";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";

const title = "After-School Nanny Care: Duties, Hours, Costs and Hiring Checklist";
const description = "Plan after-school nanny care in New Zealand: school pickup, snacks, homework, transport, costs, safety and the questions to settle before hiring.";
const path = "/after-school-nanny";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "What does an after-school nanny do?", answer: "An after-school nanny can collect children from school or care, prepare an agreed snack, supervise play and homework, take children to activities and complete a parent handover. The exact duties, transport and finish time should be agreed before the role starts." },
  { question: "Can a nanny collect my child from school?", answer: "Often, if the family, school and nanny have completed the required collection authority and transport arrangements. Confirm the school’s process, authorised contacts, car-seat needs, vehicle use, emergency plans and what happens if a child is not at the pickup point." },
  { question: "Do after-school nannies work school holidays?", answer: "Some do, but it should not be assumed. Discuss term-time hours, school-holiday availability, public holidays, notice for changes and any different duties or pay before confirming the role." },
  { question: "How much does after-school nanny care cost?", answer: "Cost depends on the hours, the number and ages of children, pickup and travel duties, location, experience, holiday cover and whether the role offers regular guaranteed hours. Build a budget around the full weekly arrangement rather than one short shift." },
  { question: "What should I ask an after-school nanny in an interview?", answer: "Ask about school pickup experience, traffic and transport judgment, snacks and homework, sibling conflict, after-school energy levels, communication, holiday availability and how they would handle a changed pickup plan." },
];

export default function AfterSchoolNannyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-11-14" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "After-School Nanny Care", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="After-school childcare guide"
      title={title}
      description={description}
      imageTags={["real-learning-play", "after-school", "nanny", "family", "home"]}
      imageSeed="after-school-nanny"
      highlights={["Plan pickup and transport", "Build a calm afternoon routine", "Agree holiday cover", "Prepare a safe handover"]}
      toc={[
        { id: "what-after-school-care-includes", label: "What the role can include" },
        { id: "build-the-afternoon", label: "Build the afternoon plan" },
        { id: "pickup-and-transport", label: "Pickup and transport" },
        { id: "cost-and-hours", label: "Costs and hours" },
        { id: "how-to-hire", label: "How to hire" },
        { id: "holiday-cover", label: "School-holiday cover" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and compare availability against your school-week brief." },
        { href: "/nanny-cost", label: "Nanny cost guide", description: "Budget for regular hours, travel and the full employment arrangement." },
        { href: "/babysitting-rates-nz", label: "Babysitting rates NZ", description: "Plan occasional backup care separately from a weekly role." },
        { href: "/nanny-interview-questions", label: "Interview questions", description: "Ask structured questions about judgment, communication and fit." },
        { href: "/nanny-safety", label: "Nanny safety", description: "Prepare collection authorities, emergency details and your home." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Record hours, duties, transport and holiday expectations in writing." },
      ]}
      ctaTitle="Make afternoons easier to manage"
      ctaBody="Write a clear school-week brief, then use the directory to compare profiles against the hours and care responsibilities your family needs."
    >
      <GuideSection id="what-after-school-care-includes" title="What after-school nanny care can include" intro={<Prose>After-school care is often the bridge between the end of a school day and a parent arriving home. A good plan gives children a predictable afternoon while making the role workable for the caregiver.</Prose>}>
        <Prose>The role may include school or early-learning pickup, a snack, outdoor play, homework support, activities, bath time, simple child-related tidying and a parent handover. It may also be deliberately simple: a warm welcome home, safe supervision and time to decompress. The right list depends on your children, their energy after school and the time available.</Prose>
        <InfoCard title="Keep the role child-centred" tone="soft">An after-school nanny is not automatically a household manager. If you need adult errands, full-house cleaning or complex administration, discuss those tasks separately, allow realistic time and agree the pay accordingly.</InfoCard>
      </GuideSection>

      <GuideSection id="build-the-afternoon" title="Build an afternoon routine that works for children" intro={<Prose>Children often arrive home hungry, tired or ready to talk. The routine does not need to be strict, but it helps when the nanny knows what matters most to your family.</Prose>}>
        <Checklist items={[
          "A clear pickup time, collection point and backup adult if plans change.",
          "An agreed snack, allergy information and kitchen rules.",
          "A calm transition home before homework, activities or screen time.",
          "Child-specific expectations for homework, reading, play, chores and siblings.",
          "A short parent handover: what happened, what needs follow-up and any changes for tomorrow.",
        ]} />
        <Prose>Ask children what makes an afternoon feel good for them as well. Their input can help a family avoid designing a schedule that is efficient for adults but exhausting for the child.</Prose>
      </GuideSection>

      <GuideSection id="pickup-and-transport" title="School pickup and transport need their own plan" intro={<Prose>Pickup is one of the highest-responsibility parts of an after-school role. Do not leave it to a quick verbal handover on the first day.</Prose>}>
        <Steps items={[
          { title: "Confirm collection authority", body: "Follow the school or early-learning service’s own process for authorised adults, contacts and any photo identification it requires. Update it whenever the arrangements change." },
          { title: "Agree the transport method", body: "Confirm walking, public transport, a nanny’s vehicle or a family vehicle; then agree car seats, licences, insurance, parking, routes and approved mileage or expenses." },
          { title: "Write the exceptions plan", body: "Cover a child who is absent, a late school event, severe weather, a delayed parent or an unfamiliar person at pickup. Give the nanny permission to pause and call rather than guess." },
          { title: "Share the handover routine", body: "Show where bags, medication, sports gear and contact details go, and decide how the nanny will update you after pickup." },
        ]} />
        <Prose>The <Link href="/nanny-safety" className="text-primary underline underline-offset-2 font-semibold">nanny safety guide</Link> has a broader first-day checklist for emergency information, home safety and boundaries.</Prose>
      </GuideSection>

      <GuideSection id="cost-and-hours" title="After-school nanny costs and hours" intro={<Prose>Short afternoon shifts can be a great fit for a family, but the budget still needs to reflect the full job. Travel, a fixed daily window and school-holiday cover can be as important as the time spent in the home.</Prose>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Regular term-time hours"><Prose>Be clear about the days, earliest possible pickup, usual finish time and the hours you can genuinely guarantee. Predictability helps both sides plan.</Prose></InfoCard>
          <InfoCard title="Holidays and closure days"><Prose>Ask early whether care is needed in school holidays, teacher-only days, sick days or unexpected closures. These are not automatic extensions of a term-time schedule.</Prose></InfoCard>
          <InfoCard title="Travel and activities"><Prose>Agree who provides the vehicle, car seats, petrol, mileage, parking, activity fees and spending approvals before the role starts.</Prose></InfoCard>
          <InfoCard title="Pay and employment setup"><Prose>For a regular role, consider the full arrangement—pay, paid hours, leave and payroll responsibilities—not only one after-school shift.</Prose></InfoCard>
        </div>
        <Prose>Use the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> for a full employment budget. If your need is only occasional backup, the <Link href="/babysitting-rates-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rates guide</Link> can help you structure a defined booking.</Prose>
      </GuideSection>

      <GuideSection id="how-to-hire" title="How to hire an after-school nanny" intro={<Prose>A clear brief helps you find someone whose availability and experience match the real school-week rhythm, rather than trying to make a near-match work after the fact.</Prose>}>
        <Steps items={[
          { title: "Write the week on one page", body: "Include the children’s ages, school or care locations, pickup times, term dates, activities, home location, transport requirements and when a parent usually arrives home." },
          { title: "Shortlist against the non-negotiables", body: <>Use <Link href="/find-a-nanny" className="text-primary underline underline-offset-2 font-semibold">NannyOra’s directory</Link> to review profiles. Check stated availability and experience, then discuss the role directly; a profile does not guarantee a particular schedule is available.</> },
          { title: "Interview for real situations", body: <>Use the <Link href="/nanny-interview-questions" className="text-primary underline underline-offset-2 font-semibold">nanny interview questions</Link> to ask how the candidate would handle a missing child at pickup, sibling conflict, a late parent or an activity change.</> },
          { title: "Agree the role in writing", body: <>Record hours, duties, transport, expenses, communication, school holidays and changes in a <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny agreement</Link>.</> },
        ]} />
      </GuideSection>

      <GuideSection id="holiday-cover" title="Plan school-holiday and backup care before you need it" intro={<Prose>School holidays are often where an otherwise successful after-school arrangement needs a different plan. The nanny may be available for longer days, may not be available, or may need a revised role and schedule.</Prose>}>
        <Prose>Discuss term-time and school-holiday care during the hiring process, including activity budgets, transport, additional children, changes to work-from-home arrangements and how much notice each side needs. For a new or changed arrangement, revisit the agreement and pay rather than assuming “flexible” covers everything.</Prose>
      </GuideSection>
    </EditorialGuide>
  );
}
