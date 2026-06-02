"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sfxRiser } from "@/lib/sfx";
import { Screen } from "./_shared";

const PHRASES = [
  "Filtering the noise",
  "Mapping your class",
  "Placing you in your arena",
];

const TOTAL_MS = 2000;
const CELLS = 16;

export default function Calculating({ onDone }: { onDone: () => void }) {
  const [phrase, setPhrase] = useState(0);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    sfxRiser();
    const phraseStep = TOTAL_MS / PHRASES.length;
    const timers = PHRASES.map((_, i) =>
      window.setTimeout(() => setPhrase(i), i * phraseStep),
    );
    const cellStep = TOTAL_MS / CELLS;
    const cellTimers = Array.from({ length: CELLS }, (_, i) =>
      window.setTimeout(() => setFilled(i + 1), i * cellStep),
    );
    const done = window.setTimeout(onDone, TOTAL_MS + 120);
    return () => {
      [...timers, ...cellTimers, done].forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <Screen className="text-center">
      <p className="font-pixel accent-glow mb-8 text-sm uppercase">
        Analyzing<span className="blink">_</span>
      </p>

      {/* Stepped pixel loading bar */}
      <div className="pixel-box flex gap-1 p-2">
        {Array.from({ length: CELLS }).map((_, i) => (
          <span
            key={i}
            className="h-5 w-3"
            style={{
              background: i < filled ? "var(--accent)" : "var(--panel-2)",
            }}
          />
        ))}
      </div>

      <div className="mt-7 h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={phrase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="term-lg text-muted"
          >
            {PHRASES[phrase]}…
          </motion.p>
        </AnimatePresence>
      </div>
    </Screen>
  );
}
