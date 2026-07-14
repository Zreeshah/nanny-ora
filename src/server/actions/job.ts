"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { jobPostSchema, type JobPostInput } from "@/lib/validations";
import { notifyAdminNewJob, sendJobStatusUpdate, notifyAdminJobApplication } from "@/lib/email";
import { requireMembership } from "@/lib/membership";
import type { ActionResult } from "./auth";

export async function createJobPost(input: JobPostInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to post a job." };
    }

    // Posting a job is a member-only feature.
    const gate = await requireMembership();
    if (gate) return gate;

    const parsed = jobPostSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const job = await prisma.jobPost.create({
      data: {
        parentId: session.user.id,
        title: data.title,
        suburb: data.suburb,
        careType: data.careType,
        daysRequired: data.daysRequired,
        childCount: data.childCount,
        childAges: data.childAges,
        startDate: data.startDate,
        hourlyBudget: data.hourlyBudget,
        specialistSupport: data.specialistSupport || "",
        description: data.description,
        status: "PENDING",
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
      },
    });

    // Best-effort: tell admin a job is awaiting review.
    await notifyAdminNewJob(session.user.name || "A family", data.title, data.suburb);

    return { success: true, data: { jobId: job.id } };
  } catch (error) {
    console.error("Create job error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateJobStatus(
  jobId: string,
  status: "APPROVED" | "REJECTED" | "CLOSED"
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Unauthorised" };
    }

    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: { parent: { select: { name: true, email: true } } },
    });
    if (!job) {
      return { success: false, error: "Job not found" };
    }

    await prisma.jobPost.update({
      where: { id: jobId },
      data: { status },
    });

    // Best-effort: tell the parent their job post status changed.
    await sendJobStatusUpdate(job.parent.name, job.parent.email, job.title, status);

    return { success: true };
  } catch (error) {
    console.error("Update job status error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getJobPosts(filters?: {
  status?: string;
  suburb?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return { success: false, error: "Unauthorised" };
    }

    const jobs = await prisma.jobPost.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.suburb && { suburb: filters.suburb }),
      },
      include: {
        parent: {
          select: { name: true, email: true },
        },
        applications: { include: { nanny: { include: { user: { select: { name: true } } } } }, take: 20 },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { success: true, data: jobs };
  } catch (error) {
    console.error("Get jobs error:", error);
    return { success: false, error: "Failed to load jobs." };
  }
}

/** One-click nanny application to an approved job. Idempotent per (job, nanny). */
export async function applyToJob(jobId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || (session.user as any).role !== "NANNY") {
      return { success: false, error: "Only nannies can apply to jobs." };
    }
    const profile = await prisma.nannyProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) return { success: false, error: "Complete your profile first." };

    const job = await prisma.jobPost.findUnique({ where: { id: jobId }, select: { id: true, title: true, status: true } });
    if (!job || job.status !== "APPROVED") return { success: false, error: "This job is not open for applications." };

    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_nannyProfileId: { jobId, nannyProfileId: profile.id } },
    });
    if (existing) return { success: true, data: { applied: true } }; // idempotent

    await prisma.jobApplication.create({ data: { jobId, nannyProfileId: profile.id } });
    await notifyAdminJobApplication(session?.user?.name || "A nanny", job.title);
    return { success: true, data: { applied: true } };
  } catch (error) {
    console.error("applyToJob error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
