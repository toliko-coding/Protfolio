import type { ReactNode } from "react";
import { CollapseIcon, ExpandIcon } from "@/components/ui/icons";

interface PanelProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
  children: ReactNode;
}

export function Panel({
  title,
  collapsed,
  onToggle,
  className = "",
  children,
}: PanelProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Expand ${title}`}
        className={`hidden w-10 shrink-0 flex-col items-center gap-3 bg-foreground/[.03] py-3 hover:bg-accent/[.08] sm:flex ${className}`}
      >
        <ExpandIcon className="h-4 w-4 text-accent/60" />
        <span className="[writing-mode:vertical-rl] rotate-180 font-mono text-xs tracking-wide text-foreground/60">
          {title}
        </span>
      </button>
    );
  }

  return (
    <section className={`flex min-w-0 flex-col overflow-hidden ${className}`}>
      <div className="hidden shrink-0 items-center justify-between px-3 py-2 sm:flex">
        <span className="font-mono text-xs tracking-wide text-foreground/60">
          {title}
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Collapse ${title}`}
          className="rounded p-1 text-foreground/40 hover:bg-accent/[.08] hover:text-accent"
        >
          <CollapseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  );
}
