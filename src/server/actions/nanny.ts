"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { nannyApplicationSchema, type NannyApplicationInput } from "@/lib/validations";
import type { ActionResult } from "./auth";
import bcrypt from "bcryptjs";

export async function applyAsNanny(
  input: NannyApplicationInput & { password: string }
): Promise<ActionResult> {
  try {
    const parsed = nannyApplicationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(input.password || "temp123456", 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: "NANNY",
        },
      });

      const profile = await tx.nannyProfile.create({
        data: {
          userId: user.id,
          suburb: data.suburb,
          areasCovered: JSON.stringify(data.areasCovered),
          yearsExperience: data.yearsExperience,
          careTypes: JSON.stringify(data.careTypes),
          qualifications: data.qualifications || "",
          eceExperience: data.eceExperience,
          neurodiverseExperience: data.neurodiverseExperience,
          firstAidCurrent: data.firstAidCurrent,
          driverLicence: data.driverLicence,
          hourlyRate: data.hourlyRate,
          bio: data.bio,
          availability: JSON.stringify(data.availability),
          specialistTags: JSON.stringify(data.specialistTags || []),
          verificationLevel: "LISTED",
          adminStatus: "SUBMITTED",
        },
      });

      return { userId: user.id, profileId: profile.id };
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Nanny application error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateNannyProfile(
  updates: Partial<NannyApplicationInput>
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    const profile = await prisma.nannyProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    await prisma.nannyProfile.update({
      where: { id: profile.id },
      data: {
        ...(updates.suburb && { suburb: updates.suburb }),
        ...(updates.areasCovered && { areasCovered: JSON.stringify(updates.areasCovered) }),
        ...(updates.yearsExperience !== undefined && { yearsExperience: updates.yearsExperience }),
        ...(updates.careTypes && { careTypes: JSON.stringify(updates.careTypes) }),
        ...(updates.qualifications !== undefined && { qualifications: updates.qualifications }),
        ...(updates.eceExperience !== undefined && { eceExperience: updates.eceExperience }),
        ...(updates.neurodiverseExperience !== undefined && { neurodiverseExperience: updates.neurodiverseExperience }),
        ...(updates.firstAidCurrent !== undefined && { firstAidCurrent: updates.firstAidCurrent }),
        ...(updates.driverLicence !== undefined && { driverLicence: updates.driverLicence }),
        ...(updates.hourlyRate !== undefined && { hourlyRate: updates.hourlyRate }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.availability && { availability: JSON.stringify(updates.availability) }),
        ...(updates.specialistTags && { specialistTags: JSON.stringify(updates.specialistTags) }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update nanny profile error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
