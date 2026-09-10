import { LocationNannyHub, locationMetadata, type LocationHubConfig } from "@/components/seo/LocationNannyHub";

const config: LocationHubConfig = {
  city: "Christchurch",
  path: "/nannies/christchurch",
  areas: ["christchurch", "Riccarton", "Fendalton", "Merivale", "St Albans", "Papanui", "Cashmere", "Halswell"],
  areaIntro: "A Christchurch care brief works best when it starts with the places your child actually moves through: home, school or preschool, activities and the adults who share pickup or handover. These area names help us understand future travel needs; they do not promise a current local match.",
  localContext: "Plan a nanny search around the rhythm of your Christchurch family. NannyOra is preparing for Christchurch, with a practical place to understand the process and share the care that would make your week work.",
  careIntro: "A nanny can be a useful option when your care needs need to connect home life, school or preschool, changing work hours and a child’s individual routine. The value is not a generic label—it is a carefully defined role and an adult your child can get to know over time.",
  planningIntro: "Start with the routes, transitions and responsibilities that make a Christchurch weekday difficult. That gives a future candidate a useful picture of the job and gives your family a fair way to compare experience and availability.",
  considerations: [
    { title: "Home, school and activity routes", body: "List every regular pickup, drop-off and activity location, then state which journeys are essential. This helps clarify whether a driver, vehicle use or travel reimbursement is part of the role." },
    { title: "Care across a changing week", body: "Separate term-time hours, preschool days, school holidays and occasional appointments. Candidates can assess a clear roster more fairly than a broad request for flexibility." },
    { title: "A settled home routine", body: "Describe the routines that help your child arrive home well: food, rest, outdoor time, sibling dynamics, homework or quiet play. These details are more useful than a generic description of a ‘good nanny’." },
    { title: "Shared family support", body: "State who can collect a child, who handles handovers and what happens when a parent is delayed. A future nanny needs to know the support around the role, not only the paid hours." },
  ],
  heroImageClass: "bg-[linear-gradient(135deg,rgba(235,245,240,1),rgba(247,239,228,1))]",
};

export const metadata = locationMetadata(config);

export default function ChristchurchNanniesPage() {
  return <LocationNannyHub config={config} />;
}
