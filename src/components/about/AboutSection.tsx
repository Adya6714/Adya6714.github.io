"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";

const timeline = [
  {
    year: "2026",
    title: "CAISc — Same Score, Different Strategy",
    detail: "Published work on strategy divergence under matched accuracy.",
  },
  {
    year: "2025–26",
    title: "Reasoning probes & mechanistic interpretability",
    detail: "Three-probe framework and circuit-level follow-ups across five models.",
  },
  {
    year: "2025",
    title: "Diffusion × PPO hedging · Quantum survey",
    detail: "NIFTY 50 volatility surfaces; hybrid quantum-classical taxonomy.",
  },
  {
    year: "2024",
    title: "Graph ML fraud · Applied systems",
    detail: "GNN + XGBoost fraud stack; CloudWatch agents, VLM OCR eval, OmniMesh.",
  },
];

export function AboutSection() {
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLLIElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.25 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="label-caps mb-3">About</p>
        <h1
          className="font-display text-4xl font-medium text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {siteConfig.author}
        </h1>
        <div className="prose-lumen mt-5 space-y-4">
          <p>
            I am an AI/ML researcher focused on evaluation methodology and
            mechanistic interpretability. My work asks whether leaderboard
            agreement implies shared reasoning — and when it does not, how to
            measure and explain the difference.
          </p>
          <p>
            Lumenwald is the public notebook for that program: papers and
            projects in the constellation, long-form agenda in the research
            program, chapters in the grimoire, and shorter field notes in
            writing.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/cv.pdf" className="btn btn-primary" download>
            Download CV
          </a>
          <a href={`mailto:${siteConfig.email}`} className="btn btn-ghost">
            Email
          </a>
          <a
            href={siteConfig.github}
            className="btn btn-ghost"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            className="btn btn-ghost"
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="lg:col-span-5">
        <h2
          className="mb-4 font-display text-2xl text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Timeline
        </h2>
        <ol className="relative space-y-6 border-l border-border pl-5">
          {timeline.map((item, i) => (
            <li
              key={item.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative translate-y-4 opacity-0 transition duration-500"
            >
              <span
                aria-hidden
                className="absolute top-1.5 -left-[27px] h-2.5 w-2.5 rounded-full bg-accent-teal"
              />
              <p className="font-mono text-xs text-accent-violet">{item.year}</p>
              <h3 className="mt-1 text-text-primary">{item.title}</h3>
              <p className="mt-1 text-sm text-text-body">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
