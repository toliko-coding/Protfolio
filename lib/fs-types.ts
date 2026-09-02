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

export interface PageNode extends BaseNode {
  type: "page";
  // Plain placeholder text for now — becomes MDX-authored content in Phase 10.
  body: string;
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
