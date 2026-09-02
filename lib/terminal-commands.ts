import { filesystem } from "@/content/filesystem";
import { isFolder, type FolderNode } from "./fs-types";
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

const pwdCommand: Command = {
  name: "pwd",
  summary: "Print the current path.",
  run: ({ currentPath }) => ({
    lines: [{ text: toDisplayPath(currentPath) }],
  }),
};

const lsCommand: Command = {
  name: "ls",
  aliases: ["dir"],
  summary: "List the contents of the current folder.",
  run: ({ currentPath }) => {
    const folder = currentFolder(currentPath);
    if (folder.children.length === 0) {
      return { lines: [{ text: "Nothing here yet.", tone: "muted" }] };
    }
    return {
      lines: folder.children.map((child) => ({
        text: isFolder(child) ? `${child.name}/` : child.name,
      })),
    };
  },
};

const cdCommand: Command = {
  name: "cd",
  summary: "Change the current folder — try `cd <name>`, `cd ..`, or `cd ~`.",
  run: ({ currentPath, args }) => {
    const target = args[0];

    if (!target || target === "~" || target === "/") {
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
