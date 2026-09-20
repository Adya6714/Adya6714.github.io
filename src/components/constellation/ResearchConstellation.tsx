"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  researchNodes,
  statusLabel,
  type ResearchNode,
} from "@/lib/research-nodes";
import { cn } from "@/lib/cn";

function nodeRadius(depth: number) {
  return 10 + depth * 5;
}

function NodePanel({
  node,
  onClose,
}: {
  node: ResearchNode;
  onClose: () => void;
}) {
  return (
    <aside
      className="card-surface flex h-full flex-col gap-4 p-5"
      aria-label={`${node.title} details`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caps mb-1">{statusLabel[node.status]}</p>
          <h3
            className="font-display text-2xl font-medium text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {node.title}
          </h3>
          {(node.venue || node.year) && (
            <p className="mt-1 text-sm text-text-muted">
              {[node.venue, node.year].filter(Boolean).join(" · ")}
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
      <p className="text-[0.95rem] text-text-body">{node.abstract}</p>
      <div>
        <p className="label-caps mb-2">Methods</p>
        <ul className="flex flex-wrap gap-2">
          {node.methods.map((m) => (
            <li
              key={m}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-accent-violet"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
      {node.artifacts && node.artifacts.length > 0 && (
        <div>
          <p className="label-caps mb-2">Artifacts</p>
          <ul className="flex flex-col gap-1">
            {node.artifacts.map((a) => (
              <li key={a.href}>
                <a
                  href={a.href}
                  className="text-sm text-accent-teal underline-offset-2 hover:underline"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        href={node.href}
        className="btn btn-primary mt-auto self-start"
      >
        Open node
      </Link>
    </aside>
  );
}

export function ResearchConstellation() {
  const [view, setView] = useState<"graph" | "list">("graph");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const titleId = useId();

  const active = useMemo(
    () => researchNodes.find((n) => n.id === activeId) ?? null,
    [activeId],
  );

  const focusId = hoveredId ?? activeId;

  const relatedSet = useMemo(() => {
    if (!focusId) return new Set<string>();
    const node = researchNodes.find((n) => n.id === focusId);
    return new Set(node?.related ?? []);
  }, [focusId]);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const selectByIndex = (delta: number) => {
    const idx = researchNodes.findIndex((n) => n.id === (activeId ?? focusId));
    const next =
      researchNodes[
        (idx < 0 ? 0 : (idx + delta + researchNodes.length) % researchNodes.length)
      ];
    setActiveId(next.id);
    setHoveredId(next.id);
  };

  return (
    <section aria-labelledby={titleId} className="py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps mb-2">Signature map</p>
          <h2
            id={titleId}
            className="font-display text-3xl font-medium text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Research Constellation
          </h2>
          <p className="mt-2 max-w-[68ch] text-text-body">
            Each node is a paper or project. Size tracks depth of work. Hover or
            focus a node to light its neighborhood; activate to open the dossier.
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
          {researchNodes.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className="card-surface block p-4 hover:border-accent-teal/40"
              >
                <p className="label-caps mb-1">{statusLabel[n.status]}</p>
                <h3
                  className="font-display text-xl text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {n.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-text-body">
                  {n.abstract}
                </p>
              </Link>
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

              {researchNodes.flatMap((n) =>
                n.related
                  .filter((rid) => rid > n.id)
                  .map((rid) => {
                    const other = researchNodes.find((x) => x.id === rid);
                    if (!other) return null;
                    const lit =
                      focusId === n.id ||
                      focusId === other.id ||
                      (focusId &&
                        (relatedSet.has(n.id) || relatedSet.has(other.id)) &&
                        (n.id === focusId ||
                          other.id === focusId ||
                          n.related.includes(focusId) ||
                          other.related.includes(focusId)));
                    const connected =
                      !!focusId &&
                      ((focusId === n.id && n.related.includes(other.id)) ||
                        (focusId === other.id && other.related.includes(n.id)));
                    return (
                      <motion.line
                        key={`${n.id}-${other.id}`}
                        x1={n.x}
                        y1={n.y}
                        x2={other.x}
                        y2={other.y}
                        stroke={
                          connected
                            ? "var(--accent-teal)"
                            : "var(--border)"
                        }
                        strokeWidth={connected ? 0.45 : 0.2}
                        initial={false}
                        animate={{
                          opacity: connected ? 1 : lit ? 0.55 : 0.25,
                          pathLength: connected ? 1 : 0.85,
                        }}
                        transition={{ duration: 0.35 }}
                      />
                    );
                  }),
              )}

              {researchNodes.map((n) => {
                const r = nodeRadius(n.depth) / 10;
                const lit =
                  focusId === n.id || relatedSet.has(n.id) || !focusId;
                const selected = activeId === n.id;
                return (
                  <g key={n.id}>
                    <a href={n.href} tabIndex={-1} aria-hidden>
                      <title>{n.title}</title>
                    </a>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      filter={selected || focusId === n.id ? "url(#node-glow)" : undefined}
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
                      style={{ cursor: "pointer", outline: "none" }}
                      animate={{ opacity: lit ? 1 : 0.35, scale: selected ? 1.08 : 1 }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${n.title}. ${statusLabel[n.status]}. Activate for details.`}
                      aria-pressed={selected}
                      onMouseEnter={() => setHoveredId(n.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(n.id)}
                      onBlur={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveId(n.id);
                      }}
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
                      style={{ fontSize: "2.2px", fontFamily: "var(--font-sans)" }}
                    >
                      {n.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="px-4 pb-3 text-xs text-text-muted">
              Keyboard: Tab to nodes, Enter to open, arrows to move, Esc to close.
              Each node also has a real URL in the list view and dossier.
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
                    Select a node to inspect abstract, methods, status, and
                    artifacts.
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
