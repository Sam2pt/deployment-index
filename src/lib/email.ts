import { Resend } from "resend";
import { ARCHETYPES } from "./archetypes";
import { INDUSTRIES } from "./questions";
import { gradeFor } from "./scoring";
import type { Result } from "./types";

// --- Resend lead emails ------------------------------------------------------
// On submit we send two emails:
//   1. a confirmation/result email to the player
//   2. a lead alert to the 2PT inbox (reply-to set to the lead) so Sam can
//      reach out directly.
//
// Config via env vars (set in Netlify):
//   RESEND_API_KEY  – required; without it, sending is skipped (fail-soft)
//   EMAIL_FROM      – verified Resend sender, e.g. "The Deployment Index <noreply@2pt.ai>"
//   LEAD_NOTIFY_TO  – where lead alerts go (default sam@twopointtechnologies.com)

const FROM = process.env.EMAIL_FROM || "The Deployment Index <noreply@2pt.ai>";
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "sam@twopointtechnologies.com";
const SITE = "https://deploymentindex.2pt.ai";

export interface Lead {
  name: string;
  role: string;
  email: string;
  wantsReport: boolean;
  wantsSession: boolean;
  result: Result;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function industryLabel(id: string): string {
  return INDUSTRIES.find((i) => i.id === id)?.label ?? id;
}

function playerEmail(lead: Lead): { subject: string; html: string } {
  const a = ARCHETYPES[lead.result.archetype];
  const name = lead.name || "there";
  const movesHtml = a.nextMoves
    .map(
      (m, i) =>
        `<tr><td style="padding:6px 10px 6px 0;color:#19e68c;font-weight:700;vertical-align:top">${String(i + 1).padStart(2, "0")}</td><td style="padding:6px 0;color:#1a1a1a">${esc(m)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#0a0618;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0618"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden">
      <tr><td style="background:#0a0618;padding:28px 32px;color:#f4f4f5">
        <div style="font-size:12px;letter-spacing:2px;color:#8a86b8;text-transform:uppercase">The Deployment Index</div>
        <div style="font-size:26px;font-weight:800;margin-top:8px">You're ${esc(a.name)}</div>
        <div style="color:#19e68c;margin-top:6px;font-size:15px">${esc(a.tagline)}</div>
      </td></tr>
      <tr><td style="padding:28px 32px;color:#1a1a1a;font-size:15px;line-height:1.6">
        <p style="margin:0 0 14px">Nice work, ${esc(name)} — you took on the noise of AI and came out as <strong>${esc(a.name)}</strong>, ranking <strong>rank ${gradeFor(lead.result.percentile)} · top ${lead.result.topPercent}%</strong> of ${esc(industryLabel(lead.result.industry))} leaders.</p>
        <p style="margin:0 0 6px;font-weight:700;color:#0a0618">${esc(a.paragraph)}</p>
        <p style="margin:20px 0 8px;font-weight:800;color:#0a0618;font-size:13px;letter-spacing:1px;text-transform:uppercase">The three moves leaders like you make next</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${movesHtml}</table>
        <p style="margin:22px 0 10px">If you'd like to compare notes on what these moves look like in practice, the 2PT team runs a 20-minute working session. No pitch.</p>
        <a href="${SITE}" style="display:inline-block;background:#19e68c;color:#04140c;font-weight:800;text-decoration:none;padding:12px 22px;border-radius:8px">Play again or share your class →</a>
      </td></tr>
      <tr><td style="padding:18px 32px;background:#f3f2f8;color:#8a86b8;font-size:12px">Built by 2PT · The deployment firm for marketing · ${SITE.replace("https://", "")}</td></tr>
    </table>
  </td></tr></table></body></html>`;

  return { subject: `${name}, you're ${a.name} — your Deployment Index result`, html };
}

function notifyEmail(lead: Lead): { subject: string; html: string } {
  const a = ARCHETYPES[lead.result.archetype];
  const r = lead.result;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#666;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#111;font-weight:600">${v}</td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f5f5f7">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 16px">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff;border-radius:12px;padding:24px 28px">
      <tr><td>
        <div style="font-size:13px;color:#19a06a;font-weight:700;text-transform:uppercase;letter-spacing:1px">New Deployment Index lead</div>
        <h2 style="margin:8px 0 16px;font-size:20px;color:#111">${esc(lead.name)} · ${esc(lead.role)}</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">
          ${row("Email", `<a href="mailto:${esc(lead.email)}" style="color:#1166dd">${esc(lead.email)}</a>`)}
          ${row("Role", esc(lead.role))}
          ${row("Class", esc(a.name))}
          ${row("Industry", esc(industryLabel(r.industry)))}
          ${row("Rank", `${gradeFor(r.percentile)} · top ${r.topPercent}% (${r.percentile}th pct)`)}
          ${row("Runner-up", r.runnerUp ? `${esc(ARCHETYPES[r.runnerUp].short)} (by ${r.margin} pt${r.margin === 1 ? "" : "s"})` : "—")}
          ${row("Wants quarterly report", lead.wantsReport ? "✅ yes" : "no")}
          ${row("Wants 20-min session", lead.wantsSession ? "✅ YES — follow up" : "no")}
        </table>
        <p style="margin:18px 0 0;font-size:13px;color:#888">Reply to this email to reach ${esc(lead.name)} directly.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  return {
    subject: `Lead: ${lead.name} (${lead.role}) — ${a.short}${lead.wantsSession ? " · wants session" : ""}`,
    html,
  };
}

export async function sendLeadEmails(lead: Lead): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping send (lead still acked).");
    return { sent: false };
  }

  const resend = new Resend(key);
  const player = playerEmail(lead);
  const notify = notifyEmail(lead);

  const results = await Promise.allSettled([
    resend.emails.send({ from: FROM, to: lead.email, subject: player.subject, html: player.html }),
    resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject: notify.subject,
      html: notify.html,
    }),
  ]);

  results.forEach((r, i) => {
    const which = i === 0 ? "player" : "notify";
    if (r.status === "rejected") console.error(`[email] ${which} send failed:`, r.reason);
    else if (r.value.error) console.error(`[email] ${which} send error:`, r.value.error);
  });

  return { sent: true };
}
