"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/ui/icons";

export function AndroidDownloadButton() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!showNotice) return;
    const timeout = setTimeout(() => setShowNotice(false), 3500);
    return () => clearTimeout(timeout);
  }, [showNotice]);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setShowNotice(true)}
        className="flex items-center gap-1.5 rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
      >
        <DownloadIcon className="h-4 w-4" />
        Get it on Android
      </button>
      {showNotice && (
        <div
          role="status"
          className="absolute top-full left-0 z-10 mt-2 w-56 rounded border border-accent/30 bg-terminal-surface p-2 font-mono text-xs text-accent/80 shadow-[0_0_16px_-4px_var(--color-accent)]"
        >
          Not fully deployed yet — check back soon.
        </div>
      )}
    </div>
  );
}
