# River Portfolio v2: Redesign Plan and Cursor Prompts

Put this file in the repo root as `CURSOR_PLAN_v2.md` (it replaces `SITE_SPEC.md` as the source of truth).
Run the prompts in Part C **in order**, one per Cursor chat. Each chat starts with:

> Read @CURSOR_PLAN_v2.md. Do only Prompt N. Don't touch anything the prompt doesn't mention. Check every acceptance item before you finish.

---

## Part A. Why the site feels broken (root causes)

| What you see | Root cause | Fix (prompt) |
|---|---|---|
| Scroll is haphazard; elements jump in too big | The camera zooms to a fixed "visible width" per stop (too narrow, so zoom is 3x+), and it chases the scroll with a lag | Fit each stop's **bounding box into the free part of the screen**, cap the zoom, snap to stops (C1) |
| Cards on the right hidden by the left panel | Camera ignores where the panel is | Same fix: the camera only uses the screen area the panel does not cover (C1) |
| Panels won't scroll | Lenis (smooth scroll) swallows wheel events inside panels | Add `data-lenis-prevent` to every scrollable panel, modal and list (C1) |
| Blurry painting | 3x plate stretched 2 to 3 times on screen, canvas capped at 1.5x DPR, no mipmaps | Use the new 4x plate, WebGL2 mipmaps, full DPR up to 2, lower max zoom (C2) |
| First screen shows "A rename erased a perfect score" and "Grasim" | All map overlays are always visible | Each overlay belongs to one stop and fades in only near that stop (C1) |
| "Where the ideas come from" is confusing | Papers, notes, and floating scrolls all show the same research three different ways | Rebuild as **Research: 3 threads**, one card per paper (C4) |
| "Draft", "Planned", "Survey" labels feel wrong | Wrong status data | Correct statuses below: Published / Preprint / Submitted (C4) |
| Only 3 projects on the river, the rest hidden | On-map cards were a demo of 3 | Projects become a **swipeable strip + full project index with all 19 repos** (C5) |
| Experience shows only 2 roles | The camera framed only part of the arches | Experience becomes **stepping stones** with all roles visible at once (C6) |
| Skills text floating near the statue | Crystal labels were absolute-positioned near the guardian | Remove map labels; skills live in one compact panel (C7) |
| Meraki and unrelated items on the shelf | Mixed content | Shelf becomes a **Library** page with tabs; Meraki gets its own **Writing** page (C8, C9) |
| Ask section unclear, duplicated questions | Chat + bubble + chips all doing the same job | Rebuild as an **Interview room** with a living guardian (C10) |
| About too high, extra card behind it | Panel anchored too high, old `.footcard` still rendered | Delete `.footcard`, anchor About at the pool, add your photo (C11) |
| "Leave a slip" too small, the word "chute" | Placeholder UI | Big **Drop a card** suggestion box with an animation, emailed to you (C12) |

---

## Part B. The new structure

### B1. Two ways to move around
1. **The River (home page, vertical scroll):** a guided journey with 7 stops.
2. **Top tabs (separate pages, no river scroll):** `River`, `Library`, `Writing`, `Other work`. These are normal pages in the same site style. They are not part of the scroll journey.

### B2. The 7 river stops

| # | Stop | Map area | Panel position (desktop) | What it shows |
|---|---|---|---|---|
| 0 | **Hello** | Waterfall | Left | Photo, name, your intro (2 paragraphs), "open to" chips, Drop a card button |
| 1 | **Research** | Upper pool with 3 scrolls | Left | 3 research threads (one per paper) |
| 2 | **Projects** | Rapids | Bottom strip | Swipeable cards + "See all 19 projects" |
| 3 | **Path so far** | Stepping stones and arches | Right | All roles, timeline, details visible |
| 4 | **Skills** | Crystals | Right | Compact skill grid |
| 5 | **Interview room** | Stone guardian | Left | Living guardian + interview tracks + free questions |
| 6 | **Drop a card** | Pool | Centre | Your closing paragraph, photo, contact, big suggestion box |

The Library (study module, LeetCode, videos, reading) moves out of the river into the **Library** tab. A small "Visit the library" link stays in the Skills panel.

### B3. Layout rule for every stop (fixes scrolling and hidden cards)
- Each stop defines a **focus box** on the map (in map pixels) and a **panel side** (left, right, bottom, centre).
- The **free area** is the screen minus the panel rectangle (plus 24px padding).
- Camera zoom `k = min(freeWidth / boxWidth, freeHeight / boxHeight)`, clamped to **0.9 to 1.9 on desktop** and **0.9 to 1.5 on mobile**.
- The camera centres the focus box inside the free area, then clamps to the map edges.
- Result: the thing you're looking at is always fully visible, never under the panel, never blown up.

---

## Part C. Cursor prompts (run in order)

