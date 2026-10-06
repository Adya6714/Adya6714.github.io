(() => {
"use strict";
const C = window.CONTENT, CFG = window.SITE_CONFIG || {}, A = window.ASSETS || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const mk = h => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const MAP_W = 848, MAP_H = 1264;

/* ---------- journey stops: focus box (map px) + panel side ---------- */
const STOPS = [
  { id: "hello",     label: "Hello",     panel: "left",   box: [230, 0, 640, 300],     mbox: [230, 0, 640, 300] },
  { id: "research",  label: "Research",  panel: "left",   box: [270, 280, 545, 500],   mbox: [270, 280, 545, 500] },
  { id: "projects",  label: "Projects",  panel: "bottom", box: [260, 470, 700, 820],   mbox: [260, 470, 700, 820] },
  { id: "path",      label: "Path",      panel: "right",  box: [600, 260, 848, 740],   mbox: [600, 260, 848, 740] },
  { id: "shelf",     label: "Shelf",     panel: "right",  box: [20, 700, 380, 900],    mbox: [20, 700, 380, 900] },
  { id: "interview", label: "Ask",       panel: "left",   box: [330, 800, 640, 990],   mbox: [330, 800, 640, 990] },
  { id: "card",      label: "About",     panel: "center", box: [150, 980, 760, 1264],  mbox: [150, 980, 760, 1264] }
];
const N = STOPS.length;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const easeInOut = t => smoothstep(0, 1, t);
const ytId = u => { const m = String(u).match(/(?:youtu\.be\/|v=)([\w-]{11})/); return m ? m[1] : null; };

/* ---------- panels ---------- */
const P = C.person;
const resumeBtn = (cls = "btn primary") => `<a class="${cls} resume" href="#" download>Resume</a>`;
function heroPanel() {
  const paras = P.intro || P.aboutIntro || [];
  const intro = paras.map(p => `<p class="hello-p">${esc(p)}</p>`).join("");
  const openTo = (P.openTo || []).map(t => `<span class="chip c">${esc(t)}</span>`).join("");
  return `<h1 class="hello-name">${esc(P.name)}</h1>
  <div class="hello-intro">${intro}</div>
  <p class="hello-open-label">I'm open to</p>
  <div class="chips hello-open">${openTo}</div>
  <div class="row hello-actions">
    <button type="button" class="btn primary" data-tour>Take the 60 second tour</button>
    ${resumeBtn("btn")}
    <button type="button" class="btn" data-drop-card>Drop me a card</button>
  </div>`;
}
function researchTag(r) { return r.tag || r.label || ""; }
function researchHeadline(r) { return (r.note && r.note.headline) || r.headline || ""; }
function researchCaption(r) { return (r.note && r.note.caption) || r.headlineCaption || ""; }
function researchPanel() {
  const order = ["r-reasoning", "r-vision", "r-markets", "r-quantum"];
  const byId = Object.fromEntries((C.research || []).map(r => [r.id, r]));
  const threads = order.map(id => byId[id]).filter(Boolean);
  const cards = threads.map(r => {
    const status = r.status || "";
    const badgeClass = /CAISc/i.test(status) ? "published" : "preprint";
    return `<article class="thread-card" data-research="${esc(r.id)}" tabindex="0">
      <div class="thread-top"><span class="badge ${badgeClass}">${esc(status)}</span></div>
      <h3 class="thread-title">${esc(r.title)}</h3>
      <p class="thread-q">${esc(r.question)}</p>
      <button type="button" class="linkish" data-research-story="${esc(r.id)}">Read the story</button>
    </article>`;
  }).join("");
  return `<h2>Research</h2>
  <p class="sub research-sub">Four papers, each starting from a question I could not stop thinking about.</p>
  <div class="thread-stack">${cards}</div>`;
}
const PROJECT_FILTERS = ["All", "AI systems", "Forecasting and data", "Research code", "Products and platforms", "Early work"];
function projectSkills(p) { return p.skills || p.chips || []; }
function projectLinkPairs(p) {
  const L = p.links;
  if (!L) return [];
  if (Array.isArray(L)) return L;
  const out = [];
  if (L.live) out.push(["Live", L.live]);
  if (L.code) out.push(["Code", L.code]);
  if (L.paper) out.push(["Paper", L.paper]);
  if (L.site) out.push(["Site", L.site]);
  return out;
}
function projectBtns(p, sm = true) {
  const pairs = projectLinkPairs(p);
  const cls = sm ? "btn sm" : "btn";
  if (!pairs.length) return p.private ? `<span class="chip warm">Private</span>` : "";
  return pairs.map(([l, u]) => `<a class="${cls}" href="${esc(u)}" target="_blank" rel="noopener" data-stop-prop>${esc(l)}</a>`).join("");
}
function projectThumb(p) {
  if (p.thumb) return p.thumb;
  const code = p.links && p.links.code;
  const m = code && String(code).match(/github\.com\/Adya6714\/([^/#?]+)/);
  if (m) return `https://opengraph.githubassets.com/1/Adya6714/${m[1]}`;
  return "";
}
function projectCardHTML(p) {
  const chips = projectSkills(p).slice(0, 3).map(c => `<span class="chip">${esc(c)}</span>`).join("");
  const thumb = projectThumb(p);
  const site = p.site || (p.links && p.links.live) || "";
  const code = p.links && p.links.code;
  const paper = p.links && p.links.paper;
  const actions = [
    site ? `<a class="btn sm primary" href="${esc(site)}" target="_blank" rel="noopener" data-stop-prop>Visit site</a>` : "",
    code ? `<a class="btn sm" href="${esc(code)}" target="_blank" rel="noopener" data-stop-prop>Code</a>` : "",
    paper ? `<a class="btn sm" href="${esc(paper)}" target="_blank" rel="noopener" data-stop-prop>Paper</a>` : ""
  ].filter(Boolean).join("");
  return `<article class="ring-card" data-proj="${esc(p.id)}" data-group="${esc(p.group || "")}" tabindex="0">
    <div class="ring-thumb" style="${thumb ? `background-image:url('${esc(thumb)}')` : ""}"></div>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.line)}</p>
    <div class="chips">${chips}</div>
    <div class="row ring-actions">${actions}</div>
  </article>`;
}
function projectsPanel() {
  const filters = PROJECT_FILTERS.map((g, i) => `<button type="button" class="proj-filter ring-filter" data-ring-filter="${esc(g)}" aria-pressed="${i === 0}">${esc(g)}</button>`).join("");
  return `<div class="proj-ring-bar">
    <div><h2>Projects</h2><p class="sub">${C.projects.length} builds on the river</p></div>
    <div class="proj-filters" role="group" aria-label="Filter projects">${filters}</div>
    <button type="button" class="btn sm" data-project-index>See all as a list</button>
  </div>`;
}
function mountProjectIndex() {
  const filters = PROJECT_FILTERS.map((g, i) => `<button type="button" class="proj-filter" data-pf="${esc(g)}" aria-pressed="${i === 0}">${esc(g)}</button>`).join("");
  const grid = C.projects.map(p => {
    const chips = projectSkills(p).slice(0, 4).map(c => `<span class="chip">${esc(c)}</span>`).join("");
    const priv = p.private ? `<span class="chip warm">Private</span>` : "";
    return `<button type="button" class="proj-index-card" data-proj="${esc(p.id)}" data-group="${esc(p.group || "")}" data-search="${esc((p.title + " " + p.line + " " + projectSkills(p).join(" ")).toLowerCase())}">
      <span class="proj-index-group">${esc(p.group || "")}</span>
      <strong>${esc(p.title)}</strong>
      <span class="proj-index-line">${esc(p.line)}</span>
      <span class="chips">${chips}${priv}</span>
    </button>`;
  }).join("");
  const el = mk(`<div class="proj-index" id="projIndex" hidden>
    <div class="proj-index-sheet" data-lenis-prevent>
      <header class="proj-index-bar">
        <div><h2 id="projIndexTitle">All projects</h2><p class="sub">${C.projects.length} repos</p></div>
        <button type="button" class="btn sm" id="projIndexClose" aria-label="Close">Close</button>
      </header>
      <div class="proj-index-tools">
        <input type="search" id="projIndexSearch" placeholder="Search projects…" aria-label="Search projects" autocomplete="off">
        <div class="proj-filters" role="group" aria-label="Filter projects">${filters}</div>
      </div>
      <div class="proj-index-grid" id="projIndexGrid">${grid}</div>
    </div>
  </div>`);
  document.body.appendChild(el);
}
function jobBullets(j) { return j.bullets || j.pts || []; }
function expPanel() {
  return `<h2>The path so far</h2>
  <p class="sub path-sub">Follow the stones from 2023 to now. Tap one for the full story.</p>
  <p class="path-progress" id="pathProgress"><span id="pathOpened">0</span> of ${C.jobs.length} opened</p>
  <p class="path-done" id="pathDone" hidden>That is the whole path. Questions? Ask the guardian.</p>`;
}
function skillsPanel() {
  return `<h2>Skills</h2>
  <p class="sub skills-sub">Hover a row to light the matching crystal.</p>
  <div class="skills" id="skillsGrid">${C.skills.map(([g, items], i) =>
    `<div class="skrow" data-skill="${i}" tabindex="0">
      <span class="sklabel">${esc(g)}</span>
      <div class="chips">${items.map(n => `<span class="chip">${esc(n)}</span>`).join("")}</div>
    </div>`
  ).join("")}</div>
  <p class="skills-lib"><a class="linkish" href="library.html">Visit the library</a></p>`;
}
const GRADS = [["#0b3a4a", "#2a1b5c"], ["#0b4a3f", "#143a63"], ["#3b1f5c", "#0b3a4a"], ["#5c3b1f", "#0b3a4a"], ["#1f4a5c", "#0b2f2a"], ["#0b4a3f", "#4a1f5c"]];
const PLAY = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 4l14 8-14 8z"/></svg>';
function shelfPanel() {
  const S = C.shelf || {};
  const skills = S.skills || C.skills || [];
  const study = S.studyModule || {};
  const watching = (S.watching || []).filter(w => w.why);
  const practice = S.practice || {};
  const beyond = S.beyond || [];
  const tabs = (S.tabs || ["Skills", "Study module", "Watching and reading", "Practice", "Beyond ML"])
    .map((name, i) => `<button type="button" class="shelf-tab" data-shelf-tab="${i}" aria-selected="${i === 0}">${esc(name)}</button>`).join("");
  const skillRows = skills.map(([g, items], i) =>
    `<div class="skrow" data-skill="${i}" tabindex="0"><span class="sklabel">${esc(g)}</span><div class="chips">${items.map(n => `<span class="chip">${esc(n)}</span>`).join("")}</div></div>`
  ).join("");
  const studyUrl = study.url || "";
  const studyBtn = studyUrl && studyUrl !== "PASTE_SHARE_LINK"
    ? `<a class="btn primary" href="${esc(studyUrl)}" target="_blank" rel="noopener">Open study module</a>`
    : `<span class="chip warm">Link coming soon</span>`;
  const watchCards = watching.map(w => {
    const isVid = w.type === "Video" && w.videoId;
    const thumb = isVid
      ? `style="background-image:url('https://img.youtube.com/vi/${esc(w.videoId)}/hqdefault.jpg')"`
      : `data-type="${esc(w.type || "Paper")}"`;
    const open = isVid
      ? `data-yt="${esc(w.videoId)}"`
      : `href="${esc(w.url || "#")}" target="_blank" rel="noopener"`;
    const tag = isVid ? "button" : "a";
    return `<${tag} class="watch-card" ${open} ${thumb}>
      <span class="watch-type">${esc(w.type || "")}</span>
      <strong>${esc(w.title)}</strong>
      <span class="watch-by">${esc(w.by || "")}</span>
      <span class="watch-why">Why I recommend it: ${esc(w.why)}</span>
    </${tag}>`;
  }).join("");
  const practiceCards = [
    practice.leetcode ? `<a class="practice-card" href="${esc(practice.leetcode)}" target="_blank" rel="noopener"><strong>LeetCode</strong><span>Profile</span></a>` : "",
    practice.kaggle ? `<a class="practice-card" href="${esc(practice.kaggle)}" target="_blank" rel="noopener"><strong>Kaggle</strong><span>Profile</span></a>` : ""
  ].filter(Boolean).join("") || `<p class="sub">Add LeetCode or Kaggle links in content when ready.</p>`;
  const beyondCards = beyond.map(b =>
    `<a class="beyond-card" href="${esc(b.href)}" ${b.external ? "" : ""}>
      <strong>${esc(b.title)}</strong>
      <span>${esc(b.line)}</span>
      <em>Opens in this site</em>
    </a>`
  ).join("");
  return `<h2>Shelf</h2>
  <div class="shelf-tabs" role="tablist">${tabs}</div>
  <div class="shelf-panels">
    <div class="shelf-pane on" data-shelf-pane="0" role="tabpanel">${skillRows}</div>
    <div class="shelf-pane" data-shelf-pane="1" role="tabpanel" hidden>
      <div class="study-cover"><b>${esc(study.title || "Study module")}</b></div>
      <p>${esc(study.description || "")}</p>
      ${(study.chapters || []).length ? `<ul class="study-chapters">${study.chapters.map(c => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
      ${studyBtn}
    </div>
    <div class="shelf-pane" data-shelf-pane="2" role="tabpanel" hidden><div class="watch-grid">${watchCards}</div></div>
    <div class="shelf-pane" data-shelf-pane="3" role="tabpanel" hidden><div class="practice-grid">${practiceCards}</div></div>
    <div class="shelf-pane" data-shelf-pane="4" role="tabpanel" hidden><div class="beyond-grid">${beyondCards}</div></div>
  </div>`;
}
function guardianPanel() {
  const IV = C.interview || {};
  const tracks = IV.tracks || [];
  const tabs = tracks.map((t, i) =>
    `<button type="button" class="ask-tab${i === 0 ? " on" : ""}" role="tab" data-iv-track="${esc(t.id)}" aria-selected="${i === 0}">${esc(t.name)}</button>`
  ).join("");
  return `<h2>Interview room</h2>
  <p class="sub iv-intro">${esc(IV.intro || "")}</p>
  <div class="ask-tabs" role="tablist" aria-label="Interview tracks">${tabs}</div>
  <div id="ivBrowse" class="ask-browse"></div>
  <div id="ivAnswer" class="ask-answer" hidden></div>
  <form class="iv-free" id="ivFreeForm">
    <label class="iv-free-label" for="ivFreeIn">Ask your own question</label>
    <div class="iv-free-row">
      <input id="ivFreeIn" type="text" placeholder="Ask about research, projects, internships…" autocomplete="off" aria-label="Ask your own question">
      <button class="btn primary sm" type="submit">Ask</button>
    </div>
    <div id="ivFreeHits" class="iv-free-hits" hidden></div>
  </form>`;
}
function dropCardHTML() {
  const S = C.suggest || {};
  const types = (S.types || ["Suggestion", "Resource", "Hackathon", "Opportunity", "Just saying hi"])
    .map((t, i) => `<button type="button" class="card-type${i === 0 ? " on" : ""}" data-card-type="${esc(t)}" aria-pressed="${i === 0}">${esc(t)}</button>`).join("");
  return `<section class="drop-card" id="dropCard" aria-labelledby="dropCardTitle">
    <header class="drop-card-head">
      <h2 id="dropCardTitle">${esc(S.title || "Drop me a card")}</h2>
      <p class="drop-card-sub">${esc(S.blurb || "")}</p>
    </header>
    <div class="drop-card-stage" id="dropCardStage">
      <form class="drop-paper" id="dropForm" novalidate>
        <label class="sr-only" for="dropMsg">Your message</label>
        <textarea id="dropMsg" name="message" rows="5" maxlength="1200" required placeholder="${esc(S.placeholder || "")}"></textarea>
        <div class="card-types" role="group" aria-label="Type of note">${types}</div>
        <input type="hidden" name="type" id="dropType" value="${esc((S.types || ["Suggestion"])[0])}">
        <label class="card-anon"><input type="checkbox" id="dropAnon" checked> Anonymous</label>
        <div class="card-identity" id="dropIdentity" hidden>
          <input id="dropName" name="name" type="text" maxlength="80" placeholder="Name (optional)" autocomplete="name">
          <input id="dropEmail" name="email" type="email" maxlength="120" placeholder="Email (optional)" autocomplete="email">
        </div>
        <input class="card-hp" type="text" name="_gotcha" id="dropHp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn primary" type="submit" id="dropSend">${esc(S.sendLabel || "Send card")}</button>
        <p class="fine" id="dropStatus" role="status"></p>
      </form>
      <div class="drop-postbox" id="dropPostbox" aria-hidden="true">
        <div class="postbox-roof"></div>
        <div class="postbox-body">
          <div class="postbox-flap" id="dropFlap"></div>
          <div class="postbox-slot"></div>
          <div class="postbox-door"></div>
        </div>
        <div class="postbox-post"></div>
        <div class="postbox-stamp" id="dropStamp" hidden>Received</div>
        <div class="postbox-leaves" id="dropLeaves" aria-hidden="true"></div>
      </div>
      <div class="drop-fly" id="dropFly" hidden aria-hidden="true"></div>
    </div>
    <div class="drop-thanks" id="dropThanks" hidden>
      <p id="dropThanksMsg"></p>
      <button type="button" class="btn sm" id="dropAgain">Write another</button>
    </div>
  </section>`;
}
function aboutPanel() {
  const src = P.photo || CFG.PHOTO_URL || "assets/photo.jpg";
  const initials = (P.name || "AS").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const photo = `<img class="about-photo" src="${esc(src)}" alt="${esc(P.name)}" width="140" height="140" loading="eager" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'about-photo placeholder',textContent:'${esc(initials)}'}));console.warn('photo missing');">`;
  const core = (P.closing || []).map(p => `<p class="about-p">${esc(p)}</p>`).join("");
  return `<div class="about-main">
    <div class="about-head">${photo}<div><h2>${esc(P.closingTitle || "At the core, I like making things.")}</h2></div></div>
    <div class="about-block">${core}</div>
    <div class="row about-links">${resumeBtn()}<a class="btn" href="mailto:${esc(P.email)}">Email</a><a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a><a class="btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn</a><a class="btn" href="${esc(P.openreview)}" target="_blank" rel="noopener">OpenReview</a></div>
  </div>`;
}
const BUILD = [heroPanel, researchPanel, projectsPanel, expPanel, shelfPanel, guardianPanel, aboutPanel];
mountProjectIndex();
const panels = STOPS.map((s, i) => {
  const extra = i === 0 ? " hello" : "";
  const el = mk(`<section class="panel ${s.panel}${extra}" data-i="${i}" data-lenis-prevent aria-label="${esc(s.label)}">${BUILD[i]()}</section>`);
  $("#panels").appendChild(el); return el;
});
$("#dots").innerHTML = STOPS.map((s, i) => `<button type="button" data-go="${i}" aria-label="${esc(s.label)}" aria-current="${i === 0 ? "true" : "false"}"><span>${esc(s.label)}</span></button>`).join("");
$("#track").innerHTML = STOPS.map(() => "<div></div>").join("");
document.body.insertAdjacentHTML("beforeend", `<button type="button" class="scroll-chevron" data-go="1" aria-label="Continue downstream"><span></span></button>`);
document.body.classList.add("at-hello");

/* ---------- map overlays (map px stored in data-*; laid out in screen space each frame) ---------- */
const MI = $("#mapInner");
const ov = (html, x, y, w, h, rot = 0, extra = "", stopIdx = "", id = "") => {
  const el = mk(html); el.classList.add("ov");
  if (stopIdx !== "" && stopIdx != null) { el.classList.add("map-ov"); el.dataset.stop = String(stopIdx); }
  if (id) el.dataset.ovId = id;
  el.dataset.mapX = String(x); el.dataset.mapY = String(y);
  if (w) el.dataset.mapW = String(w);
  if (h) el.dataset.mapH = String(h);
  if (rot) el.dataset.mapRot = String(rot);
  if (extra) el.style.cssText += extra;
  MI.appendChild(el); return el;
};
const researchBy = id => (C.research || []).find(r => r.id === id);
const noteBy = id => (C.notes || []).find(n => n.id === id), projBy = id => C.projects.find(p => p.id === id);
/* Research post-it notes (stop 1), 2 x 2 grid */
(() => { const id = "r-reasoning"; const paper = researchBy(id); if (!paper) return;
  const tag = researchTag(paper); const what = (paper.note && paper.note.what) || ""; const hl = researchHeadline(paper); const cap = researchCaption(paper);
  ov(`<button type="button" class="postit" data-research-story="${esc(id)}" data-research="${esc(id)}" aria-label="${esc(tag)}: ${esc(paper.title)}" style="--postit:#f3d9a4"><i class="postit-pin" aria-hidden="true"></i><b>${esc(tag)}</b><span class="postit-what">${esc(what)}</span><strong class="postit-hl">${esc(hl)}</strong><em class="postit-cap">${esc(cap)}</em></button>`, 545, 300, 190, 120, -2, "z-index:5;", "1", id);
})();
(() => { const id = "r-vision"; const paper = researchBy(id); if (!paper) return;
  const tag = researchTag(paper); const what = (paper.note && paper.note.what) || ""; const hl = researchHeadline(paper); const cap = researchCaption(paper);
  ov(`<button type="button" class="postit" data-research-story="${esc(id)}" data-research="${esc(id)}" aria-label="${esc(tag)}: ${esc(paper.title)}" style="--postit:#b8e8d4"><i class="postit-pin" aria-hidden="true"></i><b>${esc(tag)}</b><span class="postit-what">${esc(what)}</span><strong class="postit-hl">${esc(hl)}</strong><em class="postit-cap">${esc(cap)}</em></button>`, 749, 300, 190, 120, 2, "z-index:5;", "1", id);
})();
(() => { const id = "r-markets"; const paper = researchBy(id); if (!paper) return;
  const tag = researchTag(paper); const what = (paper.note && paper.note.what) || ""; const hl = researchHeadline(paper); const cap = researchCaption(paper);
  ov(`<button type="button" class="postit" data-research-story="${esc(id)}" data-research="${esc(id)}" aria-label="${esc(tag)}: ${esc(paper.title)}" style="--postit:#d4c4f5"><i class="postit-pin" aria-hidden="true"></i><b>${esc(tag)}</b><span class="postit-what">${esc(what)}</span><strong class="postit-hl">${esc(hl)}</strong><em class="postit-cap">${esc(cap)}</em></button>`, 545, 434, 190, 120, 2, "z-index:5;", "1", id);
})();
(() => { const id = "r-quantum"; const paper = researchBy(id); if (!paper) return;
  const tag = researchTag(paper); const what = (paper.note && paper.note.what) || ""; const hl = researchHeadline(paper); const cap = researchCaption(paper);
  ov(`<button type="button" class="postit" data-research-story="${esc(id)}" data-research="${esc(id)}" aria-label="${esc(tag)}: ${esc(paper.title)}" style="--postit:#b5d4f5"><i class="postit-pin" aria-hidden="true"></i><b>${esc(tag)}</b><span class="postit-what">${esc(what)}</span><strong class="postit-hl">${esc(hl)}</strong><em class="postit-cap">${esc(cap)}</em></button>`, 749, 434, 190, 120, -2, "z-index:5;", "1", id);
})();
/* Decorative lanterns in the rapids (stop 2), pulse when the strip scrolls */
[[320, 560], [400, 640], [360, 720]].forEach(([x, y], i) => {
  ov(`<i class="lantern" aria-hidden="true" style="--i:${i}"></i>`, x, y, 28, 28, 0, "z-index:2;", "2", `lantern-${i}`);
});
/* Path stones (stop 3): oldest bottom to newest top, plus What's next */
const STONE_POS = [[680, 735], [715, 640], [700, 520], [690, 410]];
C.jobs.forEach((j, i) => {
  const [x, y] = STONE_POS[i] || j.stone || [700, 400 + i * 80];
  j.stone = [x, y];
  const year = (j.when || "").match(/\d{4}/g);
  const yr = year ? year[year.length - 1] : "";
  ov(`<button type="button" class="path-stone" data-job="${i}" style="--stone:${j.color}" aria-label="${esc(j.co)}: ${esc(j.stoneText || j.role)}">
    <strong>${esc(j.stoneText || j.co)}</strong>
    <span>${esc(j.co)}${yr ? " · " + esc(yr) : ""}</span>
  </button>`, x, y, 130, 70, 0, "z-index:4;", "3", `stone-${i}`);
});
ov(`<button type="button" class="path-stone path-stone-next" data-whats-next aria-label="What's next">
  <strong>What's next</strong>
  <span>Drop me a card</span>
</button>`, 650, 320, 130, 70, 0, "z-index:4;", "3", "stone-next");
/* Glowing dashed path through stones */
(() => {
  const pts = [...STONE_POS, [650, 320]];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const svg = mk(`<svg class="path-glow map-ov ov" data-stop="3" viewBox="0 0 ${MAP_W} ${MAP_H}" aria-hidden="true">
    <path class="path-glow-line" pathLength="1" d="${d}"/>
  </svg>`);
  svg.dataset.mapX = "0"; svg.dataset.mapY = "0"; svg.dataset.mapW = String(MAP_W); svg.dataset.mapH = String(MAP_H);
  svg.style.cssText = "z-index:3;pointer-events:none;";
  MI.appendChild(svg);
})();
/* Crystal glows (no labels), light up when the matching skill row is hovered */
[[0, 140, 780], [1, 260, 760], [2, 360, 800], [3, 220, 860], [4, 300, 900], [5, 180, 920]].forEach(([si, x, y]) => {
  ov(`<i class="crystal-glow" data-skill="${si}" aria-hidden="true"></i>`, x, y, 56, 56, 0, "z-index:2;pointer-events:none;", "4", `crystal-${si}`);
});
const eyes = [mk('<i class="eye map-ov ov" data-stop="5"></i>'), mk('<i class="eye map-ov ov" data-stop="5"></i>')];
eyes[0].dataset.mapX = "415"; eyes[0].dataset.mapY = "881"; eyes[0].dataset.mapW = "10"; eyes[0].dataset.mapH = "10";
eyes[1].dataset.mapX = "439"; eyes[1].dataset.mapY = "881"; eyes[1].dataset.mapW = "10"; eyes[1].dataset.mapH = "10";
eyes.forEach(e => MI.appendChild(e));
const crackSvg = mk(`<svg class="guardian-cracks map-ov ov" data-stop="5" data-map-x="370" data-map-y="820" data-map-w="120" data-map-h="140" viewBox="0 0 120 140" aria-hidden="true">
  <path class="crack" pathLength="1" d="M58 12 C52 38 70 48 48 72 C40 84 62 96 55 118"/>
  <path class="crack" pathLength="1" d="M72 18 C78 42 60 58 82 78 C94 92 70 108 76 128"/>
  <path class="crack" pathLength="1" d="M40 55 C55 62 68 58 88 66"/>
</svg>`);
crackSvg.dataset.mapX = "370"; crackSvg.dataset.mapY = "820"; crackSvg.dataset.mapW = "120"; crackSvg.dataset.mapH = "140";
crackSvg.style.cssText = "z-index:3;pointer-events:none;";
MI.appendChild(crackSvg);

/* ---------- work constellation (stop 0) ---------- */
const CONSTELLATION = [
  { id: "c-reason", label: "Reasoning evaluation", tip: "1 paper and 1 project. Does the model compute or recall?", go: 1, filter: null, tags: ["reasoning", "r-reasoning"] },
  { id: "c-vision", label: "Vision and documents", tip: "1 paper and OCR work. Does confidence mean the model looked?", go: 1, filter: null, tags: ["vision", "r-vision", "ocr"] },
  { id: "c-gen", label: "Generative models and RL", tip: "Diffusion and RL hedging, plus Atari.", go: 2, filter: "Research code", tags: ["diffusion", "rl", "generative"] },
  { id: "c-quant", label: "Quantum and quant", tip: "Quantum survey and portfolio research.", go: 1, filter: null, tags: ["quantum", "quant", "r-quantum", "r-markets"] },
  { id: "c-agents", label: "Agents and systems", tip: "OmniMesh, CloudWatch agent, production speech.", go: 2, filter: "AI systems", tags: ["agent", "mesh", "systems"] },
  { id: "c-forecast", label: "Forecasting and data", tip: "Traffic, pricing, routes and MRV.", go: 2, filter: "Forecasting and data", tags: ["forecast", "traffic", "pricing"] }
];
const CONST_EDGES = [
  [0, 1], /* Reasoning to Vision */
  [2, 3], /* Generative to Quant */
  [4, 0], /* Agents to Reasoning */
  [5, 3]  /* Forecasting to Quant */
];
function constellationWeight(node) {
  const blob = [
    ...(C.research || []).map(r => `${r.id} ${r.tag || ""} ${r.title || ""}`.toLowerCase()),
    ...(C.projects || []).map(p => `${p.id} ${p.group || ""} ${p.title || ""} ${(p.skills || []).join(" ")}`.toLowerCase())
  ].join(" | ");
  let n = 1;
  node.tags.forEach(tag => { if (blob.includes(tag.toLowerCase())) n++; });
  return n;
}
function mountConstellation() {
  const host = mk(`<div class="constellation" id="constellation" aria-label="Work constellation" hidden>
    <svg class="const-svg" viewBox="0 0 460 420" width="460" height="420" role="presentation"></svg>
    <div class="const-nodes" role="group" aria-label="Areas of work"></div>
    <div class="const-tip" id="constTip" hidden></div>
    <div class="const-counters" id="constCounters" aria-live="polite">
      <span data-count="papers" data-to="${(C.research || []).length}"><b>0</b> papers</span>
      <span data-count="projects" data-to="${(C.projects || []).length}"><b>0</b> projects</span>
      <span data-count="roles" data-to="${(C.jobs || []).length}"><b>0</b> roles</span>
    </div>
  </div>`);
  document.body.appendChild(host);
  const svg = $(".const-svg", host);
  const nodesEl = $(".const-nodes", host);
  const positions = [
    [120, 90], [320, 80], [380, 220], [280, 340], [100, 300], [60, 180]
  ];
  const weights = CONSTELLATION.map(constellationWeight);
  const maxW = Math.max(...weights);
  /* edges */
  CONST_EDGES.forEach(([a, b], i) => {
    const [x1, y1] = positions[a], [x2, y2] = positions[b];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("class", "const-edge");
    line.dataset.edge = String(i);
    svg.appendChild(line);
  });
  CONSTELLATION.forEach((node, i) => {
    const [x, y] = positions[i];
    const r = 7 + (weights[i] / maxW) * 10;
    const btn = mk(`<button type="button" class="const-node" data-ci="${i}" style="left:${x}px;top:${y}px;--r:${r}px" aria-label="${esc(node.label)}: ${esc(node.tip)}">
      <span class="const-dot" style="width:${r * 2}px;height:${r * 2}px"></span>
      <span class="const-label">${esc(node.label)}</span>
    </button>`);
    nodesEl.appendChild(btn);
  });
  let pulseEdge = 0;
  const tip = $("#constTip", host);
  nodesEl.addEventListener("pointerenter", e => {
    const b = e.target.closest(".const-node"); if (!b) return;
    const i = +b.dataset.ci; const node = CONSTELLATION[i];
    host.querySelectorAll(".const-node").forEach(n => n.classList.toggle("hot", n === b));
    host.querySelectorAll(".const-edge").forEach(line => {
      const eidx = +line.dataset.edge;
      const [a, c] = CONST_EDGES[eidx];
      line.classList.toggle("hot", a === i || c === i);
    });
    tip.hidden = false; tip.textContent = node.tip;
    tip.style.left = b.style.left; tip.style.top = b.style.top;
  }, true);
  nodesEl.addEventListener("pointerleave", e => {
    if (!e.relatedTarget || !host.contains(e.relatedTarget)) {
      host.querySelectorAll(".const-node,.const-edge").forEach(n => n.classList.remove("hot"));
      tip.hidden = true;
    }
  });
  nodesEl.addEventListener("focusin", e => {
    const b = e.target.closest(".const-node"); if (!b) return;
    tip.hidden = false; tip.textContent = CONSTELLATION[+b.dataset.ci].tip;
  });
  nodesEl.addEventListener("click", e => {
    const b = e.target.closest(".const-node"); if (!b) return;
    const node = CONSTELLATION[+b.dataset.ci];
    if (node.filter && typeof window.__setProjectFilter === "function") window.__setProjectFilter(node.filter);
    go(node.go, 700);
  });
  if (!preferReduced) {
    setInterval(() => {
      if (!document.body.classList.contains("at-hello")) return;
      host.querySelectorAll(".const-edge").forEach(l => l.classList.remove("pulse"));
      const line = host.querySelector(`.const-edge[data-edge="${pulseEdge}"]`);
      if (line) line.classList.add("pulse");
      pulseEdge = (pulseEdge + 1) % CONST_EDGES.length;
    }, 2000);
  }
  let counted = false;
  const runCounters = () => {
    if (counted || preferReduced) {
      $$("#constCounters [data-to]").forEach(el => { el.querySelector("b").textContent = el.dataset.to; });
      counted = true; return;
    }
    counted = true;
    $$("#constCounters [data-to]").forEach(el => {
      const to = +el.dataset.to; const b = $("b", el); let n = 0;
      const step = () => { n++; b.textContent = String(Math.min(n, to)); if (n < to) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
  window.__showConstellation = on => {
    host.hidden = !on;
    if (on) runCounters();
  };
}

let guardianAwoke = false, mossBurstUntil = 0;
const moss = [];
function statueScreenPos() {
  const mx = 427, my = 910;
  return { x: (mx - cam.x0) * cam.k, y: (my - cam.y0) * cam.k };
}
function awakenGuardian() {
  if (guardianAwoke) {
    MI.classList.add("guardian-awake");
    return;
  }
  guardianAwoke = true;
  if (preferReduced) {
    MI.classList.add("guardian-awake");
    return;
  }
  MI.classList.add("guardian-awakening");
  const { x, y } = statueScreenPos();
  pushRip(x, y);
  setTimeout(() => pushRip(x + 8, y + 12), 280);
  mossBurstUntil = performance.now() / 1000 + 2.1;
  for (let i = 0; i < 36; i++) {
    moss.push({
      x: x + (Math.random() - .5) * 50, y: y + 20 + Math.random() * 30,
      vx: (Math.random() - .5) * 28, vy: -(30 + Math.random() * 55),
      a: 0, l: 1.2 + Math.random() * .9, r: 1.5 + Math.random() * 2.5,
      leaf: Math.random() < .35, rot: Math.random() * 6
    });
  }
  setTimeout(() => {
    MI.classList.remove("guardian-awakening");
    MI.classList.add("guardian-awake");
  }, 1400);
}
function updateMapOverlays(f) {
  const idx = clamp(Math.round(f), 0, N - 1);
  MI.dataset.stop = String(idx);
  $$(".map-ov", MI).forEach(el => {
    const stop = +el.dataset.stop;
    const opacity = 1 - smoothstep(0.35, 0.6, Math.abs(f - stop));
    el.style.opacity = String(opacity);
    el.style.pointerEvents = opacity < 0.5 ? "none" : "auto";
  });
  if (idx === 5) awakenGuardian();
  else if (!guardianAwoke) MI.classList.remove("guardian-awake", "guardian-awakening");
}

/* ---------- native scroll (no Lenis, no snap) ---------- */
let W = innerWidth, H = innerHeight, docH = 1, scrollY = 0, scrollDir = 1, lastF = 0;
const isMobileView = () => W < 760 || W / H < .9;
const measure = () => { W = innerWidth; H = innerHeight; docH = document.documentElement.scrollHeight; };
const range = () => Math.max(1, docH - H);
const progressFromScroll = y => clamp(y / range(), 0, 1) * (N - 1);
const scrollForStop = i => (clamp(i, 0, N - 1) / (N - 1)) * range();

const preferReduced = reducedMotion();
let chatFocused = false, busy = false, pageVisible = !document.hidden;
let scrollTween = null;
let fCam = 0, fVel = 0;
const CAM_TAU = 0.16, CAM_OMEGA = 2 / CAM_TAU;

function markScrollContain() {
  $$(".panel, .modal .sheet, .rail, .drop-card, .project-list, .list, .ask-browse, .ask-answer, .sheet").forEach(el => {
    el.style.overscrollBehavior = "contain";
  });
}
markScrollContain();

function onScrollUpdate(y) {
  const prev = scrollY;
  scrollY = y;
  if (y > prev + 0.5) scrollDir = 1; else if (y < prev - 0.5) scrollDir = -1;
  dirty = true;
}
addEventListener("scroll", () => onScrollUpdate(window.scrollY || window.pageYOffset || 0), { passive: true });
addEventListener("wheel", () => { scrollTween = null; }, { passive: true });
addEventListener("touchstart", () => { scrollTween = null; }, { passive: true });

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function go(i, durationMs, done) {
  i = clamp(i | 0, 0, N - 1);
  const top = scrollForStop(i);
  let ms = durationMs == null ? (preferReduced ? 0 : 700) : durationMs;
  if (ms > 0 && ms < 20) ms = Math.round(ms * 1000); /* legacy seconds */
  if (preferReduced || ms <= 0) {
    scrollTween = null;
    window.scrollTo(0, top);
    onScrollUpdate(top);
    if (done) done();
    return;
  }
  const startY = window.scrollY || window.pageYOffset || 0;
  const dist = top - startY;
  if (Math.abs(dist) < 1) { if (done) done(); return; }
  const t0s = performance.now();
  scrollTween = { startY, dist, t0: t0s, ms, done };
  const step = now => {
    if (!scrollTween) return;
    const t = clamp((now - scrollTween.t0) / scrollTween.ms, 0, 1);
    const y = scrollTween.startY + scrollTween.dist * easeInOutCubic(t);
    window.scrollTo(0, y);
    onScrollUpdate(y);
    if (t < 1) requestAnimationFrame(step);
    else {
      const cb = scrollTween.done;
      scrollTween = null;
      if (cb) cb();
    }
  };
  requestAnimationFrame(step);
}
document.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); go(+g.dataset.go); } });

document.addEventListener("pointerover", e => {
  const el = e.target.closest("[data-research]");
  if (!el) return;
  const id = el.dataset.research;
  $$(".thread-card[data-research], .postit[data-research]").forEach(n => n.classList.toggle("lit", n.dataset.research === id));
});
document.addEventListener("pointerout", e => {
  const el = e.target.closest("[data-research]");
  if (!el) return;
  if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(`[data-research="${el.dataset.research}"]`)) return;
  $$(".thread-card.lit, .postit.lit").forEach(n => n.classList.remove("lit"));
});


document.addEventListener("click", e => {
  if (!e.target.closest("[data-tour]")) return;
  e.preventDefault();
  let i = 0;
  const step = () => {
    go(i, preferReduced ? 0 : 700);
    i++;
    if (i < N) setTimeout(step, preferReduced ? 400 : 8500);
  };
  step();
});


/* Dots: arrow-key roving tabindex within the journey nav */
$("#dots")?.addEventListener("keydown", e => {
  const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const i = dots.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  e.stopPropagation();
  let next = i;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(N - 1, i + 1);
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(0, i - 1);
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = N - 1;
  dots[next]?.focus();
  if (next !== i) go(next);
});

/* Site tabs: Left/Right moves between section links */
$(".site-tabs")?.addEventListener("keydown", e => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
  const links = $$(".site-tabs a");
  const i = links.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  e.stopPropagation();
  let next = i;
  if (e.key === "ArrowRight") next = (i + 1) % links.length;
  else if (e.key === "ArrowLeft") next = (i - 1 + links.length) % links.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = links.length - 1;
  links[next]?.focus();
});

/* Keyboard: Down/PageDown/Space next; Up/PageUp prev; Home/End; 700 ms eased, cancelled by wheel */
addEventListener("keydown", e => {
  if (chatFocused) return;
  const m = document.getElementById("modal");
  if (m && m.classList.contains("on")) return;
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
  if (e.target?.closest?.("#dots, .site-tabs, .ask-tabs, .lib-tabs")) return;
  const cur = clamp(Math.round(progressFromScroll(scrollY)), 0, N - 1);
  if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(cur + 1, 700); }
  else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(cur - 1, 700); }
  else if (e.key === "Home") { e.preventDefault(); go(0, 700); }
  else if (e.key === "End") { e.preventDefault(); go(N - 1, 700); }
});

