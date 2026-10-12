import type { NannyProfilePublic } from "@/types";

/**
 * Location matching used by the public city hubs and their discovery feeds.
 * A profile is only considered local when its stated base suburb or travel
 * area matches the city or one of the named localities on that hub.
 */
export function getNanniesForAreas(nannies: NannyProfilePublic[], areas: readonly string[]) {
  return nannies.filter((nanny) =>
    [nanny.suburb, ...nanny.areasCovered].some((area) => {
      const normalised = area.toLowerCase().trim();
      return areas.some((locationArea) => normalised.includes(locationArea.toLowerCase()));
    }),
  );
}

/**
 * City guides stay useful to people when a local directory is empty, but they
 * should not be promoted as search landing pages until at least one public
 * profile explicitly covers the city.
 */
export function hasIndexableCityCoverage(nannies: NannyProfilePublic[]) {
  return nannies.length > 0;
}

export const CITY_HUBS = [
  {
    path: "/nannies/hamilton",
    areas: ["hamilton", "hamilton east", "rototuna", "flagstaff", "chartwell", "hillcrest", "dinsdale", "st andrews", "nawton"],
  },
  {
    path: "/nannies/christchurch",
    areas: ["christchurch", "Riccarton", "Fendalton", "Merivale", "St Albans", "Papanui", "Cashmere", "Halswell"],
  },
  {
    path: "/nannies/wellington",
    areas: ["wellington", "Karori", "Johnsonville", "Miramar", "Newtown", "Kelburn", "Island Bay", "Lower Hutt", "Upper Hutt"],
  },
] as const;
