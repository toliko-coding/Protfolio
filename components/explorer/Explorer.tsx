import type { ComponentType } from "react";
import { getBreadcrumbTrail } from "@/lib/fs-utils";
import { isFolder, isPage, isProject, type FSNode, type PageNode } from "@/lib/fs-types";
import { Breadcrumb } from "./Breadcrumb";
import { FolderGrid } from "./FolderGrid";
import { ProjectDetail } from "./ProjectDetail";
import { PageDetail } from "./PageDetail";
import { SkillsDetail } from "./SkillsDetail";
import { ResumeDetail } from "./ResumeDetail";
import { ContactDetail } from "./ContactDetail";

// A handful of singleton pages get a purpose-built layout instead of the
// generic PageDetail — keyed by slug since each only exists once in the tree.
const pageOverrides: Record<string, ComponentType<{ page: PageNode }>> = {
  skills: SkillsDetail,
  resume: ResumeDetail,
  contact: ContactDetail,
};

export function Explorer({ node }: { node: FSNode }) {
  const trail = getBreadcrumbTrail(node.path);

  return (
    // pb-44 on this (non-scrolling) wrapper shrinks the space actually
    // available to the scrollable panel below, permanently reserving room
    // for the StatusWidget — fixed bottom-right and open by default — so it
    // never ends up sitting on top of real content, short pages included.
    // Padding on the scrollable div itself wouldn't do this: its height is
    // already fixed by flex-1, so trailing padding would just add scrollable
    // empty space after the content rather than shrinking where it renders.
    <div className="flex h-full min-h-0 flex-col pb-60">
      <Breadcrumb trail={trail} />
      <div className="min-h-0 flex-1 overflow-auto">
        {isFolder(node) && (
          <FolderGrid nodes={node.children} intro={node.intro} />
        )}
        {isProject(node) && <ProjectDetail project={node} />}
        {isPage(node) &&
          (() => {
            const Override = pageOverrides[node.slug];
            return Override ? <Override page={node} /> : <PageDetail page={node} />;
          })()}
      </div>
    </div>
  );
}
