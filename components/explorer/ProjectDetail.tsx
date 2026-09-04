import Image from "next/image";
import type { ProjectNode } from "@/lib/fs-types";
import { AndroidDownloadButton } from "./AndroidDownloadButton";
import { TypewriterHeading } from "./TypewriterHeading";
import {
  BriefcaseIcon,
  CodeIcon,
  ExternalLinkIcon,
  GithubIcon,
  TargetIcon,
} from "@/components/ui/icons";

export function ProjectDetail({ project }: { project: ProjectNode }) {
  const hasLinks = Boolean(
    project.links.github ||
      project.links.demo ||
      project.links.docs ||
      project.links.appStore,
  );

  return (
    <article className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[11px] tracking-wide text-accent/80 uppercase"
            >
              {tag}
            </span>
          ))}
          {project.difficulty && (
            <span className="rounded-full border border-foreground/15 px-2 py-0.5 font-mono text-[11px] tracking-wide text-foreground/60 uppercase">
              {project.difficulty}
            </span>
          )}
        </div>

        <TypewriterHeading
          key={project.name}
          text={project.name}
          className="font-mono text-xl font-semibold"
        />
        <p className="text-sm text-foreground/70">{project.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-lg border border-foreground/10 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80">
              <BriefcaseIcon className="h-3.5 w-3.5" />
            </span>
            <h2 className="font-mono text-xs tracking-wide text-foreground/60 uppercase">
              Role
            </h2>
          </div>
          <p className="text-sm text-foreground/85">{project.role}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-foreground/10 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80">
              <TargetIcon className="h-3.5 w-3.5" />
            </span>
            <h2 className="font-mono text-xs tracking-wide text-foreground/60 uppercase">
              Problem
            </h2>
          </div>
          <p className="text-sm text-foreground/85">{project.problem}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <CodeIcon className="h-3.5 w-3.5 text-accent/60" />
          <h2 className="font-mono text-xs tracking-wide text-foreground/50 uppercase">
            Tech Stack
          </h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded bg-foreground/[.06] px-2 py-0.5 font-mono text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {hasLinks && (
        <div className="flex flex-wrap items-start gap-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.links.appStore && <AndroidDownloadButton />}
          {project.links.docs && (
            <a
              href={project.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Docs
            </a>
          )}
        </div>
      )}

      {project.media && project.media.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          {project.media.map((item) => (
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="h-auto w-full rounded-lg border border-accent/30 shadow-[0_0_24px_-6px_var(--color-accent)]"
            />
          ))}
        </div>
      )}
    </article>
  );
}
