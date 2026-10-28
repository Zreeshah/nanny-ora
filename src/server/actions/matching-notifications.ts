import "server-only";

import { prisma } from "@/lib/db/prisma";
import { nannyMatchesJob, type MatchableJob, type MatchableNanny } from "@/lib/job-matching";
import { sendMatchingJobNotification, sendMatchingNannyNotification } from "@/lib/email";

type NannyWithUser = MatchableNanny & {
  slug: string | null;
  user: { name: string; email: string };
};

type JobWithParent = MatchableJob & {
  title: string;
  parent: { name: string; email: string };
};

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
