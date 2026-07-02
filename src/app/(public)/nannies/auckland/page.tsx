import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NannyCard } from "@/components/cards/NannyCard";
import { getPublicNannies } from "@/lib/data/nannies";
import { SUBURB_SLUGS } from "@/lib/constants";
import { ArrowRight, MapPin } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export const metadata: Metadata = {
  title: "Nannies in Auckland — Verified Local Childcare",
  description: "Find verified nannies across Auckland suburbs. Specialist care, ECE-qualified, and sensory-aware nannies available. Browse NannyOra's Auckland nanny directory.",
};

export const revalidate = 300;

export default async function AucklandNanniesPage() {
  const nannies = await getPublicNannies();
  const suburbs = Object.entries(SUBURB_SLUGS).slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Nannies in Auckland
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse verified, experienced nannies across Auckland. From casual babysitting to specialist sensory-aware care — find the right nanny for your family.
        </p>
      </div>

      <ImageBand
        tags={["suburb", "auckland", "agency", "find"]}
        seed="nannies-auckland"
        count={3}
        aspect="aspect-[4/3]"
        priority
        className="mb-12"
      />

      {/* Suburb Links */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl text-foreground mb-6">Browse by Suburb</h2>
        <div className="flex flex-wrap gap-2">
          {suburbs.map(([slug, name]) => (
            <Link key={slug} href={`/nannies/auckland/${slug}`}>
              <Badge variant="outline" size="md" className="cursor-pointer hover:border-primary transition-colors">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {name}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Nannies */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl text-foreground mb-6">Featured Auckland Nannies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nannies.slice(0, 6).map((nanny) => (
            <NannyCard key={nanny.id} nanny={nanny} />
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/find-a-nanny">
          <Button variant="primary" size="lg">
            View All Auckland Nannies <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
