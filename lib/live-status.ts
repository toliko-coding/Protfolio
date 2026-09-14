export type Health = "operational" | "degraded" | "down" | "checking";

export interface FeedStatus {
  health: Health;
  description: string;
}

export interface LatestCommit {
  sha: string;
  message: string;
  date: string;
}

export const SITE_REPO = "toliko-coding/Protfolio";

// Statuspage's v2 summary endpoint is meant for public, unauthenticated
// embeds like this one — it's the same feed each status site's own badge
// uses, and both answer browsers with Access-Control-Allow-Origin: *.
export const GITHUB_STATUS_URL = "https://www.githubstatus.com/api/v2/status.json";
export const VERCEL_STATUS_URL = "https://www.vercel-status.com/api/v2/status.json";

// StatusWidget and the root page's topology diagram both ask for the same
// feeds as they mount. Sharing the in-flight promise — not a cached result —
// collapses those simultaneous calls into one request, while a later refresh
// still refetches. No AbortSignal on purpose: one caller unmounting mustn't
// cancel a request another caller is still waiting on, so callers ignore
// late results themselves instead.
const inflight = new Map<string, Promise<unknown>>();

function getJson(url: string): Promise<unknown> {
  let pending = inflight.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .finally(() => inflight.delete(url));
    inflight.set(url, pending);
  }
  return pending;
}

export function healthFromIndicator(indicator: string | undefined): Health {
  if (indicator === "none" || indicator === undefined) return "operational";
  if (indicator === "minor") return "degraded";
  return "down";
}

export async function fetchStatuspage(url: string): Promise<FeedStatus> {
  try {
    const data = (await getJson(url)) as {
      status?: { indicator?: string; description?: string };
    };
    return {
      health: healthFromIndicator(data?.status?.indicator),
      description: data?.status?.description ?? "Reachable",
    };
  } catch {
    return { health: "down", description: "Unreachable" };
  }
}

// Unauthenticated, so it shares GitHub's 60-requests-an-hour per-IP limit —
// a null here means "couldn't find out", never "there is no commit".
export async function fetchLatestCommit(
  repo: string,
  branch = "main",
): Promise<LatestCommit | null> {
  try {
    const data = (await getJson(`https://api.github.com/repos/${repo}/commits/${branch}`)) as {
      sha?: string;
      commit?: { message?: string; committer?: { date?: string } };
    };
    if (typeof data?.sha !== "string") return null;
    return {
      sha: data.sha,
      message: data.commit?.message ?? "",
      date: data.commit?.committer?.date ?? "",
    };
  } catch {
    return null;
  }
}

// Matches the git trailer itself, not any mention of the name — a commit
// titled "Mention Claude in the docs" wasn't co-authored by it.
export function isClaudeCoauthored(message: string): boolean {
  return /^co-authored-by:\s*claude\b/im.test(message);
}

export type SyncState = "local" | "checking" | "in-sync" | "behind" | "unknown";

// `latest` is undefined while still loading and null once the lookup failed,
// so the two can't be confused with each other.
export function syncState(
  deployedSha: string | undefined,
  latest: LatestCommit | null | undefined,
): SyncState {
  if (!deployedSha) return "local";
  if (latest === undefined) return "checking";
  if (latest === null) return "unknown";
  return latest.sha === deployedSha ? "in-sync" : "behind";
}

export function timeAgo(iso: string, now: number): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
