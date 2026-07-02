import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NannyCard } from "@/components/cards/NannyCard";
import { getPublicNannies } from "@/lib/data/nannies";
import { SUBURB_SLUGS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(SUBURB_SLUGS).map((slug) => ({ suburb: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb } = await params;
  const suburbName = SUBURB_SLUGS[suburb];
  if (!suburbName) return { title: "Suburb Not Found" };
  return {
    title: `Nannies in ${suburbName}, Auckland — Verified Childcare`,
    description: `Find verified nannies in ${suburbName}, Auckland. Browse experienced local carers, ECE-qualified nannies, and specialist childcare support on NannyOra.`,
  };
}

export default async function SuburbNanniesPage({
  params,
}: {
  params: Promise<{ suburb: string }>;
}) {
  const { suburb } = await params;
  const suburbName = SUBURB_SLUGS[suburb];
  if (!suburbName) notFound();

  const nannies = await getPublicNannies({ suburb: suburbName });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Nannies in {suburbName}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse verified nannies available in {suburbName} and surrounding Auckland suburbs.
        </p>
      </div>

      {/* Suburb-matched contextual image */}
      <ImageBand
        tags={["suburb", suburb, "auckland", "find"]}
        seed={`suburb-${suburb}`}
        aspect="aspect-[16/7]"
        priority
        className="mb-12"
      />

      {nannies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {nannies.map((n) => (
            <NannyCard key={n.id} nanny={n} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 mb-12">
          <p className="text-muted-foreground mb-4">
            No nannies are currently listed in {suburbName}. Try searching nearby suburbs.
          </p>
          <Link href="/find-a-nanny">
            <Button variant="primary">Browse All Nannies</Button>
          </Link>
        </div>
      )}

      <div className="text-center">
        <Link href="/nannies/auckland">
          <Button variant="outline" size="lg">
            View All Auckland Suburbs <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