### Prompt C1: Scroll, camera and overlay visibility
> Rework scrolling and the camera in `js/app.js`:
> 1. Replace the `STOPS` format with: `{ id, label, panel: "left"|"right"|"bottom"|"center", box: [x0, y0, x1, y1], mbox: [x0, y0, x1, y1] }` (box in map pixels; `mbox` for mobile). Use these boxes:
>    - hello `[230, 0, 640, 300]`
>    - research `[270, 280, 545, 500]`
>    - projects `[260, 470, 700, 820]`
>    - path `[600, 260, 848, 740]`
>    - skills `[20, 700, 380, 900]`
>    - interview `[330, 800, 640, 990]`
>    - card `[150, 980, 760, 1264]`
> 2. Implement the layout rule from Part B3: compute the panel rectangle from the actual panel element (`getBoundingClientRect`), subtract it from the screen to get the free area, fit the box into the free area with zoom clamped to [0.9, 1.9] desktop and [0.9, 1.5] mobile, centre it, clamp to the map.
> 3. Use Lenis from cdnjs (pinned version). Scroll progress `f = scroll / maxScroll * (N - 1)`. Each stop holds the camera still while `|f - i| < 0.3`. Between stops, interpolate the camera with ease-in-out (centre linearly, zoom in log space). No extra lerp on top of Lenis.
> 4. Snap: after 160 ms without scroll input, `lenis.scrollTo(nearest stop, { duration: 0.9 })`. No snapping while a modal is open, while typing, or while the pointer is over a scrollable panel.
> 5. Add `data-lenis-prevent` to every `.panel`, `.modal .sheet`, `.rail`, and any element with `overflow: auto`. Panels may scroll internally; set `overscroll-behavior: contain`.
> 6. Every map overlay gets `data-stop="<index>"`. Its opacity is `1 - smoothstep(0.35, 0.6, |f - stop|)` and `pointer-events: none` when opacity < 0.5. Nothing from stops 1 to 6 may be visible on the first screen.
> 7. Keyboard: Down, PageDown, Space go to the next stop; Up, PageUp to the previous; Home and End to the first and last.
> 8. `prefers-reduced-motion`: no Lenis smoothing, camera jumps between stops.
>
> **Acceptance:**
> - One wheel flick moves one stop and settles in under 1 s.
> - At 1440x900, 1366x768 and 390x844, every stop's focus box is fully visible and not covered by its panel.
> - Panels scroll with the wheel and trackpad.
> - The first screen shows only the hello panel and the waterfall.

### Prompt C2: Resolution and visual comfort
> 1. Replace `assets/scene/plate.webp` with the new `plate_4x.webp` (3392x5056) I added. Keep the old file as `plate_3x.webp`. In `js/app.js`, load the 4x plate if `MAX_TEXTURE_SIZE >= 5056`, else the 3x.
> 2. Switch the scene to a WebGL2 context (fall back to WebGL1). With WebGL2, call `generateMipmap` on the plate and use `LINEAR_MIPMAP_LINEAR` min filter with anisotropic filtering if `EXT_texture_filter_anisotropic` exists.
> 3. Render the canvas at `min(devicePixelRatio, 2)`; drop to 1.25 only if the frame time averages over 22 ms for 2 seconds.
> 4. Make it easier on the eyes:
>    - shader vignette strength from 0.72 to 0.85
>    - glints 0.9 to 0.6
>    - mist 0.22 to 0.16
>    - panels: base font 17px, line-height 1.65, max text width 62ch
>    - panel background `rgba(5, 24, 28, 0.84)` (more solid)
>    - fireflies count 30 to 16
> 5. Show a low-res blurred placeholder (a 400px-wide version of the plate as a CSS background) until the full texture loads.
>
> **Acceptance:** at 1440x900 on a retina screen the painting has no visible pixel stretching at any stop; text contrast is at least 4.5:1.

### Prompt C3: Stop 0, Hello (top of the site)
> Rebuild the first panel. Content comes from `content.js > person` (update it with the text in Part D1).
> - Layout: photo (`assets/photo.jpg`, 112px circle with a thin cyan ring; initials fallback), name in large type, then the two intro paragraphs from D1, then an **"I'm open to"** row of chips:
>   - ML research and engineering roles
>   - Hackathon teammates
>   - Resources you think I should know
>   - Conversations about AI/ML
> - Buttons: **Resume** (primary), **Drop a card** (goes to stop 6 and focuses the card input), **GitHub**.
> - The panel sits in the dark forest on the left, vertically centred, with a solid background (Prompt C2 values) so it reads clearly over the painting.
> - Remove the old proof chips row and the "Scroll to travel downstream" hint. Replace the hint with a small animated chevron at the bottom centre.
>
> **Acceptance:** all text readable at 1366x768 without scrolling the panel; nothing else on screen except the waterfall.

