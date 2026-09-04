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
    techStack: [
      "React Native (Expo)",
      "TypeScript",
      "Firebase",
      "VirusTotal API",
      "TensorFlow.js",
      "Android SMS Listener",
    ],
    links: {
      github: "https://github.com/toliko-coding/SMSNet0.1",
      demo: "https://www.youtube.com/watch?v=kLN8q_Sf7bY",
      appStore: true,
    },
    media: [
      {
        type: "image",
        src: "/smsnet-overview.png",
        alt: "SMSNet architecture and feature overview",
        width: 1536,
        height: 1024,
      },
    ],
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
  {
    id: "docapp",
    slug: "docapp",
    name: "DocApp",
    path: "/projects/docapp",
    type: "project",
    tags: ["software"],
    summary:
      "Mobile app (iOS + Android) that centralizes household bills and receipts — scan a document, let AI extract the details, review, and track from one dashboard. In active development.",
    role: "Developer",
    problem:
      "Replaces scattered paper bills and receipts with a single organized, searchable digital system, using a provider-agnostic OCR/AI interface so no vendor is hardcoded.",
    techStack: ["React Native (Expo)", "TypeScript", "Supabase", "Zod", "Expo Router"],
    links: {
      github: "https://github.com/toliko-coding/My-docApp",
    },
  },
  {
    id: "medical-diagnosis-app",
    slug: "medical-diagnosis-app",
    name: "Medical Diagnosis App",
    path: "/projects/medical-diagnosis-app",
    type: "project",
    tags: ["software"],
    summary:
      "Android app where a doctor enters a patient's blood test results and the app determines the likely disease and recommended treatment.",
    role: "Developer",
    problem:
      "Speeds up first-pass diagnosis by mapping blood test values to likely conditions and treatment suggestions for the reviewing doctor.",
    techStack: ["Java", "Android SDK"],
    links: {
      github: "https://github.com/toliko-coding/Android-App",
    },
  },
  {
    id: "coffeeshop-mvc",
    slug: "coffeeshop-mvc",
    name: "CoffeeShop MVC",
    path: "/projects/coffeeshop-mvc",
    type: "project",
    tags: ["software"],
    summary:
      ".NET MVC web application for coffee shops to manage their menu, users, and customer orders.",
    role: "Developer",
    problem:
      "Gives a coffee shop a simple web-based back office: menu management, user accounts, and order placement/tracking.",
    techStack: [".NET", "ASP.NET MVC", "JavaScript"],
    links: {
      github:
        "https://github.com/toliko-coding/.NET---MVC---CoffeShop-WebApplication-Project",
    },
  },
  {
    id: "wepo4u",
    slug: "wepo4u",
    name: "Wepo4U",
    path: "/projects/wepo4u",
    type: "project",
    tags: ["software"],
    summary:
      "First website project — a NoSQL/Firebase-backed site built during COVID-19 to connect elderly residents needing help with local volunteers and small businesses.",
    role: "Developer — school project",
    problem:
      "Connects vulnerable residents who needed help during COVID-19 lockdowns with nearby volunteers and small businesses offering support.",
    techStack: ["Firebase", "HTML", "JavaScript"],
    links: {
      github:
        "https://github.com/toliko-coding/NoSQL-FireBase----site-Wepo4U-project",
    },
  },
];
