import type { ReactNode } from "react";
import { ShinyText } from "@/components/ui/ShinyText";

/** Shared wrapper for the legal documents — consistent header + readable column. */
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 leading-tight">
        <ShinyText>{title}</ShinyText>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>
      {intro && <p className="text-base text-muted-foreground leading-relaxed mb-10">{intro}</p>}
      <div className="space-y-9">{children}</div>
    </div>
  );
}

export function LegalSection({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

/** Bulleted list used inside sections. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
