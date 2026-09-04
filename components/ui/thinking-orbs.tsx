"use client";

// Thinking Orbs — an animated thinking/agent orb.
//
// The published package doesn't ship a "use client" directive in its build
// output, so this re-export carries it instead — otherwise importing
// ThinkingOrb into a Server Component (like Header) would fail, since its
// internal useState/useEffect/useRef can't run outside a Client Component.
//
// Nine hand-tuned canvas animations, each a distinct state:
//   working · searching · solving · listening · connecting · weaving ·
//   composing · breathing · shaping
// Two tuned size presets ship: 64 (chat-avatar scale) and 20 (inline-text
// scale) — each carries its own dot count / dot size / speed tuning.
//
// Theme-aware: `theme="auto"` (default) resolves from a `data-theme` / `dark`
// class on any ancestor, else `prefers-color-scheme`, live-updating on change;
// `dark` / `light` pin the palette. SSR-safe — the canvas is client-only.
//
// Source & playground: https://orbs.jakubantalik.com
import { ThinkingOrb } from "thinking-orbs";

export { ThinkingOrb } from "thinking-orbs";
export type {
  ThinkingOrbProps,
  OrbState,
  OrbSize,
  OrbTheme,
} from "thinking-orbs";

export default ThinkingOrb;
