"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/content";
import { cn } from "@/lib/cn";

export function PostList({ posts }: { posts: PostMeta[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["all", ...Array.from(set).sort()];
  }, [posts]);

  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? posts : posts.filter((p) => p.tags.includes(active));

  return (
    <div>
      <div
        className="mb-8 flex flex-wrap gap-2"
        role="toolbar"
        aria-label="Filter posts by tag"
      >
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
            className={cn(
              "rounded-full border px-3 py-1 text-xs tracking-wide",
              active === tag
                ? "border-accent-violet/50 bg-[color-mix(in_srgb,var(--accent-violet)_14%,transparent)] text-text-primary"
                : "border-border text-text-muted hover:text-text-body",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <ol className="flex flex-col gap-4">
        {filtered.map((post) => (
          <li key={post.slug}>
            <article className="card-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-text-muted"
                >
                  {post.date}
                </time>
                <span className="text-xs text-text-muted">{post.readingTime}</span>
              </div>
              <h2
                className="mt-2 font-display text-2xl font-medium text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Link
                  href={`/writing/${post.slug}`}
                  className="hover:text-accent-teal"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-[68ch] text-text-body">{post.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-accent-violet"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
