"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { ARCHETYPES } from "@/lib/archetypes";
import { SPRITES } from "@/lib/sprites";
import { sfxUnlock } from "@/lib/sfx";
import PixelSprite from "@/components/PixelSprite";
import ParticleBurst from "@/components/ParticleBurst";
import type { Result } from "@/lib/types";
import { PixelButton } from "./_shared";

const SEGMENTS = 10;

export default function ArchetypeReveal({
  result,
  name,
  onContinue,
}: {
  result: Result;
  name: string;
  onContinue: () => void;
}) {
  const a = ARCHETYPES[result.archetype];
  const runner = result.runnerUp ? ARCHETYPES[result.runnerUp] : null;
  const nearMiss = runner && result.margin <= 2;

  useEffect(() => {
    sfxUnlock();
  }, []);

  return (
    // Quick screen-shake on entry for impact.
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: [0, -8, 7, -5, 4, 0], y: [0, 5, -4, 3, -2, 0] }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative flex w-full max-w-md flex-col items-center text-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="font-pixel accent-glow blink mb-4 text-xs uppercase"
      >
        {name ? `${name} — class unlocked` : "★ Class unlocked ★"}
      </motion.p>

      {/* Character + celebratory burst. */}
      <div className="relative flex items-center justify-center">
        <ParticleBurst color={a.palette.accent} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.12 }}
          className="relative z-10"
        >
          <PixelSprite
            map={SPRITES[result.archetype]}
            accent={a.palette.accent}
            dark={a.palette.c1}
            px={9}
            idle
          />
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-pixel glitch-text mt-6 text-[clamp(1.3rem,6vw,2.25rem)] uppercase leading-[1.4] text-foreground"
      >
        {a.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="term-lg mt-3 text-accent"
      >
        {a.tagline}
      </motion.p>

      {/* Stat block. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="pixel-box mt-6 w-full p-4"
      >
        <div className="flex flex-col gap-2.5">
          {a.stats.map((s, i) => (
            <StatBar key={s.label} label={s.label} value={s.value} delay={1.1 + i * 0.12} />
          ))}
        </div>
      </motion.div>

      {nearMiss && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="hud mt-4 normal-case text-muted"
        >
          ▸ Just {result.margin} pt{result.margin === 1 ? "" : "s"} from{" "}
          <span style={{ color: "var(--accent)" }}>{runner!.short}</span>
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="mt-6 w-full max-w-xs"
      >
        <PixelButton onClick={onContinue}>▶ View Ranking</PixelButton>
      </motion.div>
    </motion.div>
  );
}

function StatBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const filled = Math.round((value / 100) * SEGMENTS);
  return (
    <div className="flex items-center gap-3">
      <span className="hud w-24 shrink-0 text-left normal-case text-muted">
        {label}
      </span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <motion.span
            key={i}
            className="h-3 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + i * 0.04, duration: 0.01 }}
            style={{ background: i < filled ? "var(--accent)" : "var(--panel-2)" }}
          />
        ))}
      </div>
      <span
        className="font-pixel tabular w-7 shrink-0 text-right text-[0.6rem]"
        style={{ color: "var(--accent)" }}
      >
        {value}
      </span>
    </div>
  );
}
