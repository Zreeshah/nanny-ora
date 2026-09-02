import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { SUBURB_SLUGS } from "@/lib/constants";
import { INDEXABLE_STATIC_PATHS } from "@/lib/indexnow";

const BASE = "https://www.nannyora.co.nz";

// Public marketing + landing pages, with relative priority. Excludes gated/app
// routes (dashboard, admin, login, register, post-a-job) which robots.txt blocks.
const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = INDEXABLE_STATIC_PATHS.map((path) => {
  if (path === "") return { path, priority: 1.0, freq: "daily" };
  if (path === "find-a-nanny") return { path, priority: 0.9, freq: "daily" };
  if (["nanny-vetting", "nannies/auckland", "ece-nanny-auckland", "neurodiverse-childcare-auckland", "sensory-aware-nanny-auckland", "specialist-childcare-auckland"].includes(path)) return { path, priority: 0.8, freq: path === "nannies/auckland" ? "weekly" : "monthly" };
  if (["nanny-interview-questions", "how-to-hire-a-nanny", "nanny-contract", "nanny-payroll", "nanny-safety", "nanny-vs-daycare", "nanny-vs-babysitter", "nanny-vs-au-pair", "specialist-nanny-care", "parent-resources", "nannies/hamilton", "childcare-support", "how-it-works", "apply-as-nanny", "membership"].includes(path)) return { path, priority: 0.7, freq: "monthly" };
  if (["trust-and-safety", "verification-process"].includes(path)) return { path, priority: 0.6, freq: "monthly" };
  if (path === "pricing") return { path, priority: 0.5, freq: "monthly" };
  return { path, priority: 0.3, freq: "yearly" };
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC.map((s) => ({
    url: s.path ? `${BASE}/${s.path}` : BASE,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  const suburbEntries: MetadataRoute.Sitemap = Object.keys(SUBURB_SLUGS).map((slug) => ({
    url: `${BASE}/nannies/auckland/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Real approved nanny profiles by slug. Fail soft: if the DB is unreachable the
  // sitemap still returns the static + suburb pages rather than erroring.
  let nannyEntries: MetadataRoute.Sitemap = [];
  try {
    const nannies = await prisma.nannyProfile.findMany({
      where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] } },
      select: { slug: true, id: true, updatedAt: true },
      take: 1000,
    });
    nannyEntries = nannies.map((n) => ({
      url: `${BASE}/nannies/${n.slug ?? n.id}`,
      lastModified: n.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("sitemap: nanny query failed:", error);
  }

  return [...staticEntries, ...suburbEntries, ...nannyEntries];
}
