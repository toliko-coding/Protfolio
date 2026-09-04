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

  // sm:flex-none on the collapsed side matters, not just cosmetic — without
  // it, the base (unprefixed, mobile-default) flex-1 below still applies at
  // sm+ too, so the collapsed wrapper grows to share space equally instead
  // of shrinking to its w-10 strip, and the "collapsed" panel ends up
  // covering half the screen instead of tucking away.
  // 1:2 (down from 2:3) gives the Explorer a bit more of the split by default.
  const terminalSize = terminalCollapsed
    ? "sm:flex-none"
    : explorerCollapsed
      ? "sm:flex-1"
      : "sm:flex-[1]";
  const explorerSize = explorerCollapsed
    ? "sm:flex-none"
    : terminalCollapsed
      ? "sm:flex-1"
      : "sm:flex-[2]";

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
