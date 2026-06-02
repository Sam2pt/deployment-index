// Core domain types for The Deployment Index.

export type ArchetypeKey =
  | "architect"
  | "pioneer"
  | "operator"
  | "connector"
  | "bandit";

export interface Archetype {
  key: ArchetypeKey;
  /** Display index, e.g. "01" */
  index: string;
  /** Full name, e.g. "The Architect" */
  name: string;
  /** Short noun used in reveal headline, e.g. "Architect" (for "You're an Architect") */
  short: string;
  /** One-line tagline shown as beat 2 of the reveal */
  tagline: string;
  /** Flattering paragraph (beat 3) */
  paragraph: string;
  /** Three "next moves" leaders like this make */
  nextMoves: string[];
  /** Recommended 2PT service path */
  servicePath: string;
  /** Inclusive percentile range this archetype lands in (v1 static curve) */
  percentile: { min: number; max: number };
  /** Signature colour world: three gradient stops + a readable accent. */
  palette: {
    c1: string;
    c2: string;
    c3: string;
    accent: string;
  };
  /** RPG-style stat block shown on the class-reveal screen (values 0–100). */
  stats: { label: string; value: number }[];
}

export interface AnswerOption {
  /** a–e */
  id: string;
  /** Full answer text (used in data/analysis). */
  label: string;
  /** Short, punchy platform label shown in the game (2–3 words). */
  tag: string;
  /** Archetype this option awards a point to */
  archetype: ArchetypeKey;
}

export interface Question {
  /** 1-based question number */
  number: number;
  prompt: string;
  options: AnswerOption[];
}

export interface Industry {
  id: string;
  label: string;
}

/** A completed run, ready for scoring + (later) persistence. */
export interface QuizResponse {
  /** answers[questionNumber] = selected option id (a–e) */
  answers: Record<number, string>;
  industry: string;
}

export interface Result {
  archetype: ArchetypeKey;
  /** 0–100, the user's placement within their industry */
  percentile: number;
  /** Convenience: 100 - percentile, e.g. "top 14%" */
  topPercent: number;
  industry: string;
  /** Second-place archetype, for the "you were X pts away" hook (null if none). */
  runnerUp: ArchetypeKey | null;
  /** Point gap between the winner and the runner-up. */
  margin: number;
}
