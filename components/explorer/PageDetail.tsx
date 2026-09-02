import Image from "next/image";
import type { PageNode, PageSection } from "@/lib/fs-types";
import { TypewriterHeading } from "./TypewriterHeading";

function isTextSection(section: PageSection) {
  return Boolean(section.heading || section.paragraphs || section.items);
}

type SectionWithImage = PageSection & {
  image: NonNullable<PageSection["image"]>;
};

function isImageOnlySection(section: PageSection): section is SectionWithImage {
  return Boolean(section.image) && !isTextSection(section);
}

function SectionBlock({ section }: { section: PageSection }) {
  return (
    <section className="flex flex-col gap-2">
      {section.heading && (
        <h2 className="font-mono text-xs tracking-wide text-accent/70 uppercase">
          {section.heading}
        </h2>
      )}
      {section.paragraphs?.map((paragraph, pIndex) => (
        <p key={pIndex} className="text-sm text-foreground/80">
          {paragraph}
        </p>
      ))}
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
