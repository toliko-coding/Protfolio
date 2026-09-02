import { act, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AndroidDownloadButton } from "./AndroidDownloadButton";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("AndroidDownloadButton", () => {
  it("shows a not-deployed notice on click, and auto-dismisses it", () => {
    render(<AndroidDownloadButton />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /get it on android/i }));
    expect(screen.getByRole("status")).toHaveTextContent(
      /not fully deployed yet/i,
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
