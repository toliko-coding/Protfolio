import type { FolderNode, PageNode } from "@/lib/fs-types";
import { projects } from "./projects";

function page(slug: string, name: string, description: string): PageNode {
  return {
    id: slug,
    slug,
    name,
    path: `/${slug}`,
    type: "page",
    description,
    body: "Placeholder content — written in Phase 10.",
  };
}

function folder(
  path: string,
  slug: string,
  name: string,
  children: FolderNode["children"] = [],
): FolderNode {
  return { id: slug || "root", slug, name, path, type: "folder", children };
}

// The v1 tree from Phase 2. Placeholder folders (cybersecurity subfolders,
// programming, useful-codes) are intentionally empty until Phase 10 content.
export const filesystem: FolderNode = folder("/", "", "portfolio", [
  page("about", "About", "Who I am."),
  folder("/projects", "projects", "Projects", projects),
  folder("/cybersecurity", "cybersecurity", "CyberSecurity", [
    folder("/cybersecurity/writeups", "writeups", "Write-ups"),
    folder("/cybersecurity/toolkit", "toolkit", "Toolkit"),
  ]),
  folder("/programming", "programming", "Programming"),
  folder("/useful-codes", "useful-codes", "Useful-Codes"),
  page("skills", "Skills", "What I work with."),
  page("resume", "Resume", "On-site resume."),
  page("contact", "Contact", "Get in touch."),
]);
