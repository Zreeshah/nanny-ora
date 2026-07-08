import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge, SpecialistTag, PlacementBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Star } from "lucide-react";
import { formatRate, truncate, getInitials } from "@/lib/utils";
import { CARE_TYPES, LANGUAGE_TAGS } from "@/lib/constants";
import { FavouriteButton } from "./FavouriteButton";
import type { NannyProfilePublic } from "@/types";

interface NannyCardProps {
  nanny: NannyProfilePublic;
  className?: string;
  favourited?: boolean;
}

export function NannyCard({ nanny, className, favourited }: NannyCardProps) {
  const careTypeLabels = nanny.careTypes
    .map((ct) => CARE_TYPES.find((c) => c.value === ct)?.label)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Card hover className={cn("flex flex-col", className)} padding="none">
      <div className="p-5">
        {/* Top row: Avatar + Name + Verification */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {nanny.profileImageUrl ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/10">
                <Image
                  src={nanny.profileImageUrl}
                  alt={`${nanny.name} profile`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {getInitials(nanny.name)}
                </span>
              </div>
            )}
            {/* Online indicator dot */}
            {nanny.verificationLevel !== "LISTED" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-badge-verified rounded-full border-2 border-card" />
            )}
          </div>

          {/* Name & Location */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">{nanny.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{nanny.suburb}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <VerificationBadge level={nanny.verificationLevel as any} />
              {nanny.placementStatus && nanny.placementStatus !== "AVAILABLE" && (
                <PlacementBadge status={nanny.placementStatus} placementEnd={nanny.placementEnd} />
              )}
            </div>
          </div>

          {/* Rate + Save */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <FavouriteButton nannyId={nanny.id} initial={favourited} />
            <span className="text-lg font-bold text-primary">{formatRate(nanny.hourlyRate)}</span>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {truncate(nanny.bio, 120)}
        </p>

        {/* Experience & Care Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" size="sm">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {nanny.yearsExperience}+ yrs exp
          </Badge>
          {careTypeLabels.map((label) => (
            <Badge key={label} variant="default" size="sm">{label}</Badge>
          ))}
        </div>

        {/* Specialist Tags */}
        {nanny.specialistTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(nanny.specialistTags as string[]).slice(0, 3).map((tag) => (
              <SpecialistTag key={tag} tag={tag as any} />
            ))}
            {nanny.specialistTags.length > 3 && (
              <Badge variant="outline" size="sm">+{nanny.specialistTags.length - 3} more</Badge>
            )}
          </div>
        )}

        {/* Language Immersion Badges */}
        {nanny.languages && nanny.languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(nanny.languages as string[]).map((lang) => {
              const tag = LANGUAGE_TAGS.find((l) => l.value === lang);
              if (!tag) return null;
              return (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/20"
                >
                  {tag.short} {tag.label.replace(" Immersion", "").replace("Te Reo Māori", "")}
                </span>
              );
            })}
          </div>
        )}

        {/* Availability */}
        {nanny.availabilitySummary && (
          <div className="bg-secondary/40 rounded-xl px-3 py-2 text-xs text-muted-foreground mb-4 border border-border/20 flex items-center gap-1.5">
            <span className="font-semibold text-foreground">Available:</span> 
            <span>{nanny.availabilitySummary}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-0 mt-auto">
        <Link href={`/nannies/${nanny.id}`}>
          <Button variant="outline" fullWidth size="sm" className="rounded-full">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}
