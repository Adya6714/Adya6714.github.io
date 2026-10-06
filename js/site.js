/* Renders every section and wires up the interactions. */
(() => {
"use strict";
const C = window.CONTENT, CFG = window.SITE_CONFIG || {}, A = window.ASSETS || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mk = h => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstChild; };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const S = window.SceneState;
const L = C.links;

/* ---------- icons ---------- */
const I = {
  gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.300.1-2.700 0 0 .8-.3 2.800 1a9.600 9.600 0 0 1 5.100 0c1.900-1.300 2.800-1 2.800-1 .5 1.400.2 2.400.1 2.700.6.700 1 1.600 1 2.700 0 3.900-2.400 4.700-4.600 5 .4.3.7.9.7 1.900v2.800c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.500 2.500 0 0 1 0-5zM3 9.500h4V21H3zM9.500 9.500h3.800v1.600h.1c.5-1 1.800-2 3.800-2 4 0 4.800 2.600 4.800 6V21h-4v-5c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V21h-4z"/></svg>',
  or: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg>',
  kg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M7 13l8-9M9.500 11.500 16 20"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  cv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-4.500-4.500M12 15l4.500-4.500M4 20h16"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
  reason: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.500"/><circle cx="18" cy="8" r="2.500"/><circle cx="12" cy="18" r="2.500"/><path d="M8 7l8 1M7 8l4 8M17 10l-4 6"/></svg>',
  vision: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  markets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-6 4 3 8-9"/><path d="M15 5h5v5"/></svg>',
  systems: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.500"/><rect x="3" y="14" width="18" height="6" rx="1.500"/><path d="M7 7h.01M7 17h.01"/></svg>'
};
I.production = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2M21 12h0"/></svg>';
I.forecast = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>';
const aIcon = { reasoning: I.reason, vision: I.vision, markets: I.markets, production: I.production, systems: I.systems, forecast: I.forecast };

/* ---------- helpers ---------- */
const toast = (() => { const t = $("#toast"); let h; return m => { t.textContent = m; t.classList.add("on"); clearTimeout(h); h = setTimeout(() => t.classList.remove("on"), 3400); }; })();
window.toast = toast;
const modal = $("#modal"), mBody = $("#mBody"); let lastFocus = null;
function openModal(html, after) { lastFocus = document.activeElement; mBody.innerHTML = html; modal.classList.add("on"); document.body.style.overflow = "hidden"; $("#mClose").focus(); if (after) after(mBody); }
function closeModal() { modal.classList.remove("on"); document.body.style.overflow = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
$("#mClose").onclick = closeModal; modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("on")) closeModal(); });
const linkBtns = (arr, first = true) => arr.filter(Boolean).map(([l, u], i) => `<a class="btn ${first && i === 0 ? "primary" : ""}" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("");
window.openModal = openModal;

/* ---------- thumbnails (generated artwork) ---------- */
const PAL = { "Research code": ["#0b3a3a", "#1f7f78", "#72f1df"], "AI systems": ["#1d1747", "#4b3da0", "#b9a6ff"], "Forecasting and data": ["#3a2609", "#9c6b22", "#ffcf86"], "Products and platforms": ["#0b2d4a", "#2a6fa8", "#8fd0ff"], "Early work": ["#2a2f33", "#546067", "#c9d6d8"] };
function rnd(seed) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }
function thumb(kind, group, seed = 7) {
  const [c1, c2, ac] = PAL[group] || PAL["Early work"], r = rnd(seed * 97 + kind.length * 13); let g = "";
  const line = (x1, y1, x2, y2, o = .6, w = 2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${ac}" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
  const dot = (x, y, rr = 5, o = .95) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${ac}" fill-opacity="${o}"/>`;
  const nodes = n => Array.from({ length: n }, () => [50 + r() * 420, 30 + r() * 220]);
  if (kind === "bars") { for (let i = 0; i < 6; i++) { const h = i < 3 ? 120 : (i === 3 ? 40 : 120 - i * 14); g += `<rect x="${70 + i * 66}" y="${230 - h}" width="40" height="${h}" rx="6" fill="${ac}" fill-opacity="${i === 3 ? .35 : .85}"/>`; } g += `<path d="M60 230H470" stroke="${ac}" stroke-opacity=".4"/>`; }
  else if (kind === "scan") { for (let i = 0; i < 6; i++) g += `<rect x="90" y="${52 + i * 34}" width="${230 + r() * 120}" height="12" rx="6" fill="${ac}" fill-opacity=".45"/>`; g += `<rect x="70" y="40" width="380" height="${210}" rx="14" fill="none" stroke="${ac}" stroke-opacity=".5" stroke-width="2"/><rect x="62" y="132" width="396" height="22" fill="${ac}" fill-opacity=".28"/>`; g += line(62, 143, 458, 143, 1, 3); }
  else if (kind === "surface") { for (let j = 0; j < 9; j++) { let d = ""; for (let i = 0; i <= 24; i++) { const x = 40 + i * 19 + j * 7, y = 70 + j * 18 + Math.sin(i / 3 + j / 2) * 26 - Math.cos(i / 5) * 12; d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); } g += `<path d="${d}" fill="none" stroke="${ac}" stroke-opacity="${.3 + j * .07}" stroke-width="2"/>`; } }
  else if (kind === "mesh" || kind === "graph") { const ns = nodes(kind === "mesh" ? 11 : 14); ns.forEach((a, i) => ns.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 130) g += line(a[0], a[1], b[0], b[1], .4); })); ns.forEach((n, i) => { g += dot(n[0], n[1], i % 5 === 0 ? 9 : 5); if (i % 5 === 0) g += `<circle cx="${n[0]}" cy="${n[1]}" r="20" fill="none" stroke="${ac}" stroke-opacity=".4" stroke-width="2"/>`; }); }
  else if (kind === "shield") { g += `<path d="M260 36L400 84V150C400 210 340 246 260 270C180 246 120 210 120 150V84Z" fill="${ac}" fill-opacity=".18" stroke="${ac}" stroke-width="3"/><path d="M205 150l42 42 78-86" fill="none" stroke="${ac}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`; }
  else if (kind === "pulse") { g += `<path d="M30 160H150l24-80 36 150 30-110 22 40H500" fill="none" stroke="${ac}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`; for (let i = 0; i < 7; i++) g += `<rect x="${60 + i * 62}" y="${240 - 20 - r() * 40}" width="30" height="${20 + r() * 40}" rx="5" fill="${ac}" fill-opacity=".35"/>`; }
  else if (kind === "doc") { g += `<rect x="150" y="26" width="220" height="250" rx="14" fill="${ac}" fill-opacity=".14" stroke="${ac}" stroke-opacity=".7" stroke-width="2"/>`; for (let i = 0; i < 7; i++) g += `<rect x="176" y="${60 + i * 28}" width="${i % 3 === 0 ? 100 : 168}" height="10" rx="5" fill="${ac}" fill-opacity="${i % 3 === 0 ? .95 : .4}"/>`; }
  else if (kind === "map") { for (let i = 0; i < 12; i++) for (let j = 0; j < 7; j++) g += `<rect x="${44 + i * 37}" y="${34 + j * 34}" width="31" height="28" rx="5" fill="${ac}" fill-opacity="${(.08 + r() * .75).toFixed(2)}"/>`; }
  else if (kind === "route") { g += `<path d="M50 230C140 40 220 270 300 120S440 80 480 50" fill="none" stroke="${ac}" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>`; [[50, 230], [300, 120], [480, 50]].forEach(p => g += dot(p[0], p[1], 11)); }
  else if (kind === "tag") { g += `<path d="M120 80H300L420 160 300 240H120Z" fill="${ac}" fill-opacity=".2" stroke="${ac}" stroke-width="3"/><circle cx="160" cy="160" r="14" fill="${ac}"/>`; }
  else if (kind === "leaf") { g += `<path d="M120 250C100 120 200 40 400 40 410 200 330 260 120 250Z" fill="${ac}" fill-opacity=".25" stroke="${ac}" stroke-width="3"/><path d="M130 240C200 170 280 110 380 60" fill="none" stroke="${ac}" stroke-width="3"/>`; }
  else if (kind === "flow") { [60, 130, 200].forEach((y, i) => g += `<rect x="${90 + i * 40}" y="${y}" width="${340 - i * 80}" height="44" rx="12" fill="${ac}" fill-opacity="${.55 - i * .15}"/>`); g += `<path d="M260 108v18M260 178v18" stroke="${ac}" stroke-width="3"/>`; }
  else if (kind === "coin") { [[180, 170, 56], [270, 130, 66], [360, 180, 50]].forEach(c => g += `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${ac}" fill-opacity=".25" stroke="${ac}" stroke-width="3"/><text x="${c[0]}" y="${c[1] + 12}" font-size="${c[2] * .8}" text-anchor="middle" fill="${ac}" font-family="sans-serif" font-weight="700">$</text>`); }
  else if (kind === "basket") { g += `<path d="M110 120H410L380 250H140Z" fill="${ac}" fill-opacity=".22" stroke="${ac}" stroke-width="3"/><path d="M180 120L230 50M340 120L290 50" stroke="${ac}" stroke-width="3"/>`; }
  else if (kind === "game") { g += `<rect x="130" y="90" width="260" height="130" rx="48" fill="${ac}" fill-opacity=".22" stroke="${ac}" stroke-width="3"/>`; g += `<path d="M185 155h50M210 130v50" stroke="${ac}" stroke-width="8" stroke-linecap="round"/>` + dot(320, 140, 10) + dot(350, 170, 10); }
  else { for (let i = 0; i < 3; i++) { g += `<rect x="${70 + i * 130}" y="40" width="112" height="220" rx="12" fill="${ac}" fill-opacity=".1" stroke="${ac}" stroke-opacity=".5"/>`; for (let j = 0; j < 2 + i; j++) g += `<rect x="${82 + i * 130}" y="${56 + j * 56}" width="88" height="44" rx="8" fill="${ac}" fill-opacity=".45"/>`; } }
  return `<svg viewBox="0 0 520 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${seed}${kind}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="520" height="300" fill="url(#g${seed}${kind})"/><circle cx="470" cy="30" r="90" fill="${ac}" fill-opacity=".08"/>${g}</svg>`;
}

