import { siteProfile } from "@/content/profile";
import { GithubIcon, MailIcon, ResumeIcon } from "@/components/ui/icons";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-foreground/10 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-mono text-sm font-medium">
          {siteProfile.name}
        </p>
        <p className="truncate text-xs text-foreground/60">
          {siteProfile.tagline}
        </p>
      </div>
      <nav className="flex items-center gap-1 text-xs" aria-label="Quick links">
        <a
          href={siteProfile.resumeHref}
          download
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-foreground/5"
        >
          <ResumeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Resume</span>
        </a>
        <a
          href={siteProfile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-foreground/5"
        >
          <GithubIcon className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <a
          href={`mailto:${siteProfile.email}`}
          className="flex items-center gap-1.5 rounded px-2 py-1.5 hover:bg-foreground/5"
        >
          <MailIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Contact</span>
        </a>
      </nav>
    </header>
  );
}
