"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { runCommand, type OutputLine } from "@/lib/terminal-commands";
import { toDisplayPath } from "@/lib/fs-utils";

interface HistoryEntry {
  id: number;
  prompt: string;
  input: string;
  lines: OutputLine[];
}

const toneClassName: Record<NonNullable<OutputLine["tone"]>, string> = {
  default: "text-accent/80",
  error: "text-red-400",
  muted: "text-accent/40",
  heading: "font-semibold text-accent text-glow",
};

let nextEntryId = 0;

export function Terminal() {
  const path = usePathname();
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const commandHistory = entries.map((entry) => entry.input).filter(Boolean);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight });
    }
  }, [entries]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = `${toDisplayPath(path)} >`;
    const result = runCommand(inputValue, path);

    if (result.clearScreen) {
      setEntries([]);
    } else {
      setEntries((prev) => [
        ...prev,
        { id: nextEntryId++, prompt, input: inputValue, lines: result.lines },
      ]);
    }

    if (result.navigateTo) router.push(result.navigateTo);
    setInputValue("");
    setHistoryIndex(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(commandHistory[nextIndex]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInputValue("");
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    }
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-terminal-surface font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto p-3">
        <p className="mb-3 text-accent/50">
          Welcome. Type <span className="text-accent/80">help</span> to get
          started, or use the explorer on the right.
        </p>
        {entries.map((entry) => (
          <div key={entry.id} className="mb-2">
            <div className="flex gap-2">
              <span className="text-accent/50">{entry.prompt}</span>
              <span className="text-accent/90">{entry.input}</span>
            </div>
            {entry.lines.map((line, index) => (
              <p key={index} className={toneClassName[line.tone ?? "default"]}>
                {line.text || " "}
              </p>
            ))}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label
            htmlFor="terminal-input"
            className="text-glow text-accent/70"
          >
            {toDisplayPath(path)} &gt;
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-accent caret-accent outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
