/* The guardian: question bank, semantic-style matching, and the "comes alive" animation. */
(() => {
"use strict";
const C = window.CONTENT, IV = C.interview, A = window.ASSETS || {};
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----- matcher: weighted TF-IDF over question, paraphrases and answers, with small synonym groups ----- */
const STOP = new Set("a an the of to in on for and or is are was were be been do does did you your yours i me my with about what how why who when where which that this it as at by from can could would should will tell us am have has had any some there their them they we our if so than then also just very really more most much many into out up over".split(" "));
const GROUPS = [["ocr", "reading", "vision", "scan", "confidence", "calibration", "indic", "image"], ["reasoning", "reason", "retrieval", "compute", "recall", "caisc", "strategy", "probe", "benchmark"], ["job", "role", "hire", "hiring", "opportunity", "looking", "available", "position", "work"], ["intern", "internship", "nurix", "speech", "voicemail", "production", "ship", "shipped", "experience"], ["hedging", "volatility", "diffusion", "ddpm", "nifty", "market", "options", "finance"], ["fraud", "fraudscope", "fraudsense", "citi", "cheating", "detection"], ["disaster", "omnimesh", "mesh", "offline", "triage", "android"], ["hackathon", "competition", "teammate", "winner", "win", "contest"], ["weak", "weakness", "improve", "growth", "failure", "mistake", "wrong", "bug"], ["research", "paper", "experiment", "hypothesis", "rigour", "validation", "evidence"], ["scratch", "build", "building", "built"], ["learn", "learning", "study", "pick"], ["compute", "gpu", "resources", "scale", "unlimited"], ["traffic", "forecast", "forecasting", "gridlock", "demand", "prediction"]];
const stem = w => (w.length > 4 ? w.replace(/(ing|ed|ly|es|s)$/, "") : w);
const tok = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w && !STOP.has(w)).map(stem);
const SYN = {}; GROUPS.forEach(g => g.forEach(w => { const k = stem(w); (SYN[k] = SYN[k] || new Set()); g.forEach(o => { const ok = stem(o); if (ok !== k) SYN[k].add(ok); }); }));
function vec(text, weight, into) { for (const t of tok(text)) { into[t] = (into[t] || 0) + weight; if (SYN[t]) for (const s of SYN[t]) into[s] = (into[s] || 0) + weight * .3; } return into; }
let docs = [], idf = {};
function build() {
  docs = IV.qs.map(q => { const v = {}; vec(q.q, 3, v); (q.para || []).forEach(p => vec(p, 2, v)); vec(q.short, 1, v); vec(q.long || "", .6, v); return { q, v }; });
  const df = {}; docs.forEach(d => Object.keys(d.v).forEach(t => df[t] = (df[t] || 0) + 1));
  Object.keys(df).forEach(t => idf[t] = Math.log(1 + docs.length / df[t]));
  docs.forEach(d => { d.raw = d.v; });
}
function match(text) {
  const qv = vec(text, 1, {}); const known = Object.keys(idf), mean = known.reduce((a, t) => a + idf[t], 0) / (known.length || 1);
  let den = 0; for (const t in qv) { qv[t + ""] = qv[t] * (idf[t] != null ? idf[t] : mean * .5); den += qv[t]; } den = den || 1;
  const low = text.toLowerCase().replace(/[?.!]/g, "").trim();
  return docs.map(d => { let num = 0; for (const t in qv) { const w = d.raw[t]; if (w) num += qv[t] * (w / (w + 1.6)); } let s = num / den;
    (d.q.para || []).concat([d.q.q.replace(/[?.]/g, "")]).forEach(p => { const pl = p.toLowerCase(); if (pl.length > 6 && (low.includes(pl) || (low.length > 8 && pl.includes(low)))) s += .45; });
    return { q: d.q, s }; }).sort((a, b) => b.s - a.s);
}
window.AskMatch = { match: t => (build.done || (build(), build.done = true), match(t)) };

/* ----- UI ----- */
let track = IV.tracks[0], busy = false, sleepT = 0, portal, gState, view;
function init() {
  build(); build.done = true;
  const guard = $("#guard"), chat = $("#chat"); if (!guard || !chat) return;
  guard.innerHTML = `<div class="portal" id="portal"><div class="rays"></div><div class="halo"></div><div class="frame"><img src="${A.guardian}" alt="The stone guardian of the river"></div><span class="eye" style="left:37%;top:45.5%"></span><span class="eye" style="left:52.5%;top:45.5%"></span><i class="ring2"></i><i class="ring2 b"></i><i class="ring2 c"></i></div><small id="gState">Resting. Ask me something.</small>`;
  portal = $("#portal"); gState = $("#gState");
  chat.innerHTML = `<p class="hello">${esc(IV.intro)}</p><form class="askRow" id="askForm"><input id="askIn" type="text" placeholder="Ask your own question, for example: why did you build your own OCR model?" aria-label="Ask a question" autocomplete="off"><button class="btn primary" type="submit">Ask</button></form><div class="trackTabs" id="trackTabs" role="group" aria-label="Question topics">${IV.tracks.map(t => `<button type="button" data-t="${esc(t)}" aria-pressed="${t === track}">${esc(t)}</button>`).join("")}</div><div id="askView" aria-live="polite"></div>`;
  view = $("#askView"); drawList();
  $("#trackTabs").onclick = e => { const b = e.target.closest("button"); if (!b) return; track = b.dataset.t; document.querySelectorAll("#trackTabs button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); drawList(); };
  $("#askForm").onsubmit = e => { e.preventDefault(); const v = $("#askIn").value.trim(); if (v) ask(v); };
  view.addEventListener("click", e => {
    const q = e.target.closest("[data-q]"); if (q) return showQ(q.dataset.q);
    if (e.target.closest("[data-back]")) return drawList();
    const d = e.target.closest("[data-deep]"); if (d) { const l = $(".long", view); if (l) { l.hidden = !l.hidden; d.textContent = l.hidden ? "Go deeper" : "Show less"; } }
  });
}
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
function drawList() { view.innerHTML = `<div class="qList">${IV.qs.filter(q => q.track === track).map(q => `<button type="button" data-q="${q.id}"><span>${esc(q.q)}</span>${arrow}</button>`).join("")}</div>`; }
function showQ(id, note) {
  const q = IV.qs.find(x => x.id === id); if (!q) return; awaken();
  view.innerHTML = `<div class="answer"><button class="btn sm back" data-back>Back to questions</button>${note ? `<p class="match">${esc(note)}</p>` : ""}<h4>${esc(q.q)}</h4><p class="short">${esc(q.short)}</p><button class="btn sm" data-deep>Go deeper</button><p class="long" hidden>${esc(q.long || "")}</p>
   ${q.next && q.next.length ? `<div class="nextQs"><b>You might ask next</b><div class="chips">${q.next.map(n => { const x = IV.qs.find(y => y.id === n); return x ? `<button type="button" data-q="${x.id}">${esc(x.q)}</button>` : ""; }).join("")}</div></div>` : ""}</div>`;
}
const related = res => `<div class="nextQs"><b>Related questions</b><div class="chips">${res.slice(0, 3).map(r => `<button type="button" data-q="${r.q.id}">${esc(r.q.q)}</button>`).join("")}</div></div>`;
function showAI(text, answer, res) {
  view.innerHTML = `<div class="answer"><button class="btn sm back" data-back>Back to questions</button><h4>${esc(text)}</h4>${answer.split(/\n\n+/).map(p => `<p class="short">${esc(p)}</p>`).join("")}${related(res)}</div>`;
}
function showClosest(text, res) {
  const top = res[0].q;
  view.innerHTML = `<div class="answer"><button class="btn sm back" data-back>Back to questions</button><h4>${esc(text)}</h4><p class="match">The closest thing in Adya's notes is "${esc(top.q)}"</p><p class="short">${esc(top.short)}</p>${top.long ? `<p class="short">${esc(top.long)}</p>` : ""}<p class="match">For anything more specific, email srivastavadya@gmail.com or drop a card at the end of the page.</p>${related(res.slice(1))}</div>`;
}
async function askAI(text, res) {
  const url = (window.SITE_CONFIG || {}).GUARDIAN_API;
  if (!url) return null;
  const context = res.slice(0, 6).map(r => `Q: ${r.q.q}\nA: ${r.q.short} ${r.q.long || ""}`).join("\n\n");
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text, context }) });
    if (!r.ok) return null;
    const d = await r.json();
    return d && d.answer ? String(d.answer) : null;
  } catch { return null; } finally { clearTimeout(t); }
}
async function ask(text) {
  if (busy) return; busy = true; awaken();
  view.innerHTML = `<div class="answer"><p class="match"><span class="typing"><i></i><i></i><i></i></span> &nbsp;Thinking about "${esc(text)}"</p></div>`;
  const started = performance.now();
  const res = window.AskMatch.match(text), top = res[0];
  let answer = null;
  if (top.s < .45) answer = await askAI(text, res);
  const wait = Math.max(0, (reduce ? 0 : 750) - (performance.now() - started));
  setTimeout(() => {
    if (answer) showAI(text, answer, res);
    else if (top.s >= .3) showQ(top.q.id, `I think you are asking: "${top.q.q}"`);
    else showClosest(text, res);
    busy = false;
  }, wait);
}
function awaken() {
  if (!portal) return; gState.textContent = "Awake. Listening.";
  portal.classList.add("awake"); portal.classList.remove("pulse"); void portal.offsetWidth; portal.classList.add("pulse");
  if (!reduce && !window.SceneState.calm) {
    const r = portal.getBoundingClientRect(); let lp = document.getElementById("lightPulse"); if (!lp) { lp = document.createElement("div"); lp.id = "lightPulse"; document.body.appendChild(lp); }
    lp.style.left = (r.left + r.width / 2) + "px"; lp.style.top = (r.top + r.height / 2) + "px"; lp.classList.remove("go"); void lp.offsetWidth; lp.classList.add("go");
    const host = portal.parentElement; for (let i = 0; i < 16; i++) { const s = document.createElement("i"); s.className = "spark"; const a = Math.random() * 6.28, d = 90 + Math.random() * 150; s.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--c:${["#72f1df", "#ffcf86", "#b9a6ff"][i % 3]}`; host.appendChild(s); requestAnimationFrame(() => s.classList.add("go")); setTimeout(() => s.remove(), 1700); }
  }
  clearTimeout(sleepT); sleepT = setTimeout(() => { portal.classList.remove("awake"); gState.textContent = "Resting. Ask me something."; }, 9000);
}
window.Ask = { init };
})();
