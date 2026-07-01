import { cn } from "@/lib/utils";

/**
 * Animated gradient-sheen text. Adapted from the 21st.dev "Animated Shiny Text"
 * component, ported to pure CSS (no framer-motion) to match the site's motion
 * language. A gold/navy sheen sweeps across the text. The global
 * prefers-reduced-motion rule freezes the animation automatically.
 *
 * Drop-in wrapper around heading words: <ShinyText>trusted care</ShinyText>
 */
export function ShinyText({
  children,
  className,
  as: Component = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-[linear-gradient(110deg,var(--primary),35%,var(--accent),50%,var(--primary),65%,var(--primary))]",
        "bg-[length:200%_auto] animate-[text-shimmer_5s_linear_infinite]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
