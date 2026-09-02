import Link from "next/link";
import type { FSNode } from "@/lib/fs-types";
import { isFolder, isProject } from "@/lib/fs-types";

interface FolderGridProps {
  nodes: FSNode[];
  intro?: string[];
}

export function FolderGrid({ nodes, intro }: FolderGridProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex max-w-sm flex-col gap-2 rounded-lg border border-red-400/30 bg-red-400/[.03] p-4 text-left font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded border border-red-400/40 px-1.5 py-0.5 text-[10px] tracking-wide text-red-400/90 uppercase">
              503
            </span>
            <span className="text-foreground/60">content/loader.ts</span>
          </div>
          <p className="text-red-400/90">
            UnmountedSectionError: no content available
          </p>
          <p className="text-foreground/60">
            at &lt;FolderGrid /&gt; — site under active development
          </p>
          <p className="pt-1 text-foreground/60">
            Some data in this section isn&apos;t wired up yet — check back
            soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {intro && intro.length > 0 && (
        <div className="flex flex-col gap-1.5 border-b border-foreground/10 pb-4 text-sm text-foreground/70">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {nodes.map((node) => (
          <Link
            key={node.id}
            href={node.path}
            className="flex flex-col gap-1 rounded-lg border border-foreground/10 p-3 transition-colors hover:border-accent/50 hover:bg-accent/[.04]"
          >
            <span className="font-mono text-xs text-accent/60">
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
    </div>
  );
}
