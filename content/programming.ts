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
      "Small Python/OpenCV experiments in image processing (grayscale conversion and Canny edge detection on a sample receipt), plus a customtkinter GUI demo.",
    role: "Developer — learning project",
    problem:
      "Hands-on exploration of classic computer-vision techniques and building a simple desktop GUI around them.",
    techStack: ["Python", "OpenCV", "customtkinter"],
    howItWorks: [
      "main.py loads receipt.jpeg, converts it to grayscale, and runs OpenCV's Canny edge detection. The original and the edge map open in two windows that close on any key press.",
      "tk.py is a separate customtkinter experiment, a dark-themed window with a single button, kept in the same repo as a standalone UI exercise.",
      "The first version of main.py ran Tesseract OCR on the same receipt through pytesseract. A later cleanup replaced it with the edge-detection script and added a README and requirements file.",
    ],
    learnings: [
      "Learned the basic OpenCV pipeline, color space conversion and then edge detection, as a stepping stone before more applied computer-vision work.",
      "Kept the GUI experiment deliberately separate from the image-processing script, an early lesson in not tangling unrelated concerns in one file.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "file", label: "Load Image" },
        { icon: "code", label: "Edge Detection" },
        { icon: "target", label: "Display Result" },
      ],
    },
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
      "First 2D game built with Python and Pygame: an animated character that walks and jumps across a background, as an introduction to game loops and sprite animation.",
    role: "Developer — learning project",
    problem:
      "Learning project for core 2D game-development concepts: the game loop, keyboard input, sprite animation, and simple jump physics.",
    techStack: ["Python", "Pygame"],
    howItWorks: [
      "A single main.py opens an 800x600 window and runs the game loop at 30 FPS: handle the quit event, read held keys, update the player, redraw the frame.",
      "The left and right arrows move the player at a fixed speed, stopping at the window edges. Space starts a jump that rises and falls in a smooth arc.",
      "Each redraw paints the background, then either picks the next walking frame for the current direction or shows a standing sprite when the player is idle.",
    ],
    learnings: [
      "First time implementing a game loop, sprite animation, and jump movement from scratch instead of using a higher-level game engine.",
      "Advancing the walk animation every third frame made the link between frame rate and animation speed concrete.",
    ],
    // Loops back to the very first step — the whole point of a game loop is
    // that it cycles indefinitely, frame after frame.
    flowDiagram: {
      nodes: [
        { icon: "code", label: "Poll Input" },
        { icon: "refresh", label: "Update State" },
        { icon: "target", label: "Redraw Frame" },
      ],
      loopFromIndex: 0,
    },
    links: {
      github: "https://github.com/toliko-coding/Python-pygame--first-2D-game",
    },
  },
];
