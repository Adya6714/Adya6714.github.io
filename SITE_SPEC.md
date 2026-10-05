# Adya's River Portfolio: Website Spec

Put this file in the repo root as `SITE_SPEC.md`. In Cursor, start each chat with: "Read @SITE_SPEC.md. Build only section X. Follow the acceptance checks."

---

## 1. The idea in one paragraph

The whole site is one painted forest river (the image in `assets/scene/plate.webp`, 848 x 1264 "map pixels"). The page never scrolls the painting like a normal webpage. Instead, a fixed camera flies down the painting as the visitor scrolls: waterfall at the top, then the river, rapids, stone arches, crystals, a rock shelf, a stone guardian, and a calm pool at the bottom. The camera stops at 8 places. At each stop, one glass panel slides in with that section's content, and clickable elements sit on the painting itself (scrolls in the water, cards in the rapids, banners on the arches, labels on the crystals). The water is animated by a WebGL shader so it actually flows.

---

## 2. How it is built (layers, back to front)

| Layer | Element | What it does | Moves with |
|---|---|---|---|
| 0 | `<canvas id="scene">` | WebGL: draws the painting and animates the water | Camera |
| 1 | `#map > #mapInner` | 848 x 1264 div holding all on-map HTML elements, positioned in map pixels | Camera (CSS transform) |
| 2 | `<canvas id="fx">` | Fireflies, waterfall spray | Screen / camera |
| 3 | `.panel` x 8 | Glass content panel for the current stop | Fixed on screen |
| 4 | `.nav`, `.dots` | Top bar and stop dots | Fixed on screen |
| 5 | `.modal` | Detail popups (project, note, job) | Fixed on screen |

**Camera rule:** for a camera rectangle `(x0, y0, visibleWidth, visibleHeight)` in map pixels and zoom `k = screenWidth / visibleWidth`:
- `#mapInner` gets `transform: scale(k) translate(-x0px, -y0px)` with `transform-origin: 0 0`.
- The shader gets `uCam = (x0/848, y0/1264, visibleWidth/848, visibleHeight/1264)`.
- Both must use the same numbers every frame, or the on-map elements drift off the painting.

**Content rule:** every piece of text and every link comes from `js/content.js`. No text is hard-coded in `app.js` or `index.html`.

---

## 3. Scroll behaviour (the part that currently feels messy)

### What is wrong now
- The camera lerps toward the scroll position, so it lags and drifts after you stop scrolling.
- Stops have no clear "rest" moment, so panels flicker on and off between stops.
- Panels scroll internally, so the mouse wheel sometimes scrolls the panel and sometimes the page.
- There is no snapping, so the visitor can stop halfway between two stops with no panel showing.

### How it should work
1. **Use Lenis** (smooth scroll, loaded from cdnjs or npm) and drive everything from Lenis's `scroll` value. Remove the custom `fs += (target - fs) * k` smoothing.
2. **Page height:** `#track` contains 8 blocks of `100vh`. Scroll progress `f = scroll / (docHeight - viewportHeight) * 7`, so `f` runs from 0 to 7.
3. **Hold and travel:** each stop owns the range `[i - 0.5, i + 0.5]`. Inside it, the middle 50% (`|f - i| < 0.25`) is a **hold**: the camera does not move and the panel is fully visible. The outer parts are **travel**: the camera eases to the next stop and the panel fades.
4. **Snap:** when scrolling stops for 150 ms, smoothly scroll to the nearest stop's centre (`i / 7 * maxScroll`). Use Lenis `scrollTo` with `duration: 0.8`. Disable snapping while a modal is open or while the visitor is typing in the guardian chat.
5. **Panel visibility:** `opacity = 1 - smoothstep(0.25, 0.45, |f - i|)`. Add `translateY` of up to 24px in the scroll direction during the fade. `pointer-events: none` when opacity < 0.5.
6. **No inner scrolling on desktop:** each panel must fit inside `100vh - 120px`. If a list is long (projects, notes, shelf), show the first few and put the rest behind a "Show all" button that opens a modal. On mobile the bottom sheet may scroll internally, with `overscroll-behavior: contain`.
7. **Keyboard:** Arrow Down / Page Down / Space go to the next stop, Arrow Up / Page Up to the previous, Home and End to the first and last.
8. **Reduced motion:** no smooth scroll and no camera easing; jump straight between stops.

