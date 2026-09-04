import type { ComponentType } from "react";
import type { PageNode } from "@/lib/fs-types";
import { TypewriterHeading } from "./TypewriterHeading";
import {
  BriefcaseIcon,
  CloudIcon,
  CodeIcon,
  GlobeIcon,
  ShieldIcon,
  SparkleIcon,
  WrenchIcon,
} from "@/components/ui/icons";

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  Languages: CodeIcon,
  "Security & Cryptography": ShieldIcon,
  "Web & Mobile": GlobeIcon,
  "Cloud, Data & APIs": CloudIcon,
  "AI & Machine Learning": SparkleIcon,
  "Tools & Environments": WrenchIcon,
  Additional: BriefcaseIcon,
};

export function SkillsDetail({ page }: { page: PageNode }) {
  const categories = page.sections.filter(
    (section): section is typeof section & { heading: string; items: string[] } =>
      Boolean(section.heading && section.items),
  );

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((section) => {
          const Icon = categoryIcons[section.heading] ?? CodeIcon;
          return (
            <div
              key={section.heading}
              className="group flex flex-col gap-3 rounded-lg border border-foreground/10 p-4 transition-colors hover:border-accent/50 hover:bg-accent/[.04] hover:shadow-[0_0_20px_-8px_var(--color-accent)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80 transition-colors group-hover:border-accent group-hover:text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="font-mono text-xs tracking-wide text-foreground/70 uppercase">
                  {section.heading}
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="rounded bg-foreground/[.06] px-2 py-0.5 font-mono text-xs text-foreground/80 transition-colors group-hover:bg-accent/[.1] group-hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
