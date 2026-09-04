"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/content/projects";
import { toolkit } from "@/content/toolkit";
import { programming } from "@/content/programming";
import { skills } from "@/content/skills";

// A neofetch-style summary, rendered as a persistent site-wide footer.
// Projects/Languages are pulled from the real content, not made up.
const TOTAL_PROJECTS = projects.length + toolkit.length + programming.length;
const LANGUAGES = skills.sections.find((section) => section.heading === "Languages")
  ?.items?.slice(0, 4)
  .join(", ") ?? "—";

const ROWS = [
  { label: "OS", value: "PortfolioOS (Next.js 16.3.4)" },
  { label: "Kernel", value: "React 19.2.8" },
  { label: "CPU", value: "Turbopack" },
  { label: "Projects", value: String(TOTAL_PROJECTS) },
  { label: "Languages", value: LANGUAGES },
];

// Published as a CSS var (see StatusWidget's matching one) so Explorer/the
// Terminal column can reserve exactly this footer's real rendered height as
// a bottom gutter, instead of a guessed pixel value.
const GUTTER_VAR = "--system-fetch-space";

// Fixed to the very bottom of every page — below the System Status widget,
// which floats above it (see its own bottom offset) rather than overlapping.
export function SystemFetch() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const publish = () => {
      document.documentElement.style.setProperty(
        GUTTER_VAR,
        `${el.getBoundingClientRect().height}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 overflow-x-auto border-t border-foreground/10 bg-terminal-surface px-4 py-2 font-mono text-xs whitespace-nowrap"
    >
      <span className="text-glow shrink-0 text-accent/70">&gt;_</span>
      <span className="shrink-0 font-semibold text-accent">
        anatoli<span className="text-foreground/40">@</span>portfolio
      </span>
      <span className="shrink-0 text-foreground/20">|</span>
      {ROWS.map((row) => (
        <span key={row.label} className="shrink-0 text-foreground/70">
          <span className="text-accent/60">{row.label}:</span> {row.value}
        </span>
      ))}
    </div>
  );
}