### Acceptance checks
- One wheel flick moves exactly one stop and settles there.
- After scrolling stops, the camera is still within 0.5 seconds.
- A panel is always fully visible whenever the page is at rest.
- On-map elements never slide relative to the painting.

---

## 4. Global elements

### Top bar (`.nav`)
- **Left:** "Adya Srivastava", which goes to stop 0.
- **Middle:** links Research, Projects, Experience, Skills, Shelf, Ask, About, which go to stops 1 to 7. The current stop's link is highlighted. Hidden under 960px wide.
- **Right:** "Calm mode" toggle (freezes the water and hides particles) and a **Resume** button (primary colour, download icon).
- **Resume:** links to `SITE_CONFIG.RESUME_URL` (`assets/Resume_Adya_Srivastava.pdf`) with the `download` attribute. Every "Resume" button on the site uses this same URL.

### Stop dots (`.dots`)
- Vertical row of 8 dots on the right edge, with a thin line through them.
- Current dot glows. Hovering shows the stop name. Clicking goes to that stop.
- Hidden under 960px.

### Modal
- Opens for a project, a research note or a job.
- Closes with the X button, Escape, or a click on the dark background. Focus returns to whatever opened it.
- Contains: title, chips, sections, optional interactive demo, and a row of link buttons (first one primary).

### Mobile (under 760px)
- Panels become a bottom sheet: full width, max 52% of the screen height, rounded top corners.
- Camera stops use the mobile framing (`m` values in `STOPS`), which keeps the focus point in the top half of the screen.
- On-map text never renders smaller than 12px on screen.

---

## 5. The 8 sections

Each section lists: what the camera shows, the panel content, the on-map elements, the links, and the acceptance checks.

`STOPS` format: `[focusX, focusY, visibleWidth, anchorX, anchorY]` in map pixels. `anchorX/Y` is where on the screen (0 to 1) the focus point should sit.

---

### Stop 0: Waterfall (hero)

**Purpose:** in 5 seconds, a visitor knows who Adya is, what she works on, and has three proofs.

**Camera:** desktop `[410, 175, 600, 0.68, 0.42]`: the waterfall sits on the right, dark forest on the left for text. Mobile `[420, 190, 420, 0.5, 0.22]`.

**Panel (bottom-left, no heavy background so the waterfall stays visible):**
- `h1`: name
- One line: `person.line`
- Three proof chips: "Paper at CAISc 2026", "Ex-ML Engineer, Nurix AI", "National winner, Citi Innovation Challenge"
- Buttons: **Resume** (primary), **Research** (goes to stop 1), **GitHub** (`person.github`, new tab)
- Status line with a pulsing dot: "Open to ML research and research engineering roles"
- Small hint: "Scroll to travel downstream", with an animated drip line

**On the map:** nothing. The waterfall is the hero.

**Checks:** panel text readable over the painting (add a soft dark gradient behind it if needed); all three buttons work.

---

### Stop 1: Research ("Where the ideas come from")

**Purpose:** show a real research program, not a list of blog posts.

**Camera:** desktop `[410, 388, 430, 0.66, 0.5]`, the upper pool with three floating scrolls. Panel on the left.

**Panel:**
1. Heading "Where the ideas come from" and one line: "Papers, and the results that started them."
2. **Papers** (from `papers`): each row has a status badge (published, preprint, draft, survey, planned, each a different colour), the title, a one-line note, and its links.
3. **Research notes** (from `notes`): show the first 4 as small cards (headline + project name). "Show all 8 notes" opens a modal list. Clicking a note opens the note modal.

**Note modal:** title, chips (project, headline), then "The question", "What happened", "Why it matters", and a link button.

**On the map:** three parchment scrolls floating in the water (rolled top and bottom edges, gentle bob animation of 2px). Each shows a note title and project name and opens that note.
- Scroll 1 at `(334, 290)`, size 98 x 96, rotate -3deg: note `n-rename`
- Scroll 2 at `(420, 310)`, size 112 x 120, rotate 3deg: note `n-inject`
- Scroll 3 at `(280, 370)`, size 152 x 126, rotate -6deg: note `n-pos0`

**Links (must all be present):**

