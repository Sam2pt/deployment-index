import { readFile } from "node:fs/promises";
import { join } from "node:path";

type Weight = 400 | 700;
type FontEntry = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: Weight;
};

export interface OgFonts {
  fonts: FontEntry[];
  /** Pixel face for arcade chrome (eyebrow, footer). */
  pixel: string;
  /** Readable sans for the title and tagline. */
  sans: string;
}

async function read(file: string): Promise<ArrayBuffer> {
  const data = await readFile(join(process.cwd(), "assets", file));
  return Uint8Array.from(data).buffer;
}

// Load the OG card fonts. If any file can't be read we degrade gracefully:
// missing fonts just fall back to whatever did load (or Satori's default),
// so the image still renders instead of throwing a 500. A plain card beats a
// broken one.
export async function loadOgFonts(): Promise<OgFonts> {
  const fonts: FontEntry[] = [];
  let pixel = "sans-serif";
  let sans = "sans-serif";

  try {
    fonts.push({
      name: "Press Start 2P",
      data: await read("PressStart2P-Regular.ttf"),
      style: "normal",
      weight: 400,
    });
    pixel = "Press Start 2P";
  } catch {
    /* fall back to sans for chrome */
  }

  try {
    fonts.push(
      {
        name: "Poppins",
        data: await read("Poppins-Regular.ttf"),
        style: "normal",
        weight: 400,
      },
      {
        name: "Poppins",
        data: await read("Poppins-Bold.ttf"),
        style: "normal",
        weight: 700,
      },
    );
    sans = "Poppins";
    if (pixel === "sans-serif") pixel = "Poppins";
  } catch {
    /* fall back: title/body use the pixel font or Satori default */
    if (sans === "sans-serif" && pixel !== "sans-serif") sans = pixel;
  }

  return { fonts, pixel, sans };
}
