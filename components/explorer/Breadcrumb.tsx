import Link from "next/link";
import type { FSNode } from "@/lib/fs-types";

export function Breadcrumb({ trail }: { trail: FSNode[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex shrink-0 flex-wrap items-center gap-1 border-b border-foreground/10 px-3 py-2 font-mono text-xs text-foreground/60"
    >
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
    </nav>
  );
}
