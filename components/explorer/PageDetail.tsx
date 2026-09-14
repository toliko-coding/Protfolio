import Image from "next/image";
import type { ComponentType } from "react";
import type { PageNode, PageSection } from "@/lib/fs-types";
import { TypewriterHeading } from "./TypewriterHeading";
import { GlitchText } from "./GlitchText";
import {
  GraduationCapIcon,
  LocationIcon,
  ShieldIcon,
  SparkleIcon,
} from "@/components/ui/icons";

const factIcons: Record<
  NonNullable<PageNode["facts"]>[number]["icon"],
  ComponentType<{ className?: string }>
> = {
  location: LocationIcon,
  education: GraduationCapIcon,
  service: ShieldIcon,
  ai: SparkleIcon,
};

function isTextSection(section: PageSection) {
  return Boolean(section.heading || section.paragraphs || section.items || section.prompt);
}

type SectionWithImage = PageSection & {
  image: NonNullable<PageSection["image"]>;
};

function isImageOnlySection(section: PageSection): section is SectionWithImage {
  return Boolean(section.image) && !isTextSection(section);
}

// A mock prompt file in a terminal window. Each tag name periodically
// "decodes" through GlitchText (which already sits out prefers-reduced-motion),
// each on its own random schedule, so the card never flickers all at once.
function PromptCard({ prompt }: { prompt: NonNullable<PageSection["prompt"]> }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-accent/30 bg-terminal-surface shadow-[0_0_28px_-10px_var(--color-accent)]">
      <figcaption className="flex items-center gap-3 border-b border-accent/15 px-3 py-2 font-mono text-[11px] text-foreground/50">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <span className="h-2 w-2 rounded-full bg-accent/70" />
        </span>
        {prompt.title}
      </figcaption>
      <div className="flex flex-col gap-2.5 p-4 font-mono text-xs leading-relaxed">
        {prompt.lines.map((line) => (
          <p key={line.tag}>
            <span className="text-accent/50">&lt;</span>
            <GlitchText text={line.tag} className="text-accent" />
            <span className="text-accent/50">&gt;</span>{" "}
            <span className="text-foreground/80">{line.text}</span>{" "}
            <span className="text-accent/50">&lt;/{line.tag}&gt;</span>
          </p>
        ))}
        <p className="text-foreground/40" aria-hidden="true">
          <span className="text-accent">❯</span> run{" "}
          <span className="animate-blink text-accent">▍</span>
        </p>
      </div>
    </figure>
  );
}

function SectionBlock({ section }: { section: PageSection }) {
  return (
    <section className="flex flex-col gap-2">
      {section.heading && (
        <h2
          className={`flex items-center gap-1.5 font-mono text-xs tracking-wide uppercase ${
            section.prompt ? "text-glow text-accent" : "text-accent/70"
          }`}
        >
          {section.prompt && <SparkleIcon className="h-3.5 w-3.5" />}
          {section.heading}
        </h2>
      )}
      {section.paragraphs?.map((paragraph, pIndex) => (
        <p key={pIndex} className="text-sm text-foreground/80">
          {paragraph}
        </p>
      ))}
      {section.prompt && <PromptCard prompt={section.prompt} />}
      {section.items && section.items.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm text-foreground/80">
          {section.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent/50">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PageDetail({ page }: { page: PageNode }) {
  const textSections = page.sections.filter(isTextSection);
  const imageSections = page.sections.filter(isImageOnlySection);

  return (
    <article className="flex flex-col gap-6 p-4">
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-5">
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

          {page.facts && page.facts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {page.facts.map((fact) => {
                const Icon = factIcons[fact.icon];
                return (
                  <span
                    key={fact.label}
                    className="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[.05] px-2.5 py-1 font-mono text-xs text-foreground/75"
                  >
                    <Icon className="h-3.5 w-3.5 text-accent/70" />
                    {fact.label}
                  </span>
                );
              })}
            </div>
          )}

          {textSections.map((section, index) => (
            <SectionBlock key={index} section={section} />
          ))}
        </div>

        {page.image && (
          <Image
            src={page.image.src}
            alt={page.image.alt}
            width={page.image.width}
            height={page.image.height}
            className="w-56 shrink-0 rounded-lg border border-accent/30 object-cover shadow-[0_0_24px_-6px_var(--color-accent)] sm:sticky sm:top-0 sm:w-72"
            priority
          />
        )}
      </div>

      {imageSections.map((section, index) => (
        <Image
          key={index}
          src={section.image.src}
          alt={section.image.alt}
          width={section.image.width}
          height={section.image.height}
          className="h-auto w-full rounded-lg border border-accent/30 shadow-[0_0_24px_-6px_var(--color-accent)]"
        />
      ))}
    </article>
  );
}
