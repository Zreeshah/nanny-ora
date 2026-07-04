"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { enquirySchema, type EnquiryInput } from "@/lib/validations";
import { sendEnquiryReceipt, notifyAdminNewEnquiry, sendEnquiryStatusUpdate } from "@/lib/email";
import type { ActionResult } from "./auth";

export async function createEnquiry(input: EnquiryInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to send an enquiry." };
    }

    const parsed = enquirySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const { nannyId, message } = parsed.data;

    // Verify nanny profile exists
    const nanny = await prisma.nannyProfile.findUnique({
      where: { id: nannyId },
      include: { user: { select: { name: true } } },
    });
    if (!nanny) {
      return { success: false, error: "Nanny profile not found." };
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        parentId: session.user.id,
        nannyId,
        message,
        status: "NEW",
      },
    });

    // Best-effort: confirm to the parent and notify admin.
    const parentName = session.user.name || "there";
    const nannyName = nanny.user.name;
    if (session.user.email) await sendEnquiryReceipt(parentName, session.user.email, nannyName);
    await notifyAdminNewEnquiry(parentName, nannyName, message);

    return { success: true, data: { enquiryId: enquiry.id } };
  } catch (error) {
    console.error("Create enquiry error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: "CONTACTED" | "MATCHED" | "CLOSED"
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Unauthorised" };
    }

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status },
      include: {
        parent: { select: { name: true, email: true } },
        nanny: { include: { user: { select: { name: true } } } },
      },
    });

    // Best-effort: notify the parent of the admin's update.
    if (updated.parent.email) {
      await sendEnquiryStatusUpdate(updated.parent.name, updated.parent.email, updated.nanny.user.name, status);
    }

    return { success: true };
  } catch (error) {
    console.error("Update enquiry status error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

export async function getEnquiries(filters?: {
  status?: string;
  nannyId?: string;
  parentId?: string;
}): Promise<ActionResult> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.nannyId && { nannyId: filters.nannyId }),
        ...(filters?.parentId && { parentId: filters.parentId }),
      },
      include: {
        parent: {
          select: { name: true, email: true },
        },
        nanny: {
          select: {
            id: true,
            suburb: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: enquiries };
  } catch (error) {
    console.error("Get enquiries error:", error);
    return { success: false, error: "Failed to load enquiries." };
  }
}
