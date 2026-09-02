import Image from "next/image";
import type { PageNode } from "@/lib/fs-types";

export function PageDetail({ page }: { page: PageNode }) {
  return (
    <article className="flex flex-col-reverse gap-6 p-4 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="font-mono text-xl font-semibold">{page.name}</h1>
          {page.description && (
            <p className="text-sm text-foreground/60">{page.description}</p>
          )}
        </div>

        {page.sections.map((section, index) => (
          <section key={index} className="flex flex-col gap-2">
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
    </article>
  );
}