/* ---------- camera: fit focus box into free area (screen minus panel) ---------- */
const lerp = (a, b, t) => a + (b - a) * t;
const cam = { x0: 0, y0: 0, vw: MAP_W, vh: MAP_H, k: 1 };
let panelRects = [];
function refreshPanelRects() {
  panelRects = panels.map(p => (p ? p.getBoundingClientRect() : null));
}

/** Largest free rectangle after subtracting the panel (plus 24px padding). */
function freeAreaForPanel(panelEl, side, rect) {
  const pad = 24;
  let fx = pad, fy = pad, fw = Math.max(40, W - 2 * pad), fh = Math.max(40, H - 2 * pad);
  if (!panelEl && !rect) return { fx, fy, fw, fh };
  const r = rect || panelEl.getBoundingClientRect();
  const effective = isMobileView() ? "bottom" : side;
  if (effective === "left") {
    const left = Math.max(pad, r.right + pad);
    fx = left; fw = Math.max(40, W - pad - left);
  } else if (effective === "right") {
    fw = Math.max(40, r.left - pad - fx);
  } else if (effective === "bottom" || effective === "center") {
    fh = Math.max(40, r.top - pad - fy);
  }
  return { fx, fy, fw, fh };
}

function camForStop(i) {
  const stop = STOPS[i];
  const mob = isMobileView();
  const box = mob ? stop.mbox : stop.box;
  const [bx0, by0, bx1, by1] = box;
  const bw = Math.max(1, bx1 - bx0), bh = Math.max(1, by1 - by0);
  const bx = (bx0 + bx1) / 2, by = (by0 + by1) / 2;
  const pr = panelRects[i] || null;
  const { fx, fy, fw, fh } = freeAreaForPanel(panels[i], stop.panel, pr);
  const [kMin, kMax] = mob ? [0.9, 1.5] : [0.9, 1.9];
  let k = Math.min(fw / bw, fh / bh);
  k = clamp(k, kMin, kMax);
  if (H / k > MAP_H) k = H / MAP_H;
  if (W / k > MAP_W) k = W / MAP_W;

  const vw = W / k, vh = H / k;
  const mapHiX = Math.max(0, MAP_W - vw);
  const mapHiY = Math.max(0, MAP_H - vh);

  let x0 = bx - (fx + fw / 2) / k;
  let y0 = by - (fy + fh / 2) / k;

  const xLo = bx1 - (fx + fw) / k;
  const xHi = bx0 - fx / k;
  const yLo = by1 - (fy + fh) / k;
  const yHi = by0 - fy / k;
  if (xLo <= xHi) x0 = clamp(x0, Math.max(0, xLo), Math.min(mapHiX, xHi));
  else x0 = clamp(x0, 0, mapHiX);
  if (yLo <= yHi) y0 = clamp(y0, Math.max(0, yLo), Math.min(mapHiY, yHi));
  else y0 = clamp(y0, 0, mapHiY);

  const pad = 24;
  if (pr) {
    let sx0 = (bx0 - x0) * k, sy0 = (by0 - y0) * k;
    let sx1 = (bx1 - x0) * k, sy1 = (by1 - y0) * k;
    const side = mob ? "bottom" : stop.panel;
    if (side === "left" && sx0 < pr.right + pad) x0 = clamp(x0 - (pr.right + pad - sx0) / k, 0, mapHiX);
    if (side === "right" && sx1 > pr.left - pad) x0 = clamp(x0 + (sx1 - (pr.left - pad)) / k, 0, mapHiX);
    if ((side === "bottom" || side === "center") && sy1 > pr.top - pad) y0 = clamp(y0 + (sy1 - (pr.top - pad)) / k, 0, mapHiY);
  }

  return { x0, y0, vw, vh, k, cx: x0 + vw / 2, cy: y0 + vh / 2 };
}

