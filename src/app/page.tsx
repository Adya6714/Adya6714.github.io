import { Hero } from "@/components/hero/Hero";
import { ResearchConstellation } from "@/components/constellation/ResearchConstellation";
import { getConstellationData } from "@/lib/constellation";
import Link from "next/link";

export default function HomePage() {
  const nodes = getConstellationData();

  return (
    <>
      <Hero />
      <ResearchConstellation nodes={nodes} />
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/library"
          className="card-surface block p-5 hover:border-accent-teal/35"
        >
          <h2
            className="font-display text-xl text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Library
          </h2>
          <p className="mt-2 text-sm text-text-body">
            Chaptered reading with a distraction-free reader.
          </p>
        </Link>
        <Link
          href="/writing"
          className="card-surface block p-5 hover:border-accent-teal/35"
        >
          <h2
            className="font-display text-xl text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Writing
          </h2>
          <p className="mt-2 text-sm text-text-body">
            Field notes, methods, and paper companions.
          </p>
        </Link>
      </section>
    </>
  );
}
