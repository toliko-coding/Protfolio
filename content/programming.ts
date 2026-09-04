import type { ProjectNode } from "@/lib/fs-types";

export const programming: ProjectNode[] = [
  {
    id: "image-recognition",
    slug: "image-recognition",
    name: "Image Recognition Playground",
    path: "/programming/image-recognition",
    type: "project",
    tags: ["software"],
    summary:
      "Small Python/OpenCV experiments in image processing — grayscale conversion and Canny edge detection — plus a customtkinter GUI demo.",
    role: "Developer — learning project",
    problem:
      "Hands-on exploration of classic computer-vision techniques and building a simple desktop GUI around them.",
    techStack: ["Python", "OpenCV", "customtkinter"],
    links: {
      github: "https://github.com/toliko-coding/Python_ImageRecognicion",
    },
  },
  {
    id: "pygame-2d-game",
    slug: "pygame-2d-game",
    name: "First 2D Game (Pygame)",
    path: "/programming/pygame-2d-game",
    type: "project",
    tags: ["software"],
    summary:
      "First 2D game built with Python and Pygame — an introduction to game loops, sprites, and collision handling.",
    role: "Developer — learning project",
    problem:
      "Learning project for core 2D game-development concepts: the game loop, rendering, input handling, and collisions.",
    techStack: ["Python", "Pygame"],
    links: {
      github: "https://github.com/toliko-coding/Python-pygame--first-2D-game",
    },
  },
];
