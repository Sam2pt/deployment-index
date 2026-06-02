"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { ARCHETYPES } from "@/lib/archetypes";
import { INDUSTRIES } from "@/lib/questions";
import { rankLabel } from "@/lib/scoring";
import { SPRITES } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import type { Result } from "@/lib/types";
import { PixelButton, Screen } from "./_shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture({
  result,
  name,
  role,
  onShare,
}: {
  result: Result;
  name: string;
  role: string;
  onShare: () => void;
}) {
  const [email, setEmail] = useState("");
  const [wantsReport, setWantsReport] = useState(true);
  const [wantsSession, setWantsSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const a = ARCHETYPES[result.archetype];
  const industryLabel =
    INDUSTRIES.find((i) => i.id === result.industry)?.label ?? "your arena";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("> Invalid email. Try again.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, wantsReport, wantsSession, result }),
      }).catch(() => {});
    } finally {
      setSubmitting(false);
      setRevealed(true);
    }
  }

  if (revealed) {
    return (
      <Screen className="!items-start text-left">
        <p className="hud text-accent">▸ Mission briefing</p>
        <div className="mt-3 flex items-center gap-4">
          <PixelSprite
            map={SPRITES[result.archetype]}
            accent={a.palette.accent}
            dark={a.palette.c1}
            px={4}
          />
          <div>
            <h2 className="font-pixel glitch-text text-xl uppercase leading-[1.4] text-foreground">
              {a.name}
            </h2>
            <p className="hud mt-2" style={{ color: "var(--accent)" }}>
              {rankLabel(result)} · {industryLabel}
            </p>
          </div>
        </div>

        <p className="term-lg mt-5 text-muted">{a.paragraph}</p>

        <p className="hud mt-8 text-accent">▸ Quest log · your next three moves</p>
        <div className="mt-3 flex w-full flex-col gap-2.5">
          {a.nextMoves.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="pixel-box flex items-center gap-3 px-4 py-3"
            >
              <span
                className="font-pixel text-[0.7rem]"
                style={{ color: "var(--accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="term-lg text-foreground">{m}</span>
            </motion.div>
          ))}
        </div>

        <p className="term-lg mt-7 text-muted">
          Want to compare notes on what these moves look like in practice? The
          2PT team runs a 20-minute working session. No pitch.
        </p>

        <div className="mt-8 w-full max-w-xs">
          <PixelButton onClick={onShare}>▶ Share Score</PixelButton>
          <p className="hud mt-4 normal-case text-muted/70">
            Full report incoming to {email}
          </p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen className="text-center">
      <p className="font-pixel accent-glow mb-5 text-sm uppercase">
        {name ? `▸ Nice fight, ${name}` : "▸ Continue?"}
      </p>
      <h2 className="font-pixel text-lg uppercase leading-[1.5] text-foreground">
        Enter email to unlock your full report
      </h2>
      <p className="term-lg mt-4 max-w-md text-muted">
        Your {a.short} profile, your next three moves, and where {industryLabel}{" "}
        is heading.
      </p>

      {/* Locked preview — tease the payoff behind the gate. */}
      <div className="pixel-box mt-7 w-full max-w-md p-4 text-left">
        <p className="hud mb-3 text-accent">▸ Quest log · locked</p>
        <div className="flex flex-col gap-2">
          {a.nextMoves.map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="font-pixel text-[0.7rem]"
                style={{ color: "var(--accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="h-3 flex-1"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, var(--panel-2) 0 10px, transparent 10px 14px)",
                }}
              />
              <span className="text-sm">🔒</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 w-full max-w-md text-left">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-term w-full border-2 px-4 py-3 text-xl text-foreground placeholder:text-muted/50 focus:outline-none"
          style={{ background: "var(--panel)", borderColor: "var(--border)", borderRadius: 0 }}
        />
        {error && <p className="font-term mt-2 text-lg text-[#ff6b6b]">{error}</p>}

        <div className="mt-5 flex flex-col gap-3">
          <Check
            checked={wantsReport}
            onChange={setWantsReport}
            label="Send me the quarterly State of Deployment report"
          />
          <Check
            checked={wantsSession}
            onChange={setWantsSession}
            label="Open to a 20-minute working session with the 2PT team"
          />
        </div>

        <div className="mx-auto mt-8 max-w-xs">
          <PixelButton type="submit" disabled={submitting}>
            {submitting ? "Loading…" : "▶ Unlock"}
          </PixelButton>
        </div>
      </form>
    </Screen>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 text-left"
    >
      <span
        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center border-2 font-pixel text-[0.6rem]"
        style={{
          background: checked ? "var(--accent)" : "var(--panel)",
          borderColor: checked ? "var(--accent)" : "var(--border)",
          color: "var(--accent-ink)",
          borderRadius: 0,
        }}
      >
        {checked ? "x" : ""}
      </span>
      <span className="font-term text-lg leading-tight text-muted">{label}</span>
    </button>
  );
}
