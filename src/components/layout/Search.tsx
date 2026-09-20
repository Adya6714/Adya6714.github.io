"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import researchNodesData from "../../../content/research-nodes.json";

type Hit = { label: string; href: string; group: string };

const researchHits: Hit[] = (
  researchNodesData as { id: string; title: string }[]
).map((n) => ({
  label: n.title,
  href: `/research#${n.id}`,
  group: "Research",
}));

export function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const router = useRouter();

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    const staticHits: Hit[] = [
      { label: "Home", href: "/", group: "Pages" },
      { label: "Research", href: "/research", group: "Pages" },
      { label: "Library", href: "/library", group: "Pages" },
      { label: "Writing", href: "/writing", group: "Pages" },
      { label: "About & CV", href: "/about", group: "Pages" },
      ...researchHits,
    ];
    if (!query) return staticHits.slice(0, 8);
    return staticHits.filter((h) => h.label.toLowerCase().includes(query));
  }, [q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-[12px] border border-border bg-bg-card px-3 py-2 text-sm text-text-muted hover:text-text-body"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>Search</span>
        <kbd className="font-mono text-[10px] tracking-wide">⌘K</kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Site search"
          className="fixed inset-0 z-50 flex items-start justify-center bg-[color-mix(in_srgb,var(--bg-base)_72%,transparent)] p-4 pt-[12vh] backdrop-blur-[2px]"
          onClick={close}
        >
          <div
            className="card-surface w-full max-w-lg overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="sr-only" htmlFor={listId}>
              Search Lumenwald
            </label>
            <input
              id={listId}
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages and research…"
              className="w-full border-b border-border bg-transparent px-4 py-3 text-text-primary outline-none placeholder:text-text-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter" && hits[0]) {
                  router.push(hits[0].href);
                  close();
                }
              }}
            />
            <ul className="max-h-72 overflow-y-auto py-2" role="listbox">
              {hits.length === 0 && (
                <li className="px-4 py-3 text-sm text-text-muted">No matches</li>
              )}
              {hits.map((h) => (
                <li key={h.href + h.label}>
                  <button
                    type="button"
                    className="flex w-full items-baseline justify-between px-4 py-2.5 text-left hover:bg-[color-mix(in_srgb,var(--accent-teal)_10%,transparent)]"
                    onClick={() => {
                      router.push(h.href);
                      close();
                    }}
                  >
                    <span className="text-sm text-text-primary">{h.label}</span>
                    <span className="label-caps">{h.group}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
