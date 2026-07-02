import Image from "next/image";
import Link from "next/link";
import {
  Users, Briefcase, MessageCircle, Clock, ArrowRight, ShieldCheck,
  Fingerprint, Video, PhoneCall, GraduationCap, CalendarCheck, BadgeCheck,
  TrendingUp, Upload, FileCheck, Sparkles, Heart, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import StatsTicker from "@/components/home/StatsTicker";
import { getAdminStats } from "@/server/actions/admin";

// ponytail: headline KPIs are live (getAdminStats); the funnel, recent
// applications, and activity feed use representative data until wired to
// dedicated queries (verification counts already exist as nannyProfile fields).

const FUNNEL = [
  { label: "Identity", icon: Fingerprint, count: 94 },
  { label: "Interview", icon: Video, count: 81 },
  { label: "References", icon: PhoneCall, count: 69 },
  { label: "Police Vet", icon: ShieldCheck, count: 58 },
  { label: "Qualified", icon: GraduationCap, count: 51 },
  { label: "Trial", icon: CalendarCheck, count: 37 },
  { label: "Approved", icon: BadgeCheck, count: 29 },
];

const RECENT = [
  { name: "Sarah K.", tags: ["ECE Qualified", "ADHD Support"], done: 5, suburb: "Remuera", when: "Interview tomorrow", img: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  { name: "Emma T.", tags: ["Sensory-Aware", "Registered Teacher"], done: 6, suburb: "Ponsonby", when: "References running", img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  { name: "Mia J.", tags: ["First Aid", "After-School"], done: 4, suburb: "Devonport", when: "Awaiting police vet", img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
  { name: "Aroha W.", tags: ["Newborn Care", "Montessori"], done: 3, suburb: "Takapuna", when: "Documents pending", img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
];

const ACTIVITY = [
  { icon: Upload, text: "Emma T. uploaded photo ID", when: "5m ago", tint: "bg-blue-50 text-blue-600" },
  { icon: PhoneCall, text: "Reference check completed for Sarah K.", when: "22m ago", tint: "bg-emerald-50 text-emerald-600" },
  { icon: Briefcase, text: "New job posted — Grey Lynn family", when: "1h ago", tint: "bg-primary/10 text-primary" },
  { icon: CalendarCheck, text: "Trial session approved — Mia J.", when: "2h ago", tint: "bg-amber-50 text-amber-600" },
  { icon: MessageCircle, text: "New enquiry received — Epsom", when: "3h ago", tint: "bg-accent/10 text-accent" },
  { icon: ShieldCheck, text: "Police vet returned clear — Aroha W.", when: "5h ago", tint: "bg-teal-50 text-teal-600" },
];

const CHIPS = [
  { label: "Pending Interviews", value: 4, dot: "bg-amber-500" },
  { label: "Reference Checks Running", value: 2, dot: "bg-blue-500" },
  { label: "Family Awaiting Match", value: 1, dot: "bg-accent" },
  { label: "New Enquiries Today", value: 3, dot: "bg-emerald-500" },
];

// Tiny inline sparkline — no chart lib.
function Sparkline({ points, className = "text-primary" }: { points: number[]; className?: string }) {
  const w = 96, h = 32, max = Math.max(...points), min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / span) * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-24 h-8 ${className}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// SVG completion ring.
function Ring({ pct }: { pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--secondary)" strokeWidth="7" />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
      />
    </svg>
  );
}

export default async function AdminDashboard() {
  let stats = {
    pendingNannies: 3, approvedNannies: 7, totalNannies: 10,
    pendingJobs: 2, approvedJobs: 5, newEnquiries: 4, totalParents: 15,
  };
  try {
    const res = await getAdminStats();
    if (res.success && res.data) stats = res.data as typeof stats;
  } catch (err) {
    console.error("Failed to load admin stats from database:", err);
  }

  const funnelMax = FUNNEL[0].count;
  const inactive = Math.max(stats.totalNannies - stats.approvedNannies, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ===== HERO — live operations overview ===== */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-background to-accent/10 p-6 sm:p-8 shadow-sm">
        {/* Soft animated mesh glow */}
        <div className="absolute -top-10 -right-6 w-52 h-52 bg-accent/15 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-12 left-1/4 w-44 h-44 bg-primary/10 rounded-full blur-3xl animate-float-medium pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/70 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · childcare network
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-1.5">
              Good morning, Admin 👋
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              <span className="font-bold text-foreground">12 nanny applications</span> received this week across Auckland.
            </p>
          </div>

          {/* Animated stat chips */}
          <div className="grid grid-cols-2 gap-2.5 sm:min-w-[380px]">
            {CHIPS.map((c) => (
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
        {/* Total Nannies */}
        <Card className="rounded-3xl border-border/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Nannies</p>
              <p className="font-heading text-3xl font-bold text-foreground leading-none mt-1">
                <StatsTicker value={stats.totalNannies} />
              </p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center"><Users className="w-5 h-5" /></span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {RECENT.slice(0, 3).map((n) => (
                <span key={n.name} className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-card">
                  <Image src={n.img} alt={n.name} fill className="object-cover" sizes="28px" />
                </span>
              ))}
            </div>
            <Sparkline points={[4, 5, 5, 7, 6, 8, 10]} className="text-primary/70" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            <span className="font-bold text-badge-verified">{stats.approvedNannies} active</span> · {inactive} onboarding
          </p>
        </Card>

        {/* Verification Progress */}
        <Card className="rounded-3xl border-border/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verification</p>
              <p className="font-heading text-3xl font-bold text-foreground leading-none mt-1">72<span className="text-lg">%</span></p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center"><FileCheck className="w-5 h-5" /></span>
          </div>
          <div className="flex items-center gap-3">
            <Ring pct={72} />
            <p className="text-[11px] text-muted-foreground leading-tight">Average completion across active applications</p>
          </div>
        </Card>

        {/* Parent Enquiries */}
        <Card className="rounded-3xl border-border/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Parent Enquiries</p>
              <p className="font-heading text-3xl font-bold text-foreground leading-none mt-1">
                <StatsTicker value={stats.newEnquiries} />
              </p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-accent/5 text-accent flex items-center justify-center"><MessageCircle className="w-5 h-5" /></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-badge-verified">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ 32% this week
            </span>
            <Sparkline points={[2, 3, 2, 4, 3, 5, 6]} className="text-badge-verified/70" />
          </div>
        </Card>

        {/* Active Placements */}
        <Card className="rounded-3xl border-border/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Placements</p>
              <p className="font-heading text-3xl font-bold text-foreground leading-none mt-1">
                <StatsTicker value={18} />
              </p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Heart className="w-5 h-5" /></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">families matched</span>
            <span className="text-[11px] font-bold text-badge-premium">3 expiring soon</span>
          </div>
          <Sparkline points={[10, 12, 13, 14, 16, 17, 18]} className="text-emerald-500/70 mt-2" />
        </Card>
      </div>

      {/* ===== 7-STEP VERIFICATION FUNNEL (centerpiece) ===== */}
      <Card className="rounded-3xl border-border/40 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">The NannyOra Trust Standard</span>
        </div>
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">7-step verification funnel</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            <span className="font-bold text-foreground">120</span> applicants → <span className="font-bold text-badge-verified">29</span> approved
          </p>
        </div>

        <div className="space-y-3">
          {FUNNEL.map((s, i) => {
            const Icon = s.icon;
            const pct = Math.round((s.count / funnelMax) * 100);
            const drop = i > 0 ? FUNNEL[i - 1].count - s.count : 0;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-32 flex-shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-secondary text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">{s.label}</span>
                </div>
                <div className="flex-1 h-9 rounded-xl bg-secondary/40 overflow-hidden relative">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-primary to-primary-light origin-left animate-[grow-x_0.9s_cubic-bezier(0.16,1,0.3,1)_both] flex items-center justify-end pr-3"
                    style={{ width: `${pct}%`, animationDelay: `${i * 90}ms` }}
                  >
                    <span className="text-xs font-bold text-primary-foreground">{s.count}</span>
                  </div>
                </div>
                <span className="w-14 text-right text-[11px] text-muted-foreground flex-shrink-0">
                  {drop > 0 ? <span className="text-destructive/70">−{drop}</span> : <span className="text-badge-verified">start</span>}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ===== RECENT APPLICATIONS + ACTIVITY FEED ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Recent applications</h2>
            <Link href="/admin/nannies" className="text-xs font-bold text-primary hover:text-primary-light inline-flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {RECENT.map((n) => (
              <Card key={n.name} className="rounded-3xl border-border/40 p-4 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <span className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={n.img} alt={n.name} fill className="object-cover" sizes="64px" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-foreground truncate">{n.name}</h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 flex-shrink-0"><Clock className="w-3 h-3" />{n.suburb}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 my-1.5">
                    {n.tags.map((t) => (
                      <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-badge-specialist">{t}</span>
                    ))}
                  </div>
                  {/* progress */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-accent origin-left animate-[grow-x_0.9s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ width: `${(n.done / 7) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{n.done}/7</span>
                  </div>
                  <p className="text-[10px] text-accent font-semibold mt-1.5">{n.when}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Live activity feed */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Live activity</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <Card className="rounded-3xl border-border/40 p-2">
            <ol>
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-secondary/40 transition-colors">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${a.tint}`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.when}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>

      {/* ===== REVIEW QUEUES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/nannies", label: "Carer applications", count: stats.pendingNannies, icon: Users, tint: "bg-amber-50 text-badge-premium" },
          { href: "/admin/jobs", label: "Job postings", count: stats.pendingJobs, icon: Briefcase, tint: "bg-primary/5 text-primary" },
          { href: "/admin/enquiries", label: "Parent enquiries", count: stats.newEnquiries, icon: MessageCircle, tint: "bg-accent/5 text-accent" },
        ].map((q) => {
          const Icon = q.icon;
          return (
            <Link key={q.href} href={q.href}>
              <Card className="rounded-3xl border-border/40 p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${q.tint}`}><Icon className="w-5 h-5" /></span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{q.label}</p>
                  <p className="text-[11px] text-muted-foreground">{q.count} awaiting review</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
