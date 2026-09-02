import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceShell } from "./WorkspaceShell";

function renderShell() {
  return render(
    <WorkspaceShell
      terminal={<p>terminal content</p>}
      explorer={<p>explorer content</p>}
    />,
  );
}

describe("WorkspaceShell", () => {
  it("renders both panels by default", () => {
    renderShell();
    expect(screen.getByText("terminal content")).toBeInTheDocument();
    expect(screen.getByText("explorer content")).toBeInTheDocument();
  });

  it("collapses the terminal panel to a rail, and can expand it again", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: /collapse terminal/i }));

    expect(screen.queryByText("terminal content")).not.toBeInTheDocument();
    expect(screen.getByText("explorer content")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /expand terminal/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /expand terminal/i }));

    expect(screen.getByText("terminal content")).toBeInTheDocument();
  });

  it("collapses the explorer panel to a rail, and can expand it again", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: /collapse explorer/i }));

    expect(screen.queryByText("explorer content")).not.toBeInTheDocument();
    expect(screen.getByText("terminal content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /expand explorer/i }));

    expect(screen.getByText("explorer content")).toBeInTheDocument();
  });

  describe("mobile tabs", () => {
    it("defaults to Explorer active, and switches to Terminal on click", () => {
      renderShell();

      expect(
        screen.getByRole("button", { name: "Explorer", pressed: true }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Terminal", pressed: false }),
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: "Terminal", pressed: false }),
      );

      expect(
        screen.getByRole("button", { name: "Terminal", pressed: true }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Explorer", pressed: false }),
      ).toBeInTheDocument();
    });
  });
});
