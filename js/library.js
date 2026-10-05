(() => {
"use strict";
const C = window.CONTENT || {};
const CFG = window.SITE_CONFIG || {};
const L = C.library || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ytId = u => {
  if (!u) return null;
  const s = String(u);
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};
const isRealUrl = u => {
  if (!u || typeof u !== "string") return false;
  const t = u.trim();
  if (!t || t === "#" || /PASTE_|YOUR_|TODO|coming.?soon/i.test(t)) return false;
  if (t.includes("drive.google.com/drive/home")) return false;
  return /^https?:\/\//i.test(t);
};
const comingSoon = () => `<p class="lib-empty">Coming soon</p>`;

function renderStudy() {
  const b = L.studyModule || {};
  const chapters = Array.isArray(b.chapters) ? b.chapters.filter(Boolean) : [];
  const link = isRealUrl(b.link) ? b.link.trim() : "";
  return `<article class="study-card">
    <div class="study-cover" aria-hidden="true"><span>${esc(b.title || "Study")}</span></div>
    <div class="study-body">
      <h2>${esc(b.title || "Study module")}</h2>
      <p>${esc(b.description || "")}</p>
      ${chapters.length ? `<ol class="study-chapters">${chapters.map(c => `<li>${esc(c)}</li>`).join("")}</ol>` : ""}
      ${link ? `<a class="btn primary" href="${esc(link)}" target="_blank" rel="noopener">Open study module</a>` : ""}
    </div>
  </article>`;
}

function renderLeetCode() {
  const url = isRealUrl(CFG.LEETCODE_URL) ? CFG.LEETCODE_URL.trim()
    : (isRealUrl(L.leetcode) ? String(L.leetcode).trim() : "");
  if (!url) return comingSoon();
  return `<article class="leetcode-card">
    <h2>LeetCode</h2>
    <p class="sub">Practice profile</p>
    <a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener">Open LeetCode profile</a>
  </article>`;
}

function videoCard(v) {
  const id = v.id || ytId(v.url);
  if (!id) return "";
  const title = v.title || v.t || "Video";
  const channel = v.channel || v.by || "";
  const dur = v.duration || v.len || "";
  const why = v.why || "";
  const thumb = `https://img.youtube.com/vi/${esc(id)}/hqdefault.jpg`;
  return `<button type="button" class="yt-card" data-yt="${esc(id)}" aria-label="Play ${esc(title)}">
    <span class="yt-thumb" style="background-image:url(${thumb})"><span class="yt-play" aria-hidden="true"></span>${dur ? `<span class="yt-dur">${esc(dur)}</span>` : ""}</span>
    <span class="yt-meta">
      <strong>${esc(title)}</strong>
      ${channel ? `<span class="yt-ch">${esc(channel)}</span>` : ""}
      ${why ? `<span class="yt-why">${esc(why)}</span>` : ""}
    </span>
  </button>`;
}

function renderVideos() {
  const list = (L.videos || []).map(videoCard).filter(Boolean);
  if (!list.length) return comingSoon();
  return `<div class="yt-grid">${list.join("")}</div>`;
}

function itemCard(it) {
  if (!it || !it.t && !it.title) return "";
  const title = it.title || it.t;
  const by = it.by || it.author || "";
  const why = it.why || it.blurb || it.note || "";
  const url = isRealUrl(it.url) ? it.url.trim() : "";
  if (!url) return "";
  return `<article class="lib-item">
    <h3>${esc(title)}</h3>
    ${by ? `<p class="lib-item-by">${esc(by)}</p>` : ""}
    ${why ? `<p>${esc(why)}</p>` : ""}
    <a class="btn sm" href="${esc(url)}" target="_blank" rel="noopener">Open</a>
  </article>`;
}

function renderList(key) {
  const items = (L[key] || []).map(itemCard).filter(Boolean);
  if (!items.length) return comingSoon();
  return `<div class="lib-list">${items.join("")}</div>`;
}

const RENDER = {
  study: renderStudy,
  leetcode: renderLeetCode,
  videos: renderVideos,
  reading: () => renderList("reading"),
  notes: () => renderList("notes")
};

function showTab(id) {
  $$(".lib-tab").forEach(btn => {
    const on = btn.dataset.tab === id;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-selected", String(on));
  });
  $$(".lib-panel").forEach(panel => {
    const on = panel.dataset.panel === id;
    panel.classList.toggle("on", on);
    panel.hidden = !on;
  });
  const panel = $(`.lib-panel[data-panel="${id}"]`);
  if (panel && !panel.dataset.ready) {
    panel.innerHTML = (RENDER[id] || comingSoon)();
    panel.dataset.ready = "1";
  }
  try { history.replaceState(null, "", `#${id}`); } catch (_) {}
}

$$(".lib-tab").forEach(btn => btn.addEventListener("click", () => showTab(btn.dataset.tab)));

const initial = (location.hash || "").replace(/^#/, "");
showTab(RENDER[initial] ? initial : "study");

/* YouTube lightbox */
const modal = $("#ytModal");
const frame = $("#ytFrame");
const closeYt = () => {
  modal.classList.remove("on");
  frame.src = "";
  document.body.style.overflow = "";
};
const openYt = id => {
  frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
  modal.classList.add("on");
  document.body.style.overflow = "hidden";
  $("#ytClose")?.focus();
};
document.addEventListener("click", e => {
  const card = e.target.closest("[data-yt]");
  if (card) return openYt(card.dataset.yt);
  if (e.target === modal) closeYt();
});
$("#ytClose")?.addEventListener("click", closeYt);
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("on")) closeYt(); });

/* Resume */
$$(".resume").forEach(b => {
  if (CFG.RESUME_URL) b.href = CFG.RESUME_URL;
  else b.addEventListener("click", e => e.preventDefault());
});
})();
