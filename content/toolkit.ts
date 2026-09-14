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
      "Python/Scapy coursework project: a UDP client and server on localhost port 12321, a separate adversary script that sniffs their packets, and a simulated dropped-packet-and-resend step.",
    role: "Developer — team coursework (Cyber Risk Assessment course)",
    problem:
      "The assignment was to build a UDP client/server, an adversary that captures their traffic without being part of the connection, and a defense against an active adversary dropping chosen packets, where the client sends an XOR of the data packets so a missing one can be rebuilt. The committed code covers the sniffer and a simpler version of the loss handling: the server asks for a resend instead of rebuilding the packet from the XOR.",
    techStack: ["Python", "Scapy", "UDP sockets", "pickle"],
    howItWorks: [
      "server.py binds a UDP socket on localhost:12321, replies to every datagram, and logs each payload and client address.",
      "client.py splits a short message into words, computes an XOR value across them, and sends each word as a pickled (data, xor, d) tuple three seconds apart. It holds back the last word on purpose to simulate a lost packet.",
      "Once the server has buffered two packets it replies 'Resend packet', and the client sends the missing word.",
      "sniffer.py runs separately as the adversary: Scapy's sniff() with a 'port 12321' filter captures packets on that port and prints every layer of each one with packet.show().",
    ],
    learnings: [
      "First hands-on look at networking below the application layer: capturing traffic with Scapy and a packet filter instead of making HTTP requests.",
      "The sniffer never joins the connection, yet it prints every layer of each datagram, payload included. Seeing that firsthand made the case for encryption (TLS, VPNs) click far more than reading about it ever did.",
      "The commit history shows Flask, a Node.js client/server, and a Docker Compose setup being tried and then removed before the final three Python scripts. For a single-machine exercise, the simplest setup was the one that got finished.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "globe", label: "UDP Client ↔ Server" },
        { icon: "refresh", label: "Resend Lost Packet" },
        { icon: "code", label: "Sniff & Print" },
      ],
    },
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
    role: "Developer — cybersecurity coursework (team of 2)",
    problem:
      "Simulates the detection side of an incident-response case study: given a set of known malicious file paths, determine whether a machine shows signs of the MONITAR malware. Educational demo, not a production antivirus: it doesn't scan file contents, hashes, or behavior.",
    techStack: ["Python", "Tkinter"],
    howItWorks: [
      "Configuration.txt lists the files the fictional MONITAR malware would drop on disk: six Windows paths under C:\\ProgramData, including DLLs, a monitar.exe, and data files.",
      "The Tkinter menu has two actions: view the configured paths, or run a scan that checks whether each path exists and lists the ones it finds.",
      "The number of matches maps to a risk level: 0 is 'fully protected', 1 to 5 run from very low to very high, and anything above that reports the MONITAR malware.",
    ],
    learnings: [
      "Learned why signature/path-based detection is fragile: it only catches threats you already know the exact indicators for.",
      "Because the indicators are hardcoded Windows paths, the scan only means something on Windows. Indicator lists are tied to the platform they were collected on.",
      "Simulating both sides of a security case study, the attack scenario and the detector, connected incident-response theory to actual working code.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "file", label: "Known Paths" },
        { icon: "code", label: "Scan Filesystem" },
        { icon: "target", label: "Risk Level" },
      ],
    },
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
      "Explores how public-key cryptography can protect a vote's confidentiality: each ballot is encrypted with the voter's own key and only decrypted if that voter re-verifies to change their vote. The README is upfront about the limits: the SMS re-entry step isn't a true zero-knowledge proof, the election authority could still decrypt any ballot, and all state lives in memory.",
    techStack: [
      "Python",
      "ECC (brainpoolP256r1, tinyec)",
      "AES-256-GCM (PyCryptodome)",
      "Twilio SMS",
    ],
    howItWorks: [
      "A voter registers with an ID and phone number, and the app generates an ECC keypair (brainpoolP256r1) for them.",
      "The private key doubles as the verification code: it's texted to the voter through Twilio, and the voter re-types it one character at a time. Enough matching characters marks them verified.",
      "The voter picks a voting center and a candidate. The choice is encrypted with ECIES (a one-time ECC key and the voter's public key produce a shared secret, which SHA-256 turns into an AES-256-GCM key) in DES.py, despite the filename.",
      "Running tallies are updated at vote time, so counting never needs to decrypt a stored ballot.",
      "Registering again with the same ID triggers re-verification. The old ballot is then decrypted, its count reversed, and the new choice encrypted in its place. example.py runs this crypto core without Twilio.",
    ],
    learnings: [
      "Implementing ECIES from its primitives (ECC key exchange + AES-GCM) instead of one high-level 'encrypt' call made the mechanics of hybrid encryption concrete instead of a black box.",
      "Writing down the system's own limitations was as valuable as building the crypto: the SMS step isn't a real zero-knowledge proof, the authority can still decrypt ballots, and there's no persistence layer. Knowing what you didn't solve is part of understanding security.",
      "Twilio credentials sat hardcoded in bot.py in the original commits. The later cleanup moved them to environment variables, but the README now warns they can still be recovered from git history and must be rotated: removing a secret from the code doesn't remove it from the repo.",
    ],
    // Loops back to SMS Verify — re-verifying is exactly how a voter
    // changes their vote, per the README.
    flowDiagram: {
      nodes: [
        { icon: "phone", label: "Register Voter" },
        { icon: "shield", label: "SMS Verify" },
        { icon: "lock", label: "Encrypt Ballot" },
        { icon: "target", label: "Tally" },
      ],
      loopFromIndex: 1,
    },
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
      "Interactive terminal demo of a zero-knowledge proof for Sudoku: the verifier opens rows, columns, and 3x3 boxes of a hidden solution one at a time, each shown only as a sorted list, until a chosen confidence level is reached.",
    role: "Developer — team project (3 students)",
    problem:
      "Hands-on exploration of zero-knowledge proof theory for advanced cryptography coursework: convince a verifier that a puzzle has a valid solution without showing the solved grid. The protocol is simplified. Revealed units are sorted rather than cryptographically committed, and the user at the terminal answers whether each revealed unit is valid.",
    techStack: ["Python"],
    howItWorks: [
      "main.py loads an unsolved puzzle, either from Sudokus2.txt or freshly made by Generator.py (a bundled third-party generator with easy, difficult, and possibly-unsolvable modes). pySudoku.py then solves it by filling forced cells and backtracking.",
      "The user sets a confidence percentage, and the prover splits the solved grid into 27 'packets': 9 rows, 9 columns, and 9 3x3 boxes.",
      "Only the unsolved puzzle is shown. Each round the verifier picks an unopened packet, and the prover shows its numbers sorted, so the digits can be checked without revealing where they sit in the grid.",
      "Verifier.py counts approved packets. The proof is accepted once approved/27 reaches the confidence level, and rejected if every packet is opened first.",
    ],
    learnings: [
      "Working through zero-knowledge proofs on a concrete example (Sudoku) made an otherwise abstract concept, proving knowledge without revealing it, actually click.",
      "Splitting the code into separate Prover and Verifier classes mirrored how these roles are described in the literature, which made mapping theory to code much easier.",
      "The simplified version made the gap visible: without real commitments, nothing stops a prover from answering each challenge inconsistently. That's why proper ZK protocols commit to a randomly permuted solution before any challenge.",
    ],
    // Loops back to the reveal step — rounds of challenge and response
    // until the confidence level is reached are the whole protocol, not a
    // one-off exchange.
    flowDiagram: {
      nodes: [
        { icon: "code", label: "Solve Puzzle" },
        { icon: "folder", label: "Split 27 Packets" },
        { icon: "lock", label: "Reveal Sorted" },
        { icon: "shield", label: "Approve Packet" },
      ],
      loopFromIndex: 2,
    },
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
      "Early Python/Tkinter password manager that saves usernames with passwords encoded by a home-made rotation cipher, and decodes them on request with the same key.",
    role: "Developer",
    problem:
      "A first pass at encryption basics: keep saved passwords out of plaintext by substituting each character through a key. It's a Caesar-style substitution, not real cryptography, and the key itself is saved unencrypted in key.txt next to the password file.",
    techStack: ["Python", "Tkinter"],
    howItWorks: [
      "A Tkinter login window guards a menu with Add Password, Get Password, See list, and Set Key.",
      "Set Key takes a rotation number and builds a substitution table by shifting every letter and digit along a combined a–z / 1–9 / A–Z cycle, then writes the table to key.txt.",
      "coding.py is a closure-based dispatcher that responds to messages (set_key, import_key, export_key, encoding, decoding). Add Password loads the key and appends the username and encoded password to mypasswords.txt.",
      "Get Password looks up a username and decodes its entry by inverting the substitution table.",
    ],
    learnings: [
      "A first, simple encode/decode exercise before working with the real primitives (ECC, AES-GCM) used later in the Secure Voting System project.",
      "In hindsight it shows why home-made ciphers fail: a fixed character substitution keeps the length and repeated characters, and the key sits in plaintext beside the data it protects.",
      "Writing coding.py as a function that dispatches on message strings was an early exercise in message passing and hidden state, before reaching for classes.",
    ],
    flowDiagram: {
      nodes: [
        { icon: "code", label: "Set Rotation Key" },
        { icon: "lock", label: "Encode & Save" },
        { icon: "file", label: "Decode on Lookup" },
      ],
    },
    links: {
      github: "https://github.com/toliko-coding/Passwords-Encription-Program",
    },
  },
];
