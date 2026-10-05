(() => {
"use strict";
const C = window.CONTENT, CFG = window.SITE_CONFIG || {}, A = window.ASSETS || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const mk = h => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const ext = (u, label) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const MAP_W = 848, MAP_H = 1264;

/* ---------- journey stops: map focus point, visible width (map px), screen anchor ---------- */
/* Wider visible widths so map elements stay on-screen (less zoomed-in). */
const STOPS = [
  { id: "hero",       label: "Waterfall",  side: "hero",   d: [410, 175, 680, .68, .40], m: [420, 190, 460, .5, .22] },
  { id: "ideas",      label: "Research",   side: "left",   d: [390, 340, 500, .70, .40], m: [380, 340, 360, .55, .26] },
  { id: "projects",   label: "Projects",   side: "left",   d: [400, 560, 640, .52, .42], m: [390, 560, 420, .48, .28] },
  { id: "experience", label: "Experience", side: "left",   d: [620, 420, 720, .70, .40], m: [600, 430, 440, .58, .26] },
  { id: "skills",     label: "Skills",     side: "right",  d: [280, 820, 520, .38, .46], m: [260, 810, 360, .42, .24] },
  { id: "shelf",      label: "Shelf",      side: "right",  d: [170, 885, 500, .34, .48], m: [160, 885, 340, .5, .22] },
  { id: "guardian",   label: "Ask",        side: "left",   d: [460, 900, 480, .58, .48], m: [450, 900, 340, .5, .22] },
  { id: "about",      label: "About",      side: "center", d: [440, 1180, 848, .5, .72], m: [445, 1200, 420, .5, .32] }
];
const N = STOPS.length;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const smoothstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const ytId = u => { const m = String(u).match(/(?:youtu\.be\/|v=)([\w-]{11})/); return m ? m[1] : null; };

/* ---------- panels ---------- */
const P = C.person;
const resumeBtn = (cls = "btn primary") => `<a class="${cls} resume" href="#" download>Resume</a>`;
function heroPanel() {
  const paras = P.aboutIntro || [];
  const intro = paras.map((p, i) => `<p class="hero-p${i > 0 ? " hero-p-secondary" : ""}">${esc(p)}</p>`).join("");
  return `<h1>${esc(P.name)}</h1>
  <div class="hero-intro">${intro}</div>
  <div class="chips">${P.proof.map(p => `<span class="chip c">${esc(p)}</span>`).join("")}</div>
  <div class="row">${resumeBtn()}<button class="btn" data-go="1">Research</button><a class="btn" href="${P.github}" target="_blank" rel="noopener">GitHub</a></div>
  <div class="status"><i></i>${esc(P.status)}</div>
  <p class="hint">Scroll to travel downstream.</p>`;
}
function mountSlipDock() {
  const prompts = (C.suggest?.prompts || []).map((t, i) =>
    `<button type="button" class="slip-chip" data-slip-prompt="${esc(t)}" style="--i:${i}">${esc(t)}</button>`).join("");
  const dock = mk(`<aside class="slip-dock" id="slipDock" data-lenis-prevent aria-label="Leave a slip">
    <div class="slip-chute" aria-hidden="true"><div class="slip-chute-glow"></div></div>
    <button type="button" class="slip-dock-tab" id="slipDockTab" aria-expanded="false" aria-controls="slipDockPanel">
      <span class="slip-tab-icon">✉</span><span class="slip-tab-label">Leave a slip</span>
    </button>
    <div class="slip-dock-panel" id="slipDockPanel" hidden>
      <button type="button" class="slip-dock-close" id="slipDockClose" aria-label="Close">&times;</button>
      <div class="slips" id="slips">
        <h3 class="about-h3">${esc(C.suggest?.title || "Leave a slip")}</h3>
        <p class="about-muted">${esc(C.suggest?.blurb || "")}</p>
        <div class="slip-mailbox" aria-hidden="true">
          <div class="slip-mailbox-slot"></div>
          <div class="slip-mailbox-body"></div>
        </div>
        <div class="slip-deck">${prompts}</div>
        <div class="slip-thanks" id="slipThanks" hidden>
          <div class="slip-thanks-sparkles" aria-hidden="true"></div>
          <p class="slip-thanks-msg" id="slipThanksMsg"></p>
          <button type="button" class="btn sm" id="slipThanksAgain">Leave another</button>
        </div>
        <form class="slip-form suggestForm" id="suggestForm" novalidate>
          <label class="sr-only" for="slipMsg">Your suggestion</label>
          <textarea id="slipMsg" name="message" rows="4" maxlength="1200" required placeholder="${esc(C.suggest?.placeholder || "")}"></textarea>
          <div class="slip-meta">
            <label class="anon"><input type="checkbox" class="slipAnon" id="slipAnon" checked> Stay anonymous</label>
            <div class="slip-identity" id="slipIdentity" hidden>
              <input class="slipName" id="slipName" name="name" type="text" maxlength="80" placeholder="Name" autocomplete="name">
              <input class="slipContact" id="slipContact" name="contact" type="text" maxlength="120" placeholder="Email or handle" autocomplete="email">
            </div>
          </div>
          <button class="btn primary slipSend" type="submit">Drop it in the chute</button>
          <p class="fine slipStatus" id="slipStatus" role="status"></p>
        </form>
      </div>
    </div>
  </aside>`);
  document.body.appendChild(dock);
}
function ideasPanel() {
  const main = C.papers.filter(p => p.kind === "published" || p.kind === "preprint");
  const other = C.papers.filter(p => p.kind !== "published" && p.kind !== "preprint");
  const highlights = ["n-rename", "n-inject", "n-pos0"].map(id => C.notes.find(n => n.id === id)).filter(Boolean);
  return `<h2>Research</h2>
  <p class="sub research-thesis">Papers and questions: how models behave under probes, and when confidence matches evidence.</p>
  <p class="hint tight">Research is the question and the write-up. Projects (next stop) are the systems and code I built to answer it.</p>
  <div class="sect">Papers &amp; preprints</div>
  <div class="paper-stack">${main.map(p => `
    <article class="paper paper-card">
      <span class="badge ${p.kind}">${esc(p.status)}</span>
      <b>${esc(p.title)}</b>
      <small>${esc(p.note)}</small>
      ${p.links.length ? `<div class="links">${p.links.map(([l, u]) => ext(u, l)).join("")}</div>` : ""}
    </article>`).join("")}</div>
  ${other.length ? `<div class="sect">More writing</div>
  <div class="paper-mini">${other.map(p => `
    <div class="paper-row">
      <span class="badge ${p.kind}">${esc(p.status)}</span>
      <span class="paper-row-body"><b>${esc(p.title)}</b><small>${esc(p.note)}</small>
      ${p.links.length ? `<span class="links">${p.links.map(([l, u]) => ext(u, l)).join("")}</span>` : `<span class="chip warm">In progress</span>`}</span>
    </div>`).join("")}</div>` : ""}
  <div class="sect">Highlighted findings</div>
  <p class="hint tight">Three results I keep coming back to. Open for the full note.</p>
  <div class="list note-list">${highlights.map(n => `
    <button class="item note-item" data-note="${n.id}">
      <span class="note-proj">${esc(n.project)}</span>
      <h3>${esc(n.headline)}</h3>
      <p>${esc(n.title)}</p>
    </button>`).join("")}</div>
  <button class="btn sm" type="button" data-all-notes>All ${C.notes.length} findings</button>`;
}
const GROUPS = ["All", "Research", "Agents & systems", "Quant"];
function projectsPanel() {
  return `<h2>Projects</h2><p class="sub">Everything I have built. Skills are on each card. A few featured ones sit on the river as shortcuts — the full list is here.</p>
  <div class="filters" role="group" aria-label="Filter projects">${GROUPS.map((g, i) => `<button type="button" data-f="${g}" aria-pressed="${i === 0}">${g}</button>`).join("")}</div>
  <div class="list project-list">${C.projects.map(p => `<div class="item" role="button" tabindex="0" data-proj="${p.id}" data-groups="${esc(p.group.join("|"))}">
    <h3>${esc(p.title)}</h3><p>${esc(p.line)}</p>
    <div class="meta">${p.chips.map(c => `<span class="chip">${esc(c)}</span>`).join("")}${
      p.links.length ? p.links.map(([l, u]) => ext(u, l)).join("") : `<span class="chip warm">Private</span>`
    }</div></div>`).join("")}</div>`;
}
function expPanel() {
  return `<h2>The path so far</h2><p class="sub">Roles I've held — details open below. Click a company on the arches to jump here too.</p>
  ${C.jobs.map((j, i) => `<div class="job open" data-job="${i}"><button aria-expanded="true"><span class="mono" style="background:${j.color}">${esc(j.initial)}</span>
    <span><h3>${esc(j.co)}</h3><small>${esc(j.role)}, ${esc(j.when)}</small></span><span class="tog">Hide</span></button>
    <ul>${j.pts.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}`;
}
function skillsPanel() {
  return `<h2>Skills</h2><p class="sub">Hover a skill to see where I used it.</p><div class="skills">
  ${C.skills.map(([g, items]) => `<div class="skrow"><span>${esc(g)}</span><div class="chips">${items.map(([n, u]) => `<span class="sk" tabindex="0">${esc(n)}<span class="tip">Used in: ${esc(u)}</span></span>`).join("")}</div></div>`).join("")}</div>`;
}
const GRADS = [["#0b3a4a", "#2a1b5c"], ["#0b4a3f", "#143a63"], ["#3b1f5c", "#0b3a4a"], ["#5c3b1f", "#0b3a4a"], ["#1f4a5c", "#0b2f2a"], ["#0b4a3f", "#4a1f5c"]];
const PLAY = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M6 4l14 8-14 8z"/></svg>';
function shelfPanel() {
  const b = C.shelf.book; let gi = 0;
  const TYPE_TONE = { Blog: ["#1a3d38", "#0b2a32"], Video: null, Paper: ["#2a1b5c", "#0b3a4a"], Book: ["#5c3b1f", "#0b3a4a"], Profile: ["#1f4a5c", "#0b2f2a"] };
  return `<h2>On my shelf</h2>
  <p class="sub">Things I study from. For poetry and older product write-ups, open <button type="button" class="linkish" data-open-more>More</button>.</p>
  <div class="book">
    <div class="cover">${esc(b.title)}<i>${esc(b.status)}</i></div>
    <div>
      <small>My study notes</small>
      <h3>${esc(b.title)}</h3>
      <p>${esc(b.blurb)}</p>
      ${b.chapters.length ? `<ol>${b.chapters.slice(0, 5).map(c => `<li>${esc(c)}</li>`).join("")}</ol>` : ""}
      ${b.link ? `<div class="row" style="margin:0"><a class="btn primary sm" href="${esc(b.link)}" target="_blank" rel="noopener">Open on Drive</a></div>` : `<span class="chip warm">Link coming soon</span>`}
    </div>
  </div>
  ${C.shelf.rows.map(r => `<div class="sect">${esc(r.topic)}</div><div class="rail" data-lenis-prevent>${r.items.map(it => {
    const yid = it.type === "Video" ? ytId(it.url) : null;
    const tone = TYPE_TONE[it.type] || GRADS[gi++ % GRADS.length];
    const bg = yid
      ? `background-image:url(https://img.youtube.com/vi/${yid}/hqdefault.jpg);background-size:cover;background-position:center`
      : `background:linear-gradient(135deg,${tone[0]},${tone[1]})`;
    const local = it.url && !/^https?:\/\//i.test(it.url);
    return `<a class="vid" href="${esc(it.url)}" ${local ? "" : 'target="_blank" rel="noopener"'}${local ? " download" : ""}><div class="thumb" style="${bg}"><span class="ty">${esc(it.type)}</span>${it.type === "Video" ? `<span class="play">${PLAY}</span>` : ""}<span class="len">${esc(it.len)}</span></div>
    <h5>${esc(it.t)}</h5><small>${esc(it.by)}</small>${it.why ? `<em>${esc(it.why)}</em>` : ""}</a>`; }).join("")}</div>`).join("")}
  ${C.shelf.sampleNote ? `<p class="hint">${esc(C.shelf.sampleNote)}</p>` : ""}`;
}
function guardianPanel() {
  const A = C.ask || {};
  const layers = A.layers || [];
  const tabs = layers.map((L, i) => `<button type="button" class="ask-tab${i === 0 ? " on" : ""}" data-ask-layer="${esc(L.id)}" aria-pressed="${i === 0}">${esc(L.label)}</button>`).join("");
  return `<h2>${esc(A.title || "Ask")}</h2>
  <p class="ask-kicker">The stone guardian</p>
  <p class="sub">${esc(A.blurb || "")}</p>
  <div class="guardian-chat">
    <div class="guardian-live" aria-hidden="true"><span class="guardian-pulse"></span> Awake when you ask</div>
    <div class="chat">
      <div class="msgs" id="msgs" aria-live="polite"><div class="m b">${esc(C.guardian?.intro || "Ask me anything — type your own question below, or pick a thread.")}</div></div>
      <form class="ask" id="askForm"><input id="askIn" type="text" placeholder="Type your own question…" aria-label="Your question" autocomplete="off"><button class="btn primary" type="submit">Ask</button></form>
    </div>
  </div>
  <div class="about-divider"></div>
  <p class="hint tight">Or walk a prepared interview thread:</p>
  <div class="ask-tabs" role="tablist">${tabs}</div>
  <div id="askBrowse" class="ask-browse"></div>
  <div id="askAnswer" class="ask-answer" hidden></div>`;
}
function aboutPanel() {
  const photo = CFG.PHOTO_URL
    ? `<img class="about-photo" src="${esc(CFG.PHOTO_URL)}" alt="${esc(P.name)}" width="112" height="112">`
    : `<span class="about-photo placeholder" aria-hidden="true">AS</span>`;
  const core = (P.aboutCore || []).map(p => `<p class="about-p">${esc(p)}</p>`).join("");
  return `<div class="about-head">${photo}<div><h2>About me</h2></div></div>
  <div class="about-block">${core}</div>
  <div class="row">${resumeBtn()}<a class="btn" href="mailto:${P.email}">Email</a><a class="btn" href="${P.github}" target="_blank" rel="noopener">GitHub</a><a class="btn" href="${P.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a class="btn" href="${P.openreview}" target="_blank" rel="noopener">OpenReview</a></div>
  <p class="hint tight">Want to say something? Use <button type="button" class="linkish" data-slip-open>Leave a slip</button> on the right.</p>`;
}
const BUILD = [heroPanel, ideasPanel, projectsPanel, expPanel, skillsPanel, shelfPanel, guardianPanel, aboutPanel];
mountSlipDock();
const panels = STOPS.map((s, i) => {
  const side = s.side === "hero" ? "left hero" : s.side;
  const el = mk(`<section class="panel ${side}" data-i="${i}" data-lenis-prevent aria-label="${esc(s.label)}">${BUILD[i]()}</section>`);
  $("#panels").appendChild(el); return el;
});
$("#dots").innerHTML = STOPS.map((s, i) => `<button data-go="${i}" aria-label="${esc(s.label)}"><span>${esc(s.label)}</span></button>`).join("");
$("#track").innerHTML = STOPS.map(() => "<div></div>").join("");

/* ---------- map overlays (positions in map pixels) ---------- */
const MI = $("#mapInner");
const ov = (html, x, y, w, h, rot = 0, extra = "", mapGroup = "") => {
  const el = mk(html); el.classList.add("ov");
  if (mapGroup) { el.classList.add("map-ov"); el.dataset.mapGroup = mapGroup; }
  el.style.cssText += `left:${x}px;top:${y}px;${w ? `width:${w}px;` : ""}${h ? `height:${h}px;` : ""}${rot ? `transform:rotate(${rot}deg);` : ""}${extra}`;
  MI.appendChild(el); return el;
};
const noteBy = id => C.notes.find(n => n.id === id), projBy = id => C.projects.find(p => p.id === id);
/* Featured river cards — research trio + two systems highlights (full list is in the Projects panel). */
[["p-rvc", 268, 500, 220, 108, -2, 5], ["p-ocr", 286, 585, 236, 112, -2, 4], ["p-ddpm", 304, 668, 220, 118, -3, 3],
 ["p-fraud", 292, 740, 210, 100, -2, 2], ["p-mesh", 310, 812, 210, 100, -2, 1]].forEach(([id, x, y, w, h, r, z]) => {
  const p = projBy(id); if (!p) return;
  const cta = (p.group || []).includes("Research") ? "Open research" : "Open project";
  ov(`<button class="pcard" data-proj="${id}" style="display:flex;flex-direction:column;justify-content:flex-end"><b>${esc(p.title)}</b><span>${esc(p.line)}</span><em>${esc(cta)}</em></button>`, x, y, w, h, r, `z-index:${z};`, "2");
});
/* Arch banners: all four roles */
[[0, 674, 274, 32, 68], [1, 696, 400, 40, 88], [2, 112, 447, 39, 84], [3, 640, 520, 36, 76]].forEach(([ji, x, y, w, h]) => {
  const j = C.jobs[ji]; if (!j) return;
  ov(`<button class="banner" data-job="${ji}" style="background:${j.color}" aria-label="${esc(j.co)}">${esc(j.initial)}</button>`, x, y, w, h, 0, "z-index:3;", "3");
  const t = mk(`<div class="tag map-ov" data-map-group="3">${esc(j.co.split(" (")[0])}</div>`); t.style.left = (x + w / 2) + "px"; t.style.top = (y - 22) + "px"; t.style.zIndex = "4"; MI.appendChild(t);
});
[[0, 140, 780], [1, 260, 760], [2, 360, 800], [3, 220, 860], [4, 340, 900]].forEach(([gi, x, y]) => {
  const [g, items] = C.skills[gi];
  ov(`<button class="crystal" data-go="4">${esc(g)}<span class="pop">${items.map(i => esc(i[0])).join(", ")}</span></button>`, x, y, 0, 0, 0, "", "4");
});
{
  const items = C.shelf.rows.flatMap(r => r.items).slice(0, 4);
  ov(`<button class="shelfov" data-go="5"><span class="bk">${esc(C.shelf.book.title)}</span>${items.map((it, i) => `<span class="th" style="background:linear-gradient(135deg,${GRADS[i][0]},${GRADS[i][1]})">${esc(it.t)}</span>`).join("")}<span class="cap">On my shelf</span></button>`, 30, 812, 238, 140, 0, "", "5");
}
const eyes = [mk('<i class="eye map-ov" data-map-group="6"></i>'), mk('<i class="eye map-ov" data-map-group="6"></i>')];
eyes[0].style.cssText = "left:415px;top:881px"; eyes[1].style.cssText = "left:439px;top:881px"; eyes.forEach(e => MI.appendChild(e));
const MAP_GROUP_FOR_STOP = ["", "1", "2", "3", "4", "5", "6", "7"];
function updateMapOverlays(stopIdx) {
  MI.dataset.stop = String(stopIdx);
  const show = MAP_GROUP_FOR_STOP[stopIdx] || "";
  $$(".map-ov", MI).forEach(el => {
    const on = el.dataset.mapGroup === show;
    el.style.opacity = on ? "1" : "0";
    el.style.pointerEvents = on ? "auto" : "none";
  });
  MI.classList.toggle("guardian-awake", stopIdx === 6);
}
updateMapOverlays(0);

/* ---------- Lenis scroll + hold / travel / snap ---------- */
let W = innerWidth, H = innerHeight, docH = 1, scrollY = 0, scrollDir = 1, lastF = 0;
const measure = () => { W = innerWidth; H = innerHeight; docH = document.documentElement.scrollHeight; };
const range = () => Math.max(1, docH - H);
const progressFromScroll = y => clamp(y / range(), 0, 1) * (N - 1);
const scrollForStop = i => (clamp(i, 0, N - 1) / (N - 1)) * range();

const preferReduced = reducedMotion();
const lenis = window.Lenis ? new Lenis({
  duration: preferReduced ? 0 : 0.72,
  easing: t => 1 - Math.pow(1 - t, 3),
  smoothWheel: !preferReduced,
  syncTouch: true,
  touchMultiplier: 1.6,
  wheelMultiplier: 1.35,
  lerp: preferReduced ? 1 : 0.14
}) : null;

let snapping = false, snapTimer = null, chatFocused = false, busy = false;
function canSnap() {
  const m = document.getElementById("modal");
  return !snapping && !chatFocused && !busy && !(m && m.classList.contains("on"));
}
function snapToNearest() {
  if (!canSnap()) return;
  const i = clamp(Math.round(progressFromScroll(scrollY)), 0, N - 1);
  const target = scrollForStop(i);
  if (Math.abs(scrollY - target) < 4) return;
  snapping = true;
  go(i, preferReduced ? 0 : 0.5, () => { snapping = false; });
}
function onScrollUpdate(y) {
  const prev = scrollY;
  scrollY = y;
  if (y > prev + 0.5) scrollDir = 1; else if (y < prev - 0.5) scrollDir = -1;
  dirty = true;
  if (!canSnap()) return;
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearest, 110);
}
if (lenis) {
  lenis.on("scroll", ({ scroll }) => onScrollUpdate(scroll));
} else {
  addEventListener("scroll", () => onScrollUpdate(window.scrollY), { passive: true });
}

function go(i, duration, done) {
  i = clamp(i | 0, 0, N - 1);
  const top = scrollForStop(i);
  const d = duration == null ? (preferReduced ? 0 : 0.55) : duration;
  if (lenis) {
    lenis.scrollTo(top, { duration: d, force: true, lock: true, onComplete: () => done && done() });
  } else {
    window.scrollTo({ top, behavior: d === 0 ? "auto" : "smooth" });
    if (done) setTimeout(done, d * 1000 + 40);
  }
}
document.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); go(+g.dataset.go); } });

