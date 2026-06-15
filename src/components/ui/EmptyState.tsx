import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Search, FileText, Users, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: "search" | "file" | "users" | "inbox";
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const iconMap = {
  search: Search,
  file: FileText,
  users: Users,
  inbox: Inbox,
};

export function EmptyState({
  icon = "inbox",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="sm">{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
