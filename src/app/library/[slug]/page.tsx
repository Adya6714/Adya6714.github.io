import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterReader } from "@/components/library/ChapterReader";
import { Mdx } from "@/components/mdx/Mdx";
import { getAdjacent, getAllChapters, getChapter } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getChapter(slug);
    return { title: meta.title };
  } catch {
    return { title: "Chapter" };
  }
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params;
  let doc;
  try {
    doc = getChapter(slug);
  } catch {
    notFound();
  }
  const chapters = getAllChapters();
  const { prev, next } = getAdjacent(chapters, slug);

  return (
    <ChapterReader chapter={doc.meta} prev={prev} next={next}>
      <Mdx source={doc.content} />
    </ChapterReader>
  );
}
