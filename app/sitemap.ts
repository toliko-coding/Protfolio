import type { MetadataRoute } from "next";
import { getAllPaths } from "@/lib/fs-utils";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPaths().map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
  }));
}
