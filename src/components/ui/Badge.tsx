import { cn } from "@/lib/utils";
import type { VerificationLevel, SpecialistTagValue } from "@/lib/constants";
import {
  VERIFICATION_LEVEL_LABELS,
  SPECIALIST_TAGS,
} from "@/lib/constants";
import { ShieldCheck, Star, Sparkles, Clock, Check } from "lucide-react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "verified" | "specialist" | "premium" | "listed" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    verified: "bg-emerald-50/70 text-badge-verified border border-emerald-200/50",
    specialist: "bg-blue-50/70 text-badge-specialist border border-blue-200/50",
    premium: "bg-amber-50/70 text-badge-premium border border-amber-200/50",
    listed: "bg-slate-50/70 text-badge-listed border border-slate-200/50",
    outline: "border border-border/70 text-foreground",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function VerificationBadge({ level }: { level: VerificationLevel }) {
  const iconConfig = {
    LISTED: <Clock className="w-3 h-3 text-badge-listed" aria-hidden="true" />,
    VERIFIED: <Check className="w-3 h-3 text-badge-verified stroke-[3]" aria-hidden="true" />,
    PREMIUM_VETTED: <Star className="w-3 h-3 text-badge-premium fill-badge-premium" aria-hidden="true" />,
    SPECIALIST: <Sparkles className="w-3 h-3 text-badge-specialist fill-blue-100" aria-hidden="true" />,
  };

  const config: Record<VerificationLevel, { variant: BadgeProps["variant"] }> = {
    LISTED: { variant: "listed" },
    VERIFIED: { variant: "verified" },
    PREMIUM_VETTED: { variant: "premium" },
    SPECIALIST: { variant: "specialist" },
  };

  const { variant } = config[level];
  const icon = iconConfig[level];

  return (
    <Badge variant={variant} size="sm">
      {icon}
      <span>{VERIFICATION_LEVEL_LABELS[level]}</span>
    </Badge>
  );
}

export function SpecialistTag({ tag }: { tag: SpecialistTagValue }) {
  const label = SPECIALIST_TAGS.find((t) => t.value === tag)?.label ?? tag;
  return (
    <Badge variant="specialist" size="sm">
      <Sparkles className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
      {label}
    </Badge>
  );
}
