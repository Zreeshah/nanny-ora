import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "./escape";

// ponytail: ALL sending goes through sendEmail(). Swapping Resend → AWS SES later
// is editing only this function — no provider abstraction layer needed.

// Sender identities (per-purpose usernames). Overridable via env; the domain
// must be verified in Resend for these to deliver.
const FROM = process.env.EMAIL_FROM || "NannyOra <info@nannyora.co.nz>";
const FROM_VERIFY = process.env.EMAIL_FROM_VERIFICATION || "NannyOra Vetting <verification@nannyora.co.nz>";
const FROM_ADMIN = process.env.EMAIL_FROM_ADMIN || "NannyOra <admin@nannyora.co.nz>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "admin@nannyora.co.nz";
// Comma-separated list — every address receives all admin notifications.
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "admin@nannyora.co.nz,nannyora.agency@gmail.com")
  .split(",").map((e) => e.trim()).filter(Boolean);
const SITE_URL = process.env.NEXTAUTH_URL || "https://www.nannyora.co.nz";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type SendArgs = { to: string | string[]; subject: string; html: string; from?: string };

/** Best-effort send. No-ops (logs) when RESEND_API_KEY is unset so dev/demo never breaks. */
export async function sendEmail({ to, subject, html, from }: SendArgs): Promise<boolean> {
  if (!resend) {
    console.log(`[email:skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({ from: from || FROM, to, subject, html, replyTo: REPLY_TO });
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

// ============================================================
// Lifecycle emails. Every sender is best-effort (never throws)
// and reuses emailShell() for a consistent branded layout.
// ============================================================

/** Branded HTML wrapper. `body` is trusted markup; escape any user input before passing in. */
function emailShell(heading: string, body: string, cta?: { label: string; href: string }): string {
  const button = cta
    ? `<p style="margin:28px 0 8px"><a href="${cta.href}" style="display:inline-block;background:#0F2E52;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">${escapeHtml(cta.label)}</a></p>`
    : "";
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#0C1E36;line-height:1.55">
    <h2 style="color:#0F2E52;margin:0 0 16px">${escapeHtml(heading)}</h2>
    ${body}
    ${button}
    <p style="margin-top:28px;color:#5B6D80;font-size:13px">Warm regards,<br/>The NannyOra Team<br/>
    <a href="${SITE_URL}" style="color:#B88A58">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
  </div>`;
}

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Application received — under review",
  APPROVED: "Approved & now listed",
  VERIFIED: "Verified",
  SPECIALIST: "Specialist verified",
  PREMIUM_VETTED: "Premium Vetted",
  LISTED: "Listed",
  REJECTED: "Not approved at this time",
};

/** Welcome a newly-registered nanny. */
export function sendNannyWelcome(name: string, email: string): Promise<boolean> {
  const body = `<p>Hi ${escapeHtml(name)},</p>
    <p>Thank you for applying to join <strong>NannyOra</strong>. Your application has been received and our vetting
    team will begin reviewing your details and documents. We'll email you as each step of verification progresses.</p>
    <p>You can sign in any time to track your status and complete your profile.</p>`;
  return sendEmail({ to: email, subject: "Welcome to NannyOra — application received", html: emailShell("Welcome to NannyOra", body, { label: "Go to your dashboard", href: `${SITE_URL}/dashboard/nanny` }) });
}

/** Welcome a newly-registered parent/family. */
export function sendParentWelcome(name: string, email: string): Promise<boolean> {
  const body = `<p>Hi ${escapeHtml(name)},</p>
    <p>Welcome to <strong>NannyOra</strong>. Your family account is ready. You can now browse our agency-verified
    nannies across Auckland and send enquiries to the caregivers who fit your needs.</p>`;
  return sendEmail({ to: email, subject: "Welcome to NannyOra", html: emailShell("Welcome to NannyOra", body, { label: "Find a nanny", href: `${SITE_URL}/find-a-nanny` }) });
}

/** Notify a nanny when their verification / listing status changes. */
export function sendVerificationUpdate(name: string, email: string, status: string, note?: string): Promise<boolean> {
  const label = STATUS_LABELS[status] || status;
  const body = `<p>Hi ${escapeHtml(name)},</p>
    <p>There's an update on your NannyOra verification. Your status is now:</p>
    <p style="font-size:16px;font-weight:700;color:#0F2E52">${escapeHtml(label)}</p>
    ${note ? `<p>${escapeHtml(note)}</p>` : ""}`;
  return sendEmail({ to: email, from: FROM_VERIFY, subject: `Your NannyOra verification: ${label}`, html: emailShell("Verification update", body, { label: "View your dashboard", href: `${SITE_URL}/dashboard/nanny` }) });
}

/** Confirm to a parent that their enquiry was sent. */
export function sendEnquiryReceipt(parentName: string, parentEmail: string, nannyName: string): Promise<boolean> {
  const body = `<p>Hi ${escapeHtml(parentName)},</p>
    <p>Your enquiry about <strong>${escapeHtml(nannyName)}</strong> has been sent to the NannyOra team. We'll be in
    touch shortly to help arrange next steps.</p>`;
  return sendEmail({ to: parentEmail, subject: "Your NannyOra enquiry has been sent", html: emailShell("Enquiry received", body) });
}

/** Notify a parent when an admin updates their enquiry (contacted / matched / closed). */
export function sendEnquiryStatusUpdate(parentName: string, parentEmail: string, nannyName: string, status: string): Promise<boolean> {
  const map: Record<string, string> = { CONTACTED: "Our team has reached out about your enquiry", MATCHED: "You've been matched — great news!", CLOSED: "Your enquiry has been closed" };
  const line = map[status] || `Your enquiry status is now ${status}`;
  const body = `<p>Hi ${escapeHtml(parentName)},</p>
    <p>${escapeHtml(line)} regarding <strong>${escapeHtml(nannyName)}</strong>.</p>`;
  return sendEmail({ to: parentEmail, from: FROM_ADMIN, subject: `Update on your NannyOra enquiry`, html: emailShell("Enquiry update", body) });
}

/** Fire an admin notification. body is trusted markup. */
function notifyAdmin(subject: string, heading: string, body: string, cta?: { label: string; href: string }): Promise<boolean> {
  return sendEmail({ to: ADMIN_EMAILS, from: FROM_ADMIN, subject, html: emailShell(heading, body, cta) });
}

export function notifyAdminNewNanny(name: string, email: string): Promise<boolean> {
  return notifyAdmin("New nanny application", "New nanny application", `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) has applied to join as a nanny and is awaiting review.</p>`, { label: "Review applications", href: `${SITE_URL}/admin/nannies` });
}

export function notifyAdminNewParent(name: string, email: string): Promise<boolean> {
  return notifyAdmin("New family registration", "New family registration", `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) has registered as a family.</p>`);
}

export function notifyAdminNewEnquiry(parentName: string, nannyName: string, message: string): Promise<boolean> {
  return notifyAdmin("New enquiry received", "New enquiry", `<p><strong>${escapeHtml(parentName)}</strong> sent an enquiry about <strong>${escapeHtml(nannyName)}</strong>:</p><blockquote style="border-left:3px solid #B88A58;padding-left:12px;color:#5B6D80">${escapeHtml(message)}</blockquote>`, { label: "View enquiries", href: `${SITE_URL}/admin` });
}

/** Notify a parent when an admin approves/rejects/closes their job post. */
export function sendJobStatusUpdate(parentName: string, parentEmail: string, jobTitle: string, status: string): Promise<boolean> {
  const map: Record<string, string> = {
    APPROVED: "Your job post is now live and visible to our verified nannies.",
    REJECTED: "Your job post was not approved. Reply to this email if you'd like help adjusting it.",
    CLOSED: "Your job post has been closed.",
  };
  const line = map[status] || `Your job post status is now ${status}.`;
  const body = `<p>Hi ${escapeHtml(parentName)},</p>
    <p><strong>${escapeHtml(jobTitle)}</strong> — ${escapeHtml(line)}</p>`;
  return sendEmail({ to: parentEmail, from: FROM_ADMIN, subject: "Update on your NannyOra job post", html: emailShell("Job post update", body) });
}

export function notifyAdminNewJob(parentName: string, title: string, suburb: string): Promise<boolean> {
  return notifyAdmin("New job post awaiting review", "New job post", `<p><strong>${escapeHtml(parentName)}</strong> posted <strong>${escapeHtml(title)}</strong> (${escapeHtml(suburb)}) — pending review.</p>`, { label: "Review jobs", href: `${SITE_URL}/admin/jobs` });
}

/** Password reset link. Token is single-use, expires in 1 hour. */
export function sendPasswordReset(name: string, email: string, resetUrl: string): Promise<boolean> {
  const body = `<p>Hi ${escapeHtml(name)},</p>
    <p>We received a request to reset your NannyOra password. Click the button below to choose a new one.
    This link expires in <strong>1 hour</strong> and can be used once.</p>
    <p style="color:#5B6D80;font-size:13px">If you didn't request this, you can safely ignore this email — your password is unchanged.</p>`;
  return sendEmail({ to: email, subject: "Reset your NannyOra password", html: emailShell("Reset your password", body, { label: "Choose a new password", href: resetUrl }) });
}
