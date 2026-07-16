import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { SUBURB_SLUGS } from "@/lib/constants";

const BASE = "https://www.nannyora.co.nz";

// Public marketing + landing pages, with relative priority. Excludes gated/app
// routes (dashboard, admin, login, register, post-a-job) which robots.txt blocks.
const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, freq: "daily" },
  { path: "find-a-nanny", priority: 0.9, freq: "daily" },
  { path: "nannies/auckland", priority: 0.8, freq: "weekly" },
  { path: "ece-nanny-auckland", priority: 0.8, freq: "monthly" },
  { path: "neurodiverse-childcare-auckland", priority: 0.8, freq: "monthly" },
  { path: "sensory-aware-nanny-auckland", priority: 0.8, freq: "monthly" },
  { path: "specialist-childcare-auckland", priority: 0.8, freq: "monthly" },
  { path: "childcare-support", priority: 0.7, freq: "monthly" },
  { path: "how-it-works", priority: 0.7, freq: "monthly" },
  { path: "apply-as-nanny", priority: 0.7, freq: "monthly" },
  { path: "membership", priority: 0.7, freq: "monthly" },
  { path: "trust-and-safety", priority: 0.6, freq: "monthly" },
  { path: "verification-process", priority: 0.6, freq: "monthly" },
  { path: "pricing", priority: 0.5, freq: "monthly" },
];

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
