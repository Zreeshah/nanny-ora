"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import { MessageCircle, User, ArrowRight } from "lucide-react";

const sampleEnquiries = [
  { id: "enq-001", parentName: "Sarah K.", nannyName: "Emma Thompson", message: "Hi Emma, we're looking for a sensory-aware nanny for our 4-year-old. Would love to chat!", status: "NEW", createdAt: new Date("2025-01-12") },
  { id: "enq-002", parentName: "James W.", nannyName: "Sarah Mitchell", message: "Hi Sarah, would you be available for after-school care in Remuera 3 days a week?", status: "CONTACTED", createdAt: new Date("2025-01-10") },
  { id: "enq-003", parentName: "Lisa M.", nannyName: "Aroha Williams", message: "We need a nanny with early intervention experience for our son. Are you available?", status: "NEW", createdAt: new Date("2025-01-11") },
  { id: "enq-004", parentName: "Kate R.", nannyName: "Mia Johnson", message: "Hi Mia, looking for a weekend babysitter in Devonport. Interested?", status: "MATCHED", createdAt: new Date("2025-01-08") },
  { id: "enq-005", parentName: "Tom S.", nannyName: "Grace Taylor", message: "We need a specialist nanny for our daughter with ASD. Your profile looks perfect.", status: "NEW", createdAt: new Date("2025-01-13") },
];

const statusColors: Record<string, string> = {
  NEW: "bg-accent/10 text-accent border-accent/20",
  CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
  MATCHED: "bg-emerald-50 text-badge-verified border-emerald-200",
  CLOSED: "bg-slate-50 text-badge-listed border-slate-200",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState(sampleEnquiries);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter ? enquiries.filter((e) => e.status === statusFilter) : enquiries;

  const updateStatus = (id: string, status: string) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Enquiry Management</h1>
          <p className="text-muted-foreground mt-1">{enquiries.length} total enquiries</p>
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
          <Card key={enquiry.id}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-semibold text-foreground text-sm">{enquiry.parentName}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                  <span className="font-semibold text-foreground text-sm">{enquiry.nannyName}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{enquiry.message}</p>
                <span className="text-xs text-muted-foreground">{formatDate(enquiry.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={statusColors[enquiry.status] || ""} size="sm">
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
