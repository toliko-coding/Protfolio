import type { ProjectNode } from "@/lib/fs-types";

export const usefulCodes: ProjectNode[] = [
  {
    id: "python-coursework",
    slug: "python-coursework",
    name: "Python Coursework",
    path: "/useful-codes/python-coursework",
    type: "project",
    tags: ["software"],
    summary:
      "Collection of Python exercises and lecture assignments — higher-order functions, data abstraction, OOP, generic functions, memoization, and exception handling.",
    role: "Student coursework archive",
    problem:
      "Archive of per-lesson Python exercises from a programming course, covering functional and object-oriented programming fundamentals.",
    techStack: ["Python"],
    learnings: [
      "Working lesson by lesson through higher-order functions, data abstraction, generic functions, and OOP built the functional-programming foundations used across every later project.",
    ],
    links: {
      github: "https://github.com/toliko-coding/My-Python-codes",
    },
  },
  {
    id: "cpp-coursework",
    slug: "cpp-coursework",
    name: "C++ Coursework",
    path: "/useful-codes/cpp-coursework",
    type: "project",
    tags: ["software"],
    summary:
      "Collection of C++ lecture exercises covering RTTI, templates, stack unwinding, inheritance, virtual functions, and polymorphism.",
    role: "Student coursework archive",
    problem:
      "Archive of per-lecture C++ exercises building up core language and object-oriented programming concepts.",
    techStack: ["C++"],
    learnings: [
      "Lecture-by-lecture exercises (RTTI, templates, inheritance, polymorphism) were where object-oriented concepts taught abstractly elsewhere finally became concrete, memory management included.",
    ],
    links: {
      github: "https://github.com/toliko-coding/My--Cpp-codes",
    },
  },
  {
    id: "c-coursework",
    slug: "c-coursework",
    name: "C Coursework",
    path: "/useful-codes/c-coursework",
    type: "project",
    tags: ["software"],
    summary: "Collection of exercises from learning C programming.",
    role: "Student coursework archive",
    problem: "Archive of early C programming exercises.",
    techStack: ["C"],
    learnings: [
      "The earliest exercises here were where pointers and manual memory management, with no safety net, first stopped being abstract ideas.",
    ],
    links: {
      github: "https://github.com/toliko-coding/My--C-codes",
    },
  },
];