/* ---------- reveal, nav, progress ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
const observeReveal = root => $$(".reveal", root || document).forEach(el => io.observe(el));

/* ---------- Hero ---------- */
function hero() {
  const P = C.person;
  $("#hero").innerHTML = `<div class="wrap heroGrid">
   <div class="intro reveal">
     <p class="kicker">${esc(P.role)}</p><h1>${esc(P.name)}</h1>
     <div class="btns">
       <a class="btn primary resume" href="${esc(L.resume)}" download>${I.cv}Resume</a>
       <a class="btn" href="${L.github}" target="_blank" rel="noopener">${I.gh}GitHub</a>
       <a class="btn" href="${L.linkedin}" target="_blank" rel="noopener">${I.in}LinkedIn</a>
       <a class="btn" href="#card" data-drop>${I.mail}Drop me a card</a>
     </div>
     ${P.intro.map(t => `<p>${esc(t)}</p>`).join("")}
     <div class="openTo"><h4>I'm open to</h4><div class="chips">${P.openTo.map(t => `<span class="chip c">${esc(t)}</span>`).join("")}</div></div>
     <div class="more"><a href="${L.openreview}" target="_blank" rel="noopener">OpenReview paper</a><a href="${L.meraki}" target="_blank" rel="noopener">Meraki, my poems</a><a href="mailto:${L.email}">${esc(L.email)}</a></div>
   </div>
   <div class="areas reveal">
     <h3>What I work on</h3><p>Research questions I chase, and systems I build and ship.</p>
     ${["Research", "Engineering"].map(k => `<h5 class="areaKind">${k}</h5><div class="areaList">${C.areas.filter(a => (a.kind || "Research") === k).map(a => `<a class="area" style="--c:${a.color}" href="#${a.go}"><span class="ic">${aIcon[a.id] || I.systems}</span><span><b>${esc(a.title)}</b><span>${esc(a.line)}</span></span></a>`).join("")}</div>`).join("")}
     <div class="proof">${P.proof.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
   </div></div><div class="cue"><i></i>Scroll</div>`;
}

