import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge, SpecialistTag, PlacementBadge } from "@/components/ui/Badge";
import { getPublicNannyById, getNannyReviews } from "@/lib/data/nannies";
import { prisma } from "@/lib/db/prisma";
import { formatRate, getInitials } from "@/lib/utils";
import { CARE_TYPES, LANGUAGE_TAGS } from "@/lib/constants";
import EnquiryForm from "./EnquiryForm";
import { getMembership, membershipEnforced } from "@/lib/membership";
import ViewTracker from "./ViewTracker";
import {
  MapPin, Clock, Shield, Car, Heart, GraduationCap,
  CheckCircle, Calendar, Star, ArrowLeft,
} from "lucide-react";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const rows = await prisma.nannyProfile.findMany({
      where: { adminStatus: { in: ["APPROVED", "VERIFIED", "SPECIALIST"] } },
      select: { id: true },
      take: 100,
    });
    return rows.map((n) => ({ id: n.id }));
  } catch {
    return []; // pages still render on-demand via revalidate
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const nanny = await getPublicNannyById(id);
  if (!nanny) return { title: "Nanny Not Found" };
  return {
    title: `${nanny.name} — Nanny in ${nanny.suburb}`,
    description: `${nanny.name} is a ${nanny.verificationLevel.toLowerCase().replace("_", " ")} nanny in ${nanny.suburb}, Auckland. ${nanny.bio.slice(0, 150)}`,
  };
}

export default async function NannyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const nanny = await getPublicNannyById(id);
  if (!nanny) notFound();
  const { reviews, avg } = await getNannyReviews(nanny.id);
  const { isMember } = await getMembership();
  // During soft launch (enforcement off) everyone has effective access — no locked CTA.
  const canContact = isMember || !membershipEnforced();

  const careLabels = nanny.careTypes
    .map((ct) => CARE_TYPES.find((c) => c.value === ct)?.label)
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ViewTracker nannyId={nanny.id} />
      {/* Back Link */}
      <Link
        href="/find-a-nanny"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-300 bg-secondary/40 py-2 px-4 rounded-full border border-border/20 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Back to search
      </Link>

      {/* Profile Header */}
      <Card className="mb-6" padding="lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {nanny.profileImageUrl ? (
              <img
                src={nanny.profileImageUrl}
                alt={nanny.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary/5 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner">
                <span className="text-primary font-bold text-2xl">
                  {getInitials(nanny.name)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-1">
                  {nanny.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">{nanny.suburb}, Auckland</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <VerificationBadge level={nanny.verificationLevel as any} />
                  {nanny.placementStatus && nanny.placementStatus !== "AVAILABLE" && (
                    <PlacementBadge status={nanny.placementStatus} placementEnd={nanny.placementEnd} />
                  )}
                </div>
              </div>

              <div className="text-center sm:text-right bg-secondary/45 border border-border/25 px-5 py-2.5 rounded-2xl min-w-[140px]">
                <div className="text-2xl font-bold text-primary">{formatRate(nanny.hourlyRate)}</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">per hour</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <h2 className="font-heading text-xl text-foreground mb-3">About {nanny.name.split(" ")[0]}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {nanny.bio}
            </p>
          </Card>

          {/* Experience & Qualifications */}
          <Card>
            <h2 className="font-heading text-xl text-foreground mb-4">Experience & Qualifications</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-2xl border border-border/10">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-foreground">{nanny.yearsExperience}+ years of childcare experience</span>
              </div>
              {nanny.eceExperience && (
                <div className="flex gap-3 items-center p-3 bg-secondary/10 rounded-2xl border border-border/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <GraduationCap className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-foreground">ECE / Teaching experience</span>
                </div>
              )}
              {nanny.firstAidCurrent && (
                <div className="flex gap-3 items-center p-3 bg-secondary/10 rounded-2xl border border-border/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-badge-verified flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Current First Aid certificate</span>
                </div>
              )}
              {nanny.driverLicence && (
                <div className="flex gap-3 items-center p-3 bg-secondary/10 rounded-2xl border border-border/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Car className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Full driver licence</span>
                </div>
              )}
            </div>

            {nanny.qualifications.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/25">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Qualifications</h3>
                <ul className="space-y-2">
                  {nanny.qualifications.map((q) => (
                    <li key={q} className="text-xs text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-badge-verified mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Specialist Skills */}
          {nanny.specialistTags.length > 0 && (
            <Card>
              <h2 className="font-heading text-xl text-foreground mb-4">Specialist Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(nanny.specialistTags as string[]).map((tag) => (
                  <SpecialistTag key={tag} tag={tag as any} />
                ))}
              </div>
            </Card>
          )}

          {/* Languages */}
          {nanny.languages && nanny.languages.length > 0 && (
            <Card>
              <h2 className="font-heading text-xl text-foreground mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {(nanny.languages as string[]).map((lang) => {
                  const tag = LANGUAGE_TAGS.find((l) => l.value === lang);
                  if (!tag) return null;
                  return (
                    <span key={lang} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20">
                      {tag.short} {tag.label}
                    </span>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Care Types */}
          <Card>
            <h2 className="font-heading text-xl text-foreground mb-4">Care Types Offered</h2>
            <div className="flex flex-wrap gap-2">
              {careLabels.map((label) => (
                <Badge key={label} variant="outline" size="md">{label}</Badge>
              ))}
            </div>
          </Card>

          {/* Parent Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-foreground">Parent Reviews</h2>
              {reviews.length > 0 && (
                <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  {avg} · {reviews.length} review{reviews.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No reviews yet — families can leave one after a confirmed placement.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-border/30 bg-secondary/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-foreground text-sm">{r.reviewerFirstName}</span>
                      <span className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} aria-hidden="true" />
                        ))}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Placement status (visible to all) */}
          {nanny.placementStatus && nanny.placementStatus !== "AVAILABLE" && (
            <Card className="border-l-4 border-l-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <PlacementBadge status={nanny.placementStatus} placementEnd={nanny.placementEnd} />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {nanny.placementStatus === "TRIAL_PENDING" && nanny.trialDate && <p>Trial scheduled for <strong className="text-foreground">{nanny.trialDate}</strong>.</p>}
                {nanny.placementStatus === "PLACED" && nanny.placementStart && <p>Placement started <strong className="text-foreground">{nanny.placementStart}</strong>.</p>}
                {nanny.placementStatus === "CONTRACT_ENDING" && nanny.placementEnd && <p>Available again from <strong className="text-foreground">{nanny.placementEnd}</strong>.</p>}
                {nanny.placementNote && <p>{nanny.placementNote}</p>}
              </div>
            </Card>
          )}

          {/* Enquiry CTA */}
          <EnquiryForm nannyId={nanny.id} firstName={nanny.name.split(" ")[0]} placementStatus={nanny.placementStatus} isMember={canContact} />

          {/* Availability */}
          <Card>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
              Availability
            </h3>
            <p className="text-xs text-muted-foreground">{nanny.availabilitySummary}</p>
          </Card>

          {/* Suburbs Covered */}
          <Card>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              Areas Covered
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {nanny.areasCovered.map((area) => (
                <Badge key={area} variant="default" size="sm">{area}</Badge>
              ))}
            </div>
          </Card>

          {/* Verification Info */}
          <Card>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
              Verification
            </h3>
            <VerificationBadge level={nanny.verificationLevel as any} />
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Verification badges indicate document and reference reviews completed by our team.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
