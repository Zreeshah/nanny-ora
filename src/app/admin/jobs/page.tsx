"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { MapPin, Calendar, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";

const sampleJobs = [
  { id: "job-001", title: "After-school nanny for two children", suburb: "Remuera", careType: "After-School Care", status: "PENDING", createdAt: new Date("2025-01-10"), parentName: "James W." },
  { id: "job-002", title: "Weekend babysitter needed", suburb: "Ponsonby", careType: "Weekend Care", status: "APPROVED", createdAt: new Date("2025-01-08"), parentName: "Lisa M." },
  { id: "job-003", title: "Full-time nanny for infant", suburb: "Epsom", careType: "Recurring Nanny Care", status: "PENDING", createdAt: new Date("2025-01-12"), parentName: "Tom S." },
  { id: "job-004", title: "Sensory-aware carer needed", suburb: "Grey Lynn", careType: "Specialist Sensory-Aware Care", status: "APPROVED", createdAt: new Date("2025-01-05"), parentName: "Kate R." },
  { id: "job-005", title: "Emergency backup nanny", suburb: "Takapuna", careType: "Emergency Backup Care", status: "CLOSED", createdAt: new Date("2024-12-20"), parentName: "David H." },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-badge-premium border-amber-200",
  APPROVED: "bg-emerald-50 text-badge-verified border-emerald-200",
  CLOSED: "bg-slate-50 text-badge-listed border-slate-200",
  REJECTED: "bg-red-50 text-destructive border-red-200",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter ? jobs.filter((j) => j.status === statusFilter) : jobs;

  const updateStatus = (id: string, status: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><Briefcase className="w-5 h-5" /></span>
          <div>
            <h1 className="font-heading text-3xl text-foreground">Job postings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{jobs.length} total · {jobs.filter((j) => j.status === "PENDING").length} awaiting review</p>
          </div>
        </div>
        <div className="w-48">
          <Select
            options={[
              { value: "", label: "All Statuses" },
              { value: "PENDING", label: "Pending" },
              { value: "APPROVED", label: "Approved" },
              { value: "CLOSED", label: "Closed" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((job) => (
          <Card key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border-border/40 hover:shadow-md transition-all">
            <span className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-foreground">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" />{job.suburb}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-badge-specialist text-[10px] font-bold">{job.careType}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(job.createdAt)}</span>
                <span>by {job.parentName}</span>
              </div>
            </div>

            <Badge className={`${statusColors[job.status] || ""} rounded-full`} size="sm">
              {job.status}
            </Badge>

            <div className="flex items-center gap-2 flex-shrink-0">
              {job.status === "PENDING" && (
                <>
                  <Button variant="ghost" size="sm" className="text-badge-verified" onClick={() => updateStatus(job.id, "APPROVED")}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateStatus(job.id, "REJECTED")}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              )}
              {job.status === "APPROVED" && (
                <Button variant="ghost" size="sm" onClick={() => updateStatus(job.id, "CLOSED")}>
                  Close
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
