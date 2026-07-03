"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export function TagInput({
  label,
  placeholder = "Type and press Enter...",
  value,
  onChange,
  required,
  disabled,
  helperText,
  className,
}: TagInputProps) {
  const [text, setText] = useState("");

  const addTag = () => {
    const trimmed = text.trim();
    if (!trimmed || value.includes(trimmed)) {
      setText("");
      return;
    }
    onChange([...value, trimmed]);
    setText("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !text && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex flex-wrap gap-1.5 rounded-2xl border border-border/70 bg-card px-3 py-2.5 min-h-[46px]",
          "transition-all duration-300 hover:border-primary/40",
          "focus-within:ring-4 focus-within:ring-ring/8 focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/5 border border-primary text-xs font-semibold text-primary"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive transition-colors cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border-none p-0"
        />
      </div>
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
