"use client";

import { useState, useMemo, useEffect } from "react";
import { NannyCard } from "@/components/cards/NannyCard";
import { getFavouriteIds } from "@/server/actions/engagement";
import type { NannyProfilePublic } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  AUCKLAND_REGIONS,
  SUBURB_TO_REGION,
  CARE_TYPES,
  SPECIALIST_TAGS,
  LANGUAGE_TAGS,
  CHILD_AGE_RANGES,
} from "@/lib/constants";
import { Search, SlidersHorizontal, X, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { ImageBand } from "@/components/ui/ImageBand";
import { ShinyText } from "@/components/ui/ShinyText";

// ponytail: age range → specialist tag heuristic. No "childAge" field on nannies;
// map age ranges to existing specialist tags for a rough filter.
const AGE_TO_TAG: Record<string, string> = {
  newborn: "baby_experience",
  infant: "baby_experience",
  toddler: "baby_experience",
  preschool: "ece_background",
  school_age: "after_school_care",
  teenager: "after_school_care",
};

export default function FindANannyClient({ allNannies }: { allNannies: NannyProfilePublic[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  // Hydrate the current family's saved nannies so hearts show the right state.
  useEffect(() => {
    getFavouriteIds().then((r) => {
      if (r.success && Array.isArray(r.data)) setFavIds(new Set(r.data));
    }).catch(() => {});
  }, []);

  const [search, setSearch] = useState("");
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [suburb, setSuburb] = useState("");
  const [specialistTags, setSpecialistTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [ageRanges, setAgeRanges] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [eceExperience, setEceExperience] = useState(false);
  const [firstAid, setFirstAid] = useState(false);
  const [driverLicence, setDriverLicence] = useState(false);
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(100);

  const filteredNannies = useMemo(() => {
    let results = [...allNannies];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.bio.toLowerCase().includes(q) ||
          n.suburb.toLowerCase().includes(q)
      );
    }

    if (region) {
      results = results.filter((n) => {
        const nRegion = SUBURB_TO_REGION[n.suburb];
        const coversRegion = n.areasCovered.some(
          (a) => SUBURB_TO_REGION[a] === region
        );
        return nRegion === region || coversRegion;
      });
    }

    if (suburb) {
      const q = suburb.toLowerCase();
      results = results.filter(
        (n) =>
          n.suburb.toLowerCase().includes(q) ||
          n.areasCovered.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (careTypes.length > 0) {
      results = results.filter((n) =>
        careTypes.some((ct) => (n.careTypes as string[]).includes(ct))
      );
    }

    if (specialistTags.length > 0) {
      results = results.filter((n) =>
        specialistTags.some((st) => (n.specialistTags as string[]).includes(st))
      );
    }

    if (languages.length > 0) {
      results = results.filter((n) =>
        languages.some((l) => (n.languages as string[]).includes(l))
      );
    }

    if (ageRanges.length > 0) {
      const neededTags = ageRanges
        .map((a) => AGE_TO_TAG[a])
        .filter(Boolean);
      results = results.filter((n) =>
        neededTags.some((t) => (n.specialistTags as string[]).includes(t))
      );
    }

    if (verifiedOnly) results = results.filter((n) => n.verificationLevel !== "LISTED");
    if (eceExperience) results = results.filter((n) => n.eceExperience);
    if (firstAid) results = results.filter((n) => n.firstAidCurrent);
    if (driverLicence) results = results.filter((n) => n.driverLicence);
    if (minRate > 0) results = results.filter((n) => n.hourlyRate >= minRate);
    if (maxRate < 100) results = results.filter((n) => n.hourlyRate <= maxRate);

    return results;
  }, [search, region, suburb, careTypes, specialistTags, languages, ageRanges, verifiedOnly, eceExperience, firstAid, driverLicence, minRate, maxRate, allNannies]);

  const activeFilterCount = [
    careTypes.length > 0,
    region,
    suburb,
    specialistTags.length > 0,
    languages.length > 0,
    ageRanges.length > 0,
    verifiedOnly,
    eceExperience,
    firstAid,
    driverLicence,
    minRate > 0,
    maxRate < 100,
  ].filter(Boolean).length;

  const toggleArray = (arr: string[], val: string, setter: (v: string[]) => void) =>
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const clearFilters = () => {
    setSearch("");
    setCareTypes([]);
    setRegion("");
    setSuburb("");
    setSpecialistTags([]);
    setLanguages([]);
    setAgeRanges([]);
    setVerifiedOnly(false);
    setEceExperience(false);
    setFirstAid(false);
    setDriverLicence(false);
    setMinRate(0);
    setMaxRate(100);
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-border/30 py-5 first:pt-0 last:border-0">
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );

  const CheckboxPill = ({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
        checked
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border/60 hover:border-primary/40"
      }`}
    >
      {label}
    </button>
  );

  const Sidebar = () => (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-accent hover:text-accent-light transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search name, suburb..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border/70 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <FilterSection title="Core Childcare">
        <div className="flex flex-wrap gap-2">
          {CARE_TYPES.map((c) => (
            <CheckboxPill
              key={c.value}
              checked={careTypes.includes(c.value)}
              onClick={() => toggleArray(careTypes, c.value, setCareTypes)}
              label={c.label}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <div className="flex flex-wrap gap-2 mb-3">
          {AUCKLAND_REGIONS.map((r) => (
            <CheckboxPill
              key={r.value}
              checked={region === r.value}
              onClick={() => setRegion(region === r.value ? "" : r.value)}
              label={r.label}
            />
          ))}
        </div>
        <input
          type="text"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder="Type a suburb..."
          className="w-full px-3 py-2 rounded-xl border border-border/70 bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </FilterSection>

      <FilterSection title="Specialization">
        <div className="flex flex-wrap gap-2">
          {SPECIALIST_TAGS.filter((s) => ["sensory_aware", "neurodiverse", "autism_support", "adhd_support", "ece_background", "registered_teacher", "early_intervention"].includes(s.value)).map((s) => (
            <CheckboxPill
              key={s.value}
              checked={specialistTags.includes(s.value)}
              onClick={() => toggleArray(specialistTags, s.value, setSpecialistTags)}
              label={s.label}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Language Immersion">
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_TAGS.map((l) => (
            <CheckboxPill
              key={l.value}
              checked={languages.includes(l.value)}
              onClick={() => toggleArray(languages, l.value, setLanguages)}
              label={`${l.short} ${l.label.replace(" Immersion", "")}`}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Child Age">
        <div className="flex flex-wrap gap-2">
          {CHILD_AGE_RANGES.map((a) => (
            <CheckboxPill
              key={a.value}
              checked={ageRanges.includes(a.value)}
              onClick={() => toggleArray(ageRanges, a.value, setAgeRanges)}
              label={a.label.split(" (")[0]}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Quick Filters">
        <div className="flex flex-wrap gap-2">
          <CheckboxPill checked={verifiedOnly} onClick={() => setVerifiedOnly(!verifiedOnly)} label="Verified Only" />
          <CheckboxPill checked={eceExperience} onClick={() => setEceExperience(!eceExperience)} label="ECE Qualified" />
          <CheckboxPill checked={firstAid} onClick={() => setFirstAid(!firstAid)} label="First Aid" />
          <CheckboxPill checked={driverLicence} onClick={() => setDriverLicence(!driverLicence)} label="Driver Licence" />
        </div>
      </FilterSection>

      <FilterSection title="Rate Range">
        <div className="flex items-center gap-3">
          <input
            type="range" min={0} max={100} step={5} value={minRate}
            onChange={(e) => setMinRate(Number(e.target.value))}
            className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
            aria-label="Minimum hourly rate"
          />
          <span className="text-xs font-semibold text-foreground whitespace-nowrap bg-secondary/50 py-1 px-2.5 rounded-full border border-border/30">
            ${minRate}–${maxRate}/hr
          </span>
          <input
            type="range" min={0} max={100} step={5} value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
            className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
            aria-label="Maximum hourly rate"
          />
        </div>
      </FilterSection>

      {/* Childcare Support Options — kept soft & optional */}
      <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/15 p-4">
        <div className="flex items-start gap-2.5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-foreground mb-1">Childcare Support Options</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Some recurring or full-time care arrangements may qualify for additional support.
              Eligibility is assessed privately by our team.{" "}
              <Link href="/childcare-support" className="font-semibold text-primary hover:text-primary-light underline underline-offset-2">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Find a Nanny in <ShinyText>Auckland</ShinyText>
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse verified, experienced nannies across Auckland suburbs.
        </p>
      </div>

      <ImageBand
        tags={["find", "family", "professional", "care"]}
        seed="find-a-nanny"
        aspect="aspect-[16/6]"
        priority
        className="mb-8"
      />

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative rounded-full w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-4">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border/40 shadow-2xl overflow-y-auto p-5 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary/50">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="mt-8">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredNannies.length} nann{filteredNannies.length === 1 ? "y" : "ies"} found
            </p>
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {careTypes.slice(0, 2).map((ct) => (
                  <Badge key={ct} variant="outline" size="sm">
                    {CARE_TYPES.find((c) => c.value === ct)?.label}
                    <button onClick={() => toggleArray(careTypes, ct, setCareTypes)} className="ml-1 cursor-pointer" aria-label={`Remove ${ct} filter`}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {region && (
                  <Badge variant="outline" size="sm">
                    {AUCKLAND_REGIONS.find((r) => r.value === region)?.label}
                    <button onClick={() => setRegion("")} className="ml-1 cursor-pointer" aria-label={`Remove ${region} filter`}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {languages.slice(0, 1).map((l) => (
                  <Badge key={l} variant="outline" size="sm">
                    {LANGUAGE_TAGS.find((t) => t.value === l)?.short}
                    <button onClick={() => toggleArray(languages, l, setLanguages)} className="ml-1 cursor-pointer" aria-label={`Remove ${l} filter`}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Nanny Grid */}
          {filteredNannies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
              {filteredNannies.map((nanny) => (
                <NannyCard key={nanny.id} nanny={nanny} favourited={favIds.has(nanny.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No nannies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms.
              </p>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
