"use client";

import { motion } from "motion/react";

// One-shot pixel confetti burst from the centre. A fixed, small number of
// square particles animate outward and fade, then stop — cheap and celebratory.
const COUNT = 18;

export default function ParticleBurst({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
      {Array.from({ length: COUNT }).map((_, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        const dist = 90 + (i % 3) * 36;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            className="absolute h-2 w-2"
            style={{ background: i % 2 === 0 ? color : "#ffffff" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          />
        );
      })}
    </div>
  );
}
