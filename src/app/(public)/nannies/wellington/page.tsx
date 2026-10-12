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

export const metadata = locationMetadata(config);

export default function WellingtonNanniesPage() {
  return <LocationNannyHub config={config} />;
}
