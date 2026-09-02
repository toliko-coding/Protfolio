import type { MetadataRoute } from "next";
import { getAllPaths } from "@/lib/fs-utils";

// Set NEXT_PUBLIC_SITE_URL to the real domain when deploying (Phase 15) —
// falls back to localhost so this still works correctly in development.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPaths().map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));
}