/* Keyboard: one stop at a time */
addEventListener("keydown", e => {
  if (chatFocused) return;
  const m = document.getElementById("modal");
  if (m && m.classList.contains("on")) return;
  const tag = (e.target && e.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  const cur = clamp(Math.round(progressFromScroll(scrollY)), 0, N - 1);
  if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(cur + 1); }
  else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === "Home") { e.preventDefault(); go(0); }
  else if (e.key === "End") { e.preventDefault(); go(N - 1); }
});

/* ---------- camera: hold centre of each stop, ease only in travel bands ---------- */
const lerp = (a, b, t) => a + (b - a) * t;
const cam = { x0: 0, y0: 0, vw: MAP_W, vh: MAP_H, k: 1 };
/** Map scroll progress f → camera parameter with 50% hold per stop. */
function cameraParam(f) {
  if (preferReduced) return clamp(Math.round(f), 0, N - 1);
  const nearest = clamp(Math.round(f), 0, N - 1);
  const d = f - nearest;
  if (Math.abs(d) <= 0.25) return nearest;
  if (d > 0) {
    const u = clamp((d - 0.25) / 0.5, 0, 1);
    return nearest + smoothstep(0, 1, u);
  }
  const u = clamp((-d - 0.25) / 0.5, 0, 1);
  return nearest - smoothstep(0, 1, u);
}
function computeCam(f) {
  const mob = W < 760 || W / H < .9;
  const cf = cameraParam(f);
  const i = clamp(Math.floor(cf), 0, N - 1), j = Math.min(N - 1, i + 1), t = cf - i;
  const a = mob ? STOPS[i].m : STOPS[i].d, b = mob ? STOPS[j].m : STOPS[j].d;
  const cx = lerp(a[0], b[0], t), cy = lerp(a[1], b[1], t), ax = lerp(a[3], b[3], t), ay = lerp(a[4], b[4], t);
  let vw = Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), t));
  let k = W / vw;
  if (H / k > MAP_H) k = H / MAP_H;
  if (W / k > MAP_W) k = W / MAP_W;
  vw = W / k; const vh = H / k;
  cam.x0 = clamp(cx - ax * vw, 0, MAP_W - vw); cam.y0 = clamp(cy - ay * vh, 0, MAP_H - vh);
  cam.vw = vw; cam.vh = vh; cam.k = k;
}

