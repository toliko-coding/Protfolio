"use client";

import { useEffect, useId, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  BrowserIcon,
  CodeIcon,
  DashboardIcon,
  GithubIcon,
  GlobeIcon,
  LockIcon,
  PulseIcon,
  SparkleIcon,
  VercelIcon,
} from "@/components/ui/icons";
import {
  fetchLatestCommit,
  fetchStatuspage,
  GITHUB_STATUS_URL,
  isClaudeCoauthored,
  SITE_REPO,
  syncState,
  timeAgo,
  VERCEL_STATUS_URL,
  type FeedStatus,
  type Health,
  type LatestCommit,
  type SyncState,
} from "@/lib/live-status";
import {
  CAPTIONS,
  EDGES,
  edgePath,
  getNode,
  hexagonPath,
  labelPosition,
  NODE_RADIUS,
  NODES,
  TOPOLOGY_SUMMARY,
  VIEWBOX,
  type EdgeKind,
  type NodeId,
  type Orientation,
  type TopologyIcon,
} from "./topology-layout";

const ICONS = {
  sparkle: SparkleIcon,
  dashboard: DashboardIcon,
  github: GithubIcon,
  vercel: VercelIcon,
  globe: GlobeIcon,
  lock: LockIcon,
  browser: BrowserIcon,
  code: CodeIcon,
  pulse: PulseIcon,
} satisfies Record<TopologyIcon, ComponentType<{ className?: string }>>;

interface NodeLive {
  health: Health;
  detail: string;
  sub?: string;
}

const CHECKING: FeedStatus = { health: "checking", description: "Checking…" };

const LED_CLASS: Record<Health, string> = {
  operational: "fill-accent animate-pulse",
  degraded: "fill-yellow-400",
  down: "fill-red-400",
  checking: "fill-foreground/30",
};

const EDGE_STYLE: Record<EdgeKind, SVGProps<SVGPathElement>> = {
  pipeline: { strokeOpacity: 0.35, strokeWidth: 1.5 },
  telemetry: { strokeOpacity: 0.45, strokeWidth: 1.5, strokeDasharray: "1 6", strokeLinecap: "round" },
  request: { strokeOpacity: 0.3, strokeWidth: 1.2, strokeDasharray: "6 5" },
};

const GLOW = { filter: "drop-shadow(0 0 6px var(--color-accent))" };
const SOFT_GLOW = {
  filter: "drop-shadow(0 0 5px color-mix(in srgb, var(--color-accent) 45%, transparent))",
};

// Viewfinder-style brackets in each corner of the canvas.
function cornerPaths(width: number, height: number, size = 18, margin = 6): string[] {
  const m = margin;
  return [
    `M ${m},${m + size} L ${m},${m} L ${m + size},${m}`,
    `M ${width - m - size},${m} L ${width - m},${m} L ${width - m},${m + size}`,
    `M ${width - m},${height - m - size} L ${width - m},${height - m} L ${width - m - size},${height - m}`,
    `M ${m + size},${height - m} L ${m},${height - m} L ${m},${height - m - size}`,
  ];
}

