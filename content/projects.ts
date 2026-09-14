import type { ProjectNode } from "@/lib/fs-types";

export const projects: ProjectNode[] = [
  {
    id: "agent-dashboard",
    slug: "agent-dashboard",
    name: "Agent Dashboard",
    path: "/projects/agent-dashboard",
    type: "project",
    tags: ["software", "security"],
    difficulty: "high",
    summary:
      "Real-time monitoring and control plane for locally running Claude Code agents — a Go and Vue dashboard that discovers agents by scanning processes, streams tokens, cost and status over SSE, and drives a multi-stage task pipeline in isolated git worktrees. I contribute to it as an open-source collaborator, not as its author.",
    role: "Open-source contributor — 24 commits (+5,900 lines across 86 files) to lx-wnk/Agent-Dashboard",
    problem:
      "Running several agents at once leaves you with no shared view of what they are doing, what they cost, or which one is waiting on an answer. The upstream project solves that by reading what Claude Code already writes to disk, with no per-project hooks. My work went into the surfaces that make it legible: the workspace an agent is inspected in, the machine context around it, and a set of performance and correctness faults underneath both.",
    techStack: [
      "Go",
      "Vue 3",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "Server-Sent Events",
      "SQLite",
      "MCP",
    ],
    howItWorks: [
      "The dashboard finds agents with no setup per project — scanning processes and reading each one's CLAUDE_CONFIG_DIR to tell profiles apart — then streams the roster to the browser over SSE with live tokens, cost, status and uptime.",
      "I replaced the fixed details drawer with an agent workspace that makes the conversation the primary surface and puts the intelligence column beside it rather than behind a tab, and rebuilt Overview as a command center: metric row, system map, and an activity feed read from the audit log.",
      "LocalScope — a separate read-only collector for the machine's listening services and processes — is consumed rather than reimplemented. It binds loopback and answers Access-Control-Allow-Origin: null, so a browser cannot call it directly; the Go server proxies an allow-list of GET paths same-origin instead of opening a general route into loopback.",
      "Those services are correlated to agents by segment-safe path containment in both directions, so a card shows the ports running inside the project that agent is editing — and a chip only becomes a link when the collector reported a real URL, never one composed from a port.",
      "Throughout, unavailable and zero stay different claims: a null count renders as \"not collected\" rather than 0, and every panel separates loading, empty, unavailable and failed.",
    ],
    learnings: [
      "Working inside someone else's large codebase is its own skill. The fastest way in was to find the rule that already existed — the correlation logic the workspace diagram used — and move it somewhere shared, rather than write a second copy that could drift out of agreement with the first.",
      "A bug's reported symptom is rarely its cause. An intermittent 429 on one endpoint turned out to be a per-IP rate limiter sized for auth probing but applied to every read the page makes, quietly killing all four SSE streams on each cold load and dropping live updates to a 3-second poll.",
      "Caching a resolved value deduplicates sequential callers but not simultaneous ones. Caching the in-flight promise instead was the whole difference between one request and one per mounted component.",
      "\"Unavailable\" and \"zero\" are different claims, and merging them makes a dashboard lie quietly — a count of null shown as 0 tells you the system looked and found nothing, when it never looked at all.",
    ],
    // The live path is genuinely continuous: after the initial process scan,
    // the collector -> proxy -> roster -> workspace hop repeats as data streams,
    // so the dot loops from index 1 rather than stopping at the end.
    flowDiagram: {
      nodes: [
        { icon: "target", label: "Discover Agents" },
        { icon: "cloud", label: "LocalScope Collector" },
        { icon: "shield", label: "Allow-List Proxy" },
        { icon: "refresh", label: "Live Roster (SSE)" },
        { icon: "code", label: "Agent Workspace" },
      ],
      loopFromIndex: 1,
    },
    links: {
      github: "https://github.com/toliko-coding/Agent-Dashboard",
      docs: "https://github.com/lx-wnk/Agent-Dashboard/tree/main/docs",
    },
  },
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
      "Solana wallet-intelligence and paper-trading research platform — ranks wallets by a composite Smart Score, surfaces tokens that multiple strong wallets converged on, and simulates strategies against live prices. Research only: no wallet signing, no on-chain transactions, no real trades ever placed.",
    role: "Developer",
    problem:
      "Gives researchers a way to find consistently strong Solana traders and test strategies against them without financial risk — the analysis, the convergence signals, and the trading simulator all run on real market data while staying entirely virtual.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zod",
      "Supabase",
      "Recharts",
      "Birdeye API",
      "Helius API",
      "Vitest",
    ],
    howItWorks: [
      "Discovery and batch-analysis jobs pull candidate wallets and look them up against Helius and Birdeye for on-chain Solana transaction and price data.",
      "A scoring pipeline computes cost basis, classifies each trade, and aggregates PnL, ROI, and a composite Smart Score — tagging every non-exact figure with its reliability, and showing \"Unavailable\" rather than a guessed number.",
      "Scored wallets land on a leaderboard with URL-driven filter presets, each linking to a detail page for score breakdown, open positions, classified trades, and Smart Score history — served from cached Supabase data so browsing never burns API quota.",
      "Smart Money convergence flags tokens that several tracked, non-bot wallets bought inside a rolling time window.",
      "The Demo simulator turns those signals into paper trades — simulated fills at current market price with unfavorable slippage and fees — tracked as an equity curve against a SOL benchmark.",
    ],
    learnings: [
      "Reconciling two different blockchain data providers (Helius, Birdeye) meant normalizing inconsistent data shapes and rate limits into one coherent model.",
      "Designing a fair scoring formula across wallets with very different trade volumes was harder than expected — naive PnL ranking rewards one lucky trade over consistent performance.",
      "A paper-trading simulator is only worth anything if it refuses to flatter itself: entering at the current price rather than the source wallet's historical one, and charging slippage and fees, is the difference between a believable backtest and a fantasy.",
      "Treating data honesty as a feature — reliability tags on every derived figure, cached reads by default, and no fabricated values — made the numbers trustworthy enough to actually act on.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "globe", label: "Discover Wallets" },
        { icon: "sparkle", label: "Smart Score" },
        { icon: "cloud", label: "Supabase Cache" },
        { icon: "target", label: "Convergence" },
        { icon: "refresh", label: "Paper Trades" },
      ],
    },
    links: {
      github: "https://github.com/toliko-coding/WalletRadar_web",
    },
    media: [
      {
        type: "image",
        src: "/walletradar-overview.png",
        alt: "WalletRadar pipeline: data sources, discovery, analysis, monitoring, convergence, strategy engine, validation, and insights, with a local automation runner driving them on a schedule",
        width: 2172,
        height: 724,
      },
    ],
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
