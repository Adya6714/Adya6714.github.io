# River Portfolio v3: Review and Cursor Prompts

Put this file in the repo root as `CURSOR_PLAN_v3.md`. It replaces `CURSOR_PLAN_v2.md` and `SITE_SPEC.md`. Run the prompts in Part D in order, one per Cursor chat. Start every chat with:

> Read @CURSOR_PLAN_v3.md. Do only Prompt N. Do not touch anything the prompt does not mention. Check every acceptance item before you finish.

## Ground rules (Cursor must follow these in every prompt)

- No em dashes or en dashes anywhere: not in copy, comments, JSON, README, or the guardian's answers. Use a comma, colon, or the word "to".
- Never use the words "slip" or "chute" in the UI.
- Never draw landscape or water with CSS, SVG, or 2D shapes. The painting plus the WebGL shader is the scene.
- All text and links live in `js/content.js`. No text is hard coded in `app.js` or HTML.
- Every external link opens in a new tab with `rel="noopener"`.
- Every interactive map element is a real `<button>` or `<a>` with a visible focus ring.
- Respect `prefers-reduced-motion`.

---

## Part A. Page-by-page review

### Global (affects every section)

| Problem                            | Change                                                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll feels like it fights you    | Remove the snap timer and any `scrollTo` correction. Use native scrolling with a damped camera (Prompt D2)                                                              |
| Text on the map is slightly blurry | Overlays are being scaled by CSS transform. Position them in screen space with real font sizes (D2)                                                                     |
| Hover animation is weird           | Hover currently tilts in 3D and brightens big elements. Replace with a short lift and soft glow (D3). I read "Pulse Over" as hover. Tell me if you meant something else |
| People may not reach the bottom    | Guided tour, "Next" button on every stop, progress map with visited ticks, deep links, a 60-second recruiter view (D14)                                                 |
| Scene could feel more real         | Foreground parallax, real waterfall footage in the hero, water reflections, depth haze, optional ambient sound (D11)                                                    |
| Add a mystic mood                  | Night mode with glowing mushrooms, moon shafts, fog (D12)                                                                                                               |
| Add something playful              | Feed the koi in the calm pool (D13)                                                                                                                                     |
| REMOVED_COMPANY must not appear      | Remove it from every file, the guardian's knowledge, and the README (D1)                                                                                                |

### Stop 0: Hello (top of the site)

| Now                                                     | Change                                                                                                                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The waterfall dominates and the intro is hard to read   | Intro becomes the star: bigger type, solid panel, waterfall as backdrop                                                                                                     |
| Photo is missing or not showing                         | Remove the photo from the top entirely. It moves to the ending (D10)                                                                                                        |
| Nothing on screen says what you have actually worked on | Add a **work constellation** in front of the waterfall: six glowing nodes for your areas of work, connected by lines. Hover shows a one-liner, click jumps to the stop (D4) |
| No clear next step                                      | Three buttons: "Take the 60 second tour", Resume, Drop me a card                                                                                                            |
| No hint of the rest of the site                         | A right-edge tab "Drop me a card" is always visible, plus the progress map                                                                                                  |

### Stop 1: Research

| Now                                                                             | Change                                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Two post-it notes float with no meaning and odd coordinates                     | Replace with **four aligned notes**, one per paper, in a tidy 2 x 2 grid on the right bank |
| Fewer than four papers shown                                                    | Show all four papers (D5)                                                                  |
| Wrong or confusing status labels (Draft, Planned, Survey, Submitted to NeurIPS) | Only two labels exist: "CAISc 2026" and "Preprint"                                         |
| Panel does not scroll                                                           | Panel fits without scrolling, and any list gets `overflow:auto` that works (D2)            |

Each note says three things: the paper's tag, what it does in one sentence, and one headline number. Each note is clickable and opens the paper's story.

### Stop 2: Projects

| Now                              | Change                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Vertical strip, hard to browse   | **3D circular slider** (a ring of project cards you can drag, rotate with arrows, or let drift) |
| Websites hidden inside the modal | A "Visit site" button sits on the front face of every card that has a live site                 |
| Only some projects shown         | All 19 repos, grouped, filter chips on top                                                      |
| Cards hidden behind the panel    | The ring sits centre-bottom, the river stays visible above it                                   |

### Stop 3: Path so far (experience)

| Now                                      | Change                                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Flags with F and N initials mean nothing | Remove them                                                                                                                   |
| REMOVED_COMPANY listed                     | Removed                                                                                                                       |
| Details hidden behind small flags        | **Stepping stones** across the glowing path. Each stone shows what you built. Clicking a stone grows it into a deep-dive card |
| No sense of direction                    | A glowing dashed path flows forward through the stones, ending at a final stone "What's next" that opens the card box         |

Four stones: Khageshvara (2023), Grasim (2024), FidelFolio (2025), Nurix (2025), then the "What's next" stone.

### Stop 4: Shelf (now includes Skills)

| Now                                         | Change                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Skills have their own stop and scroll badly | The Skills stop is deleted                                                                        |
| Study material is on a separate page        | Shelf is one panel with tabs: **Skills, Study module, Watching and reading, Practice, Beyond ML** |
| Poems and case studies have no home         | The "Beyond ML" tab links to Meraki (poems) and Other work (case studies)                         |

### Stop 5: Interview room

| Now                               | Change                                                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free questions only keyword-match | **Semantic matching**: the visitor's question is matched by meaning to your prepared questions. If nothing matches, an AI answers from your documents |
| Statue barely reacts              | When a question is asked, the guardian rises, light pulses out across the water, fireflies swarm to it, runes glow                                    |
| Intro text and fine print weird   | New intro (exact text below), fine print removed                                                                                                      |

