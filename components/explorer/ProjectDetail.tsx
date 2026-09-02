import Image from "next/image";
import type { ProjectNode } from "@/lib/fs-types";
import { AndroidDownloadButton } from "./AndroidDownloadButton";
import { TypewriterHeading } from "./TypewriterHeading";

export function ProjectDetail({ project }: { project: ProjectNode }) {
  const hasLinks = Boolean(
    project.links.github ||
      project.links.demo ||
      project.links.docs ||
      project.links.appStore,
  );

  return (
    <article className="flex flex-col gap-4 p-4">
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

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-mono text-xs text-accent/60">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-accent/60">Problem</dt>
          <dd>{project.problem}</dd>
        </div>
      </dl>

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

      {hasLinks && (
        <div className="flex flex-wrap items-start gap-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
              Live Demo
            </a>
          )}
          {project.links.appStore && <AndroidDownloadButton />}
          {project.links.docs && (
            <a
              href={project.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent/30 px-3 py-1.5 text-sm hover:border-accent/70 hover:bg-accent/10"
            >
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
