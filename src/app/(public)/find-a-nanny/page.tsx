"use client";

import { useState, useMemo } from "react";
import { NannyCard } from "@/components/cards/NannyCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getSampleNannies } from "@/lib/data/sample-nannies";
import {
  AUCKLAND_SUBURBS,
  CARE_TYPES,
  SPECIALIST_TAGS,
  EXPERIENCE_LEVELS,
} from "@/lib/constants";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ImageBand } from "@/components/ui/ImageBand";

export default function FindANannyPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    suburb: "",
    careType: "",
    specialistTag: "",
    verifiedOnly: false,
    eceExperience: false,
    firstAid: false,
    driverLicence: false,
    minRate: 0,
    maxRate: 100,
    search: "",
  });

  const allNannies = getSampleNannies();

  const filteredNannies = useMemo(() => {
    let results = [...allNannies];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.bio.toLowerCase().includes(q) ||
          n.suburb.toLowerCase().includes(q)
      );
    }

    if (filters.suburb) {
      results = results.filter(
        (n) =>
          n.suburb === filters.suburb ||
          n.areasCovered.includes(filters.suburb)
      );
    }

    if (filters.careType) {
      results = results.filter((n) =>
        (n.careTypes as string[]).includes(filters.careType)
      );
    }

    if (filters.specialistTag) {
      results = results.filter((n) =>
        (n.specialistTags as string[]).includes(filters.specialistTag)
      );
    }

    if (filters.verifiedOnly) {
      results = results.filter((n) => n.verificationLevel !== "LISTED");
    }

    if (filters.eceExperience) {
      results = results.filter((n) => n.eceExperience);
    }

    if (filters.firstAid) {
      results = results.filter((n) => n.firstAidCurrent);
    }

    if (filters.driverLicence) {
      results = results.filter((n) => n.driverLicence);
    }

    if (filters.minRate > 0) {
      results = results.filter((n) => n.hourlyRate >= filters.minRate);
    }

    if (filters.maxRate < 100) {
      results = results.filter((n) => n.hourlyRate <= filters.maxRate);
    }

    return results;
  }, [filters, allNannies]);

  const activeFilterCount = [
    filters.suburb,
    filters.careType,
    filters.specialistTag,
    filters.verifiedOnly,
    filters.eceExperience,
    filters.firstAid,
    filters.driverLicence,
    filters.minRate > 0,
    filters.maxRate < 100,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      suburb: "",
      careType: "",
      specialistTag: "",
      verifiedOnly: false,
      eceExperience: false,
      firstAid: false,
      driverLicence: false,
      minRate: 0,
      maxRate: 100,
      search: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Find a Nanny in Auckland
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name, suburb, or keyword..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/70 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-ring/8 focus:border-primary transition-all duration-300 min-h-[46px]"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="relative rounded-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="bg-card border border-border/40 rounded-3xl p-6 mb-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Filter Nannies</h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-accent hover:text-accent-light transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Suburb"
              options={AUCKLAND_SUBURBS.map((s) => ({ value: s, label: s }))}
              value={filters.suburb}
              onChange={(e) => setFilters((f) => ({ ...f, suburb: e.target.value }))}
              placeholder="All suburbs"
            />
            <Select
              label="Care Type"
              options={CARE_TYPES.map((c) => ({ value: c.value, label: c.label }))}
              value={filters.careType}
              onChange={(e) => setFilters((f) => ({ ...f, careType: e.target.value }))}
              placeholder="All care types"
            />
            <Select
              label="Specialist Support"
              options={SPECIALIST_TAGS.map((s) => ({ value: s.value, label: s.label }))}
              value={filters.specialistTag}
              onChange={(e) => setFilters((f) => ({ ...f, specialistTag: e.target.value }))}
              placeholder="Any specialist"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 mt-5">
            {[
              { key: "verifiedOnly" as const, label: "Verified Only" },
              { key: "eceExperience" as const, label: "ECE Experience" },
              { key: "firstAid" as const, label: "First Aid" },
              { key: "driverLicence" as const, label: "Driver Licence" },
            ].map((toggle) => (
              <button
                key={toggle.key}
                onClick={() =>
                  setFilters((f) => ({ ...f, [toggle.key]: !f[toggle.key] }))
                }
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer min-h-[38px] ${
                  filters[toggle.key]
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/40"
                }`}
              >
                {toggle.label}
              </button>
            ))}
          </div>

          {/* Rate Range */}
          <div className="mt-5 pt-4 border-t border-border/20 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rate Range:</span>
            <div className="flex items-center gap-3 flex-1">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={filters.minRate}
                onChange={(e) => setFilters((f) => ({ ...f, minRate: Number(e.target.value) }))}
                className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                aria-label="Minimum hourly rate"
              />
              <span className="text-sm font-semibold text-foreground w-28 text-center bg-secondary/50 py-1.5 px-3 rounded-full border border-border/30">
                ${filters.minRate} – ${filters.maxRate}/hr
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={filters.maxRate}
                onChange={(e) => setFilters((f) => ({ ...f, maxRate: Number(e.target.value) }))}
                className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
                aria-label="Maximum hourly rate"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredNannies.length} nann{filteredNannies.length === 1 ? "y" : "ies"} found
        </p>
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.suburb && (
              <Badge variant="outline" size="sm">
                {filters.suburb}
                <button onClick={() => setFilters((f) => ({ ...f, suburb: "" }))} className="ml-1 cursor-pointer" aria-label={`Remove ${filters.suburb} filter`}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Nanny Grid */}
      {filteredNannies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filteredNannies.map((nanny) => (
            <NannyCard key={nanny.id} nanny={nanny} />
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
  );
}