/* ---------- Research ---------- */
function research() {
  $("#research").innerHTML = `<div class="wrap"><div class="head reveal"><h2>Research</h2><p>Four papers. Each one started with a question I could not stop thinking about. Open a note for the full story and every link.</p></div>
  <div class="notes">${C.research.map(r => `<article class="note ${r.color} reveal"><span class="status">${esc(r.status)}</span><span class="tag">${esc(r.tag)}</span><h3>${esc(r.title)}</h3><p class="what">${esc(r.what)}</p><div class="big">${esc(r.big)}</div><div class="cap">${esc(r.caption)}</div>
    <div class="nl"><button class="open" data-note="${r.id}">Open notes</button>${r.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</div></article>`).join("")}</div>
  <h3 class="storiesHead reveal">Read the stories</h3>
  <div class="stories">${C.articles.map(a => `<button class="story reveal" data-article="${a.id}"><small>${a.min} min read</small><b>${esc(a.title)}</b><span>${esc(a.sub)}</span></button>`).join("")}</div></div>`;
}
function openNote(id) {
  const r = C.research.find(x => x.id === id); if (!r) return;
  openModal(`<h3 id="mTitle">${esc(r.title)}</h3><div class="chips"><span class="chip c">${esc(r.tag)}</span><span class="chip a">${esc(r.status)}</span></div>
   <h4>The question</h4><p>${esc(r.question)}</p><h4>What I did</h4><p>${esc(r.did)}</p><h4>What I found</h4><ul>${r.found.map(f => `<li>${esc(f)}</li>`).join("")}</ul><h4>What's next</h4><p>${esc(r.next)}</p>
   ${r.built ? `<h4>Built from it</h4><p><a class="chip c" href="${r.built[1]}" target="_blank" rel="noopener">${esc(r.built[0])} on GitHub</a></p>` : ""}
   <div class="mlinks">${linkBtns(r.links)}</div>`);
}
function openArticle(id) {
  const a = C.articles.find(x => x.id === id); if (!a) return;
  openModal(`<h3 id="mTitle">${esc(a.title)}</h3><p style="color:var(--muted);margin-bottom:14px">${esc(a.sub)} &nbsp;·&nbsp; ${a.min} min read</p><div class="art">${a.body.map(b => b.startsWith("## ") ? `<h4>${esc(b.slice(3))}</h4>` : `<p>${esc(b)}</p>`).join("")}</div><div class="mlinks">${linkBtns(a.links)}</div>`);
}

/* ---------- Projects: circular slider ---------- */
const GROUPS = ["All", "Research code", "AI systems", "Forecasting and data", "Products and platforms", "Early work"];
let list = [], ang = 0, tgt = 0, step = 20, RAD = 700, drag = null, autoT = 0, pauseAuto = false, ringVisible = false, curIdx = 0, ringInit = false;
const mobileMQ = matchMedia("(max-width:700px)");
function projectCard(p, i) {
  const acts = [p.site ? `<a class="btn primary" href="${esc(p.site)}" target="_blank" rel="noopener">Visit site</a>` : "", p.code ? `<a class="btn ${p.site ? "" : "primary"}" href="${esc(p.code)}" target="_blank" rel="noopener">Code</a>` : "", p.paper && !p.site ? `<a class="btn" href="${esc(p.paper)}" target="_blank" rel="noopener">Paper</a>` : ""].join("");
  return `<article class="rcard" data-i="${i}" tabindex="0" aria-label="${esc(p.title)}"><div class="th">${thumb(p.kind, p.group, i + 3)}</div><div class="bd"><h3>${esc(p.title)}</h3><p>${esc(p.line)}</p><div class="chips">${p.chips.slice(0, 3).map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div><div class="acts">${acts}<button class="btn" data-detail="${p.id}">Details</button></div></div></article>`;
}
function projects() {
  $("#projects").innerHTML = `<div class="wrap"><div class="head reveal" style="margin:0 auto 22px;text-align:center"><h2>Projects</h2><p>Drag the ring, or use the arrows. Cards with a live site have a Visit site button.</p></div>
  <div class="filters reveal" id="pFilters" role="group" aria-label="Filter projects">${GROUPS.map((g, i) => `<button type="button" data-g="${g}" aria-pressed="${i === 0}">${g}</button>`).join("")}</div>
  <div class="ringWrap reveal"><div class="ringStage" id="ringStage"><div class="ring" id="ring"></div></div>
  <div class="ringBar"><button class="icon" id="rPrev" aria-label="Previous project">${I.arrow.replace("<svg", '<svg style="transform:scaleX(-1)"')}</button><span class="count" id="rCount"></span><button class="icon" id="rNext" aria-label="Next project">${I.arrow}</button></div>
  <p class="ringHint">Tip: click any card to bring it to the front</p>
  <div class="ringFoot"><button class="btn" id="allProj">See every project as a list</button><a class="btn" href="${L.github}?tab=repositories" target="_blank" rel="noopener">${I.gh}All repositories on GitHub</a></div></div></div>`;
  setGroup("All"); bindRing();
  $("#pFilters").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("#pFilters button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); setGroup(b.dataset.g); });
}
function setGroup(g) {
  list = C.projects.filter(p => g === "All" || p.group === g);
  list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const n = list.length; step = 360 / Math.max(n, 1); RAD = Math.max(430, (150 + 26) / Math.tan(Math.PI / Math.max(n, 3)));
  $("#ring").innerHTML = list.map(projectCard).join(""); ang = 0; tgt = 0; curIdx = 0; layoutRing(true);
}
function layoutRing(force) {
  const cards = $$("#ring .rcard"), mob = mobileMQ.matches, n = cards.length; if (!n) return;
  const ringEl = $("#ring");
  if (mob) { ringEl.style.transform = ""; cards.forEach(c => { c.style.transform = ""; c.style.opacity = ""; c.classList.add("active"); }); $("#rCount").textContent = ""; return; }
  ringEl.style.transform = `translateZ(${-RAD}px) rotateY(${ang}deg)`;
  let best = 0, bd = 1e9;
  cards.forEach((c, i) => {
    let d = ((i * step + ang) % 360 + 540) % 360 - 180, ad = Math.abs(d);
    if (force) c.style.transform = `rotateY(${i * step}deg) translateZ(${RAD}px)`;
    c.style.opacity = ad > 105 ? 0 : Math.max(.16, 1 - ad / 80).toFixed(2);
    c.style.visibility = ad > 105 ? "hidden" : "visible"; c.style.zIndex = Math.round(100 - ad);
    if (ad < bd) { bd = ad; best = i; }
  });
  curIdx = best; cards.forEach((c, i) => c.classList.toggle("active", i === best));
  $("#rCount").textContent = `${best + 1} of ${n}`;
}
function rot(dir) { tgt = Math.round(tgt / step) * step - dir * step; pauseAuto = true; autoT = performance.now() + 9000; }
function bindRing() {
  const st = $("#ringStage");
  $("#rPrev").onclick = () => rot(-1); $("#rNext").onclick = () => rot(1);
  st.addEventListener("pointerdown", e => { if (mobileMQ.matches || e.target.closest("a,button")) return; drag = { x: e.clientX, a: ang, moved: 0, t: performance.now() }; st.classList.add("drag"); st.setPointerCapture(e.pointerId); });
  st.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - drag.x; drag.moved = Math.max(drag.moved, Math.abs(dx)); ang = drag.a + dx * .22; tgt = ang; layoutRing(); });
  const end = e => { if (!drag) return; const was = drag; drag = null; st.classList.remove("drag"); if (was.moved < 6) { const c = e.target.closest(".rcard"); if (c) goTo(+c.dataset.i); } else tgt = Math.round(ang / step) * step; pauseAuto = true; autoT = performance.now() + 9000; };
  st.addEventListener("pointerup", end); st.addEventListener("pointercancel", end);
  st.addEventListener("click", e => { const c = e.target.closest(".rcard"); if (!c || e.target.closest("a,button") || mobileMQ.matches) return; if (!drag) goTo(+c.dataset.i); });
  st.addEventListener("keydown", e => { if (e.key === "ArrowRight") rot(1); if (e.key === "ArrowLeft") rot(-1); });
  st.addEventListener("mouseenter", () => pauseAuto = true); st.addEventListener("mouseleave", () => { autoT = performance.now() + 3000; });
  new IntersectionObserver(es => { ringVisible = es[0].isIntersecting; }, { threshold: .3 }).observe(st);
  $("#allProj").onclick = openAll;
  addEventListener("resize", () => layoutRing(true));
  if (!ringInit) { ringInit = true; requestAnimationFrame(ringLoop); }
}
function goTo(i) { const cur = ((Math.round(-tgt / step) % list.length) + list.length) % list.length; let d = i - cur; if (d > list.length / 2) d -= list.length; if (d < -list.length / 2) d += list.length; tgt = tgt - d * step; pauseAuto = true; autoT = performance.now() + 9000; }
function ringLoop(now) {
  if (!mobileMQ.matches) {
    if (!drag) { const dlt = tgt - ang; if (Math.abs(dlt) > .02) { ang += dlt * .12; layoutRing(); } }
    if (!S.calm && ringVisible && !modal.classList.contains("on") && now > autoT && !drag) { autoT = now + 4800; pauseAuto = false; tgt -= step; }
  }
  requestAnimationFrame(ringLoop);
}
function openProject(id) {
  const p = C.projects.find(x => x.id === id); if (!p) return;
  openModal(`<h3 id="mTitle">${esc(p.title)}</h3><div class="chips" style="margin-bottom:6px">${p.chips.map(c => `<span class="chip c">${esc(c)}</span>`).join("")}</div>
   <div style="border-radius:14px;overflow:hidden;margin:14px 0 4px;aspect-ratio:520/200">${thumb(p.kind, p.group, C.projects.indexOf(p) + 3).replace("<svg ", '<svg style="width:100%;height:100%;display:block" ')}</div>
   <h4>The problem</h4><p>${esc(p.problem)}</p><h4>What I built</h4><ul>${p.built.map(b => `<li>${esc(b)}</li>`).join("")}</ul><h4>Why it matters</h4><p>${esc(p.impact)}</p>
   <h4>Skills used</h4><div class="chips">${p.skills.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
   <div class="mlinks">${linkBtns([p.site && ["Visit site", p.site], p.code && ["Code on GitHub", p.code], p.paper && ["Paper", p.paper]])}</div>`);
}
function openAll() {
  openModal(`<h3 id="mTitle">Every project</h3><input class="search" id="pSearch" placeholder="Search by name, skill or topic" aria-label="Search projects"><div class="listGrid" id="pList"></div><div class="mlinks"><a class="btn primary" href="${L.github}?tab=repositories" target="_blank" rel="noopener">Browse on GitHub</a></div>`, root => {
    const draw = q => { $("#pList", root).innerHTML = C.projects.filter(p => (p.title + " " + p.line + " " + p.skills.join(" ") + " " + p.group).toLowerCase().includes(q.toLowerCase())).map(p => `<a href="#" data-detail="${p.id}"><b>${esc(p.title)}</b><span>${esc(p.group)}</span></a>`).join("") || '<p class="empty">No match</p>'; };
    draw(""); $("#pSearch", root).addEventListener("input", e => draw(e.target.value));
  });
}

