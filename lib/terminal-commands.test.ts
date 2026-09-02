import { describe, expect, it } from "vitest";
import { runCommand } from "./terminal-commands";

describe("pwd", () => {
  it("prints ~ at root", () => {
    const result = runCommand("pwd", "/");
    expect(result.lines).toEqual([{ text: "~" }]);
  });

  it("prints ~/path when nested", () => {
    const result = runCommand("pwd", "/projects");
    expect(result.lines).toEqual([{ text: "~/projects" }]);
  });
});

describe("ls / dir", () => {
  it("lists folders with a trailing slash and leaves without one", () => {
    const result = runCommand("ls", "/");
    const texts = result.lines.map((line) => line.text);
    expect(texts).toContain("Projects/");
    expect(texts).toContain("About");
  });

  it("dir is an alias for ls", () => {
    expect(runCommand("dir", "/").lines).toEqual(runCommand("ls", "/").lines);
  });

  it("reports an empty folder with a maintenance notice", () => {
    const result = runCommand("ls", "/programming");
    expect(result.lines[0].tone).toBe("error");
    expect(result.lines[0].text).toMatch(/no content available/i);
    expect(result.lines[1].text).toMatch(/check back soon/i);
  });

  it("resolves relative to the enclosing folder when the current path is a leaf", () => {
    // e.g. after `open smsnet`, the route is /projects/smsnet — ls should
    // still list /projects's children, not fall back to root.
    const result = runCommand("ls", "/projects/smsnet");
    const texts = result.lines.map((line) => line.text);
    expect(texts).toContain("WalletRadar");
  });
});

describe("cd", () => {
  it("changes into a child folder by slug", () => {
    expect(runCommand("cd projects", "/").navigateTo).toBe("/projects");
  });

  it("matches by display name case-insensitively", () => {
    expect(runCommand("cd Projects", "/").navigateTo).toBe("/projects");
    expect(runCommand("cd CyberSecurity", "/").navigateTo).toBe(
      "/cybersecurity",
    );
  });

  it("goes to the parent with ..", () => {
    expect(runCommand("cd ..", "/cybersecurity/toolkit").navigateTo).toBe(
      "/cybersecurity",
    );
  });

  it("goes to root with ~, /, or no argument", () => {
    expect(runCommand("cd ~", "/projects").navigateTo).toBe("/");
    expect(runCommand("cd /", "/projects").navigateTo).toBe("/");
    expect(runCommand("cd", "/projects").navigateTo).toBe("/");
  });

  it("errors on an unknown target with a hint, and does not navigate", () => {
    const result = runCommand("cd nope", "/");
    expect(result.navigateTo).toBeUndefined();
    expect(result.lines[0].tone).toBe("error");
    expect(result.lines[1].tone).toBe("muted");
  });

  it("errors when the target is a leaf node, not a folder", () => {
    const result = runCommand("cd smsnet", "/projects");
    expect(result.navigateTo).toBeUndefined();
    expect(result.lines[0].text).toMatch(/not a directory/i);
    expect(result.lines[1].text).toMatch(/open smsnet/i);
  });

  it("resolves relative to the enclosing folder after the route has moved to a leaf", () => {
    // Simulates being on /projects/smsnet (e.g. after `open smsnet`) — `cd ..`
    // should still behave relative to /projects, not fall back to root.
    expect(runCommand("cd ..", "/projects/smsnet").navigateTo).toBe(
      "/projects",
    );
  });
});

describe("open", () => {
  it("navigates to a project and confirms, without duplicating its detail inline", () => {
    const result = runCommand("open smsnet", "/projects");
    expect(result.navigateTo).toBe("/projects/smsnet");
    expect(result.lines[0].text).toMatch(/opened smsnet/i);
  });

  it("navigates to a page and confirms", () => {
    const result = runCommand("open about", "/");
    expect(result.navigateTo).toBe("/about");
    expect(result.lines[0].text).toMatch(/opened about/i);
  });

  it("resolves relative to the enclosing folder after the route has moved to a leaf", () => {
    // On /projects/smsnet, its sibling walletradar should still be reachable directly.
    const result = runCommand("open walletradar", "/projects/smsnet");
    expect(result.navigateTo).toBe("/projects/walletradar");
  });

  it("errors when the target is a folder", () => {
    const result = runCommand("open projects", "/");
    expect(result.lines[0].text).toMatch(/is a directory/i);
    expect(result.lines[1].text).toMatch(/cd projects/i);
  });

  it("errors on an unknown target", () => {
    const result = runCommand("open nope", "/");
    expect(result.lines[0].tone).toBe("error");
  });

  it("errors with usage when called with no argument", () => {
    const result = runCommand("open", "/");
    expect(result.lines[0].text).toMatch(/usage/i);
  });
});

describe("clear", () => {
  it("signals clearScreen with no output", () => {
    const result = runCommand("clear", "/");
    expect(result.clearScreen).toBe(true);
    expect(result.lines).toEqual([]);
  });
});

describe("help", () => {
  it("lists every registered command", () => {
    const result = runCommand("help", "/");
    const joined = result.lines.map((line) => line.text).join("\n");
    expect(joined).toContain("pwd");
    expect(joined).toContain("cd");
    expect(joined).toContain("open");
  });
});

describe("unknown commands", () => {
  it("errors with a hint to run help", () => {
    const result = runCommand("frobnicate", "/");
    expect(result.lines[0].tone).toBe("error");
    expect(result.lines[1].text).toMatch(/help/i);
  });

  it("returns no output for blank input", () => {
    expect(runCommand("   ", "/").lines).toEqual([]);
  });
});
