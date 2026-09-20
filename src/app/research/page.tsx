import type { Metadata } from "next";
import { ResearchConstellation } from "@/components/constellation/ResearchConstellation";
import { researchNodes, statusLabel } from "@/lib/research-nodes";

export const metadata: Metadata = {
  title: "Research Constellation",
};

export default function ResearchPage() {
  return (
    <>
      <ResearchConstellation />
      <section className="mt-12" aria-label="Research node anchors">
        <h2
          className="mb-6 font-display text-2xl text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Node dossiers
        </h2>
        <div className="flex flex-col gap-8">
          {researchNodes.map((n) => (
            <article
              key={n.id}
              id={n.id}
              className="card-surface scroll-mt-24 p-6"
            >
              <p className="label-caps mb-1">{statusLabel[n.status]}</p>
              <h3
                className="font-display text-2xl text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {n.title}
              </h3>
              {(n.venue || n.year) && (
                <p className="mt-1 text-sm text-text-muted">
                  {[n.venue, n.year].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-3 max-w-[68ch] text-text-body">{n.abstract}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {n.methods.map((m) => (
                  <li
                    key={m}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-accent-violet"
                  >
                    {m}
                  </li>
                ))}
              </ul>
              {n.artifacts && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {n.artifacts.map((a) => (
                    <li key={a.href}>
                      <a
                        href={a.href}
                        className="text-sm text-accent-teal hover:underline"
                      >
                        {a.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
