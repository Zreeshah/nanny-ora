import assert from "node:assert/strict";
import { familyOnboardingSchema } from "./index";

const valid = {
  name: "Alex Parent",
  email: "alex@example.test",
  phone: "021 123 4567",
  password: "safe-pass-123",
  suburb: "Hobsonville",
  childAgeRange: ["toddler"],
  careTypeNeeded: ["after_school"],
  primaryCareType: "after_school",
  preferredDays: "Monday to Friday, 3pm–6pm",
  startDate: "2026-12-01",
  specialistNeeds: "",
  notes: "",
  title: "After-school nanny for two children",
  childCount: 2,
  childAges: "4 and 7",
  hourlyBudget: 32,
  jobDescription: "School pick-up, afternoon tea and a calm homework routine.",
};

assert.equal(familyOnboardingSchema.safeParse(valid).success, true);

assert.equal(
  familyOnboardingSchema.safeParse({ ...valid, jobDescription: "Too short" }).success,
  false,
  "a family account cannot be submitted without a substantive first job description",
);

assert.equal(
  familyOnboardingSchema.safeParse({ ...valid, primaryCareType: "newborn" }).success,
  false,
  "the job's primary care type must be one of the care needs selected by the family",
);

console.log("onboarding.test.ts: ok");
