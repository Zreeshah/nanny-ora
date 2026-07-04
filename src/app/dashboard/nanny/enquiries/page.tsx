"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getInitials } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { getMyNannyEnquiries } from "@/server/actions/engagement";

const statusColors: Record<string, string> = {
  NEW: "bg-accent/10 text-accent border-accent/20",
  CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
  MATCHED: "bg-emerald-50 text-badge-verified border-emerald-200",
  CLOSED: "bg-slate-50 text-badge-listed border-slate-200",
};

type EnquiryRow = { id: string; name: string; email: string; message: string; status: string; createdAt: string | Date };

export default function NannyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyNannyEnquiries()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setEnquiries(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5" />
        </span>
        <div>
          <h1 className="font-heading text-3xl text-foreground">Your enquiries</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {enquiries.length} total · {enquiries.filter((e) => e.status === "NEW").length} new
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-10 text-center">Loading enquiries…</p>
      ) : enquiries.length === 0 ? (
        <Card className="rounded-3xl border-border/40 text-center py-12">
          <p className="text-sm text-muted-foreground">
            No enquiries yet — they&apos;ll appear here as families reach out to you.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id} className="rounded-3xl border-border/40">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-8 h-8 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center">
                      {getInitials(enquiry.name)}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground text-sm block leading-tight">{enquiry.name}</span>
                      <span className="text-[11px] text-muted-foreground">{enquiry.email}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 bg-secondary/25 rounded-2xl px-3.5 py-2.5">{enquiry.message}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(enquiry.createdAt)}</span>
                </div>
                <div className="flex-shrink-0">
                  <Badge className={`${statusColors[enquiry.status] || ""} rounded-full`} size="sm">
                    {enquiry.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
