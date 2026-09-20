import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentRoot = path.join(process.cwd(), "content");

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingTime: string;
};

export type ChapterMeta = {
  slug: string;
  title: string;
  summary: string;
  number: number;
  readingTime: string;
  estimatedMinutes: number;
};

export type ContentDoc<T> = {
  meta: T;
  content: string;
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

export function getAllPosts(): PostMeta[] {
  return readDir("posts")
    .map((slug) => {
      const { data, content } = loadFile("posts", slug);
      const stats = readingTime(content);
      return {
        slug,
        title: String(data.title ?? slug),
        summary: String(data.summary ?? ""),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readingTime: stats.text,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): ContentDoc<PostMeta> {
  const { data, content } = loadFile("posts", slug);
  const stats = readingTime(content);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      date: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTime: stats.text,
    },
    content,
  };
}

export function getAllChapters(): ChapterMeta[] {
  return readDir("chapters")
    .map((slug) => {
      const { data, content } = loadFile("chapters", slug);
      const stats = readingTime(content);
      return {
        slug,
        title: String(data.title ?? slug),
        summary: String(data.summary ?? ""),
        number: Number(data.number ?? 0),
        readingTime: stats.text,
        estimatedMinutes: Math.max(1, Math.ceil(stats.minutes)),
      };
    })
    .sort((a, b) => a.number - b.number);
}

export function getChapter(slug: string): ContentDoc<ChapterMeta> {
  const { data, content } = loadFile("chapters", slug);
  const stats = readingTime(content);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      number: Number(data.number ?? 0),
      readingTime: stats.text,
      estimatedMinutes: Math.max(1, Math.ceil(stats.minutes)),
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
