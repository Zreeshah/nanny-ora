// ============================================================
// NannyOra — Shared TypeScript Types
// (DB row shapes come from @prisma/client; this file holds only
// hand-shaped types that differ from the raw rows.)
// ============================================================

import type {
  VerificationLevel,
  CareTypeValue,
  SpecialistTagValue,
} from "@/lib/constants";

// --- Nanny Profile (public-facing) ---
export interface NannyProfilePublic {
  id: string;
  userId: string;
  name: string;
  suburb: string;
  areasCovered: string[];
  yearsExperience: number;
  careTypes: CareTypeValue[];
  qualifications: string[];
  eceExperience: boolean;
  neurodiverseExperience: boolean;
  firstAidCurrent: boolean;
  driverLicence: boolean;
  hourlyRate: number;
  bio: string;
  availabilitySummary: string;
  availability: string[];
  specialistTags: SpecialistTagValue[];
  languages: string[];
  verificationLevel: VerificationLevel;
  tier: string; // NONE, LISTED, PREMIUM — drives the Premium badge + search priority
  profileImageUrl?: string;
  createdAt: Date;
  // placement/availability (admin-managed; paidConfirmed intentionally excluded — internal)
  placementStatus: string;
  trialDate?: string | null;
  placementStart?: string | null;
  placementEnd?: string | null;
  placementNote?: string | null;
}
