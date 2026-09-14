import type { PageNode } from "@/lib/fs-types";

export const about: PageNode = {
  id: "about",
  slug: "about",
  name: "About",
  path: "/about",
  type: "page",
  description: "Who I am, and how I build.",
  image: {
    src: "/portrait-2026.jpg",
    alt: "Portrait of Anatoli Kot",
    width: 1133,
    height: 1700,
  },
  facts: [
    { icon: "location", label: "Beer Sheva, Israel" },
    { icon: "education", label: "B.Sc. Software Engineering — Cybersecurity" },
    { icon: "service", label: "IDF Reserve Duty (2025–Present)" },
    { icon: "ai", label: "AI-Assisted Engineering" },
  ],
  sections: [
    {
      paragraphs: [
        "I'm Anatoli Kot — a software engineer specializing in cybersecurity, based in Beer Sheva, Israel. I'm drawn to the questions underneath software: how data moves, where it can leak, and what it takes to build something that holds up when someone leans on it.",
        "I earned my B.Sc. in Software Engineering at Sami Shamoon College of Engineering (SCE) with a cybersecurity specialization — computer networks, cryptography, databases, and machine learning. My final project, SMSNet, pulled those threads together into an Android app that uses machine learning to detect SMS phishing.",
      ],
    },
    {
      heading: "The path so far",
      paragraphs: [
        "I came to engineering through real operations rather than around them. I implemented and supported SAP systems at Soroka Medical Center for Ness Technologies, solved customer problems in technical support at Partner Communications, and ran production machines at HP Indigo. Each role taught the same lesson from a different side: debug calmly, explain clearly, and care about what happens after the handoff.",
      ],
    },
    {
      heading: "Right now",
      paragraphs: [
        "I'm deepening the offensive side of security in Ecom School's hands-on cybersecurity course — penetration testing, vulnerability assessment, and analysis with Kali Linux, Nmap, Metasploit, and Wireshark — while serving in the IDF reserves.",
      ],
    },
    {
      heading: "AI & Prompt Engineering",
      paragraphs: [
        "I treat a prompt the way I treat code: specific, reviewable, and judged by what it produces. This site is the working proof — it was built in directed sessions with Claude Code, where the model wrote alongside me and my job was everything around it: the brief, the constraints, and checking the result before it shipped.",
      ],
      prompt: {
        title: "how-i-prompt.md",
        lines: [
          { tag: "role", text: "A senior engineer on this codebase — not an autocomplete." },
          { tag: "context", text: "The repo, its conventions, and why earlier attempts were reverted." },
          { tag: "task", text: "One outcome, stated so it can be checked." },
          { tag: "constraints", text: "No invented facts. No quiet scope creep." },
          { tag: "verify", text: "Tests, a real browser, and the live site — then call it done." },
        ],
      },
      items: [
        "Structured prompts with roles, context, constraints, and explicit acceptance criteria",
        "Agentic workflows in Claude Code — planning, parallel sub-agents, and review loops",
        "Extended Agent Dashboard, an open-source control plane for Claude Code agents, in my own fork",
        "Turning “looks right” into evidence: type-checks, tests, and browser checks",
        "Working across Claude and ChatGPT for code, research, and writing",
      ],
    },
  ],
};