// Pure SVG + native SMIL animation, like FlowDiagram — once rendered it
// animates with no JS ticking. Everything that only exists to move sits in
// a .topology-motion group, which globals.css drops under
// prefers-reduced-motion (SMIL doesn't honor that preference on its own).
function TopologyGraph({
  orientation,
  live,
  className,
}: {
  orientation: Orientation;
  live: Partial<Record<NodeId, NodeLive>>;
  className: string;
}) {
  // Both layouts are in the DOM at once (CSS picks one), so every
  // gradient/pattern id needs its own prefix rather than colliding.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { width, height } = VIEWBOX[orientation];
  const r = NODE_RADIUS[orientation];
  const wide = orientation === "wide";

  const chain = NODES.filter((node) => node.primary);
  const first = chain[0].at[orientation];
  const last = chain[chain.length - 1].at[orientation];
  const lanePath = `M ${first.x},${first.y} L ${last.x},${last.y}`;
  const browser = getNode("browser").at[orientation];
  const sweepSize = 240;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={TOPOLOGY_SUMMARY}
    >
      <defs>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--color-accent)" fillOpacity="0.14" />
        </pattern>
        <radialGradient id={`${uid}-core`}>
          <stop offset="0%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.22 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-terminal-surface)", stopOpacity: 1 }} />
        </radialGradient>
        <linearGradient id={`${uid}-sweep`} x1="0" y1="0" x2={wide ? 1 : 0} y2={wide ? 0 : 1}>
          <stop offset="0%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
          <stop offset="50%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.07 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill={`url(#${uid}-grid)`} />

      <g className="topology-motion">
        <rect
          x={wide ? -sweepSize : 0}
          y={wide ? 0 : -sweepSize}
          width={wide ? sweepSize : width}
          height={wide ? height : sweepSize}
          fill={`url(#${uid}-sweep)`}
        >
          <animate
            attributeName={wide ? "x" : "y"}
            from={-sweepSize}
            to={wide ? width : height}
            dur="7s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {cornerPaths(width, height).map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--color-accent)" strokeOpacity="0.35" strokeWidth="1.5" />
      ))}

      {CAPTIONS[orientation].map((caption) => (
        <text
          key={caption.text}
          x={caption.x}
          y={caption.y}
          textAnchor={caption.anchor}
          fontSize="10"
          letterSpacing="2"
          className="fill-accent/45 font-mono"
        >
          {caption.text}
        </text>
      ))}

      {EDGES.map((edge) => (
        <path
          key={`${edge.from}-${edge.to}`}
          d={edgePath(edge, orientation)}
          fill="none"
          stroke="var(--color-accent)"
          {...EDGE_STYLE[edge.kind]}
        />
      ))}

      <g className="topology-motion">
        {/* A bright streak sliding along each hop of the chain. pathLength
            normalizes every hop to 100 units, so one dash pattern fits all. */}
        {EDGES.filter((edge) => edge.kind === "pipeline").map((edge, i) => (
          <path
            key={`streak-${edge.from}`}
            d={edgePath(edge, orientation)}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="14 86"
            style={GLOW}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur="1.8s"
              begin={`${i * 0.25}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}

        {/* One deploy "packet" riding the whole chain, with a fading tail.
            Negative begins start every piece already in motion — a positive
            delay would park the tail at the SVG origin until it starts. */}
        {[0, 1, 2].map((i) => (
          <circle
            key={`packet-${i}`}
            r={5 - i * 1.4}
            fill="var(--color-accent)"
            opacity={1 - i * 0.3}
            style={GLOW}
          >
            <animateMotion
              path={lanePath}
              dur="6s"
              begin={`${-(2 - i) * 0.07}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {EDGES.filter((edge) => edge.kind === "telemetry").map((edge) => (
          <circle key={`telemetry-${edge.to}`} r="3" fill="var(--color-accent)" style={GLOW}>
            <animateMotion path={edgePath(edge, orientation)} dur="2.6s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* Requests go out and the response comes back along the same line. */}
        {EDGES.filter((edge) => edge.kind === "request").map((edge, i) => (
          <circle key={`request-${edge.to}`} r="3.5" fill="var(--color-accent)" style={GLOW}>
            <animateMotion
              path={edgePath(edge, orientation)}
              dur="3.2s"
              begin={`${-i * 1.07}s`}
              repeatCount="indefinite"
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              calcMode="linear"
            />
          </circle>
        ))}

        {/* "You are here" — ripples around the visitor's own node. */}
        {[0, 1.5].map((delay) => (
          <circle
            key={`ripple-${delay}`}
            cx={browser.x}
            cy={browser.y}
            r={r}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            opacity="0"
          >
            <animate attributeName="r" values={`${r};${r + 30}`} dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {NODES.map((node) => {
        const { x, y } = node.at[orientation];
        const Icon = ICONS[node.icon];
        const state = live[node.id];
        const text = labelPosition(node, orientation);
        const iconSize = r * 0.9;

        return (
          <g key={node.id} className="group">
            <title>{state ? `${node.label} — ${state.detail}` : node.label}</title>
            {node.primary && (
              <g className="topology-motion">
                <circle
                  cx={x}
                  cy={y}
                  r={r + 8}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity="0.35"
                  strokeDasharray="2 7"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur="16s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
            <path
              d={hexagonPath(x, y, r)}
              fill={`url(#${uid}-core)`}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              className={`transition-[stroke-opacity] duration-300 group-hover:[stroke-opacity:1] ${
                node.primary ? "[stroke-opacity:0.75]" : "[stroke-opacity:0.4]"
              }`}
              style={node.primary ? SOFT_GLOW : undefined}
            />
            <svg x={x - iconSize / 2} y={y - iconSize / 2} width={iconSize} height={iconSize} viewBox="0 0 24 24">
              <Icon className={node.primary ? "text-accent" : "text-accent/70"} />
            </svg>
            {state && (
              // Sits on the hexagon's upper-right vertex.
              <circle
                cx={x + r * 0.5}
                cy={y - r * 0.866}
                r="4.5"
                strokeWidth="2"
                className={`stroke-terminal-surface ${LED_CLASS[state.health]}`}
              />
            )}
            <text
              x={text.x}
              y={text.labelY}
              textAnchor={text.anchor}
              fontSize="13"
              className="fill-foreground/85 font-mono"
            >
              {node.label}
            </text>
            <text
              x={text.x}
              y={text.subY}
              textAnchor={text.anchor}
              fontSize="11"
              className="fill-foreground/45 font-mono"
            >
              {state?.sub ?? node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type Tone = "accent" | "warn" | "muted";

const TONE_CLASS: Record<Tone, string> = {
  accent: "border-accent/40 text-accent",
  warn: "border-yellow-400/40 text-yellow-300",
  muted: "border-foreground/15 text-foreground/50",
};

function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`rounded border px-2 py-0.5 ${TONE_CLASS[tone]}`}>{children}</span>;
}

const SYNC_TONE: Record<SyncState, Tone> = {
  local: "muted",
  checking: "muted",
  "in-sync": "accent",
  behind: "warn",
  unknown: "muted",
};

function syncLabel(sync: SyncState, shortSha: string | undefined): string {
  switch (sync) {
    case "local":
      return "local build — not a Vercel deploy";
    case "checking":
      return `deploy ${shortSha} · checking main…`;
    case "in-sync":
      return `live · deploy ${shortSha} is the latest commit`;
    case "behind":
      return `main is ahead of deploy ${shortSha}`;
    case "unknown":
      return `deploy ${shortSha}`;
  }
}

function LegendItem({ dash, children }: { dash?: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="22" height="6" aria-hidden="true">
        <line
          x1="1"
          y1="3"
          x2="21"
          y2="3"
          stroke="var(--color-accent)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
      </svg>
      {children}
    </span>
  );
}

// The root page's map of what actually keeps this site running, lit up with
// whatever this browser can verify for itself right now: GitHub's and
// Vercel's own status feeds, and whether the commit this page was built
// from is still the head of main. Claude Code and Agent Dashboard run on the
// developer's machine, so they get no status light — nothing here can
// observe them, and a light that's always green would be claiming a check
// that never happened.
export function LiveTopology({ deployedSha }: { deployedSha?: string }) {
  const [github, setGithub] = useState<FeedStatus>(CHECKING);
  const [vercel, setVercel] = useState<FeedStatus>(CHECKING);
  const [latest, setLatest] = useState<LatestCommit | null | undefined>(undefined);
  // Captured client-side when the commit arrives, never during render — a
  // relative time computed on the server would disagree with hydration.
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetchStatuspage(GITHUB_STATUS_URL).then((status) => {
      if (active) setGithub(status);
    });
    fetchStatuspage(VERCEL_STATUS_URL).then((status) => {
      if (active) setVercel(status);
    });
    fetchLatestCommit(SITE_REPO).then((commit) => {
      if (!active) return;
      setLatest(commit);
      setFetchedAt(Date.now());
    });
    return () => {
      active = false;
    };
  }, []);

  const commitAge = latest && fetchedAt ? timeAgo(latest.date, fetchedAt) : "";
  const live: Partial<Record<NodeId, NodeLive>> = {
    github: {
      health: github.health,
      detail: github.description,
      sub: latest ? `main · ${latest.sha.slice(0, 7)}${commitAge ? ` · ${commitAge}` : ""}` : undefined,
    },
    githubApi: {
      health: latest === undefined ? "checking" : latest === null ? "degraded" : "operational",
      detail:
        latest === undefined ? "Checking…" : latest === null ? "Unavailable right now" : "Latest commit fetched",
    },
    githubStatus: { health: github.health, detail: github.description },
    vercel: { health: vercel.health, detail: vercel.description },
    edge: { health: vercel.health, detail: vercel.description },
    vercelStatus: { health: vercel.health, detail: vercel.description },
    domain: { health: "operational", detail: "Resolved and served this page" },
    browser: { health: "operational", detail: "Rendering this page" },
  };

  const sync = syncState(deployedSha, latest);
  const claudeCommit = latest ? isClaudeCoauthored(latest.message) : false;

  return (
    <section className="@container overflow-hidden rounded-lg border border-accent/20 bg-terminal-surface/60 shadow-[inset_0_0_40px_-24px_var(--color-accent)]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/15 px-4 py-2.5 font-mono text-[11px]">
        <h2 className="flex items-center gap-2 tracking-widest text-foreground/60 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          How this site runs
          <span className="rounded border border-accent/30 px-1.5 py-px text-[9px] text-accent">live</span>
        </h2>
        <span className="flex flex-wrap items-center gap-2">
          {claudeCommit && <Chip tone="accent">latest commit co-authored by Claude</Chip>}
          <Chip tone={SYNC_TONE[sync]}>{syncLabel(sync, deployedSha?.slice(0, 7))}</Chip>
        </span>
      </header>

      <TopologyGraph orientation="wide" live={live} className="hidden @2xl:block" />
      <TopologyGraph orientation="tall" live={live} className="mx-auto block max-w-sm @2xl:hidden" />

      <footer className="flex flex-wrap gap-x-5 gap-y-1 border-t border-accent/15 px-4 py-2 font-mono text-[10px] text-foreground/45">
        <LegendItem>build &amp; deploy</LegendItem>
        <LegendItem dash="1 4">agent telemetry</LegendItem>
        <LegendItem dash="4 3">live requests from this page</LegendItem>
      </footer>
    </section>
  );
}
