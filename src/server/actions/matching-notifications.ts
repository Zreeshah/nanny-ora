import "server-only";

import { prisma } from "@/lib/db/prisma";
import { nannyMatchesJob, type MatchableJob, type MatchableNanny } from "@/lib/job-matching";
import { sendMatchingJobNotification, sendMatchingNannyNotification } from "@/lib/email";

type NannyWithUser = MatchableNanny & {
  slug: string | null;
  verificationLevel: string;
  user: { name: string; email: string };
};

type JobWithParent = MatchableJob & {
  title: string;
  parent: { name: string; email: string };
};

/** Public, contact-safe match previews for a family's own dashboard and email. */
export type NannyMatchPreview = {
  id: string;
  slug: string | null;
  name: string;
  suburb: string;
  hourlyRate: number;
  verificationLevel: string;
};

/**
 * Finds only public and currently-available profiles that meet the conservative
 * matching rules. This does not send mail and deliberately exposes no contact
 * details, so it is safe for a parent match preview before membership purchase.
 */
export async function getNannyMatchesForJob(job: MatchableJob): Promise<NannyMatchPreview[]> {
  const nannies = await prisma.nannyProfile.findMany({
    where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] }, placementStatus: "AVAILABLE" },
    select: {
      id: true,
      slug: true,
      suburb: true,
      areasCovered: true,
      careTypes: true,
      hourlyRate: true,
      verificationLevel: true,
      adminStatus: true,
      placementStatus: true,
      user: { select: { name: true, email: true } },
    },
    take: 1000,
  });

  return (nannies as NannyWithUser[])
    .filter((nanny) => nannyMatchesJob(nanny, job))
    .map((nanny) => ({
      id: nanny.id,
      slug: nanny.slug,
      name: nanny.user.name,
      suburb: nanny.suburb,
      hourlyRate: nanny.hourlyRate,
      verificationLevel: nanny.verificationLevel,
    }));
}

/** Alert available, public nannies after an admin makes a job live. */
export async function notifyMatchingNanniesForJob(job: JobWithParent) {
  const nannies = await prisma.nannyProfile.findMany({
    where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] }, placementStatus: "AVAILABLE" },
    select: {
      id: true,
      slug: true,
      suburb: true,
      areasCovered: true,
      careTypes: true,
      hourlyRate: true,
      adminStatus: true,
      placementStatus: true,
      user: { select: { name: true, email: true } },
    },
    take: 1000,
  });

  const matches = (nannies as NannyWithUser[]).filter((nanny) => nannyMatchesJob(nanny, job));
  const deliveries = await Promise.allSettled(matches.map((nanny) =>
    sendMatchingJobNotification(nanny.user.name, nanny.user.email, job),
  ));

  return {
    matched: matches.length,
    sent: deliveries.filter((delivery) => delivery.status === "fulfilled" && delivery.value).length,
  };
}

/** Alert parents with open jobs when a nanny newly becomes publicly available. */
export async function notifyMatchingParentsForNanny(nanny: NannyWithUser) {
  const jobs = await prisma.jobPost.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      title: true,
      suburb: true,
      careType: true,
      hourlyBudget: true,
      parent: { select: { name: true, email: true } },
    },
    take: 1000,
  });

  const matches = (jobs as JobWithParent[]).filter((job) => nannyMatchesJob(nanny, job));
  const deliveries = await Promise.allSettled(matches.map((job) =>
    sendMatchingNannyNotification(job.parent.name, job.parent.email, nanny, job),
  ));

  return {
    matched: matches.length,
    sent: deliveries.filter((delivery) => delivery.status === "fulfilled" && delivery.value).length,
  };
}