| Paper | Links |
|---|---|
| Same Score, Different Strategy (CAISc 2026) | Paper https://openreview.net/forum?id=d8w4gMVQ1w, Project page https://adya6714.github.io/retrieval-vs-computation/, Code https://github.com/Adya6714/retrieval-vs-computation |
| Reading Without Looking (Preprint) | Project page https://adya6714.github.io/vlm-ocr-eval/, PDF https://adya6714.github.io/vlm-ocr-eval/paper/main.pdf, Code https://github.com/Adya6714/vlm-ocr-eval |
| Diffusion-Generated Volatility Surfaces for RL Hedging (Draft) | Draft PDF https://drive.google.com/file/d/1eXAm7XeUYIWnzu_3MWRpSY6nO9gyGDNV/view?usp=drive_link, Code https://github.com/Adya6714/ddpm-vol-hedging |
| Hybrid Quantum-Classical Paradigms (Survey) | PDF https://drive.google.com/file/d/1zwhnW2Nvl6I5myx556UoGED-1MKv9qt5/view?usp=sharing |
| Retrieval vs Computation, papers 2 to 4 (Planned) | none |

**Checks:** every badge colour is distinct; every link opens in a new tab; scrolls cover the cleaned patches in the painting completely.

---

### Stop 2: Projects ("Projects in the current")

**Purpose:** show breadth (research, agents and systems, quant) with links on every card.

**Camera:** desktop `[478, 650, 470, 0.64, 0.5]`, the rapids. Panel on the left.

**Panel:**
- Heading and one line: "Each started with a question a benchmark number couldn't answer."
- Filter chips: All, Research, Agents & systems, Quant.
- Project cards, each with: title, one line, up to 3 chips, and small link buttons (Site, Code, Paper). Clicking the card opens the project modal; clicking a link button opens the link without opening the modal.
- Show 5 cards, plus "Show all projects" if there are more.

**Project modal:** title, chips, "The problem", "What I built" (bullets), "Why it matters", an optional interactive demo, and link buttons.
- **Demos:** `rvc` (toggle original / new numbers / renamed entities and watch accuracy), `ocr` (toggle text / blank / noise and watch confidence stay flat), `ddpm` (result bars).

**On the map:** three glass cards lying in the rapids, slightly rotated, overlapping like the original painting. Each shows title, one line and "Open case study".
- Card 1 at `(294, 486)`, 244 x 120, rotate -4deg: `p-rvc`
- Card 2 at `(318, 574)`, 284 x 136, rotate -4deg: `p-ocr`
- Card 3 at `(428, 658)`, 240 x 152, rotate -5deg: `p-ddpm`
- Text sits at the bottom of each card so the overlaps don't hide it.

**Projects and links (fix the missing ones in `content.js`):**

| Project | Group | Links |
|---|---|---|
| Retrieval vs Computation | Research | Site https://adya6714.github.io/retrieval-vs-computation/, Code https://github.com/Adya6714/retrieval-vs-computation, Paper https://openreview.net/forum?id=d8w4gMVQ1w |
| Reading Without Looking | Research | Site https://adya6714.github.io/vlm-ocr-eval/, Code https://github.com/Adya6714/vlm-ocr-eval, Preprint https://adya6714.github.io/vlm-ocr-eval/paper/main.pdf |
| Synthetic Volatility Surfaces for Hedging | Research, Quant | Code https://github.com/Adya6714/ddpm-vol-hedging, Draft (Drive link above) |
| OmniMesh | Agents & systems | Code https://github.com/Adya6714/OmniMesh |
| FraudScope360 | Agents & systems | Code https://github.com/Adya6714/FraudScope360 **(missing now, add it)** |
| FraudSense AI | Agents & systems | Code https://github.com/Adya6714/FraudSense-AI **(missing now, add it)** |
| Data in Motion | Agents & systems | Code https://github.com/Adya6714/data-in-motion **(missing now, add it)** |
| CloudWatch in Plain English | Agents & systems | No public repo. Show "Private" chip instead of links |

**Checks:** every project with a repo shows a Code button; filters hide and show cards correctly; the modal demo bars animate in.

---

### Stop 3: Experience ("The path so far")

**Purpose:** a clean timeline of real roles.

**Camera:** desktop `[722, 492, 430, 0.70, 0.5]`, the three arches on the right bank. Panel on the left.

**Panel:** one row per job: coloured banner-shaped monogram, company, role and dates. Clicking a row expands its bullet points (accordion; only one open at a time).

