# Cursor prompts for this codebase

Paste one at a time. Each says what to change and what not to touch.

## Ground rules (paste first in any new chat)
> This is a plain HTML/CSS/JS site, no framework. The landscape is a painted image (assets/scene/plate.webp) animated by a WebGL flow-map shader in index.html (#sceneFrag). Never draw water or landscape with CSS, SVG or canvas shapes. All content lives in js/content.js. Map overlays are positioned in map pixels (848x1264) inside #mapInner, which the camera transforms. Keep the camera STOPS format in js/app.js. Do not add frameworks or build tools.

## Add a project
> In js/content.js add a project to `projects` with the same fields as the others (id, title, group, line, chips, problem, built, impact, links). Use these details: [paste]. Then run `npm run kb`.

## Put my photo on the stone card
> I added assets/photo.jpg. Set PHOTO_URL in js/config.js. Make sure the footcard avatar crops it as a rounded square.

## Feature my study book
> In js/content.js fill shelf.book with title "[title]", link "[url]", chapters [list]. If the link is a PDF, open it in a new tab.

## Move a map overlay
> In js/app.js the [scroll / card / banner / crystal] overlay for [item] is at map position (x, y). Move it to (x2, y2) and resize to w x h. Do not change the camera.

## Tune a camera stop
> In js/app.js STOPS, the [stop id] stop frames the map too tight/loose. Desktop format is [focusX, focusY, visibleWidth, anchorX, anchorY]. Change visibleWidth from A to B and check that the panel on the [left/right] does not cover the focus point.

## Make the water stronger or calmer
> In the #sceneFrag shader in index.html, change only these constants: advection distance (fl*30.0), foam strength (0.22), waterfall streak strength (0.32), glint strength (0.9), mist strength (0.22). Give me before/after values and don't touch anything else.

## Add a research note
> In js/content.js add a note to `notes` (id, title, headline under 10 words, project, q, found, why, link). Keep the language plain: what I asked, what happened, why it matters.

## Turn on the live guardian
> The site calls /api/ask (api/ask.js on Vercel). Check that api/kb.js was regenerated with `npm run kb`, that vercel.json is valid, and that the front end falls back to scripted answers when the request fails. Do not expose the API key in the browser.

## Lighthouse pass
> Run Lighthouse on mobile. Fix only issues that do not change the design: image caching, font loading, missing alt text, contrast, tap target sizes.
