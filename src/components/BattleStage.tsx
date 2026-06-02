"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { AnswerOption } from "@/lib/types";
import { PLAYER, BOSS } from "@/lib/sprites";
import { sfxHit, sfxKO } from "@/lib/sfx";
import PixelSprite from "@/components/PixelSprite";

// Street-Fighter framing: you vs STATUS QUO. Each round you throw a "move"
// (your answer); the boss takes a hit and its health drains. Round 5 = K.O.
const KEYS = ["A", "B", "C", "D", "E"];
const TOTAL_ROUNDS = 5;

// One distinct attack per round, escalating — so no two hits feel the same.
// `anim` is the player's motion (x = lunge forward, y = jump, rotate = spin),
// `boss` is the boss's knock-back, all 4-keyframe with times [0,0.3,0.5,1].
const ATTACKS = [
  { word: "HIT!", color: "#ff3b3b", rot: -6, anim: { x: [0, 30, 62, 0], y: [0, 0, 0, 0], rotate: [0, 0, 0, 0] }, boss: [0, 6, -3, 0] },
  { word: "POW!", color: "#ffd23b", rot: 5, anim: { x: [0, 22, 56, 0], y: [0, -34, -8, 0], rotate: [0, 0, 0, 0] }, boss: [0, 10, -5, 0] },
  { word: "BAM!", color: "#3bdcff", rot: -8, anim: { x: [0, 74, 74, 0], y: [0, 0, 0, 0], rotate: [0, 0, 0, 0] }, boss: [0, 14, -6, 0] },
  { word: "WHAM!", color: "#c77dff", rot: 7, anim: { x: [0, 26, 58, 0], y: [0, -14, 0, 0], rotate: [0, 180, 360, 360] }, boss: [0, 16, -8, 0] },
  { word: "SMASH!", color: "#ff6b35", rot: -4, anim: { x: [0, 18, 52, 0], y: [0, -54, 12, 0], rotate: [0, 0, 0, 0] }, boss: [0, 22, -10, 0] },
];

// What STATUS QUO snarls each round — cocky, then rattled, then desperate.
const TAUNTS = [
  "You can't change anything.",
  "Pfft. Beginner's luck.",
  "...okay, that one stung.",
  "Not the roadmap! Anything but the roadmap!",
  "Fine! FINE! We'll ship it!",
];

