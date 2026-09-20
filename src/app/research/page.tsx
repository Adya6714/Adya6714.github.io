import type { Metadata } from "next";
import { ResearchConstellation } from "@/components/constellation/ResearchConstellation";
import { getConstellationData } from "@/lib/constellation";

export const metadata: Metadata = {
  title: "Research",
};

export default function ResearchPage() {
  const nodes = getConstellationData();

  return (
    <>
      <ResearchConstellation nodes={nodes} />
      <section className="mt-12" aria-label="Research node anchors">
        <h2
          className="mb-6 font-display text-2xl text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Node dossiers
        </h2>
        <div className="flex flex-col gap-8">
          {nodes.map((n) => (
            <article
              key={n.id}
              id={n.id}
              className="card-surface scroll-mt-24 p-6"
            >
              <p className="label-caps mb-1">{n.status}</p>
              <h3
                className="font-display text-2xl text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {n.title}
              </h3>
              {n.akaTitle && (
                <p className="mt-1 text-sm text-text-muted">Also: {n.akaTitle}</p>
              )}
              <p className="mt-3 max-w-[68ch] text-text-body">{n.summary}</p>
              {n.liveLinks.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {n.liveLinks.map((a) => (
                    <li key={a.href}>
                      <a
                        href={a.href}
                        className="text-sm text-accent-teal hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {a.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {n.relatedLibrary.length > 0 && (
                <p className="mt-4 text-sm text-text-muted">
                  Related library:{" "}
                  {n.relatedLibrary.map((c) => c.title).join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
