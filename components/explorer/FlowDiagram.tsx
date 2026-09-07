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
}

const VIEW_WIDTH = 640;
const TOP_Y = 46;
const LOOP_Y = 124;
const NODE_RADIUS = 20;
const MARGIN = 56;
const HOP_SECONDS = 0.9;

function straightPath(positions: number[], from: number, to: number): string {
  return positions
    .slice(from, to + 1)
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x},${TOP_Y}`)
    .join(" ");
}

function returnArc(positions: number[], from: number): string {
  const lastX = positions[positions.length - 1];
  const targetX = positions[from];
  return `M ${lastX},${TOP_Y} C ${lastX},${LOOP_Y} ${targetX},${LOOP_Y} ${targetX},${TOP_Y}`;
}

function loopPath(positions: number[], from: number): string {
  const straight = straightPath(positions, from, positions.length - 1);
  const arc = returnArc(positions, from).replace(/^M [^C]+/, "");
  return `${straight} ${arc}`;
}

// Pure SVG + native SMIL animation (<animateMotion>) — no client JS needed,
// this animates in the browser on its own once rendered.
export function FlowDiagram({ nodes, loopFromIndex }: FlowDiagramProps) {
  const count = nodes.length;
  if (count < 2) return null;

  const step = (VIEW_WIDTH - MARGIN * 2) / (count - 1);
  const positions = nodes.map((_, i) => MARGIN + step * i);
  const hasLoop =
    typeof loopFromIndex === "number" && loopFromIndex >= 0 && loopFromIndex < count - 1;
  const viewHeight = hasLoop ? 160 : 96;

  const dotMotion = hasLoop ? (
    <>
      {/* Skipped entirely when the loop target IS the first node (a game
          loop, say) — there's nothing before it to traverse once first. */}
      {loopFromIndex! > 0 && (
        <animateMotion
          id="flow-intro"
          path={straightPath(positions, 0, loopFromIndex!)}
          dur={`${loopFromIndex! * HOP_SECONDS}s`}
          begin="0s"
          fill="freeze"
        />
      )}
      <animateMotion
        path={loopPath(positions, loopFromIndex!)}
        dur={`${(count - loopFromIndex!) * HOP_SECONDS}s`}
        begin={loopFromIndex! > 0 ? "flow-intro.end" : "0s"}
        repeatCount="indefinite"
      />
    </>
  ) : (
    <animateMotion
      path={straightPath(positions, 0, count - 1)}
      dur={`${(count - 1) * HOP_SECONDS}s`}
      repeatCount="indefinite"
    />
  );

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Diagram: ${nodes.map((n) => n.label).join(" → ")}${
        hasLoop ? ", looping back after the last step" : ""
      }`}
    >
      <defs>
        <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" fillOpacity="0.5" />
        </marker>
      </defs>

      {positions.slice(0, -1).map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={TOP_Y}
          x2={positions[i + 1]}
          y2={TOP_Y}
          stroke="var(--color-accent)"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          markerEnd="url(#flow-arrow)"
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
          markerEnd="url(#flow-arrow)"
        />
      )}

      {nodes.map((node, i) => {
        const Icon = ICONS[node.icon];
        const x = positions[i];
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={TOP_Y}
              r={NODE_RADIUS}
              fill="var(--color-terminal-surface)"
              stroke="var(--color-accent)"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            <svg x={x - 9} y={TOP_Y - 9} width="18" height="18" viewBox="0 0 24 24">
              <Icon className="text-accent/80" />
            </svg>
            <text
              x={x}
              y={TOP_Y + NODE_RADIUS + 16}
              textAnchor="middle"
              fontSize="10"
              className="fill-foreground/70 font-mono"
            >
              {node.label}
            </text>
          </g>
        );
      })}

      <circle
        r="4"
        fill="var(--color-accent)"
        style={{ filter: "drop-shadow(0 0 4px var(--color-accent))" }}
      >
        {dotMotion}
      </circle>
    </svg>
  );
}