/* ---------- Path: flags in front of the arches ---------- */
let pIdx = 0;
function path() {
  const J = C.path;
  $("#path").innerHTML = `<div class="wrap"><div class="head reveal"><h2>The path so far</h2><p>Pick a flag in front of an arch, or use the buttons. Each one opens what I worked on there.</p></div>
  <div class="stepper reveal" id="stepper">${J.map((j, i) => `<button type="button" data-i="${i}" style="--c:${j.color}" aria-pressed="${i === 0}"><small>${esc(j.when)}</small><b>${esc(j.flag)}</b></button>`).join("")}</div>
  <div class="pathGrid reveal" id="pathGrid"><img src="${A.banner}" alt="Painted river bank with stone arches" loading="lazy">
   ${J.map((j, i) => `<button class="flag${j.bx / 848 > .8 ? " rev" : ""}" style="left:${(j.bx / 848 * 100).toFixed(2)}%;top:${((j.by - 250) / 480 * 100).toFixed(2)}%;--c:${j.color}" data-i="${i}" aria-pressed="${i === 0}" aria-label="${esc(j.flag)}: ${esc(j.sub)}"><span class="cloth">${esc(j.flag)}</span></button>`).join("")}
   <div class="pathCard" id="pathCard" aria-live="polite"></div></div></div>`;
  selPath(0);
  const pick = e => { const b = e.target.closest("[data-i]"); if (b && (b.classList.contains("flag") || b.closest("#stepper"))) selPath(+b.dataset.i); };
  $("#stepper").addEventListener("click", pick); $("#pathGrid").addEventListener("click", pick);
}
function selPath(i) {
  const J = C.path; pIdx = (i + J.length) % J.length; const j = J[pIdx];
  $$("#stepper button").forEach((b, k) => b.setAttribute("aria-pressed", String(k === pIdx))); $$("#pathGrid .flag").forEach((b, k) => b.setAttribute("aria-pressed", String(k === pIdx)));
  const c = $("#pathCard"); c.style.setProperty("--c", j.color);
  c.innerHTML = `<div class="top"><span class="dot"></span><h3>${esc(j.flag)}</h3></div><div class="sub">${esc(j.sub)}, ${esc(j.when)}</div><p class="line">${esc(j.line)}</p>
   <ul>${j.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul><div class="nums">${j.impact.map(n => `<div class="num"><b>${esc(n[0])}</b><span>${esc(n[1])}</span></div>`).join("")}</div>
   <div class="chips">${j.skills.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
   <div class="pcardNav"><button class="btn sm" data-pn="-1">Previous</button><button class="btn sm primary" data-pn="1">Next flag</button></div>`;
  c.onclick = e => { const b = e.target.closest("[data-pn]"); if (b) selPath(pIdx + +b.dataset.pn); };
  c.scrollTop = 0;
}

