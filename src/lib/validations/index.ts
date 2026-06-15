// ============================================================
// NannyOra — Zod Validation Schemas
// ============================================================

import { z } from "zod";
import { CARE_TYPES, SPECIALIST_TAGS, AUCKLAND_SUBURBS } from "@/lib/constants";

const careTypeValues = CARE_TYPES.map((c) => c.value) as [string, ...string[]];
const specialistTagValues = SPECIALIST_TAGS.map((s) => s.value) as [string, ...string[]];
const suburbValues = AUCKLAND_SUBURBS as unknown as [string, ...string[]];

// --- Auth Schemas ---
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PARENT", "NANNY"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// --- Parent Intake Schema ---
export const parentIntakeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  suburb: z.string().min(1, "Please select a suburb"),
  childAgeRange: z.array(z.string()).min(1, "Please select at least one age range"),
  careTypeNeeded: z.array(z.string()).min(1, "Please select at least one care type"),
  preferredDays: z.string().min(1, "Please describe your preferred days/times"),
  startDate: z.string().optional(),
  specialistNeeds: z.string().optional(),
  notes: z.string().optional(),
});
export type ParentIntakeInput = z.infer<typeof parentIntakeSchema>;

// --- Nanny Application Schema ---
export const nannyApplicationSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  suburb: z.string().min(1, "Please select your suburb"),
  areasCovered: z.array(z.string()).min(1, "Select at least one area you cover"),
  yearsExperience: z.coerce.number().min(0, "Years of experience is required"),
  careTypes: z.array(z.enum(careTypeValues)).min(1, "Select at least one care type"),
  qualifications: z.string().optional(),
  eceExperience: z.boolean().default(false),
  neurodiverseExperience: z.boolean().default(false),
  firstAidCurrent: z.boolean().default(false),
  driverLicence: z.boolean().default(false),
  hourlyRate: z.coerce.number().min(20, "Minimum rate is $20/hr").max(150, "Maximum rate is $150/hr"),
  bio: z.string().min(20, "Please write at least a short bio (20 characters)"),
  availability: z.array(z.string()).min(1, "Select at least one availability slot"),
  specialistTags: z.array(z.enum(specialistTagValues)).optional().default([]),
});
export type NannyApplicationInput = z.infer<typeof nannyApplicationSchema>;

// --- Job Post Schema ---
export const jobPostSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  suburb: z.string().min(1, "Please select a suburb"),
  careType: z.enum(careTypeValues),
  daysRequired: z.string().min(1, "Please describe days/times required"),
  childCount: z.coerce.number().min(1, "At least one child"),
  childAges: z.string().min(1, "Please describe children's ages"),
  startDate: z.string().min(1, "Start date is required"),
  hourlyBudget: z.coerce.number().min(20, "Minimum budget is $20/hr"),
  specialistSupport: z.string().optional().default(""),
  description: z.string().min(20, "Please provide more detail (at least 20 characters)"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().optional(),
});
export type JobPostInput = z.infer<typeof jobPostSchema>;

// --- Enquiry Schema ---
export const enquirySchema = z.object({
  nannyId: z.string().min(1, "Nanny ID is required"),
  message: z.string().min(10, "Please write a message (at least 10 characters)"),
  contactEmail: z.string().email("Please enter your email"),
  contactPhone: z.string().optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
