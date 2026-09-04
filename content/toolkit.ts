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
    links: {
      github: "https://github.com/toliko-coding/Passwords-Encription-Program",
    },
  },
];
