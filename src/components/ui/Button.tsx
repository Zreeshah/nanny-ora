import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] hover:-translate-y-0.5 active:translate-y-0";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-light shadow-sm hover:shadow-md hover:shadow-primary/10",
      secondary: "bg-secondary text-secondary-foreground hover:bg-muted border border-border/50",
      accent: "bg-accent text-accent-foreground hover:bg-accent-light shadow-sm hover:shadow-md hover:shadow-accent/15",
      ghost: "text-foreground hover:bg-secondary/60",
      destructive: "bg-destructive text-destructive-foreground hover:bg-red-600 shadow-sm",
      outline: "border border-border text-foreground hover:bg-secondary/60",
    };

    const sizes = {
      sm: "text-sm px-5 py-2 min-h-[38px]",
      md: "text-base px-7 py-3 min-h-[46px]",
      lg: "text-lg px-9 py-4 min-h-[54px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