/** Hold each stop while |f - i| < 0.3; ease between stops. Reduced motion: jump. */
function cameraParam(f) {
  if (preferReduced) return clamp(Math.round(f), 0, N - 1);
  const i = clamp(Math.floor(f), 0, N - 1);
  const j = Math.min(N - 1, i + 1);
  if (i === j) return i;
  const local = f - i;
  if (local < 0.3) return i;
  if (local > 0.7) return j;
  return i + easeInOut((local - 0.3) / 0.4);
}

function computeCam(f) {
  const cf = cameraParam(f);
  const i = clamp(Math.floor(cf), 0, N - 1);
  const j = Math.min(N - 1, i + 1);
  const t = cf - i;
  const a = camForStop(i), b = camForStop(j);
  const k = t <= 0 ? a.k : Math.exp(lerp(Math.log(a.k), Math.log(b.k), t));
  const cx = lerp(a.cx, b.cx, t), cy = lerp(a.cy, b.cy, t);
  const vw = W / k, vh = H / k;
  cam.k = k; cam.vw = vw; cam.vh = vh;
  cam.x0 = clamp(cx - vw / 2, 0, Math.max(0, MAP_W - vw));
  cam.y0 = clamp(cy - vh / 2, 0, Math.max(0, MAP_H - vh));
}

