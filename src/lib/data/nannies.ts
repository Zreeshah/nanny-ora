// ============================================================
// NannyOra — Public nanny directory data (DB-backed)
// Server-only: queries Prisma for real approved nannies (no sample fallback).
// ============================================================

import type { NannyProfile } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { tierRank } from "@/lib/tiers";
import type { NannyProfilePublic } from "@/types";


// Only these admin statuses appear in the public directory
const PUBLIC_STATUSES = ["APPROVED", "VERIFIED", "SPECIALIST"];

export type NannyFilters = {
  suburb?: string;
  verifiedOnly?: boolean;
  specialistTag?: string;
  careType?: string;
  maxRate?: number;
  minRate?: number;
};

/** Apply directory filters to a DB-backed nanny list. */
export function filterNannies(nannies: NannyProfilePublic[], filters?: NannyFilters): NannyProfilePublic[] {
  let results = [...nannies];
  if (filters?.suburb) {
    results = results.filter(
      (n) => n.suburb.toLowerCase() === filters.suburb!.toLowerCase() ||
        n.areasCovered.some((a) => a.toLowerCase() === filters.suburb!.toLowerCase())
    );
  }
  if (filters?.verifiedOnly) results = results.filter((n) => n.verificationLevel !== "LISTED");
  if (filters?.specialistTag) results = results.filter((n) => (n.specialistTags as string[]).includes(filters.specialistTag!));
  if (filters?.careType) results = results.filter((n) => (n.careTypes as string[]).includes(filters.careType!));
  if (filters?.minRate) results = results.filter((n) => n.hourlyRate >= filters.minRate!);
  if (filters?.maxRate) results = results.filter((n) => n.hourlyRate <= filters.maxRate!);
  return results;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toPublic(row: NannyProfile & { user: { name: string } }): NannyProfilePublic {
  return {
    id: row.id,
    userId: row.userId,
    name: row.user.name,
    suburb: row.suburb,
    areasCovered: parseJsonArray(row.areasCovered),
    yearsExperience: row.yearsExperience,
    careTypes: parseJsonArray(row.careTypes) as NannyProfilePublic["careTypes"],
    qualifications: parseJsonArray(row.qualifications),
    eceExperience: row.eceExperience,
    neurodiverseExperience: row.neurodiverseExperience,
    firstAidCurrent: row.firstAidCurrent,
    driverLicence: row.driverLicence,
    hourlyRate: row.hourlyRate,
    bio: row.bio,
    availabilitySummary: row.availabilitySummary,
    availability: parseJsonArray(row.availability),
    specialistTags: parseJsonArray(row.specialistTags) as NannyProfilePublic["specialistTags"],
    languages: parseJsonArray(row.languages),
    verificationLevel: row.verificationLevel as NannyProfilePublic["verificationLevel"],
    tier: row.tier,
    profileImageUrl: row.profileImageUrl ?? undefined,
    createdAt: row.createdAt,
    placementStatus: row.placementStatus,
    trialDate: row.trialDate,
    placementStart: row.placementStart,
    placementEnd: row.placementEnd,
    placementNote: row.placementNote,
  };
}

/**
 * Approved nannies from the DB, filtered. Falls back to sample data
 * when the DB is empty or unreachable so the site never looks broken.
 */
export async function getPublicNannies(filters?: NannyFilters): Promise<NannyProfilePublic[]> {
  try {
    const rows = await prisma.nannyProfile.findMany({
      where: { adminStatus: { in: PUBLIC_STATUSES } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    // Priority placement: Premium above Listed above unpaid, newest-first within a tier.
    const ordered = rows.map(toPublic).sort((a, b) => tierRank(b.tier) - tierRank(a.tier));
    return filterNannies(ordered, filters);
  } catch (error) {
    console.error("getPublicNannies DB error:", error);
    return [];
  }
}

/** Single public nanny by profile id — DB first, then sample data. */
export async function getPublicNannyById(id: string): Promise<NannyProfilePublic | undefined> {
  try {
    const row = await prisma.nannyProfile.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (row && PUBLIC_STATUSES.includes(row.adminStatus)) return toPublic(row);
    return undefined;
  } catch (error) {
    console.error("getPublicNannyById DB error:", error);
    return undefined;
  }
}

/** Public reviews for a nanny profile (first name only for privacy). */
export async function getNannyReviews(nannyId: string): Promise<{ reviews: { id: string; rating: number; comment: string; reviewerFirstName: string; createdAt: Date }[]; avg: number }> {
  try {
    const rows = await prisma.review.findMany({
      where: { nannyId },
      include: { parent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const avg = rows.length ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10 : 0;
    return {
      reviews: rows.map((r) => ({ id: r.id, rating: r.rating, comment: r.comment, reviewerFirstName: r.parent.name.split(" ")[0], createdAt: r.createdAt })),
      avg,
    };
  } catch (error) {
    console.error("getNannyReviews error:", error);
    return { reviews: [], avg: 0 };
  }
}
