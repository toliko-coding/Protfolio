import type { ProjectNode } from "./fs-types";

export interface SkillDomain {
  label: string;
  icon: "shield" | "globe" | "cloud" | "code" | "sparkle";
}

interface DomainDef extends SkillDomain {
  match: (project: ProjectNode) => boolean;
}

// Broad domains only, and deliberately not scored or ranked against each
// other — a recruiter shouldn't be able to read "1 of 13 projects" and
// conclude a skill is weak. Each domain is just present or absent across
// the whole site.
const DOMAIN_DEFS: DomainDef[] = [
  { label: "Cybersecurity", icon: "shield", match: (p) => p.tags.includes("security") },
  {
    label: "Web & Mobile",
    icon: "globe",
    match: (p) => p.techStack.some((t) => /React|Next\.js|Android|\.NET|HTML/.test(t)),
  },
  {
    label: "Cloud & APIs",
    icon: "cloud",
    match: (p) =>
      p.techStack.some((t) => t === "Firebase" || t === "Supabase" || /API/.test(t)),
  },
  {
    label: "Languages",
    icon: "code",
    match: (p) => p.techStack.some((t) => ["Python", "Java", "C++", "C", "Sockets"].includes(t)),
  },
  {
    label: "AI & Automation",
    icon: "sparkle",
    match: (p) => p.techStack.some((t) => /TensorFlow|OpenCV/.test(t)),
  },
];

export function computeSkillDomains(projects: ProjectNode[]): SkillDomain[] {
  return DOMAIN_DEFS.filter((def) => projects.some(def.match)).map(({ label, icon }) => ({
    label,
    icon,
  }));
}