function layoutOverlays() {
  const k = cam.k, x0 = cam.x0, y0 = cam.y0;
  const fontPx = Math.max(12, Math.round(13 * Math.min(1.25, Math.max(0.85, k))));
  $$(".ov", MI).forEach(el => {
    if (el.classList.contains("debug-grid")) {
      el.style.transform = `translate3d(${(-x0 * k).toFixed(2)}px,${(-y0 * k).toFixed(2)}px,0) scale(${k})`;
      el.style.transformOrigin = "0 0";
      return;
    }
    const mx = parseFloat(el.dataset.mapX);
    const my = parseFloat(el.dataset.mapY);
    if (!Number.isFinite(mx) || !Number.isFinite(my)) return;
    const mw = parseFloat(el.dataset.mapW) || 0;
    const mh = parseFloat(el.dataset.mapH) || 0;
    const rot = parseFloat(el.dataset.mapRot) || 0;
    const sx = (mx - x0) * k;
    const sy = (my - y0) * k;
    const center = el.classList.contains("step-stone") || el.classList.contains("path-stone") || el.classList.contains("crystal-glow") || el.classList.contains("lantern") || el.classList.contains("eye");
    let tx = sx, ty = sy;
    if (center && mw && mh) { tx = sx - (mw * k) / 2; ty = sy - (mh * k) / 2; }
    let transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0)`;
    if (rot) transform += ` rotate(${rot}deg)`;
    el.style.transform = transform;
    if (mw) el.style.width = `${(mw * k).toFixed(2)}px`;
    if (mh) el.style.height = `${(mh * k).toFixed(2)}px`;
    if (el.classList.contains("scroll") || el.classList.contains("banner") || el.classList.contains("postit")) el.style.fontSize = `${Math.max(12, fontPx)}px`;
  });
}

/* ---------- WebGL scene ---------- */
const canvas = $("#scene");
let gl = null, prog = null, U = {}, texReady = false, isWebGL2 = false;
function shader(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; } return s; }
function initGL() {
  const opts = { antialias: false, alpha: false, powerPreference: "high-performance" };
  try { gl = canvas.getContext("webgl2", opts); } catch (e) { gl = null; }
  isWebGL2 = !!(gl && typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext);
  if (!gl) {
    try { gl = canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts); } catch (e) { gl = null; }
  }
  if (!gl) return false;
  const vs = shader(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
  const fs = shader(gl.FRAGMENT_SHADER, $("#sceneFrag").textContent);
  if (!vs || !fs) return false;
  prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
  gl.useProgram(prog);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  ["uPlate", "uFlow", "uFoam", "uCam", "uRes", "uMap", "uTime", "uMotion", "uRip"].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.uniform1i(U.uPlate, 0); gl.uniform1i(U.uFlow, 1); gl.uniform1i(U.uFoam, 2); gl.uniform2f(U.uMap, MAP_W, MAP_H);
  return true;
}
const loadImg = src => new Promise((res, rej) => { const im = new Image(); im.decoding = "async"; im.onload = () => res(im); im.onerror = rej; im.src = src; });
function upload(unit, img, fmt, { mipmap = false } = {}) {
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  let src = img;
  if (img.width > max || img.height > max) {
    const s = max / Math.max(img.width, img.height), c = document.createElement("canvas");
    c.width = Math.floor(img.width * s); c.height = Math.floor(img.height * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); src = c;
  }
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, unit === 0 ? gl.BROWSER_DEFAULT_WEBGL : gl.NONE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, src);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (mipmap && isWebGL2) {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    const aniso = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    if (aniso) {
      const maxAniso = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
      gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, maxAniso));
    }
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}
let renderScale = Math.min(Math.max(devicePixelRatio || 1, 1), 1.5);
let frameMsSum = 0, frameMsCount = 0, perfWindowStart = 0;
function resize() {
  measure();
  refreshPanelRects();
  canvas.width = Math.round(W * renderScale); canvas.height = Math.round(H * renderScale);
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  fxc.width = Math.round(W * Math.min(devicePixelRatio || 1, 1.5));
  fxc.height = Math.round(H * Math.min(devicePixelRatio || 1, 1.5));
  fxc.style.width = W + "px"; fxc.style.height = H + "px";
  fx.setTransform(fxc.width / W, 0, 0, fxc.height / H, 0, 0);
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  dirty = true;
}
function noteFrameTime(dtMs, now) {
  if (preferReduced) return;
  frameMsSum += dtMs; frameMsCount++;
  if (!perfWindowStart) perfWindowStart = now;
  if (now - perfWindowStart < 1500 || frameMsCount < 20) return;
  const avg = frameMsSum / frameMsCount;
  frameMsSum = 0; frameMsCount = 0; perfWindowStart = now;
  const cap = Math.min(Math.max(devicePixelRatio || 1, 1), 1.5);
  let next = renderScale;
  if (avg > 20) next = Math.max(0.75, renderScale - 0.15);
  else if (avg < 14) next = Math.min(cap, renderScale + 0.15);
  if (Math.abs(next - renderScale) > 0.001) { renderScale = next; resize(); }
}

/* ---------- effects layer ---------- */
const fxc = $("#fx"), fx = fxc.getContext("2d");
const flies = Array.from({ length: 16 }, () => ({ x: Math.random(), y: Math.random(), z: .35 + Math.random() * .9, p: Math.random() * 6.28, warm: Math.random() < .4 }));
const drops = [];
const SPRAY = [[420, 262, 180, 5], [650, 948, 60, 2]];
function drawFx(t, dt) {
  fx.clearRect(0, 0, W, H);
  const drawMoss = () => {
    for (let i = moss.length - 1; i >= 0; i--) {
      const m = moss[i]; m.a += dt;
      if (m.a > m.l) { moss.splice(i, 1); continue; }
      m.vy -= 12 * dt; m.x += m.vx * dt; m.y += m.vy * dt; m.rot += dt * 1.2;
      const life = 1 - m.a / m.l;
      if (m.leaf) {
        fx.save(); fx.translate(m.x, m.y); fx.rotate(m.rot);
        fx.fillStyle = `rgba(120,170,90,${life * .75})`;
        fx.beginPath(); fx.ellipse(0, 0, m.r * 1.6, m.r * .7, 0, 0, 6.283); fx.fill();
        fx.restore();
      } else {
        fx.fillStyle = `rgba(90,140,70,${life * .65})`;
        fx.beginPath(); fx.arc(m.x, m.y, m.r, 0, 6.283); fx.fill();
      }
    }
  };
  if (!motion) { drawMoss(); return; }
  fx.globalCompositeOperation = "lighter";
  for (const f of flies) {
    const x = f.x * W + Math.sin(t * .3 + f.p * 2) * 40, y = ((f.y * H + Math.sin(t * .45 + f.p) * 30) % H + H) % H;
    const a = (.3 + .7 * Math.abs(Math.sin(t * (.6 + f.z * .5) + f.p))) * .75, r = 5 * f.z + 2, c = f.warm ? "255,207,134" : "114,241,223";
    const g = fx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`);
    fx.fillStyle = g; fx.beginPath(); fx.arc(x, y, r * 3, 0, 6.283); fx.fill();
  }
  for (const [mx, my, mw, n] of SPRAY) {
    const sx = (mx - cam.x0) * cam.k, sy = (my - cam.y0) * cam.k;
    if (sy < -80 || sy > H + 80 || sx < -200 || sx > W + 200) continue;
    for (let i = 0; i < n; i++) drops.push({ x: sx + (Math.random() * 2 - 1) * mw * cam.k / 2, y: sy, vx: (Math.random() * 2 - 1) * 40 * cam.k, vy: -(40 + Math.random() * 110) * cam.k, l: .6 + Math.random() * .8, a: 0, r: (.5 + Math.random() * 1.2) * Math.sqrt(cam.k) });
  }
  if (drops.length > 600) drops.splice(0, drops.length - 600);
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]; d.a += dt; if (d.a > d.l) { drops.splice(i, 1); continue; }
    d.vy += 200 * cam.k * dt; d.x += d.vx * dt; d.y += d.vy * dt;
    fx.fillStyle = `rgba(220,248,255,${(1 - d.a / d.l) * .6})`; fx.beginPath(); fx.arc(d.x, d.y, d.r, 0, 6.283); fx.fill();
  }
  fx.globalCompositeOperation = "source-over";
  drawMoss();
}

