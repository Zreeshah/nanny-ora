"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right" | "none";

const HIDDEN: Record<Direction, string> = {
  up: "opacity-0 translate-y-7",
  left: "opacity-0 -translate-x-7",
  right: "opacity-0 translate-x-7",
  none: "opacity-0",
};

/**
 * Scroll-triggered reveal. Fades/slides children in once they enter the viewport,
 * reusing the site's existing motion language. Respects prefers-reduced-motion and
 * falls back to visible when IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Accessibility: no motion preference, or no IO support -> show immediately.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? "opacity-100 translate-x-0 translate-y-0" : HIDDEN[direction]
      } ${className}`}
    >
      {children}
    </div>
  );
}
