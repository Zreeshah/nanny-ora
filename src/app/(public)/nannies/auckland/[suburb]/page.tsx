import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NannyCard } from "@/components/cards/NannyCard";
import { getPublicNannies } from "@/lib/data/nannies";
import { CARE_TYPES, SUBURB_SLUGS, VERIFICATION_LEVEL_LABELS } from "@/lib/constants";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import type { NannyProfilePublic } from "@/types";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(SUBURB_SLUGS).map((slug) => ({ suburb: slug }));
}

function profileNoun(count: number) {
  return `${count} current nanny profile${count === 1 ? "" : "s"}`;
}

function joinNaturally(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  if (items.length === 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function profileSignals(nannies: NannyProfilePublic[]) {
  const careTypes = Array.from(new Set(nannies.flatMap((nanny) => nanny.careTypes)))
    .flatMap((careType) => {
      const label = CARE_TYPES.find((item) => item.value === careType)?.label;
      return label ? [label] : [];
    });
  const verificationLevels = Array.from(new Set(nannies.map((nanny) => nanny.verificationLevel)))
    .map((level) => VERIFICATION_LEVEL_LABELS[level]);

  return {
    careTypes,
    verificationLevels,
    eceCount: nannies.filter((nanny) => nanny.eceExperience).length,
    firstAidCount: nannies.filter((nanny) => nanny.firstAidCurrent).length,
    specialistCount: nannies.filter((nanny) => nanny.specialistTags.length > 0).length,
  };
}

function experienceSignalSummary(signals: ReturnType<typeof profileSignals>) {
  const statements = [
    signals.eceCount > 0 ? `${signals.eceCount} ${signals.eceCount === 1 ? "profile lists" : "profiles list"} ECE experience` : null,
    signals.firstAidCount > 0 ? `${signals.firstAidCount} ${signals.firstAidCount === 1 ? "profile lists" : "profiles list"} first-aid information` : null,
    signals.specialistCount > 0 ? `${signals.specialistCount} ${signals.specialistCount === 1 ? "profile lists" : "profiles list"} specialist experience` : null,
  ].filter((statement): statement is string => Boolean(statement));

  return statements.length > 0 ? `${joinNaturally(statements)}.` : "Read each profile for the care experience the nanny describes.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>;
}): Promise<Metadata> {
  const { suburb } = await params;
  const suburbName = SUBURB_SLUGS[suburb];
  if (!suburbName) return { title: "Suburb Not Found" };

  // A suburb with no nannies yet is a near-empty, near-duplicate page. Keep it
  // reachable for users but out of the index until it has real content — this
  // flips to indexable automatically as soon as a nanny covers the suburb.
  const nannies = await getPublicNannies({ suburb: suburbName });
  const hasNannies = nannies.length > 0;
  const title = hasNannies
    ? `Nanny Profiles in ${suburbName}, Auckland`
    : `Find a Nanny Near ${suburbName}, Auckland`;
  const description = hasNannies
    ? `Browse ${profileNoun(nannies.length)} that list ${suburbName} as a suburb or travel area. Compare experience, care types, availability and the verification level shown on each NannyOra profile.`
    : `Search Auckland nanny profiles near ${suburbName}. Check nearby travel areas, experience, care types, availability and profile verification details on NannyOra.`;

  return {
    title,
    description,
    alternates: { canonical: `/nannies/auckland/${suburb}` },
    robots: hasNannies ? undefined : { index: false, follow: true },
    openGraph: { title, description, url: `/nannies/auckland/${suburb}`, type: "website" },
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
  const signals = profileSignals(nannies);
  const directSuburbProfiles = nannies.filter((nanny) => nanny.suburb.toLowerCase() === suburbName.toLowerCase()).length;
  const travelAreaProfiles = nannies.length - directSuburbProfiles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Nannies in Auckland", path: "/nannies/auckland" },
          { name: `Nannies in ${suburbName}`, path: `/nannies/auckland/${suburb}` },
        ])}
      />
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
          Nannies in {suburbName}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse current nanny profiles that list {suburbName} as their home suburb or a stated travel area. Compare the experience, availability and verification details shown before you enquire.
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
        <>
          <section aria-labelledby="local-signals-heading" className="mb-10 rounded-3xl border border-border/35 bg-secondary/25 p-6 sm:p-8">
            <div className="max-w-3xl mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Live profile information</p>
              <h2 id="local-signals-heading" className="font-heading text-2xl sm:text-3xl text-foreground">What current profiles show for {suburbName}</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">This local view is based on a nanny&apos;s listed suburb or stated travel area, not a guarantee of a particular booking. Confirm the actual route, hours and role directly with each candidate.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/35 bg-card p-5">
                <Users className="h-5 w-5 text-accent mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-foreground">Local match</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profileNoun(nannies.length)} currently {nannies.length === 1 ? "matches" : "match"} {suburbName}{directSuburbProfiles > 0 ? `, including ${directSuburbProfiles} based there` : " through stated travel coverage"}{travelAreaProfiles > 0 && directSuburbProfiles > 0 ? ` and ${travelAreaProfiles} that list it as a travel area` : ""}.</p>
              </div>
              <div className="rounded-2xl border border-border/35 bg-card p-5">
                <Sparkles className="h-5 w-5 text-accent mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-foreground">Experience shown</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{signals.careTypes.length > 0 ? `${joinNaturally(signals.careTypes)}.` : ""} {experienceSignalSummary(signals)}</p>
              </div>
              <div className="rounded-2xl border border-border/35 bg-card p-5">
                <ShieldCheck className="h-5 w-5 text-accent mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-foreground">Verification shown</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{joinNaturally(signals.verificationLevels)}. Check the badge and completed checks on each profile; a listed profile is not the same as a Premium Vetted or Specialist Care profile.</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="profiles-heading" className="mb-12">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Browse profiles</p>
                <h2 id="profiles-heading" className="font-heading text-2xl sm:text-3xl text-foreground">Nanny profiles matching {suburbName}</h2>
              </div>
              <p className="text-sm text-muted-foreground">Availability changes—check each profile before shortlisting.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nannies.map((n) => (
                <NannyCard key={n.id} nanny={n} />
              ))}
            </div>
          </section>

          <section aria-labelledby="shortlist-heading" className="mb-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-primary p-6 sm:p-8 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">A careful local shortlist</p>
              <h2 id="shortlist-heading" className="font-heading text-2xl sm:text-3xl">Confirm the practical fit for your week</h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/80">Before arranging a meeting, check your required days, start and finish times, school or activity transport, children&apos;s ages, duties and trial availability. A nearby profile is only the starting point for a good match.</p>
              <Link href="/find-a-nanny" className="mt-6 inline-flex items-center font-semibold text-accent-foreground hover:text-white transition-colors">Search the full Auckland directory <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-3xl border border-border/35 bg-card p-6 sm:p-8">
              <h2 className="font-heading text-2xl text-foreground">Check, meet and budget</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Use the information on a profile as a prompt for a proper conversation. Review the verification level, ask relevant interview questions, arrange a paid trial where appropriate and budget for the full employment arrangement—not only the hourly rate.</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
                <Link href="/nanny-vetting" className="text-primary hover:text-primary-light transition-colors">Understand vetting</Link>
                <Link href="/nanny-interview-questions" className="text-primary hover:text-primary-light transition-colors">Plan interview questions</Link>
                <Link href="/nanny-cost" className="text-primary hover:text-primary-light transition-colors">Review nanny costs</Link>
              </div>
            </div>
          </section>
        </>
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
