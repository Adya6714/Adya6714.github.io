import { Hero } from "@/components/hero/Hero";
import { ResearchConstellation } from "@/components/constellation/ResearchConstellation";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ResearchConstellation />
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/program",
            title: "Research Program",
            body: "The multi-paper agenda and through-line.",
          },
          {
            href: "/grimoire",
            title: "The Grimoire",
            body: "Chaptered reading library with a distraction-free reader.",
          },
          {
            href: "/writing",
            title: "Writing",
            body: "Field notes, methods, and paper companions.",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card-surface block p-5 hover:border-accent-teal/35"
          >
            <h2
              className="font-display text-xl text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.title}
            </h2>
            <p className="mt-2 text-sm text-text-body">{c.body}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
