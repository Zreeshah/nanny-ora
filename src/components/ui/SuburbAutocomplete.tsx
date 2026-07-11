"use client";

import { useState, type KeyboardEvent } from "react";
import { X, MapPin } from "lucide-react";
import { normSuburb } from "@/lib/suburbs";

/**
 * Suburb picker with autocomplete. Suggestions come from `options` (the suburbs
 * where nannies actually exist). A suburb not in `options` can still be added
 * (free entry) — the filter will then show no results for it.
 */
export function SuburbAutocomplete({
  value,
  onChange,
  options,
  placeholder = "Type a suburb…",
  label,
  helperText,
  required,
  disabled,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const q = normSuburb(text);
  const chosen = new Set(value.map(normSuburb));
  const suggestions = q
    ? options.filter((o) => !chosen.has(normSuburb(o)) && normSuburb(o).includes(q)).slice(0, 8)
    : [];

  const add = (s: string) => {
    const t = s.trim();
    if (!t || chosen.has(normSuburb(t))) { setText(""); return; }
    onChange([...value, t]);
    setText("");
    setOpen(false);
  };
  const remove = (s: string) => onChange(value.filter((v) => v !== s));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(suggestions[0] ?? text); // pick top suggestion, else add what they typed
    } else if (e.key === "Backspace" && !text && value.length > 0) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="relative space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={`flex flex-wrap gap-1.5 rounded-2xl border border-border/70 bg-card px-3 py-2.5 min-h-[46px] transition-all focus-within:ring-4 focus-within:ring-ring/8 focus-within:border-primary ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/5 border border-primary text-xs font-semibold text-primary">
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`} className="hover:text-destructive transition-colors cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true); }}
          onKeyDown={onKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border-none p-0"
        />
      </div>
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-lg py-1">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // keep input focus so onBlur doesn't cancel the click
                onClick={() => add(s)}
                className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
