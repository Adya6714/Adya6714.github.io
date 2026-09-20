# Lumenwald

Dark, modern research portfolio and writing site for **Adya Srivastava** — LLM evaluation, mechanistic interpretability, and the gap between benchmark accuracy and genuine reasoning.

Atmosphere: bioluminescent night forest (Cloud Forest–inspired indoor waterfall mood). Ambience is decorative only and never gates content readability.

## Stack

- Next.js App Router (static export) + TypeScript + Tailwind CSS v4
- Framer Motion · MDX via `next-mdx-remote` + gray-matter
- KaTeX · rehype-pretty-code · JetBrains Mono / Geist / Cormorant Garamond

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # writes static `out/`
```

## Content

- Posts: `content/posts/*.mdx`
- Grimoire chapters: `content/chapters/*.mdx`
- Design tokens: `src/styles/tokens.css` + `src/styles/tokens.ts`

## Ambience

Toggle **Dim ambience** in the sidebar (persisted). Respects `prefers-reduced-motion`. Reader mode auto-dims layers and hides the waterfall.
