import type { PageNode } from "@/lib/fs-types";

export const about: PageNode = {
  id: "about",
  slug: "about",
  name: "About",
  path: "/about",
  type: "page",
  description: "Who I am.",
  sections: [
    {
      paragraphs: [
        "I'm Anatoli Kot, a software engineer with a cybersecurity specialization, based in Beer Sheva, Israel.",
        "I completed my B.Sc. in Software Engineering at Sami Shamoon College of Engineering (SCE), specializing in cybersecurity — covering computer networks, cryptography, software development, databases, and machine learning. My final project, SMSNet, combined Android development, applied machine learning, and mobile security to detect SMS phishing attempts on-device.",
        "Professionally, I've worked across SAP system implementation and support at Soroka Medical Center, technical support at Partner Communications, and hands-on production environments — experience that's given me a practical, troubleshooting-first approach to engineering problems.",
        "I'm currently completing a practical cybersecurity course at Ecom School, covering penetration testing, vulnerability assessment, and security analysis with tools like Kali Linux, Nmap, Metasploit, and Wireshark, alongside ongoing IDF reserve duty.",
      ],
    },
  ],
};
