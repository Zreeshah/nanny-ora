/**
 * Detect contact info (email / phone) in a chat message so it can be flagged.
 * Both patterns are linear — no catastrophic backtracking.
 */
export function detectContactInfo(text: string): { email: boolean; phone: boolean; flagged: boolean } {
  const email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  // phone: drop separators, then look for a run of 7+ digits (covers NZ mobiles/landlines + intl)
  const phone = /\d{7,}/.test(text.replace(/[\s\-().+]/g, ""));
  // ponytail: catches literal emails + digit runs, NOT spelled-out obfuscation
  // ("oh-two-one…", "name at gmail dot com"). Add a normaliser if abuse shows up.
  return { email, phone, flagged: email || phone };
}
