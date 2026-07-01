import { cn } from "@/lib/utils";

/**
 * Traveling light beam around a card border. Adapted from the 21st.dev /
 * magic-ui "Border Beam" component — already pure CSS (offset-path), so no
 * framer-motion needed. Themed to NannyOra gold -> navy by default.
 *
 * Usage: place inside a `relative` + `rounded-*` + `overflow-hidden` container.
 */
export function BorderBeam({
  className,
  size = 220,
  duration = 12,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "var(--accent)",
  colorTo = "var(--primary)",
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // mask so the beam only shows on the border ring
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        // the moving beam itself
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation:border-beam_calc(var(--duration)*1s)_infinite_linear] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
}
