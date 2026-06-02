import { NextResponse } from "next/server";

// Lead capture endpoint. v1 stub: validates shape and acks. Next iteration
// wires this to Postgres/Supabase (anonymous response + email table per PRD
// §10) and triggers the transactional PDF email via Resend/Postmark.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const { email, name, role } = (body ?? {}) as {
    email?: string;
    name?: string;
    role?: string;
  };
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid email" },
      { status: 422 },
    );
  }

  // Lead profile captured in-game (name + role) arrives alongside the email and
  // the computed result — qualified data gathered while they played.
  void name;
  void role;

  // TODO: persist lead (name, role, email, result) + enqueue PDF delivery.
  return NextResponse.json({ ok: true });
}
