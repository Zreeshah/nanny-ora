"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, getInitials } from "@/lib/utils";
import { getAdminFamilies } from "@/server/actions/admin";

type Family = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  profile: {
    id: string;
    suburb: string;
    childAgeRange: string;
    careTypeNeeded: string;
    preferredDays: string;
    startDate: string | null;
    specialistNeeds: string;
    careLocations: string;
    notes: string;
  };
  membership: { plan: string; status: string; currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean } | null;
  jobs: { id: string; title: string; suburb: string; careType: string; status: string; createdAt: Date }[];
  enquiries: { id: string; status: string; createdAt: Date; nanny: { user: { name: string } } }[];
  counts: { jobPosts: number; enquiriesSent: number };
};

const statusClass: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
  MATCHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-50 text-slate-600 border-slate-200",
  INACTIVE: "bg-slate-50 text-slate-600 border-slate-200",
};

function displayList(value: string): string {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").join(", ") : value;
  } catch {
    return value;
  }
}

function statusBadge(status: string) {
  return <Badge className={`${statusClass[status] || "bg-secondary text-foreground/70 border-border"} rounded-full`} size="sm">{status.replaceAll("_", " ")}</Badge>;
}

export default function AdminFamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAdminFamilies()
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          setFamilies(result.data as Family[]);
        } else {
          setError(result.error || "We could not load family accounts.");
        }
      })
      .catch(() => setError("We could not load family accounts."))
      .finally(() => setLoaded(true));
  }, []);

  const filteredFamilies = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return families;
    return families.filter((family) => [
      family.name,
      family.email,
      family.phone || "",
      family.profile.suburb,
      displayList(family.profile.careTypeNeeded),
    ].some((value) => value.toLowerCase().includes(normalised)));
  }, [families, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Users className="w-5 h-5" aria-hidden="true" /></span>
          <div>
            <h1 className="font-heading text-3xl text-foreground">Family accounts</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Review each family&apos;s care brief, membership and recent activity.</p>
          </div>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="family-search" className="sr-only">Search families</label>
          <input
            id="family-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or suburb"
            className="w-full h-11 rounded-full border border-border/60 bg-card pl-10 pr-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <Card className="rounded-3xl border-emerald-100 bg-emerald-50/40 p-5 sm:p-6">
        <div className="flex gap-3">
          <span className="mt-0.5 w-8 h-8 shrink-0 rounded-xl bg-card text-emerald-700 flex items-center justify-center"><ClipboardList className="w-4 h-4" aria-hidden="true" /></span>
          <div>
            <h2 className="font-bold text-foreground text-sm">What to do after a family registers</h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">Registration creates their account immediately—there is nothing to approve. Open their record to understand their care brief, then follow up when they post a job or send an enquiry. You can use their listed contact details for agency follow-up.</p>
          </div>
        </div>
      </Card>

      {!loaded && <Card className="rounded-3xl border-border/40 p-10 text-center text-sm text-muted-foreground">Loading family accounts…</Card>}
      {loaded && error && <Card className="rounded-3xl border-red-200 bg-red-50/50 p-6 text-sm text-destructive">{error}</Card>}
      {loaded && !error && filteredFamilies.length === 0 && (
        <Card className="rounded-3xl border-border/40 p-10 text-center text-sm text-muted-foreground">
          {families.length === 0 ? "No family accounts have registered yet." : "No family accounts match your search."}
        </Card>
      )}

      <div className="space-y-3">
        {filteredFamilies.map((family) => {
          const expanded = expandedId === family.id;
          const mailto = `mailto:${family.email}?subject=${encodeURIComponent("Your NannyOra care brief")}`;
          return (
            <Card key={family.id} className="rounded-3xl border-border/40 p-0 overflow-hidden">
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{getInitials(family.name)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading font-bold text-foreground">{family.name}</h2>
                    {family.membership ? statusBadge(family.membership.status) : <Badge className="rounded-full bg-slate-50 text-slate-600 border-slate-200" size="sm">No membership</Badge>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />{family.profile.suburb}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />Registered {formatDate(family.createdAt)}</span>
                    <span>{family.counts.jobPosts} job{family.counts.jobPosts === 1 ? "" : "s"} · {family.counts.enquiriesSent} {family.counts.enquiriesSent === 1 ? "enquiry" : "enquiries"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a href={mailto} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors min-h-[38px]">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Email
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedId(expanded ? null : family.id)} aria-expanded={expanded} className="px-4">
                    {expanded ? "Hide details" : "View details"}{expanded ? <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />}
                  </Button>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-border/40 bg-secondary/20 p-5 sm:p-6 grid gap-5 lg:grid-cols-3">
                  <section className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Care brief</h3>
                      <dl className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><dt className="text-muted-foreground">Care needed</dt><dd className="mt-0.5 font-semibold text-foreground">{displayList(family.profile.careTypeNeeded) || "Not specified"}</dd></div>
                        <div><dt className="text-muted-foreground">Children&apos;s ages</dt><dd className="mt-0.5 font-semibold text-foreground">{displayList(family.profile.childAgeRange) || "Not specified"}</dd></div>
                        <div><dt className="text-muted-foreground">Preferred days</dt><dd className="mt-0.5 font-semibold text-foreground">{family.profile.preferredDays || "Not specified"}</dd></div>
                        <div><dt className="text-muted-foreground">Preferred start</dt><dd className="mt-0.5 font-semibold text-foreground">{family.profile.startDate || "Not specified"}</dd></div>
                        {family.profile.careLocations && <div className="sm:col-span-2"><dt className="text-muted-foreground">Other care locations or travel notes</dt><dd className="mt-0.5 text-foreground whitespace-pre-wrap">{family.profile.careLocations}</dd></div>}
                        {family.profile.specialistNeeds && <div className="sm:col-span-2"><dt className="text-muted-foreground">Specialist requirements</dt><dd className="mt-0.5 text-foreground whitespace-pre-wrap">{family.profile.specialistNeeds}</dd></div>}
                        {family.profile.notes && <div className="sm:col-span-2"><dt className="text-muted-foreground">Notes</dt><dd className="mt-0.5 text-foreground whitespace-pre-wrap">{family.profile.notes}</dd></div>}
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account activity</h3>
                      <div className="mt-2 space-y-2">
                        {family.jobs.map((job) => <div key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-card border border-border/40 px-3.5 py-3 text-sm"><div><p className="font-semibold text-foreground">{job.title}</p><p className="text-xs text-muted-foreground mt-0.5">{job.suburb} · {job.careType} · {formatDate(job.createdAt)}</p></div>{statusBadge(job.status)}</div>)}
                        {family.enquiries.map((enquiry) => <Link key={enquiry.id} href={`/admin/enquiries/${enquiry.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-card border border-border/40 px-3.5 py-3 text-sm hover:border-primary/40 transition-colors"><div><p className="font-semibold text-foreground">Enquiry about {enquiry.nanny.user.name}</p><p className="text-xs text-muted-foreground mt-0.5">{formatDate(enquiry.createdAt)}</p></div><span className="flex items-center gap-2">{statusBadge(enquiry.status)}<ExternalLink className="w-3.5 h-3.5 text-primary" aria-hidden="true" /></span></Link>)}
                        {family.jobs.length === 0 && family.enquiries.length === 0 && <p className="rounded-2xl bg-card border border-border/40 px-3.5 py-3 text-sm text-muted-foreground">No job posts or nanny enquiries yet.</p>}
                      </div>
                    </div>
                  </section>
                  <aside className="rounded-2xl bg-card border border-border/40 p-4 h-fit">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact & membership</h3>
                    <div className="mt-3 space-y-3 text-sm">
                      <a href={mailto} className="flex items-center gap-2 text-primary hover:text-primary-light break-all"><Mail className="w-4 h-4 shrink-0" aria-hidden="true" />{family.email}</a>
                      {family.phone && <a href={`tel:${family.phone}`} className="flex items-center gap-2 text-primary hover:text-primary-light"><Phone className="w-4 h-4 shrink-0" aria-hidden="true" />{family.phone}</a>}
                      <div className="pt-2 border-t border-border/40"><p className="text-muted-foreground">Membership</p><p className="font-semibold text-foreground mt-0.5">{family.membership ? `${family.membership.plan.replaceAll("_", " ")} · ${family.membership.status}` : "No membership record"}</p>{family.membership?.currentPeriodEnd && <p className="text-xs text-muted-foreground mt-1">Current period ends {formatDate(family.membership.currentPeriodEnd)}{family.membership.cancelAtPeriodEnd ? " · cancels then" : ""}</p>}</div>
                    </div>
                  </aside>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
