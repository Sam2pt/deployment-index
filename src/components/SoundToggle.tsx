"use client";

import { useEffect, useState } from "react";
import { isSoundOn, setSoundOn } from "@/lib/sfx";

// Small pixel speaker toggle. Sound is off by default; this invites it on.
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isSoundOn());
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    setSoundOn(next); // plays a confirmation blip when turning on
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Sound on" : "Sound off"}
      className="hud pixel-btn-ghost fixed right-4 top-4 z-50 px-3 py-2 normal-case"
    >
      {on ? "♪ SOUND ON" : "♪ SOUND OFF"}
    </button>
  );
}
