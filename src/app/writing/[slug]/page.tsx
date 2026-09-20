import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/Mdx";
import { getAdjacent, getAllPosts, getPost } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getPost(slug);
    return { title: meta.title, description: meta.summary };
  } catch {
    return { title: "Post" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let doc;
  try {
    doc = getPost(slug);
  } catch {
    notFound();
  }
  const posts = getAllPosts();
  const { prev, next } = getAdjacent(posts, slug);

  return (
    <article>
      <header className="mb-10 max-w-[68ch]">
        <p className="label-caps mb-2">
          <time dateTime={doc.meta.date}>{doc.meta.date}</time>
          {" · "}
          {doc.meta.readTime}
        </p>
        <h1
          className="font-display text-4xl font-medium text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {doc.meta.title}
        </h1>
        <p className="mt-3 text-text-body">{doc.meta.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {doc.meta.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-accent-violet"
            >
              {t}
            </li>
          ))}
        </ul>
      </header>

      <div className="prose-lumen">
        <Mdx source={doc.content} />
      </div>

      <nav
        aria-label="Post pagination"
        className="mt-14 flex items-center justify-between gap-4 border-t border-border pt-6"
      >
        {prev ? (
          <Link href={`/writing/${prev.slug}`} className="btn btn-ghost">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/writing/${next.slug}`} className="btn btn-primary">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