### Stop 6: About (ending)

| Now                              | Change                                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Photo missing                    | Your photo appears here, and only here                                                                                  |
| Drop a card crammed inside About | About stays as written. **Drop me a card** is a separate big panel on the right, plus the always-visible right-edge tab |

### Other pages

- **Writing (Meraki):** keep as its own tab. Poems only.
- **Other work:** case studies and non-ML work.
- **Library page:** deleted. Its content moved into the Shelf.

---

## Part B. Answers to your questions

**Are research and engineering different?** They overlap, and the site should show how they connect instead of hiding it.

- Research produces knowledge: a question answered with evidence (a paper).
- Engineering produces a working thing for someone (a system).
- On the site, every research paper has a "Built from it" chip that links to its code, and every project has a "Research behind it" chip where one exists.
- The hero constellation uses this too: research nodes and build nodes are joined by lines.

**Why post-it notes at all?** They are a way to see all four papers on the map at once, the way a researcher pins ideas on a wall. Each one must carry real information (tag, what it does, one number). If a note cannot carry that, it should not exist.

**What I could not check:** the live page loads as an empty shell until JavaScript runs, so this review comes from your notes and the repo structure, not from a pixel-level audit. Send screenshots of anything that still looks off.

---

## Part C. Content to paste into `js/content.js`

### C1. Research (four papers)

```js
research: [
  {
    id: "r-reasoning",
    tag: "Reasoning",
    status: "CAISc 2026",
    title: "Same Score, Different Strategy",
    question:
      "When two AI models get the same score, are they solving problems the same way?",
    note: {
      what: "Tells whether an AI model solved a problem or remembered it.",
      headline: "1.00 to 0.00",
      caption: "after a simple rename",
    },
    did: "Built three probes (rename and rewording, plan versus execution, closeness to training data) and ran 219 problems across arithmetic, planning and optimisation on five frontier models, about 20,000 API calls, with exact answer checkers.",
    found: [
      "Models with matching scores break in very different ways.",
      "Accepting an injected wrong step 88 to 100% of the time did not predict whether a model finished correctly.",
      "Even with three probes, 61.6% of problems resist a clean label, so behaviour alone is not enough.",
    ],
    next: "Look inside the models: where the split between recalling and computing happens, and which training conditions create it.",
    builtFrom: "retrieval-vs-computation",
    links: [
      ["Paper", "https://openreview.net/forum?id=d8w4gMVQ1w"],
      ["Project page", "https://adya6714.github.io/retrieval-vs-computation/"],
      ["Code", "https://github.com/Adya6714/retrieval-vs-computation"],
    ],
  },
  {
    id: "r-vision",
    tag: "Vision",
    status: "Preprint",
    title: "Reading Without Looking",
    question:
      "When an OCR model says it is confident, is it actually looking at the page?",
    note: {
      what: "Checks whether an OCR model's confidence comes from the page.",
      headline: "0.99",
      caption: "confidence on a blank page",
    },
    did: "Trained a small OCR model from scratch for Indian scripts so every internal step could be inspected, then tested it with blank, noisy and scrambled pages, and checked the findings on a production OCR system.",
    found: [
      "Confidence tracked language patterns, not the image.",
      "Confidence that looked useful on familiar pages (AUROC 0.84) fell to near chance on new ones (0.57).",
      "Routing pages by confidence alone can send exactly the wrong pages through.",
    ],
    next: "Confidence scores that check whether the image actually supports the answer.",
    builtFrom: "vlm-ocr-eval",
    links: [
      ["Project page", "https://adya6714.github.io/vlm-ocr-eval/"],
      ["Preprint", "https://adya6714.github.io/vlm-ocr-eval/paper/main.pdf"],
      ["Code", "https://github.com/Adya6714/vlm-ocr-eval"],
    ],
  },
  {
    id: "r-markets",
    tag: "Markets",
    status: "Preprint",
    title:
      "Diffusion-Generated Volatility Surfaces for RL Hedging of NIFTY 50 Barrier Options",
    question:
      "Can AI-generated market data train a better hedging agent, and how much of the gain comes from the data versus the agent?",
    note: {
      what: "Trains a hedging agent on AI-generated market data.",
      headline: "60.1%",
      caption: "lower tail-risk hedging error",
    },
    did: "Built 1,268 NIFTY 50 volatility surfaces from 912K+ option records, trained a diffusion model to generate new ones, and trained a reinforcement learning agent to hedge barrier options on them.",
    found: [
      "Generated surfaces had fewer pricing inconsistencies than real data (0.005 vs 0.009).",
      "The agent cut CVaR(95%) hedging error by 60.1% against Black-Scholes.",
      "A model-risk decomposition separates the gain from better data and from a better agent.",
    ],
    next: "Testing across market regimes and other indices.",
    builtFrom: "ddpm-vol-hedging",
    links: [
      [
        "Paper (PDF)",
        "https://github.com/Adya6714/ddpm-vol-hedging/blob/main/paper/Volatility_Surfaces_Research.pdf",
      ],
      ["Code", "https://github.com/Adya6714/ddpm-vol-hedging"],
    ],
  },
  {
    id: "r-quantum",
    tag: "Quantum",
    status: "Preprint",
    title:
      "Hybrid Quantum-Classical Paradigms for Nonlinear Dynamics, Machine Learning and Autonomous Systems: A Unified Framework",
    question:
      "Where can quantum and classical computing work together on problems neither handles well alone?",
    note: {
      what: "Maps how quantum and classical computing can work together.",
      headline: "6 topics",
      caption: "in one framework",
    },
    did: "A survey that connects methods for simulating nonlinear systems on quantum hardware, quantum approaches to learning and control, and a comparison of hardware and energy efficiency.",
    found: [
      "Covers Carleman linearization, quantum Fokker-Planck embedding, variational algorithms for PDEs, quantum reinforcement learning and quantum game theory.",
      "Compares hardware platforms and energy efficiency in one place.",
    ],
    next: "Turning the survey's open problems into small experiments.",
    builtFrom: null,
    links: [
      [
        "Paper (PDF)",
        "https://drive.google.com/file/d/1zwhnW2Nvl6I5myx556UoGED-1MKv9qt5/view?usp=sharing",
      ],
    ],
  },
];
```

