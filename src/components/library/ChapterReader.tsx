"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAmbience } from "@/components/ambience/AmbienceProvider";
import type { ChapterMeta } from "@/lib/content";
import { cn } from "@/lib/cn";

const PROGRESS_KEY = "lumenwald-library-progress";
const SCROLL_KEY = "lumenwald-library-scroll";
const SIZE_KEY = "lumenwald-reader-size";

type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = {
  sm: "text-[15px] leading-[1.75]",
  md: "text-[17px] leading-[1.85]",
  lg: "text-[19px] leading-[1.9]",
};

export function ChapterReader({
  chapter,
  prev,
  next,
  children,
}: {
  chapter: ChapterMeta;
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
  children: React.ReactNode;
}) {
  const { setReaderMode } = useAmbience();
  const [size, setSize] = useState<Size>("md");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setReaderMode(true);
    const stored = localStorage.getItem(SIZE_KEY) as Size | null;
    if (stored === "sm" || stored === "md" || stored === "lg") setSize(stored);

    const scrollMap = JSON.parse(
      localStorage.getItem(SCROLL_KEY) ?? "{}",
    ) as Record<string, number>;
    const y = scrollMap[chapter.slug];
    if (typeof y === "number") {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }

    return () => setReaderMode(false);
  }, [chapter.slug, setReaderMode]);

  useEffect(() => {
    localStorage.setItem(SIZE_KEY, size);
  }, [size]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 1;
      setProgress(pct);

      const progressMap = JSON.parse(
        localStorage.getItem(PROGRESS_KEY) ?? "{}",
      ) as Record<string, number>;
      progressMap[chapter.slug] = Math.max(progressMap[chapter.slug] ?? 0, pct);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
      window.dispatchEvent(new Event("lumenwald-progress"));

      const scrollMap = JSON.parse(
        localStorage.getItem(SCROLL_KEY) ?? "{}",
      ) as Record<string, number>;
      scrollMap[chapter.slug] = window.scrollY;
      localStorage.setItem(SCROLL_KEY, JSON.stringify(scrollMap));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapter.slug]);

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className="fixed top-0 right-0 left-0 z-50 h-1 bg-border lg:left-[var(--sidebar-width)]"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-accent-teal transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link href="/library" className="text-sm text-accent-teal hover:underline">
          ← Library
        </Link>
        <div
          className="flex items-center gap-1 rounded-[12px] border border-border p-1"
          role="group"
          aria-label="Text size"
        >
          {(["sm", "md", "lg"] as Size[]).map((s) => (
            <button
              key={s}
              type="button"
              className={cn(
                "rounded-[10px] px-2.5 py-1 text-xs uppercase",
                size === s
                  ? "bg-[color-mix(in_srgb,var(--accent-violet)_18%,transparent)] text-text-primary"
                  : "text-text-muted",
              )}
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <header className="mb-8">
        <p className="label-caps mb-2">
          Chapter {String(chapter.order).padStart(2, "0")}
        </p>
        <h1
          className="font-display text-4xl font-medium text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {chapter.title}
        </h1>
        <p className="mt-2 text-text-muted">{chapter.readTime}</p>
      </header>

      <div className={cn("prose-lumen", sizeClass[size])}>{children}</div>

      <nav
        aria-label="Chapter pagination"
        className="mt-14 flex items-center justify-between gap-4 border-t border-border pt-6"
      >
        {prev ? (
          <Link href={`/library/${prev.slug}`} className="btn btn-ghost">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/library/${next.slug}`} className="btn btn-primary">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
