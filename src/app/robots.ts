import type { MetadataRoute } from "next";

const BASE = "https://www.nannyora.co.nz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private / non-indexable areas.
        disallow: [
          "/dashboard/",
          "/admin/",
          "/api/",
          "/login",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
