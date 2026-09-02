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
  intro: ["A short intro paragraph."],
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
  image: { src: "/portrait.jpg", alt: "Portrait", width: 100, height: 100 },
  sections: [
    { paragraphs: ["A paragraph about me."] },
    { heading: "Skills", items: ["TypeScript", "Python"] },
    {
      image: {
        src: "/about-dashboard.png",
        alt: "Dashboard concept",
        width: 200,
        height: 150,
      },
    },
  ],
};

describe("Explorer", () => {
  it("renders a folder as a card grid with a breadcrumb", () => {
    render(<Explorer node={folderWithChildren} />);
    expect(screen.getByText("Demo Project")).toBeInTheDocument();
    expect(screen.getByText("~")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("shows the folder's intro text above the card grid when provided", () => {
    render(<Explorer node={folderWithChildren} />);
    expect(screen.getByText("A short intro paragraph.")).toBeInTheDocument();
  });

  it("shows a Back link to the parent folder when not at root", () => {
    render(<Explorer node={folderWithChildren} />);
    expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("has no interactive Back link at the root", () => {
    const root: FolderNode = {
      id: "root",
      slug: "",
      name: "portfolio",
      path: "/",
      type: "folder",
      children: [project],
    };
    render(<Explorer node={root} />);
    expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
  });

  it("shows a maintenance error state for a folder with no children", () => {
    render(<Explorer node={emptyFolder} />);
    expect(screen.getByText("503")).toBeInTheDocument();
    expect(screen.getByText(/no content available/i)).toBeInTheDocument();
    expect(screen.getByText(/check back soon/i)).toBeInTheDocument();
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

  it("renders the page detail view with paragraphs and headed item lists", () => {
    render(<Explorer node={page} />);
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByText("A paragraph about me.")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Dashboard concept" }),
    ).toBeInTheDocument();
  });
});
