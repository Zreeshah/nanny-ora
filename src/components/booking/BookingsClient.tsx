"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CalendarCheck, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { updateBookingStatus } from "@/server/actions/booking";
import { BOOKING_STATUS_LABELS, centsToNzd, type BookingStatus } from "@/lib/booking";

type Booking = {
  id: string;
  date: string;
  hours: number;
  hourlyRate: number;
  subtotalCents: number;
  feeCents: number;
  totalCents: number;
  status: string;
  notes: string;
  nannyName?: string;
  parentName?: string;
};

const STATUS_VARIANT: Record<string, "verified" | "premium" | "listed" | "specialist"> = {
  REQUESTED: "premium",
  ACCEPTED: "verified",
  UPCOMING: "verified",
  IN_PROGRESS: "specialist",
  COMPLETED_BY_NANNY: "specialist",
  AWAITING_PARENT_APPROVAL: "premium",
  COMPLETED: "verified",
  DECLINED: "listed",
  CANCELLED: "listed",
};

function statusLabel(s: string) {
  return BOOKING_STATUS_LABELS[s as BookingStatus] ?? s;
}

export function BookingsClient({ bookings: initial, role }: { bookings: Booking[]; role: "parent" | "nanny" }) {
  const [bookings, setBookings] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function act(id: string, to: string) {
    setBusy(id + to);
    const res = await updateBookingStatus(id, to);
    if (res.success) {
      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: to } : b)));
    } else {
      alert(res.error || "Could not update the booking.");
    }
    setBusy(null);
  }

  if (bookings.length === 0) {
    return (
      <Card className="rounded-3xl border-border/40 p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <CalendarCheck className="w-5.5 h-5.5" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          {role === "parent"
            ? "No bookings yet. Find a nanny and book a session to get started."
            : "No bookings yet. Families can book you directly from your profile."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const other = role === "parent" ? b.nannyName : b.parentName;
        const amount = role === "nanny" ? b.subtotalCents : b.totalCents;
        const amountLabel = role === "nanny" ? "Your earnings" : "You paid";

        return (
          <Card key={b.id} className="rounded-3xl border-border/40 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-heading text-lg text-foreground">{other}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    {formatDate(b.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {b.hours} {b.hours === 1 ? "hour" : "hours"}
                  </span>
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[b.status] ?? "listed"}>{statusLabel(b.status)}</Badge>
            </div>

            {b.notes && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{b.notes}</p>}

            <div className="flex items-center justify-between text-sm border-t border-border/30 pt-3">
              <span className="text-muted-foreground">
                {amountLabel} · {b.hours} × {centsToNzd(b.hourlyRate * 100)}
              </span>
              <span className="font-bold text-foreground">{centsToNzd(amount)}</span>
            </div>
            {role === "nanny" && (
              <p className="text-[11px] text-muted-foreground mt-1 text-right">
                Family paid {centsToNzd(b.totalCents)} (incl. platform fee)
              </p>
            )}

            {/* Role-appropriate actions */}
            <div className="flex gap-2 mt-4">
              {role === "nanny" && b.status === "REQUESTED" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={busy === b.id + "ACCEPTED"}
                    disabled={Boolean(busy)}
                    onClick={() => act(b.id, "ACCEPTED")}
                    className="rounded-full"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Boolean(busy)}
                    onClick={() => act(b.id, "DECLINED")}
                    className="rounded-full"
                  >
                    Decline
                  </Button>
                </>
              )}
              {role === "nanny" && b.status === "ACCEPTED" && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={busy === b.id + "COMPLETED_BY_NANNY"}
                  disabled={Boolean(busy)}
                  onClick={() => act(b.id, "COMPLETED_BY_NANNY")}
                  className="rounded-full"
                >
                  Mark as completed
                </Button>
              )}
              {role === "parent" && ["REQUESTED", "ACCEPTED"].includes(b.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={Boolean(busy)}
                  onClick={() => act(b.id, "CANCELLED")}
                  className="rounded-full"
                >
                  Cancel booking
                </Button>
              )}
              {role === "parent" && b.status === "COMPLETED_BY_NANNY" && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={busy === b.id + "COMPLETED"}
                  disabled={Boolean(busy)}
                  onClick={() => act(b.id, "COMPLETED")}
                  className="rounded-full"
                >
                  Approve &amp; complete
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