Checks for you:

- I assumed the fourth paper is the quantum survey. If you meant another quant paper, send its title and link.
- Change the line in the `ddpm-vol-hedging` README that says "submitted to NeurIPS 2026", since you have not submitted it. Recruiters read the README.
- Verify the "6 topics" number against the paper.
- For a cleaner link, move the quantum PDF into its own GitHub repo and use that URL instead of Drive.

### C2. Jobs (four, no REMOVED_COMPANY)

```js
jobs: [
  {
    id: "j-kat",
    co: "Khageshvara Aviation",
    role: "Product Development Lead and ML Intern",
    when: "May to Oct 2023",
    stoneText: "Drone vision that spots people",
    color: "#8fd0ff",
    bullets: [
      "Built CNN vision pipelines for real-time human detection from drones.",
      "Built the financial model and pitch behind a successful DST funding round.",
    ],
    impact: ["Real-time person detection from aerial video", "Funding secured"],
    skills: ["Computer vision", "CNNs", "OpenCV"],
  },
  {
    id: "j-grasim",
    co: "Grasim (Aditya Birla Group)",
    role: "Research Engineer",
    when: "May to Jul 2024",
    stoneText: "Railway track safety with sensors",
    color: "#ffc977",
    bullets: [
      "Designed 20+ PLC railway simulations for autonomous control and safety validation.",
      "Built IR and IoT sensor networks for real-time track monitoring.",
    ],
    impact: ["98% trespassing detection accuracy", "20+ simulations"],
    skills: ["IoT", "PLC", "Sensors"],
  },
  {
    id: "j-fidel",
    co: "FidelFolio Investments",
    role: "Quant Investment Analyst",
    when: "May to Jun 2025",
    stoneText: "Portfolio research, Sharpe up 42%",
    color: "#b9a6ff",
    bullets: [
      "Built a research workflow for portfolio analytics and Sharpe evaluation.",
      "Used genetic algorithms and Bayesian optimisation for risk-aware portfolios.",
      "Analysed 24 factors across 200+ portfolios.",
    ],
    impact: ["Sharpe up about 42%", "Research efficiency up 90%"],
    skills: [
      "Portfolio optimisation",
      "Factor models",
      "Bayesian optimisation",
    ],
  },
  {
    id: "j-nurix",
    co: "Nurix AI",
    role: "ML Engineering Intern",
    when: "Jul to Dec 2025",
    stoneText: "Speech AI in production",
    color: "#6ff0df",
    bullets: [
      "Built and deployed a TinyBERT voicemail detector with backend integration.",
      "Designed a word-error correction pipeline using Word2Vec, phonetic normalisation and LLM scoring.",
      "Improved real-time turn-end detection in a transformer speech-to-text pipeline.",
    ],
    impact: ["95% precision on voicemail detection", "40% fewer word errors"],
    skills: ["Transformers", "Speech", "Deployment", "NLP"],
  },
];
```

### C3. Project sites (show "Visit site" on the card front)

| Project                  | Site                                                 |
| ------------------------ | ---------------------------------------------------- |
| Retrieval vs Computation | https://adya6714.github.io/retrieval-vs-computation/ |
| Reading Without Looking  | https://adya6714.github.io/vlm-ocr-eval/             |
| OmniMesh                 | https://omnimesh-command.web.app                     |
| ContentPulse             | https://social-analyzer-six.vercel.app/              |
| Ganga MRV                | https://site-eight-khaki-34.vercel.app               |

The rest of the project data (19 repos, groups, one-liners, skills) stays as in `CURSOR_PLAN_v2.md` Part D3, with these changes:

- Add a `site` field and a `thumb` field to every project.
- Delete the REMOVED_COMPANY entry.
- Thumbnail fallback: `https://opengraph.githubassets.com/1/Adya6714/<repo>`.

### C4. Shelf

```js
shelf: {
  tabs: ["Skills", "Study module", "Watching and reading", "Practice", "Beyond ML"],
  skills: [
    ["LLMs and NLP", ["PyTorch", "Transformers", "LLM evaluation", "Probing and ablation", "LangChain", "Gemini API"]],
    ["Vision and documents", ["OpenCV", "OCR", "CNNs", "Document AI"]],
    ["Generative and RL", ["Diffusion models", "PPO", "vLLM"]],
    ["Classical ML and forecasting", ["XGBoost", "CatBoost", "scikit-learn", "Graph ML (Node2Vec)", "Anomaly detection"]],
    ["Systems", ["Python", "FastAPI", "Docker", "Kafka", "AWS", "GCP", "Firebase", "SQL", "TypeScript", "Kotlin"]],
    ["Quant", ["Portfolio optimisation", "Volatility modelling", "CVaR", "Backtesting"]]
  ],
  studyModule: { title: "My ML study book", description: "The notes, derivations and experiments I am writing for myself while learning ML properly.", url: "PASTE_SHARE_LINK", chapters: [] },
  watching: [ /* { videoId, title, by, type: "Video"|"Paper"|"Book"|"Blog", why, url } ; hide any item with an empty "why" */ ],
  practice: { leetcode: "", kaggle: "https://www.kaggle.com/adyasrivastava" },
  beyond: [
    { title: "Meraki", line: "Poems and short stories. An alleyway to sonder.", href: "writing.html", external: "https://srivastavadya.wixsite.com/meraki14" },
    { title: "Case studies", line: "Consulting and non-ML work.", href: "other.html" }
  ]
}

```

