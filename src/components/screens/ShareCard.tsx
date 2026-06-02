"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ARCHETYPES } from "@/lib/archetypes";
import { INDUSTRIES } from "@/lib/questions";
import { gradeFor, rankLabel } from "@/lib/scoring";
import { SPRITES } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import type { Result } from "@/lib/types";
import { PixelButton, PixelLink } from "./_shared";

const SITE = "deploymentindex.2pt.ai";

export default function ShareCard({
  result,
  onBack,
  onRestart,
}: {
  result: Result;
  onBack: () => void;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const a = ARCHETYPES[result.archetype];
  const grade = gradeFor(result.percentile);
  const industryLabel =
    INDUSTRIES.find((i) => i.id === result.industry)?.label ?? "";

  const shareText = `I just played 2PT's Deployment Index. Class unlocked: ${a.short}. Rank ${grade}, ${rankLabel(result).toLowerCase()} in ${industryLabel}. What's your class? ${SITE}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    `https://${SITE}`,
  )}`;

  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <p className="hud mb-5 text-accent">▸ Share your score</p>

      {/* Square (1080×1080) score card preview. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pixel-box relative aspect-square w-full overflow-hidden p-6 text-left"
        style={{ background: "var(--panel)" }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 60% at 12% 108%, var(--c1), transparent 55%), radial-gradient(70% 60% at 108% -8%, var(--c2), transparent 55%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="hud text-foreground">Class unlocked</span>
            <span
              className="font-pixel border-2 px-2 py-1 text-sm"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              {grade}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <PixelSprite
              map={SPRITES[result.archetype]}
              accent={a.palette.accent}
              dark={a.palette.c1}
              px={5}
              idle
            />
            <p className="font-pixel glitch-text text-[clamp(1.1rem,6vw,1.75rem)] uppercase leading-[1.4] text-foreground">
              {a.name}
            </p>
          </div>
          <div>
            <p className="term-lg" style={{ color: "var(--accent)" }}>
              {rankLabel(result)}
              {industryLabel ? ` · ${industryLabel}` : ""}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="hud text-muted">Deployment Index · 2pt</span>
              <span className="hud text-muted">{SITE}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-7 flex w-full flex-col gap-3">
        <PixelLink href={linkedInUrl}>▶ Share on LinkedIn</PixelLink>
        <PixelButton variant="ghost" onClick={copy}>
          {copied ? "Copied!" : "Copy Score Text"}
        </PixelButton>
        <div className="mt-1 flex items-center justify-center gap-6">
          <button
            onClick={onBack}
            className="hud normal-case text-muted transition hover:text-foreground"
          >
            ← Ranking
          </button>
          <button
            onClick={onRestart}
            className="hud normal-case text-muted transition hover:text-foreground"
          >
            ↻ Play again
          </button>
        </div>
      </div>
    </div>
  );
}
