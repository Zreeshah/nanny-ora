"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getInitials } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { getMyConversations } from "@/server/actions/messages";

type Row = { enquiryId: string; otherPartyName: string; lastMessage: string; lastAt: string | Date; status: string; flaggedCount: number };

const statusColors: Record<string, string> = {
  NEW: "bg-accent/10 text-accent border-accent/20",
  CONTACTED: "bg-blue-50 text-blue-600 border-blue-200",
  MATCHED: "bg-emerald-50 text-badge-verified border-emerald-200",
  CLOSED: "bg-slate-50 text-badge-listed border-slate-200",
};

/** Inbox list. `basePath` = where a row links (e.g. /dashboard/nanny/enquiries). */
export default function ConversationList({ basePath, title = "Messages" }: { basePath: string; title?: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyConversations()
      .then((r) => { if (r.success && Array.isArray(r.data)) setRows(r.data as Row[]); })
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
          <h1 className="font-heading text-3xl text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{rows.length} conversation{rows.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <Card className="rounded-3xl border-border/40 text-center py-12">
          <p className="text-sm text-muted-foreground">No conversations yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Link key={row.enquiryId} href={`${basePath}/${row.enquiryId}`}>
              <Card className="rounded-3xl border-border/40 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {getInitials(row.otherPartyName)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-sm truncate">{row.otherPartyName}</span>
                      {row.flaggedCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">⚠ {row.flaggedCount}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{row.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge className={`${statusColors[row.status] || ""} rounded-full`} size="sm">{row.status}</Badge>
                    <span className="text-[10px] text-muted-foreground">{formatDate(row.lastAt)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
