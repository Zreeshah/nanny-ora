"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate, formatRate } from "@/lib/utils";
import { CARE_TYPES, CHILD_AGE_RANGES } from "@/lib/constants";
import { getParentDashboard } from "@/server/actions/engagement";
import {
  MessageCircle, Briefcase, Search, Heart, Eye, MapPin,
  CheckCircle, Calendar, ArrowRight, Star,
  FileText, Bell, Users, Send, PlusCircle, Sparkles
} from "lucide-react";

export default function ParentDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const [dash, setDash] = useState<any>(null);

  useEffect(() => {
    getParentDashboard().then((r) => { if (r.success) setDash(r.data); }).catch(() => {});
  }, []);

  // "…" while loading — zeros would read as real data
  const stats = [
    { label: "Enquiries Sent", value: dash ? dash.enquiriesSent : "…", icon: Send, color: "text-primary" },
    { label: "Active Jobs", value: dash ? dash.activeJobs : "…", icon: Briefcase, color: "text-badge-verified" },
    { label: "Carers Viewed", value: dash ? dash.carersViewed : "…", icon: Eye, color: "text-accent" },
  ];
  const myEnquiries: any[] = dash?.recentEnquiries ?? [];
  const savedNannies: any[] = dash?.savedNannies ?? [];
  const myJobs: any[] = dash?.jobs ?? [];
  const recommended: any[] = dash?.recommended ?? [];
  const profile = dash?.profile;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary to-primary-dark rounded-3xl text-primary-foreground shadow-md relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full filter blur-xl -translate-y-8 translate-x-8 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full filter blur-lg translate-y-8 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl mb-1" style={{ color: '#FFFFFF' }}>
            Welcome back, {userName} 👋
          </h1>
          <p className="text-white/80 text-sm">
            Manage your childcare requests and connect with verified Auckland nannies.
          </p>
        </div>
        <Link href="/post-a-job" className="relative z-10 flex-shrink-0">
          <Button variant="accent" size="md" className="rounded-full shadow-md shadow-accent/15">
            <PlusCircle className="w-4.5 h-4.5 mr-1.5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Find a Nanny", icon: Search, color: "text-primary", href: "/find-a-nanny", bg: "bg-primary/5 border-primary/10" },
          { label: "Post a Job", icon: PlusCircle, color: "text-accent", href: "/post-a-job", bg: "bg-accent/5 border-accent/10" },
          { label: "My Enquiries", icon: Send, color: "text-blue-600", href: "#enquiries", bg: "bg-blue-50 border-blue-100/30" },
          { label: "Saved Nannies", icon: Heart, color: "text-rose-500", href: "#saved", bg: "bg-rose-50 border-rose-100/30" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Card hover className={`text-center cursor-pointer rounded-2xl border p-5 ${action.bg}`}>
              <div className="w-10 h-10 rounded-xl bg-white border border-border/40 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition-transform">
                <action.icon className={`w-5 h-5 ${action.color}`} aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-foreground block">{action.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border border-border/40 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 border border-border/10">
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1 truncate">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Enquiries */}
          <Card id="enquiries" className="rounded-3xl border-border/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" aria-hidden="true" />
                Active Enquiries
              </h2>
              <Link href="/find-a-nanny" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">
                Browse nannies →
              </Link>
            </div>
            <div className="space-y-3">
              {myEnquiries.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">You haven&apos;t sent any enquiries yet.</p>
              )}
              {myEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                    {enquiry.nannyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-foreground text-sm leading-none">{enquiry.nannyName}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{enquiry.message}&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                      <Link href={`/dashboard/parent/messages/${enquiry.id}`} className="text-[10px] font-bold text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> Open chat
                      </Link>
                      <Badge variant="premium" size="sm" className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
                        {enquiry.status === "NEW" ? "Awaiting Reply" : enquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center py-6 border border-dashed border-border/50 rounded-2xl bg-secondary/5 mt-4">
                <p className="text-xs text-muted-foreground mb-3">Looking to interview additional nannies?</p>
                <Link href="/find-a-nanny">
                  <Button variant="outline" size="sm" className="rounded-full bg-white">
                    <Search className="w-4 h-4 mr-1.5 text-primary" />
                    Find More Nannies
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Job Posts */}
          <Card className="rounded-3xl border-border/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-badge-verified" aria-hidden="true" />
                Childcare Job Posts
              </h2>
              <Link href="/post-a-job" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">
                New post →
              </Link>
            </div>
            <div className="space-y-3">
              {myJobs.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">No job posts yet — post one to reach our verified nannies.</p>
              )}
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-border hover:border-primary/20 transition-all bg-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground leading-snug">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-semibold">
                        <span className="bg-secondary px-2 py-0.5 rounded border border-border/20">
                          {CARE_TYPES.find((c) => c.value === job.careType)?.label ?? job.careType}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" />{job.daysRequired}</span>
                        <span>·</span>
                        <span className="text-primary font-bold">${job.hourlyBudget}/hr</span>
                      </div>
                    </div>
                    <Badge
                      variant={job.status === "APPROVED" ? "verified" : "premium"}
                      size="sm"
                      className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]"
                    >
                      {job.status === "APPROVED" ? "Live" : job.status === "PENDING" ? "Reviewing" : job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="rounded-3xl border-border/40">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-badge-premium fill-badge-premium" aria-hidden="true" />
                Recommended Auckland Nannies
              </h2>
            </div>
            <div className="space-y-3">
              {recommended.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">Loading recommendations…</p>
              )}
              {recommended.map((nanny) => (
                <div
                  key={nanny.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-border hover:border-primary/20 transition-all bg-card"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {nanny.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-foreground text-sm leading-none">{nanny.name}</span>
                      <VerificationBadge level={nanny.verificationLevel} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{nanny.suburb}</span>
                      <span>·</span>
                      <span>{nanny.yearsExperience}+ yrs experience</span>
                      <span>·</span>
                      <span className="font-bold text-primary">{formatRate(nanny.hourlyRate)}</span>
                    </div>
                  </div>
                  <Link href={`/nannies/${nanny.id}`} className="flex-shrink-0">
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border/40 text-center">
              <Link href="/find-a-nanny">
                <Button variant="outline" size="sm" className="rounded-full">
                  Browse All Nannies
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Family profile overview */}
          <Card className="rounded-3xl border-border/40 p-5 bg-card">
            <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
              Family Profile
            </h3>
            {profile ? (
              <div className="space-y-3.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {profile.suburb}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Children</span>
                  <span className="font-bold text-foreground text-right">
                    {profile.childAgeRange
                      .map((v: string) => CHILD_AGE_RANGES.find((a) => a.value === v)?.label ?? v)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Care Needed</span>
                  <span className="font-bold text-foreground text-right">
                    {profile.careTypeNeeded
                      .map((v: string) => CARE_TYPES.find((c) => c.value === v)?.label ?? v)
                      .join(", ") || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Preferred Days</span>
                  <span className="font-bold text-foreground text-right">{profile.preferredDays || "—"}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {dash ? "No family profile on record yet." : "Loading profile…"}
              </p>
            )}
            <div className="mt-5 pt-4 border-t border-border/40">
              <Link href="/dashboard/parent/profile">
                <Button variant="outline" fullWidth size="sm" className="rounded-full">
                  Edit Requirements
                </Button>
              </Link>
            </div>
          </Card>

          {/* Specialist needs card — only when the family recorded specialist requirements */}
          {profile?.specialistNeeds && (
            <Card className="rounded-3xl border-l-4 border-l-badge-specialist border-t border-r border-b border-badge-specialist/10 bg-badge-specialist/5 p-5">
              <h3 className="font-heading text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-badge-specialist fill-badge-specialist" aria-hidden="true" />
                Specialist profile
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.specialistNeeds}
              </p>
            </Card>
          )}

          {/* Saved nannies list */}
          <Card id="saved" className="rounded-3xl border-border/40 p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" aria-hidden="true" />
              Saved Nannies
            </h3>
            <div className="space-y-3.5">
              {savedNannies.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">No saved nannies yet. Tap the heart on any profile to save them here.</p>
              )}
              {savedNannies.map((nanny) => (
                <Link key={nanny.id} href={`/nannies/${nanny.id}`} className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      {nanny.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block leading-tight">{nanny.name}</span>
                      <span className="text-[9px] text-muted-foreground">{nanny.suburb}</span>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{formatRate(nanny.hourlyRate)}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Tips notification banner */}
          <Card className="rounded-3xl bg-primary/5 border border-primary/10 p-5">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">Safety reminder</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Always interview nannies via secure call first and conduct a paid, in-person trial run before starting ongoing care contracts.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
