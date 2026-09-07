import type { ComponentType } from "react";
import { getAllProjects } from "@/lib/fs-utils";
import { computeSkillDomains, type SkillDomain } from "@/lib/skill-stats";
import { CloudIcon, CodeIcon, GlobeIcon, ShieldIcon, SparkleIcon } from "@/components/ui/icons";

const ICONS = {
  shield: ShieldIcon,
  globe: GlobeIcon,
  cloud: CloudIcon,
  code: CodeIcon,
  sparkle: SparkleIcon,
} satisfies Record<SkillDomain["icon"], ComponentType<{ className?: string }>>;

// Wide, not circular — the ring is an ellipse so the diagram spreads across
// the panel's width instead of sitting as a small centered blob. Nodes stay
// in fixed positions — an earlier attempt to rotate the whole ring rigidly
// broke down badly at 90°/270°, since a rotated ellipse needs far more
// vertical room than this wide, short viewBox has, sending nodes out of
// bounds. Motion instead comes only from the independent scanning dot below,
// which is just one point tracing a fixed path — nothing rotates.
const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 300;
const CENTER = { x: VIEW_WIDTH / 2, y: 150 };
const RADIUS_X = 290;
const RADIUS_Y = 105;
const NODE_RADIUS = 30;
const HUB_RADIUS = 19;

function nodePosition(index: number, count: number) {
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER.x + RADIUS_X * Math.cos(angle),
    y: CENTER.y + RADIUS_Y * Math.sin(angle),
  };
}

// A full ellipse, built from two arcs — a single arc command can't close on
// itself, so animateMotion needs this pair to loop cleanly.
function orbitPath() {
  const left = CENTER.x - RADIUS_X;
  const right = CENTER.x + RADIUS_X;
  return (
    `M ${right},${CENTER.y} A ${RADIUS_X},${RADIUS_Y} 0 1 1 ${left},${CENTER.y} ` +
    `A ${RADIUS_X},${RADIUS_Y} 0 1 1 ${right},${CENTER.y}`
  );
}

// A radar map of the broad domains behind the work on this site, rather
// than a bar chart ranking one against another. Nothing here is counted or
// scored — the point is breadth, not a scorecard a recruiter could read as
// "weak at X" from a thin bar.
export function DomainRadar() {
  const domains = computeSkillDomains(getAllProjects());
  if (domains.length === 0) return null;

  return (
    <div className="flex flex-col items-center rounded-lg border border-foreground/10 p-3">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-auto w-full max-w-2xl"
        role="img"
        aria-label={`Domains this work spans: ${domains.map((d) => d.label).join(", ")}`}
      >
        <ellipse
          cx={CENTER.x}
          cy={CENTER.y}
          rx={RADIUS_X}
          ry={RADIUS_Y}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.12"
          strokeDasharray="3 5"
        />

        {[0, 1.6].map((delay) => (
          <circle
            key={delay}
            cx={CENTER.x}
            cy={CENTER.y}
            r={HUB_RADIUS}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          >
            <animate
              attributeName="r"
              values={`${HUB_RADIUS};${RADIUS_Y + 10}`}
              dur="3.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0"
              dur="3.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {domains.map((domain, index) => {
          const { x, y } = nodePosition(index, domains.length);
          return (
            <line
              key={domain.label}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={x}
              y2={y}
              stroke="var(--color-accent)"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          );
        })}

        <circle
          r="5"
          fill="var(--color-accent)"
          style={{ filter: "drop-shadow(0 0 6px var(--color-accent))" }}
        >
          <animateMotion path={orbitPath()} dur="10s" repeatCount="indefinite" />
        </circle>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={HUB_RADIUS}
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 6px var(--color-accent))" }}
        />

        {domains.map((domain, index) => {
          const Icon = ICONS[domain.icon];
          const { x, y } = nodePosition(index, domains.length);
          return (
            <g key={domain.label}>
              <circle
                cx={x}
                cy={y}
                r={NODE_RADIUS}
                fill="var(--color-terminal-surface)"
                stroke="var(--color-accent)"
                strokeOpacity="0.5"
                strokeWidth="1.5"
              />
              <svg x={x - 13} y={y - 13} width="26" height="26" viewBox="0 0 24 24">
                <Icon className="text-accent/80" />
              </svg>
              <text
                x={x}
                y={y + NODE_RADIUS + 18}
                textAnchor="middle"
                fontSize="12"
                className="fill-foreground/70 font-mono"
              >
                {domain.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