/* ---------- Shelf ---------- */
const TYPE_COL = { Paper: "#b07a24", Book: "#2d7d78", Blog: "#6d57c9", Course: "#2f6fa8", Video: "#b04668" };
let tabSel = "study", readFilter = "All", readSel = null;
const showSample = it => CFG.SHOW_SAMPLES || !it.sample;
function shelf() {
  const sk = C.skills;
  $("#shelf").innerHTML = `<div class="wrap"><div class="head reveal"><h2>On my shelf</h2><p>What I use, what I am studying, what I have read, and what I would recommend to you.</p></div>
  <div class="shelfGrid"><aside class="skillsCard reveal"><h3>Skills</h3>${sk.map(([g, a]) => `<div class="grp"><b>${esc(g)}</b><div class="chips">${a.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("")}</aside>
   <div class="shelfMain reveal"><div class="tabs" role="tablist" id="shelfTabs">${[["study", "Study module"], ["reading", "Reading log"], ["recommended", "Recommended"], ["practice", "Practice"], ["beyond", "Beyond ML"]].map(([k, l]) => `<button role="tab" data-t="${k}" aria-selected="${k === tabSel}">${l}</button>`).join("")}</div><div class="tabBody" id="tabBody"></div></div></div></div>`;
  $("#shelfTabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; tabSel = b.dataset.t; $$("#shelfTabs button").forEach(x => x.setAttribute("aria-selected", String(x === b))); drawTab(); });
  drawTab();
}
function ytThumb(it, i) {
  const rem = CFG.REMOTE_IMAGES && it.videoId;
  const fb = thumb(["bars", "scan", "surface", "mesh", "graph", "flow"][i % 6], ["Research code", "AI systems", "Forecasting and data", "Products and platforms"][i % 4], i + 11);
  return rem ? `<img src="https://img.youtube.com/vi/${it.videoId}/hqdefault.jpg" alt="" loading="lazy" onerror="this.outerHTML=this.dataset.fb" data-fb='${fb.replace(/'/g, "&#39;")}'>` : fb;
}
function drawTab() {
  const body = $("#tabBody"), SH = C.shelf;
  if (tabSel === "study") {
    const s = SH.study, url = CFG.STUDY_MODULE_URL;
    body.innerHTML = `<div class="studyWrap"><div class="book3d"><div class="cv"><b>${esc(s.title)}</b><i>${esc(s.status)}</i></div></div><div><h3>${esc(s.title)}</h3><p class="sub">${esc(s.blurb)}</p><div class="progressBar" aria-hidden="true"><i></i></div>${s.chapters.length ? `<ol>${s.chapters.map(c => `<li>${esc(c)}</li>`).join("")}</ol>` : ""}${url ? `<a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener">Open the study module</a>` : `<span class="btn off">Link coming soon</span>`}</div></div>`;
  } else if (tabSel === "reading") {
    const items = SH.reading.filter(showSample), tags = ["All", ...new Set(items.flatMap(i => i.tags))];
    const shown = items.filter(i => readFilter === "All" || i.tags.includes(readFilter));
    if (readSel && !shown.find(x => x.id === readSel)) readSel = null;
    const rows = []; for (let i = 0; i < Math.max(shown.length, 1); i += 9) rows.push(shown.slice(i, i + 9));
    const cur = SH.currently[0];
    body.innerHTML = `<h3>Reading log</h3><p class="sub">${items.length ? `${items.length} things I have read, with what I took from each. Click a spine.` : "I add what I read here as I finish it."}</p>
     <div class="shelfFilters" id="rFilters">${tags.map(t => `<button type="button" data-f="${esc(t)}" aria-pressed="${t === readFilter}">${esc(t)}</button>`).join("")}</div>
     <div class="bookcase">${rows.map(r => `<div class="shelfRow">${r.map((b, k) => `<button class="spine" data-b="${b.id}" aria-pressed="${b.id === readSel}" style="--c:${TYPE_COL[b.type] || "#2d7d78"};--h:${128 + ((b.title.length * 7 + k * 13) % 54)}px" aria-label="${esc(b.title)}">${esc(b.title)}</button>`).join("")}</div>`).join("")}</div>
     <div id="bookCard"></div>${cur && cur.by ? `<p class="sub" style="margin-top:14px">Currently reading: <b>${esc(cur.title)}</b> by ${esc(cur.by)}</p>` : ""}`;
    drawBook();
    $("#rFilters").onclick = e => { const b = e.target.closest("button"); if (b) { readFilter = b.dataset.f; readSel = null; drawTab(); } };
    $$(".spine", body).forEach(b => b.onclick = () => { readSel = readSel === b.dataset.b ? null : b.dataset.b; $$(".spine", body).forEach(x => x.setAttribute("aria-pressed", String(x.dataset.b === readSel))); drawBook(); });
  } else if (tabSel === "recommended") {
    const recs = [...SH.reading.filter(x => x.recommend && showSample(x)).map(x => ({ title: x.title, by: x.by, len: x.type, type: x.type, url: x.url, why: x.takeaway, sample: x.sample })), ...SH.videos.filter(showSample).map(x => ({ ...x, type: "Video", url: `https://www.youtube.com/watch?v=${x.videoId}` }))];
    body.innerHTML = `<h3>Recommended</h3><p class="sub">Things that helped me. Start with any of these.</p>${recs.length ? `<div class="ytGrid">${recs.map((r, i) => `<a class="yt" href="${esc(r.url)}" target="_blank" rel="noopener"><div class="thumb">${ytThumb(r, i)}<span class="ty">${esc(r.type)}</span><span class="play"><i>${I.play}</i></span><span class="len">${esc(r.len)}</span></div><h5>${esc(r.title)}${r.sample ? '<span class="sampleTag">Sample</span>' : ""}</h5><small>${esc(r.by)}</small>${r.why ? `<em>${esc(r.why)}</em>` : ""}</a>`).join("")}</div>` : '<div class="empty">Recommendations are coming soon.</div>'}`;
  } else if (tabSel === "practice") {
    body.innerHTML = `<h3>Practice</h3><p class="sub">Where I keep my skills sharp.</p><div class="cards3">${SH.practice.map(p => { const u = p.url || CFG[p.urlKey]; return `<div class="pc"><b>${esc(p.name)}</b><span>${esc(p.note)}</span>${u ? `<a class="btn primary sm" href="${esc(u)}" target="_blank" rel="noopener">Open ${esc(p.name)}</a>` : '<span class="btn sm off">Link coming soon</span>'}</div>`; }).join("")}</div>`;
  } else {
    body.innerHTML = `<h3>Beyond ML</h3><p class="sub">Writing and case work that sits outside machine learning.</p><div class="cards3">${SH.beyond.map(b => `<div class="pc"><b>${esc(b.title)}</b><span>${esc(b.line)}</span>${b.url ? `<a class="btn primary sm" href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.label)}</a>` : `<button class="btn primary sm" data-cases>${esc(b.label)}</button>`}</div>`).join("")}</div>`;
  }
}
function drawBook() {
  const el = $("#bookCard"); if (!el) return; const b = C.shelf.reading.find(x => x.id === readSel);
  el.innerHTML = b ? `<div class="bookCard"><h4>${esc(b.title)}${b.sample ? '<span class="sampleTag">Sample</span>' : ""}</h4><div class="by">${esc(b.by)} · ${esc(b.type)}${b.rating ? `<span class="dots" aria-label="${b.rating} out of 5">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= b.rating ? "on" : ""}"></i>`).join("")}</span>` : ""}</div><p>${esc(b.takeaway)}</p>${b.url ? `<a class="btn sm" href="${esc(b.url)}" target="_blank" rel="noopener">Open</a>` : ""}</div>` : "";
}
function openCases() { openModal(`<h3 id="mTitle">Case studies</h3><p style="color:var(--muted)">Consulting, product and business work.</p><div class="listGrid">${C.cases.map(c => `<a href="${esc(c.url)}" target="_blank" rel="noopener"><b>${esc(c.t)}</b><span>${esc(c.type)}. ${esc(c.line)}</span></a>`).join("")}</div>`); }

