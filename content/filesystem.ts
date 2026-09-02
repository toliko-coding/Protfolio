import type { FolderNode } from "@/lib/fs-types";
import { projects } from "./projects";
import { about } from "./about";
import { skills } from "./skills";
import { resume } from "./resume";
import { contact } from "./contact";

function folder(
  path: string,
  slug: string,
  name: string,
  children: FolderNode["children"] = [],
): FolderNode {
  return { id: slug || "root", slug, name, path, type: "folder", children };
}

// The v1 tree from Phase 2. cybersecurity's subfolders, programming, and
// useful-codes are intentionally still empty — no content provided for them yet.
export const filesystem: FolderNode = folder("/", "", "portfolio", [
  about,
  folder("/projects", "projects", "Projects", projects),
  folder("/cybersecurity", "cybersecurity", "CyberSecurity", [
    folder("/cybersecurity/writeups", "writeups", "Write-ups"),
    folder("/cybersecurity/toolkit", "toolkit", "Toolkit"),
  ]),
  folder("/programming", "programming", "Programming"),
  folder("/useful-codes", "useful-codes", "Useful-Codes"),
  skills,
  resume,
  contact,
]);
