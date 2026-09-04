"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

// Mirrors the Terminal's own boot condition (only the initial landing on
// root, never a deep link) without the two talking to each other directly —
// same pattern the rest of the app already uses to keep Terminal/Explorer
// in sync purely through the shared route.
const OFFLINE_DURATION_MS = 1200;

export function ExplorerBootGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const [offline, setOffline] = useState(initialPath === "/");

  useEffect(() => {
    if (initialPath !== "/") return;
    const id = setTimeout(() => setOffline(false), OFFLINE_DURATION_MS);
    return () => clearTimeout(id);
  }, [initialPath]);

  if (!offline) return <>{children}</>;

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3 font-mono text-xs">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <p className="tracking-wide text-accent/70 uppercase">
          Explorer offline
        </p>
        <p className="text-foreground/40">
          Awaiting connection to anatolikot CLI…
        </p>
      </div>
    </div>
  );
}
