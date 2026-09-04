"use client";

import { useEffect, useState } from "react";
import { projects } from "@/content/projects";
import { toolkit } from "@/content/toolkit";
import { programming } from "@/content/programming";
import { skills } from "@/content/skills";

// A neofetch-style summary card, filling the empty space folder views with
// few entries would otherwise leave below the card grid. Projects/Languages
// are pulled from the real content, not made up.
const TOTAL_PROJECTS = projects.length + toolkit.length + programming.length;
const LANGUAGES = skills.sections.find((section) => section.heading === "Languages")
  ?.items?.slice(0, 4)
  .join(", ") ?? "—";

const SWATCH_OPACITIES = [15, 30, 45, 60, 75, 90, 100];

function formatUptime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function SystemFetch() {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptimeSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { label: "OS", value: "PortfolioOS (Next.js 16.3.4)" },
    { label: "Host", value: "Vercel Edge" },
    { label: "Kernel", value: "React 19.2.8" },
    { label: "Shell", value: "TypeScript 5" },
    { label: "Terminal", value: "Explorer + xterm-green" },
    { label: "CPU", value: "Turbopack" },
    { label: "Projects", value: String(TOTAL_PROJECTS) },
    { label: "Languages", value: LANGUAGES },
    { label: "Uptime", value: formatUptime(uptimeSeconds) },
  ];

  return (
    <div className="mt-2 flex flex-col gap-4 rounded-lg border border-foreground/10 p-4 font-mono text-xs sm:flex-row sm:items-start sm:gap-6">
      <div className="text-glow flex shrink-0 items-center justify-center px-2 text-3xl text-accent/70 sm:text-4xl">
        &gt;_
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-2 font-semibold text-accent">
          anatoli<span className="text-foreground/40">@</span>portfolio
        </p>
        <div className="mb-2 h-px w-full max-w-xs bg-foreground/10" />
        <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-2">
              <dt className="shrink-0 text-accent/60">{row.label}:</dt>
              <dd className="truncate text-foreground/75">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {SWATCH_OPACITIES.map((opacity) => (
            <span
              key={opacity}
              className="h-3 w-5 rounded-sm"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-accent) ${opacity}%, transparent)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
