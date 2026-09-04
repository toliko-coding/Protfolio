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
    // after it.
    //
    // --status-widget-space is measured from StatusWidget's hidden,
    // pill-ONLY measuring clone — never its actual visible open/closed
    // state, and never the full expanded box. Two things were tried and
    // reverted before this (see StatusWidget's own comment for the full
    // reasoning): reserving whatever's currently visible caused a layout
    // shift on every toggle; reserving the expanded size unconditionally
    // avoided that shift but permanently cost ~226px of content height on
    // every page for a box that's open 1% of the time. Reserving just the
    // pill keeps this padding small and genuinely constant — the expanded
    // breakdown is allowed to overlap content like a normal popover while
    // deliberately open, which isn't the same complaint as passive overlap.
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ paddingBottom: "calc(var(--status-widget-space, 78px) + 12px)" }}
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