The study module link must be a share link. In Drive: right-click the folder or file, Share, General access, "Anyone with the link", Viewer, Copy link. The `drive.google.com/drive/home` address only opens your own Drive. The Kaggle handle comes from your old repo README. Check it is right.

### C5. Interview additions

- Delete every question and answer that mentions REMOVED_COMPANY or "removed role".
- Add to Start here: `re` "Is your research different from your engineering work?"
  - short: "They feed each other. Research is where I ask whether something really works and why. Engineering is where I make it work for someone. Most of my projects have a bit of both." (Rewrite in your own voice.)
- Add to Start here: `hack` "Do you take part in hackathons, and what resources would you recommend?"
  - short: you write this one.
- Intro text (exact): "Hi, I am the guardian of this river. Interview Adya through me: her research, internships, projects, skills, or what she is looking for next. I answer only from her own notes and papers."
- For every question add `paraphrases: []` with 3 to 5 alternative phrasings. Semantic search depends on these (Prompt D9 generates them).

---

## Part D. Cursor prompts, in order

### D0. Debug mode (do this first, it makes every later step easier)

> Add a `?debug=1` mode to the site. When active:
>
> - Draw a 50 px grid over the map with coordinate labels in map pixels (848 x 1264).
> - Show a tiny readout under the cursor with its map coordinates.
> - Make every `.ov` element draggable. On drop, log `{ id, left, top }` to the console and show it in a small copy-to-clipboard panel.
> - Add a "Stop jumper" with buttons 0 to 6.
>
> Acceptance: `?debug=1` shows the grid and coordinates; without the parameter nothing changes.

### D1. Content cleanup (quick win)

> 1. Search the whole repo (js, css, html, api, docs, tools, README, SITE_SPEC, CURSOR_PLAN files) for "REMOVED_COMPANY", "REMOVED", "founding", and "REMOVED_ROLE". Remove every occurrence, including from `content.js`, the guardian's scripted answers, the interview data, `api/kb.js`, the README and `Doc/`. Run `npm run kb` afterwards.
> 2. Replace `research` and `jobs` in `content.js` with Part C1 and C2 of this plan. Remove the old `papers`, `notes` and any "Draft", "Planned", "Survey", "Submitted", "NeurIPS" labels from the UI and data.
> 3. Delete the Skills stop from `STOPS`. Stops are now: hello, research, projects, path, shelf, interview, about (7 stops, indexes 0 to 6).
> 4. Remove all dash characters U+2014 and U+2013 from every file in the repo.
>
> Acceptance: `grep -ri "equi" .` returns nothing; `grep -rP "\x{2014}|\x{2013}" .` returns nothing outside `node_modules`.

### D2. Scroll feel, performance and crisp text

> Fix the feeling of resistance and the blurry text:
>
> 1. **Native scroll, no fighting.** Remove Lenis, the snap timer, and every `scrollTo` correction. Use native scrolling. Give `#track` one block per stop with `height: 130vh`. Scroll progress `f = scrollY / maxScroll * (N - 1)`.
> 2. **Damped camera.** Drive the camera with a critically damped spring on `f` (time constant 0.16 s), computed from the real frame delta. Each stop holds the camera still while `|f - i| < 0.3`; between stops interpolate centre linearly and zoom in log space with ease-in-out.
> 3. **Panels scroll.** Every scrollable element (`.panel`, `.sheet`, lists) gets `overflow-y: auto; overscroll-behavior: contain`. If a panel is taller than the viewport at 1366 x 768, shorten the content rather than letting it scroll, except in modals and the project index.
> 4. **Performance.**
>
> - Cap shader render scale at 1.5 x DPR and add adaptive resolution: if the average frame time stays above 20 ms for 1.5 s, reduce scale by 0.15 (minimum 0.75); recover when under 14 ms.
> - Remove `backdrop-filter` from panels (use a solid `rgba(5, 24, 28, 0.88)`). If any blur remains it must be 6 px or less and only on elements smaller than 400 x 300.
> - Cache every `getBoundingClientRect`; recompute only on resize and on stop change, never per frame.
> - Use only `transform` and `opacity` in animations; set `will-change` only during an animation.
> - Add `contain: layout paint` to panels.
> - Pause the render loop, fx canvas and CSS animations when the tab is hidden.
>
> 5. **Crisp text.** Stop scaling `#mapInner` with a CSS scale. For each map overlay, compute screen position as `translate3d((x - cam.x0) * k, (y - cam.y0) * k, 0)`, set its width and height to `w * k` and `h * k` in px, and set font sizes in real px (minimum 12 px). Remove `will-change: transform` from `#mapInner`.
> 6. **Skip link and keyboard.** Down, PageDown, Space go to the next stop; Up, PageUp to the previous; Home and End to the first and last, using a 700 ms eased scroll that cancels if the user wheel-scrolls.
>
> Acceptance:
>
> - A trackpad flick feels free, with no pulling back after you stop.
> - 55 fps or better at 1440 x 900 on a mid-range laptop (Chrome Performance panel).
> - Overlay text is sharp at every zoom.
> - Panels and lists scroll with wheel and touch.

