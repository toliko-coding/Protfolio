"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronIcon, RefreshIcon } from "@/components/ui/icons";

type Health = "operational" | "degraded" | "down" | "checking";

interface StatusRow {
  label: string;
  health: Health;
  detail: string;
}

const dotColor: Record<Health, string> = {
  operational: "bg-accent",
  degraded: "bg-yellow-400",
  down: "bg-red-400",
  checking: "bg-foreground/30",
};

const CHECKING: StatusRow = {
  label: "GitHub API",
  health: "checking",
  detail: "Checking…",
};

// Statuspage's v2 summary endpoint is meant for public, unauthenticated
// embeds like this one — it's the same feed githubstatus.com's own badge uses.
// Returns null on abort (effect cleanup, fast navigation) so the caller can
// leave the previous state alone instead of flashing a false "down" status.
async function checkGithubStatus(signal: AbortSignal): Promise<StatusRow | null> {
  try {
    const res = await fetch("https://www.githubstatus.com/api/v2/status.json", {
      signal,
    });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    const indicator = data?.status?.indicator as string | undefined;
    const description =
      (data?.status?.description as string | undefined) ?? "Reachable";
    const health: Health =
      indicator === "none" || indicator === undefined
        ? "operational"
        : indicator === "minor"
          ? "degraded"
          : "down";
    return { label: "GitHub API", health, detail: description };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    return { label: "GitHub API", health: "down", detail: "Unreachable" };
  }
}

const staticRows: StatusRow[] = [
  { label: "Portfolio", health: "operational", detail: "You're looking at it" },
  { label: "Terminal", health: "operational", detail: "Ready" },
  { label: "Explorer", health: "operational", detail: "Ready" },
];

export function StatusWidget() {
  const [open, setOpen] = useState(false);
  const [github, setGithub] = useState<StatusRow>(CHECKING);

  const runCheck = useCallback(() => {
    const controller = new AbortController();
    checkGithubStatus(controller.signal).then((result) => {
      if (result) setGithub(result);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => runCheck(), [runCheck]);

  const refresh = () => {
    setGithub(CHECKING);
    runCheck();
  };

  const rows = [github, ...staticRows];
  const overall: Health = rows.some((row) => row.health === "down")
    ? "down"
    : rows.some((row) => row.health === "degraded")
      ? "degraded"
      : rows.some((row) => row.health === "checking")
        ? "checking"
        : "operational";
  const overallLabel =
    overall === "operational"
      ? "All systems operational"
      : overall === "checking"
        ? "Checking systems…"
        : overall === "degraded"
          ? "Degraded performance"
          : "Systems disrupted";

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 font-mono">
      {open && (
        <div className="w-72 rounded border border-accent/30 bg-terminal-surface p-3 text-xs shadow-[0_0_16px_-4px_var(--color-accent)]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] tracking-wide text-foreground/50 uppercase">
              System Status
            </span>
            <button
              type="button"
              onClick={refresh}
              aria-label="Refresh status"
              className="rounded p-0.5 text-foreground/40 hover:text-accent"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex shrink-0 items-center gap-2 text-foreground/80">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[row.health]} ${
                      row.health === "operational" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="whitespace-nowrap">{row.label}</span>
                </span>
                <span className="truncate text-right text-[10px] text-foreground/50">
                  {row.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded border border-accent/30 bg-terminal-surface px-3 py-1.5 text-xs text-foreground/70 shadow-[0_0_16px_-4px_var(--color-accent)] hover:border-accent/70 hover:text-accent"
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[overall]} ${
            overall === "operational" ? "animate-pulse" : ""
          }`}
        />
        {overallLabel}
        <ChevronIcon
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
