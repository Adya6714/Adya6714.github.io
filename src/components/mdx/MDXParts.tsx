"use client";

import { useCallback, useRef, useState } from "react";

export function CodeBlock({ children }: { children?: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    const text = preRef.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }, []);

  return (
    <div className="group relative my-6">
      <button
        type="button"
        onClick={onCopy}
        className="absolute top-2 right-2 z-10 rounded-[8px] border border-border bg-bg-raised px-2 py-1 text-xs text-text-muted sm:opacity-0 sm:group-hover:opacity-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-[12px] border border-border bg-bg-card p-4 pt-8 font-mono text-[0.9em]"
      >
        {children}
      </pre>
    </div>
  );
}

export function Callout({
  children,
  type = "note",
}: {
  children: React.ReactNode;
  type?: "note" | "warn" | "idea";
}) {
  const accent =
    type === "warn"
      ? "var(--accent-warm)"
      : type === "idea"
        ? "var(--accent-violet)"
        : "var(--accent-teal)";
  return (
    <aside
      className="my-6 rounded-[12px] border border-border bg-bg-card px-4 py-3"
      style={{ borderLeft: `3px solid ${accent}` }}
      role="note"
    >
      <p className="label-caps mb-1" style={{ color: accent }}>
        {type}
      </p>
      <div className="text-[0.95rem] text-text-body">{children}</div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-[12px] border border-border"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
