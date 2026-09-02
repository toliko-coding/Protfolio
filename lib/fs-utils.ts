import { filesystem } from "@/content/filesystem";
import { isFolder, type FolderNode, type FSNode } from "./fs-types";

export function normalizePath(path: string): string {
  if (path === "" || path === "/") return "/";
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}`;
}

export function pathToSegments(path: string): string[] {
  const normalized = normalizePath(path);
  return normalized === "/" ? [] : normalized.slice(1).split("/");
}

export function resolvePath(path: string): FSNode | undefined {
  const normalized = normalizePath(path);
  if (normalized === "/") return filesystem;

  let current: FSNode = filesystem;
  for (const segment of pathToSegments(normalized)) {
    if (!isFolder(current)) return undefined;
    const next: FSNode | undefined = current.children.find(
      (child) => child.slug === segment,
    );
    if (!next) return undefined;
    current = next;
  }

  return current;
}

export function getBreadcrumbTrail(path: string): FSNode[] {
  const normalized = normalizePath(path);
  const trail: FSNode[] = [filesystem];
  if (normalized === "/") return trail;

  let current: FSNode = filesystem;
  for (const segment of pathToSegments(normalized)) {
    if (!isFolder(current)) break;
    const next: FSNode | undefined = current.children.find(
      (child) => child.slug === segment,
    );
    if (!next) break;
    trail.push(next);
    current = next;
  }

  return trail;
}

export function getAllPaths(node: FSNode = filesystem): string[] {
  if (!isFolder(node)) return [node.path];
  return [node.path, ...node.children.flatMap((child) => getAllPaths(child))];
}

export function getParentPath(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return "/";
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash <= 0 ? "/" : normalized.slice(0, lastSlash);
}

// Root displays as "~", matching the breadcrumb and terminal prompt convention.
export function toDisplayPath(path: string): string {
  const normalized = normalizePath(path);
  return normalized === "/" ? "~" : `~${normalized}`;
}

// Resolves a typed name against a child's slug (URL-facing) or display name
// (e.g. "SMSNet"), case-insensitively — so both `cd projects` and `cd Projects` work.
export function findChildByName(
  folder: FolderNode,
  name: string,
): FSNode | undefined {
  const lower = name.toLowerCase();
  return folder.children.find(
    (child) =>
      child.slug.toLowerCase() === lower || child.name.toLowerCase() === lower,
  );
}
