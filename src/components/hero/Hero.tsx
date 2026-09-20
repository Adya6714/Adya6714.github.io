import Link from "next/link";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative grid min-h-[70vh] items-center py-8"
    >
      <div className="relative max-w-3xl">
        <div
          aria-hidden
          className="breathing-glow pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-teal)_28%,transparent),transparent_70%)]"
        />
        <p className="label-caps mb-4">AI / ML research</p>
        <h1
          id="hero-heading"
          className="relative font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.15] font-medium tracking-wide text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lumenwald
        </h1>
        <p className="mt-5 max-w-[68ch] text-[1.05rem] text-text-body">
          I study how we evaluate language models — especially when benchmark
          accuracy hides divergent reasoning strategies. Current work spans LLM
          evaluation methodology, mechanistic interpretability, and the gap
          between scoring well and actually reasoning.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/research" className="btn btn-primary">
            Read the research
          </Link>
          <Link href="/grimoire" className="btn btn-ghost">
            Open the grimoire
          </Link>
        </div>
      </div>
    </section>
  );
}
