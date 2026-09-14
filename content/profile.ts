export interface SiteProfile {
  name: string;
  tagline: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  avatarSrc: string;
}

export const siteProfile: SiteProfile = {
  name: "Anatoli Kot",
  tagline: "Software Engineer · Cybersecurity",
  email: "Toli757@gmail.com",
  githubUrl: "https://github.com/toliko-coding",
  linkedinUrl: "https://www.linkedin.com/in/tolik-kot-10819b21b/",
  // A square, face-centered crop of the About portrait — the header renders
  // it as a 36px circle, and a center crop of the tall original lands on
  // the jacket rather than the face.
  avatarSrc: "/avatar-2026.jpg",
};