### Prompt C4: Stop 1, Research
> Replace the "Where the ideas come from" panel and its scrolls with **Research: three threads**. Data in `content.js > research` (Part D2). Delete `papers` and `notes` from the UI.
> - Panel header: "Research", sub-line "Three questions I keep pulling on. Each one became a paper."
> - Each thread is a card with:
>   - status badge (Published, Preprint, Submitted)
>   - title
>   - the question in one line
>   - **one headline result** in large type with a short caption
>   - 2 or 3 links as buttons
>   - a "Read the story" button that opens a modal with: The question, What I did, What I found (3 short findings), What's next.
> - The three on-map scrolls stay, but each one is now a thread (labels: "Reasoning", "Vision", "Markets"). Clicking a scroll opens the same modal. Scrolls only show at this stop (Prompt C1 rule).
> - Survey paper: show as a small line at the bottom of the panel: "Also: a survey on hybrid quantum-classical methods (PDF)".
>
> **Acceptance:** no "Draft" or "Planned" label anywhere; the panel fits at 1366x768 without inner scrolling.

### Prompt C5: Stop 2, Projects (all repos)
> Rebuild projects from `content.js > projects` (replace it with Part D3).
> - **On the river:** the panel is a **bottom strip** (full width, 260px tall on desktop). It holds a horizontally swipeable row of project cards (scroll-snap, drag and wheel-to-horizontal). Each card shows: title, one plain-language line, 3 skill chips, and buttons (Live, Code, Paper, only those that exist). The camera box sits above the strip, so the rapids stay visible.
> - Show the **featured** projects in the strip (those with `featured: true`), then a final card "See all 19 projects".
> - **Project index:** "See all" opens a full-screen overlay (not part of the scroll) with filters (All, AI systems, Forecasting and data, Research code, Products and platforms, Early work), a search box, and a responsive grid of every project. Clicking a card opens the project modal (problem, what I built, impact, skills, links).
> - Remove the three old on-map project cards; replace them with three small glowing "lanterns" floating in the rapids that pulse when the strip scrolls (purely decorative, `data-stop=2`).
>
> **Acceptance:** every repo in D3 appears in the index with correct links; strip cards never sit under any other element; works with touch swipe.

### Prompt C6: Stop 3, Path so far
> Rebuild Experience from `content.js > jobs` (Part D4).
> - Panel on the right, titled "The path so far".
> - A vertical timeline where every role is **visible at once**:
>   - coloured stone marker
>   - company, role, dates
>   - 2 short bullets
>   - skill chips
> - Clicking a role expands to all bullets.
> - On the map: one small glowing **stepping stone** per role placed along the right bank (positions in D4). Hovering a role in the panel lights its stone, and hovering a stone highlights the role. Banners on the arches show the initials of the 3 most recent roles.
> - Delete the old floating name tags.
>
> **Acceptance:** all 5 roles visible without expanding anything at 1440x900.

### Prompt C7: Stop 4, Skills
> - Delete every on-map crystal label and popover.
> - The crystals glow brighter (shader-free: an absolutely positioned radial gradient overlay per crystal, `data-stop=4`) when the visitor hovers the matching skill row.
> - Panel on the right: 6 rows (Part D5), each a label plus chips, all on one screen.
> - At the bottom: "Visit the library" (goes to the Library tab).
>
> **Acceptance:** no skill text appears anywhere near the guardian; the panel fits at 1366x768.

### Prompt C8: Library tab (separate page)
> Create `library.html` (same header, fonts and colours, no river). Data in `content.js > library` (Part D6).
> - Tabs: **Study module**, **LeetCode and practice**, **Videos**, **Reading**, **Notes**.
> - **Study module:** a big featured card for the study book with cover, title, description, chapter list, and an "Open study module" button.
> - **Videos:** a YouTube-style grid with real thumbnails (`https://img.youtube.com/vi/<id>/hqdefault.jpg`), duration, channel, and a one-line "why I watched it". Clicking opens the video in a lightbox using `youtube-nocookie.com/embed/<id>`.
> - **LeetCode:** a profile card linking to the LeetCode URL from config (hidden if empty).
> - Empty tabs show "Coming soon" instead of sample items.
> - Add the top tabs bar to every page: River, Library, Writing, Other work.
>
> **Acceptance:** no sample or placeholder items render; every external link opens in a new tab.

### Prompt C9: Writing tab (Meraki) and Other work tab
> 1. Create `writing.html` titled **Meraki**, subtitle **"An alleyway to sonder."**
>    - Layout: a calm dark-academia page (serif headings, parchment-tinted cards on the same dark teal background).
>    - Poem list from `content.js > meraki` (Part D7). Each card: title, date, reading time, one-line note, "Read" (opens the original post).
>    - A short "About Meraki" paragraph (Part D7).
> 2. Create `other.html` titled **Other work** for non-ML work (consulting case studies, cloud computing, public-service app ideas). Data in `content.js > otherWork`. Card grid with title, type, one line, link.
> 3. Remove these items from anywhere on the river and the Library.
>
> **Acceptance:** Meraki has no link from the river except the top tab; both pages work on mobile.

