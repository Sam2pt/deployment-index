"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

// Stage transition — quick, slightly mechanical (fits the arcade tone).
export const screenMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: EASE },
};

export function Screen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      {...screenMotion}
      className={`flex w-full max-w-xl flex-col items-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Chunky pixel CTA.
export function PixelButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${
        variant === "solid" ? "pixel-btn" : "pixel-btn-ghost"
      } w-full px-6 py-4 uppercase disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

// Link-styled pixel button (for external share links).
export function PixelLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-btn block w-full px-6 py-4 text-center uppercase"
    >
      {children}
    </a>
  );
}

// A blinking "▶ PRESS START"-style prompt.
export function StartPrompt({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="font-pixel accent-glow blink text-sm uppercase tracking-wider"
    >
      ▶ {label}
    </button>
  );
}
