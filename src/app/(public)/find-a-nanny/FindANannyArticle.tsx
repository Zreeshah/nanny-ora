import "server-only";
import Link from "next/link";
import {
  ArrowRight, Check, ShieldCheck, Heart, Users, MessageCircle, Fingerprint,
  PhoneCall, Video, GraduationCap, CalendarCheck, Sparkles, AlertCircle,
  LifeBuoy, MapPin, Briefcase, BookOpen, Scale, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageBand } from "@/components/ui/ImageBand";
import { ShinyText } from "@/components/ui/ShinyText";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo";
import { NannyTiers } from "@/components/pricing/NannyTiers";
import { Accordion } from "@/components/ui/Accordion";
import FindANannyClient from "./FindANannyClient";
import type { NannyProfilePublic } from "@/types";

// =====================================================================
// Pillar article for /find-a-nanny. Content faithfully follows the SEO
// brief (nannyora-hire-a-nanny.md). The interactive directory sits in
// the middle of the article flow — exactly where the brief placed the
// `<!-- EXISTING UI -->` markers. Sections before the directory explain
// verification + how matching works; sections after it cover choosing,
// hiring, cost, NZ legal responsibilities, FAQ, and next-step CTAs.
// =====================================================================

/* ---------- small layout helpers (kept local — used only here) ---------- */

function Article({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {children}
    </div>
  );
}

