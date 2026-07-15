import type { Metadata } from "next";
import Link from "next/link";
import { getNannyTier } from "@/server/actions/tier";
import { configuredProviders } from "@/lib/payments";
import { TierCards } from "./TierCards";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Membership Tier" };

export default async function NannyTierPage() {
  const res = await getNannyTier();
  const data = res.data as any;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/dashboard/nanny"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">Choose your tier</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xl">
        A one-off payment covers your vetting and gets you listed — no monthly fee. Premium adds
        First Aid training, a verified badge, and top search placement.
      </p>

      <TierCards currentTier={data.tier} providers={configuredProviders()} />
    </div>
  );
}
