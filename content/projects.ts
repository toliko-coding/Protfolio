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
    howItWorks: [
      "An Android SMS listener captures incoming messages on-device as they arrive.",
      "Message text runs through a TensorFlow.js classification model trained to recognize phishing language patterns.",
      "Any links in the message are cross-checked against the VirusTotal API for known malicious URLs.",
      "Flagged messages are shown to the user with a risk score, and their correct/incorrect feedback is logged to Firebase.",
      "That feedback feeds future retraining, closing the loop between real-world usage and model accuracy.",
    ],
    learnings: [
      "First hands-on experience shipping an ML model on-device (TensorFlow.js) instead of calling a hosted inference API.",
      "Learned to design a feedback loop so the model keeps improving after deployment, not just at training time.",
      "Integrating a third-party threat-intel API (VirusTotal) meant treating an external service as unreliable by default — timeouts, rate limits, and malformed responses all needed handling.",
    ],
    // Mirrors howItWorks above, visually — the loop starts over at the
    // classifier (index 1) since the last step folds feedback back into it.
    flowDiagram: {
      nodes: [
        { icon: "phone", label: "SMS Listener" },
        { icon: "sparkle", label: "Classifier" },
        { icon: "shield", label: "VirusTotal Check" },
        { icon: "target", label: "Risk Score" },
        { icon: "refresh", label: "Retrain" },
      ],
      loopFromIndex: 1,
    },
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
      "Solana wallet-intelligence platform that discovers and ranks high-performing wallets by trading history, PnL, ROI, and a composite Smart Score — research only, no real trades placed. In active development.",
    role: "Developer",
    problem:
      "Gives researchers a way to analyze Solana wallet performance and spot consistently strong traders without financial risk, starting with a manual wallet lookup — automated discovery and paper trading are still ahead on the roadmap.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zod",
      "Supabase",
      "Birdeye API",
      "Helius API",
      "Vitest",
    ],
    howItWorks: [
      "A wallet address entered at /discover is looked up against Helius and Birdeye for on-chain Solana transaction and price data.",
      "A scoring pipeline classifies each trade and aggregates PnL, ROI, and a composite Smart Score, tagging every metric with its data reliability.",
      "Zod validates all environment and API configuration; Supabase can optionally persist wallet snapshots once configured.",
      "Automated wallet discovery, a public leaderboard, and the paper-trading simulator are the next phases — not built yet.",
    ],
    learnings: [
      "Reconciling two different blockchain data providers (Helius, Birdeye) meant normalizing inconsistent data shapes and rate limits into one coherent model.",
      "Designing a fair scoring formula across wallets with very different trade volumes was harder than expected — naive PnL ranking rewards one lucky trade over consistent performance.",
      "Shipping the manual analyzer before automated discovery or paper trading kept each phase testable on its own — Vitest covers the cost-basis and Smart Score math directly — instead of building the whole pipeline before any of it worked end to end.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "globe", label: "Wallet Lookup" },
        { icon: "sparkle", label: "Smart Score" },
        { icon: "cloud", label: "Supabase (optional)" },
      ],
    },
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
    techStack: [
      "React Native (Expo)",
      "TypeScript",
      "Supabase",
      "Zod",
      "Expo Router",
      "Claude (Anthropic API)",
      "React Query",
    ],
    howItWorks: [
      "A document is captured via camera, gallery, or PDF picker and uploaded to a private Supabase Storage bucket, hashed with SHA-256 to catch duplicates.",
      "A provider-agnostic DocumentProcessor interface hands the file to Claude, via the Anthropic API, to extract bill details — swapping AI vendors later wouldn't touch the rest of the app.",
      "Zod schemas validate the AI's structured output before anything reaches the database — untrusted model output never gets written to Postgres directly.",
      "Supabase Row Level Security scopes every query to the signed-in user, so bills and documents are private by construction, not just by app logic.",
    ],
    learnings: [
      "Building the OCR/AI integration behind a provider-agnostic interface first — starting with an honest mock — made it straightforward to wire in Claude via the Anthropic API later without touching the review flow, storage, or UI.",
      "Validating AI output with Zod before it touches the database was a deliberate boundary: treat model output like any other untrusted input.",
      "Row Level Security pushed authorization down into the database itself, instead of trusting every API call to remember to filter by user.",
      "Supporting Hebrew alongside English meant designing the UI for RTL layout from the start, not retrofitting it after building everything left-to-right first.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "phone", label: "Capture Doc" },
        { icon: "sparkle", label: "OCR / AI Extract" },
        { icon: "shield", label: "Validate (Zod)" },
        { icon: "cloud", label: "Private Storage" },
      ],
    },
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
    howItWorks: [
      "A doctor logs in and enters a patient's blood test values through the app's form screens.",
      "The app maps those values against known ranges to suggest the most likely condition and treatment.",
      "Results are shown back to the doctor as a first-pass suggestion, not a final diagnosis.",
    ],
    learnings: [
      "One of my first native Android apps — learned the basics of Activity-based navigation and structuring a multi-screen Java app.",
      "Modeling a medical domain, even a simplified one, showed how important clear data structures are before writing any UI.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "phone", label: "Enter Values" },
        { icon: "code", label: "Match Ranges" },
        { icon: "target", label: "Suggestion" },
      ],
    },
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
    howItWorks: [
      "Built on ASP.NET's MVC pattern: Models represent menu items and orders, Views render the storefront and admin pages, Controllers handle requests between them.",
      "Staff manage the menu and view orders through admin-facing views; customers browse the menu and place orders through the public-facing ones.",
    ],
    learnings: [
      "First real exposure to the MVC architectural pattern outside a classroom example — seeing how it forces a separation between data, presentation, and request handling.",
      "Working in .NET/ASP.NET gave me a point of comparison against the JavaScript-based stacks I mostly use now.",
    ],
    // The classic MVC triangle, drawn out rather than the 2-sentence
    // summary verbatim — Model/Controller/View is literally what the code
    // is organized into.
    flowDiagram: {
      nodes: [
        { icon: "folder", label: "Model" },
        { icon: "code", label: "Controller" },
        { icon: "globe", label: "View" },
      ],
    },
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
    howItWorks: [
      "A Firebase/NoSQL backend stores requests for help alongside volunteer and small-business listings.",
      "Visitors could post a need or an offer to help, and the site surfaced matching listings — a shared board, not a real-time matching engine.",
    ],
    learnings: [
      "My first deployed website — learned the basics of a NoSQL data model (Firebase) instead of the relational databases taught in school.",
      "Building something with real urgency (COVID-19 lockdowns), instead of a toy assignment, made the scope and deadline pressure feel completely different.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "globe", label: "Post Request" },
        { icon: "cloud", label: "Firebase Store" },
        { icon: "target", label: "Match Listing" },
      ],
    },
    links: {
      github:
        "https://github.com/toliko-coding/NoSQL-FireBase----site-Wepo4U-project",
    },
  },
];