/* ---------- ripples ---------- */
const rips = []; let lastRip = 0, lx = 0, ly = 0;
const ripBuf = new Float32Array(24);
const pushRip = (x, y) => { rips.push({ x: x / W, y: y / H, a: 0 }); if (rips.length > 8) rips.shift(); dirty = true; };
addEventListener("pointermove", e => { const n = performance.now(); if (n - lastRip > 110 && Math.hypot(e.clientX - lx, e.clientY - ly) > 26) { pushRip(e.clientX, e.clientY); lastRip = n; lx = e.clientX; ly = e.clientY; } }, { passive: true });
addEventListener("pointerdown", e => pushRip(e.clientX, e.clientY), { passive: true });

/* ---------- main loop ---------- */
let motion = !preferReduced, dirty = true;
let t0 = performance.now(), last = t0;
const dots = $$("#dots button"), navl = $$(".nav .l");
dots.forEach((d, i) => { d.tabIndex = i === 0 ? 0 : -1; });
let activeIdx = -1;
const scrollChevron = $(".scroll-chevron");
function updatePanels(f) {
  const idx = clamp(Math.round(f), 0, N - 1);
  panels.forEach((p, i) => {
    const d = Math.abs(f - i);
    const opacity = 1 - smoothstep(0.25, 0.45, d);
    const py = (1 - opacity) * 10 * scrollDir;
    p.style.setProperty("--py", `${py.toFixed(1)}px`);
    p.style.opacity = String(opacity);
    p.style.visibility = opacity > 0.02 ? "visible" : "hidden";
    p.style.pointerEvents = opacity < 0.5 ? "none" : "auto";
    p.classList.toggle("on", opacity >= 0.5);
  });
  updateMapOverlays(f);
  if (scrollChevron) {
    const showChev = f < 0.35;
    scrollChevron.style.opacity = showChev ? "1" : "0";
    scrollChevron.style.pointerEvents = showChev ? "auto" : "none";
    scrollChevron.hidden = !showChev;
  }
  document.body.classList.toggle("at-hello", idx === 0);
  document.body.classList.toggle("at-projects", idx === 2);
  document.body.classList.toggle("at-about", idx === 6);
  if (window.__showConstellation) window.__showConstellation(idx === 0);
  if (window.__showProjectRing) window.__showProjectRing(idx === 2);
  if (window.__showDropFinal) window.__showDropFinal(idx === 6);
  if (idx === 2 && window.__nudgeDropTab) window.__nudgeDropTab();
  if (idx !== activeIdx) {
    activeIdx = idx;
    refreshPanelRects();
    dots.forEach((d, i) => {
      const on = i === idx;
      d.classList.toggle("on", on);
      d.setAttribute("aria-current", on ? "true" : "false");
      d.tabIndex = on ? 0 : -1;
    });
    navl.forEach(l => {
      const on = +l.dataset.go === idx;
      l.classList.toggle("on", on);
      if (on) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    });
  }
}
function frame(now) {
  if (!pageVisible) return;
  const dt = Math.min(.05, (now - last) / 1000) || .016; last = now;
  noteFrameTime(dt * 1000, now);
  const fTarget = progressFromScroll(scrollY);
  if (preferReduced) { fCam = fTarget; fVel = 0; }
  else {
    const x = fCam - fTarget;
    const a = -2 * CAM_OMEGA * fVel - CAM_OMEGA * CAM_OMEGA * x;
    fVel += a * dt;
    fCam += fVel * dt;
  }
  lastF = fCam;
  computeCam(fCam);
  MI.style.setProperty("--k", cam.k.toFixed(3));
  MI.style.transform = "";
  layoutOverlays();
  updatePanels(fCam);
  for (let i = 0; i < 8; i++) { const r = rips[i]; if (r) { r.a += dt; ripBuf[i * 3] = r.x; ripBuf[i * 3 + 1] = r.y; ripBuf[i * 3 + 2] = Math.max(r.a, .001); } else ripBuf[i * 3 + 2] = -1; }
  while (rips.length && rips[0].a > 3.5) rips.shift();
  if (gl && texReady && (motion || dirty || rips.length)) {
    gl.uniform4f(U.uCam, cam.x0 / MAP_W, cam.y0 / MAP_H, cam.vw / MAP_W, cam.vh / MAP_H);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, (now - t0) / 1000); gl.uniform1f(U.uMotion, motion ? 1 : 0);
    gl.uniform3fv(U.uRip, ripBuf);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    dirty = false;
  }
  drawFx((now - t0) / 1000, dt);
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  pageVisible = !document.hidden;
  if (pageVisible) {
    last = performance.now();
    document.documentElement.style.setProperty("--anim-play", "running");
    requestAnimationFrame(frame);
  } else {
    document.documentElement.style.setProperty("--anim-play", "paused");
  }
});

/* ---------- calm mode ---------- */
const calmBtn = $("#calmBtn");
function setMotion(m) { motion = m; calmBtn.setAttribute("aria-pressed", String(!m)); dirty = true; }
calmBtn.onclick = () => setMotion(!motion);
setMotion(motion);

/* ---------- path timeline + stepping stones ---------- */

