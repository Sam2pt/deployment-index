import { ImageResponse } from "next/og";
import { defaultCard } from "@/lib/og-card";
import { loadOgFonts } from "@/lib/og-font";

export const alt = "The Deployment Index — which AI marketing leader are you?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { fonts, pixel, sans } = await loadOgFonts();
  return new ImageResponse(defaultCard({ pixel, sans }), { ...size, fonts });
}
