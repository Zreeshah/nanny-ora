"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { nannyApplicationSchema, type NannyApplicationInput } from "@/lib/validations";
import type { ActionResult } from "./auth";
import bcrypt from "bcryptjs";

export async function applyAsNanny(
  input: NannyApplicationInput & {
    password: string;
    documents?: { documentType: string; fileName: string }[];
  }
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

      // Map document types to check status fields
      const checkFieldMap: Record<string, string> = {
        ID: "identityVerified",
        WORK_HISTORY: "workHistoryVerified",
        PROFESSIONAL_REGISTRATION: "proRegVerified",
        REFEREE_LETTER: "refereeCheckStatus",
        POLICE_VET: "policeVetStatus",
      };

      const safetyChecksUpdate: Record<string, string> = {};
      if (input.documents) {
        for (const doc of input.documents) {
          const field = checkFieldMap[doc.documentType];
          if (field) {
            safetyChecksUpdate[field] = "SUBMITTED";
          }
        }
      }

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
          refereeData: JSON.stringify(data.refereeData || []),
          verificationLevel: "LISTED",
          adminStatus: "SUBMITTED",
          ...safetyChecksUpdate,
        },
      });

      if (input.documents && input.documents.length > 0) {
        await tx.nannyDocument.createMany({
          data: input.documents.map((doc) => ({
            nannyProfileId: profile.id,
            documentType: doc.documentType,
            fileName: doc.fileName,
            reviewStatus: "PENDING",
          })),
        });
      }

      return { userId: user.id, profileId: profile.id };
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Nanny application error:", error);
    const code = error?.code || "UNKNOWN";
    const msg = error?.message || String(error);
    return { success: false, error: `[${code}] ${msg}` };
  }
}

export async function updateNannyProfile(
  updates: Partial<NannyApplicationInput>
): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    if (!process.env.DATABASE_URL?.trim()) {
      return {
        success: false,
        error: "Profile saving is unavailable until the production database is configured.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Update user details
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.phone !== undefined && { phone: updates.phone || null }),
        },
      });

      // Upsert nanny profile details
      await tx.nannyProfile.upsert({
        where: { userId },
        create: {
          userId,
          suburb: updates.suburb || "",
          areasCovered: JSON.stringify(updates.areasCovered || []),
          yearsExperience: updates.yearsExperience !== undefined ? updates.yearsExperience : 0,
          careTypes: JSON.stringify(updates.careTypes || []),
          qualifications: updates.qualifications || "",
          eceExperience: updates.eceExperience || false,
          neurodiverseExperience: updates.neurodiverseExperience || false,
          firstAidCurrent: updates.firstAidCurrent || false,
          driverLicence: updates.driverLicence || false,
          hourlyRate: updates.hourlyRate !== undefined ? updates.hourlyRate : 25,
          bio: updates.bio || "",
          availability: JSON.stringify(updates.availability || []),
          specialistTags: JSON.stringify(updates.specialistTags || []),
          refereeData: JSON.stringify(updates.refereeData || []),
        },
        update: {
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
          ...(updates.refereeData !== undefined && { refereeData: JSON.stringify(updates.refereeData) }),
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Update nanny profile error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// --- Document Management ---

export async function uploadNannyDocument(
  documentType: string,
  fileName: string,
  fileUrl?: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    const profile = await prisma.nannyProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return { success: false, error: "Nanny profile not found. Please complete your profile first." };
    }

    const doc = await prisma.nannyDocument.create({
      data: {
        nannyProfileId: profile.id,
        documentType,
        fileName,
        fileUrl: fileUrl || null,
        reviewStatus: "PENDING",
      },
    });

    // Auto-update the corresponding safety check status to SUBMITTED
    const checkFieldMap: Record<string, string> = {
      ID: "identityVerified",
      WORK_HISTORY: "workHistoryVerified",
      PROFESSIONAL_REGISTRATION: "proRegVerified",
      REFEREE_LETTER: "refereeCheckStatus",
      POLICE_VET: "policeVetStatus",
    };

    const checkField = checkFieldMap[documentType];
    if (checkField) {
      const currentStatus = (profile as any)[checkField];
      // Only update to SUBMITTED if currently NOT_STARTED or REJECTED
      if (currentStatus === "NOT_STARTED" || currentStatus === "REJECTED") {
        await prisma.nannyProfile.update({
          where: { id: profile.id },
          data: { [checkField]: "SUBMITTED" },
        });
      }
    }

    return { success: true, data: { documentId: doc.id } };
  } catch (error) {
    console.error("Upload nanny document error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteNannyDocument(
  documentId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    const profile = await prisma.nannyProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return { success: false, error: "Nanny profile not found." };
    }

    // Verify the document belongs to this nanny
    const doc = await prisma.nannyDocument.findUnique({
      where: { id: documentId },
    });
    if (!doc || doc.nannyProfileId !== profile.id) {
      return { success: false, error: "Document not found or access denied." };
    }

    // Only allow deletion of PENDING documents
    if (doc.reviewStatus !== "PENDING") {
      return { success: false, error: "Cannot delete a document that has already been reviewed." };
    }

    await prisma.nannyDocument.delete({
      where: { id: documentId },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete nanny document error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getNannyDocuments(): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    const profile = await prisma.nannyProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return { success: true, data: [] };
    }

    const documents = await prisma.nannyDocument.findMany({
      where: { nannyProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: documents };
  } catch (error) {
    console.error("Get nanny documents error:", error);
    return { success: false, error: "Something went wrong." };
  }
}
