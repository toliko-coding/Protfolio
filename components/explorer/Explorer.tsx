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
    <div className="flex h-full min-h-0 flex-col">
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
