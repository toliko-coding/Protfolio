import Link from "next/link";
import type { FSNode } from "@/lib/fs-types";
import { isFolder, isProject } from "@/lib/fs-types";

export function FolderGrid({ nodes }: { nodes: FSNode[] }) {
  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-sm text-foreground/40">
        Nothing here yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {nodes.map((node) => (
        <Link
          key={node.id}
          href={node.path}
          className="flex flex-col gap-1 rounded-lg border border-foreground/10 p-3 transition-colors hover:border-accent/50 hover:bg-accent/[.04]"
        >
          <span className="font-mono text-xs text-accent/50">
            {isFolder(node) ? "dir" : node.type}
          </span>
          <span className="font-mono text-sm font-medium">{node.name}</span>
          {isProject(node) && (
            <span className="line-clamp-2 text-xs text-foreground/60">
              {node.summary}
            </span>
          )}
          {!isFolder(node) && !isProject(node) && node.description && (
            <span className="line-clamp-2 text-xs text-foreground/60">
              {node.description}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