### Prompt C10: Stop 5, Interview room (the guardian comes alive)
> Replace the Ask panel with an **Interview room**. Data in `content.js > interview` (Part D8).
>
> **Guardian awakening animation** (CSS and SVG overlays on the statue, `data-stop=5`, runs once when the stop first becomes active, then idles):
> 1. Thin cyan cracks draw across the stone (SVG paths over the statue with `stroke-dashoffset` animation, 1.2 s).
> 2. The eyes open: two glow dots scale from 0 to 1 with a bloom.
> 3. Moss particles and small leaves drift upward from the statue (2D fx canvas, 2 s burst).
> 4. A soft ring ripple spreads on the water around the statue.
> 5. Idle: eyes breathe slowly. While answering, eyes brighten and the cracks pulse.
>
> **Panel (left):**
> - Intro (exact text): "Hi, I'm the guardian of this river. Interview Adya through me. Ask about her research, internships, projects, skills, or what she's looking for next. I answer only from her own notes and papers."
> - **Tracks** as tabs: Start here, Projects, Research, Behavioural, Hard questions.
> - Each track lists its questions. Clicking a question shows the **short answer**, a "Go deeper" expander with the long answer, an optional "What you might challenge" block, and **"You might ask next"** chips linking to other questions.
> - A free-text box at the bottom: "Ask your own question". It goes to the live AI if `SITE_CONFIG.GUARDIAN_API` is set; otherwise it searches the question bank and offers the 3 closest questions.
> - Remove the speech bubble overlay with preset questions, the fine-print line, and every duplicate question list.
>
> **Live AI on GitHub Pages:** GitHub Pages can't run `api/ask.js`. Create `worker/guardian.js`, a Cloudflare Worker with the same logic as `api/ask.js` (Claude Haiku, system prompt from `api/kb.js`, 20 questions per IP per hour, CORS only for `https://adya6714.github.io`). Add deploy steps to the README (wrangler, `ANTHROPIC_API_KEY` as a secret). Set `GUARDIAN_API` to the worker URL. Regenerate `api/kb.js` from the new interview data too.
>
> **Acceptance:** the animation plays once per visit and is skipped under reduced motion; every question has a short answer; the AI never runs from the browser with a key.

### Prompt C11: Stop 6, About and contact at the pool
> - Delete the `.footcard` overlay and its CSS entirely.
> - The final panel is centred and anchored **low**: its bottom sits at 6vh, so the pool and ripples show above it.
> - Content:
>   - photo (`assets/photo.jpg`, rounded square)
>   - heading "At the core, I like making things."
>   - the two closing paragraphs from Part D1 (closing)
>   - buttons: Resume, Email, GitHub, LinkedIn, OpenReview
> - The Drop a card box from Prompt C12 sits directly under this text in the same panel, or as the second half of a two-column layout on wide screens.
>
> **Acceptance:** no second box behind the panel; the photo loads; all buttons work.

### Prompt C12: Drop a card (suggestion box with animation, emailed to me)
> Build a **Drop a card** component, used in two places: a compact button on stop 0 that scrolls to stop 6, and the full box on stop 6.
>
> **Look:**
> - A wooden post box (or a vintage payphone booth) drawn in CSS/SVG, on the right.
> - On the left, a paper card (cream, slightly rotated) the visitor writes on.
>
> **Fields:**
> - Message (required, placeholder "A suggestion, a resource, a hackathon idea, or just hello")
> - Type chips: Suggestion, Resource, Hackathon, Opportunity, Just saying hi
> - Name and email (optional)
> - An **Anonymous** toggle that hides name and email
>
> **Animation on submit:**
> 1. The card lifts, tilts and slides into the slot (700 ms).
> 2. The slot flap closes.
> 3. A small stamp "Received" appears.
> 4. Leaves drift from the box.
> 5. A thank-you line appears.
>
> **Delivery:** POST to Formspree (`SITE_CONFIG.SUGGESTION_ENDPOINT`, for example `https://formspree.io/f/<id>`), which emails me every submission. Include a hidden honeypot field and a 10-second minimum between submits. If the endpoint is missing, fall back to `mailto:`.
>
> Never use the words "slip" or "chute". The heading is "Drop me a card", sub-line: "Ideas I should explore, resources I should read, a hackathon you'd like a teammate for, or anything you think I should know. Anonymous is fine."
>
> **Acceptance:** the box is at least 520px wide on desktop and the first thing visible at stop 6; a test submission reaches my inbox.

### Prompt C13: Final polish
> - Lighthouse (mobile and desktop): fix image caching, font loading (`font-display: swap`), alt text, tap target sizes, focus order.
> - Add `<meta property="og:image">` with a 1200x630 crop of the waterfall.
> - Make the top tabs and dots keyboard accessible.
> - Test every stop at 1440x900, 1366x768, 390x844.
> - Remove unused CSS (`.footcard`, `.crystal`, `.scroll` note styles, `.bubble`, `.tag`).

---

## Part D. Content to paste into `js/content.js`

