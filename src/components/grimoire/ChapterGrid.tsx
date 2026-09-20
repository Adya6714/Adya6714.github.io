"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChapterMeta } from "@/lib/content";

const PROGRESS_KEY = "lumenwald-grimoire-progress";

function readProgress(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<
      string,
      number
    >;
  } catch {
    return {};
  }
}

function ProgressRing({ value }: { value: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - Math.min(1, Math.max(0, value)) * c;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="3"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--accent-teal)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
      />
    </svg>
  );
}

export function ChapterGrid({ chapters }: { chapters: ChapterMeta[] }) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setProgress(readProgress());
    const onStorage = () => setProgress(readProgress());
    window.addEventListener("storage", onStorage);
    window.addEventListener("lumenwald-progress", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lumenwald-progress", onStorage);
    };
  }, []);

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {chapters.map((ch) => {
        const pct = progress[ch.slug] ?? 0;
        return (
          <li key={ch.slug}>
            <Link
              href={`/grimoire/${ch.slug}`}
              className="card-surface flex items-start gap-4 p-5 transition-colors hover:border-accent-violet/40"
            >
              <div className="relative shrink-0">
                <ProgressRing value={pct} />
                <span className="absolute inset-0 grid place-items-center font-mono text-[10px] text-text-muted">
                  {String(ch.number).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3
                  className="font-display text-xl font-medium text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {ch.title}
                </h3>
                <p className="mt-1 text-sm text-text-body">{ch.summary}</p>
                <p className="mt-2 text-xs text-text-muted">
                  ~{ch.estimatedMinutes} min · {Math.round(pct * 100)}% read
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
