"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { parentIntakeSchema, type ParentIntakeInput } from "@/lib/validations";
import { sendParentWelcome, notifyAdminNewParent } from "@/lib/email";
import type { ActionResult } from "./auth";
import bcrypt from "bcryptjs";

export async function registerParent(input: ParentIntakeInput & { password: string }): Promise<ActionResult> {
  try {
    const parsed = parentIntakeSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const { name, email, phone, suburb, childAgeRange, careTypeNeeded, preferredDays, startDate, specialistNeeds, notes } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Create user + parent profile in a transaction
    const passwordHash = await bcrypt.hash(input.password || "temp123456", 10);

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
          notes: notes || "",
        },
      });

      return { userId: user.id, profileId: profile.id };
    });

    // Best-effort welcome + admin notification.
    await sendParentWelcome(name, email);
    await notifyAdminNewParent(name, email);

    return { success: true, data: result };
  } catch (error) {
    console.error("Register parent error:", error);
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

    await prisma.parentProfile.update({
      where: { id: profile.id },
      data: {
        ...(data.suburb && { suburb: data.suburb }),
        ...(data.childAgeRange && { childAgeRange: JSON.stringify(data.childAgeRange) }),
        ...(data.careTypeNeeded && { careTypeNeeded: JSON.stringify(data.careTypeNeeded) }),
        ...(data.preferredDays && { preferredDays: data.preferredDays }),
        ...(data.startDate !== undefined && { startDate: data.startDate || null }),
        ...(data.specialistNeeds !== undefined && { specialistNeeds: data.specialistNeeds || "" }),
        ...(data.notes !== undefined && { notes: data.notes || "" }),
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
    return {
      success: true,
      data: {
        suburb: profile.suburb,
        childAgeRange: parse(profile.childAgeRange),
        careTypeNeeded: parse(profile.careTypeNeeded),
        preferredDays: profile.preferredDays,
        startDate: profile.startDate || "",
        specialistNeeds: profile.specialistNeeds,
        notes: profile.notes,
      },
    };
  } catch (error) {
    console.error("getMyParentProfile error:", error);
    return { success: false, error: "Failed to load profile." };
  }
}
