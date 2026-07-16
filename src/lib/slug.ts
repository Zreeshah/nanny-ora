/** Turn a name into a URL slug: "Jessie Wu" → "jessie-wu". Pure (client + server). */
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents/macrons
      .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → dash
      .replace(/^-+|-+$/g, "") // trim dashes
      .slice(0, 60) || "nanny"
  );
}

/** A cuid has no dashes; a slug does (or is a short word). Used to prefer slug lookups. */
export const looksLikeCuid = (s: string): boolean => /^c[a-z0-9]{20,}$/.test(s);
