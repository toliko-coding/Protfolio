import type { ComponentType } from "react";
import {
  CloudIcon,
  CodeIcon,
  FileIcon,
  FolderIcon,
  GlobeIcon,
  LockIcon,
  PhoneIcon,
  RefreshIcon,
  ShieldIcon,
  SparkleIcon,
  TargetIcon,
} from "@/components/ui/icons";

const ICONS = {
  phone: PhoneIcon,
  sparkle: SparkleIcon,
  shield: ShieldIcon,
  target: TargetIcon,
  refresh: RefreshIcon,
  code: CodeIcon,
  globe: GlobeIcon,
  cloud: CloudIcon,
  folder: FolderIcon,
  file: FileIcon,
  lock: LockIcon,
} satisfies Record<string, ComponentType<{ className?: string }>>;

interface FlowDiagramProps {
  nodes: { icon: keyof typeof ICONS; label: string }[];
  // When set, the traveling dot passes through nodes once up to this index,
  // then cycles endlessly between this node and the end via a curved
  // return path — a literal feedback loop, for a project whose own last
  // step folds back into an earlier stage.
  loopFromIndex?: number;
  // A small, label-free preview for grid cards — same nodes and arrows, no
  // room for text or the loop detail at thumbnail size, so it always just
  // shows a single repeating pass left to right.
  compact?: boolean;
}

const VIEW_WIDTH = 640;
const TOP_Y = 46;
const LOOP_Y = 124;
const NODE_RADIUS = 20;
const MARGIN = 56;
const HOP_SECONDS = 0.9;

// Its own (much smaller) viewBox — reusing the full-size VIEW_WIDTH here
// scaled everything down by the ratio of a card's actual pixel width to
// 640, crushing an already-small 7px label font down to 2px on screen.
// Keeping compact's own coordinate space close to real card widths means
// these sizes land close to their literal pixel values once rendered.
const COMPACT_VIEW_WIDTH = 220;
const COMPACT_VIEW_HEIGHT = 44;
const COMPACT_TOP_Y = 16;
const COMPACT_NODE_RADIUS = 9;
const COMPACT_MARGIN = 18;

