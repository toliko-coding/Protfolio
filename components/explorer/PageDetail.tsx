import type { PageNode } from "@/lib/fs-types";

export function PageDetail({ page }: { page: PageNode }) {
  return (
    <article className="flex flex-col gap-5 p-4">
      <div>
        <h1 className="text-xl font-semibold">{page.name}</h1>
        {page.description && (
          <p className="text-sm text-foreground/60">{page.description}</p>
        )}
      </div>

      {page.sections.map((section, index) => (
        <section key={index} className="flex flex-col gap-2">
          {section.heading && (
            <h2 className="font-mono text-xs tracking-wide text-foreground/50 uppercase">
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
                  <span className="text-foreground/30">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
