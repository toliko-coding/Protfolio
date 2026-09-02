import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Explorer } from "./Explorer";
import type { FolderNode, PageNode, ProjectNode } from "@/lib/fs-types";

const project: ProjectNode = {
  id: "demo",
  slug: "demo",
  name: "Demo Project",
  path: "/projects/demo",
  type: "project",
  tags: ["software", "security"],
  summary: "A demo project summary.",
  role: "Solo developer",
  problem: "Solved a demo problem.",
  techStack: ["TypeScript", "Next.js"],
  links: { github: "https://github.com/example/demo" },
};

const folderWithChildren: FolderNode = {
  id: "projects",
  slug: "projects",
  name: "Projects",
  path: "/projects",
  type: "folder",
  children: [project],
};

const emptyFolder: FolderNode = {
  id: "programming",
  slug: "programming",
  name: "Programming",
  path: "/programming",
  type: "folder",
  children: [],
};

const page: PageNode = {
  id: "about",
  slug: "about",
  name: "About",
  path: "/about",
  type: "page",
  description: "Who I am.",
  body: "Placeholder body text.",
};

describe("Explorer", () => {
  it("renders a folder as a card grid with a breadcrumb", () => {
    render(<Explorer node={folderWithChildren} />);
    expect(screen.getByText("Demo Project")).toBeInTheDocument();
    expect(screen.getByText("~")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("shows an empty state for a folder with no children", () => {
    render(<Explorer node={emptyFolder} />);
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
  });

  it("renders the project detail view for a project node", () => {
    render(<Explorer node={project} />);
    expect(
      screen.getByRole("heading", { name: "Demo Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Solo developer")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/example/demo",
    );
  });

  it("renders the page detail view for a page node", () => {
    render(<Explorer node={page} />);
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByText("Placeholder body text.")).toBeInTheDocument();
  });
});