const openedJobs = new Set();
function updatePathProgress() {
  const el = $("#pathOpened"); if (el) el.textContent = String(openedJobs.size);
  const done = $("#pathDone");
  if (done) done.hidden = openedJobs.size < C.jobs.length;
}
function closePathDive() {
  const dive = $("#pathDive"); if (!dive) return;
  dive.classList.remove("on");
  setTimeout(() => dive.remove(), 280);
}
function openPathStone(i) {
  const j = C.jobs[i]; if (!j) return;
  openedJobs.add(i); updatePathProgress();
  closePathDive();
  const pts = jobBullets(j);
  const impact = (j.impact || []).map(x => `<li><strong>${esc(x)}</strong></li>`).join("");
  const chips = (j.skills || []).map(s => `<span class="chip">${esc(s)}</span>`).join("");
  const nextI = i + 1 < C.jobs.length ? i + 1 : null;
  const el = mk(`<div class="path-dive on" id="pathDive" role="dialog" aria-modal="true" aria-labelledby="pathDiveTitle">
    <button type="button" class="x" data-path-dive-close aria-label="Close">&times;</button>
    <h3 id="pathDiveTitle">${esc(j.co)}</h3>
    <p class="sub">${esc(j.role)} · ${esc(j.when)}</p>
    <h4>What I built</h4>
    <ul>${pts.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    ${impact ? `<h4>Impact</h4><ul class="path-impact">${impact}</ul>` : ""}
    <div class="chips">${chips}</div>
    <div class="row" style="margin-top:12px">
      ${nextI != null ? `<button type="button" class="btn primary" data-next-stone="${nextI}">Next stone</button>` : `<button type="button" class="btn primary" data-whats-next>What's next</button>`}
      <button type="button" class="btn" data-path-dive-close>Close</button>
    </div>
  </div>`);
  document.body.appendChild(el);
  $(".x", el).focus();
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-path-dive-close]") || e.target.id === "pathDive" && e.target === e.currentTarget) closePathDive();
  const ns = e.target.closest("[data-next-stone]"); if (ns) { openPathStone(+ns.dataset.nextStone); return; }
  const stone = e.target.closest(".path-stone[data-job]"); if (stone) { go(3, 400); openPathStone(+stone.dataset.job); return; }
  if (e.target.closest("[data-whats-next]")) {
    go(6, 700);
    setTimeout(() => document.querySelector("[data-drop-card]")?.click(), 750);
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("#pathDive")) closePathDive();
});


function setPathHighlight(i) {
  $$(".path-role").forEach(el => el.classList.toggle("lit", i != null && +el.dataset.job === i));
  $$(".path-stone", MI).forEach(el => el.classList.toggle("lit", i != null && el.dataset.job != null && +el.dataset.job === i));
}
$$(".path-role").forEach(role => {
  const i = +role.dataset.job;
  role.addEventListener("pointerenter", () => setPathHighlight(i));
  role.addEventListener("pointerleave", () => setPathHighlight(null));
  role.addEventListener("focusin", () => setPathHighlight(i));
  role.addEventListener("focusout", () => setPathHighlight(null));
  const head = $(".path-role-head", role);
  head?.addEventListener("click", () => {
    const extra = $(".path-extra", role);
    if (!extra) return;
    const open = role.classList.toggle("open");
    head.setAttribute("aria-expanded", String(open));
    extra.hidden = !open;
    const tog = $(".tog", head);
    if (tog) tog.textContent = open ? "Less" : "More";
  });
});
$$(".step-stone", MI).forEach(stone => {
  const i = +stone.dataset.job;
  stone.addEventListener("pointerenter", () => setPathHighlight(i));
  stone.addEventListener("pointerleave", () => setPathHighlight(null));
  stone.addEventListener("click", () => {
    go(3);
    const role = $(`.path-role[data-job="${i}"]`);
    role?.scrollIntoView({ block: "nearest" });
    setPathHighlight(i);
  });
});
$$(".banner", MI).forEach(b => {
  const i = +b.dataset.job;
  b.addEventListener("pointerenter", () => setPathHighlight(i));
  b.addEventListener("pointerleave", () => setPathHighlight(null));
});

/* ---------- skills ↔ crystal glows ---------- */
function setSkillGlow(i) {
  $$(".skrow").forEach(el => el.classList.toggle("lit", i != null && +el.dataset.skill === i));
  $$(".crystal-glow", MI).forEach(el => el.classList.toggle("lit", i != null && +el.dataset.skill === i));
}
$$(".skrow").forEach(row => {
  const i = +row.dataset.skill;
  row.addEventListener("pointerenter", () => setSkillGlow(i));
  row.addEventListener("pointerleave", () => setSkillGlow(null));
  row.addEventListener("focusin", () => setSkillGlow(i));
  row.addEventListener("focusout", () => setSkillGlow(null));
});

/* ---------- project strip + index ---------- */
const projStrip = $("#projStrip");
const projIndex = $("#projIndex");
let projFilter = "All", projQuery = "";
function pulseLanterns() {
  $$(".lantern", MI).forEach(el => {
    el.classList.remove("pulse");
    void el.offsetWidth;
    el.classList.add("pulse");
  });
}

function mountProjectRing() {
  const host = mk(`<div class="project-ring" id="projectRing" hidden aria-label="Project carousel">
    <button type="button" class="ring-nav prev" aria-label="Previous project">‹</button>
    <div class="ring-stage" id="ringStage">
      <div class="ring-track" id="ringTrack"></div>
    </div>
    <button type="button" class="ring-nav next" aria-label="Next project">›</button>
  </div>`);
  document.body.appendChild(host);
  const track = $("#ringTrack", host);
  let items = C.projects.slice();
  let angle = 0, vel = 0, dragging = false, lastX = 0, interacted = false, auto = true;
  let active = 0;
  const radius = 420;
  function filtered() {
    if (projFilter === "All") return C.projects.slice();
    return C.projects.filter(p => p.group === projFilter);
  }
  function rebuild() {
    items = filtered();
    track.innerHTML = items.map(projectCardHTML).join("");
    active = 0; angle = 0; layout();
  }
  function layout() {
    const n = Math.max(items.length, 1);
    const step = 360 / n;
    $$(".ring-card", track).forEach((card, i) => {
      const a = angle + i * step;
      const rad = a * Math.PI / 180;
      card.style.transform = `rotateY(${a}deg) translateZ(${radius}px)`;
      const front = Math.cos(rad);
      card.style.opacity = String(0.35 + 0.65 * Math.max(0, front));
      card.classList.toggle("active", i === ((active % n) + n) % n);
      card.style.zIndex = String(Math.round(50 + front * 50));
      card.setAttribute("aria-hidden", front < 0.2 ? "true" : "false");
    });
  }
  function nearestIndex() {
    const n = Math.max(items.length, 1);
    const step = 360 / n;
    let best = 0, bestDiff = 1e9;
    for (let i = 0; i < n; i++) {
      let d = ((angle + i * step) % 360 + 540) % 360 - 180;
      d = Math.abs(d);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    return best;
  }
  function rotateBy(delta) {
    angle += delta;
    active = nearestIndex();
    layout();
    pulseLanterns();
  }
  function goTo(i) {
    const n = Math.max(items.length, 1);
    i = ((i % n) + n) % n;
    const step = 360 / n;
    angle = -i * step;
    active = i;
    layout();
  }
  rebuild();
  $(".ring-nav.prev", host).onclick = () => { interacted = true; auto = false; goTo(active - 1); };
  $(".ring-nav.next", host).onclick = () => { interacted = true; auto = false; goTo(active + 1); };
  track.addEventListener("pointerdown", e => {
    if (e.target.closest("a,button")) return;
    dragging = true; interacted = true; auto = false; lastX = e.clientX; vel = 0;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX; vel = dx * 0.25;
    rotateBy(dx * 0.35);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    const coast = () => {
      if (Math.abs(vel) < 0.05 || dragging) { goTo(nearestIndex()); return; }
      rotateBy(vel); vel *= 0.92; requestAnimationFrame(coast);
    };
    requestAnimationFrame(coast);
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("click", e => {
    const card = e.target.closest(".ring-card"); if (!card) return;
    if (e.target.closest("[data-stop-prop]")) return;
    const i = $$(".ring-card", track).indexOf(card);
    if (i < 0) return;
    if (card.classList.contains("active")) openProject(card.dataset.proj);
    else { interacted = true; auto = false; goTo(i); }
  });
  document.addEventListener("keydown", e => {
    if (!document.body.classList.contains("at-projects")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); interacted = true; auto = false; goTo(active - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); interacted = true; auto = false; goTo(active + 1); }
  });
  if (!preferReduced) {
    setInterval(() => { if (auto && document.body.classList.contains("at-projects")) goTo(active + 1); }, 4200);
  }
  window.__setRingFilter = f => {
    projFilter = f || "All";
    $$(".ring-filter").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ringFilter === projFilter)));
    rebuild();
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-ring-filter]"); if (!b) return;
    window.__setRingFilter(b.dataset.ringFilter);
  });
  const prevSet = window.__setProjectFilter;
  window.__setProjectFilter = f => {
    if (prevSet) prevSet(f);
    if (window.__setRingFilter) window.__setRingFilter(f);
  };
  window.__showProjectRing = on => { host.hidden = !on; if (on) layout(); };
}


function bindProjStrip() {
  if (!projStrip) return;
  projStrip.addEventListener("wheel", e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      projStrip.scrollLeft += e.deltaY;
      pulseLanterns();
    }
  }, { passive: false });
  let dragging = false, startX = 0, startLeft = 0;
  projStrip.addEventListener("pointerdown", e => {
    if (e.target.closest("a,button")) return;
    dragging = true; startX = e.clientX; startLeft = projStrip.scrollLeft;
    projStrip.setPointerCapture(e.pointerId);
  });
  projStrip.addEventListener("pointermove", e => {
    if (!dragging) return;
    projStrip.scrollLeft = startLeft - (e.clientX - startX);
  });
  const endDrag = () => { if (dragging) { dragging = false; pulseLanterns(); } };
  projStrip.addEventListener("pointerup", endDrag);
  projStrip.addEventListener("pointercancel", endDrag);
  projStrip.addEventListener("scroll", () => { clearTimeout(projStrip._t); projStrip._t = setTimeout(pulseLanterns, 80); }, { passive: true });
}
function applyProjectIndexFilter() {
  $$(".proj-index-card", projIndex).forEach(card => {
    const groupOk = projFilter === "All" || card.dataset.group === projFilter;
    const q = projQuery.trim().toLowerCase();
    const searchOk = !q || (card.dataset.search || "").includes(q);
    card.hidden = !(groupOk && searchOk);
  });
}
window.__setProjectFilter = f => {
  projFilter = f || "All";
  if (projIndex) {
    $$(".proj-filter", projIndex).forEach(x => x.setAttribute("aria-pressed", String(x.dataset.pf === projFilter)));
    applyProjectIndexFilter();
  }
};
function openProjectIndex() {
  if (!projIndex) return;
  projIndex.hidden = false;
  document.body.classList.add("proj-index-open");
  $("#projIndexSearch")?.focus();
}
function closeProjectIndex() {
  if (!projIndex) return;
  projIndex.hidden = true;
  document.body.classList.remove("proj-index-open");
}
bindProjStrip();
$("#projIndexClose")?.addEventListener("click", closeProjectIndex);
projIndex?.addEventListener("click", e => { if (e.target === projIndex) closeProjectIndex(); });
$$(".proj-filter", projIndex).forEach(b => b.addEventListener("click", () => {
  projFilter = b.dataset.pf;
  $$(".proj-filter", projIndex).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  applyProjectIndexFilter();
}));
$("#projIndexSearch")?.addEventListener("input", e => { projQuery = e.target.value; applyProjectIndexFilter(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && projIndex && !projIndex.hidden) { closeProjectIndex(); e.stopPropagation(); }
});

/* ---------- modal + demos ---------- */
const modal = $("#modal"), mBody = $("#mBody"); let lastFocus = null;
const bar = (label, pct, val, warm) => `<div class="meter"><span>${label}</span><div class="bar"><i class="${warm ? "warm" : ""}" data-w="${pct}"></i></div><b>${val}</b></div>`;
const grow = root => requestAnimationFrame(() => requestAnimationFrame(() => $$("i[data-w]", root).forEach(i => i.style.width = i.dataset.w + "%")));
function seg(items, onPick) {
  const d = mk(`<div class="seg" role="group">${items.map(([k, l], i) => `<button type="button" data-k="${k}" aria-pressed="${i === 0}">${l}</button>`).join("")}</div>`);
  d.onclick = e => { const b = e.target.closest("button"); if (!b) return; $$("button", d).forEach(x => x.setAttribute("aria-pressed", String(x === b))); onPick(b.dataset.k); };
  return d;
}
const DEMOS = {
  ocr() {
    const w = mk(`<div class="demo"><p><b>Try it.</b> Change what the model sees and watch its confidence.</p></div>`), v = mk("<div></div>");
    const D = { text: [.994, "2.2 × 10⁻¹¹", "A line of Hindi text. Mean confidence is about 99%, yet at the first character the correct answer gets almost no probability."],
      blank: [.990, "6.3 × 10⁻¹¹", "A blank page. Confidence barely changes."],
      noise: [.990, "same band", "Pure noise. Confidence again barely moves; across all conditions the correct-answer log probability stayed within 0.053 nats."] };
    const paint = k => { const d = D[k]; v.innerHTML = bar("Reported confidence", d[0] * 100, d[0].toFixed(3)) + bar("Probability of the correct first character", .6, d[1], true) + `<p class="note">${d[2]}</p>`; grow(v); };
    w.appendChild(seg([["text", "Text image"], ["blank", "Blank"], ["noise", "Noise"]], paint)); w.appendChild(v); paint("text"); return w;
  },
  rvc() {
    const w = mk(`<div class="demo"><p><b>Try it.</b> The same arithmetic problems with one surface change.</p></div>`), v = mk("<div></div>");
    const D = { orig: [.909, "Original wording."], num: [.958, "Numbers regenerated. Accuracy holds."], name: [.523, "Only the names changed. Accuracy falls by almost 40 points."] };
    const paint = k => { const d = D[k]; v.innerHTML = bar("Gemini, arithmetic accuracy", d[0] * 100, d[0].toFixed(3), k === "name") + `<p class="note">${d[1]} The paper also reports o3-mini on weighted interval scheduling going from 1.00 to 0.00 after a rename.</p>`; grow(v); };
    w.appendChild(seg([["orig", "Original"], ["num", "New numbers"], ["name", "Renamed entities"]], paint)); w.appendChild(v); paint("orig"); return w;
  },
  ddpm() {
    const w = mk(`<div class="demo"><p><b>Results.</b> Lower is better.</p></div>`);
    w.insertAdjacentHTML("beforeend", bar("Arbitrage penalty, market data", 90, "0.009", true) + bar("Arbitrage penalty, generated", 50, "0.005") + bar("Hedge error (CVaR 95%), Black-Scholes", 100, "baseline", true) + bar("Hedge error, RL agent", 39.9, "-60.1%"));
    grow(w); return w;
  }
};
function openModal(html, extra) {
  lastFocus = document.activeElement; mBody.innerHTML = html; if (extra) extra.forEach(x => x && mBody.appendChild(x));
  modal.classList.add("on"); $("#mClose").focus();
}
function closeModal() { modal.classList.remove("on"); if (lastFocus) lastFocus.focus(); }
const linksRow = links => links && links.length ? mk(`<div class="mlinks">${links.map(([l, u], i) => `<a class="btn ${i === 0 ? "primary" : ""}" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</div>`) : null;
function openProject(id) {
  const p = projBy(id); if (!p) return;
  const skills = projectSkills(p);
  const pairs = projectLinkPairs(p);
  const researchHint = p.researchId
    ? mk(`<p class="hint tight"><button type="button" class="linkish" data-go="1" data-research-story="${esc(p.researchId)}">Read the research story</button></p>`)
    : null;
  openModal(`<h3 id="mTitle">${esc(p.title)}</h3>
    <div class="chips">${skills.map(c => `<span class="chip">${esc(c)}</span>`).join("")}${p.private ? `<span class="chip warm">Private</span>` : ""}</div>
    <h4>The problem</h4><p>${esc(p.problem)}</p>
    <h4>What I built</h4><ul>${(p.built || []).map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    <h4>Why it matters</h4><p>${esc(p.impact)}</p>`,
    [researchHint, p.demo ? DEMOS[p.demo]?.() : null, linksRow(pairs)]);
}
function openResearchStory(id) {
  const r = researchBy(id); if (!r) return;
  const findings = (r.found || []).map(f => `<li>${esc(f)}</li>`).join("");
  const built = r.builtFrom
    ? mk(`<p class="hint tight"><span class="chip c">Built from it: ${esc(r.builtFrom)}</span> <a class="linkish" href="https://github.com/Adya6714/${esc(r.builtFrom)}" target="_blank" rel="noopener">Open repo</a></p>`)
    : null;
  openModal(`<h3 id="mTitle">${esc(r.title)}</h3>
    <div class="chips"><span class="chip c">${esc(researchTag(r))}</span><span class="chip">${esc(r.status || "")}</span></div>
    <h4>The question</h4><p>${esc(r.question)}</p>
    <h4>What I did</h4><p>${esc(r.did)}</p>
    <h4>What I found</h4><ul>${findings}</ul>
    <h4>What's next</h4><p>${esc(r.next)}</p>`,
    [built, linksRow(r.links)]);
}
function openNote(id) {
  const n = noteBy(id); if (!n) return;
  openModal(`<h3 id="mTitle">${esc(n.title)}</h3><div class="chips"><span class="chip c">${esc(n.project)}</span><span class="chip warm">${esc(n.headline)}</span></div>
    <h4>The question</h4><p>${esc(n.q)}</p><h4>What happened</h4><p>${esc(n.found)}</p><h4>Why it matters</h4><p>${esc(n.why)}</p>`, [linksRow([n.link])]);
}
function openJob(i) {
  const j = C.jobs[i]; if (!j) return;
  go(3);
  setTimeout(() => {
    const role = $(`.path-role[data-job="${i}"]`);
    role?.scrollIntoView({ block: "nearest" });
    setPathHighlight(i);
    role?.focus();
  }, preferReduced ? 0 : 500);
}
document.addEventListener("click", e => {
  if (e.target.closest(".meta a, .paper a, .thread-links a, .research-survey a, .strip-actions a, [data-stop-prop]")) return;
  if (e.target.closest("[data-project-index]")) { e.preventDefault(); return openProjectIndex(); }
  const story = e.target.closest("[data-research-story]"); if (story) return openResearchStory(story.dataset.researchStory);
  const card = e.target.closest(".thread-card[data-research]"); if (card) return openResearchStory(card.dataset.research);
  const n = e.target.closest("[data-note]"); if (n) return openNote(n.dataset.note);
  const p = e.target.closest("[data-proj]"); if (p) return openProject(p.dataset.proj);
  const j = e.target.closest(".banner[data-job]"); if (j) return openJob(+j.dataset.job);
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("on")) closeModal();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-proj]:not(button)")) { e.preventDefault(); openProject(e.target.dataset.proj); }
});
$("#mClose").onclick = closeModal;

/* ---------- resume + toast ---------- */
const toast = $("#toast"); let tt;
const say = m => { toast.textContent = m; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 3600); };
$$(".resume").forEach(b => { if (CFG.RESUME_URL) b.href = CFG.RESUME_URL; else b.addEventListener("click", e => { e.preventDefault(); say("Resume download is set up in the codebase (assets/Resume_Adya_Srivastava.pdf)."); }); });