### D3. Hover and interaction polish

> Replace the hover behaviour everywhere:
>
> - Remove the 3D tilt on cards and the `filter: brightness` or `drop-shadow` hover on large elements.
> - New hover for cards, notes, stones and buttons: `translateY(-3px)` plus a soft cyan box-shadow, 180 ms `cubic-bezier(.2, .7, .2, 1)`. No other effects.
> - Focus-visible gets the same lift plus a 2 px cyan ring.
> - Active (pressed) returns to `translateY(0)` in 80 ms.
> - Touch devices: no hover effects, only the pressed state.
>
> Acceptance: nothing jitters or flickers when the cursor crosses element edges; cards under other cards do not hover.

### D4. Stop 0: Hello, with the work constellation

> Rebuild the first stop from `content.js > person` (use the intro paragraphs already there, do not change my wording). **Layout (desktop):**
>
> - Left: a solid panel anchored at the vertical centre-left, max width 560 px. Name at 64 px, the two intro paragraphs at 18 px with line-height 1.65, then the "I'm open to" chips, then the buttons.
> - Right: a **work constellation** in front of the waterfall.
> - No photo on this stop.
>
> **Buttons:** "Take the 60 second tour" (primary), Resume, "Drop me a card" (opens the drawer from D10).
>
> **Work constellation** (an SVG, 460 x 420 px, glass-clear background, no box):
>
> - Six nodes, each a glowing dot with a label: Reasoning evaluation, Vision and documents, Generative models and RL, Quantum and quant, Agents and systems, Forecasting and data.
> - Node size is proportional to the number of projects or papers tagged with it.
> - Lines between related nodes: Reasoning to Vision (shared question: does the model use the evidence), Generative to Quant, Agents to Reasoning, Forecasting to Quant.
> - Idle: nodes drift slowly (3 px), lines pulse one at a time every 2 s.
> - Hover a node: it glows, connected lines brighten, and a tooltip shows one line, such as "1 paper and 1 project. Does the model compute or recall?".
> - Click a node: scroll to the Projects stop with that group filter on (or to Research for the first two).
> - Below the constellation, three counters that count up once when the stop first shows: "4 papers", "19 projects", "4 roles".
>
> **Mobile:** panel as a bottom sheet; the constellation shrinks to 300 px and sits above it.
>
> Acceptance: the name, both paragraphs and all buttons are visible without scrolling at 1366 x 768; the constellation is keyboard accessible (each node is a button); no photo and no old proof chips.

### D5. Stop 1: Research with four notes

> Rebuild this stop from `content.js > research` (four papers). **Left panel:**
>
> - Heading "Research" and one line: "Four papers, each starting from a question I could not stop thinking about."
> - Four stacked compact cards. Each: status badge, title (2 lines max), the question (1 line), and a "Read the story" link. Clicking a card opens the paper modal.
> - Order: Reasoning, Vision, Markets, Quantum.
>
> **On the map (right of the river, upper pool):** four **post-it notes in a 2 x 2 grid**, one container anchored at map position (545, 300), each note the same size (190 x 120 map px), 14 px gap, rotated by alternating -2 and 2 degrees, each a different pastel (amber, mint, lilac, sky), with a tiny pin at the top.
>
> - Each note shows: the tag in small bold letters, the `note.what` sentence, and the `note.headline` in large type with its caption below.
> - Notes are real buttons. Hover on a note highlights its card in the left panel; hover on a card highlights its note. Clicking either opens the paper modal.
> - Remove the old three scrolls and any other floating notes.
>
> **Paper modal:** title, status badge, "The question", "What I did", "What I found" (bullets), "What's next", then link buttons from `links`. If `builtFrom` exists show a chip "Built from it: <repo>" linking to the repo.
>
> Acceptance: all four notes visible and fully readable at the Research stop on 1366 x 768 and 390 x 844; no "Draft", "Planned", "Survey" or NeurIPS text; notes do not overlap each other or the panel.

### D6. Stop 2: Projects as a circular slider

> Replace the project strip with a **3D ring carousel** (`ProjectRing`).
>
> - Cards are arranged on a ring using CSS 3D (`perspective: 1400px`, each card `rotateY(i * 360 / n) translateZ(radius)`). Radius 420 px, card size 260 x 340 px, the ring tilted `rotateX(-6deg)`.
> - Rotate by dragging (pointer events with inertia), left and right arrow buttons, keyboard arrows, and a slow auto-rotate that stops on first interaction.
> - The front card is "active": full opacity, a cyan glow. Back cards are 35% opacity.
> - Clicking a side card rotates it to the front; clicking the active card opens the project modal.
> - Place the ring at the bottom-centre of the screen, partly overlapping the bottom edge, so the rapids stay visible above it.
> - Filter chips above the ring: All, AI systems, Forecasting and data, Research code, Products and platforms, Early work. Changing a filter re-lays out the ring with a 500 ms transition.
> - **Card front:**
>   - thumbnail (`project.thumb`, else the GitHub preview image `https://opengraph.githubassets.com/1/Adya6714/<repo>`, else a gradient),
>   - title,
>   - one plain-language line,
>   - three skill chips,
>   - a button row: **Visit site** (primary, only if `site` exists), **Code**, and **Paper** (only if it exists).
>   - Buttons must work without opening the modal.
> - A "See all as a list" button opens a full-screen searchable grid overlay.
> - When a research-related project is active, its matching research note on the map gets a soft pulse. When a project is active, a lantern in the rapids pulses.
> - **Mobile:** replace the 3D ring with a horizontal scroll-snap carousel of the same cards.
> - Remove the old strip, the three on-map project cards, and any bottom panel for this stop.
>
> Acceptance: all 19 projects reachable; each card with a live site shows "Visit site" on its front; the ring works with mouse, touch and keyboard; nothing sits under the left panel.