/* ---------- Ask / Pond containers (logic in other files) ---------- */
function askShell() {
  $("#ask").innerHTML = `<div class="wrap"><div class="head reveal"><h2>Ask the guardian</h2><p>An interview, on your schedule. Pick a question, or ask your own and the guardian will find the closest answer.</p></div><div class="askGrid"><div class="guard reveal" id="guard"></div><div class="chat reveal" id="chat"></div></div></div>`;
}
function pondShell() {
  $("#pond").innerHTML = `<div class="wrap"><div class="head reveal"><h2>Feed the koi</h2><p>A small break. Tap or click the water to drop some food.</p></div><div class="pondWrap reveal" id="pondWrap"><canvas id="pondCv"></canvas><div class="pondUi"><span class="chip" id="fedCount">Fed: 0</span></div><div class="pondTip" id="pondTip">Tap the water to feed them</div></div></div>`;
}

/* ---------- About ---------- */
function about() {
  const P = C.person;
  $("#about").innerHTML = `<div class="wrap"><div class="aboutGrid reveal"><div class="photo noimg" id="photo"><b>AS</b></div><div><h2>${esc(P.closingTitle)}</h2>${P.closing.map(t => `<p>${esc(t)}</p>`).join("")}
   <div class="btns" style="margin-top:20px"><a class="btn primary resume" href="${esc(L.resume)}" download>${I.cv}Resume</a><a class="btn" href="mailto:${L.email}">${I.mail}Email</a><a class="btn" href="${L.github}" target="_blank" rel="noopener">${I.gh}GitHub</a><a class="btn" href="${L.linkedin}" target="_blank" rel="noopener">${I.in}LinkedIn</a><a class="btn" href="${L.openreview}" target="_blank" rel="noopener">${I.or}OpenReview</a></div></div></div></div>`;
  if (CFG.PHOTO_URL) { const img = new Image(); img.alt = "Adya Srivastava"; img.onload = () => { const ph = $("#photo"); ph.classList.remove("noimg"); ph.innerHTML = ""; ph.appendChild(img); }; img.src = CFG.PHOTO_URL; }
}

