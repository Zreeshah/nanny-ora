import Link from "next/link";
import { LocationNannyHub, locationMetadata, type LocationHubConfig } from "@/components/seo/LocationNannyHub";

const config: LocationHubConfig = {
  city: "Wellington",
  path: "/nannies/wellington",
  areas: ["wellington", "Karori", "Johnsonville", "Miramar", "Newtown", "Kelburn", "Island Bay", "Lower Hutt", "Upper Hutt"],
  areaIntro: "For Wellington families, a useful care brief makes travel and handover practical: where care starts and ends, school or preschool locations, the days you need support and which adults can help when plans change. Include these details so a potential nanny can understand what the role involves.",
  localContext: "Planning care in Wellington? Start with the real logistics of your household: your schedule, travel, handovers and the support that would make the week easier.",
  careIntro: "In-home care can be valuable when one reliable plan needs to cover work, school pickup, changing weather, activities and the transition back home. The best arrangement is one whose hours, transport and communication are agreed before care starts.",
  planningIntro: "Map the parts of your week where care needs to be dependable, including travel time, pickup authority, after-school handover and school-holiday coverage. A precise brief helps a potential nanny decide whether the role is genuinely workable.",
  considerations: [
    { title: "Travel that works in real life", body: "State the full travel pattern: where care begins, where a child must be collected, what time-sensitive journeys occur and whether the nanny needs a licence, vehicle, parking or public-transport plan." },
    { title: "Weather and backup decisions", body: "Agree what changes when weather, delayed travel or a school closure disrupts the usual plan. A nanny should know who can make a decision, how they will be contacted and what the child’s safe fallback is." },
    { title: "After-school handover", body: "Set out snack, homework, activities, screen boundaries, visitors and the time parents usually return. A calm afternoon is easier to deliver when the nanny knows which routines are essential and which are optional." },
    { title: "Boundaries around flexibility", body: "Be specific about guaranteed hours, late changes, weekend work and school holidays. A liveable role respects that the caregiver has their own travel and family commitments outside agreed work time." },
  ],
  heroImageClass: "bg-[linear-gradient(135deg,rgba(236,242,250,1),rgba(241,238,249,1))]",
};

export const revalidate = 300;

export async function generateMetadata() {
  return locationMetadata(config);
}

export default function WellingtonNanniesPage() {
  return (
    <>
      <LocationNannyHub config={config} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 -mt-6" aria-labelledby="wellington-guide-heading">
        <div className="max-w-2xl mb-8">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-3">Wellington planning guide</span>
          <h2 id="wellington-guide-heading" className="font-heading text-3xl sm:text-4xl text-foreground leading-tight">Planning nanny care in Wellington: a short guide</h2>
          <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-[1.8]">Wellington families often need care that copes with the city’s hills, harbour crossings and changeable weather. The brief below helps a family describe the practical shape of a role — and helps a nanny decide whether it is genuinely workable.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Travel across the city</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">State where care begins and ends, which suburbs the nanny must travel between, and whether the role needs a licence, a vehicle, parking or a public-transport plan. A role that crosses the harbour or climbs steep hill suburbs at school-pickup time is a different job from one in a single flat neighbourhood — say so in the brief.</p>
          </div>
          <div className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">After-school and weekend care</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">If the main need is afternoons, read the <Link href="/after-school-nanny" className="text-primary underline underline-offset-2 font-semibold">after-school nanny guide</Link> for pickup, homework and holiday cover. For Saturdays and Sundays, the <Link href="/weekend-nanny" className="text-primary underline underline-offset-2 font-semibold">weekend nanny guide</Link> covers full days, activities and outings.</p>
          </div>
          <div className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Weather and backup decisions</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Wellington weather can change a plan quickly. Agree what happens when wind, rain or a transport disruption affects pickup, outings or the journey home — who decides, how the nanny will be contacted and what the child’s safe fallback is. For last-minute cover, the <Link href="/emergency-nanny" className="text-primary underline underline-offset-2 font-semibold">emergency nanny guide</Link> explains how to prepare a backup plan before you need one.</p>
          </div>
          <div className="rounded-3xl border border-border/35 bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Overnight and occasional care</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">For newborn overnight support, the <Link href="/night-nanny" className="text-primary underline underline-offset-2 font-semibold">night-nanny guide</Link> explains how to define awake, on-call and rest time. For occasional evenings, the <Link href="/babysitting-rates-nz" className="text-primary underline underline-offset-2 font-semibold">babysitting rates guide</Link> and the <Link href="/babysitter-pay-calculator" className="text-primary underline underline-offset-2 font-semibold">babysitter pay calculator</Link> help families agree a fair rate, and the <Link href="/nanny-cost" className="text-primary underline underline-offset-2 font-semibold">nanny cost guide</Link> covers a full employment budget for a regular role.</p>
          </div>
        </div>
      </section>
    </>
  );
}
