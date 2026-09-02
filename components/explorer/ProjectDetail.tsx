import type { ProjectNode } from "@/lib/fs-types";

export function ProjectDetail({ project }: { project: ProjectNode }) {
  const hasLinks = Boolean(
    project.links.github || project.links.demo || project.links.docs,
  );

  return (
    <article className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-foreground/15 px-2 py-0.5 font-mono text-[11px] tracking-wide text-foreground/60 uppercase"
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

      <h1 className="text-xl font-semibold">{project.name}</h1>
      <p className="text-sm text-foreground/70">{project.summary}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-mono text-xs text-foreground/40">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-foreground/40">Problem</dt>
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
        <div className="flex flex-wrap gap-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-foreground/15 px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-foreground/15 px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              Live Demo
            </a>
          )}
          {project.links.docs && (
            <a
              href={project.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-foreground/15 px-3 py-1.5 text-sm hover:bg-foreground/5"
            >
              Docs
            </a>
          )}
        </div>
      )}

      {project.media && project.media.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {project.media.map((item) => (
            // Placeholder <img> handling — revisit with next/image once real screenshots exist (Phase 10/11).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              className="rounded border border-foreground/10"
            />
          ))}
        </div>
      )}
    </article>
  );
}
