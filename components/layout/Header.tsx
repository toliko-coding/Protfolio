import Image from "next/image";
import { siteProfile } from "@/content/profile";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  ResumeIcon,
} from "@/components/ui/icons";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-foreground/10 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <ThinkingOrb
          state="shaping"
          size={20}
          theme="dark"
          aria-hidden="true"
          className="shrink-0"
        />
        <Image
          src={siteProfile.avatarSrc}
          alt={siteProfile.name}
          width={64}
          height={64}
          className="h-9 w-9 shrink-0 rounded-full border border-accent/40 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-medium">
            {siteProfile.name}
          </p>
          <p className="truncate text-xs text-foreground/60">
            {siteProfile.tagline}
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-1 text-xs" aria-label="Quick links">
        <a
          href={siteProfile.resumeHref}
          download
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-accent/10 hover:text-accent"
        >
          <ResumeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Resume</span>
        </a>
        <a
          href={siteProfile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-accent/10 hover:text-accent"
        >
          <GithubIcon className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <a
          href={siteProfile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-accent/10 hover:text-accent"
        >
          <LinkedinIcon className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        <a
          href={`mailto:${siteProfile.email}`}
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-accent/10 hover:text-accent"
        >
          <MailIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Contact</span>
        </a>
      </nav>
    </header>
  );
}
