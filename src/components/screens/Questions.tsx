"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { INDUSTRIES, QUESTIONS } from "@/lib/questions";
import type { AnswerOption } from "@/lib/types";
import { sfxSelect } from "@/lib/sfx";
import BattleStage from "@/components/BattleStage";
import { EASE } from "./_shared";

function tap() {
  sfxSelect();
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
}

const AUTO_ADVANCE_MS = 720; // let the player finish the jump before advancing

export default function Questions({
  playerName,
  initialAnswers,
  initialIndustry,
  onComplete,
}: {
  playerName: string;
  initialAnswers: Record<number, string>;
  initialIndustry: string;
  onComplete: (answers: Record<number, string>, industry: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [pending, setPending] = useState<string | null>(null);
  // Synchronous lock: `pending` is async state, so two click events fired in
  // the same tick would both pass a state-based guard and double-advance. A
  // ref flips immediately and blocks the second event.
  const locked = useRef(false);

  const isIndustry = step === QUESTIONS.length;

  function pickAnswer(questionNumber: number, optionId: string) {
    if (locked.current) return;
    locked.current = true;
    tap();
    setPending(optionId);
    const next = { ...answers, [questionNumber]: optionId };
    setAnswers(next);
    window.setTimeout(() => {
      setPending(null);
      locked.current = false;
      setStep((s) => s + 1);
    }, AUTO_ADVANCE_MS);
  }

  function pickIndustry(industryId: string) {
    if (locked.current) return;
    locked.current = true;
    tap();
    setPending(industryId);
    window.setTimeout(() => onComplete(answers, industryId), AUTO_ADVANCE_MS);
  }

  return (
    <div className="flex w-full max-w-xl flex-col">
      <AnimatePresence mode="wait">
        {!isIndustry ? (
          <QuestionView
            key={`q-${step}`}
            round={step + 1}
            playerName={playerName}
            number={QUESTIONS[step].number}
            prompt={QUESTIONS[step].prompt}
            options={QUESTIONS[step].options}
            onPick={pickAnswer}
          />
        ) : (
          <IndustryView
            key="industry"
            initial={initialIndustry}
            pending={pending}
            onPick={pickIndustry}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const viewMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: EASE },
};

function QuestionView({
  round,
  playerName,
  number,
  prompt,
  options,
  onPick,
}: {
  round: number;
  playerName: string;
  number: number;
  prompt: string;
  options: AnswerOption[];
  onPick: (questionNumber: number, optionId: string) => void;
}) {
  return (
    <motion.div {...viewMotion} className="w-full">
      <BattleStage
        round={round}
        playerName={playerName}
        prompt={prompt}
        options={options}
        onPick={(id) => onPick(number, id)}
      />
    </motion.div>
  );
}

function IndustryView({
  initial,
  pending,
  onPick,
}: {
  initial: string;
  pending: string | null;
  onPick: (industryId: string) => void;
}) {
  return (
    <motion.div {...viewMotion} className="w-full">
      <div className="pixel-box mb-6 px-5 py-5">
        <p className="hud mb-2 text-accent">▸ Stage select</p>
        <p className="term-lg text-foreground">Choose your home arena.</p>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.03 } } }}
      >
        {INDUSTRIES.map((ind) => {
          const selected = pending === ind.id || (!pending && initial === ind.id);
          return (
            <motion.button
              key={ind.id}
              variants={{
                hidden: { opacity: 0, scale: 0.92 },
                show: { opacity: 1, scale: 1 },
              }}
              onClick={() => onPick(ind.id)}
              className={`font-term border-2 px-3 py-3 text-center text-lg leading-none ${
                pending === ind.id ? "blink" : ""
              }`}
              style={{
                background: selected ? "var(--accent)" : "var(--panel)",
                borderColor: selected ? "var(--accent)" : "var(--border)",
                color: selected ? "var(--accent-ink)" : "var(--foreground)",
              }}
            >
              {ind.label}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
