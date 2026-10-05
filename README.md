# Adya Srivastava — river portfolio

Scroll-driven portfolio: a camera flies down a painted forest river (WebGL flow-map shader). Eight stops — Waterfall, Research, Projects, Experience, Skills, Shelf, Ask, About.

Plain HTML, CSS, and JavaScript. No framework. No build step.

| | |
|---|---|
| **Live site** | https://adya6714.github.io/adya-portfolio/ |
| **Repo** | https://github.com/Adya6714/adya-portfolio |
| **Build guide** | [`SITE_SPEC.md`](./SITE_SPEC.md) |

Cursor: start each job with `Read @SITE_SPEC.md. Build only section X. Follow the acceptance checks.`

## Repo layout

```
.
├── index.html          # page shell + water shader
├── css/style.css       # look and feel
├── js/
│   ├── app.js          # camera, map overlays, panels, guardian UI
│   ├── content.js      # all text and links (edit here)
│   └── config.js       # resume / photo / guardian endpoint
├── assets/
│   ├── scene/          # plate.webp, flow.png, foam.png
│   ├── source/         # painting source + masks (not for the browser)
│   └── Resume_Adya_Srivastava.pdf
├── api/                # optional serverless guardian (not used on Pages)
├── tools/              # make_kb, make_maps, clean_plate
├── docs/               # shader copy, Cursor prompts
├── Doc/                # personal archive (not published to Pages)
│   ├── Resume_Adya_Srivastava.pdf
│   └── case-studies/
├── SITE_SPEC.md        # full website spec
└── .github/workflows/  # GitHub Pages deploy
```

## Run locally

```bash
npm run dev
```

Open the printed URL. Do not open `index.html` from disk — textures will not load.

## Deploy

Push to `main`. GitHub Actions publishes to Pages automatically.

## Common edits

- Content / links → `js/content.js`
- Resume → replace `assets/Resume_Adya_Srivastava.pdf`
- Spec / job list → `SITE_SPEC.md`
- After content edits for a future AI guardian → `npm run kb`
