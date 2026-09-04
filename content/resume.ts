import type { PageNode } from "@/lib/fs-types";

export const resume: PageNode = {
  id: "resume",
  slug: "resume",
  name: "Resume",
  path: "/resume",
  type: "page",
  description: "On-site resume.",
  sections: [
    {
      heading: "Summary",
      paragraphs: [
        "Highly motivated software engineering candidate with a strong background in programming, cybersecurity, technical support, and system implementation. Experienced in troubleshooting, SAP-based system support, and training users in demanding operational environments.",
      ],
    },
    {
      heading: "Experience",
      items: [
        "SAP System Implementer — Ness Technologies | Soroka Medical Center, Beer Sheva (Oct 2024–2025)",
        "Technical Support Representative — Partner Communications (Jun 2023–Oct 2024)",
        "Production Machine Operator — HP Indigo, Kiryat Gat (Mar 2022–May 2023)",
        "Sales Representative — Ivory, Beer Sheva (Aug 2018–Jul 2019)",
      ],
    },
    {
      heading: "Education",
      items: [
        "B.Sc. Software Engineering, Cybersecurity specialization — Sami Shamoon College of Engineering (SCE), Beer Sheva (2019–2024)",
        "Final project: AI-based SMS phishing detection application (SMSNet)",
      ],
    },
    {
      heading: "Reserve Military Service",
      items: ["IDF Reserve Duty — פיקוד הנדסה טנ\"א (2025–Present)"],
    },
    {
      heading: "Current Professional Training",
      items: ["Cybersecurity Course — Ecom School (2026–Present)"],
    },
    {
      heading: "Languages",
      items: ["Hebrew — Native", "Russian", "English"],
    },
  ],
};
