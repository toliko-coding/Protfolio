import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypewriterHeading } from "./TypewriterHeading";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TypewriterHeading", () => {
  it("has the full text as its accessible name even before the animation finishes", () => {
    render(<TypewriterHeading text="SMSNet" />);
    // The animated span starts empty and is aria-hidden — the accessible
    // name must come from the always-complete sr-only span instead.
    expect(
      screen.getByRole("heading", { name: "SMSNet" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(90);
    });
    expect(
      screen.getByRole("heading", { name: "SMSNet" }),
    ).toBeInTheDocument();
  });

  it("types the visible text out to completion", () => {
    render(<TypewriterHeading text="About" />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const heading = screen.getByRole("heading", { name: "About" });
    expect(heading.querySelector("[aria-hidden]")?.textContent).toContain(
      "About",
    );
  });

  it("retypes cleanly from empty when remounted with a new key, as callers do on navigation", () => {
    const { rerender } = render(
      <TypewriterHeading key="SMSNet" text="SMSNet" />,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    rerender(<TypewriterHeading key="WalletRadar" text="WalletRadar" />);

    // Immediately after the key changes (fresh mount), the visible span is
    // empty again — the old title doesn't linger or flash.
    const heading = screen.getByRole("heading", { name: "WalletRadar" });
    expect(heading.querySelector("[aria-hidden]")?.textContent?.trim()).toBe(
      "",
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(heading.querySelector("[aria-hidden]")?.textContent).toContain(
      "WalletRadar",
    );
  });
});
