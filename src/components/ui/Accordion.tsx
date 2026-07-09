"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm"
        >
          <button
            className="w-full flex items-center justify-between px-6 py-4.5 text-left cursor-pointer hover:bg-secondary/40 transition-colors duration-300 min-h-[52px]"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
            aria-controls={`accordion-panel-${index}`}
          >
            <span className="font-semibold text-foreground pr-4">{item.question}</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                openIndex === index && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          <div
            id={`accordion-panel-${index}`}
            role="region"
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                {item.answer}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
