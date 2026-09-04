import { filesystem } from "@/content/filesystem";
import { isFolder, type FolderNode, type FSNode } from "./fs-types";
import { findChildByName, getParentPath, resolvePath, toDisplayPath } from "./fs-utils";

export type OutputTone = "default" | "error" | "muted" | "heading";

export interface OutputLine {
  text: string;
  tone?: OutputTone;
}

export interface CommandContext {
  currentPath: string;
  args: string[];
}

export interface CommandResult {
  lines: OutputLine[];
  // Path to navigate the shared route to (folder from `cd`, or a leaf from `open`).
  navigateTo?: string;
  clearScreen?: boolean;
}

export interface Command {
  name: string;
  aliases?: string[];
  summary: string;
  run: (ctx: CommandContext) => CommandResult;
}

// currentPath reflects wherever the shared route currently points, which can be
// a leaf node (e.g. after `open`) — relative lookups (`ls`, `cd <name>`, `open
// <name>`) always resolve against the nearest enclosing folder, not the leaf itself.
function currentFolder(currentPath: string): FolderNode {
  const node = resolvePath(currentPath);
  if (node && isFolder(node)) return node;

  const parent = resolvePath(getParentPath(currentPath));
  return parent && isFolder(parent) ? parent : filesystem;
}

const connectCommand: Command = {
  name: "connect",
  summary: "Connect to the anatolikot CLI.",
  run: () => ({
    lines: [
      { text: "Connecting to anatolikot CLI...", tone: "muted" },
      { text: "Connection established. Welcome, root.", tone: "heading" },
    ],
  }),
};

const pwdCommand: Command = {
  name: "pwd",
  summary: "Print the current path.",
  run: ({ currentPath }) => ({
    lines: [{ text: toDisplayPath(currentPath) }],
  }),
};

// Everything here is read-only content, not a real filesystem — every entry
// reports the same r--r--r-- permissions (no write, no execute) rather than
// pretending folders are traversable or pages are runnable.
function permissionsFor(child: FSNode): string {
  return `${isFolder(child) ? "d" : "-"}r--r--r--`;
}

const typeLabel: Record<"folder" | "project" | "page", string> = {
  folder: "dir",
  project: "project",
  page: "page",
};

const lsCommand: Command = {
  name: "ls",
  aliases: ["dir"],
  summary: "List the contents of the current folder.",
  run: ({ currentPath }) => {
    const folder = currentFolder(currentPath);
    if (folder.children.length === 0) {
      return {
        lines: [
          {
            text: "503 UnmountedSectionError: no content available",
            tone: "error",
          },
          {
            text: "Some data in this section isn't wired up yet — check back soon.",
            tone: "muted",
          },
        ],
      };
    }
    return {
      lines: folder.children.map((child) => ({
        text: `${permissionsFor(child)}  ${typeLabel[child.type].padEnd(7)}  ${
          isFolder(child) ? `${child.name}/` : child.name
        }`,
      })),
    };
  },
};

const cdCommand: Command = {
  name: "cd",
  summary: "Change the current folder — try `cd <name>`, `cd ..`, or `cd ~`.",
  run: ({ currentPath, args }) => {
    const target = args[0];

    if (!target || target === "~" || target === "/" || target === "root") {
      return { lines: [], navigateTo: "/" };
    }

    if (target === "..") {
      return { lines: [], navigateTo: getParentPath(currentPath) };
    }

    const folder = currentFolder(currentPath);
    const match = findChildByName(folder, target);

    if (!match) {
      return {
        lines: [
          { text: `cd: no such file or directory: ${target}`, tone: "error" },
          { text: "Try `ls` to see what's here.", tone: "muted" },
        ],
      };
    }

    if (!isFolder(match)) {
      return {
        lines: [
          { text: `cd: not a directory: ${target}`, tone: "error" },
          { text: `Try \`open ${target}\` instead.`, tone: "muted" },
        ],
      };
    }

    return { lines: [], navigateTo: match.path };
  },
};

const openCommand: Command = {
  name: "open",
  summary: "Open a project or page — e.g. `open SMSNet`.",
  run: ({ currentPath, args }) => {
    const target = args[0];

    if (!target) {
      return { lines: [{ text: "Usage: open <name>", tone: "error" }] };
    }

    const folder = currentFolder(currentPath);
    const match = findChildByName(folder, target);

    if (!match) {
      return {
        lines: [
          { text: `open: no such file or directory: ${target}`, tone: "error" },
          { text: "Try `ls` to see what's here.", tone: "muted" },
        ],
      };
    }

    if (isFolder(match)) {
      return {
        lines: [
          { text: `open: ${target} is a directory`, tone: "error" },
          { text: `Try \`cd ${target}\` instead.`, tone: "muted" },
        ],
      };
    }

    // Navigate the shared route so the explorer shows the full detail view —
    // the terminal just confirms rather than duplicating that content inline.
    return {
      lines: [{ text: `Opened ${match.name} — see the explorer.`, tone: "muted" }],
      navigateTo: match.path,
    };
  },
};

