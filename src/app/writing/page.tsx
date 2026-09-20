import type { Metadata } from "next";
import { PostList } from "@/components/writing/PostList";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div>
      <p className="label-caps mb-3">Blog</p>
      <h1
        className="mb-3 font-display text-4xl font-medium text-text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Writing
      </h1>
      <p className="mb-10 max-w-[68ch] text-text-body">
        Chronological notes with tags, reading time, and MDX features — code,
        math, callouts, and footnotes.
      </p>
      <PostList posts={posts} />
    </div>
  );
}
