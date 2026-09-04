import type { ComponentType } from "react";
import type { PageNode } from "@/lib/fs-types";
import { siteProfile } from "@/content/profile";
import { TypewriterHeading } from "./TypewriterHeading";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/ui/icons";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const links: ContactLink[] = [
  {
    label: "Email",
    value: siteProfile.email,
    href: `mailto:${siteProfile.email}`,
    icon: MailIcon,
  },
  {
    label: "GitHub",
    value: siteProfile.githubUrl.replace(/^https?:\/\//, ""),
    href: siteProfile.githubUrl,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    value: siteProfile.linkedinUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: siteProfile.linkedinUrl,
    icon: LinkedinIcon,
  },
];

export function ContactDetail({ page }: { page: PageNode }) {
  const paragraphs = page.sections.flatMap((section) => section.paragraphs ?? []);

  return (
    <article className="flex flex-col gap-6 p-4">
      <div>
        <TypewriterHeading
          key={page.name}
          text={page.name}
          className="font-mono text-xl font-semibold"
        />
        {page.description && (
          <p className="text-sm text-foreground/60">{page.description}</p>
        )}
      </div>

      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-sm text-foreground/80">
          {paragraph}
        </p>
      ))}

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-foreground/10 p-4 transition-colors hover:border-accent/50 hover:bg-accent/[.04] hover:shadow-[0_0_20px_-8px_var(--color-accent)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80 transition-colors group-hover:border-accent group-hover:text-accent">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-wide text-foreground/50 uppercase">
                {label}
              </p>
              <p className="truncate text-sm font-medium">{value}</p>
            </div>
          </a>
        ))}
      </div>
    </article>
  );
}
