"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CalendarCheck, Lock, Minus, Plus, CreditCard } from "lucide-react";
import { UpgradeModal } from "@/components/membership/UpgradeGate";
import { createBooking } from "@/server/actions/booking";
import {
  quoteBooking,
  centsToNzd,
  MIN_BOOKING_HOURS,
  MAX_BOOKING_HOURS,
  SERVICE_FEE_PCT,
} from "@/lib/booking";
import type { ProviderId } from "@/lib/payments/types";

const PROVIDER_LABEL: Record<ProviderId, string> = { STRIPE: "Pay by card", PAYPAL: "PayPal" };

export function BookingWidget({
  nannyId,
  firstName,
  hourlyRate,
  canBook,
  bookable,
  providers,
}: {
  nannyId: string;
  firstName: string;
  hourlyRate: number;
  /** Effective member access (member, or soft-launch). */
  canBook: boolean;
  /** Nanny is available (not placed) — only then can she be booked. */
  bookable: boolean;
  providers: ProviderId[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState("");
  const [hours, setHours] = useState(3);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const quote = useMemo(() => quoteBooking(hourlyRate, hours), [hourlyRate, hours]);

  const setHrs = (n: number) => setHours(Math.min(MAX_BOOKING_HOURS, Math.max(MIN_BOOKING_HOURS, n)));

  async function pay(provider: ProviderId) {
    setError("");
    if (!date) {
      setError("Please choose a date.");
      return;
    }
    setBusy(provider);
    const res = await createBooking({ nannyId, date, hours, provider });
    if (res.success && (res.data as any)?.url) {
      window.location.href = (res.data as any).url;
      return;
    }
    if (res.upgradeRequired) setUpgradeOpen(true);
    else setError(res.error || "Could not start your booking.");
    setBusy(null);
  }

  if (!bookable) return null; // placed nannies can't be booked (message form still shows)

  // Non-members: a single locked CTA into the upgrade modal.
  if (!canBook) {
    return (
      <Card className="border-l-4 border-l-primary">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          Book {firstName}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Secure bookings with a held payment until the session is complete — a member benefit.
        </p>
        <Button
          variant="primary"
          fullWidth
          onClick={() => setUpgradeOpen(true)}
          className="rounded-full shadow-lg shadow-primary/10"
        >
          <Lock className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
          Become a Member to Book
        </Button>
        <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} feature={`book ${firstName}`} />
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 text-primary" aria-hidden="true" />
        Book {firstName}
      </h3>

      <div className="space-y-4">
        <Input
          type="date"
          name="date"
          label="Date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Hours</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHrs(hours - 1)}
              aria-label="Fewer hours"
              className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary/60 transition-colors cursor-pointer disabled:opacity-40"
              disabled={hours <= MIN_BOOKING_HOURS}
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="font-heading text-xl text-foreground w-10 text-center tabular-nums">{hours}</span>
            <button
              type="button"
              onClick={() => setHrs(hours + 1)}
              aria-label="More hours"
              className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary/60 transition-colors cursor-pointer disabled:opacity-40"
              disabled={hours >= MAX_BOOKING_HOURS}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Transparent summary — fee shown before payment */}
        <div className="rounded-2xl bg-secondary/30 border border-border/30 p-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Hourly rate</span>
            <span>{centsToNzd(hourlyRate * 100)}/hr</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Hours</span>
            <span>{hours}</span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Subtotal</span>
            <span>{centsToNzd(quote.subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Platform service fee ({Math.round(SERVICE_FEE_PCT * 100)}%)</span>
            <span>{centsToNzd(quote.feeCents)}</span>
          </div>
          <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border/40">
            <span>Total</span>
            <span>{centsToNzd(quote.totalCents)}</span>
          </div>
        </div>

        {error && <p className="text-xs text-destructive" role="alert">{error}</p>}

        <div className="space-y-2">
          {providers.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Payments are being set up.</p>
          )}
          {providers.map((provider, i) => (
            <Button
              key={provider}
              variant={i === 0 ? "primary" : "outline"}
              fullWidth
              isLoading={busy === provider}
              disabled={Boolean(busy)}
              onClick={() => pay(provider)}
              className="rounded-full"
            >
              {i === 0 && <CreditCard className="w-4 h-4 mr-2" aria-hidden="true" />}
              {PROVIDER_LABEL[provider]} · {centsToNzd(quote.totalCents)}
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          Your payment is held securely until the booking is complete.
        </p>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} feature={`book ${firstName}`} />
    </Card>
  );
}
