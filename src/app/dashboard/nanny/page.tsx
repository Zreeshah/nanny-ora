"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { CARE_TYPES } from "@/lib/constants";
import { getNannyDashboard } from "@/server/actions/engagement";
import { applyToJob } from "@/server/actions/job";
import {
  MessageCircle, Briefcase, Clock, Star, Eye, MapPin,
  CheckCircle, Shield, Award, Calendar, TrendingUp,
  FileText, Bell, Sparkles
} from "lucide-react";

export default function NannyDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "Nanny";
  const [dash, setDash] = useState<any>(null);

  useEffect(() => {
    getNannyDashboard().then((r) => { if (r.success) setDash(r.data); }).catch(() => {});
  }, []);

  const completionPct = dash ? Math.round((dash.verifiedChecks / dash.totalChecks) * 100) : 0;
  // "…" while loading — zeros would read as real data
  const stats = [
    { label: "Profile Views", value: dash ? dash.profileViews : "…", icon: Eye, color: "text-primary", trend: "All time", bg: "bg-primary/5" },
    { label: "New Enquiries", value: dash ? dash.newEnquiries : "…", icon: MessageCircle, color: "text-accent", trend: `${dash?.newEnquiries ?? 0} awaiting`, bg: "bg-accent/5" },
    { label: "Matching Jobs", value: dash ? dash.matchingJobs : "…", icon: Briefcase, color: "text-blue-600", trend: "Approved & live", bg: "bg-blue-50" },
    { label: "Rating", value: dash?.reviewCount ? dash.avgRating : "—", icon: Star, color: "text-amber-500", trend: dash?.reviewCount ? `${dash.reviewCount} reviews` : "No reviews yet", bg: "bg-amber-50" },
  ];
  const recentEnquiries: any[] = dash?.recentEnquiries ?? [];
  const recentJobs: any[] = dash?.recentJobs ?? [];
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  useEffect(() => {
    if (dash?.appliedJobIds) setAppliedIds(new Set(dash.appliedJobIds));
  }, [dash?.appliedJobIds]);

  const handleApply = async (jobId: string) => {
    if (applyingId) return;
    setApplyingId(jobId);
    const res = await applyToJob(jobId);
    setApplyingId(null);
    if (res.success) setAppliedIds((prev) => new Set(prev).add(jobId));
  };
  const checks: { name: string; status: string }[] = dash?.checks ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary to-primary-dark rounded-3xl text-primary-foreground shadow-md relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full filter blur-xl -translate-y-8 translate-x-8 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full filter blur-lg translate-y-8 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl mb-1" style={{ color: '#FFFFFF' }}>
            Welcome back, {userName} 👋
          </h1>
          <p className="text-white/80 text-sm">
            Here is the current activity overview for your NannyOra carer profile.
          </p>
        </div>
        <Link href="/dashboard/nanny/profile" className="relative z-10 flex-shrink-0">
          <Button variant="accent" size="md" className="rounded-full shadow-md shadow-accent/15">
            Update Profile
          </Button>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border/40 p-5 bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              </div>
              <TrendingUp className="w-4 h-4 text-badge-verified stroke-[2.5]" aria-hidden="true" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground leading-none">{stat.value}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2">{stat.label}</p>
            <p className="text-[10px] font-semibold text-badge-verified mt-1">{stat.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Enquiries */}
          <Card className="rounded-3xl border-border/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-accent" aria-hidden="true" />
                Recent Enquiries
              </h2>
              <Link href="/dashboard/nanny/enquiries" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">
                View all enquiries →
              </Link>
            </div>
            <div className="space-y-3">
              {recentEnquiries.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">No enquiries yet — they&apos;ll appear here as families reach out.</p>
              )}
              {recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border hover:bg-muted/50 bg-card transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {enquiry.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-foreground text-sm leading-none">{enquiry.name}</span>
                      {enquiry.status === "NEW" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent ml-auto flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed truncate mb-2">
                      &ldquo;{enquiry.message}&rdquo;
                    </p>
                    <span className="text-[10px] text-muted-foreground">{formatDate(enquiry.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Matching Jobs */}
          <Card className="rounded-3xl border-border/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" aria-hidden="true" />
                Jobs Matching Your Profile
              </h2>
            </div>
            <div className="space-y-3">
              {recentJobs.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">No live job posts right now — new family jobs will appear here once approved.</p>
              )}
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-border hover:border-primary/20 bg-card transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground leading-snug">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{job.suburb}</span>
                        <span>·</span>
                        <span className="text-primary font-bold">${job.hourlyBudget}/hr</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" />{job.daysRequired}</span>
                      </div>
                    </div>
                    {appliedIds.has(job.id) ? (
                      <span className="text-xs font-bold text-badge-verified flex items-center gap-1 flex-shrink-0">
                        <CheckCircle className="w-4 h-4" aria-hidden="true" /> Applied
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold text-primary rounded-full flex-shrink-0"
                        isLoading={applyingId === job.id}
                        onClick={() => handleApply(job.id)}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    <Badge variant="specialist" size="sm" className="rounded-full text-[9px] font-bold">
                      {CARE_TYPES.find((c) => c.value === job.careType)?.label ?? job.careType}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Status */}
          <Card className="rounded-3xl border-border/40 p-5 bg-card">
            <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
              Profile Status
            </h3>
            <div className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Verification Badge</span>
                <VerificationBadge level={(dash?.verificationLevel ?? "LISTED") as any} />
              </div>
              <div className="flex items-center justify-between">
                <span>Verified Checks</span>
                <Badge variant="verified" size="sm" className="px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider">{dash?.verifiedChecks ?? 0} / {dash?.totalChecks ?? 7}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Completion Percentage</span>
                <span className="font-bold text-badge-verified">{completionPct}%</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40">
              <Link href="/dashboard/nanny/profile">
                <Button variant="outline" fullWidth size="sm" className="rounded-full">
                  Edit Profile Fields
                </Button>
              </Link>
            </div>
          </Card>

          {/* Safety Vetting Checks */}
          <Card className="rounded-3xl border-border/40 p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
              Safety Vetting Checks
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">7 checks required for full verification</p>
            <div className="space-y-3 text-xs text-muted-foreground">
              {checks.length === 0 && <p className="text-xs text-muted-foreground">Loading checks…</p>}
              {checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between">
                  <span className="text-foreground">{check.name}</span>
                  {check.status === "VERIFIED" && (
                    <CheckCircle className="w-4 h-4 text-badge-verified stroke-[2.5]" aria-label="Verified" />
                  )}
                  {check.status === "SUBMITTED" && (
                    <Clock className="w-4 h-4 text-badge-premium stroke-[2.5]" aria-label="Pending review" />
                  )}
                  {check.status === "NOT_STARTED" && (
                    <Link href="/dashboard/nanny/profile" className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
                      Upload →
                    </Link>
                  )}
                  {check.status === "REJECTED" && (
                    <span className="text-[10px] font-bold text-red-500">Rejected</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border/40">
              <Link href="/dashboard/nanny/profile">
                <Button variant="outline" fullWidth size="sm" className="rounded-full">
                  Manage Documents & Checks
                </Button>
              </Link>
            </div>
          </Card>

          {/* Tips notification banner */}
          <Card className="rounded-3xl bg-primary/5 border border-primary/10 p-5">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">Weekly tip</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Carers who update their home suburb preferences receive 2.5× more localized matching notifications. Keep details fresh!
                </p>
              </div>
            </div>
          </Card>

          {/* Calendar Availability */}
          <Card className="rounded-3xl border-border/40 p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
              Current Availability
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {dash?.availabilitySummary
                ? `Listed as: ${dash.availabilitySummary}`
                : "No availability summary set yet — add one so families know your schedule."}
            </p>
            <Link href="/dashboard/nanny/profile">
              <Button variant="ghost" size="sm" fullWidth className="rounded-full">
                Update Schedule
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
