import { NextResponse } from "next/server";
import { sendLeadEmails, type Lead } from "@/lib/email";
import type { Result } from "@/lib/types";

// Lead capture endpoint. Validates the submission, then sends two emails via
// Resend: a result/confirmation to the player and a lead alert to 2PT.
// (Persistence to a DB is still a TODO; emails are the launch-critical path.)

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const { email, name, role, wantsReport, wantsSession, result } = (body ?? {}) as {
    email?: string;
    name?: string;
    role?: string;
    wantsReport?: boolean;
    wantsSession?: boolean;
    result?: Result;
  };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 422 });
  }
  if (!result || !result.archetype) {
    return NextResponse.json({ ok: false, error: "missing result" }, { status: 422 });
  }

  const lead: Lead = {
    name: (name ?? "").toString().slice(0, 80),
    role: (role ?? "").toString().slice(0, 80),
    email,
    wantsReport: !!wantsReport,
    wantsSession: !!wantsSession,
    result,
  };

  let emailDebug: { sent: boolean; errors: string[] } = { sent: false, errors: [] };
  try {
    emailDebug = await sendLeadEmails(lead);
  } catch (err) {
    // Fail soft: never block the player's UX on an email hiccup.
    console.error("[submit] email send threw:", err);
    emailDebug = { sent: false, errors: [`threw: ${String(err).slice(0, 160)}`] };
  }

  // `debug` is a temporary diagnostic surfaced during launch setup.
  return NextResponse.json({ ok: true, debug: emailDebug });
}
