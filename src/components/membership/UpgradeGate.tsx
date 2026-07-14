"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { Lock, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ============================================================
// One place that knows "is this user a member?" — server pages pass it down, so it
// is always fresh (no stale JWT after checkout).
// ============================================================

const MemberContext = createContext(false);

export function MemberProvider({ isMember, children }: { isMember: boolean; children: ReactNode }) {
  return <MemberContext.Provider value={isMember}>{children}</MemberContext.Provider>;
}

export const useIsMember = () => useContext(MemberContext);

// ============================================================
// The upgrade modal — opened by any locked feature. Value-led, not aggressive:
// no auto-open, no countdowns; it only appears when the user asks for the feature.
// ============================================================

const BENEFITS = [
  "Access verified, professionally reviewed nannies",
  "Unlimited messaging",
  "Secure bookings",
  "Meet-and-greet requests",
  "Priority matching",
];

export function UpgradeModal({
  open,
  onClose,
  feature,
}: {
  open: boolean;
  onClose: () => void;
  feature?: string;
}) {
  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-title"
    >
      <button
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />

      <div className="relative w-full sm:max-w-md bg-card border border-border/60 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center justify-center mb-5">
          <Sparkles className="w-5.5 h-5.5 stroke-[1.8]" aria-hidden="true" />
        </div>

        <h2 id="upgrade-title" className="font-heading text-2xl text-foreground mb-2 leading-snug">
          {feature ? `Become a member to ${feature}` : "Become a member"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Every NannyOra nanny completes our full compliance process before they appear here.
          Membership unlocks direct access to them.
        </p>

        <ul className="space-y-2.5 mb-7">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link href="/membership" onClick={onClose}>
          <Button variant="primary" size="lg" fullWidth className="rounded-full shadow-lg shadow-primary/10">
            View membership plans
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center mt-3">
          From NZ$39/month · Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Locked CTA — drop-in replacement for a member-only button.
// Members get the real control; everyone else gets the lock + modal.
// ============================================================

export function LockedButton({
  label,
  feature,
  children,
  variant = "accent",
  size = "md",
  fullWidth,
  className,
}: {
  /** Text shown to non-members, e.g. "Become a Member to Contact This Nanny". */
  label: string;
  /** Verb used in the modal headline, e.g. "message this nanny". */
  feature?: string;
  /** The real control, rendered only for members. */
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}) {
  const isMember = useIsMember();
  const [open, setOpen] = useState(false);

  if (isMember) return <>{children}</>;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={() => setOpen(true)}
        className={className ?? "rounded-full shadow-lg"}
      >
        <Lock className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
        {label}
      </Button>
      <UpgradeModal open={open} onClose={() => setOpen(false)} feature={feature} />
    </>
  );
}

/** A small inline lock (icon + hint) for hidden fields like phone/email. */
export function LockedValue({ hint = "Members only" }: { hint?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="blur-[3px] select-none" aria-hidden="true">
          ••• ••• •••
        </span>
        <span className="underline underline-offset-2 decoration-dotted">{hint}</span>
      </button>
      <UpgradeModal open={open} onClose={() => setOpen(false)} feature="see contact details" />
    </>
  );
}
