import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // nanny profile photos (nanny-photos public bucket)
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      // Placeholder profile IDs that never existed as public profiles
      // (reported as 404s in GSC, 2026-11-24). Send them to the directory.
      { source: "/nannies/nanny-001", destination: "/find-a-nanny", permanent: true },
      { source: "/nannies/nanny-002", destination: "/find-a-nanny", permanent: true },
      { source: "/nannies/nanny-003", destination: "/find-a-nanny", permanent: true },
    ];
  },
};

export default nextConfig;
