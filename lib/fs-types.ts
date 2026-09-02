export type DisciplineTag = "software" | "security";

interface BaseNode {
  id: string;
  slug: string;
  name: string;
  path: string;
  description?: string;
}

export interface FolderNode extends BaseNode {
  type: "folder";
  children: FSNode[];
  // Shown above the card grid when present — used for the root folder's
  // short site description + terminal-usage hint, not needed on every folder.
  intro?: string[];
}

export interface ProjectNode extends BaseNode {
  type: "project";
  tags: DisciplineTag[];
  summary: string;
  role: string;
  problem: string;
  techStack: string[];
  difficulty?: "low" | "medium" | "high";
  links: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  media?: {
    type: "image" | "screenshot";
    src: string;
    alt: string;
  }[];
}

export interface PageSection {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
  image?: { src: string; alt: string; width: number; height: number };
}

export interface PageNode extends BaseNode {
  type: "page";
  // Structured sections cover About/Skills/Resume/Contact today. Long-form
  // prose (e.g. CyberSecurity write-ups) will move to MDX once that content exists.
  sections: PageSection[];
  image?: { src: string; alt: string; width: number; height: number };
}

export type FSNode = FolderNode | ProjectNode | PageNode;

export function isFolder(node: FSNode): node is FolderNode {
  return node.type === "folder";
}

export function isProject(node: FSNode): node is ProjectNode {
  return node.type === "project";
}

export function isPage(node: FSNode): node is PageNode {
  return node.type === "page";
}
