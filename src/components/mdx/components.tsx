import { Callout, CodeBlock, Figure } from "./MDXParts";

export const mdxComponents = {
  Callout,
  Figure,
  pre: ({ children }: { children?: React.ReactNode }) => (
    <CodeBlock>{children}</CodeBlock>
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-accent-teal underline-offset-3 hover:underline" />
  ),
};
