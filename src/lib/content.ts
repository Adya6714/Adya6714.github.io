import fs from "fs";
import path from "path";
import matter from "gray-matter";
import experienceData from "../../content/experience.json";
import researchNodesData from "../../content/research-nodes.json";

const contentRoot = path.join(process.cwd(), "content");

export type ExperienceItem = {
  role: string;
  org: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResearchLinks = {
  repo: string | null;
  paper: string | null;
};

export type ResearchNode = {
  id: string;
  title: string;
  akaTitle?: string;
  depth: 1 | 2 | 3;
  status: string;
  summary: string;
  links: ResearchLinks;
  relatedNodeIds: string[];
};

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readTime: string;
};

export type ChapterMeta = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  tags: string[];
  readTime: string;
};

export type ContentDoc<T> = {
  meta: T;
  content: string;
};

export type LibraryMatch = {
  slug: string;
  title: string;
  readTime: string;
};

function readDir(dir: string) {
  const full = path.join(contentRoot, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function loadFile(dir: string, slug: string) {
  const full = path.join(contentRoot, dir, `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  return matter(raw);
}

export function getExperience(): ExperienceItem[] {
  return experienceData as ExperienceItem[];
}

export function getResearchNodes(): ResearchNode[] {
  return researchNodesData as ResearchNode[];
}

export function getResearchNode(id: string): ResearchNode | undefined {
  return getResearchNodes().find((n) => n.id === id);
}

/** Only return link entries that have a real URL — never dead buttons. */
export function getLiveLinks(node: ResearchNode): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  if (node.links.repo) out.push({ label: "Repository", href: node.links.repo });
  if (node.links.paper) out.push({ label: "Paper", href: node.links.paper });
  return out;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 3);
}

/**
 * Build-time match: chapter tags overlap node id, akaTitle tokens, or title keywords.
 * Proven live via library tags that include node ids (e.g. reasoning-fragility).
 */
export function getRelatedLibraryChapters(node: ResearchNode): LibraryMatch[] {
  const chapters = getAllChapters();
  const titleTokens = new Set([
    ...tokenize(node.title),
    ...(node.akaTitle ? tokenize(node.akaTitle) : []),
  ]);

  return chapters
    .filter((ch) => {
      const tags = ch.tags.map((t) => t.toLowerCase());
      if (tags.includes(node.id.toLowerCase())) return true;
      if (node.akaTitle && tags.includes(node.akaTitle.toLowerCase())) return true;
      return tags.some((t) => titleTokens.has(t) || tokenize(t).some((x) => titleTokens.has(x)));
    })
    .map((ch) => ({
      slug: ch.slug,
      title: ch.title,
      readTime: ch.readTime,
    }));
}

export function getAllPosts(): PostMeta[] {
  return readDir("writing")
    .map((slug) => {
      const { data } = loadFile("writing", slug);
      return {
        slug,
        title: String(data.title ?? slug),
        summary: String(data.summary ?? ""),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readTime: String(data.readTime ?? "1 min"),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): ContentDoc<PostMeta> {
  const { data, content } = loadFile("writing", slug);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      date: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readTime: String(data.readTime ?? "1 min"),
    },
    content,
  };
}

export function getAllChapters(): ChapterMeta[] {
  return readDir("library")
    .map((slug) => {
      const { data } = loadFile("library", slug);
      return {
        slug,
        title: String(data.title ?? slug),
        summary: String(data.summary ?? ""),
        order: Number(data.order ?? 0),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readTime: String(data.readTime ?? "1 min"),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getChapter(slug: string): ContentDoc<ChapterMeta> {
  const { data, content } = loadFile("library", slug);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      order: Number(data.order ?? 0),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readTime: String(data.readTime ?? "1 min"),
    },
    content,
  };
}

export function getAdjacent<T extends { slug: string }>(
  items: T[],
  slug: string,
): { prev: T | null; next: T | null } {
  const idx = items.findIndex((i) => i.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx < items.length - 1 ? items[idx + 1] : null,
  };
}

/** Manual layout coords for constellation (0–100 viewBox). */
export const nodeLayout: Record<string, { x: number; y: number }> = {
  "reasoning-fragility": { x: 42, y: 28 },
  "volatility-hedging": { x: 72, y: 38 },
  "document-vlm": { x: 78, y: 68 },
  "quantum-hybrid": { x: 28, y: 62 },
  omnimesh: { x: 52, y: 78 },
  fraudscope360: { x: 18, y: 36 },
};
