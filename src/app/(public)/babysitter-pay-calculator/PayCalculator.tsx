"use client";

import { useMemo, useState } from "react";

// Figures are taken only from NannyOra's own live pages:
// - Adult minimum wage from 1 April 2026: NZ$23.95/hr (nanny-cost page, Employment NZ).
// - Auckland listing snapshot: roughly NZ$28-$35+ per hour (nanny-cost page).
// Nothing else is assumed. The calculator is an estimate, not a rate card.
const MIN_WAGE = 23.95;
const SNAPSHOT_LOW = 28;
const SNAPSHOT_HIGH = 35;

const nzd = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" });

type Mode = "regular" | "occasional";

export default function PayCalculator() {
  const [mode, setMode] = useState<Mode>("regular");
  const [rate, setRate] = useState(30);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [hoursPerBooking, setHoursPerBooking] = useState(4);
  const [bookingsPerMonth, setBookingsPerMonth] = useState(4);

  const result = useMemo(() => {
    const weeklyHours = mode === "regular" ? hoursPerWeek : (hoursPerBooking * bookingsPerMonth * 12) / 52;
    const weekly = rate * weeklyHours;
    const monthly = (weekly * 52) / 12;
    const annual = weekly * 52;
    const perBooking = mode === "occasional" ? rate * hoursPerBooking : null;
    const monthlyOccasional = mode === "occasional" ? rate * hoursPerBooking * bookingsPerMonth : null;
    const snapshotLowWeekly = SNAPSHOT_LOW * weeklyHours;
    const snapshotHighWeekly = SNAPSHOT_HIGH * weeklyHours;
    return { weekly, monthly, annual, perBooking, monthlyOccasional, snapshotLowWeekly, snapshotHighWeekly };
  }, [mode, rate, hoursPerWeek, hoursPerBooking, bookingsPerMonth]);

  const belowMinWage = rate < MIN_WAGE;

  return (
    <div className="rounded-3xl border border-border/35 bg-card p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Calculator mode">
        <button
          type="button"
          onClick={() => setMode("regular")}
          aria-pressed={mode === "regular"}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${mode === "regular" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border/50"}`}
        >
          Regular weekly care
        </button>
        <button
          type="button"
          onClick={() => setMode("occasional")}
          aria-pressed={mode === "occasional"}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${mode === "occasional" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border/50"}`}
        >
          Occasional babysitting
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="pay-rate" className="block text-sm font-bold text-foreground mb-2">
            Hourly rate: {nzd.format(rate)} per hour
          </label>
          <input
            id="pay-rate"
            type="range"
            min={20}
            max={50}
            step={0.5}
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{nzd.format(20)}</span>
            <span>{nzd.format(50)}</span>
          </div>
          {belowMinWage ? (
            <p className="mt-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 px-4 py-3 text-sm text-amber-900 leading-relaxed">
              This rate is below the adult minimum wage of {nzd.format(MIN_WAGE)} per hour (from 1 April 2026). For eligible employees that is a legal floor, not a negotiating starting point — check Employment New Zealand’s current minimum-wage guidance before agreeing pay.
            </p>
          ) : null}
        </div>

        {mode === "regular" ? (
          <div>
            <label htmlFor="hours-week" className="block text-sm font-bold text-foreground mb-2">
              Hours per week
            </label>
            <input
              id="hours-week"
              type="number"
              min={1}
              max={60}
              value={hoursPerWeek}
              onChange={(event) => setHoursPerWeek(Math.max(1, Math.min(60, Number(event.target.value) || 1)))}
              className="w-32 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-base font-semibold text-foreground"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="hours-booking" className="block text-sm font-bold text-foreground mb-2">
                Hours per booking
              </label>
              <input
                id="hours-booking"
                type="number"
                min={1}
                max={16}
                value={hoursPerBooking}
                onChange={(event) => setHoursPerBooking(Math.max(1, Math.min(16, Number(event.target.value) || 1)))}
                className="w-32 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-base font-semibold text-foreground"
              />
            </div>
            <div>
              <label htmlFor="bookings-month" className="block text-sm font-bold text-foreground mb-2">
                Bookings per month
              </label>
              <input
                id="bookings-month"
                type="number"
                min={1}
                max={31}
                value={bookingsPerMonth}
                onChange={(event) => setBookingsPerMonth(Math.max(1, Math.min(31, Number(event.target.value) || 1)))}
                className="w-32 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-base font-semibold text-foreground"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {mode === "occasional" && result.perBooking !== null ? (
          <div className="rounded-2xl bg-secondary/45 border border-border/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per booking</p>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{nzd.format(result.perBooking)}</p>
            <p className="text-xs text-muted-foreground mt-1">Gross, before tax</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-secondary/45 border border-border/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per week</p>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{nzd.format(result.weekly)}</p>
            <p className="text-xs text-muted-foreground mt-1">Gross, before tax</p>
          </div>
        )}
        <div className="rounded-2xl bg-secondary/45 border border-border/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per month</p>
          <p className="font-heading text-2xl font-bold text-foreground mt-1">
            {nzd.format(mode === "occasional" && result.monthlyOccasional !== null ? result.monthlyOccasional : result.monthly)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Gross, before tax</p>
        </div>
        <div className="rounded-2xl bg-secondary/45 border border-border/30 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Per year</p>
          <p className="font-heading text-2xl font-bold text-foreground mt-1">{nzd.format(result.annual)}</p>
          <p className="text-xs text-muted-foreground mt-1">Gross, before tax</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border/35 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          At the Auckland listing snapshot of {nzd.format(SNAPSHOT_LOW)}–{nzd.format(SNAPSHOT_HIGH)}+ per hour, the same hours would be{" "}
          <strong className="text-foreground">{nzd.format(result.snapshotLowWeekly)}–{nzd.format(result.snapshotHighWeekly)} per week</strong> (gross).
          That snapshot comes from recent Auckland job advertisements — it is a starting point for comparing similar work, not a national average or a rate NannyOra endorses.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          This calculator shows gross pay only. It does not include tax, KiwiSaver, ACC, leave, public holidays or expenses, and it is not a quote or a rate card. Agree the rate and the full arrangement with the other party before the care starts.
        </p>
      </div>
    </div>
  );
}