mountDropCardUI();
/* ---------- Drop a card (stop 6) ---------- */
const dropForm = $("#dropForm"), dropMsg = $("#dropMsg"), dropAnon = $("#dropAnon");
const dropIdentity = $("#dropIdentity"), dropName = $("#dropName"), dropEmail = $("#dropEmail");
const dropStatus = $("#dropStatus"), dropSend = $("#dropSend"), dropType = $("#dropType");
const dropThanks = $("#dropThanks"), dropThanksMsg = $("#dropThanksMsg"), dropAgain = $("#dropAgain");
const dropStage = $("#dropCardStage"), dropFly = $("#dropFly"), dropFlap = $("#dropFlap");
const dropStamp = $("#dropStamp"), dropLeaves = $("#dropLeaves"), dropPostbox = $("#dropPostbox");
const dropHp = $("#dropHp");
let lastDropAt = 0;
const pickThankYou = () => {
  const list = C.suggest?.thankYou || ["Thank you."];
  return list[Math.floor(Math.random() * list.length)];
};
const syncDropAnon = () => {
  if (!dropAnon || !dropIdentity) return;
  dropIdentity.hidden = dropAnon.checked;
  if (dropAnon.checked) {
    if (dropName) dropName.value = "";
    if (dropEmail) dropEmail.value = "";
  }
};
dropAnon?.addEventListener("change", syncDropAnon); syncDropAnon();
$$(".card-type").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".card-type").forEach(b => { b.classList.remove("on"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("on"); btn.setAttribute("aria-pressed", "true");
    if (dropType) dropType.value = btn.dataset.cardType || "";
  });
});
[dropMsg, dropName, dropEmail].forEach(el => {
  if (!el) return;
  el.addEventListener("focus", () => { chatFocused = true; });
  el.addEventListener("blur", () => { chatFocused = false; });
});
function resetDropCard() {
  dropThanks.hidden = true;
  if (dropStage) dropStage.hidden = false;
  dropForm.hidden = false;
  dropForm.classList.remove("sending", "sent");
  dropFly.hidden = true; dropFly.className = "drop-fly";
  dropFlap?.classList.remove("closed");
  dropStamp.hidden = true;
  dropPostbox?.classList.remove("caught");
  if (dropLeaves) dropLeaves.innerHTML = "";
  dropStatus.textContent = "";
}
dropAgain?.addEventListener("click", () => { resetDropCard(); dropForm.reset(); syncDropAnon(); $$(".card-type").forEach((b, i) => { b.classList.toggle("on", i === 0); b.setAttribute("aria-pressed", String(i === 0)); }); if (dropType) dropType.value = (C.suggest?.types || ["Suggestion"])[0]; dropMsg?.focus(); });

document.addEventListener("click", e => {
  if (!e.target.closest("[data-drop-card]")) return;
  e.preventDefault();
  go(N - 1);
  setTimeout(() => {
    $("#dropCard")?.scrollIntoView({ block: "nearest", behavior: preferReduced ? "auto" : "smooth" });
    dropMsg?.focus();
  }, preferReduced ? 0 : 700);
});

function playDropAnimation(done) {
  if (preferReduced) { done(); return; }
  const text = (dropMsg?.value || "…").trim().slice(0, 40);
  dropFly.hidden = false;
  dropFly.textContent = text || "…";
  dropFly.className = "drop-fly";
  dropForm.classList.add("sending");
  requestAnimationFrame(() => dropFly.classList.add("fly"));
  setTimeout(() => dropFlap?.classList.add("closed"), 520);
  setTimeout(() => {
    dropStamp.hidden = false;
    dropPostbox?.classList.add("caught");
    if (dropLeaves) {
      dropLeaves.innerHTML = Array.from({ length: 8 }, (_, i) =>
        `<i style="--i:${i};--x:${(Math.random() * 60 - 30).toFixed(1)}px"></i>`).join("");
    }
  }, 700);
  setTimeout(() => { dropFly.hidden = true; done(); }, 1100);
}

async function deliverCard(payload) {
  const endpoint = CFG.SUGGESTION_ENDPOINT || CFG.SUGGEST_ENDPOINT || "";
  if (!endpoint) {
    const body = encodeURIComponent(
      `Type: ${payload.type}\nFrom: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
    );
    location.href = `mailto:${P.email || "srivastavadya@gmail.com"}?subject=${encodeURIComponent("Portfolio card")}&body=${body}`;
    return true;
  }
  const isFormspree = /formspree\.io/i.test(endpoint);
  const body = isFormspree
    ? { message: payload.message, type: payload.type, name: payload.name, email: payload.email || undefined, _gotcha: payload._gotcha }
    : {
      _subject: "Portfolio card" + (payload.anonymous ? " (anonymous)" : ""),
      _template: "table",
      _captcha: "false",
      message: payload.message,
      type: payload.type,
      name: payload.name,
      email: payload.email,
      page: location.href,
      _gotcha: payload._gotcha
    };
  const r = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) return false;
  try {
    const data = await r.json();
    if (data && (data.success === false || data.success === "false" || data.error)) return false;
  } catch { /* some endpoints return empty 200 */ }
  return true;
}

dropForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const text = dropMsg?.value.trim() || "";
  if (!text) { dropStatus.textContent = "Write something first."; return; }
  if (dropHp?.value) return; // honeypot
  const now = Date.now();
  if (now - lastDropAt < 10000) {
    dropStatus.textContent = "Please wait a few seconds before sending another.";
    return;
  }
  const sendLabel = C.suggest?.sendLabel || "Send card";
  if (dropSend) { dropSend.disabled = true; dropSend.textContent = "Sending…"; }
  dropStatus.textContent = "";
  const anon = !!dropAnon?.checked;
  const payload = {
    message: text,
    type: dropType?.value || "Suggestion",
    name: anon ? "anonymous" : (dropName?.value.trim() || "unnamed"),
    email: anon ? "" : (dropEmail?.value.trim() || ""),
    anonymous: anon,
    _gotcha: dropHp?.value || ""
  };
  let ok = false;
  try { ok = await deliverCard(payload); } catch { ok = false; }
  if (!ok) {
    dropStatus.textContent = `Couldn't send right now. Email ${P.email || "srivastavadya@gmail.com"} instead.`;
    if (dropSend) { dropSend.disabled = false; dropSend.textContent = sendLabel; }
    return;
  }
  playDropAnimation(() => {
    lastDropAt = Date.now();
    const thanks = pickThankYou();
    dropForm.hidden = true;
    dropStage.hidden = true;
    dropThanksMsg.textContent = thanks;
    dropThanks.hidden = false;
    say(thanks);
    dropForm.reset(); syncDropAnon();
    if (dropSend) { dropSend.disabled = false; dropSend.textContent = sendLabel; }
  });
});

/* ---------- Interview room ---------- */
const IV = C.interview || { tracks: [] };
const ivBrowse = $("#ivBrowse"), ivAnswer = $("#ivAnswer"), ivHits = $("#ivFreeHits");
let ivTrack = (IV.tracks[0] && IV.tracks[0].id) || "start";
const allIvQuestions = () => IV.tracks.flatMap(t => (t.questions || []).map(q => ({ ...q, track: t.id })));
const ivById = id => allIvQuestions().find(q => q.id === id);
const paraHtml = t => String(t || "").split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("");

function renderIvBrowse() {
  const track = IV.tracks.find(t => t.id === ivTrack) || IV.tracks[0];
  if (!track || !ivBrowse) return;
  ivBrowse.innerHTML = `<div class="ask-qlist">${(track.questions || []).map(q =>
    `<button type="button" class="ask-q" data-iv-open="${esc(q.id)}">${esc(q.q)}</button>`
  ).join("")}</div>`;
}
function openIvQuestion(id) {
  const item = ivById(id); if (!item || !ivAnswer) return;
  ivAnswer.hidden = false;
  if (ivHits) ivHits.hidden = true;
  const next = (item.next || []).map(nid => {
    const n = ivById(nid);
    return n ? `<button type="button" class="ask-follow" data-iv-open="${esc(nid)}">${esc(n.q)}</button>` : "";
  }).join("");
  ivAnswer.innerHTML = `<button type="button" class="ask-back" data-iv-close>← Back to questions</button>
    <h3 class="ask-qtitle">${esc(item.q)}</h3>
    <div class="ask-short">${paraHtml(item.short)}</div>
    ${item.long ? `<details class="ask-deep"><summary>Go deeper</summary><div class="ask-deep-body">${paraHtml(item.long)}</div></details>` : ""}
    ${item.challenge ? `<div class="ask-challenge"><span>What you might challenge</span><p>${esc(item.challenge)}</p></div>` : ""}
    ${next ? `<div class="ask-next"><span>You might ask next</span><div class="ask-qlist">${next}</div></div>` : ""}`;
  ivAnswer.scrollIntoView({ block: "nearest", behavior: preferReduced ? "auto" : "smooth" });
  MI.classList.add("speaking");
  setTimeout(() => MI.classList.remove("speaking"), preferReduced ? 400 : 1600);
}
function setIvTrack(id) {
  ivTrack = id;
  if (ivAnswer) { ivAnswer.hidden = true; ivAnswer.innerHTML = ""; }
  $$(".ask-tab").forEach(b => {
    const on = b.dataset.ivTrack === id;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", String(on));
  });
  renderIvBrowse();
}
renderIvBrowse();

