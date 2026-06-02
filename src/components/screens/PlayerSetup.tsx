"use client";

import { useState } from "react";
import { PLAYER } from "@/lib/sprites";
import { sfxSelect } from "@/lib/sfx";
import PixelSprite from "@/components/PixelSprite";
import { PixelButton, Screen } from "./_shared";

// Arcade "PLAYER 1" setup — grabs name + role in-character before the fight,
// so we gather qualified lead data while it still feels like play. The name
// then rides through the HUD, reveal, and result.
const ROLES = [
  "CMO",
  "VP Marketing",
  "Head of Growth",
  "Marketing Director",
  "Brand / Comms",
  "Founder / CEO",
  "Other",
];

export default function PlayerSetup({
  initialName,
  initialRole,
  onComplete,
}: {
  initialName: string;
  initialRole: string;
  onComplete: (name: string, role: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);

  const ready = name.trim().length > 0 && role.length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    onComplete(name.trim(), role);
  }

  return (
    <Screen className="text-center">
      <p className="font-pixel accent-glow blink mb-5 text-sm uppercase">
        ★ Player 1 ★
      </p>

      <PixelSprite map={PLAYER} accent="#f4f4f5" dark="#9a9a93" px={6} idle className="mb-6" />

      <form onSubmit={submit} className="w-full max-w-md text-left">
        <label className="hud mb-2 block text-accent">▸ Enter your name</label>
        <input
          type="text"
          autoComplete="name"
          autoFocus
          maxLength={24}
          placeholder="Type your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-term w-full border-2 px-4 py-3 text-xl text-foreground placeholder:text-muted/50 focus:outline-none"
          style={{ background: "var(--panel)", borderColor: "var(--border)", borderRadius: 0 }}
        />

        <label className="hud mb-2 mt-6 block text-accent">▸ What do you do?</label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => {
            const selected = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  sfxSelect();
                }}
                className="font-term border-2 px-3 py-2 text-base"
                style={{
                  borderRadius: 0,
                  background: selected ? "var(--accent)" : "var(--panel)",
                  borderColor: selected ? "var(--accent)" : "var(--border)",
                  color: selected ? "var(--accent-ink)" : "var(--foreground)",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-xs">
          <PixelButton type="submit" disabled={!ready}>
            ▶ Enter the Arena
          </PixelButton>
        </div>
      </form>
    </Screen>
  );
}
