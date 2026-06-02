"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sfxBoot, sfxWhoosh, sfxKO } from "@/lib/sfx";
import ParticleBurst from "@/components/ParticleBurst";

// Sega-Mega-Drive-style boot. The first beat — a CRT power-on into the "2PT
// ARCADE SYSTEM" logo — is CSS-driven (`.boot-on`), so it paints on first
// frame without waiting for JS. Then a slamming "WELCOME TO THE ARENA" with
// flash + particle burst. Auto-advances; tap anywhere to skip.
const SPLASH = 1900;
const WELCOME = 2000;

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0 = logo splash, 1 = welcome

  useEffect(() => {
    sfxBoot();
    const t1 = window.setTimeout(() => {
      setPhase(1);
      sfxWhoosh();
      sfxKO();
    }, SPLASH);
    const t2 = window.setTimeout(onDone, SPLASH + WELCOME);
    return () => [t1, t2].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden"
      onClick={onDone}
      role="button"
      aria-label="Skip intro"
    >
      {/* Blinding flash on the welcome slam. */}
      {phase === 1 && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}

      {phase === 0 && (
        // CSS power-on + logo — visible on first paint, pre-hydration.
        <div className="boot-on text-center">
          <p className="font-pixel glitch-text accent-glow text-[clamp(2.8rem,13vw,5.5rem)] text-foreground">
            2PT
          </p>
          <p className="hud mt-5">Arcade System</p>
        </div>
      )}

      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 1.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
            className="relative flex items-center justify-center text-center"
          >
            <ParticleBurst color="var(--accent)" />
            <div className="relative z-10">
              <motion.p
                className="hud mb-4"
                style={{ color: "var(--accent)" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                ★ Now entering ★
              </motion.p>
              <p className="font-pixel glitch-text text-[clamp(1.5rem,8vw,3.5rem)] leading-[1.45] text-foreground">
                WELCOME
                <br />
                TO THE
                <br />
                <span className="accent-glow" style={{ color: "var(--accent)" }}>
                  ARENA
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="hud absolute bottom-8 opacity-50">tap to skip</p>
    </div>
  );
}
