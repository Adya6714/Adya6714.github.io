(() => {
"use strict";
const C = window.CONTENT || {};
const CFG = window.SITE_CONFIG || {};
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const grid = $("#otherGrid");
const items = C.otherWork || [];
if (grid) {
  grid.innerHTML = items.length
    ? items.map(it => {
      const title = it.t || it.title || "";
      const line = it.line || it.why || "";
      const url = it.url || it.link || "#";
      const external = /^https?:\/\//i.test(url);
      return `<article class="other-card">
        <span class="other-type">${esc(it.type || "")}</span>
        <h3>${esc(title)}</h3>
        ${line ? `<p>${esc(line)}</p>` : ""}
        <a class="btn sm" href="${esc(url)}" ${external ? 'target="_blank" rel="noopener"' : ""} ${url.endsWith(".pdf") ? "download" : ""}>Open</a>
      </article>`;
    }).join("")
    : `<p class="lib-empty">Coming soon</p>`;
}

$$(".resume").forEach(b => {
  if (CFG.RESUME_URL) b.href = CFG.RESUME_URL;
  else b.addEventListener("click", e => e.preventDefault());
});
})();
