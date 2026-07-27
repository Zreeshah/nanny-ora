import Link from "next/link";
import {
  Users, Briefcase, MessageCircle, ArrowRight, ShieldCheck,
  Fingerprint, PhoneCall, Video, BadgeCheck, UserPlus,
  FileCheck, Heart, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import StatsTicker from "@/components/home/StatsTicker";
import { getInitials, formatDate } from "@/lib/utils";
import { getAdminStats } from "@/server/actions/admin";

// All figures on this dashboard come from getAdminStats (live DB). No mock data.

const FUNNEL_ICONS = [UserPlus, Fingerprint, PhoneCall, ShieldCheck, Video, BadgeCheck];

type Stats = {
  totalNannies: number; pendingNannies: number; approvedNannies: number;
  totalJobs: number; pendingJobs: number; newEnquiries: number;
  totalParents: number; activePlacements: number;
  funnel: { label: string; count: number }[];
  recentApplications: { id: string; name: string; suburb: string; status: string; createdAt: string | Date }[];
  recentActivity: { text: string; when: string | Date }[];
};

const EMPTY: Stats = {
  totalNannies: 0, pendingNannies: 0, approvedNannies: 0, totalJobs: 0, pendingJobs: 0,
  newEnquiries: 0, totalParents: 0, activePlacements: 0, funnel: [], recentApplications: [], recentActivity: [],
};

export default async function AdminDashboard() {
  let stats = EMPTY;
  try {
    const res = await getAdminStats();
    if (res.success && res.data) stats = { ...EMPTY, ...(res.data as Stats) };
  } catch (err) {
    console.error("Failed to load admin stats:", err);
  }

  const verificationPct = stats.totalNannies
    ? Math.round((stats.approvedNannies / stats.totalNannies) * 100)
    : 0;
  const funnelMax = stats.funnel[0]?.count || 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-background to-accent/10 p-6 sm:p-8 shadow-sm">
        <div className="absolute -top-10 -right-6 w-52 h-52 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/4 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/70 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · childcare network
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-1.5">Good day, Admin 👋</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              <span className="font-bold text-foreground">{stats.pendingNannies}</span> nanny application(s) awaiting review across Auckland.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:min-w-[380px]">
            {[
              { label: "Applications to review", value: stats.pendingNannies, dot: "bg-amber-500" },
              { label: "Jobs to approve", value: stats.pendingJobs, dot: "bg-blue-500" },
              { label: "New enquiries", value: stats.newEnquiries, dot: "bg-accent" },
              { label: "Registered families", value: stats.totalParents, dot: "bg-emerald-500" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-2.5 bg-card/80 backdrop-blur rounded-2xl px-3.5 py-2.5 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse flex-shrink-0`} />
                <div className="min-w-0">
                  <div className="font-heading text-lg font-bold text-foreground leading-none">
                    <StatsTicker value={c.value} />
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Nannies", value: stats.totalNannies, sub: `${stats.approvedNannies} approved · ${Math.max(stats.totalNannies - stats.approvedNannies, 0)} onboarding`, icon: Users, tint: "bg-primary/5 text-primary" },
          { label: "Verification", value: verificationPct, suffix: "%", sub: "approved of all applicants", icon: FileCheck, tint: "bg-accent/10 text-accent" },
          { label: "Parent Enquiries", value: stats.newEnquiries, sub: "new / unactioned", icon: MessageCircle, tint: "bg-accent/5 text-accent" },
          { label: "Active Placements", value: stats.activePlacements, sub: "nannies currently placed", icon: Heart, tint: "bg-emerald-50 text-emerald-600" },
        ].map((k) => (
          <Card key={k.label} className="rounded-3xl border-border/40 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                <p className="font-heading text-3xl font-bold text-foreground leading-none mt-1">
                  <StatsTicker value={k.value} />{k.suffix && <span className="text-lg">{k.suffix}</span>}
                </p>
              </div>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.tint}`}><k.icon className="w-5 h-5" /></span>
            </div>
            <p className="text-[11px] text-muted-foreground">{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* ===== VERIFICATION FUNNEL (real) ===== */}
      <Card className="rounded-3xl border-border/40 p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">The NannyOra Trust Standard</span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-1">Verification funnel</h2>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            <span className="font-bold text-foreground">{stats.totalNannies}</span> applicants → <span className="font-bold text-badge-verified">{stats.approvedNannies}</span> approved
          </p>
        </div>
        <div className="space-y-3">
          {stats.funnel.map((s, i) => {
            const Icon = FUNNEL_ICONS[i] ?? BadgeCheck;
            const pct = Math.round((s.count / funnelMax) * 100);
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32 flex-shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">{s.label}</span>
                </div>
                <div className="flex-1 h-9 rounded-xl bg-secondary/40 overflow-hidden relative">
                  <div className="h-full rounded-xl bg-gradient-to-r from-primary to-primary-light flex items-center justify-end pr-3" style={{ width: `${Math.max(pct, 6)}%` }}>
                    <span className="text-xs font-bold text-primary-foreground">{s.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ===== RECENT APPLICATIONS + ACTIVITY ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Recent applications</h2>
            <Link href="/admin/nannies" className="text-xs font-bold text-primary hover:text-primary-light inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats.recentApplications.length === 0 ? (
            <Card className="rounded-3xl border-border/40 p-8 text-center text-sm text-muted-foreground">No applications yet.</Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.recentApplications.map((n) => (
                <Card key={n.id} className="rounded-3xl border-border/40 p-4 flex gap-4">
                  <span className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    {getInitials(n.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-foreground truncate">{n.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{n.suburb}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-foreground/70 uppercase tracking-wide">{n.status}</span>
                      <span className="text-[10px] text-muted-foreground">{formatDate(n.createdAt as any)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Recent activity</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <Card className="rounded-3xl border-border/40 p-2">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No recent activity.</p>
            ) : (
              <ol>
                {stats.recentActivity.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-secondary/40 transition-colors">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-accent/10 text-accent">
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(a.when as any)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>

      {/* ===== REVIEW QUEUES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/nannies", label: "Carer applications", count: stats.pendingNannies, icon: Users, tint: "bg-amber-50 text-badge-premium" },
          { href: "/admin/jobs", label: "Job postings", count: stats.pendingJobs, icon: Briefcase, tint: "bg-primary/5 text-primary" },
          { href: "/admin/enquiries", label: "Parent enquiries", count: stats.newEnquiries, icon: MessageCircle, tint: "bg-accent/5 text-accent" },
        ].map((q) => (
          <Link key={q.href} href={q.href}>
            <Card className="rounded-3xl border-border/40 p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${q.tint}`}><q.icon className="w-5 h-5" /></span>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{q.label}</p>
                <p className="text-[11px] text-muted-foreground">{q.count} awaiting review</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
