export type Orientation = "wide" | "tall";

export type NodeId =
  | "claude"
  | "dashboard"
  | "github"
  | "vercel"
  | "edge"
  | "domain"
  | "browser"
  | "githubApi"
  | "githubStatus"
  | "vercelStatus";

export type TopologyIcon =
  | "sparkle"
  | "dashboard"
  | "github"
  | "vercel"
  | "globe"
  | "lock"
  | "browser"
  | "code"
  | "pulse";

type LabelSide = "below" | "right";

interface Placement {
  x: number;
  y: number;
  label: LabelSide;
}

export interface TopologyNode {
  id: NodeId;
  label: string;
  sub: string;
  icon: TopologyIcon;
  // The build-and-deploy chain itself, as opposed to the tools and feeds
  // hanging off it — drawn brighter, with a rotating ring.
  primary: boolean;
  at: Record<Orientation, Placement>;
}

export type EdgeKind = "pipeline" | "telemetry" | "request";

export interface TopologyEdge {
  from: NodeId;
  to: NodeId;
  kind: EdgeKind;
}

export interface Caption {
  text: string;
  x: number;
  y: number;
  anchor: "start" | "end";
}

// Two hand-placed layouts over the same nodes and edges rather than one
// layout scaled down: squeezing the wide chain into a phone-width panel
// shrank its labels to an unreadable few pixels. The tall layout runs the
// chain down the left with labels beside each node instead.
export const VIEWBOX: Record<Orientation, { width: number; height: number }> = {
  wide: { width: 1000, height: 400 },
  tall: { width: 400, height: 1010 },
};

export const NODE_RADIUS: Record<Orientation, number> = { wide: 32, tall: 28 };

const LABEL_GAP = 20;
const SUB_GAP = 17;

export const TOPOLOGY_SUMMARY =
  "How this site runs: Claude Code writes the code, watched by Agent Dashboard, and commits to GitHub. " +
  "Vercel builds each push and serves it from its edge network at tk-coding.com to your browser, " +
  "which then requests live data from the GitHub API, GitHub Status and Vercel Status.";

export const NODES: TopologyNode[] = [
  {
    id: "claude",
    label: "Claude Code",
    sub: "writes the code",
    icon: "sparkle",
    primary: true,
    at: { wide: { x: 80, y: 120, label: "below" }, tall: { x: 90, y: 190, label: "right" } },
  },
  {
    id: "github",
    label: "GitHub",
    sub: "main branch",
    icon: "github",
    primary: true,
    at: { wide: { x: 248, y: 120, label: "below" }, tall: { x: 90, y: 310, label: "right" } },
  },
  {
    id: "vercel",
    label: "Vercel Build",
    sub: "Next.js · Turbopack",
    icon: "vercel",
    primary: true,
    at: { wide: { x: 416, y: 120, label: "below" }, tall: { x: 90, y: 430, label: "right" } },
  },
  {
    id: "edge",
    label: "Vercel Edge",
    sub: "global CDN · HTTPS",
    icon: "globe",
    primary: true,
    at: { wide: { x: 584, y: 120, label: "below" }, tall: { x: 90, y: 550, label: "right" } },
  },
  {
    id: "domain",
    label: "tk-coding.com",
    sub: "DNS · Porkbun",
    icon: "lock",
    primary: true,
    at: { wide: { x: 752, y: 120, label: "below" }, tall: { x: 90, y: 670, label: "right" } },
  },
  {
    id: "browser",
    label: "You",
    sub: "this browser",
    icon: "browser",
    primary: true,
    at: { wide: { x: 920, y: 120, label: "below" }, tall: { x: 90, y: 790, label: "right" } },
  },
  {
    id: "dashboard",
    label: "Agent Dashboard",
    sub: "watches the agents",
    icon: "dashboard",
    primary: false,
    at: { wide: { x: 80, y: 310, label: "below" }, tall: { x: 320, y: 60, label: "below" } },
  },
  {
    id: "githubApi",
    label: "GitHub API",
    sub: "latest commit",
    icon: "code",
    primary: false,
    at: { wide: { x: 584, y: 310, label: "below" }, tall: { x: 90, y: 915, label: "below" } },
  },
  {
    id: "githubStatus",
    label: "GitHub Status",
    sub: "githubstatus.com",
    icon: "pulse",
    primary: false,
    at: { wide: { x: 752, y: 310, label: "below" }, tall: { x: 205, y: 915, label: "below" } },
  },
  {
    id: "vercelStatus",
    label: "Vercel Status",
    sub: "vercel-status.com",
    icon: "pulse",
    primary: false,
    at: { wide: { x: 920, y: 310, label: "below" }, tall: { x: 320, y: 915, label: "below" } },
  },
];

