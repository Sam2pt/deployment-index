"use client";

import { useState } from "react";
import { motion } from "motion/react";

import type { AnswerOption } from "@/lib/types";
import { PLAYER } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";

// Each question is a tiny 2D platformer level: five floating platforms (one per
// answer) and a player who hops onto the one you tap. Lighter than a wall of
// multiple-choice text, and big tap targets work great on mobile.

const KEYS = ["A", "B", "C", "D", "E"];

// Platform anchor points (% of the scene), bottom→top zig-zag. Index = option.
const SLOTS = [
  { left: 30, top: 82 }, // A
  { left: 70, top: 65 }, // B
  { left: 28, top: 47 }, // C
  { left: 68, top: 29 }, // D
  { left: 42, top: 12 }, // E
];
const START = { left: 50, top: 95 };
const LAND = 13; // how far above a platform's anchor the player stands

export default function PlatformStage({
  options,
  onPick,
}: {
  options: AnswerOption[];
  onPick: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function tap(id: string) {
    if (selected) return;
    setSelected(id);
    onPick(id);
  }

  const idx = selected ? options.findIndex((o) => o.id === selected) : -1;
  const target =
    idx >= 0
      ? { left: SLOTS[idx].left, top: SLOTS[idx].top - LAND }
      : START;
  const peak = Math.min(START.top, target.top) - 16;
  const facingLeft = target.left < START.left;

  return (
    <div className="relative h-[clamp(360px,56vh,480px)] w-full">
      {/* ground strip */}
      <div
        className="absolute inset-x-0 bottom-0 h-3"
        style={{ background: "var(--border)" }}
      />

      {/* platforms */}
      {options.map((o, i) => {
        const slot = SLOTS[i];
        const chosen = selected === o.id;
        return (
          <button
            key={o.id}
            onClick={() => tap(o.id)}
            disabled={!!selected}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 px-3 py-2.5"
            style={{
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              borderRadius: 0,
              border: "2px solid",
              borderColor: chosen ? "var(--accent)" : "var(--border)",
              borderTopWidth: 5,
              borderTopColor: "var(--accent)",
              background: chosen ? "var(--accent)" : "var(--panel)",
              color: chosen ? "var(--accent-ink)" : "var(--foreground)",
              boxShadow: "3px 3px 0 0 rgba(0,0,0,0.55)",
            }}
          >
            <span
              className="font-pixel flex h-5 w-5 shrink-0 items-center justify-center text-[0.6rem]"
              style={{
                background: chosen ? "rgba(0,0,0,0.18)" : "var(--panel-2)",
                color: chosen ? "var(--accent-ink)" : "var(--accent)",
              }}
            >
              {KEYS[i]}
            </span>
            <span className="font-term whitespace-nowrap text-base font-semibold">
              {o.tag}
            </span>
          </button>
        );
      })}

      {/* player — hops onto the chosen platform */}
      <motion.div
        className="absolute z-10"
        style={{ marginLeft: -32, marginTop: -64 }}
        initial={false}
        animate={{
          left: `${target.left}%`,
          top: selected
            ? [`${START.top}%`, `${peak}%`, `${target.top}%`]
            : `${START.top}%`,
        }}
        transition={{ duration: 0.6, ease: "easeOut", times: [0, 0.5, 1] }}
      >
        <div style={{ transform: facingLeft ? "scaleX(-1)" : "none" }}>
          <PixelSprite map={PLAYER} accent="#f4f4f5" dark="#9a9a93" px={4} />
        </div>
      </motion.div>
    </div>
  );
}
