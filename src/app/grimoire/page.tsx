import type { Metadata } from "next";
import { ChapterGrid } from "@/components/grimoire/ChapterGrid";
import { getAllChapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Grimoire",
};

export default function GrimoirePage() {
  const chapters = getAllChapters();

  return (
    <div>
      <p className="label-caps mb-3">Reading library</p>
      <h1
        className="font-display text-4xl font-medium text-text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        The Grimoire
      </h1>
      <p className="mt-3 mb-10 max-w-[68ch] text-text-body">
        Personal chapters on evaluation, probes, and the ideas behind the
        constellation. Progress is saved locally; reader mode softens the
        canopy so the text stays first.
      </p>
      <ChapterGrid chapters={chapters} />
    </div>
  );
}
