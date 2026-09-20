import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="py-20">
      <p className="label-caps mb-3">404</p>
      <h1
        className="font-display text-4xl text-text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Path lost in the mist
      </h1>
      <p className="mt-3 max-w-[68ch] text-text-body">
        That page is not in the canopy. Return home or open the constellation.
      </p>
      <div className="mt-8 flex gap-3">
        <a href="/" className="btn btn-primary">
          Home
        </a>
        <a href="/research" className="btn btn-ghost">
          Constellation
        </a>
      </div>
    </div>
  );
}