const clearCommand: Command = {
  name: "clear",
  summary: "Clear the terminal output.",
  run: () => ({ lines: [], clearScreen: true }),
};

const helpCommand: Command = {
  name: "help",
  summary: "List available commands.",
  run: () => ({
    lines: commands.map((command) => ({
      text: `${[command.name, ...(command.aliases ?? [])].join(", ")} — ${command.summary}`,
    })),
  }),
};

export const commands: Command[] = [
  connectCommand,
  pwdCommand,
  lsCommand,
  cdCommand,
  openCommand,
  clearCommand,
  helpCommand,
];

export function runCommand(input: string, currentPath: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const lowerName = name.toLowerCase();
  const command = commands.find(
    (c) => c.name === lowerName || c.aliases?.includes(lowerName),
  );

  if (!command) {
    return {
      lines: [
        { text: `command not found: ${name}`, tone: "error" },
        { text: "Type `help` for a list of commands.", tone: "muted" },
      ],
    };
  }

  return command.run({ currentPath, args });
}

export interface CompletionResult {
  // The full input string to replace the current one with — either a fully
  // completed word (trailing space added) or as far as an unambiguous
  // common prefix reaches.
  completed?: string;
  // Shown as output (like bash's double-Tab listing) when several
  // candidates match and completion can't make further progress.
  suggestions?: string[];
}

function longestCommonPrefix(words: string[]): string {
  let prefix = words[0] ?? "";
  for (const word of words.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < word.length && prefix[i].toLowerCase() === word[i].toLowerCase()) {
      i++;
    }
    prefix = prefix.slice(0, i);
    if (!prefix) break;
  }
  return prefix;
}

// Classic edit distance — used only as a fallback so a small typo (one
// swapped/missing/extra letter) can still resolve to the word that was
// obviously meant, the way real shells never quite manage to.
function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Resolves one word (a command name, or a cd/open argument) against a pool
// of candidates: exact-prefix matches first, falling back to the closest
// typo-tolerant match only when no prefix matches at all.
function resolveWord(
  prefix: string,
  pool: string[],
): { word?: string; isFinal?: boolean; suggestions?: string[] } {
  const lowerPrefix = prefix.toLowerCase();
  let matches = pool.filter((item) => item.toLowerCase().startsWith(lowerPrefix));

  if (matches.length === 0 && prefix) {
    const [best] = [...pool]
      .map((item) => ({ item, distance: levenshtein(lowerPrefix, item.toLowerCase()) }))
      .sort((a, b) => a.distance - b.distance);
    if (best && best.distance > 0 && best.distance <= Math.max(2, Math.ceil(prefix.length / 2))) {
      matches = [best.item];
    }
  }

  if (matches.length === 0) return {};
  if (matches.length === 1) return { word: matches[0], isFinal: true };

  const commonPrefix = longestCommonPrefix(matches);
  if (commonPrefix.length > prefix.length) return { word: commonPrefix };
  return { suggestions: [...matches].sort() };
}

// Tab-completion for the terminal input — completes the command name itself
// (first word), or a cd/open target against the current folder's children,
// tolerating an unfinished or slightly misspelled word the same way.
export function getCompletions(input: string, currentPath: string): CompletionResult {
  const hasTrailingSpace = /\s$/.test(input);
  const parts = input.trim().split(/\s+/).filter(Boolean);
  const completingCommand = parts.length === 0 || (parts.length === 1 && !hasTrailingSpace);

  if (completingCommand) {
    const names = new Set<string>();
    for (const command of commands) {
      names.add(command.name);
      command.aliases?.forEach((alias) => names.add(alias));
    }
    const result = resolveWord(parts[0] ?? "", [...names]);
    if (!result.word) return { suggestions: result.suggestions };
    return { completed: result.isFinal ? `${result.word} ` : result.word };
  }

  const commandName = parts[0].toLowerCase();
  const command = commands.find(
    (c) => c.name === commandName || c.aliases?.includes(commandName),
  );
  if (!command || (command.name !== "cd" && command.name !== "open")) return {};

  const argPrefix = hasTrailingSpace ? "" : (parts[parts.length - 1] ?? "");
  const pool = currentFolder(currentPath).children.map((child) => child.name);
  const result = resolveWord(argPrefix, pool);
  if (!result.word) return { suggestions: result.suggestions };

  const before = hasTrailingSpace ? parts.join(" ") : parts.slice(0, -1).join(" ");
  const full = `${before}${before ? " " : ""}${result.word}`;
  return { completed: result.isFinal ? `${full} ` : full };
}