### D7. Stop 3: Path of stepping stones

> Rebuild experience as a stone path from `content.js > jobs` (four jobs).
>
> - **Map:** place four stones along the glowing path on the right bank, oldest at the bottom to newest at the top (start with Khageshvara at (680, 735), Grasim (715, 640), FidelFolio (700, 520), Nurix (690, 410); then a fifth stone "What's next" at (650, 320). Use `?debug=1` to nudge them onto the painted path).
> - **Stone:** a rounded rock (CSS gradient and inner shadow) about 130 x 70 map px. On it, `stoneText` in 13 px bold, and `co` and year below in 11 px. No letters or flags.
> - **Path:** an SVG dashed glowing line through the stones whose dashes flow forward. When the stop becomes active, a firefly travels along it.
> - **Click a stone:** the stone grows into a deep-dive card (FLIP animation from the stone's rectangle to a 560 x auto card, anchored right-centre). The card shows role, dates, "What I built" bullets, "Impact" as big numbers, skill chips, and a "Next stone" button. Esc, a close button, or a click outside shrinks it back.
> - The "What's next" stone opens the Drop me a card drawer.
> - **Left panel:** title "The path so far", sub-line "Follow the stones from 2023 to now. Tap one for the full story.", and a counter "0 of 4 opened" that updates. When all four are opened, show a small line: "That is the whole path. Questions? Ask the guardian."
> - Remove the old arch banners with initials and the name tags.
>
> Acceptance: all five stones visible at once; text on stones readable; each deep-dive opens and closes smoothly and traps focus.

### D8. Stop 4: Shelf (with Skills)

> Rebuild this stop as a tabbed panel (right side) from `content.js > shelf`. Tabs: Skills, Study module, Watching and reading, Practice, Beyond ML.
>
> - **Skills:** the six rows, chips only, hover shows "Used in:". Must fit without scrolling at 1366 x 768.
> - **Study module:** a featured card (cover drawn in CSS, title, description, chapter list if any, and "Open study module" linking to `studyModule.url`). If the URL is the placeholder, show "Link coming soon".
> - **Watching and reading:** YouTube-style cards. Video items use `https://img.youtube.com/vi/<videoId>/hqdefault.jpg`; papers, books and blogs use a gradient with the type. Each has a "Why I recommend it" line. Items with an empty `why` are hidden. Clicking a video opens a lightbox with `youtube-nocookie.com/embed/<id>`.
> - **Practice:** cards for LeetCode and Kaggle, shown only when the URL exists.
> - **Beyond ML:** two cards: Meraki (poems) and Case studies, linking to `writing.html` and `other.html`, each with a small "Opens in this site" note.
> - On the map, the shelf prop (study book plus mini thumbnails) sits on the left rocks and is clickable to select the Study module tab.
> - Delete the separate Skills stop code, `library.html`, the Library tab in the top bar, and every crystal label overlay. Keep the crystal glow (a soft radial gradient) which brightens when the Skills tab is open.
>
> Acceptance: no Skills stop; no Library page; every tab fits without inner scrolling except the watching list; nothing from Meraki appears on the river.

### D9. Stop 5: Interview room, semantic matching and the guardian rising

> **Panel (left):**
>
> - Intro text exactly: "Hi, I am the guardian of this river. Interview Adya through me: her research, internships, projects, skills, or what she is looking for next. I answer only from her own notes and papers."
> - A prominent input at the top: "Ask anything about Adya's work".
> - Track chips under it: Start here, Projects, Research, Behavioural, Hard questions, each with up to 5 visible questions and "More" pagination.
> - Answer view: matched question, short answer, "Go deeper" expander, "What you might challenge" if present, and "You might ask next" chips. A Back button returns to the list.
> - Remove the speech bubble overlay on the map, the fine-print line, and any duplicate question lists.
>
> **Semantic matching (phase 1, runs in the browser, works on GitHub Pages):**
>
> 1. Add `tools/embed_faq.mjs` using `@huggingface/transformers` with `Xenova/all-MiniLM-L6-v2` (quantized). For every question, embed the question and each paraphrase. Write normalised vectors (rounded to 4 decimals) to `assets/interview_embeddings.json`. Add an npm script `npm run embed`.
> 2. In the site, lazy-load the same model (from jsDelivr) when the input is first focused or when the stop becomes active and the browser is idle. Show "Guardian is waking up" while loading. Cache it.
> 3. On submit, embed the question and compute cosine similarity to all stored vectors.
>
> - Score 0.55 or higher: show that question's answer and say "I think you are asking: <question>".
> - Score 0.40 to 0.55: show "Closest questions" as three chips.
> - Below 0.40: use the phase 2 fallback.
>
> 4. Also generate 3 to 5 paraphrases per question automatically (write them to `content.js` for me to review).
>
> **Phase 2 fallback (AI, for open questions):** create `worker/guardian.js`, a Cloudflare Worker with the same logic as `api/ask.js` (Claude Haiku, system prompt from `api/kb.js`, answers under 120 words, never invents facts, ends with "SOURCE: <section>"), rate limited to 20 questions per IP per hour, CORS only for `https://adya6714.github.io`. Add setup steps to the README (wrangler, `ANTHROPIC_API_KEY` as a secret). Set `GUARDIAN_API` in `config.js`. If it is empty or fails, show: "I do not have that in Adya's notes. You can email her at srivastavadya@gmail.com." The API key must never appear in browser code.
>
> **The guardian rises (runs when a question is submitted):**
>
> 1. The statue overlay (`data-guardian`) rises 14 px and scales to 1.06 over 600 ms (`cubic-bezier(.2, 1.4, .4, 1)`), runes glow.
> 2. A **light pulse** expands from the statue across the whole screen: a radial gradient overlay with `mix-blend-mode: screen`, 1.1 s, opacity 0.5 to 0.
> 3. In the water shader add a `uPulse` uniform (seconds since the question) that draws a travelling bright ring from the statue's map position across the water and gently lifts the plate brightness.
> 4. Fireflies swarm to the statue, then orbit for 2 s.
> 5. While the answer streams, the eyes breathe and the runes flicker in time with the text. When it ends everything settles in 600 ms.
> 6. Reduced motion: only the eye glow.
>
> Acceptance: typing "why did you build the OCR model" returns the OCR from-scratch question; a nonsense question falls back politely; the pulse is visible on the water and the screen; no REMOVED_COMPANY anywhere in the answers.

### D10. Stop 6: About, and Drop me a card as its own feature

> **About stop (keep my words):**
>
> - Left panel anchored low, bottom at 6vh, so the pool and ripples show above it.
> - Photo: `assets/photo.jpg` as a rounded square, 140 px, with `loading="eager"`. If it fails to load, show initials and log `console.warn("photo missing")`.
> - Heading "At the core, I like making things." and the two closing paragraphs from `person.closing`, then buttons: Resume, Email, GitHub, LinkedIn, OpenReview.
> - The photo appears nowhere else on the site.
> - Delete the old `.footcard` and any second box behind this panel.
>
> **Photo checklist:** confirm the file is committed at `assets/photo.jpg` (lowercase, GitHub Pages is case sensitive), at least 600 x 600, under 250 KB; `PHOTO_URL` in `config.js` is set to `assets/photo.jpg`.
>
> **Drop me a card (a separate feature):**
>
> 1. **Right-edge toggle:** a fixed vertical tab on the right edge, vertically at 60 percent of the screen, 56 px wide and 200 px tall, an envelope icon and the text "Drop me a card" rotated. Hover slides it out 12 px. It gives one small wiggle after the visitor reaches the Projects stop. Click opens a right drawer (520 px or 92vw on mobile) with the full form. Hide this tab on the final stop.
> 2. **At the final stop:** a large, separate panel on the **right** side of the pool (520 px wide), not inside the About panel. Same form and animation.
> 3. **Look:** a cream paper card, slightly rotated, on the left of the form; a wooden post box on the right.
> 4. **Fields:** message (required, placeholder "A suggestion, a resource, a hackathon idea, or just hello"); type chips: Suggestion, Resource, Hackathon, Opportunity, Just hello; name and email (optional); an **Anonymous** toggle that clears and hides name and email.
> 5. **Heading:** "Drop me a card". Sub-line: "Ideas I should explore, resources I should read, a hackathon you want a teammate for, or anything you think I should know. Anonymous is fine."
> 6. **Animation on submit:** the card lifts and tilts, slides into the slot (700 ms), the flap closes, a "Received" stamp appears, leaves drift out, then a thank-you line.
> 7. **Delivery:** POST to `SITE_CONFIG.SUGGESTION_ENDPOINT` (a Formspree form that emails me). Include a hidden honeypot and a 10 second minimum between submits. If the endpoint is missing, fall back to `mailto:srivastavadya@gmail.com`.
>
> Acceptance: photo shows at the end only; the card box is the largest element on the right at the final stop; the edge tab is visible at every other stop and opens the drawer; a test submission arrives in my inbox.

### D11. Realism pass

> Make the scene feel more real without changing its painted style:
>
> 1. **Foreground parallax:** cut 3 or 4 foreground foliage pieces (leaves and a branch) with transparent backgrounds from the left and right edges of the 4x plate (use `rembg`). Place them at the screen edges in a layer above the map that moves at 1.3 x the camera speed, with a 2 px blur, and a slow sway (rotate +-1.2 degrees, 6 s).
> 2. **Real waterfall in the hero:** use a free tripod-shot waterfall clip (Pexels or Pixabay, check the licence; a loop of 6 to 10 s, 720p, under 6 MB, muted). Upload each video frame as a texture, and in the shader blend it over the plate inside a new `waterfall_mask.png` (white where the fall is, soft edges) with `mix(plate, grade(video), mask * 0.85)`. Grade it to the teal palette and add the existing foam on top. Desktop only; mobile and reduced motion use the painted fall. If no clip fits, skip this step.
> 3. **Water:** add reflections in the lower pool by sampling the plate mirrored around the bank line with a small normal-map style distortion; add sun or moon specular glints that follow the camera.
> 4. **Atmosphere:** depth haze (lighter and bluer farther up the map), animated light shafts through the canopy (additive, low opacity, slow noise), floating dust motes in the fx canvas.
> 5. **Depth of field:** at high zoom, apply a small mip bias to the plate toward the screen edges.
> 6. **Camera breathing:** a 2 px, 8 s sinusoidal drift.
> 7. **Ambient sound:** a speaker toggle in the top bar, off by default, that plays a looping water ambience (CC0 source) at low volume with a 1 s fade. Never autoplay.
>
> Acceptance: no visible seam around the video; frame rate stays above 50 fps; everything is skipped in Calm mode.

### D12. Mystic night mode

> Add a **Night** mode:
>
> - A moon button in the top bar toggles Dusk and Night. Default by local time (Night from 7 pm to 5 am). Save the choice in `localStorage`. Transition 1.2 s.
> - A `uNight` shader uniform (0 to 1): cooler colour grade (multiply by vec3(0.55, 0.7, 0.95)), a stronger vignette, a blue-violet rim on water edges, brighter crystals, glowing path line and statue eyes.
> - 10 bioluminescent mushroom and fern glows on the banks (soft radial sprites at map positions found with `?debug=1`), pulsing slowly at random phases.
> - Moon shafts from the top left, fog drifting (two large soft noise layers at 0.12 opacity), fireflies increase from 16 to 40 with violet and cyan tints.
> - The UI panels gain a faint cyan border glow at night.
>
> Acceptance: switching is smooth; text contrast stays at 4.5:1 or better in both modes; Night costs under 2 ms extra per frame.

### D13. Feed the koi

> Add a small game in the calm lower pool (map area x 80 to 760, y 1000 to 1190):
>
> - 6 koi (orange, white, gold) swimming slowly in loose circles, drawn on the fx canvas in map space (a smooth body with a wiggling tail, no sprites).
> - Clicking or tapping the pool drops a food pellet (a small floating dot with a ripple). Nearby fish steer toward the nearest pellet, eat it with a small ripple, and scatter slightly.
> - A subtle label "Feed the koi" near the pool and a counter "Fed: 0".
> - At 10 feeds, the fish swim in one circle around the statue direction once, and a toast says "They like you."
> - The koi are visible only at the final stop. Reduced motion: static fish, no movement.
> - Do not let the click also trigger ripples twice.
>
> Acceptance: runs at 60 fps with 6 fish and up to 5 pellets; no fish leave the pool.

### D14. Make people go through the whole site

> Add these navigation and engagement features:
>
> 1. **Guided tour:** hero button "Take the 60 second tour". It auto-advances through the 7 stops, about 8 seconds each, with a one-line caption in the guardian's voice (store in `content.js > tour`). A progress bar, pause, skip and exit buttons; any manual scroll exits the tour.
> 2. **Next button:** a bottom-centre button on every stop: "Next: <stop name>" with an animated chevron. On the last stop it says "Back to the waterfall".
> 3. **River progress map (right edge):** a filled line with seven dots, labelled on hover, the current one glowing and visited ones ticked. Under it a small counter "Explored 3 of 7".
> 4. **Deep links:** update the URL hash (`#research`, `#projects`, `#path`, `#shelf`, `#interview`, `#about`) as the stop changes with `history.replaceState`, and scroll to the hash on load, so I can link straight to a stop from LinkedIn.
> 5. **Completion moment:** when all seven stops have been visited, the guardian's eyes flash and a toast says "You followed the whole river. Want to leave a card?" with a button that opens the card drawer.
> 6. **Quick view (60 second version):** a top bar link opens an overlay with everything important on one screen: four papers with links, six featured projects with links, four roles, resume button, contact. For visitors who will not scroll.
> 7. **Peek:** at the bottom edge of each stop, show a faint label of the next stop.
> 8. **Optional analytics:** add one GoatCounter (privacy friendly) script, with an event per stop reached, so I can see where people leave.
>
> Acceptance: someone who only clicks "Next" visits every stop in under 90 seconds; hash links work on load; quick view needs no scrolling at 1440 x 900.

### D15. Final QA

> - Test every stop at 1440 x 900, 1366 x 768 and 390 x 844.
> - Lighthouse mobile and desktop: fix image caching, font loading (`font-display: swap`), alt text, tap targets, focus order.
> - `grep` for em dashes, en dashes, "REMOVED_COMPANY", "slip", "chute", "Draft", "NeurIPS", "Planned".
> - Delete unused CSS and JS (`.footcard`, old crystal labels, `.bubble`, `.tag`, library page).
> - Update the README: stops, config, how to add a project, how to regenerate embeddings and `kb.js`, how to deploy the Worker.
> - Confirm Resume downloads, all external links work, the card form submits.

---

## Part E. Assets and accounts you need

| Item                                                                    | Where it goes                       |
| ----------------------------------------------------------------------- | ----------------------------------- |
| Your photo (square, 600 px or more)                                     | `assets/photo.jpg`                  |
| Latest resume PDF with the right paper title                            | `assets/Resume_Adya_Srivastava.pdf` |
| Study module share link                                                 | `shelf.studyModule.url`             |
| LeetCode URL (optional)                                                 | `shelf.practice.leetcode`           |
| 6 to 12 videos, papers or books you recommend, each with one "why" line | `shelf.watching`                    |
| Formspree form (free)                                                   | `SUGGESTION_ENDPOINT`               |
| Cloudflare account (free) for the guardian worker                       | `GUARDIAN_API`                      |
| A waterfall video clip (optional, for D11)                              | `assets/scene/waterfall.mp4`        |
| A CC0 water ambience loop (optional)                                    | `assets/sound/water.mp3`            |
| Fix the NeurIPS line in the `ddpm-vol-hedging` README                   | GitHub                              |
| Fourth paper title if it is not the quantum survey                      | `research`                          |

---

## Part F. Order of work

1. D0 and D1 (debug tool and content cleanup, about 30 minutes)
2. D2 and D3 (scroll and hover, the biggest feel improvement)
3. D4 and D10 (first and last impressions)
4. D5, D6, D7, D8 (the middle of the story)
5. D9 (interview room)
6. D14 (keep people moving through the site)
7. D11, D12, D13 (realism, mood, play)
8. D15 (QA)
