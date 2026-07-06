"use client";
import Link from "next/link";

import { useState, useEffect, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatDate, getInitials } from "@/lib/utils";
import { MessageCircle, ArrowRight } from "lucide-react";
import { getEnquiries, updateEnquiryStatus } from "@/server/actions/enquiry";

type EnquiryRow = { id: string; parentName: string; nannyName: string; message: string; status: string; createdAt: Date; flaggedCount: number; contactEmail: string | null; contactPhone: string | null };

const sampleDefaults = { flaggedCount: 0, contactEmail: null, contactPhone: null };
const sampleEnquiries: EnquiryRow[] = [
  { id: "enq-001", ...sampleDefaults, parentName: "Sarah K.", nannyName: "Emma Thompson", message: "Hi Emma, we're looking for a sensory-aware nanny for our 4-year-old. Would love to chat!", status: "NEW", createdAt: new Date("2025-01-12") },
  { id: "enq-002", ...sampleDefaults, parentName: "James W.", nannyName: "Sarah Mitchell", message: "Hi Sarah, would you be available for after-school care in Remuera 3 days a week?", status: "CONTACTED", createdAt: new Date("2025-01-10") },
  { id: "enq-003", ...sampleDefaults, parentName: "Lisa M.", nannyName: "Aroha Williams", message: "We need a nanny with early intervention experience for our son. Are you available?", status: "NEW", createdAt: new Date("2025-01-11") },
  { id: "enq-004", ...sampleDefaults, parentName: "Kate R.", nannyName: "Mia Johnson", message: "Hi Mia, looking for a weekend babysitter in Devonport. Interested?", status: "MATCHED", createdAt: new Date("2025-01-08") },
  { id: "enq-005", ...sampleDefaults, parentName: "Tom S.", nannyName: "Grace Taylor", message: "We need a specialist nanny for our daughter with ASD. Your profile looks perfect.", status: "NEW", createdAt: new Date("2025-01-13") },
];

const statusColors: Record<string, string> = {
  NEW: "bg-accent/10 text-accent border-accent/20",
  CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
  MATCHED: "bg-emerald-50 text-badge-verified border-emerald-200",
  CLOSED: "bg-slate-50 text-badge-listed border-slate-200",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>(sampleEnquiries);
  const [statusFilter, setStatusFilter] = useState("");
  const [, startTransition] = useTransition();

  // Load real enquiries; keep sample data as fallback for demo mode.
  useEffect(() => {
    getEnquiries()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setEnquiries(
            res.data.map((e: any) => ({
              id: e.id,
              parentName: e.parent?.name ?? "Unknown",
              nannyName: e.nanny?.user?.name ?? "Unknown",
              message: e.message,
              status: e.status,
              createdAt: new Date(e.createdAt),
              flaggedCount: (e._count?.messages ?? 0) + (e.flagged ? 1 : 0),
              contactEmail: e.contactEmail ?? null,
              contactPhone: e.contactPhone ?? null,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = statusFilter ? enquiries.filter((e) => e.status === statusFilter) : enquiries;

  const updateStatus = (id: string, status: "CONTACTED" | "MATCHED" | "CLOSED") => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e))); // optimistic
    startTransition(() => {
      updateEnquiryStatus(id, status);
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5" /></span>
          <div>
            <h1 className="font-heading text-3xl text-foreground">Parent enquiries</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{enquiries.length} total · {enquiries.filter((e) => e.status === "NEW").length} new</p>
          </div>
        </div>
        <div className="w-48">
          <Select
            options={[
              { value: "", label: "All Statuses" },
              { value: "NEW", label: "New" },
              { value: "CONTACTED", label: "Contacted" },
              { value: "MATCHED", label: "Matched" },
              { value: "CLOSED", label: "Closed" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((enquiry) => (
          <Card key={enquiry.id} className="rounded-3xl border-border/40 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0">
                {/* Parent -> nanny match flow */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center">{getInitials(enquiry.parentName)}</span>
                    <span className="font-semibold text-foreground text-sm">{enquiry.parentName}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                  <span className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{getInitials(enquiry.nannyName)}</span>
                    <span className="font-semibold text-foreground text-sm truncate">{enquiry.nannyName}</span>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2 bg-secondary/25 rounded-2xl px-3.5 py-2.5">{enquiry.message}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{formatDate(enquiry.createdAt)}</span>
                  <Link href={`/admin/enquiries/${enquiry.id}`} className="text-xs font-bold text-primary hover:text-primary-light transition-colors">
                    View conversation →
                  </Link>
                </div>
                {(enquiry.contactEmail || enquiry.contactPhone) && (
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Contact (agency only): {[enquiry.contactEmail, enquiry.contactPhone].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {enquiry.flaggedCount > 0 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5" title="Messages containing contact details">
                    ⚠ {enquiry.flaggedCount} flagged
                  </span>
                )}
                <Badge className={`${statusColors[enquiry.status] || ""} rounded-full`} size="sm">
                  {enquiry.status}
                </Badge>

                {enquiry.status === "NEW" && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(enquiry.id, "CONTACTED")}>
                    Mark Contacted
                  </Button>
                )}
                {enquiry.status === "CONTACTED" && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(enquiry.id, "MATCHED")}>
                    Mark Matched
                  </Button>
                )}
                {enquiry.status !== "CLOSED" && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(enquiry.id, "CLOSED")}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
