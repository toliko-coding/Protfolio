"use client";

import { useEffect, useState } from "react";

// Latin letters/digits, not the full-width katakana Matrix code rain
// actually uses — those render through a CJK fallback font at roughly
// double the width of the Latin prose they'd replace, so even drawn as an
// overlay (see below) they'd visibly smear across their neighbors.
const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const STEP_MS = 45;
const DURATION_MS = 900;
const TOTAL_STEPS = Math.ceil(DURATION_MS / STEP_MS);
const MIN_DELAY_MS = 4000;
const MAX_DELAY_MS = 9000;

function randomChar(): string {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

// Assigns each character a step (0..TOTAL_STEPS) at which it locks in to its
// real value — staggered left to right, like the rest of the string is
// still decoding, so it reads as a sweep rather than one big flicker.
function buildLockSteps(length: number): number[] {
  return Array.from({ length }, (_, i) => {
    const base = (i / Math.max(length - 1, 1)) * TOTAL_STEPS * 0.7;
    return Math.round(base + Math.random() * TOTAL_STEPS * 0.3);
  });
}

// Periodically "decodes" its own text — Matrix-style: characters cycle
// through random glyphs and lock in left to right — as a small flourish for
// the Explorer's flavor text. Respects prefers-reduced-motion by never
// animating at all.
export function GlitchText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const [decoding, setDecoding] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const scheduleNext = () => {
      const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
      timeoutId = setTimeout(runDecode, delay);
    };

    const runDecode = () => {
      if (cancelled) return;
      setDecoding(true);
      const lockSteps = buildLockSteps(text.length);
      let step = 0;

      intervalId = setInterval(() => {
        step += 1;
        if (step >= TOTAL_STEPS) {
          clearInterval(intervalId);
          setDisplay(text);
          setDecoding(false);
          scheduleNext();
          return;
        }
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return ch;
              return step >= lockSteps[i] ? ch : randomChar();
            })
            .join(""),
        );
      }, STEP_MS);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [text]);

  if (!decoding) return <span className={className}>{text}</span>;

  // Swapping the visible characters themselves reflowed the text: in a
  // proportional font a random glyph is rarely as wide as the letter it
  // replaces, so a line could gain or lose a wrap mid-animation and shove
  // everything below it up or down (reported as the root page "jumping").
  // Instead every real character stays in the flow — made transparent while
  // it's scrambled — and the random glyph is drawn over it, out of flow.
  // Line boxes are then built from exactly the same characters as the
  // resting text, so nothing can move. The real text also stays what
  // assistive tech reads; the glyphs are aria-hidden.
  return (
    <span className={`${className ?? ""} matrix-decode`}>
      {text.split("").map((ch, i) =>
        display[i] === ch ? (
          ch
        ) : (
          <span key={i} className="relative">
            <span className="text-transparent [text-shadow:none]">{ch}</span>
            <span aria-hidden="true" className="absolute inset-0 flex justify-center">
              {display[i]}
            </span>
          </span>
        ),
      )}
    </span>
  );
}
