"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BOOT_FINISHED_EVENT } from "@/lib/boot-events";

// Mirrors the Terminal's own boot condition (only the initial landing on
// root, never a deep link) — same pattern the rest of the app already uses
// to keep Terminal/Explorer in sync purely through the shared route. The
// offline state itself now ends on BOOT_FINISHED_EVENT rather than a fixed
// timer, so it lasts exactly as long as the terminal's real boot sequence —
// including a click-to-skip — instead of a guessed duration that used to
// let the Explorer come online mid-sequence and visibly jump between pages
// underneath the boot commands still typing.
//
// FALLBACK_MS is only a backstop for the unlikely case the event never
// fires (e.g. Terminal failed to mount) — real boot runs in ~9s.
const FALLBACK_MS = 15000;

const STATUS_LINES = [
  "Authenticating session…",
  "Establishing secure channel…",
  "Bypassing root ACLs…",
  "Mounting filesystem…",
  "Syncing Explorer state…",
];
const STATUS_CYCLE_MS = 1800;

function useStatusLine(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % STATUS_LINES.length);
    }, STATUS_CYCLE_MS);
    return () => clearInterval(id);
  }, [active]);

  return STATUS_LINES[index];
}

export function ExplorerBootGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const [offline, setOffline] = useState(initialPath === "/");
  const statusLine = useStatusLine(offline);

  useEffect(() => {
    if (initialPath !== "/") return;

    const goOnline = () => setOffline(false);
    window.addEventListener(BOOT_FINISHED_EVENT, goOnline);
    const fallback = setTimeout(goOnline, FALLBACK_MS);

    return () => {
      window.removeEventListener(BOOT_FINISHED_EVENT, goOnline);
      clearTimeout(fallback);
    };
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
        <p className="text-foreground/40">{statusLine}</p>
      </div>
    </div>
  );
}
