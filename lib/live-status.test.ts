import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchLatestCommit,
  fetchStatuspage,
  healthFromIndicator,
  isClaudeCoauthored,
  syncState,
  timeAgo,
} from "./live-status";

const FEED_URL = "https://status.example.com/api/v2/status.json";

function jsonResponse(body: unknown, ok = true) {
  return { ok, status: ok ? 200 : 503, json: async () => body };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("healthFromIndicator", () => {
  it("maps Statuspage indicators onto health levels", () => {
    expect(healthFromIndicator("none")).toBe("operational");
    expect(healthFromIndicator(undefined)).toBe("operational");
    expect(healthFromIndicator("minor")).toBe("degraded");
    expect(healthFromIndicator("major")).toBe("down");
    expect(healthFromIndicator("critical")).toBe("down");
  });
});

describe("fetchStatuspage", () => {
  it("reads the indicator and description from the feed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({ status: { indicator: "minor", description: "Partial outage" } }),
      ),
    );
    expect(await fetchStatuspage(FEED_URL)).toEqual({
      health: "degraded",
      description: "Partial outage",
    });
  });

  it("reports the feed as down when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, false)));
    expect(await fetchStatuspage(FEED_URL)).toEqual({
      health: "down",
      description: "Unreachable",
    });
  });

  it("shares one request between simultaneous callers", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ status: { indicator: "none", description: "All good" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [first, second] = await Promise.all([
      fetchStatuspage(FEED_URL),
      fetchStatuspage(FEED_URL),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
  });

  it("refetches once the earlier request has settled", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ status: { indicator: "none", description: "All good" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchStatuspage(FEED_URL);
    await fetchStatuspage(FEED_URL);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("fetchLatestCommit", () => {
  it("returns the sha, message and commit date of the branch head", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          sha: "0a5e40e1234",
          commit: { message: "Add a thing", committer: { date: "2026-09-14T16:25:00Z" } },
        }),
      ),
    );
    expect(await fetchLatestCommit("owner/repo")).toEqual({
      sha: "0a5e40e1234",
      message: "Add a thing",
      date: "2026-09-14T16:25:00Z",
    });
  });

  it("returns null when GitHub can't be reached or rate-limits the request", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, false)));
    expect(await fetchLatestCommit("owner/repo")).toBeNull();
  });
});

describe("isClaudeCoauthored", () => {
  it("recognizes a Claude co-author trailer in any casing", () => {
    expect(
      isClaudeCoauthored(
        "Fix a bug\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>",
      ),
    ).toBe(true);
    expect(isClaudeCoauthored("Tweak\n\nco-authored-by: claude sonnet 5 <x@y>")).toBe(true);
  });

  it("ignores a plain mention and other co-authors", () => {
    expect(isClaudeCoauthored("Mention Claude in the docs")).toBe(false);
    expect(isClaudeCoauthored("Pair on it\n\nCo-Authored-By: Jane <jane@example.com>")).toBe(
      false,
    );
  });
});

describe("syncState", () => {
  const latest = { sha: "abc123", message: "", date: "" };

  it("is local when no deploy commit is known", () => {
    expect(syncState(undefined, latest)).toBe("local");
    expect(syncState("", latest)).toBe("local");
  });

  it("separates still-loading from a failed lookup", () => {
    expect(syncState("abc123", undefined)).toBe("checking");
    expect(syncState("abc123", null)).toBe("unknown");
  });

  it("compares the deployed commit with the branch head", () => {
    expect(syncState("abc123", latest)).toBe("in-sync");
    expect(syncState("def456", latest)).toBe("behind");
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-09-14T12:00:00Z");

  it("formats elapsed time at a glance", () => {
    expect(timeAgo("2026-09-14T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2026-09-14T11:55:00Z", now)).toBe("5m ago");
    expect(timeAgo("2026-09-14T09:00:00Z", now)).toBe("3h ago");
    expect(timeAgo("2026-09-12T12:00:00Z", now)).toBe("2d ago");
  });

  it("returns an empty string for an unparseable date", () => {
    expect(timeAgo("", now)).toBe("");
  });
});
