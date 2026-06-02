"use client";

// Asset-free chiptune SFX via the Web Audio API. No audio files: every sound
// is synthesized from oscillators, so there's nothing to download. Sound is
// OFF by default (PRD §14) and the preference persists in localStorage.

let ctx: AudioContext | null = null;
let enabled = false;
let loaded = false;

const KEY = "di-sound";

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  enabled = window.localStorage.getItem(KEY) === "on";
}

export function isSoundOn(): boolean {
  ensureLoaded();
  return enabled;
}

export function setSoundOn(on: boolean) {
  ensureLoaded();
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (on) {
    // Resume/create the context inside the user gesture that toggled sound on.
    getCtx();
    blip(660, 0.08, "square");
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  startGain = 0.18,
  at = 0,
) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(startGain, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur);
}

// --- public sound effects (no-ops when sound is off) ------------------------

export function sfxSelect() {
  if (!isSoundOn()) return;
  blip(520, 0.07, "square", 0.16);
}

export function sfxAdvance() {
  if (!isSoundOn()) return;
  blip(440, 0.06, "square", 0.14);
  blip(660, 0.08, "square", 0.14, 0.06);
}

export function sfxRiser() {
  if (!isSoundOn()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(880, t + 1.4);
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 1.6);
}

export function sfxUnlock() {
  if (!isSoundOn()) return;
  // Major arpeggio fanfare.
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => blip(f, 0.18, "square", 0.18, i * 0.09));
}

export function sfxCoin() {
  if (!isSoundOn()) return;
  blip(988, 0.05, "square", 0.16);
  blip(1319, 0.12, "square", 0.16, 0.05);
}

export function sfxHit() {
  if (!isSoundOn()) return;
  blip(180, 0.07, "square", 0.22);
  blip(110, 0.14, "sawtooth", 0.2, 0.03);
}

export function sfxKO() {
  if (!isSoundOn()) return;
  blip(140, 0.1, "sawtooth", 0.24);
  blip(90, 0.3, "sawtooth", 0.22, 0.08);
}

export function sfxBoot() {
  if (!isSoundOn()) return;
  // Dramatic console-boot sting: a rising run into a held high note.
  const notes = [262, 330, 392, 523, 659, 784];
  notes.forEach((f, i) => blip(f, 0.16, "square", 0.18, i * 0.07));
}

export function sfxWhoosh() {
  if (!isSoundOn()) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(160, t + 0.35);
  gain.gain.setValueAtTime(0.14, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.4);
}
