import { EMAIL_ENABLED, RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL } from "./config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via Resend. Gracefully no-ops (returns false) when email is
 * not yet configured — the site keeps working while the owner sets up
 * the API key + verified domain.
 */
export async function sendEmail(msg: EmailOptions): Promise<boolean> {
  if (!EMAIL_ENABLED() || !RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[email:disabled] to=${msg.to} subject="${msg.subject}"`);
    }
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        ...(msg.text ? { text: msg.text } : {}),
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}

export async function notifyOwner(subject: string, html: string): Promise<boolean> {
  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}

const esc = (s: any) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function guestConfirmationEmail(opts: {
  name: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: string;
  status: string;
}) {
  const { name, checkIn, checkOut, nights, total, status } = opts;
  const ok = status !== "pending";
  return {
    subject: `Your Hawk's Nest request — ${checkIn} to ${checkOut}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;padding:24px;color:#222;">
      <h2 style="color:#00aa6c;margin:0 0 8px;">Hawk's Nest</h2>
      <p>Hi ${esc(name)},</p>
      <p>${ok ? "Your request has been received" : "Thanks — we have your stay details"}.
      Here's a summary:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#666;">Check-in</td><td style="text-align:right;font-weight:600;">${checkIn}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Check-out</td><td style="text-align:right;font-weight:600;">${checkOut}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Nights</td><td style="text-align:right;">${nights}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Estimated total</td><td style="text-align:right;font-weight:600;color:#00aa6c;">${total}</td></tr>
      </table>
      <p>The owner replies personally to confirm availability and next steps.</p>
      <p style="color:#999;font-size:12px;">Hawk's Nest · Port St. Lucie, FL</p>
    </div>`,
  };
}
