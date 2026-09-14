interface Environment {
  isDev: boolean;
  // Vercel preview deployments inject the Vercel feedback toolbar.
  isPreview: boolean;
}

// Every cross-origin host the browser fetches from — the status feeds and
// latest-commit lookup in lib/live-status plus StatusWidget's repo count.
// A new fetch to another host has to be added here, or the browser blocks it.
const API_ORIGINS = [
  "https://api.github.com",
  "https://www.githubstatus.com",
  "https://www.vercel-status.com",
];

// Hosts the Vercel toolbar needs on preview deployments only — production
// never loads it, so production never allows them.
const VERCEL_TOOLBAR = {
  script: ["https://vercel.live"],
  style: ["https://vercel.live"],
  img: ["https://vercel.live", "https://vercel.com", "*.pusher.com"],
  font: ["https://vercel.live", "https://assets.vercel.com"],
  connect: ["https://vercel.live", "wss://ws-us3.pusher.com"],
  frame: ["https://vercel.live"],
};

export function buildContentSecurityPolicy({ isDev, isPreview }: Environment): string {
  const toolbar = (hosts: string[]) => (isPreview ? hosts : []);

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-inline' rather than nonces: every page here is statically
    // generated, and Next's nonce-based CSP needs per-request rendering,
    // which would give up static generation on a site with no user input
    // to inject into. Development additionally needs 'unsafe-eval' (React's
    // error overlays) and Vercel Analytics' debug script, which is served
    // from its CDN only in dev — production loads it from /_vercel.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'", "https://va.vercel-scripts.com"] : []),
      ...toolbar(VERCEL_TOOLBAR.script),
    ],
    "style-src": ["'self'", "'unsafe-inline'", ...toolbar(VERCEL_TOOLBAR.style)],
    "img-src": ["'self'", "blob:", "data:", ...toolbar(VERCEL_TOOLBAR.img)],
    "font-src": ["'self'", ...toolbar(VERCEL_TOOLBAR.font)],
    "connect-src": ["'self'", ...API_ORIGINS, ...toolbar(VERCEL_TOOLBAR.connect)],
    "frame-src": isPreview ? VERCEL_TOOLBAR.frame : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const policy = Object.entries(directives).map(
    ([name, sources]) => `${name} ${sources.join(" ")}`,
  );
  // Upgrading requests would break the plain-http localhost dev server.
  if (!isDev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function buildSecurityHeaders(env: Environment): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(env) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Redundant with frame-ancestors for modern browsers, kept for older ones.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
