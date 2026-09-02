import Link from "next/link";
import type { FSNode } from "@/lib/fs-types";
import { BackIcon } from "@/components/ui/icons";

export function Breadcrumb({ trail }: { trail: FSNode[] }) {
  const parent = trail.length > 1 ? trail[trail.length - 2] : null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex shrink-0 flex-wrap items-center gap-2 border-b border-foreground/10 px-3 py-2 font-mono text-xs text-foreground/60"
    >
      {parent ? (
        <Link
          href={parent.path}
          aria-label="Back"
          className="flex items-center rounded p-0.5 hover:text-accent"
        >
          <BackIcon className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span aria-hidden="true" className="flex items-center p-0.5 text-foreground/15">
          <BackIcon className="h-3.5 w-3.5" />
        </span>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {trail.map((node, index) => {
          const isLast = index === trail.length - 1;
          const label = node.path === "/" ? "~" : node.name;
          return (
            <span key={node.id} className="flex items-center gap-1">
              {index > 0 && <span className="text-foreground/30">/</span>}
              {isLast ? (
                <span className="text-foreground/80">{label}</span>
              ) : (
                <Link
                  href={node.path}
                  className="hover:text-accent hover:underline"
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
