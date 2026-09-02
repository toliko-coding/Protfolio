import { act, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

// The boot sequence takes a few real seconds; advancing fake time past it
// (without running the still-recurring idle placeholder loop indefinitely,
// which vi.runAllTimers() would) flushes it deterministically.
function flushBoot() {
  act(() => {
    vi.advanceTimersByTime(20_000);
  });
}

// Boot now really navigates (ending on About), so tests that only care about
// fresh interaction start from a clean slate rather than colliding with
// whatever the boot script happened to print.
function renderBooted() {
  render(<Terminal />);
  flushBoot();
  runCommand("clear");
}

beforeEach(() => {
  mockRouter.path = "/";
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Terminal", () => {
  it("shows a welcome message and the root prompt immediately", () => {
    render(<Terminal />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByLabelText("~ >")).toBeInTheDocument();
  });

  it("runs a command and echoes it with its output", () => {
    renderBooted();
    runCommand("ls");
    expect(screen.getByText("ls")).toBeInTheDocument();
    expect(screen.getByText("Projects/")).toBeInTheDocument();
  });

  it("updates the prompt after cd and reflects it in pwd output", () => {
    renderBooted();
    runCommand("cd projects");
    expect(screen.getByLabelText("~/projects >")).toBeInTheDocument();
    runCommand("pwd");
    expect(screen.getByText("~/projects")).toBeInTheDocument();
  });

  it("clears prior output on `clear`", () => {
    renderBooted();
    runCommand("ls");
    expect(screen.getByText("Projects/")).toBeInTheDocument();
    runCommand("clear");
    expect(screen.queryByText("Projects/")).not.toBeInTheDocument();
  });

  it("navigates the shared route on open, confirming rather than duplicating the detail", () => {
    renderBooted();
    runCommand("open skills");
    expect(mockRouter.path).toBe("/skills");
    expect(screen.getByText(/opened skills/i)).toBeInTheDocument();
  });

  it("recalls previous commands with ArrowUp", () => {
    renderBooted();
    runCommand("pwd");
    runCommand("ls");
    const input = getInput();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("ls");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("pwd");
  });

  describe("boot sequence", () => {
    it("is read-only while booting", () => {
      render(<Terminal />);
      expect(getInput()).toHaveAttribute("readonly");
    });

    it("types and executes real commands automatically, ending navigated to About", () => {
      render(<Terminal />);
      flushBoot();
      // The scripted sequence includes `cd projects` and `open SMSNet` —
      // real commands run through the real engine, not scripted text — and
      // ends on the real About route so the Explorer follows along live.
      expect(screen.getByText("cd projects")).toBeInTheDocument();
      expect(screen.getByText(/opened smsnet/i)).toBeInTheDocument();
      expect(screen.getByText(/opened about/i)).toBeInTheDocument();
      expect(mockRouter.path).toBe("/about");
      expect(getInput()).not.toHaveAttribute("readonly");
    });

    it("skips immediately on click, leaving the input interactive", () => {
      render(<Terminal />);
      fireEvent.click(screen.getByText(/welcome/i));
      expect(getInput()).not.toHaveAttribute("readonly");
    });

    it("does not run when landing on a deep link, so the link isn't hijacked", () => {
      mockRouter.path = "/projects/walletradar";
      render(<Terminal />);
      expect(getInput()).not.toHaveAttribute("readonly");
      expect(mockRouter.path).toBe("/projects/walletradar");
    });
  });

  describe("idle placeholder", () => {
    it("animates the empty input's placeholder once booted, rather than staying static", () => {
      render(<Terminal />);
      flushBoot();

      const seen = new Set<string>();
      for (let i = 0; i < 10; i++) {
        act(() => {
          vi.advanceTimersByTime(300);
        });
        seen.add(getInput().placeholder);
      }

      expect(seen.size).toBeGreaterThan(1);
    });
  });
});
