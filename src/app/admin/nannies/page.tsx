"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { sampleNannies } from "@/lib/data/sample-nannies";
import { NANNY_STATUS_LABELS, VERIFICATION_LEVEL_LABELS, VERIFICATION_LEVEL_ORDER } from "@/lib/constants";
import { getInitials, formatRate } from "@/lib/utils";
import { MapPin, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const statusOptions = Object.entries(NANNY_STATUS_LABELS).map(([value, label]) => ({ value, label }));
const verificationOptions = VERIFICATION_LEVEL_ORDER.map((v) => ({ value: v, label: VERIFICATION_LEVEL_LABELS[v] }));

export default function AdminNanniesPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [nannies, setNannies] = useState(
    sampleNannies.map((n) => ({
      ...n,
      adminStatus: ["APPROVED", "VERIFIED", "SPECIALIST"][Math.floor(Math.random() * 3)] || "APPROVED",
    }))
  );

  const filtered = statusFilter
    ? nannies.filter((n) => n.adminStatus === statusFilter)
    : nannies;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Nanny Management</h1>
          <p className="text-muted-foreground mt-1">{nannies.length} total nannies</p>
        </div>
        <div className="w-48">
          <Select
            options={[{ value: "", label: "All Statuses" }, ...statusOptions]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((nanny) => (
          <Card key={nanny.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">{getInitials(nanny.name)}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{nanny.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{nanny.suburb}</span>
                  <span>·</span>
                  <span>{formatRate(nanny.hourlyRate)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              <VerificationBadge level={nanny.verificationLevel as any} />
              <Badge variant="outline" size="sm">{NANNY_STATUS_LABELS[nanny.adminStatus as keyof typeof NANNY_STATUS_LABELS] || nanny.adminStatus}</Badge>
            </div>

            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <Link href={`/nannies/${nanny.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-badge-verified hover:text-badge-verified"
                onClick={() => {
                  setNannies((prev) =>
                    prev.map((n) =>
                      n.id === nanny.id ? { ...n, adminStatus: "APPROVED" } : n
                    )
                  );
                }}
              >
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setNannies((prev) =>
                    prev.map((n) =>
                      n.id === nanny.id ? { ...n, adminStatus: "SUSPENDED" } : n
                    )
                  );
                }}
              >
                <XCircle className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
