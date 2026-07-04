// ============================================================
// NannyOra — Public nanny directory data (DB-backed)
// Server-only: queries Prisma. Falls back to sample data when
// the DB has no approved nannies or is unreachable (demo mode).
// ============================================================

import type { NannyProfile } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { NannyProfilePublic } from "@/types";
import { filterNannies, sampleNannies, type NannyFilters } from "./sample-nannies";

// Only these admin statuses appear in the public directory
const PUBLIC_STATUSES = ["APPROVED", "VERIFIED", "SPECIALIST"];

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
    profileImageUrl: row.profileImageUrl ?? undefined,
    createdAt: row.createdAt,
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
    });
    if (rows.length > 0) return filterNannies(rows.map(toPublic), filters);
  } catch (error) {
    console.error("getPublicNannies DB error, using sample data:", error);
  }
  return filterNannies(sampleNannies, filters);
}

/** Single public nanny by profile id — DB first, then sample data. */
export async function getPublicNannyById(id: string): Promise<NannyProfilePublic | undefined> {
  try {
    const row = await prisma.nannyProfile.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (row && PUBLIC_STATUSES.includes(row.adminStatus)) return toPublic(row);
  } catch (error) {
    console.error("getPublicNannyById DB error, using sample data:", error);
  }
  return sampleNannies.find((n) => n.id === id);
}
