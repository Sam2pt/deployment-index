"use client";

// Arcade backdrop: a static dark field with per-archetype colour glows and a
// faint pixel grid, plus a static CRT scanline + vignette overlay on top.
// Palette is driven by CSS custom properties (--c1/--c2) on a parent, so it
// tweens (one-shot, stepped) when the active archetype theme changes. No blur
// filters, no per-frame repaint.
export default function Background() {
  return (
    <>
      <div className="arcade-bg" />
      <div className="crt" />
    </>
  );
}
