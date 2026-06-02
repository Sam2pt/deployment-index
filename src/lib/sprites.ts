import type { ArchetypeKey } from "./types";

// 16×16 pixel-art characters, one per class. They share a face (eyes + mouth)
// and body, and differ by headgear. Tinted to the class colour at render.
//
// Legend:
//   .  transparent     K  outline        A  accent (outfit/hat)   D  accent shade
//   S  skin            E  eye (dark)      M  mouth (dark)          W  white

const FACE_BODY = [
  "...KSSSSSSSSK...", // forehead
  "...KSSSSSSSSK...",
  "...KSEESSEESK...", // eyes
  "...KSSSSSSSSK...",
  "...KSSMMMMSSK...", // mouth
  "....KSSSSSSK....", // chin
  ".....KSSSSK.....", // neck
  "..KAAAAAAAAAAK..", // shoulders (outfit)
  ".KAAAAAAAAAAAAK.",
  ".KSAAAAAAAAAASK.", // hands poke out
  ".KAAAAAAAAAAAAK.",
  ".KAAAAAAAAAAAAK.",
];

const HATS: Record<ArchetypeKey, string[]> = {
  // hard hat: flat top + brim
  architect: [
    "...KKKKKKKKKK...",
    "...KAAAAAAAAK...",
    "...KAAAAAAAAK...",
    "..KKKKKKKKKKKK..",
  ],
  // bold mohawk crest
  pioneer: [
    ".......KK.......",
    "......KAAK......",
    ".....KAAAAK.....",
    "...KAAAAAAAAK...",
  ],
  // rounded helmet
  operator: [
    "................",
    ".....KKKKKK.....",
    "....KAAAAAAK....",
    "...KAAAAAAAAK...",
  ],
  // antenna + signal ball
  connector: [
    ".......WW.......",
    ".......KK.......",
    "....KKAAAAKK....",
    "...KAAAAAAAAK...",
  ],
  // four-prong crown
  renaissance: [
    "...K..K..K..K...",
    "...KAAKAAKAAK...",
    "...KAAAAAAAAK...",
    "...KAAAAAAAAK...",
  ],
};

// Neutral "player" token that travels the journey track during the quiz
// (class not yet known). Tinted white at render time.
export const PLAYER = [
  "...KKKK...",
  "..KSSSSK..",
  "..KSEESK..",
  "..KSSSSK..",
  "...KKKK...",
  "..KAAAAK..",
  ".KAAAAAAK.",
  ".KAAAAAAK.",
  "..KAAAAK..",
  "..K.AA.K..",
];

// The boss: STATUS QUO. A chunky monster with glowing red eyes + jagged teeth.
// Tinted with a dark menacing body at render time.
export const BOSS = [
  "...KKKKKKKKKK...",
  "..KAAAAAAAAAAK..",
  ".KAAAAAAAAAAAAK.",
  ".KARRAAAAAARRAK.",
  ".KARRAAAAAARRAK.",
  ".KAAAAAAAAAAAAK.",
  ".KAAWKWKWKWKWAK.",
  ".KAAAAAAAAAAAAK.",
  ".KAAAAAAAAAAAAK.",
  ".KKAAAAAAAAAAKK.",
  "..KAAK..KAAK....",
  "..KKK...KKK.....",
];

export const SPRITES: Record<ArchetypeKey, string[]> = {
  architect: [...HATS.architect, ...FACE_BODY],
  pioneer: [...HATS.pioneer, ...FACE_BODY],
  operator: [...HATS.operator, ...FACE_BODY],
  connector: [...HATS.connector, ...FACE_BODY],
  renaissance: [...HATS.renaissance, ...FACE_BODY],
};
