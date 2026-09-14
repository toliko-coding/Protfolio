import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlitchText } from "./GlitchText";

const TEXT = "Click through the folders below";

// The text a layout engine actually flows: everything except the
// aria-hidden overlay glyphs.
function inFlowText(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[aria-hidden='true']").forEach((node) => node.remove());
  return clone.textContent ?? "";
}

beforeEach(() => {
  vi.useFakeTimers();
  // 0.5 keeps every character scrambled for the first few steps (lock steps
  // land well past step 1) and puts the first decode at a known 6.5s.
  vi.spyOn(Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("GlitchText", () => {
  it("renders its text as-is while resting", () => {
    const { container } = render(<GlitchText text={TEXT} />);
    expect(container.textContent).toBe(TEXT);
    expect(container.querySelector(".matrix-decode")).toBeNull();
  });

  it("keeps the real characters in the flow while decoding, so the text can't reflow", () => {
    const { container } = render(<GlitchText text={TEXT} />);

    act(() => {
      vi.advanceTimersByTime(6500 + 45 * 2);
    });

    expect(container.querySelector(".matrix-decode")).not.toBeNull();
    // Scrambled glyphs are showing on top...
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
    // ...but the characters that set the line boxes are exactly the original.
    expect(inFlowText(container)).toBe(TEXT);
  });

  it("settles back to plain text once the decode finishes", () => {
    const { container } = render(<GlitchText text={TEXT} />);

    act(() => {
      vi.advanceTimersByTime(6500 + 1000);
    });

    expect(container.querySelector(".matrix-decode")).toBeNull();
    expect(container.textContent).toBe(TEXT);
  });
});
