import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "./components";

export async function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            rehypeKatex,
            [
              rehypePrettyCode,
              {
                theme: "github-dark-dimmed",
                keepBackground: false,
              },
            ],
          ],
        },
      }}
    />
  );
}
