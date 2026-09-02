"use client";

import { useEffect, useState } from "react";

const CHAR_DELAY = 45;

interface TypewriterHeadingProps {
  text: string;
  className?: string;
}

// Callers should pass `key={text}` so navigating to a different title forces
// a fresh mount — that's what gives a clean type-up each time instead of a
// flash of the previous title before retyping.
export function TypewriterHeading({ text, className }: TypewriterHeadingProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let i = 0;

    const step = () => {
      if (cancelled) return;
      i++;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timeoutId = setTimeout(step, CHAR_DELAY);
      }
    };
    timeoutId = setTimeout(step, CHAR_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <h1 className={className}>
      <span aria-hidden="true">
        {typed}
        <span className="animate-blink ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-accent align-middle" />
      </span>
      <span className="sr-only">{text}</span>
    </h1>
  );
}
