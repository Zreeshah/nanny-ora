import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:border-primary/40",
            "focus:outline-none focus:ring-4 focus:ring-ring/8 focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[46px]", // Touch-friendly
            error && "border-destructive focus:ring-destructive/10 focus:border-destructive",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
