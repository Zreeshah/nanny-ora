// ============================================================
// NannyOra — Shared Constants
// ============================================================

// --- User Roles ---
export const USER_ROLES = {
  PARENT: "PARENT",
  NANNY: "NANNY",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// --- Verification Levels ---
export const VERIFICATION_LEVELS = {
  LISTED: "LISTED",
  VERIFIED: "VERIFIED",
  PREMIUM_VETTED: "PREMIUM_VETTED",
  SPECIALIST: "SPECIALIST",
} as const;
export type VerificationLevel =
  (typeof VERIFICATION_LEVELS)[keyof typeof VERIFICATION_LEVELS];

export const VERIFICATION_LEVEL_LABELS: Record<VerificationLevel, string> = {
  LISTED: "Listed Nanny",
  VERIFIED: "Verified Nanny",
  PREMIUM_VETTED: "Premium Vetted Nanny",
  SPECIALIST: "Specialist Care Nanny",
};

export const VERIFICATION_LEVEL_ORDER: VerificationLevel[] = [
  "LISTED",
  "VERIFIED",
  "PREMIUM_VETTED",
  "SPECIALIST",
];

// --- Nanny Admin Statuses ---
export const NANNY_ADMIN_STATUSES = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  VERIFIED: "VERIFIED",
  SPECIALIST: "SPECIALIST",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
} as const;
export type NannyAdminStatus =
  (typeof NANNY_ADMIN_STATUSES)[keyof typeof NANNY_ADMIN_STATUSES];

export const NANNY_STATUS_LABELS: Record<NannyAdminStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  VERIFIED: "Verified",
  SPECIALIST: "Specialist",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
};

// --- Job Post Statuses ---
export const JOB_POST_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
} as const;
export type JobPostStatus =
  (typeof JOB_POST_STATUSES)[keyof typeof JOB_POST_STATUSES];

// --- Enquiry Statuses ---
export const ENQUIRY_STATUSES = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  MATCHED: "MATCHED",
  CLOSED: "CLOSED",
} as const;
export type EnquiryStatus =
  (typeof ENQUIRY_STATUSES)[keyof typeof ENQUIRY_STATUSES];

// --- Care Types ---
export const CARE_TYPES = [
  { value: "casual_babysitting", label: "Casual Babysitting" },
  { value: "recurring_nanny", label: "Recurring Nanny Care" },
  { value: "after_school", label: "After-School Care" },
  { value: "weekend", label: "Weekend Care" },
  { value: "emergency_backup", label: "Emergency Backup Care" },
  { value: "specialist_sensory", label: "Specialist Sensory-Aware Care" },
] as const;
export type CareTypeValue = (typeof CARE_TYPES)[number]["value"];

// --- Specialist Tags ---
export const SPECIALIST_TAGS = [
  { value: "sensory_aware", label: "Sensory-Aware Care" },
  { value: "neurodiverse", label: "Neurodiverse Experience" },
  { value: "autism_support", label: "Autism Support Experience" },
  { value: "adhd_support", label: "ADHD Support Experience" },
  { value: "ece_background", label: "ECE Background" },
  { value: "registered_teacher", label: "Registered Teacher" },
  { value: "early_intervention", label: "Early Intervention Experience" },
  { value: "first_aid", label: "First Aid Certified" },
  { value: "baby_experience", label: "Baby Experience" },
  { value: "after_school_care", label: "After-School Care" },
] as const;
export type SpecialistTagValue = (typeof SPECIALIST_TAGS)[number]["value"];

// --- Auckland Suburbs ---
export const AUCKLAND_SUBURBS = [
  "Remuera",
  "Mount Eden",
  "Ponsonby",
  "Grey Lynn",
  "Devonport",
  "Takapuna",
  "Newmarket",
  "Epsom",
  "Albany",
  "Henderson",
  "Parnell",
  "Herne Bay",
  "Mission Bay",
  "St Heliers",
  "Meadowbank",
  "Kohimarama",
  "Ellerslie",
  "Mt Albert",
  "Titirangi",
  "Birkenhead",
] as const;

// Suburb slug mapping for SEO pages
export const SUBURB_SLUGS: Record<string, string> = {
  remuera: "Remuera",
  "mount-eden": "Mount Eden",
  ponsonby: "Ponsonby",
  "grey-lynn": "Grey Lynn",
  devonport: "Devonport",
  takapuna: "Takapuna",
  newmarket: "Newmarket",
  epsom: "Epsom",
  albany: "Albany",
  henderson: "Henderson",
  parnell: "Parnell",
  "herne-bay": "Herne Bay",
  "mission-bay": "Mission Bay",
  "st-heliers": "St Heliers",
  meadowbank: "Meadowbank",
  kohimarama: "Kohimarama",
  ellerslie: "Ellerslie",
  "mt-albert": "Mt Albert",
  titirangi: "Titirangi",
  birkenhead: "Birkenhead",
};