### D1. Person (intro at the top, closing at the end)
```js
person: {
  name: "Adya Srivastava",
  photo: "assets/photo.jpg",
  intro: [
    "I'm Adya, an engineer who genuinely enjoys building things from scratch and figuring out how they work along the way. I'm especially interested in AI and ML, but what keeps me excited is the engineering and research around them: taking a vague question, digging into it, experimenting, breaking things, and eventually turning an idea into something that actually works. I love learning by building, and I'm constantly trying to go one level deeper than what I already know.",
    "I'm currently looking for opportunities where I can work closely with interesting problems in AI/ML, research, and engineering. But I'm also here because I like talking to people who are building, experimenting, and thinking about the same things. If you're working on something interesting, have a different way of looking at AI/ML, have recently discovered something that changed how you think about the field, or simply have a few things you think I should know, I'd genuinely love to hear from you. I'm always up for a good conversation."
  ],
  openTo: ["ML research and engineering roles", "Hackathon teammates", "Resources you think I should know", "Conversations about AI/ML"],
  closingTitle: "At the core, I like making things.",
  closing: [
    "At the core, I like making things. I like starting with a blank page, learning whatever I need to learn, and slowly turning an idea into something real. Research gives me the opportunity to chase questions that don't have obvious answers, while engineering gives me the satisfaction of actually building the answer. AI and ML happen to sit at a particularly exciting intersection of the two for me.",
    "I don't think of learning as something that ends when you understand the theory. I want to understand enough to build with it, break it, question it, and hopefully discover something that wasn't obvious before. That's probably what keeps me moving between research papers, experiments, systems, and completely new things I know very little about. There's always something more to uncover, and that's the part I enjoy most."
  ],
  email: "srivastavadya@gmail.com",
  github: "https://github.com/Adya6714",
  linkedin: "https://www.linkedin.com/in/adyasri",
  openreview: "https://openreview.net/forum?id=d8w4gMVQ1w"
}
```

### D2. Research (three threads)
```js
research: [
  { id: "r-reasoning", label: "Reasoning", status: "Published", venue: "CAISc 2026",
    title: "Same Score, Different Strategy",
    question: "When two AI models get the same score, are they solving problems the same way?",
    headline: "1.00 to 0.00", headlineCaption: "o3-mini's score on a scheduling task after a simple rename",
    did: "Built three probes (rename and rewording, plan versus execution, closeness to training data) and ran 219 problems across arithmetic, planning and optimisation on five frontier models, about 20,000 API calls, with exact answer checkers.",
    found: ["Models with matching scores break in very different ways.", "Accepting an injected wrong step (88 to 100% of the time) did not predict whether a model finished correctly.", "Even with three probes, 61.6% of problems resist a clean label, so behaviour alone is not enough."],
    next: "Look inside the models: where the split between recalling and computing happens, and which training conditions create it.",
    links: [["Paper", "https://openreview.net/forum?id=d8w4gMVQ1w"], ["Project page", "https://adya6714.github.io/retrieval-vs-computation/"], ["Code", "https://github.com/Adya6714/retrieval-vs-computation"]] },
  { id: "r-vision", label: "Vision", status: "Preprint", venue: "",
    title: "Reading Without Looking",
    question: "When an OCR model says it's confident, is it actually looking at the page?",
    headline: "0.99 on a blank page", headlineCaption: "confidence stayed the same with no text at all",
    did: "Trained a small OCR model from scratch for Indian scripts so every internal step could be inspected, then tested it with blank, noisy and scrambled pages, and checked the findings on a production OCR system.",
    found: ["Confidence tracked language patterns, not the image.", "Confidence that looked useful on familiar pages (AUROC 0.84) dropped to near chance on new ones (0.57).", "Routing pages by confidence alone can send exactly the wrong pages through."],
    next: "Confidence scores that check whether the image actually supports the answer.",
    links: [["Project page", "https://adya6714.github.io/vlm-ocr-eval/"], ["Preprint", "https://adya6714.github.io/vlm-ocr-eval/paper/main.pdf"], ["Code", "https://github.com/Adya6714/vlm-ocr-eval"]] },
  { id: "r-markets", label: "Markets", status: "Submitted", venue: "NeurIPS 2026",
    title: "Diffusion-Generated Volatility Surfaces for RL Hedging",
    question: "Can AI-generated market data train a better hedging agent, and how much of the gain comes from the data versus the agent?",
    headline: "60.1% lower", headlineCaption: "tail-risk hedging error than Black-Scholes",
    did: "Built 1,268 NIFTY 50 volatility surfaces from 912K+ option records, trained a diffusion model to generate new ones, and trained a reinforcement learning agent to hedge barrier options on them.",
    found: ["Generated surfaces had fewer pricing inconsistencies than real data.", "The agent cut CVaR(95%) hedging error by 60.1%.", "A model-risk decomposition separates the gain from better data and from a better agent."],
    next: "Testing across market regimes and other indices.",
    links: [["Paper (PDF)", "https://github.com/Adya6714/ddpm-vol-hedging/blob/main/paper/Volatility_Surfaces_Research.pdf"], ["Code", "https://github.com/Adya6714/ddpm-vol-hedging"]] }
],
survey: { title: "Hybrid Quantum-Classical Paradigms for Nonlinear Dynamics, ML and Autonomous Systems", link: "https://drive.google.com/file/d/1zwhnW2Nvl6I5myx556UoGED-1MKv9qt5/view?usp=sharing" }
```
Check: the Markets status says "Submitted, NeurIPS 2026" because that's what your repo README says. Change it if the venue changed.

