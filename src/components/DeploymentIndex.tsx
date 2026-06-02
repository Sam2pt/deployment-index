"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence } from "motion/react";

import { ARCHETYPES } from "@/lib/archetypes";
import { computeResult } from "@/lib/scoring";
import type { QuizResponse, Result } from "@/lib/types";

import Background from "@/components/Background";
import SoundToggle from "@/components/SoundToggle";
import BootScreen from "@/components/screens/BootScreen";
import Landing from "@/components/screens/Landing";
import PlayerSetup from "@/components/screens/PlayerSetup";
import Questions from "@/components/screens/Questions";
import Calculating from "@/components/screens/Calculating";
import ArchetypeReveal from "@/components/screens/ArchetypeReveal";
import RankingReveal from "@/components/screens/RankingReveal";
import EmailCapture from "@/components/screens/EmailCapture";
import ShareCard from "@/components/screens/ShareCard";

type Stage =
  | "boot"
  | "landing"
  | "setup"
  | "questions"
  | "calculating"
  | "archetype"
  | "ranking"
  | "email"
  | "share";

// Stages that should wear the archetype's colour world rather than the brand.
const THEMED: Stage[] = ["archetype", "ranking", "email", "share"];

export default function DeploymentIndex() {
  const [stage, setStage] = useState<Stage>("boot");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [industry, setIndustry] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // Press Start → collect name + role, then fight.
  const start = useCallback(() => {
    setAnswers({});
    setIndustry("");
    setResult(null);
    setName("");
    setRole("");
    setStage("setup");
  }, []);

  const completeSetup = useCallback((playerName: string, playerRole: string) => {
    setName(playerName);
    setRole(playerRole);
    setStage("questions");
  }, []);

  const restart = useCallback(() => {
    setAnswers({});
    setIndustry("");
    setResult(null);
    setName("");
    setRole("");
    setStage("landing");
  }, []);

  const finishQuestions = useCallback(
    (finalAnswers: Record<number, string>, finalIndustry: string) => {
      const response: QuizResponse = {
        answers: finalAnswers,
        industry: finalIndustry,
      };
      setAnswers(finalAnswers);
      setIndustry(finalIndustry);
      setResult(computeResult(response));
      setStage("calculating");
    },
    [],
  );

  // Active palette: brand by default, archetype world once revealed.
  const themeStyle = useMemo<CSSProperties>(() => {
    if (result && THEMED.includes(stage)) {
      const p = ARCHETYPES[result.archetype].palette;
      return {
        ["--c1" as string]: p.c1,
        ["--c2" as string]: p.c2,
        ["--c3" as string]: p.c3,
        ["--accent" as string]: p.accent,
      };
    }
    return {};
  }, [result, stage]);

  const content = useMemo(() => {
    switch (stage) {
      case "boot":
        return <BootScreen key="boot" onDone={() => setStage("landing")} />;
      case "landing":
        return <Landing key="landing" onStart={start} />;
      case "setup":
        return (
          <PlayerSetup
            key="setup"
            initialName={name}
            initialRole={role}
            onComplete={completeSetup}
          />
        );
      case "questions":
        return (
          <Questions
            key="questions"
            playerName={name}
            initialAnswers={answers}
            initialIndustry={industry}
            onComplete={finishQuestions}
          />
        );
      case "calculating":
        return (
          <Calculating key="calculating" onDone={() => setStage("archetype")} />
        );
      case "archetype":
        return result ? (
          <ArchetypeReveal
            key="archetype"
            result={result}
            name={name}
            onContinue={() => setStage("ranking")}
          />
        ) : null;
      case "ranking":
        return result ? (
          <RankingReveal
            key="ranking"
            result={result}
            name={name}
            onEmail={() => setStage("email")}
            onShare={() => setStage("share")}
          />
        ) : null;
      case "email":
        return result ? (
          <EmailCapture
            key="email"
            result={result}
            name={name}
            role={role}
            onShare={() => setStage("share")}
          />
        ) : null;
      case "share":
        return result ? (
          <ShareCard
            key="share"
            result={result}
            onBack={() => setStage("ranking")}
            onRestart={restart}
          />
        ) : null;
      default:
        return null;
    }
  }, [stage, start, completeSetup, restart, answers, industry, finishQuestions, result, name, role]);

  return (
    <div className="relative min-h-[100dvh] w-full" style={themeStyle}>
      <Background />
      <SoundToggle />
      <main className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 py-12">
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </main>
    </div>
  );
}
