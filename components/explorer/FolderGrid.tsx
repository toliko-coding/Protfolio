import Link from "next/link";
import type { FSNode } from "@/lib/fs-types";
import { isFolder, isProject } from "@/lib/fs-types";
import { CodeIcon, FileIcon, FolderIcon } from "@/components/ui/icons";
import { GlitchText } from "./GlitchText";
import { SystemFetch } from "./SystemFetch";

interface FolderGridProps {
  nodes: FSNode[];
  intro?: string[];
}

function NodeIcon({ node, className }: { node: FSNode; className?: string }) {
  if (isFolder(node)) return <FolderIcon className={className} />;
  if (isProject(node)) return <CodeIcon className={className} />;
  return <FileIcon className={className} />;
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
            <p key={paragraph}>
              <GlitchText text={paragraph} />
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {nodes.map((node) => (
          <Link
            key={node.id}
            href={node.path}
            className="group flex flex-col gap-2 rounded-lg border border-foreground/10 p-3 transition-colors hover:border-accent/50 hover:bg-accent/[.04] hover:shadow-[0_0_16px_-8px_var(--color-accent)]"
          >
            <div className="flex items-center gap-2">
              <NodeIcon
                node={node}
                className="h-4 w-4 shrink-0 text-accent/50 transition-colors group-hover:text-accent"
              />
              <span className="font-mono text-[10px] tracking-wide text-foreground/40 uppercase">
                {isFolder(node) ? "dir" : node.type}
              </span>
            </div>
            <span className="truncate font-mono text-sm font-medium">
              {node.name}
            </span>
            {isProject(node) && (
              <div className="flex flex-wrap gap-1">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/30 px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-accent/70 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {isProject(node) && (
              <span className="line-clamp-2 text-xs text-foreground/60">
                {node.summary}
              </span>
            )}
            {!isProject(node) && node.description && (
              <span className="line-clamp-2 text-xs text-foreground/60">
                {node.description}
              </span>
            )}
          </Link>
        ))}
      </div>
      <SystemFetch />
    </div>
  );
}
