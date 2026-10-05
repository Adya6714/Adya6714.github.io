# Adya Srivastava: river portfolio

A scroll-driven portfolio. A camera flies down a painted forest river while the water moves (WebGL flow-map shader). Eight stops: Waterfall, Research, Projects, Experience, Skills, Shelf, Ask, About.

No framework and no build step: plain HTML, CSS and JavaScript.

**Live site (GitHub Pages):** https://adya6714.github.io/grimoire/

**Build guide:** see [`SITE_SPEC.md`](./SITE_SPEC.md). Start Cursor chats with: `Read @SITE_SPEC.md. Build only section X. Follow the acceptance checks.`

## Run it locally

```bash
npm run dev
# or: npx serve .
# or: python3 -m http.server 8000
```

Open the printed URL. Opening `index.html` directly from disk will not load the textures, so use a local server.

Locally (and on GitHub Pages), the guardian uses scripted answers from `js/content.js`. An optional live AI guardian can run via `api/ask.js` on a serverless host.

## Deploy (GitHub Pages)

Push to `main`. The workflow in `.github/workflows/pages.yml` publishes automatically to https://adya6714.github.io/grimoire/.

## Where things live

| What | File |
|---|---|
| Website spec and Cursor job list | `SITE_SPEC.md` |
| All text, links, projects, notes, jobs, skills, shelf, guardian answers | `js/content.js` |
| Resume path, photo, guardian endpoint | `js/config.js` |
| Layout, camera stops, map overlays, guardian logic | `js/app.js` |
| Look and feel | `css/style.css` |
| Water shader | inside `index.html` (`<script id="sceneFrag">`), copy in `docs/scene.frag` |
| Optional live guardian | `api/ask.js` + `api/kb.js` |
| Painting and water maps | `assets/scene/` |
| Case studies / resume archive | `Doc/` |

## Common edits

- **Swap your resume:** replace `assets/Resume_Adya_Srivastava.pdf` (keep the name).
- **Add your photo:** put `assets/photo.jpg` (square) and set `PHOTO_URL: "assets/photo.jpg"` in `js/config.js`.
- **Study book:** fill `shelf.book` in `js/content.js` (title, link, chapters).
- **Shelf items:** replace the sample entries in `shelf.rows` and fill each `why` with one line.
- **Add a project or note:** copy an entry in `js/content.js`. It appears in the panel automatically.
- **After any content edit for a future AI guardian:** run `npm run kb`.

## Before going public

- Confirm EquiContracts can be listed (Experience) with your co-founder.
- Replace the resume PDF with the latest version (paper title "Same Score, Different Strategy").
- Make sure the Google Drive links are set to "Anyone with the link can view".
- Replace the sample shelf items with your own.

## Changing the painting

The landscape is your reference image with the UI removed (`tools/clean_plate.py`), upscaled 4x with Real-ESRGAN. For a cleaner plate:
1. Open `assets/source/reference_with_ui.png` in Photoshop or Photopea, load `assets/source/ui_mask.png` as a selection, Generative Fill: "same painted landscape, river water, moss and rocks, no objects".
2. Upscale 4x (Upscayl, free).
3. `pip install opencv-python pillow numpy` then `python tools/make_maps.py clean_848.png upscaled_4x.png`.

If the river layout changes, update `CORRIDOR` and `FLOW` in `tools/make_maps.py`, and the overlay positions and `STOPS` in `js/app.js`.

## Performance and accessibility

- Calm mode (top bar) freezes the water; it starts on automatically when the visitor prefers reduced motion.
- If WebGL is unavailable, the painting shows as a static image and everything still works.
- Textures: plate about 300 KB, maps under 100 KB.
