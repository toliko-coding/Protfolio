import type { PageNode } from "@/lib/fs-types";

export const skills: PageNode = {
  id: "skills",
  slug: "skills",
  name: "Skills",
  path: "/skills",
  type: "page",
  description: "What I work with — pulled from the stacks behind every project on this site.",
  sections: [
    {
      heading: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "C", "SQL", "HTML"],
    },
    {
      heading: "Security & Cryptography",
      items: [
        "Kali Linux",
        "Nmap",
        "Metasploit",
        "Wireshark",
        "ECC & AES-GCM",
        "Zero-Knowledge Proofs",
        "Malware Analysis",
        "Packet Sniffing",
      ],
    },
    {
      heading: "Web & Mobile",
      items: [
        "React",
        "Next.js",
        "React Native (Expo)",
        "Tailwind CSS",
        "Android SDK",
        ".NET / ASP.NET MVC",
      ],
    },
    {
      heading: "Cloud, Data & APIs",
      items: [
        "Supabase",
        "Firebase",
        "REST API Integration",
        "Zod",
        "Twilio",
        "VirusTotal API",
      ],
    },
    {
      heading: "AI & Machine Learning",
      items: [
        "TensorFlow.js",
        "OpenCV",
        "ChatGPT",
        "Claude",
        "Prompt Engineering",
      ],
    },
    {
      heading: "Tools & Environments",
      items: [
        "Git",
        "GitHub",
        "Jira",
        "Linux",
        "Virtual Machines",
        "Android Studio",
      ],
    },
    {
      heading: "Additional",
      items: ["SAP-based systems", "Technical support", "Internet hardware"],
    },
  ],
};
