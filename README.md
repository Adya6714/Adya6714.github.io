# Adya Srivastava — river portfolio

Scroll-driven portfolio: a camera flies down a painted forest river (WebGL flow-map shader). Eight stops — Waterfall, Research, Projects, Experience, Skills, Shelf, Ask, About.

Plain HTML, CSS, and JavaScript. No framework. No build step.

## Live site

**GitHub Pages:** https://adya6714.github.io/grimoire/

## Run locally

```bash
npm run dev
# or: npx serve .
# or: python3 -m http.server 8000
```

Open the printed URL. Opening `index.html` from disk will not load textures — use a local server.

The Ask guardian uses scripted answers from `js/content.js`.

## Deploy (GitHub Pages)

Push to `main`. The workflow in `.github/workflows/pages.yml` publishes the site automatically.

Manual: repo **Settings → Pages → Build and deployment → GitHub Actions**.

## Where things live

| What | File |
|---|---|
| All text, links, projects, notes, jobs, skills, shelf, guardian answers | `js/content.js` |
| Resume path, photo, guardian endpoint | `js/config.js` |
| Layout, camera stops, map overlays, guardian logic | `js/app.js` |
| Look and feel | `css/style.css` |
| Water shader | `index.html` (`<script id="sceneFrag">`), copy in `docs/scene.frag` |
| Optional AI guardian (not used on Pages) | `api/ask.js` + `api/kb.js` |
| Painting and water maps | `assets/scene/` |
| Case studies / resume archive | `Doc/` |

## Common edits

- **Swap resume:** replace `assets/Resume_Adya_Srivastava.pdf` (keep the name).
- **Add photo:** put `assets/photo.jpg` and set `PHOTO_URL` in `js/config.js`.
- **Study book:** fill `shelf.book` in `js/content.js`.
- **Shelf / projects / notes:** edit `js/content.js`.
- After content edits that should update a future AI guardian: `npm run kb`.

## Before going public

- Confirm EquiContracts listing with your co-founder.
- Replace resume PDF if needed.
- Set Google Drive links to “Anyone with the link can view”.
- Replace sample shelf items with your own.

## Performance and accessibility

- Calm mode freezes the water; it turns on automatically when the visitor prefers reduced motion.
- Without WebGL, the painting shows as a static image.
- Textures: plate ~300 KB, maps under 100 KB.