### D3. Projects (all public repos)

Fields per project: `id, title, group, featured, line, problem, built[], impact, skills[], links: { live, code, paper }`.

| Title | Group | Featured | One line (plain language) | Skills | Links |
|---|---|---|---|---|---|
| OmniMesh | AI systems | yes | An offline disaster-triage network: phones relay emergencies by severity when the internet is down, and AI drafts the dispatch plan. | Kotlin, Android (Jetpack Compose), Firebase, Gemini, P2P networking | Live https://omnimesh-command.web.app, Code https://github.com/Adya6714/OmniMesh |
| FraudSense AI | AI systems | yes | Catches AI-assisted cheating in interviews by combining writing signals, typing behaviour and an LLM judge; flags only when 3 independent signals agree. | DetectGPT, NLP, Keystroke biometrics, Streamlit, Python | Code https://github.com/Adya6714/FraudSense-AI |
| FraudScope360 | AI systems | yes | Fraud detection with five independent detectors (anomalies, sudden behaviour changes, fraud networks, identity clusters, text) fused into one risk score. National winner, Citi Innovation Challenge. | Isolation Forest, Node2Vec, DBSCAN, Kafka, FastAPI | Code https://github.com/Adya6714/FraudScope360 |
| ContentPulse | AI systems | yes | Upload a social media post as text, image or PDF and get structured engagement feedback from Gemini. | Gemini API, OCR, FastAPI, React, Vercel, Railway | Live https://social-analyzer-six.vercel.app/, Code https://github.com/Adya6714/social-analyzer |
| PDF Extractor | AI systems | no | Pulls the structure out of any PDF, then finds the sections that matter for a given reader. | Document AI, NLP, Docker | Code https://github.com/Adya6714/pdf_extractor |
| GridLock 2.0: Traffic Demand Prediction | Forecasting and data | yes | Predicts traffic demand for every map cell and 15-minute slot; scored 87.9 (100 x R²) with a reproducible ensemble. | Spatiotemporal forecasting, Gradient boosting, Ensembling | Code https://github.com/Adya6714/traffic-prediction |
| RouteCast360 | Forecasting and data | no | Forecasts how many seats will sell on intercity bus routes from booking and search signals. | CatBoost, Target encoding, GroupKFold | Code https://github.com/Adya6714/RouteCast360 |
| SmartPricing360 | Forecasting and data | no | E-commerce pricing model. (Add one line from the repo.) | Machine learning, Pricing | Code https://github.com/Adya6714/smart-pricing360 |
| Ganga MRV | Forecasting and data | yes | Checks whether soil data supports a carbon-removal credit: a full measure, report and verify pipeline with a teaching book. | Data analysis, Statistics, Python | Live https://site-eight-khaki-34.vercel.app, Code https://github.com/Adya6714/ganga-mrv |
| Data in Motion | Products and platforms | no | Decides which cloud storage tier each file belongs in using optimisation and ML, and moves it automatically. | MILP, scikit-learn, Kafka (Redpanda), FastAPI, Docker | Code https://github.com/Adya6714/data-in-motion |
| Meme Coin Aggregator | Products and platforms | no | One real-time API for meme-coin data from several exchanges, with caching and live updates. | TypeScript, WebSockets, Caching | Code https://github.com/Adya6714/meme-coin-aggregator |
| ONDC Food Platform | Products and platforms | no | Connects farmers, restaurants and food banks, with demand prediction to cut food waste. | Python, Demand forecasting | Code https://github.com/Adya6714/ONDC-Food-Platform |
| EquiContracts | Products and platforms | no | Turns construction-project email into verified, structured data for contractors and clients. | Agents, FastAPI, Postgres | Code https://github.com/Adya6714/EquiContracts (only with co-founder approval) |
| CloudWatch in Plain English | AI systems | no | Ask AWS metrics questions in plain English and get charts back. | AWS Bedrock, Embeddings, Lambda | Private, show a "Private" chip |
| Retrieval vs Computation (code) | Research code | no | Evaluation toolkit behind the CAISc paper. | LLM evaluation, Python | Code, Site (see D2) |
| vlm-ocr-eval (code) | Research code | no | From-scratch Indic OCR instrument and probes. | PyTorch, OCR | Code, Site (see D2) |
| ddpm-vol-hedging (code) | Research code | no | Diffusion and RL hedging code. | Diffusion models, RL | Code (see D2) |
| WML: Who's Most Like | Early work | no | A party game: draw a word, tag the friend who fits it, with a live leaderboard. | React, Flask | Code https://github.com/Adya6714/WML |
| PSMS, Task Board | Early work | no | Early full-stack apps. (Add one line each.) | JavaScript | Code links |
| Atari RL Agent | Early work | no | My first reinforcement learning project and a log of how I learned ML. | Reinforcement learning, Python | Code https://github.com/Adya6714/Atari-game-RL-Agent |

Notes:
- SmartPricing360, PSMS and Task Board have no README on GitHub, so their lines are placeholders. Add a README to each and update the line.
- The research-code entries link back to the Research stop instead of repeating the full story.

### D4. Jobs (with stepping-stone positions on the map)
```js
jobs: [
  { co: "EquiContracts", role: "Founding Engineer", when: "2026 to present", stone: [700, 300], color: "#7fe3c8",
    pts: ["Building an agentic platform that turns construction-project email into verified data for contractors and clients.", "FastAPI, Next.js, Postgres with row-level security, a rules engine and isolated AI extraction."],
    skills: ["Agents", "FastAPI", "Postgres"] },
  { co: "Nurix AI", role: "ML Engineering Intern", when: "Jul to Dec 2025", stone: [715, 470], color: "#6ff0df",
    pts: ["Built and deployed a TinyBERT voicemail detector (95% precision).", "Cut speech-to-text word errors by 40% with a correction pipeline; improved real-time turn-end detection."],
    skills: ["Transformers", "Speech", "Deployment"] },
  { co: "FidelFolio Investments", role: "Quant Investment Analyst", when: "May to Jun 2025", stone: [745, 610], color: "#b9a6ff",
    pts: ["Improved Sharpe by about 42% with genetic algorithms and Bayesian optimisation.", "Analysed 24 factors across 200+ portfolios."],
    skills: ["Portfolio optimisation", "Factor models"] },
  { co: "Grasim (Aditya Birla Group)", role: "Research Engineer", when: "May to Jul 2024", stone: [690, 700], color: "#ffc977",
    pts: ["Designed 20+ PLC railway simulations for autonomous control and safety.", "Built IR and IoT track monitoring with 98% trespass detection."],
    skills: ["IoT", "PLC", "Sensors"] },
  { co: "Khageshvara Aviation", role: "Product Development Lead and ML Intern", when: "May to Oct 2023", stone: [640, 760], color: "#8fd0ff",
    pts: ["Built CNN vision pipelines for real-time human detection from drones.", "Built the financial model behind a successful DST funding pitch."],
    skills: ["Computer vision", "CNNs"] }
]
```
Check the stone positions visually after C6 and nudge them onto real rocks.

### D5. Skills
```js
skills: [
  ["LLMs and NLP", ["PyTorch", "Transformers", "LLM evaluation", "Probing and ablation", "LangChain", "Gemini API"]],
  ["Vision and documents", ["OpenCV", "OCR", "CNNs", "Document AI"]],
  ["Generative and RL", ["Diffusion models", "PPO", "vLLM"]],
  ["Classical ML and forecasting", ["XGBoost", "CatBoost", "scikit-learn", "Graph ML (Node2Vec)", "Anomaly detection"]],
  ["Systems", ["Python", "FastAPI", "Docker", "Kafka", "AWS", "GCP", "Firebase", "SQL", "TypeScript", "Kotlin"]],
  ["Quant", ["Portfolio optimisation", "Volatility modelling", "CVaR", "Backtesting"]]
]
```

### D6. Library
```js
library: {
  studyModule: { title: "My ML study book", description: "The notes, derivations and experiments I'm writing for myself while learning ML properly.", link: "PASTE_SHARE_LINK_HERE", chapters: [] },
  leetcode: "",
  videos: [],
  reading: [],
  notes: []
}
```
**Important:** `https://drive.google.com/drive/home` is your own Drive home page, so it won't open for anyone else. In Drive, right-click the study module folder or file, then **Share > General access > Anyone with the link > Viewer > Copy link**, and paste that link instead.

### D7. Meraki
```js
meraki: {
  about: "Meraki is where I write about experiences, lessons and the way I see the world. Mostly poems, some stories.",
  site: "https://srivastavadya.wixsite.com/meraki14",
  posts: [
    { t: "Justice of Time", d: "Nov 16, 2023", min: 2, url: "https://srivastavadya.wixsite.com/meraki14/post/justice-of-time" },
    { t: "Laughingly", d: "Nov 15, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/laughingly" },
    { t: "Birth of an Evil", d: "Nov 15, 2023", min: 3, url: "https://srivastavadya.wixsite.com/meraki14/post/birth-of-an-evil" },
    { t: "Stupidity", d: "Nov 15, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/stupidity" },
    { t: "Hallucinate the Ricochet", d: "Nov 15, 2023", min: 6, url: "https://srivastavadya.wixsite.com/meraki14/post/hallucinate-the-ricochet" },
    { t: "Two", d: "Nov 15, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/__two" },
    { t: "The Right Path", d: "Nov 15, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/the-right-path" },
    { t: "Soon...", d: "Jul 25, 2023", min: 2, url: "https://srivastavadya.wixsite.com/meraki14/post/_soon" },
    { t: "Heaven", d: "Apr 20, 2023", min: 2, url: "https://srivastavadya.wixsite.com/meraki14/post/heaven" },
    { t: "Shielded", d: "Mar 13, 2023", min: 2, url: "https://srivastavadya.wixsite.com/meraki14/post/shielded" },
    { t: "Lustre", d: "Mar 8, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/lustre" },
    { t: "The Little Boy", d: "Mar 8, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/the-little-boy" },
    { t: "Twinkling", d: "Mar 7, 2023", min: 1, url: "https://srivastavadya.wixsite.com/meraki14/post/twinkling" }
  ]
}
```
If you want the poems hosted on your own site instead of linking to Wix, paste each poem's text into a `text` field and Cursor will render it on the Writing page.

