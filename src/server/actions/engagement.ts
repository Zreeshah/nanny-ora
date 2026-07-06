"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { SAFETY_CHECKS } from "@/lib/constants";
import type { ActionResult } from "./auth";

// The 7 vetting checks that make up "verification progress" (single source: SAFETY_CHECKS).
const CHECK_FIELDS = SAFETY_CHECKS.map((c) => c.key);

function parseArr(value: string): string[] {
  try {
    const p = JSON.parse(value);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

// --- Favourites (parents saving nannies) ---

/** Toggle a nanny in the current parent's saved list. Returns { favourited }. */
export async function toggleFavourite(nannyId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    const parentId = session?.user?.id;
    if (!parentId || (session.user as any).role !== "PARENT") {
      return { success: false, error: "Please sign in as a family to save nannies." };
    }

    const existing = await prisma.favourite.findUnique({
      where: { parentId_nannyId: { parentId, nannyId } },
    });

    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
      return { success: true, data: { favourited: false } };
    }

    await prisma.favourite.create({ data: { parentId, nannyId } });
    return { success: true, data: { favourited: true } };
  } catch (error) {
    console.error("toggleFavourite error:", error);
    return { success: false, error: "Something went wrong." };
  }
}

/** Ids of nannies the current parent has saved (for hydrating heart state). */
export async function getFavouriteIds(): Promise<ActionResult> {
  try {
    const session = await auth();
    const parentId = session?.user?.id;
    if (!parentId) return { success: true, data: [] };
    const rows = await prisma.favourite.findMany({ where: { parentId }, select: { nannyId: true }, take: 200 });
    return { success: true, data: rows.map((r) => r.nannyId) };
  } catch (error) {
    console.error("getFavouriteIds error:", error);
    return { success: true, data: [] };
  }
}

// --- Profile views tracking ---

// ponytail: in-memory throttle — won't survive restarts or work across serverless instances.
// Upgrade to Redis/Upstash if view inflation becomes a problem.
const viewThrottle = new Map<string, number>();
const VIEW_THROTTLE_MS = 30_000;

/** Best-effort: record that a nanny profile was viewed. Never throws to the caller. */
export async function recordProfileView(nannyId: string): Promise<void> {
  try {
    // Throttle by nannyId so one client can't inflate counts with rapid calls.
    const now = Date.now();
    const last = viewThrottle.get(nannyId);
    if (last && now - last < VIEW_THROTTLE_MS) return;
    viewThrottle.set(nannyId, now);

    const session = await auth();
    const viewerId = session?.user?.id;
    // ponytail: demo accounts (demo-*) and backup admin (backup-*) aren't real User rows — store as anonymous to avoid FK errors.
    const realViewer = viewerId && !viewerId.startsWith("demo-") && !viewerId.startsWith("backup-") ? viewerId : null;

    // Verify the nanny profile exists before recording a view.
    const exists = await prisma.nannyProfile.findUnique({ where: { id: nannyId }, select: { id: true } });
    if (!exists) return;

    await prisma.profileView.create({ data: { nannyId, viewerId: realViewer } });
  } catch (error) {
    console.error("recordProfileView error (ignored):", error);
  }
}

// --- Dashboard data ---

