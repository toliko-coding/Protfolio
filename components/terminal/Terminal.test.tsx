import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Terminal navigates via next/navigation's router, which only exists inside
// a real Next.js app. This mock simulates it well enough that router.push
// actually changes what the next usePathname() call returns, matching real
// navigation behavior — the same mechanism the real Explorer relies on.
const mockRouter = vi.hoisted(() => ({ path: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mockRouter.path,
  useRouter: () => ({
    push: (path: string) => {
      mockRouter.path = path;
    },
  }),
}));

import { Terminal } from "./Terminal";

function getInput() {
  return screen.getByRole("textbox") as HTMLInputElement;
}

function runCommand(command: string) {
  const input = getInput();
  fireEvent.change(input, { target: { value: command } });
  fireEvent.submit(input.closest("form")!);
}

beforeEach(() => {
  mockRouter.path = "/";
});

describe("Terminal", () => {
  it("shows a welcome message and the root prompt", () => {
    render(<Terminal />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByLabelText("~ >")).toBeInTheDocument();
  });

  it("runs a command and echoes it with its output", () => {
    render(<Terminal />);
    runCommand("ls");
    expect(screen.getByText("ls")).toBeInTheDocument();
    expect(screen.getByText("Projects/")).toBeInTheDocument();
  });

  it("updates the prompt after cd and reflects it in pwd output", () => {
    render(<Terminal />);
    runCommand("cd projects");
    expect(screen.getByLabelText("~/projects >")).toBeInTheDocument();
    runCommand("pwd");
    expect(screen.getByText("~/projects")).toBeInTheDocument();
  });

  it("clears prior output on `clear`", () => {
    render(<Terminal />);
    runCommand("ls");
    expect(screen.getByText("Projects/")).toBeInTheDocument();
    runCommand("clear");
    expect(screen.queryByText("Projects/")).not.toBeInTheDocument();
  });

  it("navigates the shared route on open, confirming rather than duplicating the detail", () => {
    render(<Terminal />);
    runCommand("open about");
    expect(mockRouter.path).toBe("/about");
    expect(screen.getByText(/opened about/i)).toBeInTheDocument();
  });

  it("recalls previous commands with ArrowUp", () => {
    render(<Terminal />);
    runCommand("pwd");
    runCommand("ls");
    const input = getInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("ls");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("pwd");
  });
});