function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-heading text-2xl sm:text-3xl text-foreground mb-5 mt-16 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="font-heading text-xl text-foreground mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 ${className}`}>
      {children}
    </p>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/80 leading-relaxed">
      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 stroke-[2.5]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Callout({
  title,
  tone = "info",
  children,
}: {
  title?: React.ReactNode;
  tone?: "info" | "warn";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 mb-8 ${
        tone === "warn"
          ? "bg-amber-50/70 border border-amber-200/60"
          : "bg-primary/[0.04] border border-primary/15"
      }`}
    >
      {title && (
        <div
          className={`flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider ${
            tone === "warn" ? "text-amber-700" : "text-primary"
          }`}
        >
          {tone === "warn" ? (
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          )}
          {title}
        </div>
      )}
      <div className="text-sm text-foreground/80 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/* ---------- structured content arrays (kept verbatim from brief) ---------- */

const TAKEAWAYS = [
  "A nanny provides in-home childcare shaped around one family’s children, routines and schedule.",
  "The best match depends on your child’s age, required hours, duties, location and any specialist needs—not on experience alone.",
  "A Police vet is valuable but is only a point-in-time check. Identity, interviews, referee calls, qualification checks, a paid trial and ongoing communication matter too.",
  "NannyOra displays verification levels. Read the badge and completed checks on each profile rather than assuming every listed profile has the same status.",
  "Many regular nanny arrangements are employment relationships. Use a written agreement and confirm minimum pay, leave, breaks, record-keeping, tax, KiwiSaver and ACC responsibilities before care starts.",
  "NannyOra currently serves greater Auckland. Hamilton, Christchurch and Wellington are future expansion areas, not current service promises.",
];

const WHY_FAMILIES = [
  { icon: ShieldCheck, title: "Visible trust signals", body: "Profiles show verification levels and completed checks, so you can distinguish a listed profile from one with deeper vetting." },
  { icon: PhoneCall, title: "Direct referee contact", body: "NannyOra’s verification process includes speaking with previous families or employers instead of relying only on uploaded letters." },
  { icon: ShieldCheck, title: "NZ Police vetting", body: "Relevant verification levels include a Police vet obtained for NannyOra. Police reports are specific to the requesting service and role; an old report from somewhere else is not a substitute." },
  { icon: Sparkles, title: "Specialist care filters", body: "Families can look for ECE experience, registered teachers, newborn care, sensory-aware support, neurodiverse experience and other relevant skills." },
  { icon: CalendarCheck, title: "A fit check before commitment", body: "A short paid trial lets you observe real interaction with your child." },
  { icon: LifeBuoy, title: "Ongoing support", body: "NannyOra provides a platform for discovery, enquiries and feedback after matching." },
];

const VERIFICATION_STEPS = [
  { icon: Fingerprint, title: "Identity verification", body: "using government photo identification." },
  { icon: Video, title: "Video or in-person interview", body: "to assess communication, warmth and approach to care." },
  { icon: PhoneCall, title: "Reference calls", body: "with previous families or employers." },
  { icon: ShieldCheck, title: "NZ Police vetting", body: "for the relevant verification level." },
  { icon: GraduationCap, title: "Qualification review", body: "for claimed ECE, teaching, first aid or specialist credentials." },
  { icon: CalendarCheck, title: "Short paid trial", body: "so the family can see the nanny and child together." },
  { icon: MessageCircle, title: "Ongoing parent feedback", body: "after a match begins." },
];

const MATCHING_STEPS = [
  { title: "Tell us what you need", body: "Share your children’s ages, location, schedule, duties and any specialist support." },
  { title: "Browse local profiles", body: "Use filters to compare relevant, available Auckland nannies." },
  { title: "Enquire and meet", body: "Shortlist candidates, ask questions and arrange a video call or coffee meeting." },
  { title: "Trial and arrange care", body: "Complete a paid trial, agree employment terms and begin care with clear expectations." },
];

const PROFILE_LOOKS = [
  "A verification badge and a clear list of completed checks",
  "Recent, relevant experience with your child’s age group",
  "Availability that matches the actual start and finish times",
  "A rate within your total employment budget",
  "First aid readiness and any required professional qualifications",
  "Driver licence and vehicle information if transport is part of the role",
  "A care philosophy that fits your family’s values and your child’s temperament",
  "Specific examples rather than broad claims such as “great with children”",
];

const NANNY_TYPES = [
  { title: "Full-time nanny", best: "Families needing care across most working days", q: "Weekly hours, overtime, leave coverage and the full employment budget" },
  { title: "Part-time nanny", best: "Set days, shorter weeks or shared care with preschool/whānau", q: "Guaranteed hours, schedule changes and whether another role can fit alongside yours" },
  { title: "Live-in nanny", best: "Families needing agreed flexibility and able to provide suitable accommodation", q: "Privacy, off-duty time, accommodation terms, visitors and lawful deductions" },
  { title: "Live-out nanny", best: "Most regular arrangements where the nanny travels to the family home", q: "Commute, punctuality, parking and travel during work" },
  { title: "Newborn nanny", best: "Early weeks or months, postnatal adjustment and newborn routines", q: "Newborn experience, safe sleep, feeding support and parent-led preferences" },
  { title: "Infant nanny", best: "Babies needing responsive feeds, naps, play and developmental care", q: "Infant first aid, mobility safety, solids and daily records" },
  { title: "Toddler nanny", best: "Active children developing language, movement and boundaries", q: "Outdoor play, toileting, behaviour guidance and safe exploration" },
  { title: "After-school nanny", best: "School pickup, activities, homework and afternoon care", q: "Vehicle use, school permissions, term-time hours and holiday coverage" },
  { title: "Weekend nanny", best: "Regular weekend work, events or parents with non-standard rosters", q: "Start/finish times, public holidays and how often work is guaranteed" },
  { title: "Emergency / backup nanny", best: "Gaps caused by illness, closures or an unavailable regular caregiver", q: "Notice, minimum booking, medical information and emergency authority" },
  { title: "Night nanny", best: "Newborn nights, overnight supervision or short-term family support", q: "Whether the nanny is awake or sleeping, breaks, duties, handovers and safe sleeping space" },
  { title: "Travel nanny", best: "Work trips, holidays or events away from home", q: "Travel time, expenses, accommodation, off-duty time, insurance and documentation" },
  { title: "Special needs nanny", best: "Children needing individual, disability-informed or neurodiverse support", q: "Relevant experience, boundaries, care plans and coordination with specialists" },
];

const HIRING_STEPS = [
  {
    title: "Write a Family Care Brief",
    body: ["List the essentials before looking at profiles: children’s ages and routines; days, start and finish times, proposed start date; work location and whether a parent works from home; core childcare duties; school, activity or appointment transport; vehicle and driver requirements; pets and household factors; specialist skills, language or qualification requirements; expected role duration; realistic pay and employment budget."],
    tip: "Separate “must have” from “nice to have”. A candidate who matches five crucial needs is usually a better shortlist than someone with a longer CV but the wrong availability.",
  },
  {
    title: "Search Relevant Profiles",
    body: ["Use NannyOra’s filters to search by suburb, care type, age experience, availability, language, ECE background, first aid, driver licence and specialist care. Read the whole profile and check the verification level."],
    tip: "Do not shortlist solely on hourly rate. A low advertised rate does not resolve a schedule mismatch, insufficient infant experience or missing transport requirements.",
  },
  {
    title: "Shortlist Consistently",
    body: ["Compare every candidate against the same five to seven criteria: schedule and location fit; relevant age-group experience; verified checks and references; communication and care philosophy; required transport or specialist skills; rate and employment expectations; availability for a paid trial."],
    tip: "Keep personal bias out of the process. Do not ask discriminatory questions about pregnancy, relationship status, religion, ethnicity, disability or other protected characteristics. Ask only what is genuinely connected to safe performance of the role.",
  },
  {
    title: "Interview for Real Situations",
    body: ["Begin with a video call, then meet in person before making an offer. Ask open questions that reveal judgment: “Tell me about a difficult transition you helped a child through,” “What would you do if my toddler refused lunch and then became upset?”, “How do you plan a day with a baby whose naps are changing?”, “How do you handle differences between a parent’s approach and your own?”, “What information would you share at the end of each day?”, “What would make you call me immediately rather than wait for handover?”, “Which duties do you consider outside a standard nanny role?”"],
    tip: "Give the candidate space to interview you. Experienced nannies will want clarity about hours, expectations, parenting style, guaranteed pay, leave and how the family communicates.",
  },
  {
    title: "Complete Checks and a Paid Trial",
    body: ["Read the candidate’s NannyOra badge and check what has actually been completed. A Listed Nanny profile is not the same as a Premium Vetted or Specialist Care profile. Review identity, Police vetting, referee feedback, qualifications, first aid and work history as appropriate."],
    tip: "Observe during a paid trial whether the nanny greets and engages your child without forcing interaction, notices safety issues, follows your instructions while using sound judgment, communicates calmly, respects the home and privacy, responds appropriately when the child is unsure or dysregulated, and asks useful questions. A trial is paid work — agree time, rate, duties, supervision and emergency contacts in advance.",
  },
  {
    title: "Make an Offer and Sign the Agreement",
    body: ["Put the proposed pay, hours, start date, place of work, duties and employment type in writing. The final employment agreement should cover at least: parties and job title; permanent, fixed-term or casual status, correctly chosen; hours, guaranteed hours and schedule-change process; pay cycle, method, overtime and agreed expenses; children’s duties and any additional household tasks; leave and public holiday treatment; rest and meal breaks; vehicle use, mileage and insurance expectations; confidentiality, photos and social media; health, medication and emergency authority; notice, problem resolution and termination; any lawful trial or probationary period."],
    tip: "Both parties should have a reasonable opportunity to review the agreement and get advice. Sign it before work begins—especially if it contains a trial period.",
  },
  {
    title: "Set Up the First Month",
    body: ["Give your nanny a written home guide with routines, allergies, medication instructions, emergency contacts, approved transport, screen rules, food guidance and who may collect the child. Show them exits, first aid supplies, alarms, car seats and any hazards."],
    tip: "Use short daily handovers and a scheduled check-in after the first week, first month and end of any agreed trial or probationary period. Raise small concerns early and respectfully.",
  },
];

const HIRING_MISTAKES = [
  "Starting before checks or the agreement are complete",
  "Calling a regular nanny a contractor without testing the real legal relationship",
  "Treating a Police vet as a complete safety guarantee",
  "Adding general housekeeping after the role starts",
  "Advertising “flexible hours” without minimum or guaranteed hours",
  "Assuming an experienced nanny automatically understands your family’s preferences",
  "Failing to plan for sickness, leave or centre/school holidays",
  "Leaving travel, mileage, car seats or insurance vague",
  "Ignoring how the child responds during the trial",
];

const CHILDCARE_COMPARE = [
  { option: "Nanny", setting: "Your home and community", personalisation: "High; focused on your children", flexibility: "High when agreed in advance", social: "Playgroups, parks, classes", role: "Often significant; confirm worker status and obligations" },
  { option: "Daycare / centre", setting: "Group centre", personalisation: "Shared across the group", flexibility: "Fixed operating hours", social: "Regular peer group", role: "Usually none; family buys a service" },
  { option: "Babysitter", setting: "Usually your home", personalisation: "Individual, short term", flexibility: "Good for occasional bookings", social: "Limited during the booking", role: "Depends on the real arrangement" },
  { option: "Au pair", setting: "Lives with the family", personalisation: "High", flexibility: "Flexible within lawful boundaries", social: "Family and community based", role: "Host/immigration responsibilities can be complex" },
  { option: "Licensed home-based ECE", setting: "Educator’s or child’s home", personalisation: "Small-group or individual", flexibility: "Depends on service hours", social: "Small group may be available", role: "Service structure differs from a private nanny placement" },
];

const NANNYORA_VS = [
  { need: "Search by childcare need, age, suburb and specialty", us: "Built-in filters", fb: "Depends on post detail", cls: "Usually limited" },
  { need: "Verification status shown", us: "Profile level and completed checks displayed", fb: "Usually self-reported", cls: "Usually self-reported" },
  { need: "Police vetting pathway", us: "Included in relevant NannyOra verification levels", fb: "Family must arrange or verify", cls: "Family must arrange or verify" },
  { need: "Reference checking", us: "Direct referee contact in the verification process", fb: "Family-led", cls: "Family-led" },
  { need: "Specialist care discovery", us: "Dedicated ECE, sensory and neurodiverse filters", fb: "Inconsistent", cls: "Inconsistent" },
  { need: "Platform support", us: "Profiles, enquiries, job posts, booking pathway", fb: "Group moderation varies", cls: "Listing support varies" },
  { need: "Final interview and hiring decision", us: "Family", fb: "Family", cls: "Family" },
  { need: "Employer and payroll responsibility", us: "Family, subject to the arrangement", fb: "Family, subject to the arrangement", cls: "Family, subject to the arrangement" },
];

const COST_FACTORS = [
  { icon: Briefcase, label: "Experience", body: "Years in professional childcare and depth of directly relevant experience" },
  { icon: GraduationCap, label: "Qualifications", body: "ECE, teaching, first aid, newborn or specialist credentials" },
  { icon: Clock, label: "Schedule", body: "Full days, short shifts, split shifts, nights, weekends and short-notice work have different practical value" },
  { icon: MapPin, label: "Location and travel", body: "Commute time, parking, school runs and use of a personal vehicle" },
  { icon: BookOpen, label: "Duties", body: "Childcare only versus additional family-assistant or household tasks" },
  { icon: Users, label: "Children", body: "Newborns, multiples and mixed-age routines may require additional experience" },
  { icon: Heart, label: "Specialist care", body: "Demonstrated experience with disability, neurodivergence, complex health plans or early intervention collaboration" },
  { icon: ShieldCheck, label: "Stability", body: "Predictable, guaranteed hours can make a role more attractive than an uncertain schedule" },
];

const BUDGET_BEYOND = [
  "Paid working hours", "Leave and public holiday entitlements", "KiwiSaver or ACC obligations where applicable",
  "Payroll help", "Mileage", "Activity expenses", "Training", "Insurance considerations",
  "Backup care", "NannyOra membership or booking fees",
];

const LEGAL_SECTIONS = [
  {
    title: "Written Employment Agreement",
    body: "Every employee must have a written employment agreement. It should identify the parties, work, place, hours, pay and required problem-resolution terms, plus the nanny-specific details listed earlier. Allow the nanny to seek advice before signing.",
    note: "If you use a trial period, Employment New Zealand says it must be agreed in the employment agreement, last no more than 90 calendar days, apply to someone who has not worked for that employer before and be signed before work starts. A paid trial shift performed before signing can create serious risk for a later trial-period clause. Distinguish a recruitment trial session from an employment-law trial period and obtain advice.",
  },
  {
    title: "Minimum Pay, Hours and Breaks",
    body: "Employees aged 16 and over must receive at least the applicable minimum wage for every hour worked, including overtime. Minimum wage rates change, so check the current official rate rather than placing a figure in a long-lived guide.",
    note: "Employees are entitled to rest and meal breaks based on hours worked. Sole-charge childcare creates a practical issue: a nanny cannot have a genuine off-duty break while remaining responsible for the child. Plan lawful coverage or another workable arrangement and record it clearly.",
  },
  {
    title: "Holidays and Leave",
    body: "Under current Employment New Zealand guidance, eligible employees receive four weeks of annual holidays after 12 months of continuous employment, 10 days of sick leave after meeting the six-month or hours test, and relevant bereavement and family violence leave. Public holidays must be handled correctly; if an employee works on an otherwise working public holiday, at least time-and-a-half and an alternative holiday may be due.",
  },
  {
    title: "PAYE and the IR56 Rule",
    body: "Do not assume every nanny uses the same tax process. Inland Revenue defines a private domestic worker for IR56 purposes as someone who works in the employer’s home, does non-business domestic work, is paid directly by the employer and does not work more than 30 hours a week on average for each employer. An eligible IR56 worker registers with IRD and manages their own PAYE process. If the arrangement does not meet the IR56 conditions, the household may need to register as an employer, deduct and file PAYE, and handle other deductions.",
    links: [
      { label: "Private domestic worker guidance", href: "https://www.ird.govt.nz/roles/ir56-workers/private-domestic-workers" },
      { label: "Employer decision guidance", href: "https://www.ird.govt.nz/employing-staff/am-i-an-employer" },
    ],
  },
  {
    title: "KiwiSaver, ACC and Records",
    body: "KiwiSaver treatment depends on whether the nanny is on the household payroll or uses the private domestic worker route, their membership and eligibility. ACC obligations also vary. Confirm both directly with IRD, ACC or a payroll professional rather than copying a standard business setup. Keep complete wage, time, holiday, leave and payment records — Employment New Zealand specifies employment record duties and IRD requires full and accurate wage records for tax purposes.",
  },
  {
    title: "Safety, Privacy and Driving",
    body: "The family home becomes a workplace. Identify hazards, provide safe equipment and car seats, explain emergency procedures, and ensure the nanny has the information needed to care safely. Put consent rules for medication, outings, photos, location sharing and social media in writing. If the nanny drives, check their licence, vehicle safety, car insurance for work use and correct car-seat installation. Agree who provides the vehicle and how authorised mileage, parking and activity expenses will be reimbursed.",
  },
  {
    title: "Childcare Assistance",
    body: "Some families may qualify for government childcare help, but ordinary Childcare Subsidy and OSCAR payments generally require approved programmes. Work and Income also describes Flexible Childcare Assistance for some families who cannot access formal care while undertaking qualifying employment-related activity. Eligibility is individual; do not assume a private nanny arrangement is covered.",
    links: [
      { label: "Flexible Childcare Assistance", href: "https://www.workandincome.govt.nz/products/a-z-benefits/flexible-childcare-assistance.html" },
      { label: "NannyOra childcare support options", href: "/childcare-support" },
    ],
  },
];

const RESOURCES = [
  { title: "How to Interview a Nanny", body: "Use the same core questions for every candidate, adding scenarios based on your child’s age. Ask for specific past examples." },
  { title: "Questions to Ask", body: "Cover experience, routines, behaviour guidance, emergencies, duties, transport, pay and what the nanny needs from you." },
  { title: "Reference Checks", body: "Confirm the referee’s relationship, dates, duties, reliability, concerns and whether they would rehire. Get the candidate’s consent first." },
  { title: "Police Vetting", body: "A Police vet must be requested by an authorised agency with the person’s consent. It is a point-in-time check and one part of a broader suitability process—not a “clearance certificate” or guarantee." },
  { title: "Payroll Guide", body: "Determine worker status and whether IR56 applies, then document PAYE, payslips, records, KiwiSaver and ACC steps." },
  { title: "Employment Agreement and Nanny Contract", body: "Use an agreement suited to the role. Generic templates often miss guaranteed hours, vehicle use, privacy and emergency authority." },
  { title: "Holiday Pay and Leave", body: "Do not add a casual “8%” automatically. Pay-as-you-go annual holiday pay is lawful only in defined situations and must be handled correctly. Check the arrangement with Employment New Zealand or a payroll professional." },
  { title: "First Day Checklist", body: "Prepare contacts, routines, allergies, medication instructions, keys, alarms, first aid, transport authority and a plan if a parent is delayed." },
];

type FAQ = { question: string; answer: string };

const FAQS: FAQ[] = [
  { question: "How do I hire a nanny in New Zealand?", answer: "Define your hours, duties and budget; search relevant profiles; shortlist consistently; interview; complete identity, referee, qualification and Police checks; run a short paid trial; confirm worker status and payroll; then sign a written agreement before regular work begins." },
  { question: "What is the difference between a nanny and a babysitter?", answer: "A nanny usually provides recurring, professional childcare and takes responsibility for routines, activities and child-related tasks. A babysitter more often provides occasional supervision. The title does not determine employment status; the real arrangement does." },
  { question: "How much does a nanny cost in New Zealand?", answer: "Rates vary with experience, hours, location, duties, children’s ages, number of children and specialist skills. Budget for more than gross wages: leave, public holidays, KiwiSaver or ACC where applicable, mileage, payroll, activities, backup care and platform fees may also matter." },
  { question: "Does NannyOra charge families to browse?", answer: "Browsing is free. Paid family membership unlocks features such as full profiles, messaging, shortlisting, meet-and-greet requests, job posts and secure bookings. Check the current pricing page before joining." },
  { question: "Can I hire a nanny part-time?", answer: "Yes. Define the regular days and hours, whether hours are guaranteed, what happens in school holidays, and how schedule changes or cancellations are handled." },
  { question: "Can I hire a nanny for after-school care?", answer: "Yes. Confirm school pickup authority, transport, car seats, activity schedules, homework expectations, snacks, holiday hours and what happens when school closes unexpectedly." },
  { question: "Can I hire a nanny for a newborn?", answer: "Yes. Look for recent newborn experience, infant first aid, safe-sleep knowledge, feeding support within the parent’s plan, and calm communication. Clarify that a nanny does not replace a midwife, doctor or lactation professional." },
  { question: "What is a night nanny?", answer: "A night nanny provides agreed overnight childcare, often for a newborn. Specify awake versus sleeping hours, feeds, settling, parent handovers, breaks, sleeping space and what happens in an emergency." },
  { question: "What is a live-in nanny?", answer: "A live-in nanny resides in accommodation provided by the family but must still have defined work and off-duty time, privacy and lawful employment terms. Accommodation does not make the nanny continuously available." },
  { question: "What qualifications should a nanny have?", answer: "There is no single qualification for every nanny role. Prioritise relevant experience, sound judgment, references and first aid. ECE, teaching, newborn or specialist credentials may be valuable when directly connected to your child’s needs." },
  { question: "Are NannyOra nannies Police vetted?", answer: "NannyOra displays different verification levels. Police vetting is part of the relevant premium or specialist verification pathway; a basic Listed profile is not the same thing. Check the badge and completed checks on the individual profile." },
  { question: "Is a Police vet the same as a criminal record check?", answer: "No. New Zealand Police says Police vetting is provided to authorised agencies for eligible purposes and may include information relevant to the role. Individuals request their own criminal record from the Ministry of Justice. A Police vet is not a “clearance certificate”." },
  { question: "Does a Police vet guarantee a nanny is safe?", answer: "No. It is a point-in-time check and Police does not decide suitability. Combine it with identity verification, referee calls, interviews, qualification checks, a paid trial and ongoing observation." },
  { question: "Can I contact a nanny’s references myself?", answer: "Yes, with the candidate’s knowledge and consent. NannyOra’s verification process includes referee contact, and families may make additional checks when needed. Ask consistent, role-relevant questions." },
  { question: "Can I interview a nanny before deciding?", answer: "Yes. Begin with a video call and meet in person before making an offer. Both the family and nanny should have the chance to assess expectations and fit." },
  { question: "Should I pay for a nanny trial?", answer: "Yes. A trial involving childcare or useful work should be paid. Agree on time, rate, tasks, supervision and emergency information in advance." },
  { question: "Do I need a nanny contract?", answer: "If the nanny is an employee, a written employment agreement is legally required. Even where status is uncertain, put terms in writing and get advice. The document must reflect the real relationship, not merely use a preferred label." },
  { question: "Is a nanny an employee or contractor?", answer: "It depends on the actual arrangement and current legal tests. Regular care at set times in your home often has employee features. Use Employment New Zealand’s current gateway and common-law tests; seek advice rather than assuming." },
  { question: "Who pays PAYE for a nanny?", answer: "It depends. An eligible private domestic worker who averages no more than 30 hours a week for each employer and meets IRD’s other conditions may use the IR56 route and manage their own PAYE. Other households may need to register as employers and run payroll." },
  { question: "Do nannies receive annual holidays and sick leave?", answer: "Employees receive statutory entitlements when eligibility rules are met, including annual holidays and sick leave. Exact treatment can depend on employment type and work pattern, so set it up correctly from the beginning." },
  { question: "What happens on a public holiday?", answer: "If an employee works on a public holiday, at least time-and-a-half applies. A paid alternative holiday may also be due when it is an otherwise working day. If they do not work, payment depends on whether it would otherwise be a working day." },
  { question: "Can I use a 90-day trial period?", answer: "Potentially, if all current legal conditions are met. It must be agreed in the written employment agreement, last no more than 90 calendar days and be signed before the employee starts. Get advice because even earlier paid work can affect validity." },
  { question: "What duties can a nanny reasonably do?", answer: "Standard duties usually centre on children: care, activities, meals, transport and child-related tidying or laundry. General cleaning, adult meals, personal assistance or household management should be separately agreed and paid appropriately." },
  { question: "Should I reimburse mileage?", answer: "Agree on this before hiring. If the nanny uses a personal vehicle for authorised work trips, document mileage, parking and expense treatment, check insurance for work use and consult current IRD guidance or payroll advice on reimbursement." },
  { question: "Can a nanny care for a child with autism, ADHD or sensory needs?", answer: "Yes, when the nanny has suitable experience and the match is right. Ask for concrete examples, verify credentials where claimed, share care plans and define when the nanny should coordinate with or defer to health and education professionals." },
  { question: "Can I replace a nanny if the match does not work?", answer: "You can end an employment relationship only by following the agreement and New Zealand employment law, including good-faith and fair-process requirements where applicable. NannyOra can support a new search, but platform access does not remove employer obligations." },
  { question: "Does NannyOra cover all of New Zealand?", answer: "Not yet. NannyOra currently serves greater Auckland. Hamilton, Christchurch and Wellington should be described as planned expansion areas until active service launches." },
  { question: "What should I do next?", answer: "Write down your children’s ages, required days and hours, suburb, essential duties, must-have checks and total budget. Then browse Auckland nanny profiles, register as a family or post a job." },
];

const RELATED = [
  { href: "/how-it-works", label: "How NannyOra works" },
  { href: "/nanny-vetting", label: "How to vet a nanny in New Zealand" },
  { href: "/nanny-interview-questions", label: "Nanny interview questions for families" },
  { href: "/nanny-contract", label: "What to include in a nanny contract" },
  { href: "/nanny-payroll", label: "Nanny payroll, PAYE and IR56 guidance" },
  { href: "/nanny-safety", label: "Nanny safety and first-day checklist" },
  { href: "/nanny-vs-daycare", label: "Nanny vs daycare: choose the right childcare" },
  { href: "/nanny-vs-babysitter", label: "Nanny vs babysitter: regular care or occasional help" },
  { href: "/nanny-vs-au-pair", label: "Nanny vs au pair: compare the full arrangement" },
  { href: "/specialist-nanny-care", label: "Specialist nanny care for individual support" },
  { href: "/parent-resources", label: "Parent resources for hiring and working with a nanny" },
  { href: "/verification-process", label: "NannyOra’s seven-layer verification process" },
  { href: "/trust-and-safety", label: "Trust and safety on NannyOra" },
  { href: "/ece-nanny-auckland", label: "ECE nannies in Auckland" },
  { href: "/specialist-childcare-auckland", label: "Specialist childcare in Auckland" },
  { href: "/pricing", label: "NannyOra pricing" },
];

/* ---------- main page article ---------- */

export function FindANannyArticle({ allNannies }: { allNannies: NannyProfilePublic[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Find a Nanny", path: "/find-a-nanny" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      {/* ---------------- HERO ---------------- */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>For Families</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-5 leading-tight">
          Hire a Nanny in New Zealand: Find the <ShinyText>Right Care</ShinyText> for Your Family
        </h1>
      </div>

      {/* ---------------- DIRECTORY (full page width, right under the H1) ---------------- */}
      <Article>
        <H2 id="search-and-compare-nanny-profiles">Search and Compare Nanny Profiles</H2>
        <P>
          Use the filters below to narrow the directory by care type, suburb, child age, availability, rate
          range, language and relevant experience. Start with the requirements you cannot compromise
          on—usually location, hours, child age experience and transport—then compare style, qualifications
          and specialist skills.
        </P>
      </Article>

      <ImageBand tags={["find-a-nanny-band"]} seed="find-a-nanny" aspect="aspect-[16/6]" priority className="mb-2" />

      <div id="directory" className="scroll-mt-24 mb-10">
        <FindANannyClient allNannies={allNannies} />
      </div>

      <Article>
        <H3 id="what-to-look-for-on-a-nanny-profile">What to Look for on a Nanny Profile</H3>
        <ul className="space-y-2.5 mt-5 mb-6">
          {PROFILE_LOOKS.map((t) => (
            <Bullet key={t}>{t}</Bullet>
          ))}
        </ul>
        <div className="text-center mb-10">
          <Link href="#directory" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
            Browse all available Auckland nannies
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Article>

      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Hiring a nanny gives your child consistent, one-to-one care in the place they know best: home.
          NannyOra helps Auckland families discover local nanny profiles, compare care specialties and
          connect through a structured platform.
        </p>
        <p className="text-xs text-muted-foreground mt-4">Last updated: 7 August 2026</p>
      </div>

      <Callout tone="warn" title="Important">
        <p>
          This guide provides general New Zealand information, not legal, tax or employment advice.
          Worker status and payroll obligations depend on the real arrangement. Check current guidance from
          Employment New Zealand, Inland Revenue and ACC, and get professional advice for your circumstances.
        </p>
      </Callout>

      {/* ---------------- KEY TAKEAWAYS ---------------- */}
      <Article>
        <Callout title="Key takeaways">
          <ul className="space-y-2.5">
            {TAKEAWAYS.map((t) => (
              <Bullet key={t}>{t}</Bullet>
            ))}
          </ul>
        </Callout>
      </Article>

      {/* ---------------- FIND THE RIGHT NANNY ---------------- */}
      <Article>
        <H2 id="find-the-right-nanny-not-just-any-nanny">Find the Right Nanny, Not Just Any Nanny</H2>
        <P>
          The right nanny should fit your child, your household and the way your week actually works. A warm
          and experienced newborn nanny may be excellent with feeding, settling and sleep rhythms but may not
          be the best match for a school-aged child who needs afternoon transport and homework support. An
          ECE-qualified nanny may bring intentional, play-based learning. A specialist care nanny may
          understand sensory needs, neurodivergent communication or complex transitions.
        </P>
        <P>
          That is why NannyOra profiles go beyond a name and phone number. Families can search by care type,
          Auckland area, child age, availability, language and specialist experience. Profiles can also display
          ECE background, first aid, driver licence and verification information.
        </P>

        <H3>Why Families Choose NannyOra</H3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8 mt-5">
          {WHY_FAMILIES.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.title} className="bg-card rounded-2xl p-5 shadow-sm border border-border/30">
                <span className="inline-flex w-10 h-10 rounded-xl bg-secondary text-primary items-center justify-center mb-3">
                  <Icon className="w-5 h-5 stroke-[1.6]" aria-hidden="true" />
                </span>
                <h4 className="font-bold text-foreground mb-1.5 text-sm">{w.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
              </div>
            );
          })}
        </div>

        <H3>NannyOra’s Seven-Layer Verification Process</H3>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 mt-5">
          {VERIFICATION_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="flex items-start gap-3 bg-secondary/40 rounded-2xl p-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-primary stroke-[1.6]" aria-hidden="true" />
                    {s.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="text-center mb-8">
          <Link href="/verification-process" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
            See how every layer protects your family
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <Callout tone="warn" title="Vetting is not a guarantee">
          <p>
            The{" "}
            <a href="https://www.police.govt.nz/advice-services/businesses-and-organisations/nz-police-vetting-service" className="text-primary underline underline-offset-2">
              New Zealand Police Vetting Service
            </a>{" "}
            describes a Police vet as a point-in-time input to a wider suitability decision; Police does
            not decide whether somebody is right for a role. Always interview, verify the profile badge,
            complete a paid trial and keep communicating once care begins.
          </p>
        </Callout>

        <H3>How Matching Works</H3>
        <ol className="space-y-3 mt-5 mb-6">
          {MATCHING_STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-3 bg-card rounded-2xl p-4 shadow-sm border border-border/30">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <h4 className="font-bold text-foreground text-sm">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="text-center mb-10">
          <Link href="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
            Learn how NannyOra works
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Article>

      {/* ---------------- WHY HIRE A NANNY ---------------- */}
      <Article>
        <H2 id="why-hire-a-nanny">Why Hire a Nanny?</H2>
        <P>
          A nanny is a professional caregiver who looks after one family’s children, usually in the family
          home. The role may be full-time, part-time, after school, overnight, short term or ongoing. Unlike
          occasional babysitting, a regular nanny role often includes responsibility for routines,
          developmentally suitable activities, children’s meals, transport and child-related organisation.
        </P>

        <H3>One-to-One Care</H3>
        <P>
          Individual care allows a nanny to respond to the child in front of them. A baby’s feeds and naps do
          not need to follow a group timetable. A toddler can spend longer on an activity that holds their
          attention. A school-aged child can decompress after class before starting homework. This attention
          can be especially valuable for newborns, multiple children with different routines, children who find
          group settings overwhelming, or families wanting continuity through a period of change.
        </P>

        <H3>A Schedule Built Around Family Life</H3>
        <P>
          Centre hours do not suit every job or commute. A family nanny may cover an early start, a late finish,
          a split after-school shift, rotating days or a carefully defined overnight arrangement. That
          flexibility can remove several daily handovers and reduce the pressure around drop-off and pickup
          windows. Flexibility still needs boundaries. Regular hours, overtime, cancellations, availability and
          schedule changes should be written down. “Flexible” should not mean permanently on call.
        </P>

        <H3>Familiar Routines at Home</H3>
        <P>
          Care at home can preserve sleep routines, familiar foods, favourite activities and neighbourhood
          connections. Children can attend their usual playgroup, library, park or therapy appointment without
          adjusting to a second care environment. Home care may also reduce day-to-day exposure to large groups,
          although no childcare arrangement can prevent illness. A nanny may become unwell too, so working
          parents should still agree on a backup-care plan.
        </P>

        <H3>Child Development Through Everyday Life</H3>
        <P>
          A professional nanny does more than supervise. They can plan age-appropriate play, read with children,
          encourage language, support self-help skills, spend time outdoors and notice emerging interests. An{" "}
          <Link href="/ece-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">
            ECE nanny in Auckland
          </Link>{" "}
          may bring formal early childhood knowledge into those everyday moments. The strongest approach is
          responsive rather than overly academic. Ask candidates how they follow a child’s interests, support
          emotional regulation, set safe boundaries and communicate observations to parents.
        </P>

        <H3>Practical Support for the Whole Day</H3>
        <P>Depending on the agreed job description, a nanny may:</P>
        <ul className="space-y-2 mt-3 mb-4">
          {[
            "Prepare children’s meals and snacks",
            "Dress children and organise bags",
            "Handle school or activity transport",
            "Support homework and reading",
            "Plan outings and play",
            "Wash children’s dishes or laundry",
            "Keep child-related spaces tidy",
            "Record feeds, naps, medication or important events",
            "Coordinate agreed appointments or handovers",
          ].map((t) => (
            <Bullet key={t}>{t}</Bullet>
          ))}
        </ul>
        <P>
          A nanny is not automatically a housekeeper. Heavy cleaning, adult laundry, household administration,
          pet care or cooking for the whole family should be discussed separately, included in the agreement
          and reflected in pay.
        </P>

        <H3>When a Nanny May Be the Best Fit</H3>
        <P>Consider hiring a nanny when two or more of these are true:</P>
        <ul className="space-y-2 mt-3 mb-4">
          {[
            "Your work hours fall outside ordinary childcare hours",
            "You have more than one child and multiple drop-offs are becoming unmanageable",
            "Your baby or toddler benefits from a consistent individual routine",
            "Your child needs sensory-aware, neurodiverse or other specialist support",
            "You need reliable school pickup, transport or homework help",
            "You want childcare to happen primarily at home",
            "You value one consistent caregiver and can support the responsibilities of employing them",
          ].map((t) => (
            <Bullet key={t}>{t}</Bullet>
          ))}
        </ul>
        <P>
          A nanny may be less suitable if your top priority is the lowest hourly cost or a large peer-group
          environment. Some families combine a nanny with preschool, school or whānau care.
        </P>
      </Article>

      {/* ---------------- WHICH TYPE ---------------- */}
      <Article>
        <H2 id="which-type-of-nanny-is-right-for-your-family">Which Type of Nanny Is Right for Your Family?</H2>
        <P>
          “Nanny” describes several different arrangements. Define the job before searching so candidates can
          judge fit accurately.
        </P>
        <div className="grid grid-cols-1 gap-3 mt-5 mb-6">
          {NANNY_TYPES.map((t) => (
            <div key={t.title} className="bg-card rounded-2xl p-5 shadow-sm border border-border/30">
              <h4 className="font-bold text-foreground text-sm mb-1">{t.title}</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">Best for:</span> {t.best}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                <span className="font-semibold text-foreground/80">Settle early:</span> {t.q}
              </p>
            </div>
          ))}
        </div>

        <H3>Choose by Need, Not by Job Title</H3>
        <P>
          Titles are not standardised. One person’s “night nanny” may provide awake newborn care, while another
          is available to respond but can sleep between wakes. “Qualified nanny” might mean an ECE degree, a
          nanny certificate, current first aid or specialist training. Ask what each term means on that
          candidate’s profile.
        </P>
        <P>
          For specialist care, focus on demonstrated competence rather than labels. Ask for examples of how the
          nanny has supported communication differences, sensory overload, transitions, feeding challenges or
          therapy plans. Review the relevant credential and confirm whether their role is childcare,
          therapeutic support or collaboration with a registered clinician.
        </P>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Explore{" "}
          <Link href="/specialist-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">
            specialist childcare in Auckland
          </Link>
          ,{" "}
          <Link href="/sensory-aware-nanny-auckland" className="text-primary underline underline-offset-2 font-semibold">
            sensory-aware nannies
          </Link>{" "}
          and{" "}
          <Link href="/neurodiverse-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">
            neurodiverse childcare
          </Link>
          .
        </p>
      </Article>

      {/* ---------------- HOW TO HIRE ---------------- */}
      <Article>
        <H2 id="how-to-hire-a-nanny">How to Hire a Nanny</H2>
        <P>
          A calm hiring process protects both your family and the nanny. Rushing from “we need help” to a start
          date often creates avoidable misunderstandings.
        </P>
        <div className="space-y-5 mt-6 mb-6">
          {HIRING_STEPS.map((step, i) => (
            <div key={step.title} className="bg-card rounded-3xl p-6 sm:p-7 shadow-sm border border-border/30">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground pt-1">{step.title}</h3>
              </div>
              {step.body.map((p, j) => (
                <P key={j} className="mb-2">{p}</P>
              ))}
              {step.tip && (
                <div className="bg-secondary/40 rounded-2xl p-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Tip
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed">{step.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <H3>Common Hiring Mistakes</H3>
        <ul className="space-y-2 mt-5 mb-6">
          {HIRING_MISTAKES.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0 mt-2" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Article>

      {/* ---------------- WHY CHOOSE NANNYORA ---------------- */}
      <Article>
        <H2 id="why-choose-nannyora">Why Choose NannyOra?</H2>
        <P>
          NannyOra is designed to make the search more structured and transparent than an unmoderated social
          post or classified ad. It combines local profile discovery, specialist filters, visible verification
          levels, secure initial contact and a pathway to a paid trial.
        </P>
        <P>
          It is also important to understand what NannyOra is not. NannyOra is a platform for private nanny
          placement; it does not employ the nanny or make the final hiring decision for your household.
          Families are responsible for deciding fit and meeting their employment, tax and safety obligations.
        </P>
        <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6">
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-secondary text-foreground">
                <th className="text-left p-3 font-bold">What families need</th>
                <th className="text-left p-3 font-bold text-primary">NannyOra</th>
                <th className="text-left p-3 font-bold">Facebook group</th>
                <th className="text-left p-3 font-bold">General classifieds</th>
              </tr>
            </thead>
            <tbody>
              {NANNYORA_VS.map((r, i) => (
                <tr key={r.need} className={i % 2 ? "bg-card" : "bg-secondary/30"}>
                  <td className="p-3 font-semibold text-foreground/80">{r.need}</td>
                  <td className="p-3 text-foreground">{r.us}</td>
                  <td className="p-3 text-muted-foreground">{r.fb}</td>
                  <td className="p-3 text-muted-foreground">{r.cls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          The difference is not that a platform can remove all risk. It is that NannyOra gives families more
          structured information before they decide whom to meet.
        </P>
        <div className="text-center mb-10">
          <Link href="/trust-and-safety" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
            Review NannyOra’s trust and safety levels
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Article>

      {/* ---------------- VS OTHER OPTIONS ---------------- */}
      <Article>
        <H2 id="hiring-a-nanny-vs-other-childcare-options">Hiring a Nanny vs Other Childcare Options</H2>
        <P>
          No childcare format wins for every family. Compare the practical experience, not just the headline
          cost.
        </P>
        <div className="grid grid-cols-1 gap-3 mt-5 mb-6">
          {CHILDCARE_COMPARE.map((row) => (
            <div key={row.option} className="bg-card rounded-2xl p-5 shadow-sm border border-border/30">
              <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                {row.option}
              </h4>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <dt className="text-muted-foreground font-semibold">Setting</dt>
                <dd className="text-foreground/80">{row.setting}</dd>
                <dt className="text-muted-foreground font-semibold">Personalisation</dt>
                <dd className="text-foreground/80">{row.personalisation}</dd>
                <dt className="text-muted-foreground font-semibold">Flexibility</dt>
                <dd className="text-foreground/80">{row.flexibility}</dd>
                <dt className="text-muted-foreground font-semibold">Social</dt>
                <dd className="text-foreground/80">{row.social}</dd>
                <dt className="text-muted-foreground font-semibold">Employer role</dt>
                <dd className="text-foreground/80">{row.role}</dd>
              </dl>
            </div>
          ))}
        </div>
        <P>
          Choose a nanny when individual routines, home care, transport or non-standard hours matter most.
          Choose daycare when a consistent group environment and centre facilities matter more. Use a babysitter
          for genuinely occasional supervision. Consider an au pair only after understanding immigration,
          accommodation, working-hour and employment responsibilities. For licensed home-based ECE, ask who
          employs the educator, what curriculum and supervision apply, and which subsidies may be available.
        </P>
        <P>
          For a more detailed decision, use our <Link href="/nanny-vs-daycare" className="text-primary underline underline-offset-2 font-semibold">nanny vs daycare</Link>, <Link href="/nanny-vs-babysitter" className="text-primary underline underline-offset-2 font-semibold">nanny vs babysitter</Link> and <Link href="/nanny-vs-au-pair" className="text-primary underline underline-offset-2 font-semibold">nanny vs au pair</Link> guides. If your child needs a more individual match, start with <Link href="/specialist-nanny-care" className="text-primary underline underline-offset-2 font-semibold">specialist nanny care</Link>.
        </P>
        <Callout title="A Simple Decision Framework">
          <p>
            Rank these from most to least important: individual attention, total cost, schedule flexibility, care
            at home, peer interaction, specialist support, transport, backup coverage and appetite for employer
            administration. The best option is the one that performs well on your first three priorities and
            remains workable for the caregiver.
          </p>
        </Callout>
      </Article>

      {/* ---------------- COST ---------------- */}
      <Article>
        <H2 id="what-does-it-cost-to-hire-a-nanny">What Does It Cost to Hire a Nanny?</H2>
        <P>
          There is no single correct nanny rate. NannyOra nannies set their own rates, which are displayed on
          profiles. The appropriate offer depends on the role, market and candidate—not only the number of
          children.
        </P>

        <H3>What Influences a Nanny’s Rate?</H3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 mb-6">
          {COST_FACTORS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="bg-card rounded-2xl p-4 shadow-sm border border-border/30">
                <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-primary stroke-[1.6]" aria-hidden="true" />
                  {c.label}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            );
          })}
        </div>

        <H3>Budget Beyond the Hourly Rate</H3>
        <P>Your total cost may include:</P>
        <ul className="flex flex-wrap gap-2 mt-3 mb-4">
          {BUDGET_BEYOND.map((t) => (
            <li key={t} className="px-3 py-1.5 rounded-full bg-secondary/60 text-xs font-semibold text-foreground/80 border border-border/40">
              {t}
            </li>
          ))}
        </ul>
        <P>
          Do not compare a nanny’s gross hourly pay with a centre’s invoice as though they include the same
          things. Build a weekly and annual budget for the whole arrangement. NannyOra keeps platform pricing
          separate from nanny pay.{" "}
          <Link href="/pricing" className="text-primary underline underline-offset-2 font-semibold">
            See current NannyOra membership and platform pricing
          </Link>
          ; check individual profiles for advertised nanny rates.
        </P>

        <H3>How to Discuss Pay Well</H3>
        <P>
          Share the full role before asking for a final rate. If duties or hours change, discuss and document
          the effect on pay. Avoid asking a candidate to absorb work expenses or unpaid availability. A clear,
          sustainable offer supports retention and protects the continuity your child depends on.
        </P>

        {/* nanny tiers — live data via shared component */}
        <div className="mt-6 mb-8">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">NannyOra nanny tiers</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Upfront pricing for nannies — one-off, no monthly nanny fee. Live from the same source the product charges from.
          </p>
          <NannyTiers />
        </div>
      </Article>

      {/* ---------------- LEGAL RESPONSIBILITIES ---------------- */}
      <Article>
        <H2 id="your-legal-responsibilities-when-hiring-a-nanny-in-new-zealand">
          Your Legal Responsibilities When Hiring a Nanny in New Zealand
        </H2>
        <P>
          Regular private nanny care commonly has the features of employment: the family decides where and when
          care happens, sets duties, pays wages and expects the nanny to do the work personally. However, New
          Zealand now uses a statutory gateway test followed, where needed, by common-law tests to decide
          employee or contractor status. The label in a document is not enough on its own.
        </P>
        <P>
          Use Employment New Zealand’s current{" "}
          <a href="https://www.employment.govt.nz/starting-employment/types-of-worker/employee-or-contractor" className="text-primary underline underline-offset-2 font-semibold">
            employee-or-contractor guidance
          </a>{" "}
          for the actual arrangement. Get advice if you are uncertain.
        </P>

        <div className="space-y-4 mt-6 mb-6">
          {LEGAL_SECTIONS.map((s) => (
            <div key={s.title} className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border border-border/30">
              <div className="flex items-start gap-2.5 mb-2">
                <Scale className="w-4 h-4 text-primary flex-shrink-0 mt-1 stroke-[1.6]" aria-hidden="true" />
                <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
              </div>
              <P className="mb-3">{s.body}</P>
              {s.note && (
                <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3.5 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" /> Important
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed">{s.note}</p>
                </div>
              )}
              {s.links && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                  {s.links.map((l) => (
                    <a key={l.href} href={l.href} className="text-xs text-primary underline underline-offset-2 font-semibold">
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <a href="https://www.employment.govt.nz/starting-employment/rights-and-responsibilities/employer-rights-and-responsibilities" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
            Read the current employer rights and responsibilities
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </Article>

      {/* ---------------- AREAS NANNYORA SERVES ---------------- */}
      <Article>
        <H2 id="areas-nannyora-serves">Areas NannyOra Serves</H2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
          <div className="bg-primary text-primary-foreground rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-heading text-xl font-bold">Auckland</h3>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-3">
              NannyOra currently serves greater Auckland. Search Central, East, North, West or South Auckland,
              then narrow results by suburb and availability. Coverage depends on active profiles and each
              nanny’s travel area.
            </p>
            <Link href="/nannies/auckland" className="inline-flex items-center gap-1.5 text-sm font-bold text-white underline underline-offset-2">
              Browse the Auckland nanny directory
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {[{ name: "Hamilton", body: "Hamilton is a planned expansion area. NannyOra does not present active local coverage until profiles and operational support are live.", href: "/nannies/hamilton", linkLabel: "Plan your Hamilton nanny search" },
           { name: "Christchurch", body: "Christchurch is a planned expansion area. Build a dedicated location page only when families can complete the promised action and see relevant carers." },
           { name: "Wellington", body: "Wellington is a planned expansion area. Until launch, use an honest expression-of-interest message rather than sending visitors to an empty search result." }].map((c) => (
            <div key={c.name} className="bg-secondary/40 rounded-3xl p-6 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="font-heading text-xl font-bold text-foreground">{c.name}</h3>
                <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Coming later</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              {"href" in c && c.href ? (
                <Link href={c.href} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary mt-3 hover:text-primary-light transition-colors">
                  {c.linkLabel} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </Article>

      {/* ---------------- RESOURCES ---------------- */}
      <Article>
        <H2 id="resources-for-parents">Resources for Parents</H2>
        <P>
          Use these essentials now; turn each into a dedicated supporting article as NannyOra’s parent resource
          hub grows.
        </P>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 mb-6">
          {RESOURCES.map((r) => (
            <div key={r.title} className="bg-card rounded-2xl p-4 shadow-sm border border-border/30">
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 stroke-[1.6]" aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-foreground text-sm mb-0.5">{r.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Review{" "}
          <Link href="/trust-and-safety" className="text-primary underline underline-offset-2 font-semibold">
            NannyOra’s trust and safety information
          </Link>{" "}
          and, where relevant, explore{" "}
          <Link href="/specialist-childcare-auckland" className="text-primary underline underline-offset-2 font-semibold">
            specialist childcare in Auckland
          </Link>
          .
        </p>
      </Article>

      {/* ---------------- REAL PARENT STORIES ---------------- */}
      <Article>
        <H2 id="real-parent-stories">Real Parent Stories</H2>
        <Callout title="Authenticity first">
          <p>
            NannyOra publishes only approved, attributable parent stories — never composite quotes, invented
            names, review counts or ratings. Genuine case studies and family imagery will appear here as they
            become available. If you are a NannyOra family willing to share your experience, we’d love to hear
            from you.
          </p>
          <div className="mt-3">
            <Link href="/register-family" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-light transition-colors">
              Register your family
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </Callout>
      </Article>

      {/* ---------------- SUMMARY ---------------- */}
      <Article>
        <H2 id="summary-is-a-nanny-right-for-your-family">Summary: Is a Nanny Right for Your Family?</H2>
        <P>
          A nanny may be right when your family needs personal care, a clearly defined flexible schedule or
          experience tailored to your child. Strong placements combine a realistic brief, layered checks, an
          interview, a paid trial and fair employment terms.
        </P>
        <P>
          NannyOra makes discovery more transparent with local search, visible verification levels and
          specialist filters. It cannot replace your judgment or employer responsibilities. Take the process
          one step at a time and choose the person who can build a safe, respectful relationship with your
          child and household.
        </P>

        <H3>Related Articles</H3>
        <ul className="space-y-2 mt-5 mb-6">
          {RELATED.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="text-sm font-semibold text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                {r.label}
              </Link>
            </li>
          ))}
        </ul>

        <H3>Next Step for the Reader</H3>
        <P>
          Write your five non-negotiables—location, hours, child-age experience, essential checks and
          budget—then{" "}
          <Link href="#directory" className="text-primary underline underline-offset-2 font-semibold">
            browse nanny profiles
          </Link>{" "}
          using those filters.
        </P>

        {/* ---------------- FAQ ---------------- */}
        <H2 id="frequently-asked-questions">Frequently Asked Questions</H2>
        <Accordion items={FAQS} />
      </Article>

      {/* ---------------- FINAL CTAs ---------------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-primary-foreground mb-3">Ready to Find the Right Nanny?</h2>
          <p className="text-white/80 leading-relaxed mb-7 max-w-xl mx-auto">
            Find trusted care that fits your child, your schedule and your home—not just the first available name.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="#directory">
              <Button variant="accent" size="lg" className="rounded-full shadow-lg">
                Browse Profiles
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/register-family">
              <Button variant="secondary" size="lg" className="rounded-full">Register Your Family</Button>
            </Link>
            <Link href="/post-a-job">
              <Button variant="secondary" size="lg" className="rounded-full">Post a Childcare Job</Button>
            </Link>
            <Link href="/apply-as-nanny">
              <Button variant="secondary" size="lg" className="rounded-full">Become a Nanny</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