/* ---------- Drop me a card ---------- */
function dropCard() {
  const SG = C.suggest; let type = SG.types[0], last = 0;
  $("#card").innerHTML = `<div class="wrap"><div class="dropGrid"><div>
   <div class="dropCopy reveal"><h2>${esc(SG.title)}</h2><p>${esc(SG.blurb)}</p></div>
   <form class="paper reveal" id="cardForm" novalidate>
     <label for="cMsg">Your card</label><textarea id="cMsg" name="message" maxlength="1200" placeholder="${esc(SG.placeholder)}" required></textarea>
     <div class="typeRow" id="cTypes" role="group" aria-label="Type of card">${SG.types.map((t, i) => `<button type="button" data-t="${esc(t)}" aria-pressed="${i === 0}">${esc(t)}</button>`).join("")}</div>
     <div class="two" id="cWho"><div><label for="cName">Name (optional)</label><input id="cName" type="text" name="name" autocomplete="name"></div><div><label for="cMail">Email (optional, if you want a reply)</label><input id="cMail" type="email" name="email" autocomplete="email"></div></div>
     <label class="anon"><input type="checkbox" id="cAnon"> Send anonymously</label>
     <input type="text" name="_honey" id="cHoney" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
     <button class="btn primary" type="submit" id="cSend">Send card</button><div class="formMsg" id="cMsgOut" role="status"></div>
   </form>
   <div class="thanks" id="cThanks"><b>Dropped in the box.</b><span id="cThanksText"></span><div style="margin-top:12px"><button class="btn sm" id="cAgain">Write another card</button></div></div></div>
   <div class="post reveal" id="post"><div class="pole"></div><div class="box"><div class="slot"></div><div class="lbl">Cards<small>for Adya</small></div></div><div class="roof"></div><div class="flap"></div><div class="stamp" id="stamp">RECEIVED</div></div></div></div>`;
  const form = $("#cardForm"), paper = form, post = $("#post"), out = $("#cMsgOut");
  $("#cTypes").onclick = e => { const b = e.target.closest("button"); if (!b) return; type = b.dataset.t; $$("#cTypes button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); };
  $("#cAnon").onchange = e => { $("#cWho").style.opacity = e.target.checked ? .35 : 1; $("#cName").disabled = $("#cMail").disabled = e.target.checked; };
  function leaves() { for (let i = 0; i < 12; i++) { const l = document.createElement("i"); l.className = "leaf"; l.style.cssText = `left:${40 + Math.random() * 20}%;top:30%;--dx:${(Math.random() * 2 - 1) * 160}px;--dy:${-30 + Math.random() * 180}px;--rot:${Math.random() * 540}deg;background:${["#6fd08c", "#ffcf86", "#8fd0ff"][i % 3]}`; post.appendChild(l); requestAnimationFrame(() => l.classList.add("go")); setTimeout(() => l.remove(), 2400); } }
  function animateIn() {
    const slot = $(".slot", post).getBoundingClientRect(), pr = paper.getBoundingClientRect();
    const dx = slot.left + slot.width / 2 - (pr.left + pr.width / 2), dy = slot.top + slot.height / 2 - (pr.top + pr.height / 2), sc = Math.max(.1, (slot.width * .9) / pr.width);
    post.classList.add("open"); paper.style.transform = `translate(${dx}px,${dy}px) scale(${sc}) rotate(6deg)`;
    setTimeout(() => { paper.style.opacity = 0; post.classList.remove("open"); $("#stamp").classList.add("go"); leaves(); setTimeout(() => { paper.style.display = "none"; }, 500); }, reduce ? 0 : 950);
  }
  form.addEventListener("submit", async e => {
    e.preventDefault(); out.textContent = "";
    const msg = $("#cMsg").value.trim(); if (msg.length < 3) { out.textContent = "Write a few words on the card first."; $("#cMsg").focus(); return; }
    if ($("#cHoney").value) return; if (Date.now() - last < 8000) { out.textContent = "One moment before sending another card."; return; } last = Date.now();
    const anon = $("#cAnon").checked, name = anon ? "" : $("#cName").value.trim(), mail = anon ? "" : $("#cMail").value.trim();
    const btn = $("#cSend"); btn.disabled = true; btn.textContent = "Sending";
    let ok = false, via = "";
    if (CFG.SUGGESTION_ENDPOINT) {
      try {
        const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
        const r = await fetch(CFG.SUGGESTION_ENDPOINT, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ message: msg, type, name: name || "Anonymous", email: mail || "not given", _subject: `Portfolio card: ${type}`, _captcha: "false", _template: "table" }) });
        clearTimeout(tm); const j = await r.json().catch(() => ({})); ok = r.ok && j.success !== "false" && j.success !== false; via = "form";
      } catch (er) { ok = false; }
    }
    animateIn();
    const say = SG.thanks[Math.floor(Math.random() * SG.thanks.length)];
    if (ok) { $("#cThanksText").textContent = say; }
    else {
      const body = `${msg}\n\nType: ${type}\nFrom: ${name || "Anonymous"}${mail ? " <" + mail + ">" : ""}`;
      $("#cThanksText").textContent = "The mail service could not be reached from here, so I opened your email app with the card filled in. Press send there to deliver it.";
      setTimeout(() => { location.href = `mailto:${L.email}?subject=${encodeURIComponent("Portfolio card: " + type)}&body=${encodeURIComponent(body)}`; }, 1300);
    }
    setTimeout(() => $("#cThanks").classList.add("show"), reduce ? 0 : 1500);
    btn.disabled = false; btn.textContent = "Send card"; form.dataset.sent = "1";
  });
  $("#cAgain").onclick = () => { $("#cThanks").classList.remove("show"); $("#stamp").classList.remove("go"); paper.style.display = ""; paper.style.transition = "none"; paper.style.transform = ""; paper.style.opacity = 1; void paper.offsetWidth; paper.style.transition = ""; $("#cMsg").value = ""; $("#cMsg").focus(); };
}

