import { ARCHETYPES, ARCHETYPE_ORDER } from "./archetypes";
import { QUESTIONS } from "./questions";
import type { ArchetypeKey, QuizResponse, Result } from "./types";

// --- Archetype scoring (PRD §06) ---------------------------------------------
// Each question awards WEIGHTED points to the archetype named in the chosen
// answer. Weights descend (Q1 — your "default move" — is the strongest signal),
// which produces a clear winner and makes exact ties rare. Equal +1 scoring
// tied constantly and the old fallback always resolved ties to the first
// archetype (Architect) — that's the "Architect every time" bug.
const WEIGHT_FOR = (questionNumber: number): number =>
  Math.max(1, 6 - questionNumber); // Q1=5, Q2=4, Q3=3, Q4=2, Q5=1

function answerSignature(answers: Record<number, string>): string {
  return QUESTIONS.map((q) => `${q.number}:${answers[q.number] ?? "-"}`).join("|");
}

function tallyAnswers(answers: Record<number, string>): Record<ArchetypeKey, number> {
  const tally: Record<ArchetypeKey, number> = {
    architect: 0,
    pioneer: 0,
    operator: 0,
    connector: 0,
    renaissance: 0,
  };
  for (const q of QUESTIONS) {
    const choice = answers[q.number];
    const option = q.options.find((o) => o.id === choice);
    if (option) tally[option.archetype] += WEIGHT_FOR(q.number);
  }
  return tally;
}

export function scoreArchetype(answers: Record<number, string>): ArchetypeKey {
  const tally = tallyAnswers(answers);

  const max = Math.max(...ARCHETYPE_ORDER.map((k) => tally[k]));
  const leaders = ARCHETYPE_ORDER.filter((k) => tally[k] === max);
  if (leaders.length === 1) return leaders[0];

  // Tie-break: the archetype picked in Q1 (most-telling signal), if it's tied.
  const q1 = QUESTIONS[0].options.find((o) => o.id === answers[1]);
  if (q1 && leaders.includes(q1.archetype)) return q1.archetype;

  // Final fallback: deterministic but unbiased — pick among the tied leaders
  // by a hash of the answers, so it's never just "the first one" (Architect).
  return leaders[hashSignature(answerSignature(answers)) % leaders.length];
}

// Runner-up class + point gap behind the winner, for the "you were N pts from
// X" intrigue hook. Returns null when nothing else scored.
function runnerUpFor(
  answers: Record<number, string>,
  winner: ArchetypeKey,
): { runnerUp: ArchetypeKey | null; margin: number } {
  const tally = tallyAnswers(answers);
  const contenders = ARCHETYPE_ORDER.filter((k) => k !== winner).sort(
    (a, b) => tally[b] - tally[a],
  );
  const runnerUp = contenders[0] ?? null;
  if (!runnerUp || tally[runnerUp] === 0) return { runnerUp: null, margin: 0 };
  return { runnerUp, margin: tally[winner] - tally[runnerUp] };
}

// --- Ranking placement (PRD §08, v1 static curve) ----------------------------
// Every user lands inside their archetype's flattering percentile band. The
// exact spot is deterministic from archetype + industry + answer pattern, so a
// given run always reproduces the same number and "no two users get the same."

function hashSignature(sig: string): number {
  // FNV-1a, returns an unsigned 32-bit int.
  let h = 0x811c9dc5;
  for (let i = 0; i < sig.length; i++) {
    h ^= sig.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function computePercentile(
  archetype: ArchetypeKey,
  response: QuizResponse,
): number {
  const { min, max } = ARCHETYPES[archetype].percentile;
  const span = max - min; // inclusive band width

  const signature = [
    archetype,
    response.industry,
    ...QUESTIONS.map((q) => `${q.number}:${response.answers[q.number] ?? "-"}`),
  ].join("|");

  // Map the hash into [0, span] across (span + 1) discrete integer slots so the
  // band's endpoints are both reachable.
  const offset = hashSignature(signature) % (span + 1);
  return min + offset;
}

// Arcade letter grade from percentile. The floor (~65th) keeps everyone at
// B or better — flattering by design (PRD §08).
export function gradeFor(percentile: number): string {
  if (percentile >= 88) return "S";
  if (percentile >= 78) return "A";
  return "B";
}

// Headline rank label — flattering "Top X%" for every class.
export function rankLabel(result: Result): string {
  return `Top ${result.topPercent}%`;
}

export function computeResult(response: QuizResponse): Result {
  const archetype = scoreArchetype(response.answers);
  const percentile = computePercentile(archetype, response);
  const { runnerUp, margin } = runnerUpFor(response.answers, archetype);
  return {
    archetype,
    percentile,
    topPercent: 100 - percentile,
    industry: response.industry,
    runnerUp,
    margin,
  };
}
