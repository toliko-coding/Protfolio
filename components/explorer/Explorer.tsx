import { getBreadcrumbTrail } from "@/lib/fs-utils";
import { isFolder, isProject, type FSNode } from "@/lib/fs-types";
import { Breadcrumb } from "./Breadcrumb";
import { FolderGrid } from "./FolderGrid";
import { ProjectDetail } from "./ProjectDetail";
import { PageDetail } from "./PageDetail";

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
        {!isFolder(node) && !isProject(node) && <PageDetail page={node} />}
      </div>
    </div>
  );
}