**On the map:** each arch gets a coloured cloth banner with the company initial, and a small name tag floating above the arch. Clicking a banner opens that job in the modal.
- Arch top-right, banner at `(674, 274)`, 28 x 64: **EquiContracts**
- Arch middle-right, banner at `(696, 452)`, 38 x 88: **Nurix AI**
- Arch lower-right, banner at `(732, 619)`, 42 x 101: **FidelFolio**
- Arch on the left bank, banner at `(112, 447)`, 39 x 84: **Grasim** (seen while travelling)
- Khageshvara appears in the panel only.

**Jobs (order: newest first):**

| Company | Role | Dates | Link |
|---|---|---|---|
| EquiContracts | Founding Engineer | 2026 to present | https://github.com/Adya6714/EquiContracts (only after co-founder approval) |
| Nurix AI | ML Engineering Intern | Jul to Dec 2025 | none |
| FidelFolio Investments | Quant Investment Analyst | May to Jun 2025 | none |
| Grasim (Aditya Birla Group) | Research Engineer | May to Jul 2024 | none |
| Khageshvara Aviation | Product Development Lead and ML Intern | May to Oct 2023 | none |

**Checks:** banner text is centred on the painted banners; name tags never overlap each other.

---

### Stop 4: Skills

**Purpose:** all skills at a glance, without scrolling.

**Camera:** desktop `[215, 830, 480, 0.30, 0.5]`, the three crystal clusters on the left bank. Panel on the **right**.

**Panel:** 5 rows. Each row has a label on the left and chips on the right, all on one screen. Hovering (or focusing) a chip shows "Used in: ...".

| Row | Chips |
|---|---|
| LLMs and NLP | PyTorch, Transformers, LLM evaluation, Probing and ablation, LangChain |
| Vision | OpenCV, OCR, CNNs |
| RL and generative | Diffusion models, PPO, vLLM |
| Systems | Python, FastAPI, Docker, AWS, GCP, SQL, TypeScript |
| Quant and classical ML | XGBoost, Graph ML, Portfolio optimisation, Volatility modelling, CVaR |

**On the map:** a glowing amber pill label under each of the 5 crystal clusters (LLMs and NLP, Vision, RL and generative, Systems, Quant and classical ML). Hovering a label shows its chips in a small popover. Clicking goes to this stop. Positions (centre x, top y): `(90, 800)`, `(248, 772)`, `(329, 832)`, `(768, 872)`, `(784, 1000)`.

**Checks:** the whole skills panel fits without scrolling on a 1366 x 768 screen.

---

### Stop 5: Shelf ("On my shelf")

**Purpose:** show what Adya studies, with her own study book as the highlight.

**Camera:** desktop `[150, 885, 420, 0.32, 0.5]`, the flat rocks on the left. Panel on the right.

**Panel:**
1. **Featured study book** card: book cover (title on a dark green spine), "Featured" label, title, one-line description, first 5 chapters, and a **Read the book** button. If there is no link yet, show "Link coming soon".
2. **YouTube-style rows**, one per topic (Transformers and LLMs, Interpretability, Generative models and RL). Each row scrolls sideways. Each item: 16:9 thumbnail (real YouTube thumbnail `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg` for videos, a coloured gradient with the type for papers, books and blogs), play icon, length badge, title, author, and a one-line "why it helped".

**On the map:** a small shelf on the rocks: the study book spine plus 4 mini thumbnails and the label "On my shelf". Clicking goes to this stop.

**Data needed from Adya (in `content.js > shelf`):**
- `book.title`, `book.link`, `book.chapters`
- Real shelf items with `url` (direct video URLs, not search pages) and `why`

**Checks:** video items use real video URLs and real thumbnails; no sample items remain at launch.

---

### Stop 6: Ask the guardian

**Purpose:** a recruiter can ask questions and get answers grounded only in Adya's documents.

**Camera:** desktop `[480, 895, 420, 0.62, 0.5]`, the stone statue and its speech bubble. Panel on the left.

**Panel:** chat window. A first message from the guardian, 4 suggested question chips, a text input with an Ask button, and a fine-print line: "AI guardian. Answers come only from Adya's documents."
- Answers type out word by word, and each ends with a small "From: [source]" line.
- While answering, the statue's eyes glow brighter.

