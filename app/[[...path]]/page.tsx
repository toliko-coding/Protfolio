import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPaths, pathToSegments, resolvePath } from "@/lib/fs-utils";
import { isFolder, isPage, isProject } from "@/lib/fs-types";
import { Explorer } from "@/components/explorer/Explorer";
import { siteProfile } from "@/content/profile";

export function generateStaticParams() {
  return getAllPaths().map((path) => ({ path: pathToSegments(path) }));
}

interface ExplorerPageProps {
  params: Promise<{ path?: string[] }>;
}

function resolveCurrentNode(path?: string[]) {
  const currentPath = path && path.length > 0 ? `/${path.join("/")}` : "/";
  return resolvePath(currentPath);
}

export async function generateMetadata({
  params,
}: ExplorerPageProps): Promise<Metadata> {
  const { path } = await params;
  const node = resolveCurrentNode(path);

  if (!node) {
    return { title: "Not Found" };
  }

  // Root bypasses the layout's title template — it already has the full
  // "name — tagline" form, not "name — Site Name".
  if (node.path === "/" && isFolder(node)) {
    const title = `${siteProfile.name} — ${siteProfile.tagline}`;
    const description = node.intro?.[0] ?? siteProfile.tagline;
    return {
      title: { absolute: title },
      description,
      openGraph: { title, description, type: "website" },
    };
  }

  const description = isProject(node)
    ? node.summary
    : isPage(node)
      ? (node.description ?? siteProfile.tagline)
      : (node.description ?? `${node.name} — ${siteProfile.tagline}`);

  return {
    title: node.name,
    description,
    openGraph: {
      title: `${node.name} — ${siteProfile.name}`,
      description,
      type: "website",
    },
  };
}

export default async function ExplorerPage({ params }: ExplorerPageProps) {
  const { path } = await params;
  const node = resolveCurrentNode(path);

  if (!node) {
    notFound();
  }

  return <Explorer node={node} />;
}
