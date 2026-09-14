import type { NextConfig } from "next";
import path from "node:path";
import { buildSecurityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: buildSecurityHeaders({
          isDev: process.env.NODE_ENV === "development",
          // Set by Vercel; only preview deployments load its feedback toolbar.
          isPreview: process.env.VERCEL_ENV === "preview",
        }),
      },
    ];
  },
};

export default nextConfig;
