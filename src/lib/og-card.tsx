/* eslint-disable @next/next/no-img-element */
import type { ReactElement } from "react";
import { ARCHETYPES } from "./archetypes";
import { SPRITES, PLAYER } from "./sprites";
import type { ArchetypeKey } from "./types";

// Shared 1200x630 Open Graph card, rendered by next/og's ImageResponse.
// Satori (the renderer behind ImageResponse) only understands inline styles,
// flexbox, and a subset of CSS. Rules we follow here:
//   - any element with >1 child sets display:flex
//   - no Tailwind / classNames; spacing via margins
//   - colours are hex literals; gradients via backgroundImage
//   - all visible glyphs live in a loaded font (no stray ▸ / · that would
//     trigger a runtime fallback-font fetch)

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0a0618";
const INK = "#f4f4f5";
const MUTED = "#b3aee0";
const SKIN = "#f4c89a";
const DARK = "#0b0a14";
const BRAND = "#19e68c";

function cellColor(ch: string, accent: string, shade: string): string {
  switch (ch) {
    case "K":
      return DARK; // outline
    case "S":
      return SKIN; // skin
    case "E":
    case "M":
      return "#100f1c"; // eyes / mouth
    case "A":
      return accent; // outfit / hat
    case "D":
      return shade; // accent shade
    case "W":
      return "#ffffff";
    default:
      return "transparent"; // '.'
  }
}

function Sprite({
  map,
  accent,
  shade,
  px,
}: {
  map: string[];
  accent: string;
  shade: string;
  px: number;
}): ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {map.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {Array.from(row).map((ch, x) => (
            <div
              key={x}
              style={{
                width: px,
                height: px,
                backgroundColor: cellColor(ch, accent, shade),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  c1: string;
  c2: string;
  sprite: string[];
  spritePx: number;
  pixel: string;
  sans: string;
}

function Card(props: CardProps): ReactElement {
  const { eyebrow, title, subtitle, accent, c1, c2, sprite, spritePx, pixel, sans } =
    props;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: BG,
        color: INK,
        fontFamily: sans,
      }}
    >
      {/* colour wash from the class palette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(60% 70% at 8% 112%, ${c1}, transparent 60%), radial-gradient(60% 70% at 112% -12%, ${c2}, transparent 60%)`,
          opacity: 0.55,
        }}
      />
      {/* hard pixel frame */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          border: `6px solid ${accent}`,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          padding: "0 88px",
        }}
      >
        {/* sprite */}
        <div
          style={{
            display: "flex",
            flexShrink: 0,
            marginRight: 60,
          }}
        >
          <Sprite map={sprite} accent={accent} shade={c1} px={spritePx} />
        </div>

        {/* text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 600,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: pixel,
              fontSize: 21,
              letterSpacing: 2,
              color: accent,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: title.length > 15 ? 60 : 76,
              fontWeight: 700,
              lineHeight: 1.04,
              color: INK,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 29,
              lineHeight: 1.35,
              color: MUTED,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 38,
              fontFamily: pixel,
              fontSize: 15,
              letterSpacing: 1,
              color: INK,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: accent, marginRight: 22 }}>
              Deployment Index
            </span>
            <span>2pt.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Per-class share card ("CLASS UNLOCKED: THE ARCHITECT").
export function classCard(key: ArchetypeKey, f: {
  pixel: string;
  sans: string;
}): ReactElement {
  const a = ARCHETYPES[key];
  return (
    <Card
      eyebrow="Class unlocked"
      title={a.name}
      subtitle={a.tagline}
      accent={a.palette.accent}
      c1={a.palette.c1}
      c2={a.palette.c2}
      sprite={SPRITES[key]}
      spritePx={20}
      pixel={f.pixel}
      sans={f.sans}
    />
  );
}

// Default homepage card.
export function defaultCard(f: { pixel: string; sans: string }): ReactElement {
  return (
    <Card
      eyebrow="The Deployment Index"
      title="Which AI marketing leader are you?"
      subtitle="Take on the noise of AI. 5 classes, 1 industry ranking, 60 seconds."
      accent={BRAND}
      c1="#2E5BFF"
      c2="#14E0C8"
      sprite={PLAYER}
      spritePx={28}
      pixel={f.pixel}
      sans={f.sans}
    />
  );
}
