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

const title = "Nanny Safety Checklist for NZ Families";
const description = "Practical nanny safety guidance for NZ families: vetting, handovers, emergencies, first aid, safe sleep, transport and medication.";
const path = "/nanny-safety";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: "article" },
};

const faqs: GuideFaq[] = [
  { question: "How can I make sure a nanny is safe?", answer: "Use layered vetting, structured interviews, relevant references and a paid trial; choose clear employment terms; prepare the home and emergency handover; and keep reviewing how the arrangement works. No Police vet, certificate, agency or platform can guarantee future safety by itself." },
  { question: "Should a nanny have first aid training?", answer: "Current child-focused first aid training is a strong safety requirement for most nanny roles, especially sole-charge, infant, allergy, pool, travel or remote care. Verify the claimed certificate and discuss how the nanny keeps skills current. Training does not replace calling 111 in an emergency." },
  { question: "What emergency information should I leave for a nanny?", answer: "Provide the child’s full name and date of birth, home address, parent and backup contacts, health provider details, allergies, diagnoses, medication instructions, care plans, consent boundaries, insurance details if relevant, and when to call 111. Add exits, alarms, first aid supplies and the family meeting point." },
  { question: "When should a nanny call 111?", answer: "Health New Zealand says to call 111 and ask for an ambulance for urgent medical help, including difficulty breathing, choking, unconsciousness, severe bleeding, anaphylaxis, severe burns or other life-threatening concerns. The nanny should not delay emergency help while waiting for a parent to answer." },
  { question: "What are the safe sleep basics for a baby?", answer: "Current Plunket guidance says place pēpi on their back for every sleep, with their face clear, in their own flat, firm sleep space made for babies, without pillows, toys or loose items around the face. Give the nanny your current care plan and authoritative guidance." },
  { question: "Can a nanny drive my child?", answer: "Yes when the family has verified the licence and agreed on the driver, vehicle, insurance, trips and restraints. New Zealand law requires an approved child restraint until age seven and use at age seven when one is available; the driver is responsible for correct restraint." },
  { question: "Should I use a nanny camera?", answer: "If monitoring is used, disclose it, explain its purpose and handle recordings lawfully and securely. Cameras can document a limited view but do not replace vetting, communication, safe systems or respect for privacy. Never place cameras in intimate or private areas." },
  { question: "What should I do if my child says something worrying about a nanny?", answer: "Stay calm, listen without leading questions, record the child’s own words and act according to the level of risk. If a child may be in immediate danger, separate them from the risk and contact emergency services. Seek appropriate safeguarding or professional advice rather than investigating the child yourself." },
];

const safetySetup = [
  { title: "Choose with evidence", body: "Define the role, review NannyOra’s visible profile status, interview consistently, complete relevant references and checks, and use a short paid trial before regular sole-charge care." },
  { title: "Agree responsibilities", body: "Put hours, duties, transport, privacy, emergency authority and communication expectations into a clear written agreement and home guide." },
  { title: "Prepare the environment", body: "Walk through hazards, exits, alarms, safe sleep spaces, pools, pets, keys, first aid supplies, medicines, car restraints and authorised collection people." },
  { title: "Practise the handover", body: "Make sure the nanny can find the address, contacts and care plans quickly, knows when 111 comes first and can manage the other children during an incident." },
  { title: "Keep safety active", body: "Use daily handovers, incident records and planned reviews. Revisit the system when the child develops, the home changes or the role expands." },
];

