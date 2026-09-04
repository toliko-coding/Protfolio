import type { FolderNode } from "@/lib/fs-types";
import { projects } from "./projects";
import { toolkit } from "./toolkit";
import { programming } from "./programming";
import { about } from "./about";
import { skills } from "./skills";
import { resume } from "./resume";
import { contact } from "./contact";

function folder(
  path: string,
  slug: string,
  name: string,
  children: FolderNode["children"] = [],
  options: { description?: string; intro?: string[] } = {},
): FolderNode {
  return {
    id: slug || "root",
    slug,
    name,
    path,
    type: "folder",
    children,
    ...options,
  };
}

// The v1 tree from Phase 2. cybersecurity/writeups is intentionally still
// empty — it's long-form prose, not repo-shaped content, so nothing to pull
// from GitHub yet.
export const filesystem: FolderNode = {
  ...folder("/", "", "portfolio", [
    about,
    folder("/projects", "projects", "Projects", projects, {
      description: "Full-stack products and apps I've built end to end.",
      intro: [
        "Full projects I've built from scratch — some shipped, some still in progress.",
        "Each one links back to its GitHub repo and, where it exists, a live demo.",
      ],
    }),
    folder(
      "/cybersecurity",
      "cybersecurity",
      "CyberSecurity",
      [
        folder("/cybersecurity/writeups", "writeups", "Write-ups", [], {
          description: "Long-form security write-ups — coming soon.",
          intro: [
            "Long-form write-ups on security topics — not published yet.",
            "Check back soon, or see the Toolkit for runnable projects in the meantime.",
          ],
        }),
        folder(
          "/cybersecurity/toolkit",
          "toolkit",
          "Toolkit",
          toolkit,
          {
            description: "Security tools built for coursework and self-study.",
            intro: [
              "Small security tools — a packet sniffer, a malware detector, cryptographic protocols, and more.",
              "Built for coursework and self-study, not production use — see each project's README for details.",
            ],
          },
        ),
      ],
      {
        description: "Security tooling, cryptography experiments, and write-ups.",
        intro: [
          "Cryptography, malware analysis, and network security work from coursework and self-study.",
          "Toolkit holds runnable tools; Write-ups will hold longer analysis once it's written.",
        ],
      },
    ),
    folder("/programming", "programming", "Programming", programming, {
      description: "Smaller programming projects and language experiments.",
      intro: [
        "Smaller programs and experiments outside the two flagship projects — computer vision, games, and early web work.",
      ],
    }),
    skills,
    resume,
    contact,
  ]),
  intro: [
    "Software engineering & cybersecurity portfolio, built to explore like a computer rather than scroll like a webpage.",
    "Click through the folders below, or switch to the Terminal — try ls, cd <folder>, or open <name>.",
  ],
};
