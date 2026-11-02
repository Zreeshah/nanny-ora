"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { familyOnboardingSchema, type FamilyOnboardingInput, type ParentIntakeInput } from "@/lib/validations";
import { parseFamilyProfileNotes, serialiseFamilyProfileNotes } from "@/lib/family-profile-notes";
import { sendParentWelcome, notifyAdminNewFamilyCareBrief } from "@/lib/email";
import { getNannyMatchesForJob } from "./matching-notifications";
import type { ActionResult } from "./auth";
import bcrypt from "bcryptjs";

/**
 * Creates a family account, their profile and their first job in one atomic
 * transaction. The job is PENDING until an admin reviews it; it is never made
 * public simply because an account was created.
 */
export async function registerParentWithFirstJob(input: FamilyOnboardingInput): Promise<ActionResult> {
  try {
    const parsed = familyOnboardingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const {
      name, email, phone, suburb, childAgeRange, careTypeNeeded, preferredDays,
      startDate, specialistNeeds, careLocations, notes, password, primaryCareType, title,
      childCount, childAges, hourlyBudget, jobDescription,
    } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Account, care profile and first job must succeed or fail together.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: "PARENT",
        },
      });

      const profile = await tx.parentProfile.create({
        data: {
          userId: user.id,
          suburb,
          childAgeRange: JSON.stringify(childAgeRange),
          careTypeNeeded: JSON.stringify(careTypeNeeded),
          preferredDays,
          startDate: startDate || null,
          specialistNeeds: specialistNeeds || "",
          notes: serialiseFamilyProfileNotes(careLocations, notes),
        },
      });

      const job = await tx.jobPost.create({
        data: {
          parentId: user.id,
          title,
          suburb,
          careType: primaryCareType,
          daysRequired: preferredDays,
          childCount,
          childAges,
          startDate,
          hourlyBudget,
          specialistSupport: specialistNeeds || "",
          description: careLocations.trim()
            ? `${jobDescription.trim()}\n\nOther care locations or travel notes: ${careLocations.trim()}`
            : jobDescription,
          status: "PENDING",
          contactEmail: email,
          contactPhone: phone || null,
        },
      });

      return { userId: user.id, profileId: profile.id, jobId: job.id };
    });

    // The family receives one confirmation with public match previews only.
    // An admin receives one actionable review notification. Delivery failures
    // never undo the successful registration transaction.
    let matches: Awaited<ReturnType<typeof getNannyMatchesForJob>> = [];
    try {
      matches = await getNannyMatchesForJob({
        id: result.jobId,
        suburb,
        careType: primaryCareType,
        hourlyBudget,
      });
    } catch (error) {
      // A matching lookup is helpful, but must never make a successfully saved
      // account and care brief appear to fail to the family.
      console.error("Initial nanny match lookup failed:", error);
    }
    await Promise.allSettled([
      sendParentWelcome(name, email, { jobTitle: title, matchPreviews: matches.slice(0, 3), matchCount: matches.length }),
      notifyAdminNewFamilyCareBrief(name, email, title, suburb),
    ]);

    return { success: true, data: { ...result, matchCount: matches.length } };
  } catch (error) {
    console.error("Register parent with first job error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateParentProfile(data: Partial<ParentIntakeInput>): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "PARENT") {
      return { success: false, error: "Unauthorised" };
    }

    const profile = await prisma.parentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const storedNotes = parseFamilyProfileNotes(profile.notes);
    const shouldUpdateNotes = data.careLocations !== undefined || data.notes !== undefined;

    await prisma.parentProfile.update({
      where: { id: profile.id },
      data: {
        ...(data.suburb && { suburb: data.suburb }),
        ...(data.childAgeRange && { childAgeRange: JSON.stringify(data.childAgeRange) }),
        ...(data.careTypeNeeded && { careTypeNeeded: JSON.stringify(data.careTypeNeeded) }),
        ...(data.preferredDays && { preferredDays: data.preferredDays }),
        ...(data.startDate !== undefined && { startDate: data.startDate || null }),
        ...(data.specialistNeeds !== undefined && { specialistNeeds: data.specialistNeeds || "" }),
        ...(shouldUpdateNotes && {
          notes: serialiseFamilyProfileNotes(
            data.careLocations ?? storedNotes.careLocations,
            data.notes ?? storedNotes.additionalNotes,
          ),
        }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update parent profile error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Current parent's profile for the edit form. */
export async function getMyParentProfile(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "PARENT") {
      return { success: false, error: "Unauthorised" };
    }
    const profile = await prisma.parentProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return { success: true, data: null };
    const parse = (v: string) => { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } };
    const storedNotes = parseFamilyProfileNotes(profile.notes);
    return {
      success: true,
      data: {
        suburb: profile.suburb,
        childAgeRange: parse(profile.childAgeRange),
        careTypeNeeded: parse(profile.careTypeNeeded),
        preferredDays: profile.preferredDays,
        startDate: profile.startDate || "",
        specialistNeeds: profile.specialistNeeds,
        careLocations: storedNotes.careLocations,
        notes: storedNotes.additionalNotes,
      },
    };
  } catch (error) {
    console.error("getMyParentProfile error:", error);
    return { success: false, error: "Failed to load profile." };
  }
}
