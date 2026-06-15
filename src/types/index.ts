// ============================================================
// NannyOra — Shared TypeScript Types
// ============================================================

import type {
  VerificationLevel,
  NannyAdminStatus,
  JobPostStatus,
  EnquiryStatus,
  CareTypeValue,
  SpecialistTagValue,
  UserRole,
  DocumentType,
} from "@/lib/constants";

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

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
  verificationLevel: VerificationLevel;
  profileImageUrl?: string;
  createdAt: Date;
}

// --- Nanny Profile (admin view, includes status) ---
export interface NannyProfileAdmin extends NannyProfilePublic {
  adminStatus: NannyAdminStatus;
  email: string;
  phone?: string;
  documents: NannyDocument[];
}

// --- Nanny Document ---
export interface NannyDocument {
  id: string;
  nannyProfileId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl?: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt?: Date;
  reviewedBy?: string;
}

// --- Job Post ---
export interface JobPost {
  id: string;
  parentId: string;
  parentName?: string;
  title: string;
  suburb: string;
  careType: CareTypeValue;
  daysRequired: string;
  childCount: number;
  childAges: string;
  startDate: string;
  hourlyBudget: number;
  specialistSupport: string;
  description: string;
  status: JobPostStatus;
  contactEmail: string;
  contactPhone?: string;
  createdAt: Date;
}

// --- Enquiry ---
export interface Enquiry {
  id: string;
  parentId: string;
  parentName?: string;
  nannyId: string;
  nannyName?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: Date;
}

// --- Review (placeholder) ---
export interface Review {
  id: string;
  parentId: string;
  parentName: string;
  nannyId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// --- Parent Profile ---
export interface ParentProfile {
  id: string;
  userId: string;
  suburb: string;
  childAgeRange: string[];
  careTypeNeeded: CareTypeValue[];
  preferredDays: string;
  startDate?: string;
  specialistNeeds: string;
  notes: string;
}

// --- Filter State for Directory ---
export interface NannyFilters {
  suburb?: string;
  availability?: string;
  careType?: CareTypeValue;
  experienceLevel?: string;
  verifiedOnly?: boolean;
  specialistSupport?: SpecialistTagValue;
  eceExperience?: boolean;
  firstAid?: boolean;
  driverLicence?: boolean;
  rateMin?: number;
  rateMax?: number;
  search?: string;
}

// --- Form submission results ---
export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

// --- Admin Stats ---
export interface AdminStats {
  pendingNannies: number;
  approvedNannies: number;
  pendingJobs: number;
  newEnquiries: number;
  totalParents: number;
  totalNannies: number;
}
