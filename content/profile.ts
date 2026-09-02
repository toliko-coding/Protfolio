export interface SiteProfile {
  name: string;
  tagline: string;
  email: string;
  githubUrl: string;
  resumeHref: string;
}

// Placeholder values — real content lands in Phase 10.
export const siteProfile: SiteProfile = {
  name: "Your Name",
  tagline: "Software Engineer · Cybersecurity",
  email: "you@example.com",
  githubUrl: "https://github.com/your-username",
  resumeHref: "/resume.pdf",
};
