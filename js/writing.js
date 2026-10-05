(() => {
"use strict";
const C = window.CONTENT || {};
const CFG = window.SITE_CONFIG || {};
const M = C.meraki || {};
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const about = $("#merakiAbout");
if (about) about.textContent = M.about || "";
const site = $("#merakiSite");
if (site) {
  if (M.site) { site.href = M.site; }
  else site.hidden = true;
}

const minLabel = m => {
  if (m == null || m === "") return "";
  const n = Number(m);
  if (!Number.isNaN(n)) return `${n} min`;
  return String(m);
};

const grid = $("#poemGrid");
if (grid) {
  const posts = M.posts || [];
  grid.innerHTML = posts.length
    ? posts.map(p => {
      const note = p.note || p.blurb || "";
      const date = p.d || p.date || "";
      const mins = minLabel(p.min);
      return `<article class="poem-card">
        <h3>${esc(p.t)}</h3>
        <p class="poem-meta">${esc(date)}${mins ? ` · ${esc(mins)}` : ""}</p>
        ${note ? `<p class="poem-note">${esc(note)}</p>` : ""}
        <a class="btn sm poem-read" href="${esc(p.url)}" target="_blank" rel="noopener">Read</a>
      </article>`;
    }).join("")
    : `<p class="lib-empty">Coming soon</p>`;
}

$$(".resume").forEach(b => {
  if (CFG.RESUME_URL) b.href = CFG.RESUME_URL;
  else b.addEventListener("click", e => e.preventDefault());
});
})();