/* ---------- WebGL scene ---------- */
const canvas = $("#scene");
let gl = null, prog = null, U = {}, texReady = false;
function shader(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; } return s; }
function initGL() {
  try { gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }); } catch (e) { gl = null; }
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
function upload(unit, img, fmt) {
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
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
let rs = 1;
function resize() {
  measure();
  /* Full device pixels for a sharp painting (cap 2×; gentle throttle only on huge canvases). */
  const dpr = Math.min(Math.max(devicePixelRatio || 1, 1), 2);
  rs = dpr;
  const px = W * H * rs * rs;
  if (px > 9e6) rs = Math.max(1.25, rs * Math.sqrt(9e6 / px));
  canvas.width = Math.round(W * rs); canvas.height = Math.round(H * rs);
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  fxc.width = Math.round(W * Math.min(devicePixelRatio || 1, 2));
  fxc.height = Math.round(H * Math.min(devicePixelRatio || 1, 2));
  fxc.style.width = W + "px"; fxc.style.height = H + "px";
  fx.setTransform(fxc.width / W, 0, 0, fxc.height / H, 0, 0);
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  dirty = true;
}

/* ---------- effects layer ---------- */
const fxc = $("#fx"), fx = fxc.getContext("2d");
const flies = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random(), z: .35 + Math.random() * .9, p: Math.random() * 6.28, warm: Math.random() < .4 }));
const drops = [];
const SPRAY = [[420, 262, 180, 5], [650, 948, 60, 2]];
function drawFx(t, dt) {
  fx.clearRect(0, 0, W, H);
  if (!motion) return;
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
let activeIdx = -1;
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
  if (idx !== activeIdx) {
    activeIdx = idx;
    dots.forEach((d, i) => d.classList.toggle("on", i === idx));
    navl.forEach(l => l.classList.toggle("on", +l.dataset.go === idx));
    updateMapOverlays(idx);
  }
}
function frame(now) {
  if (lenis) lenis.raf(now);
  const dt = Math.min(.05, (now - last) / 1000) || .016; last = now;
  const f = progressFromScroll(scrollY);
  lastF = f;
  computeCam(f);
  MI.style.setProperty("--k", cam.k.toFixed(3));
  MI.style.transform = `scale(${cam.k}) translate(${-cam.x0}px,${-cam.y0}px)`;
  updatePanels(f);
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

/* ---------- calm mode ---------- */
const calmBtn = $("#calmBtn");
function setMotion(m) { motion = m; calmBtn.setAttribute("aria-pressed", String(!m)); dirty = true; }
calmBtn.onclick = () => setMotion(!motion);
setMotion(motion);

/* ---------- filters, jobs ---------- */
$$(".filters button").forEach(b => b.onclick = () => {
  $$(".filters button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $$(".item[data-groups]").forEach(it => it.classList.toggle("hide", b.dataset.f !== "All" && !it.dataset.groups.split("|").includes(b.dataset.f)));
});
$$(".job > button").forEach(b => b.onclick = () => { const j = b.parentElement, o = j.classList.toggle("open"); b.setAttribute("aria-expanded", String(o)); $(".tog", b).textContent = o ? "Hide" : "Details"; });

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
  modal.classList.add("on"); clearTimeout(snapTimer); $("#mClose").focus();
}
function closeModal() { modal.classList.remove("on"); if (lastFocus) lastFocus.focus(); }
const linksRow = links => links && links.length ? mk(`<div class="mlinks">${links.map(([l, u], i) => `<a class="btn ${i === 0 ? "primary" : ""}" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</div>`) : null;
function openProject(id) {
  const p = projBy(id); if (!p) return;
  openModal(`<h3 id="mTitle">${esc(p.title)}</h3><div class="chips">${p.chips.map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div>
    <h4>The problem</h4><p>${esc(p.problem)}</p><h4>What I built</h4><ul>${p.built.map(b => `<li>${esc(b)}</li>`).join("")}</ul><h4>Why it matters</h4><p>${esc(p.impact)}</p>`,
    [p.demo ? DEMOS[p.demo]() : null, linksRow(p.links)]);
}
function openNote(id) {
  const n = noteBy(id); if (!n) return;
  openModal(`<h3 id="mTitle">${esc(n.title)}</h3><div class="chips"><span class="chip c">${esc(n.project)}</span><span class="chip warm">${esc(n.headline)}</span></div>
    <h4>The question</h4><p>${esc(n.q)}</p><h4>What happened</h4><p>${esc(n.found)}</p><h4>Why it matters</h4><p>${esc(n.why)}</p>`, [linksRow([n.link])]);
}
function openJob(i) {
  const j = C.jobs[i]; openModal(`<h3 id="mTitle">${esc(j.co)}</h3><p style="color:var(--muted)">${esc(j.role)}, ${esc(j.when)}</p><ul style="margin-top:14px">${j.pts.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`);
}
document.addEventListener("click", e => {
  if (e.target.closest(".meta a, .paper a")) return;
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

/* ---------- suggestion slip dock (right side) ---------- */
const slipDock = $("#slipDock"), slipPanel = $("#slipDockPanel"), slipTab = $("#slipDockTab");
const slips = $("#slips"), slipForm = $("#suggestForm"), slipMsg = $("#slipMsg");
const slipAnon = $("#slipAnon"), slipIdentity = $("#slipIdentity"), slipName = $("#slipName"), slipContact = $("#slipContact");
const slipStatus = $("#slipStatus"), slipSend = slipForm?.querySelector(".slipSend");
const slipThanks = $("#slipThanks"), slipThanksMsg = $("#slipThanksMsg"), slipThanksAgain = $("#slipThanksAgain");
const slipMailbox = $(".slip-mailbox", slips);
const pickThankYou = () => {
  const list = C.suggest?.thankYou || ["Thank you."];
  return list[Math.floor(Math.random() * list.length)];
};
function openSlipDock() {
  slipPanel.hidden = false;
  slipDock.classList.add("open");
  slipTab.setAttribute("aria-expanded", "true");
  slipMsg?.focus();
}
function closeSlipDock() {
  slipPanel.hidden = true;
  slipDock.classList.remove("open");
  slipTab.setAttribute("aria-expanded", "false");
}
function resetSlipThanks() {
  slipThanks.hidden = true;
  slipForm.hidden = false;
  $(".slip-deck", slips).style.display = "";
  slipMailbox?.classList.remove("caught");
  slips.classList.remove("sent");
}
slipTab?.addEventListener("click", () => (slipDock.classList.contains("open") ? closeSlipDock() : openSlipDock()));
$("#slipDockClose")?.addEventListener("click", closeSlipDock);
slipThanksAgain?.addEventListener("click", () => { resetSlipThanks(); slipForm.reset(); syncSlipAnon(); slipMsg?.focus(); });
document.addEventListener("click", e => {
  if (e.target.closest("[data-slip-open]")) { e.preventDefault(); openSlipDock(); }
});
const syncSlipAnon = () => {
  if (!slipAnon || !slipIdentity) return;
  slipIdentity.hidden = slipAnon.checked;
  if (slipAnon.checked && slipName && slipContact) { slipName.value = ""; slipContact.value = ""; }
};
slipAnon?.addEventListener("change", syncSlipAnon); syncSlipAnon();
[slipMsg, slipName, slipContact].forEach(el => {
  if (!el) return;
  el.addEventListener("focus", () => { chatFocused = true; clearTimeout(snapTimer); });
  el.addEventListener("blur", () => { chatFocused = false; });
});
slips?.addEventListener("click", e => {
  const chip = e.target.closest("[data-slip-prompt]");
  if (!chip || !slipMsg) return;
  const seed = chip.dataset.slipPrompt;
  if (!slipMsg.value.trim()) slipMsg.value = seed + " — ";
  else if (!slipMsg.value.includes(seed)) slipMsg.value = slipMsg.value.trim() + "\n" + seed + " — ";
  slipMsg.focus();
});
function playSlipAnimation(done) {
  const dock = slipDock;
  const paper = mk('<div class="slip-paper-fly"><span>Your note</span></div>');
  dock.appendChild(paper);
  requestAnimationFrame(() => {
    paper.classList.add("fly");
    dock.classList.add("chute-active");
    slipMailbox?.classList.add("waiting");
  });
  const finish = () => {
    paper.remove();
    dock.classList.remove("chute-active");
    slipMailbox?.classList.remove("waiting");
    slipMailbox?.classList.add("caught");
    done();
  };
  paper.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, preferReduced ? 50 : 2200);
}
slipForm?.addEventListener("submit", async e => {
  e.preventDefault();
  const text = slipMsg.value.trim();
  if (!text) { slipStatus.textContent = "Write something first."; return; }
  const endpoint = CFG.SUGGEST_ENDPOINT;
  if (!endpoint) { slipStatus.textContent = "Suggestions aren’t wired yet."; return; }
  if (slipSend) { slipSend.disabled = true; slipSend.textContent = "Sending…"; }
  slipStatus.textContent = "";
  const payload = {
    _subject: "Portfolio slip" + (slipAnon.checked ? " (anonymous)" : ""),
    _template: "table",
    _captcha: "false",
    suggestion: text,
    from: slipAnon.checked ? "anonymous" : (slipName.value.trim() || "unnamed"),
    contact: slipAnon.checked ? "none" : (slipContact.value.trim() || "none"),
    page: location.href
  };
  let ok = false;
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    ok = r.ok;
  } catch { ok = false; }
  const afterAnim = () => {
    if (!ok) {
      slipStatus.textContent = "Couldn’t send right now. Email srivastavadya@gmail.com instead.";
      if (slipSend) { slipSend.disabled = false; slipSend.textContent = "Drop it in the chute"; }
      return;
    }
    slips.classList.add("sent");
    slipForm.hidden = true;
    $(".slip-deck", slips).style.display = "none";
    const thanks = pickThankYou();
    slipThanksMsg.textContent = thanks;
    slipThanks.hidden = false;
    say(thanks);
    slipForm.reset(); syncSlipAnon();
    if (slipSend) { slipSend.disabled = false; slipSend.textContent = "Drop it in the chute"; }
  };
  if (preferReduced) afterAnim();
  else playSlipAnimation(afterAnim);
});

function openMoreModal() {
  const more = C.more || {}, m = C.shelf.meraki;
  const off = (more.offProjects || []).map(it => `
    <a class="meraki-card more-pdf" href="${esc(it.url)}" download>
      <span class="meraki-meta">${esc(it.type)}</span>
      <strong>${esc(it.t)}</strong>
      <em>${esc(it.why)}</em>
    </a>`).join("");
  const meraki = m ? `<div class="meraki" style="margin:0 0 18px">
    <p class="meraki-kicker">Personal writing</p>
    <h3 class="meraki-title">${esc(m.title)}</h3>
    <p class="meraki-tag">${esc(m.tagline)}</p>
    <p class="sub">${esc(m.about)}</p>
    <div class="row"><a class="btn primary sm" href="${esc(m.home)}" target="_blank" rel="noopener">Open Meraki</a>
    <button class="btn sm" type="button" data-meraki-all>Browse poems</button></div></div>` : "";
  openModal(`<h3 id="mTitle">${esc(more.title || "More")}</h3>
    <p class="sub">${esc(more.blurb || "")}</p>${meraki}
    <div class="sect">Off-thread write-ups</div>
    <div class="meraki-grid modal-grid">${off || "<p class=\"hint\">Nothing here yet.</p>"}</div>`);
}

/* ---------- Ask: async interview browser ---------- */
const ASK = C.ask || { layers: [], qa: {} };
const askQA = ASK.qa || {};
const askBrowse = $("#askBrowse"), askAnswer = $("#askAnswer");
let askLayer = (ASK.layers[0] && ASK.layers[0].id) || "me";
let askProject = null;
const paraHtml = t => String(t || "").split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("");
function qBtn(id) {
  const item = askQA[id]; if (!item) return "";
  return `<button type="button" class="ask-q" data-ask-open="${esc(id)}">${esc(item.q)}</button>`;
}
function renderAskBrowse() {
  const layer = ASK.layers.find(L => L.id === askLayer) || ASK.layers[0];
  if (!layer) { askBrowse.innerHTML = ""; return; }
  if (layer.kind === "projects") {
    if (askProject) {
      const proj = layer.projects.find(p => p.id === askProject);
      if (!proj) { askProject = null; return renderAskBrowse(); }
      askBrowse.innerHTML = `<button type="button" class="ask-back" data-ask-proj="">← All projects</button>
        <div class="ask-proj-head"><b>${esc(proj.title)}</b><span>${esc(proj.tag || "")}</span></div>
        ${proj.sections.map(s => `<div class="ask-sec"><div class="sect">${esc(s.label)}</div><div class="ask-qlist">${s.ids.map(qBtn).join("")}</div></div>`).join("")}`;
      return;
    }
    askBrowse.innerHTML = `<p class="about-muted" style="margin-top:0">Pick a project and walk the interview tree.</p>
      <div class="ask-proj-grid">${layer.projects.map(p => `<button type="button" class="ask-proj" data-ask-proj="${esc(p.id)}"><b>${esc(p.title)}</b><span>${esc(p.tag || "")}</span></button>`).join("")}</div>`;
    return;
  }
  askBrowse.innerHTML = `<div class="ask-qlist">${(layer.ids || []).map(qBtn).join("")}</div>`;
}
function openAskQuestion(id) {
  const item = askQA[id]; if (!item) return;
  askAnswer.hidden = false;
  const next = (item.next || []).map(nid => {
    const n = askQA[nid]; return n ? `<button type="button" class="ask-follow" data-ask-open="${esc(nid)}">${esc(n.q)}</button>` : "";
  }).join("");
  askAnswer.innerHTML = `<button type="button" class="ask-back" data-ask-close>← Back to questions</button>
    <h3 class="ask-qtitle">${esc(item.q)}</h3>
    <div class="ask-short">${paraHtml(item.short)}</div>
    ${item.deep ? `<details class="ask-deep"><summary>Go deeper ↓</summary><div class="ask-deep-body">${paraHtml(item.deep)}</div></details>` : ""}
    ${next ? `<div class="ask-next"><span>You might ask next</span><div class="ask-qlist">${next}</div></div>` : ""}`;
  askAnswer.scrollIntoView({ block: "nearest", behavior: preferReduced ? "auto" : "smooth" });
  MI.classList.add("speaking");
  setTimeout(() => MI.classList.remove("speaking"), preferReduced ? 0 : 900);
}
function setAskLayer(id) {
  askLayer = id; askProject = null; askAnswer.hidden = true; askAnswer.innerHTML = "";
  $$(".ask-tab").forEach(b => {
    const on = b.dataset.askLayer === id;
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
  });
  renderAskBrowse();
}
renderAskBrowse();
document.addEventListener("click", e => {
  const tab = e.target.closest("[data-ask-layer]");
  if (tab) { setAskLayer(tab.dataset.askLayer); return; }
  const proj = e.target.closest("[data-ask-proj]");
  if (proj) { askProject = proj.dataset.askProj || null; askAnswer.hidden = true; renderAskBrowse(); return; }
  if (e.target.closest("[data-ask-close]")) { askAnswer.hidden = true; askAnswer.innerHTML = ""; return; }
  const open = e.target.closest("[data-ask-open]");
  if (open) {
    const id = open.dataset.askOpen;
    // Jump to Ask stop if coming from the map bubble
    if (!e.target.closest(".panel")) go(6);
    // Reveal the right layer/project for deep links
    const layer = ASK.layers.find(L => L.kind === "list" && (L.ids || []).includes(id))
      || ASK.layers.find(L => L.kind === "projects" && L.projects.some(p => p.sections.some(s => s.ids.includes(id))));
    if (layer) {
      askLayer = layer.id;
      if (layer.kind === "projects") {
        const p = layer.projects.find(pr => pr.sections.some(s => s.ids.includes(id)));
        askProject = p ? p.id : null;
      } else askProject = null;
      $$(".ask-tab").forEach(b => {
        const on = b.dataset.askLayer === askLayer;
        b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
      });
      renderAskBrowse();
    }
    setTimeout(() => openAskQuestion(id), e.target.closest(".panel") ? 0 : 550);
  }
});

/* ---------- guardian freeform (Still have a question?) ---------- */
const msgs = $("#msgs"), statueEyes = MI;
const KB = C.guardian.kb, kbById = id => KB.find(k => k.id === id);
const rx = k => new RegExp("\\b" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
function findKB(q) { q = q.toLowerCase(); let best = null, bs = 0; KB.forEach(e => { let s = 0; e.keys.forEach(k => { if (rx(k).test(q)) s++; }); if (s > bs) { bs = s; best = e; } }); return best; }
function addMsg(cls, text) { const m = mk(`<div class="m ${cls}"></div>`); m.textContent = text; msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m; }
function typeOut(m, text, src, done) {
  const words = text.split(/\s+/); let i = 0;
  const tick = () => { m.textContent = words.slice(0, ++i).join(" "); msgs.scrollTop = msgs.scrollHeight;
    if (i < words.length) setTimeout(tick, motion ? 18 : 0); else { if (src) { const s = document.createElement("small"); s.textContent = "From: " + src; m.appendChild(s); } done(); } };
  tick();
}
async function ask(question, kbId, label) {
  if (busy) return; busy = true; clearTimeout(snapTimer);
  const q = question || label; addMsg("u", q); statueEyes.classList.add("speaking");
  const m = addMsg("b", ""); m.classList.add("typing"); m.textContent = "Thinking…";
  let answer = null, src = null;
  // Prefer scripted interview answers when the freeform text matches a known question closely
  if (!kbId) {
    const hit = Object.values(askQA).find(item => item.q.toLowerCase() === q.toLowerCase() || q.toLowerCase().includes(item.q.toLowerCase().slice(0, 28)));
    if (hit) { answer = hit.short + (hit.deep ? "\n\n" + hit.deep : ""); src = null; }
  }
  if (!answer && !kbId && CFG.GUARDIAN_API) {
    try {
      const r = await fetch(CFG.GUARDIAN_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      if (r.ok) { const d = await r.json(); answer = d.answer; src = null; }
    } catch (e) { /* fall back */ }
  }
  if (!answer) { const e = kbId ? kbById(kbId) : findKB(q); answer = e ? e.a : C.guardian.fallback; src = null; }
  m.classList.remove("typing"); m.textContent = "";
  typeOut(m, answer, src, () => { statueEyes.classList.remove("speaking"); busy = false; });
}
$("#askForm").onsubmit = e => { e.preventDefault(); const v = $("#askIn").value.trim(); if (!v) return; $("#askIn").value = ""; ask(v); };
const askIn = $("#askIn");
askIn.addEventListener("focus", () => { chatFocused = true; clearTimeout(snapTimer); });
askIn.addEventListener("blur", () => { chatFocused = false; });

/* Show-all modals for notes / projects */
document.addEventListener("click", e => {
  if (e.target.closest("[data-open-more]")) { e.preventDefault(); return openMoreModal(); }
  if (e.target.closest("[data-all-notes]")) {
    openModal(`<h3 id="mTitle">Research findings</h3><p class="sub" style="margin-bottom:12px">Probe results from the papers above. Click one for the full note.</p><div class="list">${C.notes.map(n => `<button class="item note-item" data-note="${n.id}"><span class="note-proj">${esc(n.project)}</span><h3>${esc(n.headline)}</h3><p>${esc(n.title)}</p></button>`).join("")}</div>`);
  }
  if (e.target.closest("[data-all-proj]")) {
    openModal(`<h3 id="mTitle">All projects</h3><div class="list">${C.projects.map(p => `<div class="item" role="button" tabindex="0" data-proj="${p.id}"><h3>${esc(p.title)}</h3><p>${esc(p.line)}</p></div>`).join("")}</div>`);
  }
  if (e.target.closest("[data-meraki-all]") && C.shelf.meraki) {
    const m = C.shelf.meraki;
    openModal(`<div class="meraki-modal"><p class="meraki-kicker">Personal writing</p><h3 id="mTitle">${esc(m.title)}</h3><p class="meraki-tag">${esc(m.tagline)}</p><p class="sub">${esc(m.about)}</p>
      <div class="meraki-grid modal-grid">${m.posts.map(p => `
        <a class="meraki-card" href="${esc(p.url)}" target="_blank" rel="noopener">
          <span class="meraki-meta">${esc(p.date)} · ${esc(p.min)}</span>
          <strong>${esc(p.t)}</strong>
          <em>${esc(p.blurb)}</em>
        </a>`).join("")}</div>
      <div class="row" style="margin-top:16px"><a class="btn primary" href="${esc(m.home)}" target="_blank" rel="noopener">Open full Meraki site</a></div></div>`);
  }
});

/* ---------- start ---------- */
addEventListener("resize", resize);
new ResizeObserver(measure).observe(document.body);
resize();
const glOk = initGL();
const done = () => document.body.classList.remove("loading");
if (glOk) {
  Promise.all([loadImg(A.plate), loadImg(A.flow), loadImg(A.foam)]).then(([pl, fl, fo]) => {
    upload(0, pl, gl.RGB); upload(1, fl, gl.RGB); upload(2, fo, gl.LUMINANCE);
    texReady = true; dirty = true; done();
  }).catch(() => { MI.classList.add("fallback"); MI.style.backgroundImage = `url(${A.plate})`; done(); });
} else { MI.classList.add("fallback"); MI.style.backgroundImage = `url(${A.plate})`; calmBtn.hidden = true; done(); }
requestAnimationFrame(frame);
})();
