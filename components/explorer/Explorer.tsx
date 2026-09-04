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
    // paddingBottom on this non-scrolling wrapper shrinks the space actually
    // available to the scrollable panel below — the only approach that
    // structurally guarantees content can never render underneath the
    // StatusWidget. Padding inside the scrollable div instead (tried and
    // reverted) only adds blank trailing space AFTER the content's natural
    // position: at a narrower viewport, wrapped rows (e.g. a chip row
    // wrapping to two lines) still land at the widget's fixed screen
    // position and get genuinely covered, confirmed at 1024px width — the
    // gutter needs to change where content stops rendering, not just pad
    // after it. The --status-widget-space var is measured live by
    // StatusWidget itself (ResizeObserver), not a guessed pixel value, so
    // this stays correct at any viewport size or row count.
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ paddingBottom: "calc(var(--status-widget-space, 226px) + 12px)" }}
    >
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