/** Real metrics for the nanny dashboard. Safe zeros when no profile / DB unreachable. */
export async function getNannyDashboard(): Promise<ActionResult> {
  const empty = {
    profileViews: 0,
    newEnquiries: 0,
    recentEnquiries: [] as any[],
    matchingJobs: 0,
    recentJobs: [] as any[],
    checks: [] as any[],
    availabilitySummary: "",
    verifiedChecks: 0,
    totalChecks: CHECK_FIELDS.length,
    verificationLevel: "LISTED",
    reviewCount: 0,
    avgRating: 0,
  };
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: true, data: empty };

    const profile = await prisma.nannyProfile.findUnique({ where: { userId } });
    if (!profile) return { success: true, data: empty };

    const [profileViews, newEnquiries, recentEnquiries, matchingJobs, recentJobs, reviews, myApplications] = await Promise.all([
      prisma.profileView.count({ where: { nannyId: profile.id } }),
      prisma.enquiry.count({ where: { nannyId: profile.id, status: "NEW" } }),
      prisma.enquiry.findMany({
        where: { nannyId: profile.id },
        include: { parent: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.jobPost.count({ where: { status: "APPROVED" } }),
      prisma.jobPost.findMany({
        where: { status: "APPROVED" },
        select: { id: true, title: true, suburb: true, hourlyBudget: true, daysRequired: true, careType: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.review.findMany({ where: { nannyId: profile.id }, select: { rating: true } }),
      prisma.jobApplication.findMany({ where: { nannyProfileId: profile.id }, select: { jobId: true }, take: 100 }),
    ]);

    const verifiedChecks = CHECK_FIELDS.filter((f) => (profile as any)[f] === "VERIFIED").length;
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    return {
      success: true,
      data: {
        profileViews,
        newEnquiries,
        recentEnquiries: recentEnquiries.map((e) => ({
          id: e.id,
          name: e.parent.name,
          message: e.message,
          status: e.status,
          createdAt: e.createdAt,
        })),
        matchingJobs,
        recentJobs,
        appliedJobIds: myApplications.map((a) => a.jobId),
        // the nanny's real 7-step vetting statuses, in official order
        checks: SAFETY_CHECKS.map((c) => ({ name: c.title, status: (profile as any)[c.key] || "NOT_STARTED" })),
        availabilitySummary: profile.availabilitySummary,
        verifiedChecks,
        totalChecks: CHECK_FIELDS.length,
        verificationLevel: profile.verificationLevel,
        reviewCount: reviews.length,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    };
  } catch (error) {
    console.error("getNannyDashboard error:", error);
    return { success: true, data: empty };
  }
}

/** Real metrics + saved list for the parent dashboard. Safe zeros on failure. */
export async function getParentDashboard(): Promise<ActionResult> {
  const empty = { enquiriesSent: 0, activeJobs: 0, carersViewed: 0, savedNannies: [] as any[], recentEnquiries: [] as any[], jobs: [] as any[], recommended: [] as any[], profile: null as any };
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: true, data: empty };

    const [enquiriesSent, activeJobs, viewed, favourites, recentEnquiries, jobs, myReviews, profile, recommended] = await Promise.all([
      prisma.enquiry.count({ where: { parentId: userId } }),
      prisma.jobPost.count({ where: { parentId: userId, status: { in: ["PENDING", "APPROVED"] } } }),
      prisma.profileView.findMany({ where: { viewerId: userId }, distinct: ["nannyId"], select: { nannyId: true } }),
      prisma.favourite.findMany({
        where: { parentId: userId },
        include: { nanny: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.enquiry.findMany({
        where: { parentId: userId },
        include: { nanny: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.jobPost.findMany({
        where: { parentId: userId },
        select: {
          id: true, title: true, careType: true, daysRequired: true, hourlyBudget: true, status: true,
          applications: { select: { nanny: { select: { id: true, user: { select: { name: true } } } } }, take: 10 },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.review.findMany({ where: { parentId: userId }, select: { nannyId: true, rating: true } }),
      prisma.parentProfile.findUnique({ where: { userId } }),
      prisma.nannyProfile.findMany({
        where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] } },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    return {
      success: true,
      data: {
        enquiriesSent,
        activeJobs,
        carersViewed: viewed.length,
        jobs: jobs.map((j) => ({
          ...j,
          applications: undefined,
          applicants: j.applications.map((a) => ({ nannyId: a.nanny.id, name: a.nanny.user.name })),
        })),
        profile: profile
          ? {
              suburb: profile.suburb,
              childAgeRange: parseArr(profile.childAgeRange),
              careTypeNeeded: parseArr(profile.careTypeNeeded),
              preferredDays: profile.preferredDays,
              specialistNeeds: profile.specialistNeeds,
            }
          : null,
        recommended: recommended.map((n) => ({
          id: n.id,
          name: n.user.name,
          suburb: n.suburb,
          hourlyRate: n.hourlyRate,
          yearsExperience: n.yearsExperience,
          verificationLevel: n.verificationLevel,
          specialistTags: parseArr(n.specialistTags),
        })),
        savedNannies: favourites.map((f) => ({
          id: f.nanny.id,
          name: f.nanny.user.name,
          suburb: f.nanny.suburb,
          hourlyRate: f.nanny.hourlyRate,
          verificationLevel: f.nanny.verificationLevel,
          specialistTags: parseArr(f.nanny.specialistTags),
          profileImageUrl: f.nanny.profileImageUrl ?? undefined,
        })),
        recentEnquiries: recentEnquiries.map((e) => ({
          id: e.id,
          nannyId: e.nannyId,
          nannyName: e.nanny.user.name,
          message: e.message,
          status: e.status,
          createdAt: e.createdAt,
          // parent can rate once care is underway/finished; myRating shows an existing review
          reviewable: ["MATCHED", "CLOSED"].includes(e.status),
          myRating: myReviews.find((r) => r.nannyId === e.nannyId)?.rating ?? null,
        })),
      },
    };
  } catch (error) {
    console.error("getParentDashboard error:", error);
    return { success: true, data: empty };
  }
}
