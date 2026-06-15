import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Users, Briefcase, MessageCircle, UserCheck, Clock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

// Sample admin statistics values
const stats = {
  pendingNannies: 3,
  approvedNannies: 7,
  totalNannies: 10,
  pendingJobs: 2,
  approvedJobs: 5,
  newEnquiries: 4,
  totalParents: 15,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-foreground to-primary-dark rounded-3xl text-white shadow-md relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full filter blur-xl -translate-y-8 translate-x-8 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full filter blur-lg translate-y-8 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-light" />
            <span>Administrative Console</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl mb-1">
            Site Overview
          </h1>
          <p className="text-white/70 text-sm">
            Auditing vetting statuses, job posts, and matches on NannyOra.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Nannies", value: stats.totalNannies, icon: Users, color: "text-primary", bg: "bg-primary/5" },
          { label: "Pending Review", value: stats.pendingNannies, icon: Clock, color: "text-badge-premium", bg: "bg-amber-50" },
          { label: "Active Jobs", value: stats.approvedJobs, icon: Briefcase, color: "text-badge-verified", bg: "bg-emerald-50" },
          { label: "New Enquiries", value: stats.newEnquiries, icon: MessageCircle, color: "text-accent", bg: "bg-accent/5" },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border/40 p-5 bg-card">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1.5">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Review actions panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending nannies review card */}
        <Card className="rounded-3xl border-border/40 p-6 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-badge-premium flex items-center justify-center">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg font-bold text-foreground">Pending nannies</h2>
            <Badge variant="premium" className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold">
              {stats.pendingNannies}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            New registration applications from Auckland carers waiting for document verification, reference checks, and approval.
          </p>
          <Link
            href="/admin/nannies"
            className="text-xs font-bold text-primary hover:text-primary-light transition-colors mt-auto inline-flex items-center gap-1 hover:gap-1.5"
          >
            Review Carer Applications
            <ArrowRight className="w-3.5 h-3.5 transition-all" />
          </Link>
        </Card>

        {/* Pending jobs review card */}
        <Card className="rounded-3xl border-border/40 p-6 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg font-bold text-foreground">Pending jobs</h2>
            <Badge variant="verified" className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold">
              {stats.pendingJobs}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Parent childcare job posts awaiting moderator validation before going live to our nanny list directory.
          </p>
          <Link
            href="/admin/jobs"
            className="text-xs font-bold text-primary hover:text-primary-light transition-colors mt-auto inline-flex items-center gap-1 hover:gap-1.5"
          >
            Review Job Postings
            <ArrowRight className="w-3.5 h-3.5 transition-all" />
          </Link>
        </Card>

        {/* Enquiries audit card */}
        <Card className="rounded-3xl border-border/40 p-6 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-accent/5 text-accent flex items-center justify-center">
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-lg font-bold text-foreground">Parent enquiries</h2>
            <Badge variant="outline" className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 border-accent/20 text-accent">
              {stats.newEnquiries}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Recent matching messages between parents and nannies that may require follow-up support or onboarding help.
          </p>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-primary hover:text-primary-light transition-colors mt-auto inline-flex items-center gap-1 hover:gap-1.5"
          >
            Audit Messages Logs
            <ArrowRight className="w-3.5 h-3.5 transition-all" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
