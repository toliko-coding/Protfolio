import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, buildSecurityHeaders } from "./security-headers";

const production = { isDev: false, isPreview: false };
const development = { isDev: true, isPreview: false };
const preview = { isDev: false, isPreview: true };

function directive(policy: string, name: string): string | undefined {
  return policy.split("; ").find((d) => d === name || d.startsWith(`${name} `));
}

describe("buildContentSecurityPolicy", () => {
  it("lets production fetch only from this site and the APIs it actually calls", () => {
    expect(directive(buildContentSecurityPolicy(production), "connect-src")).toBe(
      "connect-src 'self' https://api.github.com https://www.githubstatus.com https://www.vercel-status.com",
    );
  });

  it("keeps eval and dev-only script hosts out of production", () => {
    const scripts = directive(buildContentSecurityPolicy(production), "script-src");
    expect(scripts).toBe("script-src 'self' 'unsafe-inline'");
  });

  it("allows eval and the analytics debug script in development without upgrading localhost", () => {
    const policy = buildContentSecurityPolicy(development);
    expect(directive(policy, "script-src")).toContain("'unsafe-eval'");
    expect(directive(policy, "script-src")).toContain("https://va.vercel-scripts.com");
    expect(directive(policy, "upgrade-insecure-requests")).toBeUndefined();
    expect(directive(buildContentSecurityPolicy(production), "upgrade-insecure-requests")).toBe(
      "upgrade-insecure-requests",
    );
  });

  it("blocks framing, plugins and base-tag hijacking", () => {
    const policy = buildContentSecurityPolicy(production);
    expect(directive(policy, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(policy, "frame-src")).toBe("frame-src 'none'");
    expect(directive(policy, "object-src")).toBe("object-src 'none'");
    expect(directive(policy, "base-uri")).toBe("base-uri 'self'");
  });

  it("only lets the Vercel toolbar in on preview deployments", () => {
    expect(buildContentSecurityPolicy(production)).not.toContain("vercel.live");
    const policy = buildContentSecurityPolicy(preview);
    expect(directive(policy, "frame-src")).toBe("frame-src https://vercel.live");
    expect(directive(policy, "script-src")).toContain("https://vercel.live");
  });
});

describe("buildSecurityHeaders", () => {
  it("sends the standard hardening headers alongside the CSP", () => {
    const keys = buildSecurityHeaders(production).map((header) => header.key);
    expect(keys).toEqual([
      "Content-Security-Policy",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ]);
  });
});
