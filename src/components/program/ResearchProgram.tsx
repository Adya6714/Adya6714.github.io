"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const sections = [
  { id: "agenda", title: "The agenda" },
  { id: "evaluation", title: "Evaluation as science" },
  { id: "interpretability", title: "From behavior to mechanism" },
  { id: "adjacent", title: "Adjacent tracks" },
  { id: "through-line", title: "The through-line" },
];

export function ResearchProgram() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <article className="prose-lumen lg:col-span-8">
        <p className="label-caps mb-3">Long-form</p>
        <h1 style={{ fontFamily: "var(--font-display)" }}>Research Program</h1>
        <p className="text-lg text-text-body">
          A multi-paper agenda on what evaluation measures, what it misses, and
          how interpretability closes the gap between fluent outputs and reliable
          reasoning.
        </p>

        <section id="agenda" className="scroll-mt-24">
          <h2 style={{ fontFamily: "var(--font-display)" }}>The agenda</h2>
          <p>
            Modern LLM evaluation often ends at aggregate accuracy. That scalar is
            a useful coordination device and a poor description of cognition. The
            research program asks a sharper question: when two systems share a
            score, do they share a strategy?
          </p>
          <p>
            <em>Same Score, Different Strategy</em> makes the empirical case.
            The reasoning-probe track operationalizes the measurement. The
            mechanistic interpretability track locates where strategies diverge
            inside the network.
          </p>
        </section>

        <section id="evaluation" className="scroll-mt-24">
          <h2 style={{ fontFamily: "var(--font-display)" }}>
            Evaluation as science
          </h2>
          <p>
            Evaluation methodology here is treated as an experimental science:
            contrastive item design, explicit intermediate claims, and scoring
            that refuses to collapse path and outcome. The three-probe framework
            — faithfulness, consistency, compositional generalization — is built
            to stay cheap enough for continuous use while remaining discriminative
            across five model families.
          </p>
        </section>

        <section id="interpretability" className="scroll-mt-24">
          <h2 style={{ fontFamily: "var(--font-display)" }}>
            From behavior to mechanism
          </h2>
          <p>
            Behavioral disagreement is the tip. Circuit-level work asks where
            constraints are abandoned, which features carry intermediate
            invariants, and whether fluent final answers reattach to broken
            reasoning traces. The goal is not spectacle circuits — it is
            diagnostic leverage for evaluation design.
          </p>
        </section>

        <section id="adjacent" className="scroll-mt-24">
          <h2 style={{ fontFamily: "var(--font-display)" }}>Adjacent tracks</h2>
          <p>
            Parallel projects keep the methodology honest under different
            constraints: diffusion-generated volatility surfaces with PPO hedging
            on NIFTY 50, a survey of hybrid quantum-classical paradigms, graph ML
            fused with XGBoost for fraud, and applied systems (agentic CloudWatch
            tooling, document VLM OCR evaluation, OmniMesh).
          </p>
          <p>
            These are not digressions. Each forces the same discipline —
            measure the thing you claim, expose failure modes, and refuse
            leaderboard cosplay.
          </p>
        </section>

        <section id="through-line" className="scroll-mt-24">
          <h2 style={{ fontFamily: "var(--font-display)" }}>The through-line</h2>
          <p>
            Fluency is not understanding. Accuracy is not strategy. Across papers,
            the through-line is a commitment to evaluation that can tell those
            apart — and to interpretability that explains why.
          </p>
        </section>
      </article>

      <aside className="hidden lg:col-span-4 lg:block">
        <nav
          aria-label="On this page"
          className="sticky top-10 rounded-[12px] border border-border bg-bg-card/80 p-4 backdrop-blur-sm"
        >
          <p className="label-caps mb-3">Contents</p>
          <ol className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cn(
                    "block rounded-[10px] px-2 py-1.5 text-sm transition-colors",
                    active === s.id
                      ? "bg-[color-mix(in_srgb,var(--accent-teal)_12%,transparent)] text-text-primary"
                      : "text-text-muted hover:text-text-body",
                  )}
                  aria-current={active === s.id ? "location" : undefined}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </div>
  );
}
