import type { ProjectNode } from "@/lib/fs-types";

export const projects: ProjectNode[] = [
  {
    id: "smsnet",
    slug: "smsnet",
    name: "SMSNet",
    path: "/projects/smsnet",
    type: "project",
    tags: ["software", "security"],
    summary:
      "Android app that scans incoming SMS messages and flags likely phishing attempts using an AI classification model, with a feedback loop that improves accuracy over time.",
    role: "Developer — B.Sc. final year project",
    problem:
      "SMS-based phishing is a common mobile security threat. SMSNet detects suspicious messages on-device and helps users recognize phishing attempts before they act on them.",
    techStack: ["React Native", "TypeScript", "Android", "Axios"],
    links: {
      github: "https://github.com/toliko-coding/SMSNet0.1",
      demo: "https://www.youtube.com/watch?v=kLN8q_Sf7bY",
    },
  },
  {
    id: "walletradar",
    slug: "walletradar",
    name: "WalletRadar",
    path: "/projects/walletradar",
    type: "project",
    tags: ["software"],
    summary:
      "Solana blockchain intelligence and paper-trading research platform for analyzing wallet activity — no real trading, fully virtual simulation. In active development.",
    role: "Developer",
    problem:
      "Gives researchers wallet-level analytics on Solana without financial risk, using a virtual paper-trading simulator instead of real trades.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Birdeye API",
      "Helius API",
    ],
    links: {
      github: "https://github.com/toliko-coding/WalletRadar_web",
    },
  },
];
