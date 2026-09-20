"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ConstellationNode } from "@/lib/constellation";
import { cn } from "@/lib/cn";

function nodeRadius(depth: number) {
  return 8 + depth * 6;
}

function NodePanel({
  node,
  onClose,
}: {
  node: ConstellationNode;
  onClose: () => void;
}) {
  return (
    <aside
      className="card-surface flex h-full flex-col gap-4 p-5"
      aria-label={`${node.title} details`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caps mb-1">{node.status}</p>
          <h3
            className="font-display text-2xl font-medium text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {node.title}
          </h3>
          {node.akaTitle && (
            <p className="mt-1 text-sm text-text-muted">
              Also: {node.akaTitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[12px] border border-border px-2 py-1 text-sm text-text-muted hover:text-text-primary"
          aria-label="Close panel"
        >
          Esc
        </button>
      </div>
      <p className="text-[0.95rem] text-text-body">{node.summary}</p>

      {node.liveLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {node.liveLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !px-3 !py-1.5 text-sm"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      {node.relatedLibrary.length > 0 && (
        <div>
          <p className="label-caps mb-2">Related reading in the Library</p>
          <ul className="flex flex-col gap-2">
            {node.relatedLibrary.map((ch) => (
              <li key={ch.slug}>
                <Link
                  href={`/library/${ch.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-accent-violet/40 bg-[color-mix(in_srgb,var(--accent-violet)_12%,transparent)] px-3 py-1 text-sm text-text-primary hover:border-accent-violet"
                >
                  {ch.title}
                  <span className="text-xs text-text-muted">{ch.readTime}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export function ResearchConstellation({
  nodes,
}: {
  nodes: ConstellationNode[];
}) {
  const [view, setView] = useState<"graph" | "list">("graph");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const titleId = useId();

  const active = useMemo(
    () => nodes.find((n) => n.id === activeId) ?? null,
    [activeId, nodes],
  );

  const focusId = hoveredId ?? activeId;

  const relatedSet = useMemo(() => {
    if (!focusId) return new Set<string>();
    const node = nodes.find((n) => n.id === focusId);
    return new Set(node?.relatedNodeIds ?? []);
  }, [focusId, nodes]);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const selectByIndex = (delta: number) => {
    const idx = nodes.findIndex((n) => n.id === (activeId ?? focusId));
    const next =
      nodes[(idx < 0 ? 0 : (idx + delta + nodes.length) % nodes.length)];
    setActiveId(next.id);
    setHoveredId(next.id);
  };

  return (
    <section aria-labelledby={titleId} className="py-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps mb-2">Signature map</p>
          <h1
            id={titleId}
            className="font-display text-3xl font-medium text-text-primary md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Research Constellation
          </h1>
          <p className="mt-2 max-w-[68ch] text-text-body">
            Each node is a paper or project. Size tracks depth of work. Focus a
            node to light its neighborhood; activate for the dossier.
          </p>
        </div>
        <div
          className="flex rounded-[12px] border border-border p-1"
          role="group"
          aria-label="Constellation view"
        >
          <button
            type="button"
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-sm",
              view === "graph"
                ? "bg-[color-mix(in_srgb,var(--accent-teal)_16%,transparent)] text-text-primary"
                : "text-text-muted",
            )}
            aria-pressed={view === "graph"}
            onClick={() => setView("graph")}
          >
            Graph
          </button>
          <button
            type="button"
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-sm",
              view === "list"
                ? "bg-[color-mix(in_srgb,var(--accent-teal)_16%,transparent)] text-text-primary"
                : "text-text-muted",
            )}
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {nodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className="card-surface block w-full p-4 text-left hover:border-accent-teal/40"
                onClick={() => {
                  setView("graph");
                  setActiveId(n.id);
                }}
              >
                <p className="label-caps mb-1">{n.status}</p>
                <h2
                  className="font-display text-xl text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {n.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-text-body">
                  {n.summary}
                </p>
                {n.liveLinks.length > 0 && (
                  <p className="mt-2 text-xs text-accent-teal">
                    {n.liveLinks.map((l) => l.label).join(" · ")}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="card-surface relative overflow-hidden lg:col-span-7 xl:col-span-8">
            <svg
              viewBox="0 0 100 100"
              className="h-[min(520px,70vh)] w-full"
              role="group"
              aria-label="Interactive research graph"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  selectByIndex(1);
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  selectByIndex(-1);
                }
              }}
            >
              <defs>
                <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {nodes.flatMap((n) =>
                n.relatedNodeIds.map((rid) => {
                  const other = nodes.find((x) => x.id === rid);
                  if (!other) return null;
                  const connected =
                    !!focusId &&
                    ((focusId === n.id && n.relatedNodeIds.includes(other.id)) ||
                      (focusId === other.id &&
                        other.relatedNodeIds.includes(n.id)));
                  return (
                    <motion.line
                      key={`${n.id}-${other.id}`}
                      x1={n.x}
                      y1={n.y}
                      x2={other.x}
                      y2={other.y}
                      stroke={
                        connected ? "var(--accent-teal)" : "var(--border)"
                      }
                      strokeWidth={connected ? 0.45 : 0.2}
                      initial={false}
                      animate={{ opacity: connected ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  );
                }),
              )}

              {nodes.map((n) => {
                const r = nodeRadius(n.depth) / 10;
                const lit =
                  focusId === n.id || relatedSet.has(n.id) || !focusId;
                const selected = activeId === n.id;
                return (
                  <g key={n.id}>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      filter={
                        selected || focusId === n.id
                          ? "url(#node-glow)"
                          : undefined
                      }
                      fill={
                        selected || focusId === n.id
                          ? "color-mix(in srgb, var(--accent-teal) 55%, var(--bg-card))"
                          : relatedSet.has(n.id)
                            ? "color-mix(in srgb, var(--accent-violet) 40%, var(--bg-card))"
                            : "var(--bg-card)"
                      }
                      stroke={
                        selected || focusId === n.id
                          ? "var(--accent-teal)"
                          : "var(--border)"
                      }
                      strokeWidth={0.35}
                      style={{ cursor: "pointer" }}
                      animate={{
                        opacity: lit ? 1 : 0.35,
                        scale: selected ? 1.08 : 1,
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${n.title}. ${n.status}. Activate for details.`}
                      aria-pressed={selected}
                      onMouseEnter={() => setHoveredId(n.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(n.id)}
                      onBlur={() => setHoveredId(null)}
                      onClick={() => setActiveId(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveId(n.id);
                        }
                      }}
                    />
                    <text
                      x={n.x}
                      y={n.y + r + 3.2}
                      textAnchor="middle"
                      className="pointer-events-none"
                      fill="var(--text-muted)"
                      style={{
                        fontSize: "2.1px",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {n.title.length > 22
                        ? `${n.title.slice(0, 20)}…`
                        : n.title}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="px-4 pb-3 text-xs text-text-muted">
              Keyboard: Tab to nodes, Enter to open, arrows to move, Esc to
              close. List view available as an accessibility fallback.
            </p>
          </div>

          <div className="min-h-[280px] lg:col-span-5 xl:col-span-4">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <NodePanel node={active} onClose={close} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card-surface flex h-full flex-col justify-center p-6 text-text-muted"
                >
                  <p className="label-caps mb-2">Dossier</p>
                  <p>
                    Select a node to inspect status, summary, live links, and
                    related library reading.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
