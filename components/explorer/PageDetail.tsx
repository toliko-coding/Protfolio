import type { PageNode } from "@/lib/fs-types";

export function PageDetail({ page }: { page: PageNode }) {
  return (
    <article className="flex flex-col gap-3 p-4">
      <h1 className="text-xl font-semibold">{page.name}</h1>
      {page.description && (
        <p className="text-sm text-foreground/60">{page.description}</p>
      )}
      <p className="text-sm text-foreground/70">{page.body}</p>
    </article>
  );
}
