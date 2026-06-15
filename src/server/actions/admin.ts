"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import type { ActionResult } from "./auth";

// Helper to check admin access
async function requireAdmin(): Promise<ActionResult | null> {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Unauthorised — admin access required." };
  }
  return null;
}

// --- Nanny Management ---

export async function updateNannyStatus(
  nannyProfileId: string,
  adminStatus: string
): Promise<ActionResult> {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const profile = await prisma.nannyProfile.findUnique({
      where: { id: nannyProfileId },
    });
    if (!profile) return { success: false, error: "Nanny profile not found." };

    await prisma.nannyProfile.update({
      where: { id: nannyProfileId },
      data: { adminStatus },
    });

    return { success: true };
  } catch (error) {
    console.error("Update nanny status error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

export async function updateVerificationLevel(
  nannyProfileId: string,
  verificationLevel: "LISTED" | "VERIFIED" | "PREMIUM_VETTED" | "SPECIALIST"
): Promise<ActionResult> {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    await prisma.nannyProfile.update({
      where: { id: nannyProfileId },
      data: { verificationLevel },
    });

    return { success: true };
  } catch (error) {
    console.error("Update verification error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

// --- Document Review ---

export async function reviewDocument(
  documentId: string,
  reviewStatus: "APPROVED" | "REJECTED"
): Promise<ActionResult> {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const session = await auth();

    await prisma.nannyDocument.update({
      where: { id: documentId },
      data: {
        reviewStatus,
        reviewedAt: new Date(),
        reviewedBy: session!.user!.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Review document error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

// --- Admin Stats ---

export async function getAdminStats(): Promise<ActionResult> {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const [
      totalNannies,
      pendingNannies,
      approvedNannies,
      totalJobs,
      pendingJobs,
      newEnquiries,
      totalParents,
    ] = await Promise.all([
      prisma.nannyProfile.count(),
      prisma.nannyProfile.count({ where: { adminStatus: "SUBMITTED" } }),
      prisma.nannyProfile.count({ where: { adminStatus: "APPROVED" } }),
      prisma.jobPost.count(),
      prisma.jobPost.count({ where: { status: "PENDING" } }),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.parentProfile.count(),
    ]);

    return {
      success: true,
      data: {
        totalNannies,
        pendingNannies,
        approvedNannies,
        totalJobs,
        pendingJobs,
        newEnquiries,
        totalParents,
      },
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { success: false, error: "Failed to load stats." };
  }
}

// --- Get All Nannies (Admin) ---

export async function getAdminNannies(filters?: {
  adminStatus?: string;
}): Promise<ActionResult> {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const nannies = await prisma.nannyProfile.findMany({
      where: {
        ...(filters?.adminStatus && { adminStatus: filters.adminStatus }),
      },
      include: {
        user: { select: { name: true, email: true } },
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: nannies };
  } catch (error) {
    console.error("Get admin nannies error:", error);
    return { success: false, error: "Failed to load nannies." };
  }
}
