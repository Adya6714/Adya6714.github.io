import {
  getLiveLinks,
  getRelatedLibraryChapters,
  getResearchNodes,
  type LibraryMatch,
  type ResearchNode,
  nodeLayout,
} from "@/lib/content";

export type ConstellationNode = ResearchNode & {
  x: number;
  y: number;
  liveLinks: { label: string; href: string }[];
  relatedLibrary: LibraryMatch[];
};

/** Precompute constellation payload at build/request time — links + library tag matches. */
export function getConstellationData(): ConstellationNode[] {
  return getResearchNodes().map((node, i) => {
    const layout = nodeLayout[node.id] ?? {
      x: 20 + (i % 3) * 30,
      y: 25 + Math.floor(i / 3) * 30,
    };
    const liveLinks = getLiveLinks(node);
    const relatedLibrary = getRelatedLibraryChapters(node);

    // Dev/build visibility: confirm link gating + tag matches
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[constellation] ${node.id}: links=${liveLinks.length} library=${relatedLibrary.map((c) => c.slug).join(",") || "none"}`,
      );
    }

    return {
      ...node,
      ...layout,
      liveLinks,
      relatedLibrary,
    };
  });
}