export const EDGES: TopologyEdge[] = [
  { from: "claude", to: "github", kind: "pipeline" },
  { from: "github", to: "vercel", kind: "pipeline" },
  { from: "vercel", to: "edge", kind: "pipeline" },
  { from: "edge", to: "domain", kind: "pipeline" },
  { from: "domain", to: "browser", kind: "pipeline" },
  { from: "claude", to: "dashboard", kind: "telemetry" },
  { from: "browser", to: "githubApi", kind: "request" },
  { from: "browser", to: "githubStatus", kind: "request" },
  { from: "browser", to: "vercelStatus", kind: "request" },
];

// Only the wide layout has spare room for lane captions — in the tall one
// every gap is already crossed by an edge.
export const CAPTIONS: Record<Orientation, Caption[]> = {
  wide: [
    { text: "BUILD & DEPLOY", x: 24, y: 36, anchor: "start" },
    { text: "AGENT LOOP", x: 128, y: 314, anchor: "start" },
    { text: "LIVE REQUESTS FROM THIS PAGE", x: 536, y: 314, anchor: "end" },
  ],
  tall: [],
};

const nodesById = new Map(NODES.map((node) => [node.id, node]));

export function getNode(id: NodeId): TopologyNode {
  const node = nodesById.get(id);
  if (!node) throw new Error(`Unknown topology node: ${id}`);
  return node;
}

// How far below a node's center its label and sub-label reach.
function labelClearance(orientation: Orientation): number {
  return NODE_RADIUS[orientation] + LABEL_GAP + SUB_GAP + 12;
}

export function labelPosition(node: TopologyNode, orientation: Orientation) {
  const { x, y, label } = node.at[orientation];
  const r = NODE_RADIUS[orientation];
  return label === "below"
    ? {
        x,
        labelY: y + r + LABEL_GAP,
        subY: y + r + LABEL_GAP + SUB_GAP,
        anchor: "middle" as const,
      }
    : { x: x + r + 14, labelY: y - 2, subY: y + 15, anchor: "start" as const };
}

// Same-row nodes get a straight line between their sides. Everything else
// leaves vertically and bends with a cubic curve — and an edge leaving
// downward from a node labelled underneath starts below that label, not
// through it.
export function edgePath(edge: TopologyEdge, orientation: Orientation): string {
  const a = getNode(edge.from).at[orientation];
  const b = getNode(edge.to).at[orientation];
  const r = NODE_RADIUS[orientation];

  if (a.y === b.y) {
    const dir = Math.sign(b.x - a.x);
    return `M ${a.x + dir * r},${a.y} L ${b.x - dir * r},${b.y}`;
  }

  const dir = Math.sign(b.y - a.y);
  const startY =
    a.y + dir * (dir > 0 && a.label === "below" ? labelClearance(orientation) : r);
  const endY = b.y - dir * (dir < 0 && b.label === "below" ? labelClearance(orientation) : r);
  if (a.x === b.x) return `M ${a.x},${startY} L ${b.x},${endY}`;

  const midY = (startY + endY) / 2;
  return `M ${a.x},${startY} C ${a.x},${midY} ${b.x},${midY} ${b.x},${endY}`;
}

// A flat-topped hexagon, rounded to 2 decimals so the server-rendered and
// hydrated markup can never disagree on a float.
export function hexagonPath(x: number, y: number, r: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${(x + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`;
  });
  return `M ${points.join(" L ")} Z`;
}