function scoreQuestion(q, words) {
  const hay = `${q.q} ${q.short} ${q.long || ""}`.toLowerCase();
  let s = 0;
  for (const w of words) if (w.length > 2 && hay.includes(w)) s += w.length > 5 ? 2 : 1;
  if (q.q.toLowerCase().includes(words.slice(0, 4).join(" "))) s += 5;
  return s;
}
function closestQuestions(text, n = 3) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  return allIvQuestions()
    .map(q => ({ q, s: scoreQuestion(q, words) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(x => x.q);
}
async function askFreeform(question) {
  const q = question.trim(); if (!q || busy) return;
  busy = true;
  MI.classList.add("speaking");
  if (CFG.GUARDIAN_API) {
    if (ivHits) {
      ivHits.hidden = false;
      ivHits.innerHTML = `<p class="iv-thinking">Thinking…</p>`;
    }
    try {
      const r = await fetch(CFG.GUARDIAN_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      if (r.ok) {
        const d = await r.json();
        if (ivAnswer) {
          ivAnswer.hidden = false;
          ivAnswer.innerHTML = `<button type="button" class="ask-back" data-iv-close>← Back to questions</button>
            <h3 class="ask-qtitle">${esc(q)}</h3>
            <div class="ask-short">${paraHtml(d.answer || "")}</div>
            ${d.source ? `<p class="ask-source">From: ${esc(d.source)}</p>` : ""}`;
        }
        if (ivHits) ivHits.hidden = true;
        busy = false;
        setTimeout(() => MI.classList.remove("speaking"), 1200);
        return;
      }
    } catch (_) { /* fall through to bank search */ }
  }
  const hits = closestQuestions(q, 3);
  if (ivHits) {
    ivHits.hidden = false;
    ivHits.innerHTML = hits.length
      ? `<p class="iv-hits-label">Closest matches, pick one:</p><div class="ask-qlist">${hits.map(h =>
          `<button type="button" class="ask-q" data-iv-open="${esc(h.id)}">${esc(h.q)}</button>`
        ).join("")}</div>`
      : `<p class="iv-hits-label">No close match. Try a track above, or email ${esc(P.email || "srivastavadya@gmail.com")}.</p>`;
  }
  busy = false;
  setTimeout(() => MI.classList.remove("speaking"), 600);
}

document.addEventListener("click", e => {
  const tab = e.target.closest("[data-iv-track]");
  if (tab) { setIvTrack(tab.dataset.ivTrack); return; }
  if (e.target.closest("[data-iv-close]")) {
    if (ivAnswer) { ivAnswer.hidden = true; ivAnswer.innerHTML = ""; }
    MI.classList.remove("speaking");
    return;
  }
  const open = e.target.closest("[data-iv-open]");
  if (open) {
    const id = open.dataset.ivOpen;
    const item = ivById(id);
    if (item && item.track && item.track !== ivTrack) setIvTrack(item.track);
    if (!e.target.closest(".panel")) go(5);
    setTimeout(() => openIvQuestion(id), e.target.closest(".panel") ? 0 : 550);
  }
});

const ivForm = $("#ivFreeForm"), ivIn = $("#ivFreeIn");
if (ivForm) ivForm.onsubmit = e => {
  e.preventDefault();
  const v = ivIn?.value.trim();
  if (!v) return;
  if (ivIn) ivIn.value = "";
  askFreeform(v);
};
if (ivIn) {
  ivIn.addEventListener("focus", () => { chatFocused = true; });
  ivIn.addEventListener("blur", () => { chatFocused = false; });
}

/* Show-all modals for projects */
document.addEventListener("click", e => {
  if (e.target.closest("[data-all-proj]")) {
    openModal(`<h3 id="mTitle">All projects</h3><div class="list">${C.projects.map(p => `<div class="item" role="button" tabindex="0" data-proj="${p.id}"><h3>${esc(p.title)}</h3><p>${esc(p.line)}</p></div>`).join("")}</div>`);
  }
});

/* ---------- debug mode (?debug=1) ---------- */
(function initDebugMode() {
  if (!/[?&]debug=1(?:&|$)/.test(location.search)) return;
  document.body.classList.add("debug-mode");

  const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  grid.setAttribute("class", "debug-grid ov");
  grid.setAttribute("viewBox", `0 0 ${MAP_W} ${MAP_H}`);
  grid.setAttribute("width", String(MAP_W));
  grid.setAttribute("height", String(MAP_H));
  grid.setAttribute("aria-hidden", "true");
  let gridHtml = "";
  for (let x = 0; x <= MAP_W; x += 50) {
    gridHtml += `<line x1="${x}" y1="0" x2="${x}" y2="${MAP_H}"/>`;
    if (x % 100 === 0) gridHtml += `<text x="${x + 2}" y="12">${x}</text>`;
  }
  for (let y = 0; y <= MAP_H; y += 50) {
    gridHtml += `<line x1="0" y1="${y}" x2="${MAP_W}" y2="${y}"/>`;
    if (y % 100 === 0 && y > 0) gridHtml += `<text x="2" y="${y - 2}">${y}</text>`;
  }
  grid.innerHTML = gridHtml;
  MI.appendChild(grid);

  const hud = mk(`<aside class="debug-hud" aria-label="Debug tools">
    <div class="debug-coords" id="debugCoords">map: --, --</div>
    <div class="debug-jumper" id="debugJumper">${STOPS.map((s, i) =>
      `<button type="button" data-go="${i}">${i} ${esc(s.label)}</button>`).join("")}</div>
    <div class="debug-drop">
      <label for="debugDropLog">Last drop</label>
      <textarea id="debugDropLog" rows="4" readonly></textarea>
      <button type="button" class="btn sm" id="debugCopy">Copy</button>
    </div>
  </aside>`);
  document.body.appendChild(hud);
  const coordsEl = $("#debugCoords"), dropLog = $("#debugDropLog"), copyBtn = $("#debugCopy");

  const screenToMap = (clientX, clientY) => {
    const host = $("#map");
    const r = host.getBoundingClientRect();
    return {
      x: (clientX - r.left) / cam.k + cam.x0,
      y: (clientY - r.top) / cam.k + cam.y0
    };
  };

  addEventListener("pointermove", e => {
    const p = screenToMap(e.clientX, e.clientY);
    coordsEl.textContent = `map: ${p.x.toFixed(1)}, ${p.y.toFixed(1)}  |  k=${cam.k.toFixed(2)}`;
  }, { passive: true });

  let drag = null;
  const onDragMove = e => {
    if (!drag) return;
    e.preventDefault();
    const p = screenToMap(e.clientX, e.clientY);
    const nx = Math.round(p.x - drag.ox);
    const ny = Math.round(p.y - drag.oy);
    drag.el.dataset.mapX = String(nx);
    drag.el.dataset.mapY = String(ny);
    layoutOverlays();
  };
  const onDragEnd = e => {
    if (!drag) return;
    const el = drag.el;
    const left = Math.round(parseFloat(el.dataset.mapX) || 0);
    const top = Math.round(parseFloat(el.dataset.mapY) || 0);
    const payload = { id: el.dataset.ovId || el.className, left, top };
    console.log("[debug drop]", payload);
    dropLog.value = JSON.stringify(payload, null, 2);
    el.classList.remove("debug-dragging");
    drag = null;
    removeEventListener("pointermove", onDragMove);
    removeEventListener("pointerup", onDragEnd);
    removeEventListener("pointercancel", onDragEnd);
  };

  MI.addEventListener("pointerdown", e => {
    const el = e.target.closest(".ov");
    if (!el || !MI.contains(el)) return;
    if (getComputedStyle(el).pointerEvents === "none") {
      el.style.pointerEvents = "auto";
    }
    e.preventDefault();
    e.stopPropagation();
    const p = screenToMap(e.clientX, e.clientY);
    const left = parseFloat(el.dataset.mapX) || 0;
    const top = parseFloat(el.dataset.mapY) || 0;
    drag = { el, ox: p.x - left, oy: p.y - top };
    el.classList.add("debug-dragging");
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    addEventListener("pointermove", onDragMove);
    addEventListener("pointerup", onDragEnd);
    addEventListener("pointercancel", onDragEnd);
  });

  copyBtn.addEventListener("click", async () => {
    const text = dropLog.value || "";
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1200);
    } catch {
      dropLog.select();
      copyBtn.textContent = "Select and copy";
    }
  });

  $$(".ov").forEach(el => {
    if (getComputedStyle(el).pointerEvents === "none") el.classList.add("debug-force-hit");
  });
})();


function mountDropCardUI() {
  const tab = mk(`<button type="button" class="drop-edge-tab" id="dropEdgeTab" aria-label="Drop me a card"><span>Drop me a card</span></button>`);
  const drawer = mk(`<aside class="drop-drawer" id="dropDrawer" hidden aria-label="Drop me a card drawer">
    <button type="button" class="x" id="dropDrawerClose" aria-label="Close">&times;</button>
    <div class="drop-drawer-body" id="dropDrawerBody"></div>
  </aside>`);
  const final = mk(`<aside class="drop-final" id="dropFinal" hidden aria-label="Drop me a card"></aside>`);
  document.body.appendChild(tab);
  document.body.appendChild(drawer);
  document.body.appendChild(final);
  const card = mk(dropCardHTML());
  $("#dropDrawerBody", drawer).appendChild(card);
  const openDrawer = () => { drawer.hidden = false; document.body.classList.add("drop-drawer-open"); };
  const closeDrawer = () => { drawer.hidden = true; document.body.classList.remove("drop-drawer-open"); };
  tab.addEventListener("click", openDrawer);
  $("#dropDrawerClose", drawer).addEventListener("click", closeDrawer);
  document.addEventListener("click", e => {
    if (e.target.closest("[data-drop-card]")) {
      e.preventDefault();
      if (document.body.classList.contains("at-about")) return;
      openDrawer();
    }
  });
  window.__showDropFinal = on => {
    if (on) {
      final.appendChild(card);
      final.hidden = false;
      tab.hidden = true;
      closeDrawer();
      tab.classList.remove("wiggle");
    } else {
      $("#dropDrawerBody", drawer).appendChild(card);
      final.hidden = true;
      tab.hidden = false;
    }
  };
  window.__nudgeDropTab = () => {
    if (!final.hidden) return;
    tab.classList.add("wiggle");
    setTimeout(() => tab.classList.remove("wiggle"), 1200);
  };
}


/* ---------- start ---------- */
addEventListener("resize", resize);
refreshPanelRects();
new ResizeObserver(measure).observe(document.body);
MI.classList.add("plate-ph");
resize();
const glOk = initGL();
const done = () => document.body.classList.remove("loading");
const plateUrl = () => {
  if (!gl) return A.plate3x || A.plate;
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  return max >= 5056 ? (A.plate4x || A.plate) : (A.plate3x || A.plate);
};
const clearPlatePh = (imgUrl) => {
  MI.classList.remove("plate-ph");
  if (imgUrl) MI.style.backgroundImage = `url(${imgUrl})`;
};
if (glOk) {
  Promise.all([loadImg(plateUrl()), loadImg(A.flow), loadImg(A.foam)]).then(([pl, fl, fo]) => {
    upload(0, pl, gl.RGB, { mipmap: true }); upload(1, fl, gl.RGB); upload(2, fo, gl.LUMINANCE);
    texReady = true; dirty = true; clearPlatePh(); done();
  }).catch(() => { MI.classList.add("fallback"); clearPlatePh(A.plate3x || A.plate); done(); });
} else { MI.classList.add("fallback"); clearPlatePh(A.plate3x || A.plate); calmBtn.hidden = true; done(); }
mountConstellation();
mountProjectRing();
if (window.__showConstellation) window.__showConstellation(true);
requestAnimationFrame(frame);
})();