function straightPath(positions: number[], topY: number, from: number, to: number): string {
  return positions
    .slice(from, to + 1)
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x},${topY}`)
    .join(" ");
}

function returnArc(positions: number[], from: number): string {
  const lastX = positions[positions.length - 1];
  const targetX = positions[from];
  return `M ${lastX},${TOP_Y} C ${lastX},${LOOP_Y} ${targetX},${LOOP_Y} ${targetX},${TOP_Y}`;
}

function loopPath(positions: number[], from: number): string {
  const straight = straightPath(positions, TOP_Y, from, positions.length - 1);
  const arc = returnArc(positions, from).replace(/^M [^C]+/, "");
  return `${straight} ${arc}`;
}

// Pure SVG + native SMIL animation (<animateMotion>) — no client JS needed,
// this animates in the browser on its own once rendered.
export function FlowDiagram({ nodes, loopFromIndex, compact = false }: FlowDiagramProps) {
  const count = nodes.length;
  if (count < 2) return null;

  const topY = compact ? COMPACT_TOP_Y : TOP_Y;
  const nodeRadius = compact ? COMPACT_NODE_RADIUS : NODE_RADIUS;
  const margin = compact ? COMPACT_MARGIN : MARGIN;
  const iconSize = compact ? 10 : 18;
  const viewWidth = compact ? COMPACT_VIEW_WIDTH : VIEW_WIDTH;

  const step = (viewWidth - margin * 2) / (count - 1);
  const positions = nodes.map((_, i) => margin + step * i);
  const labelWidth = Math.min(step * 0.85, 150);
  const hasLoop =
    !compact &&
    typeof loopFromIndex === "number" &&
    loopFromIndex >= 0 &&
    loopFromIndex < count - 1;
  const viewHeight = compact ? COMPACT_VIEW_HEIGHT : hasLoop ? 160 : 96;

  // Marker ids are global to the document — several of these can render at
  // once in a project grid, so each needs its own rather than sharing
  // "flow-arrow" and silently reusing whichever instance defined it first.
  const arrowId = `flow-arrow-${nodes.map((n) => n.label).join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const introDuration = loopFromIndex! * HOP_SECONDS;

  const dotMotion = hasLoop ? (
    <>
      {/* Skipped entirely when the loop target IS the first node (a game
          loop, say) — there's nothing before it to traverse once first. */}
      {loopFromIndex! > 0 && (
        <animateMotion
          path={straightPath(positions, topY, 0, loopFromIndex!)}
          dur={`${introDuration}s`}
          begin="0s"
          fill="freeze"
        />
      )}
      {/* A fixed begin time rather than a syncbase reference to the intro
          animation's "end" event — SMIL syncbase timing between two
          animateMotion elements sharing a target is unreliable across
          browsers (the second can fail to ever take over from the first's
          frozen end state), where a plain offset equal to the intro's own
          known duration always fires on schedule. */}
      <animateMotion
        path={loopPath(positions, loopFromIndex!)}
        dur={`${(count - loopFromIndex!) * HOP_SECONDS}s`}
        begin={`${introDuration}s`}
        repeatCount="indefinite"
      />
    </>
  ) : (
    <animateMotion
      path={straightPath(positions, topY, 0, count - 1)}
      dur={`${(count - 1) * HOP_SECONDS}s`}
      repeatCount="indefinite"
    />
  );

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Diagram: ${nodes.map((n) => n.label).join(" → ")}${
        hasLoop ? ", looping back after the last step" : ""
      }`}
    >
      <defs>
        <marker
          id={arrowId}
          markerWidth={compact ? 5 : 8}
          markerHeight={compact ? 5 : 8}
          refX={compact ? 3.5 : 6}
          refY={compact ? 2.5 : 4}
          orient="auto"
        >
          <path
            d={compact ? "M0,0 L5,2.5 L0,5 Z" : "M0,0 L8,4 L0,8 Z"}
            fill="var(--color-accent)"
            fillOpacity="0.5"
          />
        </marker>
      </defs>

      {positions.slice(0, -1).map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={topY}
          x2={positions[i + 1]}
          y2={topY}
          stroke="var(--color-accent)"
          strokeOpacity="0.3"
          strokeWidth={compact ? 1 : 1.5}
          markerEnd={`url(#${arrowId})`}
        />
      ))}

      {hasLoop && (
        <path
          d={returnArc(positions, loopFromIndex!)}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd={`url(#${arrowId})`}
        />
      )}

      {nodes.map((node, i) => {
        const Icon = ICONS[node.icon];
        const x = positions[i];
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={topY}
              r={nodeRadius}
              fill="var(--color-terminal-surface)"
              stroke="var(--color-accent)"
              strokeOpacity="0.4"
              strokeWidth={compact ? 1 : 1.5}
            />
            <svg
              x={x - iconSize / 2}
              y={topY - iconSize / 2}
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
            >
              <Icon className="text-accent/80" />
            </svg>
            {compact ? (
              <foreignObject
                x={Math.max(0, Math.min(x - labelWidth / 2, viewWidth - labelWidth))}
                y={topY + nodeRadius + 3}
                width={labelWidth}
                height={12}
                overflow="hidden"
              >
                {/* w-full is load-bearing, not decorative — without an
                    explicit width the div shrink-wraps to its own text
                    instead of the foreignObject's box, so `truncate` has
                    nothing to actually clip against and the full label
                    bleeds into the next node's space. */}
                <div className="w-full truncate text-center font-mono text-[7px] leading-[9px] text-foreground/55">
                  {node.label}
                </div>
              </foreignObject>
            ) : (
              <text
                x={x}
                y={topY + nodeRadius + 16}
                textAnchor="middle"
                fontSize="10"
                className="fill-foreground/70 font-mono"
              >
                {node.label}
              </text>
            )}
          </g>
        );
      })}

      <circle
        r={compact ? 2.5 : 4}
        fill="var(--color-accent)"
        style={{ filter: `drop-shadow(0 0 ${compact ? 3 : 4}px var(--color-accent))` }}
      >
        {dotMotion}
      </circle>
    </svg>
  );
}
