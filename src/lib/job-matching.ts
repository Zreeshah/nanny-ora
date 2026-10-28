/**
 * Conservative matching used for marketplace notifications and the nanny
 * dashboard. It deliberately requires an exact stated suburb/travel-area
 * match; nearby areas and free-text specialist requirements need a human
 * conversation rather than an automated promise.
 */
export type MatchableJob = {
  id: string;
  suburb: string;
  careType: string;
  hourlyBudget: number;
};

export type MatchableNanny = {
  id: string;
  suburb: string;
  areasCovered: string;
  careTypes: string;
  hourlyRate: number;
  adminStatus: string;
  placementStatus: string;
};

export const PUBLIC_NANNY_STATUSES = new Set(["APPROVED", "VERIFIED", "SPECIALIST"]);

function normaliseLocation(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function isPublicNannyStatus(status: string) {
  return PUBLIC_NANNY_STATUSES.has(status);
}

export function nannyMatchesJob(nanny: MatchableNanny, job: MatchableJob) {
  if (!isPublicNannyStatus(nanny.adminStatus) || nanny.placementStatus !== "AVAILABLE") return false;
  if (nanny.hourlyRate > job.hourlyBudget) return false;
  if (!parseStringArray(nanny.careTypes).includes(job.careType)) return false;

  const requestedArea = normaliseLocation(job.suburb);
  return [nanny.suburb, ...parseStringArray(nanny.areasCovered)]
    .some((area) => normaliseLocation(area) === requestedArea);
}