/* ---------- Rail, footer ---------- */
function rail() {
  const items = [["GitHub", L.github, I.gh], ["LinkedIn", L.linkedin, I.in], ["OpenReview", L.openreview, I.or], ["Email", "mailto:" + L.email, I.mail], ["Resume", L.resume, I.cv]];
  $("#rail").innerHTML = items.map(([l, u, ic]) => `<a href="${esc(u)}" ${u.startsWith("http") ? 'target="_blank" rel="noopener"' : u.endsWith(".pdf") ? "download" : ""} aria-label="${l}">${ic}<span>${l}</span></a>`).join("");
  $("#foot").innerHTML = `<div class="fl">${[["GitHub", L.github], ["LinkedIn", L.linkedin], ["OpenReview", L.openreview], ["Kaggle", L.kaggle], ["Meraki", L.meraki], ["Email", "mailto:" + L.email], ["Resume", L.resume]].map(([l, u]) => `<a href="${esc(u)}" ${u.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${l}</a>`).join("")}</div><div>Built by Adya Srivastava. Last updated ${window.BUILD_DATE || ""}</div>`;
}

/* ---------- init ---------- */
hero(); research(); projects(); path(); shelf(); askShell(); pondShell(); about(); dropCard(); rail();
$$(".resume").forEach(b => { if (CFG.RESUME_URL) b.setAttribute("href", CFG.RESUME_URL); });
if (window.Ask) window.Ask.init(); if (window.Koi) window.Koi.init();
observeReveal();
setInterval(() => $$(".reveal:not(.in)").forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .96 && r.bottom > 0) { el.classList.add("in"); io.unobserve(el); } }), 350);

document.addEventListener("click", e => {
  const n = e.target.closest("[data-note]"); if (n) return openNote(n.dataset.note);
  const a = e.target.closest("[data-article]"); if (a) return openArticle(a.dataset.article);
  const d = e.target.closest("[data-detail]"); if (d) { e.preventDefault(); return openProject(d.dataset.detail); }
  if (e.target.closest("[data-cases]")) return openCases();
  if (e.target.closest("[data-drop]")) { e.preventDefault(); goDrop(); }
});
function goDrop() { document.getElementById("card").scrollIntoView({ behavior: reduce || S.calm ? "auto" : "smooth" }); setTimeout(() => { const t = $("#cMsg"); if (t) t.focus({ preventScroll: true }); }, 700); }
$("#dropTab").onclick = goDrop;

/* nav highlight, progress, drop tab visibility, veil */
const secs = ["hero", "research", "projects", "path", "shelf", "ask", "pond", "about", "card"].map(id => document.getElementById(id));
const navA = $$("#navLinks a");
const secIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const id = e.target.id; document.body.dataset.sec = id; navA.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id || (id === "card" && a.getAttribute("href") === "#about"))); $("#dropTab").classList.toggle("hide", id === "card"); } }), { rootMargin: "-45% 0px -50% 0px" });
secs.forEach(s => secIO.observe(s));
addEventListener("scroll", () => { const m = document.documentElement.scrollHeight - innerHeight; $("#progress i").style.width = (m > 0 ? scrollY / m * 100 : 0) + "%"; }, { passive: true });
$("#menuBtn").onclick = () => { const o = $("#navLinks").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", String(o)); };
$("#navLinks").addEventListener("click", () => $("#navLinks").classList.remove("open"));

/* calm + night */
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
function setCalm(v) { S.calm = v; document.body.classList.toggle("calm", v); $("#calmBtn").setAttribute("aria-pressed", String(v)); store.set("calm", v ? "1" : "0"); window.dispatchEvent(new Event("scene:dirty")); }
function setNight(v) { S.night = v; document.body.classList.toggle("night", v); $("#nightBtn").setAttribute("aria-pressed", String(v)); store.set("night", v ? "1" : "0"); window.dispatchEvent(new Event("scene:dirty")); }
$("#calmBtn").onclick = () => setCalm(!S.calm); $("#nightBtn").onclick = () => setNight(!S.night);
setCalm(store.get("calm") === "1" || reduce); setNight(store.get("night") === "1");
})();
