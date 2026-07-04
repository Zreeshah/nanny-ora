import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const reactId = useId();
    const textareaId = id || reactId;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-base text-foreground",
            "placeholder:text-muted-foreground resize-y min-h-[100px]",
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "hover:border-primary/40",
            "focus:outline-none focus:ring-4 focus:ring-ring/8 focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:ring-destructive/10",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };
