"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { ARCHETYPES } from "@/lib/archetypes";
import { INDUSTRIES } from "@/lib/questions";
import { gradeFor } from "@/lib/scoring";
import { SPRITES } from "@/lib/sprites";
import { sfxCoin } from "@/lib/sfx";
import PixelSprite from "@/components/PixelSprite";
import type { Result } from "@/lib/types";
import { PixelButton } from "./_shared";

const SWEEP_MS = 1800;
const CELLS = 20;

export default function RankingReveal({
  result,
  onEmail,
  onShare,
}: {
  result: Result;
  onEmail: () => void;
  onShare: () => void;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const a = ARCHETYPES[result.archetype];
  const industryLabel =
    INDUSTRIES.find((i) => i.id === result.industry)?.label ?? "your arena";
  const grade = gradeFor(result.percentile);
  const filled = Math.round((count / 100) * CELLS);

  useEffect(() => {
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const t = Math.min((ts - startTs) / SWEEP_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * result.percentile));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        sfxCoin();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result.percentile]);

  return (
    <div className="flex w-full max-w-lg flex-col items-center text-center">
      <PixelSprite
        map={SPRITES[result.archetype]}
        accent={a.palette.accent}
        dark={a.palette.c1}
        px={4}
        idle
        className="mb-4"
      />
      <p className="font-pixel accent-glow blink mb-6 text-sm uppercase">
        ☆ High Score ☆
      </p>

      {/* Score + rank badge */}
      <div className="flex items-end justify-center gap-6">
        <div>
          <span
            className="font-pixel tabular text-[clamp(3rem,16vw,6rem)] leading-none"
            style={{ color: "var(--accent)" }}
          >
            {String(count).padStart(2, "0")}
          </span>
          <p className="hud mt-2">Percentile</p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={done ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="pixel-box mb-3 flex h-20 w-20 flex-col items-center justify-center"
          style={{ background: "var(--panel-2)" }}
        >
          <span className="hud text-[0.5rem]">Rank</span>
          <span
            className="font-pixel text-3xl"
            style={{ color: "var(--accent)" }}
          >
            {grade}
          </span>
        </motion.div>
      </div>

      {/* XP bar */}
      <div className="pixel-box mt-7 flex w-full gap-1 p-2">
        {Array.from({ length: CELLS }).map((_, i) => (
          <span
            key={i}
            className="h-4 flex-1"
            style={{ background: i < filled ? "var(--accent)" : "var(--panel-2)" }}
          />
        ))}
      </div>

      <motion.div
        initial={false}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4 }}
        className="mt-8 w-full"
      >
        {result.archetype === "bandit" ? (
          <p className="term-lg text-foreground">
            <span style={{ color: "var(--accent)" }}>Dead last</span> in{" "}
            {industryLabel}. Someone&apos;s gotta block progress.
          </p>
        ) : (
          <p className="term-lg text-foreground">
            You&apos;re in the{" "}
            <span style={{ color: "var(--accent)" }}>top {result.topPercent}%</span>{" "}
            of marketing leaders in {industryLabel}.
          </p>
        )}

        <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">
          <PixelButton onClick={onEmail}>▶ Unlock Full Report</PixelButton>
          <PixelButton variant="ghost" onClick={onShare}>
            Share Score
          </PixelButton>
        </div>
      </motion.div>
    </div>
  );
}
