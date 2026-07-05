/** Normalise a NZ-entered phone to E.164. Already-`+` numbers pass through. Returns null if unusable. */
export function toE164NZ(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("64")) return "+" + digits; // already country-coded, no +
  if (digits.startsWith("0")) return "+64" + digits.slice(1); // 0211234567 → +64211234567
  return "+64" + digits; // bare local number
}
