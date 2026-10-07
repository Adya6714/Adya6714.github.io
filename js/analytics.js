/* GoatCounter events. Safe to load even if GoatCounter is blocked. */
(() => {
  const gc = (path, title) => {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "event/" + path, title: title || path, event: true }); } catch (e) {}
  };
  const seen = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !seen.has(e.target.id)) { seen.add(e.target.id); gc("section-" + e.target.id, "Reached " + e.target.id); }
  }), { threshold: 0.4 });
  ["research","projects","path","shelf","ask","pond","about","card"].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  document.addEventListener("click", e => {
    const a = e.target.closest("a, button"); if (!a) return;
    if (a.classList.contains("resume")) return gc("resume-download", "Resume download");
    if (a.matches("[data-note]")) return gc("open-research-note", "Open research note");
    if (a.matches("[data-detail]")) return gc("open-project-details", "Open project details");
    if (a.matches("[data-article]")) return gc("open-article", "Open article");
    const href = a.getAttribute("href") || "";
    if (/github\.com/.test(href)) return gc("click-github", "GitHub click");
    if (/linkedin\.com/.test(href)) return gc("click-linkedin", "LinkedIn click");
    if (/openreview\.net/.test(href)) return gc("click-paper", "Paper click");
    if (/^mailto:/.test(href)) return gc("click-email", "Email click");
    if (a.textContent.trim() === "Visit site") return gc("visit-project-site", "Project site visit");
  }, true);
  const on = (sel, ev, name, title, once) => { const el = document.querySelector(sel); if (el) el.addEventListener(ev, () => gc(name, title), { once: !!once }); };
  on("#cardForm", "submit", "card-sent", "Card sent");
  on("#askForm", "submit", "guardian-question", "Guardian question");
  on("#pondWrap", "pointerdown", "koi-fed", "Fed the koi", true);
})();
