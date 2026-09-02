"use client";

import { useState, type ReactNode } from "react";
import { Panel } from "./Panel";

interface WorkspaceShellProps {
  terminal: ReactNode;
  explorer: ReactNode;
}

type CollapsedPanel = "terminal" | "explorer" | null;

export function WorkspaceShell({ terminal, explorer }: WorkspaceShellProps) {
  const [collapsedPanel, setCollapsedPanel] = useState<CollapsedPanel>(null);

  const terminalCollapsed = collapsedPanel === "terminal";
  const explorerCollapsed = collapsedPanel === "explorer";

  return (
    <div className="flex min-h-0 flex-1 divide-x divide-foreground/10">
      <Panel
        title="Terminal"
        collapsed={terminalCollapsed}
        onToggle={() =>
          setCollapsedPanel(terminalCollapsed ? null : "terminal")
        }
        className={
          terminalCollapsed ? "" : explorerCollapsed ? "flex-1" : "flex-[2]"
        }
      >
        {terminal}
      </Panel>
      <Panel
        title="Explorer"
        collapsed={explorerCollapsed}
        onToggle={() =>
          setCollapsedPanel(explorerCollapsed ? null : "explorer")
        }
        className={
          explorerCollapsed ? "" : terminalCollapsed ? "flex-1" : "flex-[3]"
        }
      >
        {explorer}
      </Panel>
    </div>
  );
}
