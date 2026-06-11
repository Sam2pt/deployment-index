import { ImageResponse } from "next/og";
import { ARCHETYPES, ARCHETYPE_ORDER } from "@/lib/archetypes";
import { classCard, defaultCard } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-font";
import type { ArchetypeKey } from "@/lib/types";

export const alt = "Your Deployment Index class";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ARCHETYPE_ORDER.map((key) => ({ class: key }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ class: string }>;
}) {
  const { class: raw } = await params;
  const key = raw as ArchetypeKey;
  const f = await loadOgFonts();
  const card = key in ARCHETYPES ? classCard(key, f) : defaultCard(f);
  return new ImageResponse(card, { ...size, fonts: f.fonts });
}
