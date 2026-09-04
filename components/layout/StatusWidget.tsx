"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronIcon, RefreshIcon } from "@/components/ui/icons";

// How far above its own bottom-12 offset this widget's box actually
// reaches, published as a CSS var so other fixed-height gutters (Explorer,
// the Terminal column) can reserve exactly that much space instead of a
// guessed pixel value that drifts whenever this widget's content does.
//
// Measured from a hidden clone of the PILL ONLY — never the expanded
// breakdown box (see the measuring clone below). Two things were tried and
// reverted before this:
//   1. Measuring the visible widget directly: the reserved gutter grew and
//      shrank live as the visitor opened/closed it, moving the scroll
//      boundary out from under whatever they were looking at.
//   2. Always reserving the worst case (expanded) size, even while
//      collapsed: no more shift, but now every page permanently loses
//      ~226px of content height for a box that's hidden 99% of the time,
//      which made clipping worse in the (default, most common) collapsed
//      state — reported as "still covering the page even when minimized."
// Reserving only the pill's small, constant footprint fixes both: nothing
// ever changes size (no shift), and the permanent cost is minimal. When
// expanded, the breakdown box is allowed to sit over content like any
// normal popover/dropdown — a deliberate, temporary, user-triggered
// overlap, not a passive one, which is standard and expected UI behavior.
const GUTTER_VAR = "--status-widget-space";
const BOTTOM_OFFSET_PX = 48; // matches this component's own bottom-12

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

const REPOS_CHECKING: StatusRow = {
  label: "Repos",
  health: "checking",
  detail: "Checking…",
};

// GitHub's public API can only report a public repo count for another
// user — it has no unauthenticated way to see how many are private. This
// is a manually-tracked fact (toliko-coding, checked 2026-09-04), not
// something this page can verify live — update it if that count changes.
const KNOWN_PRIVATE_REPOS = 27;

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

// Live public repo count from GitHub's own API, paired with the manually
// tracked private count above.
async function checkRepoStats(signal: AbortSignal): Promise<StatusRow | null> {
  try {
    const res = await fetch("https://api.github.com/users/toliko-coding", {
      signal,
    });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    const publicRepos = data?.public_repos as number | undefined;
    if (typeof publicRepos !== "number") throw new Error("missing public_repos");
    return {
      label: "Repos",
      health: "operational",
      detail: `${publicRepos} public, ${KNOWN_PRIVATE_REPOS} private`,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    return { label: "Repos", health: "down", detail: "Unreachable" };
  }
}

const staticRows: StatusRow[] = [
  { label: "Terminal", health: "operational", detail: "Ready" },
  { label: "Explorer", health: "operational", detail: "Ready" },
];

function Breakdown({ rows, onRefresh }: { rows: StatusRow[]; onRefresh: () => void }) {
  return (
    <div className="w-72 rounded border border-accent/30 bg-terminal-surface p-3 text-xs shadow-[0_0_16px_-4px_var(--color-accent)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] tracking-wide text-foreground/50 uppercase">
          System Status
        </span>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh status"
          className="rounded p-0.5 text-foreground/40 hover:text-accent"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-2">
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
  );
}

function Pill({
  overall,
  overallLabel,
  open,
  onToggle,
}: {
  overall: Health;
  overallLabel: string;
  open: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex items-center gap-2 rounded border border-accent/30 bg-terminal-surface px-3 py-1.5 text-xs text-foreground/70 shadow-[0_0_16px_-4px_var(--color-accent)] hover:border-accent/70 hover:text-accent"
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[overall]} ${
          overall === "operational" ? "animate-pulse" : ""
        }`}
      />
      {overallLabel}
      <ChevronIcon className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

export function StatusWidget() {
  // Collapsed by default — the pill itself already always shows "All
  // systems operational" (or whatever the live status is), so this still
  // satisfies "show it by default" without permanently reserving the full
  // breakdown box's height for something usually not open.
  const [open, setOpen] = useState(false);
  const [github, setGithub] = useState<StatusRow>(CHECKING);
  const [repos, setRepos] = useState<StatusRow>(REPOS_CHECKING);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const publish = () => {
      const space = BOTTOM_OFFSET_PX + el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(GUTTER_VAR, `${space}px`);
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const runCheck = useCallback(() => {
    const controller = new AbortController();
    checkGithubStatus(controller.signal).then((result) => {
      if (result) setGithub(result);
    });
    checkRepoStats(controller.signal).then((result) => {
      if (result) setRepos(result);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => runCheck(), [runCheck]);

  const refresh = () => {
    setGithub(CHECKING);
    setRepos(REPOS_CHECKING);
    runCheck();
  };

  const rows = [github, repos, ...staticRows];
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
    <>
      {/* Invisible pill-only clone used to measure the permanent gutter
          (see GUTTER_VAR comment above) — deliberately excludes Breakdown,
          never shown, never interactive, excluded from the a11y tree. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed right-4 bottom-12 flex flex-col items-end gap-2 font-mono"
      >
        <Pill overall={overall} overallLabel={overallLabel} open={false} />
      </div>

      <div className="fixed right-4 bottom-12 z-50 flex flex-col items-end gap-2 font-mono">
        {open && <Breakdown rows={rows} onRefresh={refresh} />}
        <Pill
          overall={overall}
          overallLabel={overallLabel}
          open={open}
          onToggle={() => setOpen((v) => !v)}
        />
      </div>
    </>
  );
}
