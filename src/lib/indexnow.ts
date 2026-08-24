import { prisma } from "@/lib/db/prisma";
import { SUBURB_SLUGS } from "@/lib/constants";

export const INDEXNOW_HOST = "www.nannyora.co.nz";
export const INDEXNOW_KEY = "ee7ef5e7-e305-43c5-9368-617a3ebd17e3";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

// Keep this as the single catalogue for every static public URL that should be
// submitted to IndexNow. The sitemap imports it too, so new content cannot be
// added to one discovery route and missed by the other.
export const INDEXABLE_STATIC_PATHS = [
  "",
  "find-a-nanny",
  "nanny-vetting",
  "nanny-interview-questions",
  "nanny-contract",
  "nanny-payroll",
  "nanny-safety",
  "nanny-vs-daycare",
  "nanny-vs-babysitter",
  "nanny-vs-au-pair",
  "specialist-nanny-care",
  "parent-resources",
  "nannies/auckland",
  "ece-nanny-auckland",
  "neurodiverse-childcare-auckland",
  "sensory-aware-nanny-auckland",
  "specialist-childcare-auckland",
  "childcare-support",
  "how-it-works",
  "apply-as-nanny",
  "membership",
  "trust-and-safety",
  "verification-process",
  "pricing",
  "terms",
  "privacy",
  "refunds",
] as const;

export function staticIndexNowUrls() {
  return INDEXABLE_STATIC_PATHS.map((path) => path ? `https://${INDEXNOW_HOST}/${path}` : `https://${INDEXNOW_HOST}`);
}

/**
 * Returns the complete public URL set available at submission time. Profile
 * discovery is deliberately fail-soft: a database outage must not block the
 * static pages from being sent to IndexNow.
 */
export async function indexNowUrls() {
  const urls = staticIndexNowUrls();
  urls.push(...Object.keys(SUBURB_SLUGS).map((slug) => `https://${INDEXNOW_HOST}/nannies/auckland/${slug}`));

  try {
    const nannies = await prisma.nannyProfile.findMany({
      where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] } },
      select: { slug: true, id: true },
      take: 1000,
    });
    urls.push(...nannies.map((nanny) => `https://${INDEXNOW_HOST}/nannies/${nanny.slug ?? nanny.id}`));
  } catch (error) {
    console.error("indexnow: nanny query failed:", error);
  }

  return [...new Set(urls)];
}

export async function submitIndexNow(urlList: string[]) {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList,
    }),
  });

  return { ok: response.ok, status: response.status, statusText: response.statusText };
}
