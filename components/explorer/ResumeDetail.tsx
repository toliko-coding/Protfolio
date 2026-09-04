import type { ComponentType } from "react";
import type { PageNode } from "@/lib/fs-types";
import { TypewriterHeading } from "./TypewriterHeading";
import {
  BriefcaseIcon,
  GlobeIcon,
  GraduationCapIcon,
  ShieldIcon,
} from "@/components/ui/icons";

const sectionIcons: Record<string, ComponentType<{ className?: string }>> = {
  Experience: BriefcaseIcon,
  Education: GraduationCapIcon,
  "Reserve Military Service": ShieldIcon,
  "Current Professional Training": GraduationCapIcon,
};

// Entries are written as "Title — detail (dates)"; not every entry has the
// " — " separator (e.g. a bare language name), so detail is optional.
function splitEntry(item: string): { title: string; detail?: string } {
  const separator = " — ";
  const index = item.indexOf(separator);
  if (index === -1) return { title: item };
  return {
    title: item.slice(0, index),
    detail: item.slice(index + separator.length),
  };
}

export function ResumeDetail({ page }: { page: PageNode }) {
  const summary = page.sections.find((section) => section.heading === "Summary");
  const languages = page.sections.find((section) => section.heading === "Languages");
  const timelineSections = page.sections.filter(
    (section): section is typeof section & { heading: string; items: string[] } =>
      Boolean(
        section.heading &&
          section.items &&
          section.heading !== "Summary" &&
          section.heading !== "Languages",
      ),
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

      {summary?.paragraphs?.map((paragraph, index) => (
        <p
          key={index}
          className="border-l-2 border-accent/30 pl-3 text-sm text-foreground/80"
        >
          {paragraph}
        </p>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {timelineSections.map((section) => {
          const Icon = sectionIcons[section.heading] ?? BriefcaseIcon;
          return (
            <div
              key={section.heading}
              className="flex flex-col gap-3 rounded-lg border border-foreground/10 p-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="font-mono text-xs tracking-wide text-foreground/70 uppercase">
                  {section.heading}
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => {
                  const { title, detail } = splitEntry(item);
                  return (
                    <li
                      key={item}
                      className="border-l-2 border-accent/20 pl-3 text-sm"
                    >
                      <p className="font-medium text-foreground/90">{title}</p>
                      {detail && (
                        <p className="text-xs text-foreground/60">{detail}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {languages?.items && languages.items.length > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-foreground/10 p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[.08] text-accent/80">
              <GlobeIcon className="h-4 w-4" />
            </span>
            <h2 className="font-mono text-xs tracking-wide text-foreground/70 uppercase">
              Languages
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {languages.items.map((item) => (
              <span
                key={item}
                className="rounded bg-foreground/[.06] px-2 py-0.5 font-mono text-xs text-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
