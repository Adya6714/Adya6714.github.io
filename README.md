# Lumenwald

Research portfolio for Adya Srivastava — LLM evaluation, interpretability, and applied ML systems. Atmosphere: bioluminescent night forest (decorative only; never gates content).

## Content (source of truth)

- `content/experience.json` — About timeline
- `content/research-nodes.json` — Constellation nodes + links
- `content/library/*.mdx` — Library chapters (`title`, `order`, `tags`, `readTime`, `summary`)
- `content/writing/*.mdx` — Blog posts

Library `tags` that match a research node `id` (or title keywords) surface as “Related reading in the Library” chips in the constellation panel.

## Develop

```bash
npm install
npm run dev
npm run build   # static `out/`
```

## Ambience

Dim ambience toggle (sidebar, localStorage). Respects `prefers-reduced-motion`. Reader mode dims layers and hides the waterfall. Decorative extras: richer waterfall, whisper motes, flying canopy sprite.
