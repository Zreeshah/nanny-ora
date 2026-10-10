import type { NannyProfilePublic } from "@/types";

export const NORTHWEST_AUCKLAND_PATH = "/nannies/auckland/northwest-auckland";

export const NORTHWEST_AUCKLAND_AREAS = [
  "Hobsonville",
  "Hobsonville Point",
  "Whenuapai",
  "Westgate",
  "Huapai",
  "Kumeū",
] as const;

const NORMALIZED_AREAS = new Set(NORTHWEST_AUCKLAND_AREAS.map(normalizeArea));

function normalizeArea(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function matchedArea(value: string) {
  const normalized = normalizeArea(value);
  return NORTHWEST_AUCKLAND_AREAS.find((area) => normalizeArea(area) === normalized);
}

/**
 * Profiles qualify only when their stated base suburb or listed travel area is
 * an exact Northwest Auckland locality. Broad "West Auckland" coverage alone
 * is deliberately not treated as a confirmed match for this local directory.
 */
export function getNorthwestAucklandNannies(nannies: NannyProfilePublic[]) {
  return nannies.filter((nanny) =>
    [nanny.suburb, ...nanny.areasCovered].some((area) => NORMALIZED_AREAS.has(normalizeArea(area))),
  );
}

/** Returns the named localities that current profiles explicitly cover. */
export function getNorthwestAucklandCoverage(nannies: NannyProfilePublic[]) {
  const areas = new Set<string>();

  nannies.forEach((nanny) => {
    [nanny.suburb, ...nanny.areasCovered].forEach((area) => {
      const match = matchedArea(area);
      if (match) areas.add(match);
    });
  });

  return [...areas];
}

/**
 * A local landing page needs more than a single profile before it is promoted
 * to search engines: three profiles across two named localities is the minimum
 * inventory gate for this Northwest cluster.
 */
export function hasIndexableNorthwestAucklandCoverage(nannies: NannyProfilePublic[]) {
  return nannies.length >= 3 && getNorthwestAucklandCoverage(nannies).length >= 2;
}