export default function BattleStage({
  round, // 1-based round number
  prompt,
  options,
  onPick,
}: {
  round: number;
  prompt: string;
  options: AnswerOption[];
  onPick: (optionId: string) => void;
}) {
  const bossStart = Math.max(0, 100 - (round - 1) * (100 / TOTAL_ROUNDS));
  const bossAfter = Math.max(0, 100 - round * (100 / TOTAL_ROUNDS));

  const [hp, setHp] = useState(bossStart);
  const [attacking, setAttacking] = useState(false);
  const [ko, setKo] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const atk = ATTACKS[Math.min(round - 1, ATTACKS.length - 1)];

  function strike(id: string) {
    if (selected) return;
    setSelected(id);
    setAttacking(true);
    setHp(bossAfter);
    if (bossAfter <= 0) {
      setKo(true);
      sfxKO();
    } else {
      sfxHit();
    }
    onPick(id);
  }

  return (
    <div className="flex w-full max-w-xl flex-col">
      {/* Health HUD */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <HealthBar name="YOU" hp={100} color="var(--accent)" align="left" />
        <span className="hud shrink-0 text-foreground">R{round}/{TOTAL_ROUNDS}</span>
        <HealthBar name="STATUS QUO" hp={hp} color="#ff3b3b" align="right" />
      </div>

      {/* Arena (shake escalates with the round) */}
      <motion.div
        animate={attacking ? { x: [0, -(5 + round * 2), 4 + round, -3, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="pixel-box relative mb-3 flex h-[clamp(150px,22vh,210px)] items-end justify-between overflow-hidden px-6 pb-4"
        style={{ background: "var(--panel)" }}
      >
        {/* arena floor glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--accent) 18%, transparent), transparent)" }}
        />

        {/* Boss taunt — STATUS QUO talks trash, escalating each round */}
        <motion.div
          key={`taunt-${round}`}
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="absolute right-4 top-3 z-10 max-w-[58%] border-2 px-3 py-2 text-right"
          style={{ background: "var(--panel-2)", borderColor: "#ff3b3b", borderRadius: 0 }}
        >
          <span className="font-term text-sm leading-tight" style={{ color: "#ff8a8a" }}>
            {TAUNTS[Math.min(round - 1, TAUNTS.length - 1)]}
          </span>
        </motion.div>

        {/* Player — a different move each round */}
        <motion.div
          className="relative z-10"
          animate={attacking ? atk.anim : { x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, times: [0, 0.3, 0.5, 1] }}
        >
          <PixelSprite map={PLAYER} accent="#f4f4f5" dark="#9a9a93" px={5} idle={!attacking} />
        </motion.div>

        {/* Hit word — varies per round (HIT! / POW! / BAM! / WHAM! / SMASH!) */}
        <AnimatePresence>
          {attacking && !ko && (
            <motion.span
              key="hit"
              initial={{ opacity: 0, scale: 0.3, y: 0, rotate: atk.rot }}
              animate={{ opacity: 1, scale: 1.35, y: -18, rotate: atk.rot }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3 }}
              className="glitch-text font-pixel absolute right-[26%] top-5 text-lg"
              style={{ color: atk.color }}
            >
              {atk.word}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Boss (knock-back + flash, escalating with the round) */}
        <motion.div
          className="relative z-10"
          animate={attacking ? { x: atk.boss, filter: ["brightness(1)", "brightness(2.4)", "brightness(1)"] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PixelSprite map={BOSS} accent="#4a4063" dark="#2a2342" px={6} idle={!attacking} />
        </motion.div>

        {/* K.O. overlay */}
        <AnimatePresence>
          {ko && (
            <motion.div
              key="ko"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <span className="font-pixel glitch-text text-4xl" style={{ color: "#ff3b3b" }}>
                K.O.!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Prompt */}
      <p className="term-lg mb-3 text-center text-foreground">{prompt}</p>

      {/* Moves */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((o, i) => {
          const chosen = selected === o.id;
          const wide = i === options.length - 1 && options.length % 2 === 1;
          return (
            <button
              key={o.id}
              onClick={() => strike(o.id)}
              disabled={!!selected}
              className={`flex items-center gap-2.5 border-2 px-3 py-3 text-left ${wide ? "col-span-2 justify-center" : ""}`}
              style={{
                borderRadius: 0,
                background: chosen ? "var(--accent)" : "var(--panel-2)",
                borderColor: chosen ? "var(--accent)" : "var(--border)",
                color: chosen ? "var(--accent-ink)" : "var(--foreground)",
                boxShadow: "3px 3px 0 0 rgba(0,0,0,0.5)",
                opacity: selected && !chosen ? 0.4 : 1,
              }}
            >
              <span
                className="font-pixel flex h-5 w-5 shrink-0 items-center justify-center text-[0.6rem]"
                style={{
                  background: chosen ? "rgba(0,0,0,0.18)" : "var(--panel)",
                  color: chosen ? "var(--accent-ink)" : "var(--accent)",
                }}
              >
                {KEYS[i]}
              </span>
              <span className="font-term text-base font-semibold">{o.tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HealthBar({
  name,
  hp,
  color,
  align,
}: {
  name: string;
  hp: number;
  color: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 ${align === "right" ? "items-end" : ""}`}>
      <span className="hud truncate">{name}</span>
      <div
        className="h-3 w-full border-2"
        style={{ borderColor: "var(--border)", background: "var(--panel-2)" }}
      >
        <motion.div
          className="h-full"
          style={{ background: color, marginLeft: align === "right" ? "auto" : 0 }}
          initial={false}
          animate={{ width: `${hp}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
