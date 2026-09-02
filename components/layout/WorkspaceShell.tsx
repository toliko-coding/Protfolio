"use client";

import { useState, type ReactNode } from "react";
import { Panel } from "./Panel";

interface WorkspaceShellProps {
  terminal: ReactNode;
  explorer: ReactNode;
}

type CollapsedPanel = "terminal" | "explorer" | null;
type MobileTab = "explorer" | "terminal";

export function WorkspaceShell({ terminal, explorer }: WorkspaceShellProps) {
  const [collapsedPanel, setCollapsedPanel] = useState<CollapsedPanel>(null);
  // Below sm, only one panel is shown at a time — Explorer first, since most
  // visitors (recruiters) never need the terminal. At sm+ both show split,
  // and this tab state is simply unused.
  const [mobileTab, setMobileTab] = useState<MobileTab>("explorer");

  const terminalCollapsed = collapsedPanel === "terminal";
  const explorerCollapsed = collapsedPanel === "explorer";

  const terminalSize = terminalCollapsed
    ? ""
    : explorerCollapsed
      ? "sm:flex-1"
      : "sm:flex-[2]";
  const explorerSize = explorerCollapsed
    ? ""
    : terminalCollapsed
      ? "sm:flex-1"
      : "sm:flex-[3]";

  return (
    <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
      <div className="flex shrink-0 border-b border-foreground/10 sm:hidden">
        <button
          type="button"
          aria-pressed={mobileTab === "explorer"}
          onClick={() => setMobileTab("explorer")}
          className={`flex-1 border-b-2 px-3 py-2 font-mono text-xs tracking-wide uppercase ${
            mobileTab === "explorer"
              ? "border-accent text-accent"
              : "border-transparent text-foreground/60"
          }`}
        >
          Explorer
        </button>
        <button
          type="button"
          aria-pressed={mobileTab === "terminal"}
          onClick={() => setMobileTab("terminal")}
          className={`flex-1 border-b-2 px-3 py-2 font-mono text-xs tracking-wide uppercase ${
            mobileTab === "terminal"
              ? "border-accent text-accent"
              : "border-transparent text-foreground/60"
          }`}
        >
          Terminal
        </button>
      </div>

      <div
        className={`min-h-0 flex-1 sm:flex ${terminalSize} ${
          mobileTab === "terminal" ? "flex" : "hidden"
        }`}
      >
        <Panel
          title="Terminal"
          collapsed={terminalCollapsed}
          onToggle={() =>
            setCollapsedPanel(terminalCollapsed ? null : "terminal")
          }
          className="w-full"
        >
          {terminal}
        </Panel>
      </div>

      <div
        className={`min-h-0 flex-1 sm:flex sm:border-l sm:border-foreground/10 ${explorerSize} ${
          mobileTab === "explorer" ? "flex" : "hidden"
        }`}
      >
        <Panel
          title="Explorer"
          collapsed={explorerCollapsed}
          onToggle={() =>
            setCollapsedPanel(explorerCollapsed ? null : "explorer")
          }
          className="w-full"
        >
          {explorer}
        </Panel>
      </div>
    </div>
  );
}