**How answers work:**
1. If `SITE_CONFIG.GUARDIAN_API` is set (on Vercel: `/api/ask`), POST `{ question }` and show `{ answer, source }`.
2. If that fails or is off, fall back to keyword matching against `guardian.kb` in `content.js`.
3. If nothing matches, show the fallback message with Adya's email.

**Server (`api/ask.js`):** Claude Haiku, system prompt built from `api/kb.js` (generated by `npm run kb`), answers under 120 words, never invents facts, 20 questions per visitor per hour, API key only on the server.

**On the map:** a speech bubble next to the statue with 3 question buttons (clicking one goes to this stop and asks it), and two glowing eye dots on the statue at `(415, 881)` and `(439, 881)`.

**Checks:** a question typed with no internet still gets a scripted answer; the API key never appears in browser code.

---

### Stop 7: About (the pool)

**Purpose:** a calm ending with every way to contact Adya.

**Camera:** desktop `[440, 1150, 848, 0.5, 0.64]`, the whole pool with ripples. Panel centred above the stone.

**Panel:** "About me", the `person.about` paragraph, and buttons: Resume (primary), Email (`mailto:srivastavadya@gmail.com`), GitHub, LinkedIn, OpenReview. Hint: "Move your cursor over the water."

**On the map:** a profile card on the stone at `(292, 1153)`, 308 wide: photo (or "AS" initials), name, "ML research engineer", and buttons Resume, LinkedIn, GitHub.

**Links:**
- GitHub https://github.com/Adya6714
- LinkedIn https://www.linkedin.com/in/adyasri
- OpenReview https://openreview.net/forum?id=d8w4gMVQ1w
- Email srivastavadya@gmail.com

**Checks:** cursor ripples are clearly visible on the pool; the photo loads if `PHOTO_URL` is set.

---

## 6. The water (shader)

- **Inputs:** `plate.webp` (the painting), `flow.png` (R, G = flow direction and speed, B = water mask), `foam.png` (where water churns).
- **Effects, all only where the water mask is on:**
  - flow-map movement (two phases cross-faded so it never jumps)
  - foam churn in the rapids
  - fast streaks on the waterfall
  - glints on calm water
  - cursor ripples
  - drifting mist at the waterfall base and the lower cascade
- **Calm mode:** `uMotion = 0` freezes everything; the camera still moves.
- **Do not** replace the shader with CSS or canvas drawings, and do not change the texture files.

---

## 7. Performance and accessibility

- Render the shader at up to 1.5x device pixel ratio (0.8x on screens wider than 1700px).
- Pause the render loop when the tab is hidden.
- If WebGL fails, show the painting as a static background on `#mapInner`; everything else still works.
- All clickable map elements are real `<button>` or `<a>` elements with readable labels.
- Visible focus ring on everything; the modal traps focus.
- Text contrast at least 4.5:1 on panels.

---

## 8. Cursor prompts, one per job

Paste one at a time, each in a fresh chat starting with "Read @SITE_SPEC.md."

1. **Scroll:** "Rebuild the scroll system exactly as Section 3 describes: Lenis, hold and travel ranges, snap to the nearest stop, panel fades, keyboard navigation, reduced motion. Do not change the shader or the content."
2. **Links:** "Update js/content.js so every link in Sections 5.1, 5.2, 5.3 and 5.7 is present. Add the missing FraudScope360, FraudSense AI and Data in Motion repo links. Show a 'Private' chip for CloudWatch."
3. **Research:** "Rebuild Stop 1 as Section 5, Stop 1 describes, including the 'Show all notes' modal and the note modal."
4. **Projects:** "Rebuild Stop 2 as described: filters, 5 visible cards, 'Show all', link buttons that don't open the modal, and the three on-map cards."
5. **Experience:** "Rebuild Stop 3 as an accordion plus on-map banners and name tags."
6. **Skills:** "Rebuild Stop 4 so it fits on one screen at 1366 x 768."
7. **Shelf:** "Rebuild Stop 5 with the featured book and YouTube-style rows using real thumbnails."
8. **Guardian:** "Check Stop 6 end to end: API call, fallback, typing effect, source line, glowing eyes."
9. **About:** "Rebuild Stop 7: centred panel, profile card on the stone, all contact links."
10. **Mobile:** "Test every stop at 390 x 844. Bottom sheet panels, mobile camera framing, on-map text never below 12px."