### D8. Interview question bank

Structure: `interview: { intro, tracks: [ { id, name, questions: [ { id, q, short, long, challenge, next: [questionIds] } ] } ] }`.
You write `short` (2 to 3 sentences, your voice) and `long`. Drafted answers below are from your own material; edit them so they sound like you.

**Start here**
- `me` Tell me about yourself. *(short: use the first two sentences of your intro)*
- `looking` What are you looking for right now?
- `why-ml` Why AI/ML?
- `why-research` Why do you like research?
- `scratch` Why do you build things from scratch?
- `curious` What are you most curious about right now?
- `team` What kind of team do you want to work with?
- `noconstraints` What would you work on with no constraints?

**Projects**
- `rvc-what` What is Retrieval vs Computation?
  - short: "A way to tell whether an AI model actually worked a problem out or recalled something similar it had seen. Benchmark scores can't separate the two, so I built probes that can."
  - next: `rvc-found`, `rvc-artifacts`
- `rvc-found` What did you find?
  - short: "Models with the same score fail in very different ways. o3-mini went from a perfect score to zero on a scheduling task after only the names changed."
- `rvc-artifacts` Could your probes themselves create the effect? *(challenge question; answer with the gold-in, gold-out checks)*
- `ocr-what` What is Reading Without Looking?
- `ocr-why-scratch` Why train your own OCR model instead of testing a big one?
- `ddpm-why` Why diffusion models for market data?
- `ddpm-contrib` How much of the gain came from the data versus the agent?
- `omnimesh-why` Why offline-first for disaster response?
- `fraudsense-fp` How do you avoid flagging honest candidates? *(short: "No single signal can flag anyone. At least three independent signal types have to agree.")*
- `fraudscope-arch` How does FraudScope360 combine its five detectors?
- `nurix-learned` What did you learn shipping ML at Nurix?

**Research**
- `questions` How do you come up with research questions?
- `convincing` How do you know an experiment is convincing?
- `confounders` How do you handle confounders?
- `wrong` Tell me about a hypothesis that turned out wrong.
- `benchmark` What makes a benchmark good?
- `now` What are you researching now?

**Behavioural**
- `failure` Tell me about a failure.
- `decision` Tell me about a difficult technical decision.
- `new` How do you learn something completely new?
- `ambiguity` How do you deal with ambiguity?
- `weak` What are you trying to get better at?

**Hard questions**
- `resume-weak` What's the weakest part of your resume?
- `overhyped` What's overhyped in AI? What's underrated?
- `selfcritique` What would you challenge about your own research?
- `compute` What would you do with 10x the compute?
- `hire` Why should someone hire you?

After filling answers, run `npm run kb` so the live AI knows them too.

### D9. Config additions (`js/config.js`)
```js
GUARDIAN_API: "https://<your-worker>.workers.dev/ask", // from Prompt C10
SUGGESTION_ENDPOINT: "https://formspree.io/f/<your-id>", // from formspree.io, free plan
LEETCODE_URL: ""
```

---

## Part E. Innovative touches worth adding later
1. **Day and night river.** The water, fireflies and mist shift gently with the visitor's local time. It's a shader uniform plus a colour-grade tweak, so it's cheap.
2. **Guardian remembers.** If someone asked questions before, the guardian greets them with "Welcome back, last time you asked about OmniMesh" (localStorage, per browser only).
3. **Research ripple.** Clicking a research thread's headline number sends a ripple across the pool and briefly highlights the related project lanterns, showing how research and projects connect.
4. **Recruiter quick view.** A "60-second version" button in the top bar opens a one-page summary (photo, intro, 3 research results, 6 featured projects, roles, resume) for people in a hurry.
5. **Card wall.** With permission ("Can I show this publicly?" checkbox), approved cards appear as small notes pinned near the pool.

---

## Part F. Assets to add before running the prompts
- `assets/scene/plate_4x.webp`: the sharper painting (attached in chat).
- `assets/photo.jpg`: your photo, square, at least 600x600.
- `assets/Resume_Adya_Srivastava.pdf`: latest resume with the correct paper title.
- A Formspree form ID and, for the live guardian, a Cloudflare account.
