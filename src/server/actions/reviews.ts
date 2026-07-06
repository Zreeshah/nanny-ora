"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import type { ActionResult } from "./auth";

/**
 * Parent rates a nanny after care is underway/finished — gated on having an
 * enquiry with that nanny in MATCHED or CLOSED status. One review per pair
 * (DB unique); re-submitting updates the existing review.
 */
export async function createReview(nannyProfileId: string, rating: number, comment: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const parentId = session?.user?.id;
    if (!parentId || (session.user as any).role !== "PARENT") {
      return { success: false, error: "Only families can leave reviews." };
    }

    const r = Math.round(Number(rating));
    if (!Number.isFinite(r) || r < 1 || r > 5) return { success: false, error: "Rating must be 1–5 stars." };
    const text = (comment || "").trim();
    if (text.length > 1000) return { success: false, error: "Review is too long (max 1000 characters)." };

    const eligible = await prisma.enquiry.findFirst({
      where: { parentId, nannyId: nannyProfileId, status: { in: ["MATCHED", "CLOSED"] } },
      select: { id: true },
    });
    if (!eligible) {
      return { success: false, error: "You can review a nanny once your placement with them is confirmed." };
    }

    await prisma.review.upsert({
      where: { parentId_nannyId: { parentId, nannyId: nannyProfileId } },
      create: { parentId, nannyId: nannyProfileId, rating: r, comment: text },
      update: { rating: r, comment: text },
    });

    return { success: true, data: { rating: r } };
  } catch (error) {
    console.error("createReview error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
