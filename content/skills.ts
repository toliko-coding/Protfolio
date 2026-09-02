import type { PageNode } from "@/lib/fs-types";

export const skills: PageNode = {
  id: "skills",
  slug: "skills",
  name: "Skills",
  path: "/skills",
  type: "page",
  description: "What I work with.",
  sections: [
    {
      heading: "Programming",
      items: ["C++", "Python", "Java", "SQL", "JavaScript", "HTML"],
    },
    {
      heading: "Cybersecurity",
      items: ["Kali Linux", "Nmap", "Metasploit", "Wireshark"],
    },
    {
      heading: "Tools & Environments",
      items: [
        "Git",
        "GitHub",
        "Jira",
        "Linux",
        "Virtual Machines",
        "React",
        "Android Studio",
        "Firebase",
      ],
    },
    {
      heading: "AI Tools",
      items: ["ChatGPT", "Claude", "Prompt Engineering"],
    },
    {
      heading: "Additional",
      items: ["SAP-based systems", "Technical support", "Internet hardware"],
    },
  ],
};
