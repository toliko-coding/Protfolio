import { describe, expect, it } from "vitest";
import {
  getAllPaths,
  getBreadcrumbTrail,
  normalizePath,
  pathToSegments,
  resolvePath,
} from "./fs-utils";

describe("normalizePath", () => {
  it("normalizes root variants to /", () => {
    expect(normalizePath("")).toBe("/");
    expect(normalizePath("/")).toBe("/");
  });

  it("strips trailing slashes and ensures a leading slash", () => {
    expect(normalizePath("projects/")).toBe("/projects");
    expect(normalizePath("/projects/smsnet/")).toBe("/projects/smsnet");
  });
});

describe("pathToSegments", () => {
  it("returns an empty array for root", () => {
    expect(pathToSegments("/")).toEqual([]);
  });

  it("splits a nested path into segments", () => {
    expect(pathToSegments("/projects/smsnet")).toEqual([
      "projects",
      "smsnet",
    ]);
  });
});

describe("resolvePath", () => {
  it("resolves the root folder", () => {
    const node = resolvePath("/");
    expect(node?.type).toBe("folder");
    expect(node?.path).toBe("/");
  });

  it("resolves a nested folder", () => {
    const node = resolvePath("/cybersecurity/toolkit");
    expect(node?.type).toBe("folder");
    expect(node?.name).toBe("Toolkit");
  });

  it("resolves a project leaf node", () => {
    const node = resolvePath("/projects/smsnet");
    expect(node?.type).toBe("project");
    expect(node?.name).toBe("SMSNet");
  });

  it("returns undefined for an unknown path", () => {
    expect(resolvePath("/does-not-exist")).toBeUndefined();
  });

  it("returns undefined when treating a leaf node as a folder", () => {
    expect(resolvePath("/projects/smsnet/nope")).toBeUndefined();
  });
});

describe("getBreadcrumbTrail", () => {
  it("returns just the root for the root path", () => {
    const trail = getBreadcrumbTrail("/");
    expect(trail).toHaveLength(1);
    expect(trail[0].path).toBe("/");
  });

  it("returns the full ancestor chain for a nested path", () => {
    const trail = getBreadcrumbTrail("/projects/smsnet");
    expect(trail.map((node) => node.path)).toEqual([
      "/",
      "/projects",
      "/projects/smsnet",
    ]);
  });
});

describe("getAllPaths", () => {
  it("includes root, every folder, and every leaf node", () => {
    const paths = getAllPaths();
    expect(paths).toContain("/");
    expect(paths).toContain("/projects");
    expect(paths).toContain("/projects/smsnet");
    expect(paths).toContain("/cybersecurity/toolkit");
    expect(paths).toContain("/resume");
  });
});
