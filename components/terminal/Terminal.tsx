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
  muted: "text-accent/60",
  heading: "font-semibold text-accent text-glow",
};

// Plays once on first load, using the real command engine and real
// navigation — the Explorer panel follows along live. Only runs when landing
// on the root path; a deep link to a specific project/page skips straight
// there instead of being hijacked away from what the visitor actually opened.
const BOOT_COMMANDS = [
  "connect",
  "pwd",
  "ls",
  "cd projects",
  "clear",
  "cd root",
  "help",
];
const BOOT_CHAR_DELAY = 45;
const BOOT_POST_TYPE_DELAY = 350;
const BOOT_POST_OUTPUT_DELAY = 500;

// Idle typing hint shown in the input placeholder — only visible when the
// input is empty (native placeholder behavior), so it never fights real input.
const IDLE_SUGGESTIONS = ["ls", "cd projects", "open SMSNet", "help", "cd cybersecurity"];
const IDLE_CHAR_DELAY = 70;
const IDLE_HOLD_DELAY = 1100;
const IDLE_DELETE_DELAY = 35;
const IDLE_NEXT_DELAY = 400;

let nextEntryId = 0;

function useIdlePlaceholder(enabled: boolean) {
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let index = 0;

    function typeOut(text: string, onDone: () => void) {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i++;
        setPlaceholder(text.slice(0, i));
        timeoutId = setTimeout(
          i < text.length ? step : onDone,
          i < text.length ? IDLE_CHAR_DELAY : IDLE_HOLD_DELAY,
        );
      };
      step();
    }

    function deleteOut(text: string, onDone: () => void) {
      let i = text.length;
      const step = () => {
        if (cancelled) return;
        i--;
        setPlaceholder(text.slice(0, i));
        timeoutId = setTimeout(
          i > 0 ? step : onDone,
          i > 0 ? IDLE_DELETE_DELAY : IDLE_NEXT_DELAY,
        );
      };
      step();
    }

    function cycle() {
      if (cancelled) return;
      const text = IDLE_SUGGESTIONS[index % IDLE_SUGGESTIONS.length];
      typeOut(text, () => {
        deleteOut(text, () => {
          index++;
          cycle();
        });
      });
    }

    timeoutId = setTimeout(cycle, 600);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [enabled]);

  return enabled ? placeholder : "";
}

export function Terminal() {
  const path = usePathname();
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isBooting, setIsBooting] = useState(path === "/");
  const [typedCommand, setTypedCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const skipBootRef = useRef<() => void>(() => {});
  const routerRef = useRef(router);
  const initialPathRef = useRef(path);

  const commandHistory = entries.map((entry) => entry.input).filter(Boolean);
  const placeholder = useIdlePlaceholder(!isBooting);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight });
    }
  }, [entries, typedCommand]);

  useEffect(() => {
    if (initialPathRef.current !== "/") {
      setIsBooting(false);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentPath = "/";

    const finish = () => {
      cancelled = true;
      clearTimeout(timeoutId);
      setTypedCommand("");
      setIsBooting(false);
    };
    skipBootRef.current = finish;

    function typeCommand(command: string, onDone: () => void) {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i++;
        setTypedCommand(command.slice(0, i));
        timeoutId = setTimeout(
          i < command.length ? step : onDone,
          i < command.length ? BOOT_CHAR_DELAY : BOOT_POST_TYPE_DELAY,
        );
      };
      step();
    }

    function runNext(index: number) {
      if (cancelled) return;
      if (index >= BOOT_COMMANDS.length) {
        finish();
        return;
      }
      const command = BOOT_COMMANDS[index];
      typeCommand(command, () => {
        if (cancelled) return;
        const prompt = `${toDisplayPath(currentPath)} >`;
        const result = runCommand(command, currentPath);
        if (result.navigateTo) {
          currentPath = result.navigateTo;
          routerRef.current.push(currentPath);
        }
        if (result.clearScreen) {
          setEntries([]);
        } else {
          setEntries((prev) => [
            ...prev,
            { id: nextEntryId++, prompt, input: command, lines: result.lines },
          ]);
        }
        setTypedCommand("");
        timeoutId = setTimeout(() => runNext(index + 1), BOOT_POST_OUTPUT_DELAY);
      });
    }

    timeoutId = setTimeout(() => runNext(0), 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isBooting) return;

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
      onClick={() => {
        if (isBooting) skipBootRef.current();
        inputRef.current?.focus();
      }}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto p-3">
        <p className="mb-3 text-accent/60">
          Welcome. Type <span className="text-accent/80">help</span> to get
          started, or use the Explorer.
        </p>
        {entries.map((entry) => (
          <div key={entry.id} className="mb-2">
            <div className="flex gap-2">
              <span className="text-accent/60">{entry.prompt}</span>
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
            value={isBooting ? typedCommand : inputValue}
            onChange={(event) =>
              !isBooting && setInputValue(event.target.value)
            }
            onKeyDown={handleKeyDown}
            readOnly={isBooting}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-accent caret-accent placeholder:text-accent/30"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
