"use client";

import { motion } from "motion/react";
import { PLAYER } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";

// A Mario-style world-map track. Nodes sit along a dotted path; the player
// token hops from node to node as `step` advances, so each decision visibly
// moves you forward toward the finish (★).
const NODE = 16; // px, w-4
const TOKEN_W = 30; // PLAYER is 10 cells × 3px

export default function JourneyTrack({
  total,
  step,
}: {
  total: number;
  step: number;
}) {
  const pctFor = (i: number) => (total > 1 ? (i / (total - 1)) * 100 : 0);
  const tokenPct = pctFor(Math.min(step, total - 1));

  return (
    <div className="relative mb-9 h-20 w-full">
      {/* dotted path */}
      <div
        className="absolute left-0 right-0 top-[60px] h-[3px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--border) 0 7px, transparent 7px 13px)",
        }}
      />

      {/* nodes */}
      {Array.from({ length: total }).map((_, i) => {
        const isFinish = i === total - 1;
        const done = i < step;
        const current = i === step;
        return (
          <div
            key={i}
            className="absolute top-[52px] flex items-center justify-center"
            style={{ left: `${pctFor(i)}%`, marginLeft: -NODE / 2, width: NODE, height: NODE }}
          >
            {isFinish ? (
              <span
                className="font-pixel text-sm leading-none"
                style={{ color: done || current ? "var(--accent)" : "var(--muted)" }}
              >
                ★
              </span>
            ) : (
              <span
                className="h-3.5 w-3.5 border-2"
                style={{
                  background: done ? "var(--accent)" : "var(--panel)",
                  borderColor: done || current ? "var(--accent)" : "var(--border)",
                }}
              />
            )}
          </div>
        );
      })}

      {/* player token — hops to the current node */}
      <motion.div
        className="absolute top-0"
        style={{ marginLeft: -TOKEN_W / 2 }}
        initial={false}
        animate={{ left: `${tokenPct}%`, y: [0, -16, 0] }}
        transition={{
          left: { type: "spring", stiffness: 280, damping: 22 },
          y: { duration: 0.4, ease: "easeOut" },
        }}
      >
        <PixelSprite map={PLAYER} accent="#f4f4f5" dark="#9a9a93" px={3} />
      </motion.div>
    </div>
  );
}
