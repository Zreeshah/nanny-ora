/** Normalize a suburb string for matching: lowercase, strip diacritics/macrons,
 *  strip spaces & punctuation. So "Forrest Hill" / "forrest hill" / "Whangaparāoa"
 *  all compare cleanly. */
export function normSuburb(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

/** Title-case a free-text suburb for display ("forrest hill" → "Forrest Hill"). */
export function titleCaseSuburb(s: string): string {
  return s.trim().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
