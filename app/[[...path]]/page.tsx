import { notFound } from "next/navigation";
import { getAllPaths, pathToSegments, resolvePath } from "@/lib/fs-utils";
import { Explorer } from "@/components/explorer/Explorer";

export function generateStaticParams() {
  return getAllPaths().map((path) => ({ path: pathToSegments(path) }));
}

interface ExplorerPageProps {
  params: Promise<{ path?: string[] }>;
}

export default async function ExplorerPage({ params }: ExplorerPageProps) {
  const { path } = await params;
  const currentPath = path && path.length > 0 ? `/${path.join("/")}` : "/";
  const node = resolvePath(currentPath);

  if (!node) {
    notFound();
  }

  return <Explorer node={node} />;
}
