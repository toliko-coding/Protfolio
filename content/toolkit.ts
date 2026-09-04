import type { ProjectNode } from "@/lib/fs-types";

export const toolkit: ProjectNode[] = [
  {
    id: "sniffer",
    slug: "sniffer",
    name: "Packet Sniffer",
    path: "/cybersecurity/toolkit/sniffer",
    type: "project",
    tags: ["security"],
    summary:
      "Python network packet sniffer with a client/server architecture for capturing and inspecting traffic, built as a networking security exercise.",
    role: "Developer — coursework project",
    problem:
      "Explores how packet-level network traffic can be captured and inspected, as a hands-on introduction to network sniffing techniques.",
    techStack: ["Python", "Sockets"],
    howItWorks: [
      "A server.py / client.py pair establishes a socket connection between two endpoints.",
      "sniffer.py captures packets crossing that connection and parses them for inspection — headers, source/destination, and payload.",
    ],
    learnings: [
      "First hands-on look at networking below the application layer — raw sockets, not HTTP requests.",
      "Seeing packet contents in plaintext firsthand made the case for encryption (TLS, VPNs) click far more than reading about it ever did.",
    ],
    links: {
      github: "https://github.com/toliko-coding/Sniffer",
    },
  },
  {
    id: "monitar",
    slug: "monitar",
    name: "Monitar Malware Detector",
    path: "/cybersecurity/toolkit/monitar",
    type: "project",
    tags: ["security"],
    summary:
      "Python/Tkinter desktop tool that scans a machine for known indicator-of-compromise file paths and reports a risk level, built for a cybersecurity course case study on a fictional utility-company malware strain.",
    role: "Developer — cybersecurity coursework",
    problem:
      "Simulates the detection side of an incident-response case study: given a set of known malicious file paths, determine whether a machine shows signs of the MONITAR malware. Educational demo, not a production antivirus.",
    techStack: ["Python", "Tkinter"],
    howItWorks: [
      "Configuration.txt lists known file paths the fictional MONITAR malware would drop on disk.",
      "A Tkinter GUI lets the user trigger a scan, which checks whether each configured path exists on the machine.",
      "The number of matches found maps to a risk level, from fully protected up to infected.",
    ],
    learnings: [
      "Learned why signature/path-based detection is fragile — it only catches threats you already know the exact indicators for.",
      "Simulating both sides of a security case study, the attack scenario and the detector, connected incident-response theory to actual working code.",
    ],
    links: {
      github: "https://github.com/toliko-coding/Monitar-Malware-Detector",
    },
  },
  {
    id: "secure-voting",
    slug: "secure-voting",
    name: "Secure Voting System",
    path: "/cybersecurity/toolkit/secure-voting",
    type: "project",
    tags: ["security"],
    summary:
      "Terminal-based e-voting prototype combining ECC key exchange, AES-GCM authenticated encryption, and Twilio SMS voter verification, so ballots are tallied without ever exposing a plaintext vote in storage.",
    role: "Developer — team project (3 students)",
    problem:
      "Explores how public-key cryptography can protect a vote's confidentiality end-to-end: each ballot is encrypted with the voter's own key and only decrypted if that voter re-verifies to change their vote. The README documents known limitations honestly — the SMS re-entry step isn't a true zero-knowledge proof, and there's no persistence layer.",
    techStack: ["Python", "ECC (brainpoolP256r1)", "AES-256-GCM", "Twilio SMS"],
    howItWorks: [
      "A voter registers with an ID and phone number; the app generates an ECC keypair (brainpoolP256r1) for them.",
      "The private key is sent over SMS via Twilio as a one-time code, which the voter re-enters to prove receipt and verify their identity.",
      "Once verified, the chosen candidate is encrypted with ECIES — an ECC-derived shared secret, hashed with SHA-256, then sealed with AES-256-GCM — using the voter's own public key.",
      "Running tallies are kept without ever decrypting a ballot; decryption only happens if a voter re-verifies to change their vote.",
    ],
    learnings: [
      "Implementing ECIES from its primitives (ECC key exchange + AES-GCM) instead of one high-level 'encrypt' call made the mechanics of hybrid encryption concrete instead of a black box.",
      "Documenting the system's own limitations honestly in the README — the SMS step isn't a real zero-knowledge proof, there's no persistence layer — was as valuable as building the crypto itself; knowing what you didn't solve is part of understanding security.",
      "A Twilio credential briefly ended up hardcoded in an early commit before being moved to environment variables — a first-hand lesson that git history remembers everything, so secrets need to start out of the codebase, not get removed later.",
    ],
    links: {
      github:
        "https://github.com/toliko-coding/voting_system_using_ZKP--and--cryptographic_algorithms",
    },
  },
  {
    id: "zkp-sudoku",
    slug: "zkp-sudoku",
    name: "Zero-Knowledge Sudoku Proof",
    path: "/cybersecurity/toolkit/zkp-sudoku",
    type: "project",
    tags: ["security"],
    summary:
      "Implements a zero-knowledge proof protocol that lets a prover convince a verifier they know a solved Sudoku grid without revealing the solution itself.",
    role: "Developer — team project (3 students)",
    problem:
      "Hands-on exploration of zero-knowledge proof theory using the classic Sudoku commitment scheme, split into separate Generator, Prover, and Verifier roles.",
    techStack: ["Python"],
    howItWorks: [
      "A solved Sudoku grid is the prover's secret; Generator.py sets up the puzzle.",
      "Prover.py commits to a shuffled version of the solution without revealing it.",
      "Verifier.py challenges the prover to reveal specific cells across many rounds, checking consistency without ever seeing the full solution.",
    ],
    learnings: [
      "Working through zero-knowledge proofs on a concrete example (Sudoku) made an otherwise abstract concept — proving knowledge without revealing it — actually click.",
      "Splitting the system into separate Generator/Prover/Verifier scripts mirrored how these roles are described in the literature, which made mapping theory to code much easier.",
    ],
    links: {
      github:
        "https://github.com/toliko-coding/Advanced-Cryptography_Zero-Knowledge-Proof",
    },
  },
  {
    id: "password-encryption",
    slug: "password-encryption",
    name: "Password Encryption Program",
    path: "/cybersecurity/toolkit/password-encryption",
    type: "project",
    tags: ["security"],
    summary:
      "Small command-line tool for encrypting and decrypting passwords, with decoding gated behind the program itself.",
    role: "Developer",
    problem:
      "A first pass at symmetric encryption/decryption fundamentals — encode a password so it isn't stored in plaintext, only reversible through the program.",
    techStack: ["Python"],
    howItWorks: [
      "main.py reads a password from the user and calls into coding.py to encrypt it before it's stored.",
      "Decoding only works by running the same program back over the stored value — there's no separate 'read the plaintext' path.",
    ],
    learnings: [
      "A first, simple encrypt/decrypt exercise before working with the real primitives (ECC, AES-GCM) used later in the Secure Voting System project.",
    ],
    links: {
      github: "https://github.com/toliko-coding/Passwords-Encription-Program",
    },
  },
];