// --- Document Types ---
export const DOCUMENT_TYPES = {
  ID: "ID",
  REFERENCES: "REFERENCES",
  FIRST_AID_CERT: "FIRST_AID_CERT",
  POLICE_VET: "POLICE_VET",
  TEACHER_REGISTRATION: "TEACHER_REGISTRATION",
  WORK_HISTORY: "WORK_HISTORY",
  PROFESSIONAL_REGISTRATION: "PROFESSIONAL_REGISTRATION",
  REFEREE_LETTER: "REFEREE_LETTER",
} as const;
export type DocumentType =
  (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ID: "Photo ID (Passport / Birth Certificate / RealMe)",
  REFERENCES: "References",
  FIRST_AID_CERT: "First Aid Certificate",
  POLICE_VET: "NZ Police Vet Result",
  TEACHER_REGISTRATION: "Teacher Registration / ECE Qualification",
  WORK_HISTORY: "Work History / CV / Employment References",
  PROFESSIONAL_REGISTRATION: "Professional Registration Certificate",
  REFEREE_LETTER: "Referee Reference Letter",
};

// --- Safety Check Statuses ---
export const SAFETY_CHECK_STATUSES = {
  NOT_STARTED: "NOT_STARTED",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;
export type SafetyCheckStatus =
  (typeof SAFETY_CHECK_STATUSES)[keyof typeof SAFETY_CHECK_STATUSES];

export const SAFETY_CHECK_STATUS_LABELS: Record<SafetyCheckStatus, string> = {
  NOT_STARTED: "Not Started",
  SUBMITTED: "Submitted",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

// --- 7 Safety Vetting Checks ---
export const SAFETY_CHECKS = [
  {
    key: "identityVerified" as const,
    number: 1,
    title: "Verify Identity",
    description: "Check and confirm identity using official documents (e.g., passport, birth certificate or RealMe).",
    documentType: "ID" as DocumentType,
    nannyUploadable: true,
  },
  {
    key: "workHistoryVerified" as const,
    number: 2,
    title: "Work History",
    description: "Gather and thoroughly verify previous employment history.",
    documentType: "WORK_HISTORY" as DocumentType,
    nannyUploadable: true,
  },
  {
    key: "proRegVerified" as const,
    number: 3,
    title: "Professional Registration",
    description: "Contact relevant professional bodies (e.g., Teaching Council of Auckland, NZ) to ensure current, valid credentials.",
    documentType: "PROFESSIONAL_REGISTRATION" as DocumentType,
    nannyUploadable: true,
  },
  {
    key: "refereeCheckStatus" as const,
    number: 4,
    title: "Referee Checks",
    description: "Contact at least one non-family referee to verify character and suitability.",
    documentType: "REFEREE_LETTER" as DocumentType,
    nannyUploadable: true,
  },
  {
    key: "policeVetStatus" as const,
    number: 5,
    title: "Police Vet",
    description: "Obtain a satisfactory New Zealand Police Vet check.",
    documentType: "POLICE_VET" as DocumentType,
    nannyUploadable: true,
  },
  {
    key: "interviewStatus" as const,
    number: 6,
    title: "Interview",
    description: "Conduct an interview focused on safety and suitability for working with children.",
    documentType: null,
    nannyUploadable: false,
  },
  {
    key: "riskAssessmentStatus" as const,
    number: 7,
    title: "Risk Assessment",
    description: "Synthesize all gathered information to formally assess whether the person poses any risk to children.",
    documentType: null,
    nannyUploadable: false,
  },
] as const;

// --- Document Review Statuses ---
export const DOCUMENT_REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

// --- Experience Levels ---
export const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "10+ years" },
] as const;

// --- Availability Options ---
export const AVAILABILITY_OPTIONS = [
  { value: "weekday_morning", label: "Weekday Mornings" },
  { value: "weekday_afternoon", label: "Weekday Afternoons" },
  { value: "weekday_evening", label: "Weekday Evenings" },
  { value: "weekend_morning", label: "Weekend Mornings" },
  { value: "weekend_afternoon", label: "Weekend Afternoons" },
  { value: "weekend_evening", label: "Weekend Evenings" },
  { value: "overnight", label: "Overnight" },
  { value: "flexible", label: "Flexible" },
] as const;

// --- Child Age Ranges ---
export const CHILD_AGE_RANGES = [
  { value: "newborn", label: "Newborn (0–6 months)" },
  { value: "infant", label: "Infant (6–12 months)" },
  { value: "toddler", label: "Toddler (1–3 years)" },
  { value: "preschool", label: "Preschool (3–5 years)" },
  { value: "school_age", label: "School Age (5–12 years)" },
  { value: "teenager", label: "Teenager (12+)" },
] as const;

// --- Rate Range ---
export const RATE_RANGE = {
  min: 20,
  max: 80,
  step: 5,
  currency: "NZD",
} as const;
