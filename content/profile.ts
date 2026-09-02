export interface SiteProfile {
  name: string;
  tagline: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeHref: string;
  avatarSrc: string;
}

export const siteProfile: SiteProfile = {
  name: "Anatoli Kot",
  tagline: "Software Engineer · Cybersecurity",
  email: "Toli757@gmail.com",
  githubUrl: "https://github.com/toliko-coding",
  linkedinUrl: "https://www.linkedin.com/in/tolik-kot-10819b21b/",
  resumeHref: "/resume.pdf",
  avatarSrc: "/portrait.jpg",
};
