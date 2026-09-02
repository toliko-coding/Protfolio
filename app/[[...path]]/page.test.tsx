import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExplorerPage from "./page";

describe("ExplorerPage", () => {
  it("renders the root filesystem as a folder grid", async () => {
    const ui = await ExplorerPage({ params: Promise.resolve({}) });
    render(ui);
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("CyberSecurity")).toBeInTheDocument();
  });

  it("renders a nested project detail view from real content data", async () => {
    const ui = await ExplorerPage({
      params: Promise.resolve({ path: ["projects", "smsnet"] }),
    });
    render(ui);
    expect(screen.getByRole("heading", { name: "SMSNet" })).toBeInTheDocument();
  });
});
