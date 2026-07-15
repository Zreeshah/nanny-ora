"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { nannyApplicationSchema, type NannyApplicationInput } from "@/lib/validations";
import { supabaseServer, SUPABASE_BUCKET } from "@/lib/supabase/server";
import { sendRefereeRequests, sendNannyWelcome, notifyAdminNewNanny } from "@/lib/email";
import type { ActionResult } from "./auth";
import bcrypt from "bcryptjs";

const DOC_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const DOC_ALLOWED_TYPES: Record<string, boolean> = {
  "application/pdf": true,
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
};

function validateDoc(file: File): string | null {
  if (file.size > DOC_MAX_BYTES) return "Each document must be under 5MB.";
  if (!DOC_ALLOWED_TYPES[file.type]) return "Documents must be PDF, JPG, PNG, or WebP.";
  return null;
}

export async function applyAsNanny(
  input: NannyApplicationInput & {
    password: string;
    documents?: { documentType: string; file: File }[];
    policeVetAuthorized?: boolean;
    proRegNotApplicable?: boolean;
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

    // Upload vetting documents to Supabase Storage (server-side, using service_role key).
    // This happens BEFORE the DB transaction so we don't hold a DB connection during file IO.
    const uploadedDocs: { documentType: string; fileName: string; fileUrl: string }[] = [];
    if (input.documents && input.documents.length > 0) {
      for (const doc of input.documents) {
        const file = doc.file;
        const docErr = validateDoc(file);
        if (docErr) return { success: false, error: docErr };
        const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const arrayBuffer = await file.arrayBuffer();
        const { error: upErr } = await supabaseServer
          .storage
          .from(SUPABASE_BUCKET)
          .upload(path, arrayBuffer, {
            upsert: false,
            contentType: file.type || "application/octet-stream",
          });
        if (upErr) {
          return { success: false, error: `Failed to upload ${file.name}: ${upErr.message}` };
        }
        uploadedDocs.push({ documentType: doc.documentType, fileName: file.name, fileUrl: path });
      }
    }

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
          languages: JSON.stringify(data.languages || []),
          availabilitySummary: data.availabilitySummary || "",
          refereeData: JSON.stringify(data.refereeData || []),
          verificationLevel: "LISTED",
          adminStatus: "SUBMITTED",
          policeVetAuthorized: input.policeVetAuthorized || false,
          policeVetAuthorizedAt: input.policeVetAuthorized ? new Date() : null,
          ...safetyChecksUpdate,
          // N/A wins over any uploaded pro-reg doc (upload is disabled in the UI when N/A)
          ...(input.proRegNotApplicable ? { proRegVerified: "NOT_APPLICABLE" } : {}),
        },
      });

      if (uploadedDocs.length > 0) {
        await tx.nannyDocument.createMany({
          data: uploadedDocs.map((doc) => ({
            nannyProfileId: profile.id,
            documentType: doc.documentType,
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            reviewStatus: "PENDING",
          })),
        });
      }

      return { userId: user.id, profileId: profile.id };
    });

    // Best-effort lifecycle emails — none may break the application.
    await sendNannyWelcome(data.name, data.email);
    await notifyAdminNewNanny(data.name, data.email);

    // Auto-email referees a reference request.
    if (data.refereeData && data.refereeData.length > 0) {
      const { sent, failed } = await sendRefereeRequests(data.name, data.refereeData);
      console.log(`Referee requests for ${data.email}: ${sent} sent, ${failed.length} failed`);
    }

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
          languages: JSON.stringify(updates.languages || []),
          availabilitySummary: updates.availabilitySummary || "",
          payoutPaypalEmail: updates.payoutPaypalEmail || null,
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
          ...(updates.languages && { languages: JSON.stringify(updates.languages) }),
          ...(updates.availabilitySummary !== undefined && { availabilitySummary: updates.availabilitySummary }),
          ...(updates.payoutPaypalEmail !== undefined && { payoutPaypalEmail: updates.payoutPaypalEmail || null }),
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
  file: File
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

    const docErr = validateDoc(file);
    if (docErr) return { success: false, error: docErr };

    // Upload the file to Supabase Storage
    const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
    const storagePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await supabaseServer
      .storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, arrayBuffer, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (upErr) {
      console.error("Storage upload error:", upErr);
      return { success: false, error: `Failed to upload file: ${upErr.message}` };
    }

    const doc = await prisma.nannyDocument.create({
      data: {
        nannyProfileId: profile.id,
        documentType,
        fileName: file.name,
        fileUrl: storagePath,
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

    return { success: true, data: { documentId: doc.id, fileUrl: storagePath } };
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

// --- Profile Photo ---

const PHOTO_BUCKET = "nanny-photos"; // public bucket; vetting docs stay in the private one
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Upload/replace the nanny's public profile photo. Live immediately — admin recourse is suspending the profile. */
export async function uploadProfilePhoto(file: File): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }

    const ext = PHOTO_TYPES[file.type];
    if (!ext) return { success: false, error: "Please upload a JPG, PNG, or WebP image." };
    if (file.size > PHOTO_MAX_BYTES) return { success: false, error: "Photo must be under 5MB." };

    const profile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) return { success: false, error: "Complete your profile first." };

    const path = `photos/${userId}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: upErr } = await supabaseServer.storage
      .from(PHOTO_BUCKET)
      .upload(path, arrayBuffer, { upsert: true, contentType: file.type });
    if (upErr) {
      console.error("Photo upload error:", upErr);
      return { success: false, error: `Upload failed: ${upErr.message}` };
    }

    const { data } = supabaseServer.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    // cache-bust so a replaced photo shows immediately despite the stable path
    const url = `${data.publicUrl}?v=${Date.now()}`;
    await prisma.nannyProfile.update({ where: { id: profile.id }, data: { profileImageUrl: url } });

    return { success: true, data: { url } };
  } catch (error) {
    console.error("uploadProfilePhoto error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/** Nanny toggles Professional Registration as not applicable. Only flips between
 *  NOT_STARTED and NOT_APPLICABLE — never clobbers a submitted/verified check. */
export async function setProRegApplicability(notApplicable: boolean): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Unauthorised" };
    }
    const profile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true, proRegVerified: true } });
    if (!profile) return { success: false, error: "Complete your profile first." };
    if (!["NOT_STARTED", "NOT_APPLICABLE"].includes(profile.proRegVerified)) {
      return { success: false, error: "This check is already in review — contact the agency to change it." };
    }
    await prisma.nannyProfile.update({
      where: { id: profile.id },
      data: { proRegVerified: notApplicable ? "NOT_APPLICABLE" : "NOT_STARTED" },
    });
    return { success: true, data: { status: notApplicable ? "NOT_APPLICABLE" : "NOT_STARTED" } };
  } catch (error) {
    console.error("setProRegApplicability error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
