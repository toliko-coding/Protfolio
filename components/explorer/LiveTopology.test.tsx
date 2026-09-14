import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LiveTopology } from "./LiveTopology";

const HEAD_SHA = "0a5e40e0000000000000000000000000000000ab";

function stubFeeds({ sha = HEAD_SHA, message = "Add a thing" } = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const body = url.includes("api.github.com")
        ? { sha, commit: { message, committer: { date: new Date().toISOString() } } }
        : { status: { indicator: "none", description: "All Systems Operational" } };
      return { ok: true, status: 200, json: async () => body };
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LiveTopology", () => {
  it("describes the whole pipeline to assistive tech, in both layouts", () => {
    stubFeeds();
    render(<LiveTopology deployedSha={HEAD_SHA} />);
    const diagrams = screen.getAllByRole("img", { name: /how this site runs/i });
    expect(diagrams).toHaveLength(2);
    for (const name of ["Claude Code", "Agent Dashboard", "GitHub", "Vercel", "tk-coding.com"]) {
      expect(diagrams[0]).toHaveAccessibleName(expect.stringContaining(name));
    }
  });

  it("reports the deploy as live when it's the latest commit on main", async () => {
    stubFeeds();
    render(<LiveTopology deployedSha={HEAD_SHA} />);
    expect(await screen.findByText("live · deploy 0a5e40e is the latest commit")).toBeInTheDocument();
  });

  it("flags when main has moved past the deployed commit", async () => {
    stubFeeds({ sha: "fffffff0000000000000000000000000000000ab" });
    render(<LiveTopology deployedSha={HEAD_SHA} />);
    expect(await screen.findByText("main is ahead of deploy 0a5e40e")).toBeInTheDocument();
  });

  it("labels a build with no deploy commit as local", () => {
    stubFeeds();
    render(<LiveTopology />);
    expect(screen.getByText("local build — not a Vercel deploy")).toBeInTheDocument();
  });

  it("calls out a latest commit co-authored by Claude, and only then", async () => {
    stubFeeds({ message: "Tweak\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>" });
    const { unmount } = render(<LiveTopology deployedSha={HEAD_SHA} />);
    expect(await screen.findByText("latest commit co-authored by Claude")).toBeInTheDocument();
    unmount();

    stubFeeds({ message: "Tweak by hand" });
    render(<LiveTopology deployedSha={HEAD_SHA} />);
    await screen.findByText("live · deploy 0a5e40e is the latest commit");
    expect(screen.queryByText("latest commit co-authored by Claude")).not.toBeInTheDocument();
  });
});
