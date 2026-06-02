"use client";

import { motion } from "motion/react";
import { ARCHETYPES, ARCHETYPE_ORDER } from "@/lib/archetypes";
import { SPRITES } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import { StartPrompt } from "./_shared";

// Dramatic title entrance: the logo slams in, the roster pops in one fighter at
// a time, then PRESS START flashes on. Always plays after the boot screen
// (fully hydrated), so motion entrances are safe here.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const slam = {
  hidden: { opacity: 0, scale: 1.4 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 190, damping: 13 } },
};
const pop = {
  hidden: { opacity: 0, scale: 0, y: 26 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 320, damping: 15 } },
};

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="flex w-full max-w-2xl flex-col items-center text-center"
    >
      <motion.p variants={fade} className="hud mb-6">
        2PT Arcade
      </motion.p>

      <motion.h1
        variants={slam}
        className="font-pixel glitch-text text-[clamp(1.5rem,6vw,3.25rem)] leading-[1.5] text-foreground"
      >
        THE
        <br />
        DEPLOYMENT
        <br />
        INDEX
      </motion.h1>

      <motion.p variants={fade} className="term-lg mt-7 max-w-md text-muted">
        The noise of AI is deafening. Real deployment is quiet. Which one are
        you?
      </motion.p>

      {/* The roster pops in one fighter at a time. */}
      <motion.div
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        className="mt-7 flex flex-wrap items-end justify-center gap-5"
      >
        {ARCHETYPE_ORDER.map((key) => {
          const a = ARCHETYPES[key];
          return (
            <motion.div key={key} variants={pop} className="flex flex-col items-center gap-2">
              <PixelSprite
                map={SPRITES[key]}
                accent={a.palette.accent}
                dark={a.palette.c1}
                px={4}
                idle
              />
              <span className="hud text-[0.5rem]" style={{ color: a.palette.accent }}>
                {a.short}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={fade} className="mt-11">
        <StartPrompt label="Press Start" onClick={onStart} />
      </motion.div>

      <motion.p variants={fade} className="hud mt-12 text-muted/60">
        60 sec · Anonymous · © 2PT
      </motion.p>
    </motion.div>
  );
}
