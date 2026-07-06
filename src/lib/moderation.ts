/**
 * Detect contact info (email / phone) in a chat message so it can be flagged.
 * Handles common obfuscations: "name at gmail dot com", "(at)/(dot)",
 * spelled-out digits ("oh two one..."). All passes are linear — no backtracking.
 */

const WORD_DIGITS: Record<string, string> = {
  zero: "0", oh: "0", o: "0", one: "1", two: "2", three: "3", four: "4",
  five: "5", six: "6", seven: "7", eight: "8", nine: "9",
};

/** Lowercase + de-obfuscate: "(at)"→"@", "dot"→".", spelled digits→digits. */
function normalise(text: string): string {
  let t = text.toLowerCase();
  t = t.replace(/[([{\s]*at[)\]}\s]+/g, "@"); // " at ", "(at)", "[at]"
  t = t.replace(/[([{\s]*dot[)\]}\s]+/g, "."); // " dot ", "(dot)"
  // spelled-out digits → digits ("oh two one" → "021")
  t = t.replace(/\b(zero|oh|one|two|three|four|five|six|seven|eight|nine)\b/g, (w) => WORD_DIGITS[w]);
  return t;
}

export function detectContactInfo(text: string): { email: boolean; phone: boolean; flagged: boolean } {
  const n = normalise(text);
  const email =
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text) ||
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(n);
  // phone: drop separators, then a run of 7+ digits (NZ mobiles/landlines + intl)
  const phone = /\d{7,}/.test(text.replace(/[\s\-().+]/g, "")) || /\d{7,}/.test(n.replace(/[\s\-().+]/g, ""));
  // ponytail: normaliser catches "at/dot" + spelled digits; determined users can still
  // get creative — admin flag review is the human backstop.
  return { email, phone, flagged: email || phone };
}
