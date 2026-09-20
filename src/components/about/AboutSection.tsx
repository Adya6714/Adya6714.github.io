"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import type { ExperienceItem } from "@/lib/content";

function formatRange(start: string, end: string) {
  const fmt = (s: string) => {
    const [y, m] = s.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[Number(m) - 1]} ${y}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function AboutSection({
  experience,
}: {
  experience: ExperienceItem[];
}) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLLIElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 },
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="label-caps mb-3">About</p>
        <h1
          className="font-display text-4xl font-medium text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {siteConfig.author}
        </h1>
        <div className="prose-lumen mt-5 space-y-4">
          <p>
            AI/ML researcher focused on evaluation methodology and the gap
            between benchmark accuracy and genuine reasoning. Current work spans
            multi-probe LLM diagnostics, diffusion-based volatility surfaces for
            RL hedging, and applied systems from document VLMs to offline mesh
            networks.
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

      <div className="lg:col-span-7">
        <h2
          className="mb-6 font-display text-2xl text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Experience
        </h2>
        <ol className="relative space-y-8 border-l border-border pl-6">
          {experience.map((item, i) => (
            <li
              key={`${item.org}-${item.start}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative"
              style={{
                opacity: 0,
                transform: "translateY(12px)",
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              <span
                aria-hidden
                className="absolute top-1.5 -left-[31px] h-2.5 w-2.5 rounded-full bg-accent-teal"
              />
              <p className="font-mono text-xs text-accent-violet">
                {formatRange(item.start, item.end)}
              </p>
              <h3 className="mt-1 text-lg text-text-primary">
                {item.role}
                <span className="text-text-muted"> · {item.org}</span>
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text-body">
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
