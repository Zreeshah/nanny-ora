import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "./escape";

// ponytail: ALL sending goes through sendEmail(). Swapping Resend → AWS SES later
// is editing only this function — no provider abstraction layer needed.

const FROM = process.env.EMAIL_FROM || "NannyOra <onboarding@resend.dev>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "admin@nannyora.co.nz";
const SITE_URL = process.env.NEXTAUTH_URL || "https://nanny-ora.vercel.app";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type SendArgs = { to: string; subject: string; html: string };

/** Best-effort send. No-ops (logs) when RESEND_API_KEY is unset so dev/demo never breaks. */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<boolean> {
  if (!resend) {
    console.log(`[email:skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, replyTo: REPLY_TO });
    if (error) {
      console.error(`[email:failed] to=${to}:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email:threw] to=${to}:`, err);
    return false;
  }
}

type Referee = { name: string; email: string; relationship?: string };

/**
 * Auto-email each referee a reference request when a nanny applies.
 * Best-effort: a failed/blocked email never throws — referees that fail are returned so callers can log.
 */
export async function sendRefereeRequests(nannyName: string, referees: Referee[]): Promise<{ sent: number; failed: string[] }> {
  const failed: string[] = [];
  let sent = 0;
  for (const ref of referees) {
    if (!ref?.email) continue;
    const ok = await sendEmail({
      to: ref.email,
      subject: `Reference request for ${nannyName} — NannyOra`,
      html: refereeRequestHtml(nannyName, ref),
    });
    if (ok) sent++;
    else failed.push(ref.email);
  }
  return { sent, failed };
}

function refereeRequestHtml(nannyName: string, ref: Referee): string {
  const hello = ref.name ? `Hi ${escapeHtml(ref.name)},` : "Hello,";
  const rel = ref.relationship ? ` as their <strong>${escapeHtml(ref.relationship)}</strong>` : "";
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#0C1E36">
    <h2 style="color:#0F2E52">Reference request</h2>
    <p>${hello}</p>
    <p><strong>${escapeHtml(nannyName)}</strong> has applied to join <strong>NannyOra</strong>, a vetted childcare
    platform in Auckland, and listed you${rel} as a referee.</p>
    <p>Could you reply to this email to confirm whether you'd recommend ${escapeHtml(nannyName)} for childcare work?
    A few sentences on your experience with them is plenty. Our vetting team reviews every reference as part of our
    safety checks.</p>
    <p style="color:#5B6D80;font-size:13px">If you don't recognise this person, you can ignore this email.</p>
    <p style="margin-top:24px">Thank you,<br/>The NannyOra Vetting Team<br/>
    <a href="${SITE_URL}" style="color:#B88A58">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
  </div>`;
}
