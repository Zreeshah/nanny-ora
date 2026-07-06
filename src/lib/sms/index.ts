import "server-only";
import { toE164NZ } from "./normalise";

// ponytail: ALL SMS sending goes through sendSms(). Twilio via plain REST (Basic auth),
// no SDK dependency. Swapping providers later = editing only this file.

const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_FROM; // a +number, or a Messaging Service SID (MG...)


type SmsArgs = { to: string; body: string };

/** Best-effort SMS. No-ops (logs) when Twilio env vars are unset so dev/demo never breaks. */
export async function sendSms({ to, body }: SmsArgs): Promise<boolean> {
  const dest = toE164NZ(to);
  if (!SID || !TOKEN || !FROM) {
    console.log(`[sms:skipped — no Twilio creds] to=${dest} body="${body.slice(0, 40)}…"`);
    return false;
  }
  if (!dest) {
    console.warn(`[sms:skipped — no valid phone] raw=${to}`);
    return false;
  }
  try {
    const form = new URLSearchParams({ To: dest, Body: body });
    // MG... = Messaging Service SID, otherwise a from-number
    if (FROM.startsWith("MG")) form.set("MessagingServiceSid", FROM);
    else form.set("From", FROM);

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${SID}:${TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    if (!res.ok) {
      console.error(`[sms:failed] to=${dest} status=${res.status}:`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[sms:threw] to=${dest}:`, err);
    return false;
  }
}