export default function NannySafetyPage() {
  const schemas = [
    articleSchema({ headline: title, description, path, datePublished: "2026-08-21" }),
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find a Nanny", path: "/find-a-nanny" }, { name: "Nanny Safety", path }]),
    faqSchema(faqs),
  ];

  return (
    <EditorialGuide
      eyebrow="NannyOra family safety guide"
      title={title}
      description={description}
      imageTags={["safety", "trusted", "nanny", "childcare"]}
      imageSeed="nanny-safety-nz"
      highlights={["First-day checklist", "Emergency planning", "Safe sleep and transport", "Shared responsibility"]}
      toc={[
        { id: "shared-system", label: "A shared safety system" },
        { id: "before-first-day", label: "Before the first day" },
        { id: "emergency-plan", label: "Emergency plan" },
        { id: "health-medication", label: "Health and medication" },
        { id: "safe-sleep", label: "Baby safe sleep" },
        { id: "transport-outings", label: "Transport and outings" },
        { id: "privacy-boundaries", label: "Privacy and boundaries" },
        { id: "ongoing-safety", label: "Ongoing review" },
      ]}
      schemas={schemas}
      faqs={faqs}
      related={[
        { href: "/nanny-vetting", label: "Nanny vetting", description: "Understand the evidence layers behind a safer hiring decision." },
        { href: "/nanny-interview-questions", label: "Nanny interview questions", description: "Use realistic safety and emergency scenarios in the interview." },
        { href: "/nanny-contract", label: "Nanny contract", description: "Record safety, privacy, transport and reporting expectations." },
        { href: "/trust-and-safety", label: "NannyOra trust and safety", description: "Read the platform’s verification levels and shared responsibilities." },
        { href: "/verification-process", label: "Verification process", description: "See how NannyOra reviews evidence before deeper status is shown." },
        { href: "/find-a-nanny", label: "Find a nanny", description: "Browse profiles and inspect each candidate’s verification information." },
      ]}
      ctaTitle="Safer care starts before the first booking"
      ctaBody="Find a suitable nanny, review the evidence shown on their profile and create a clear home safety handover before care begins."
    >
      <GuideSection
        id="shared-system"
        title="Nanny safety is a shared system, not a badge"
        intro={<Prose>Safe in-home childcare depends on the person, the household and the way they work together. Vetting reduces uncertainty about a candidate. Parents then need to provide accurate information, a reasonably safe environment and clear authority. The nanny needs to follow agreed plans, use professional judgment and report concerns.</Prose>}
      >
        <Prose>
          A Police vet is valuable but point in time. A first aid certificate shows training but not how someone will respond under pressure. A good paid trial shows real interaction but only for a short window. Safety becomes stronger when those signals are combined with clear routines, appropriate supervision, an emergency plan and ongoing communication.
        </Prose>
        <Steps items={safetySetup} />
        <InfoCard title="Read the individual NannyOra profile" tone="soft">
          NannyOra displays different verification levels. A Listed profile does not mean the same thing as Premium Vetted or Specialist Care. Check which evidence is actually marked verified, then complete the family-led interview, trial and hiring steps. Start with the <Link href="/nanny-vetting" className="text-primary underline underline-offset-2 font-semibold">complete nanny vetting guide</Link>.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="before-first-day"
        title="Safety checklist before the nanny’s first day"
        intro={<Prose>Do a physical walk-through. A document cannot show where the stopcock is, which gate does not latch properly or how the alarm behaves. Invite the nanny to identify hazards as well.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Home access and exits">
            Demonstrate locks, keys, alarm, smoke alarms, exits, fire extinguisher or blanket if present, earthquake supplies, family meeting point and which neighbours can help.
          </InfoCard>
          <InfoCard title="Child-level hazards">
            Check stairs, windows, blind cords, water, pools, balconies, furniture, heaters, fireplaces, outlets, choking items, button batteries, cleaning products, medicines and pet interactions.
          </InfoCard>
          <InfoCard title="Authorised people">
            List who may enter, collect or receive information about the child. Provide a verification method and a rule for unexpected visitors or collection requests.
          </InfoCard>
          <InfoCard title="Digital and household systems">
            Explain Wi-Fi, necessary apps, device rules and any disclosed cameras. Do not share unrelated financial credentials or more access than the role needs.
          </InfoCard>
        </div>
        <Subheading>Prepare one accessible home guide</Subheading>
        <Checklist items={[
          "The home address written exactly as emergency services need it.",
          "Parent contacts and at least one nearby backup adult.",
          "Each child’s full name, date of birth, health details and relevant identifiers.",
          "Allergies, diagnoses, warning signs and current written care plans.",
          "Food, sleep, toileting, school, screen and behaviour guidance.",
          "Emergency exits, first aid supplies, alarms and utility information.",
          "Authorised collection people, school contacts and verification rules.",
          "Transport permissions, approved destinations and car-restraint instructions.",
          "When to contact a parent, Healthline, a health provider or 111.",
        ]} />
        <Prose>
          Keep the guide current and protect sensitive information. Provide enough for safe care, limit access to people who need it and recover paper or digital copies when the arrangement ends.
        </Prose>
      </GuideSection>

      <GuideSection
        id="emergency-plan"
        title="Create an emergency plan a nanny can use under pressure"
        intro={<Prose>In a real emergency, the nanny should not need to search old messages for the address or wonder whether the parent permits an ambulance. Put urgent actions on one clear page and rehearse where it is kept.</Prose>}
      >
        <Subheading>When 111 comes first</Subheading>
        <Prose>
          Health New Zealand says to call 111 and ask for an ambulance when someone needs urgent medical help—for example, difficulty breathing, choking, unconsciousness, severe bleeding, anaphylaxis, a severe burn or other life-threatening concern. The nanny should make the child safe, call emergency services and follow the dispatcher’s instructions; parental contact should not delay that call. Review <SourceLink href="https://info.health.nz/health-topics/tests-and-treatments/emergencies-and-first-aid/emergency-medical-help">Health New Zealand’s emergency guidance</SourceLink>.
        </Prose>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Information for the call">
            Exact address and access instructions; what happened; the child’s age; their condition; relevant allergy or medical information; first aid already given; and a phone number that will stay free.
          </InfoCard>
          <InfoCard title="While help is coming">
            Follow the dispatcher, keep the child and other children safe, send someone to meet responders if possible, gather the care plan or medicines, and update 111 if the condition changes.
          </InfoCard>
        </div>
        <Subheading>Plan beyond medical emergencies</Subheading>
        <Checklist items={[
          "Fire, smoke, gas smell or carbon-monoxide concern.",
          "Earthquake, flooding, severe weather or an evacuation order.",
          "A missing child or an unauthorised collection attempt.",
          "Vehicle crash, breakdown or car-restraint failure.",
          "A parent who cannot be reached after the agreed finish time.",
          "A threatening visitor, family-violence concern or unsafe adult at the home.",
          "Loss of power, water, heating or secure access that makes care unsafe.",
        ]} />
        <InfoCard title="First aid supports emergency care—it does not replace it" tone="important">
          Verify current child-focused first aid where the role requires it, especially for sole-charge, infant, allergy, pool, overnight or travel care. The nanny should stay within their training and follow 111 instructions rather than delaying help to contact a parent.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="health-medication"
        title="Health information, allergies and medication"
        intro={<Prose>Share accurate, current information before the nanny needs it. Verbal instructions alone are fragile when a dose, time or warning sign matters.</Prose>}
      >
        <Checklist items={[
          "Use a written plan from the appropriate health professional for serious allergies, asthma, seizures, diabetes or other significant conditions.",
          "Keep medicines in original labelled packaging and store them as directed and out of children’s reach.",
          "Define exactly which medicines the nanny is authorised to give and under what written instruction.",
          "Record the medicine, dose, time, reason and person who administered it.",
          "Explain warning signs, escalation steps and when the child should not attend an activity or school.",
          "Update the nanny immediately when a medicine, dose, diagnosis or care plan changes.",
          "Give the nanny permission to call Healthline or the child’s provider for non-emergency guidance where appropriate.",
        ]} />
        <InfoCard title="Avoid improvised consent" tone="soft">
          A text saying “give them something if needed” is not a safe medication protocol. Name the product, dose, route, timing, reason, storage and escalation rule, and confirm what must be documented. For medical decisions, follow the child’s clinician or pharmacist rather than an online childcare guide.
        </InfoCard>
      </GuideSection>

      <GuideSection
        id="safe-sleep"
        title="Safe sleep for babies in nanny care"
        intro={<Prose>Every caregiver should follow the same current safe-sleep plan for every sleep. Do not assume that an experienced nanny uses the same guidance your whānau has received—show the sleep space and discuss it directly.</Prose>}
      >
        <Checklist items={[
          "Place pēpi on their back for every sleep.",
          "Keep their face clear of pillows, toys, loose blankets and other soft items.",
          "Use their own flat, firm sleep space made for babies, such as a compliant cot, bassinet, wahakura or Pēpi-Pod®.",
          "Do not use couches, chairs, pillows or other improvised sleep surfaces.",
          "Move a sleeping baby from a car seat or capsule to a safe sleep space after travel.",
          "Keep the sleep environment smoke-, vape-, alcohol- and drug-free.",
          "Explain room temperature, clothing, monitoring and what to do when the baby’s usual pattern changes.",
        ]} />
        <Prose>
          These points reflect the current <SourceLink href="https://www.plunket.org.nz/caring-for-your-child/safe-sleep/foundations-for-safe-sleep/">Whānau Āwhina Plunket foundations for safe sleep</SourceLink>. Follow the advice provided for your baby by your midwife, doctor or Plunket nurse, and update the nanny as the baby rolls, becomes mobile or moves sleep spaces.
        </Prose>
      </GuideSection>

      <GuideSection
        id="transport-outings"
        title="Safer transport, school pickups and outings"
        intro={<Prose>Transport creates responsibilities that should be settled before anyone puts a child in a vehicle. Verify the driver, vehicle, restraint and permission—not only the destination.</Prose>}
      >
        <Checklist items={[
          "Verify the nanny’s current licence and any conditions relevant to the vehicle.",
          "Agree whether the family car or nanny’s car may be used and confirm suitable insurance.",
          "List approved regular journeys and how one-off trips are authorised.",
          "Install an approved restraint that fits the child and vehicle, and make sure the driver can use it correctly.",
          "Provide school and activity pickup authority and a method for identity checks.",
          "Set rules for fuel, mileage, parking, tolls, breakdowns, infringements and crashes.",
          "Agree on weather, water, playground, sunscreen, headcount and public-transport routines.",
          "Require a safe stop before the nanny reads or sends non-emergency messages.",
        ]} />
        <Prose>
          NZ Transport Agency says children must use an approved child restraint until their seventh birthday; a seven-year-old must use one when available, and the driver is responsible for correct restraint. NZTA also recommends continuing a suitable child restraint or booster until the child reaches 148 cm. Check the <SourceLink href="https://www.nzta.govt.nz/travelling-on-our-roads/keeping-children-safe/child-restraints/requirements-for-using-child-restraints">current child-restraint requirements</SourceLink> and the manufacturer’s limits.
        </Prose>
      </GuideSection>

      <GuideSection
        id="privacy-boundaries"
        title="Privacy, household cameras and professional boundaries"
        intro={<Prose>In-home care gives a nanny access to family life, while the nanny works inside a private home. Clear, proportionate boundaries protect both sides.</Prose>}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoCard title="Children’s information">
            Limit health, school, location and family information to what is needed for care. Use secure channels and do not allow public posts or location tagging without explicit permission.
          </InfoCard>
          <InfoCard title="Photos and devices">
            Agree whether photos may be taken, on which device, how they may be shared with parents and when they must be deleted. Never use children’s images for a portfolio without specific consent.
          </InfoCard>
          <InfoCard title="Household monitoring">
            Disclose cameras and explain their purpose, location, access and retention. Monitoring should be lawful, proportionate and never placed in intimate spaces.
          </InfoCard>
          <InfoCard title="Personal boundaries">
            Define visitors, phone use, smoking and vaping, impairment, gifts, social contact, physical privacy, personal errands and contact with children after employment ends.
          </InfoCard>
        </div>
        <Prose className="mt-6">
          Record durable expectations in the <Link href="/nanny-contract" className="text-primary underline underline-offset-2 font-semibold">nanny contract</Link> and place operational details in the home guide. Parents should model the same respectful communication and privacy they expect from the nanny.
        </Prose>
      </GuideSection>

      <GuideSection
        id="ongoing-safety"
        title="Keep reviewing safety after care begins"
        intro={<Prose>Vetting and induction happen at the start; safety continues every day. A healthy arrangement makes it easy to report a small concern before it becomes a pattern.</Prose>}
      >
        <Subheading>Use a simple feedback rhythm</Subheading>
        <Checklist items={[
          "A brief handover after each shift: food, sleep, toileting, mood, activities, medicine and incidents.",
          "A planned check-in after the first week and first month.",
          "Immediate discussion of injuries, near misses, lost items, transport events or unexpected visitors.",
          "Age-appropriate, neutral conversations with the child about their day.",
          "Periodic review of first aid, licence, relevant registrations and profile information.",
          "A new risk walk-through after moving home, changing vehicles, adding a pool or welcoming another child or pet.",
        ]} />
        <Subheading>Respond proportionately to concerns</Subheading>
        <Prose>
          A minor misunderstanding may need clarification, coaching and a written update. Repeated boundary breaches, dishonesty about checks, unsafe transport, impairment, rough handling, unexplained injuries or a child’s concerning disclosure require a stronger response. Preserve relevant records, prioritise the child and seek appropriate professional or legal advice.
        </Prose>
        <InfoCard title="If there may be immediate danger" tone="important">
          Separate the child from the immediate risk and contact 111 when urgent Police, Fire or ambulance help is needed. Do not wait for NannyOra support before protecting a child. Once urgent safety is addressed, report the concern through the appropriate platform, employment and safeguarding channels.
        </InfoCard>
      </GuideSection>
    </EditorialGuide>
  );
}
