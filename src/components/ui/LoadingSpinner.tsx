import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "w-4 h-4 border-[2px]",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "rounded-full border-primary border-t-transparent animate-spin",
          sizes[size]
        )}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}

export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
