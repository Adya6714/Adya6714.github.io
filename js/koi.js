/* Feed the koi: swimming fish, food pellets, jumps, splashes and thank-you bubbles. */
(() => {
"use strict";
const C = window.CONTENT, S = window.SceneState;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let wrap, cv, ctx, W = 0, H = 0, dpr = 1, fish = [], pellets = [], rings = [], drops = [], fed = 0, visible = false, last = 0, t = 0, jumpers = 0, tipHidden = false;
const R = (a, b) => a + Math.random() * (b - a);
const COLS = [
  { body: ["#ff8a3d", "#f2631f"], patch: "#fff3e0", spot: "#2a1a14" },
  { body: ["#fff4e6", "#f3d9bd"], patch: "#ff7a2f", spot: "#c2410c" },
  { body: ["#ffb347", "#f08a1c"], patch: "#fff8ee", spot: "#7a2a0a" },
  { body: ["#f6f1ea", "#d9d0c4"], patch: "#e4572e", spot: "#1f1a17" },
  { body: ["#ff9d5c", "#e0561f"], patch: "#ffe7c7", spot: "#3a1a0f" },
  { body: ["#ffd27a", "#f2a43a"], patch: "#fff6df", spot: "#b4541a" },
  { body: ["#fdf3e4", "#e8cfae"], patch: "#ff8a3d", spot: "#2a1a14" }
];
function mkFish(i) {
  const size = R(15, 22), n = 11, c = COLS[i % COLS.length], x = R(.1, .9) * W, y = R(.2, .8) * H, a = R(0, 6.28);
  const pts = []; for (let k = 0; k < n; k++) pts.push({ x: x - Math.cos(a) * k * size * .55, y: y - Math.sin(a) * k * size * .55 });
  return { x, y, a, size, n, pts, c, ph: R(0, 9), sp: R(34, 52), state: "swim", jt: 0, jd: 0, jx: 0, jy: 0, say: "", sayT: 0, full: 0, tail: 0, patches: Array.from({ length: 3 }, () => ({ k: 1 + Math.floor(R(0, n - 4)), r: R(.45, .8), dx: R(-.2, .2) })) };
}
function size() { const r = wrap.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
function ring(x, y, big) { rings.push({ x, y, r: 2, max: big ? 46 : 26, a: .8 }); }
function splash(x, y, n) { ring(x, y, true); for (let i = 0; i < n; i++) drops.push({ x, y, vx: R(-70, 70), vy: R(-160, -60), life: R(.5, .9), a: 0 }); }
function feed(x, y) {
  if (pellets.length > 14) pellets.shift();
  pellets.push({ x, y, t: 0 }); ring(x, y, false);
  if (!tipHidden) { tipHidden = true; const tp = document.getElementById("pondTip"); if (tp) tp.style.opacity = 0; }
}
function say(f) { const arr = C.koi.thanks; f.say = arr[Math.floor(Math.random() * arr.length)]; f.sayT = 2.2; }
function eat(f, p) {
  pellets.splice(pellets.indexOf(p), 1); fed++; f.full++; ring(p.x, p.y, false); say(f);
  const el = document.getElementById("fedCount"); if (el) el.textContent = "Fed: " + fed;
  if (fed === 10 && window.toast) window.toast("They like you.");
  if (!reduce && !S.calm && f.state === "swim" && jumpers < 2 && Math.random() < .75) { f.state = "jump"; f.jt = 0; f.jd = R(.85, 1.1); f.jx = Math.cos(f.a); f.jy = Math.sin(f.a); jumpers++; splash(f.pts[0].x, f.pts[0].y, 8); }
}
function step(dt) {
  const slow = S.calm || reduce ? .4 : 1; dt *= slow; t += dt;
  for (const f of fish) {
    f.ph += dt; f.sayT = Math.max(0, f.sayT - dt);
    const h = f.pts[0];
    if (f.state === "jump") {
      f.jt += dt / f.jd; const sp = f.sp * 3.2;
      h.x += f.jx * sp * dt; h.y += f.jy * sp * dt;
      if (f.jt >= 1) { f.state = "swim"; jumpers--; splash(h.x, h.y, 10); }
    } else {
      let target = null, bd = 340;
      for (const p of pellets) { const d = Math.hypot(p.x - h.x, p.y - h.y); if (d < bd) { bd = d; target = p; } }
      let want = f.a + (Math.sin(f.ph * .7) * .6 + Math.sin(f.ph * .31 + 2) * .4) * dt * 1.6;
      if (target) { const ta = Math.atan2(target.y - h.y, target.x - h.x); let d = ta - f.a; d = Math.atan2(Math.sin(d), Math.cos(d)); want = f.a + Math.max(-1, Math.min(1, d)) * Math.min(1, dt * 5); }
      const m = 46; let cx = 0, cy = 0; if (h.x < m) cx = 1; if (h.x > W - m) cx = -1; if (h.y < m) cy = 1; if (h.y > H - m) cy = -1;
      if (cx || cy) { const ta = Math.atan2(cy || (H / 2 - h.y) * .01, cx || (W / 2 - h.x) * .01); let d = ta - f.a; d = Math.atan2(Math.sin(d), Math.cos(d)); want = f.a + d * Math.min(1, dt * 3); }
      f.a = want; const sp = f.sp * (target ? 2.1 : 1) * (1 + Math.sin(f.ph * 2) * .15);
      h.x += Math.cos(f.a) * sp * dt; h.y += Math.sin(f.a) * sp * dt;
      if (target && Math.hypot(target.x - h.x, target.y - h.y) < f.size * .9) eat(f, target);
    }
    for (let k = 1; k < f.n; k++) { const a = f.pts[k - 1], b = f.pts[k], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, L = f.size * .55; b.x = a.x + dx / d * L; b.y = a.y + dy / d * L; }
    f.tail = Math.sin(f.ph * 5.5) * .55;
  }
  for (const p of pellets) p.t += dt; for (let i = pellets.length - 1; i >= 0; i--) if (pellets[i].t > 18) pellets.splice(i, 1);
  for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.r += dt * 42; r.a -= dt * .9; if (r.a <= 0 || r.r > r.max * 2.4) rings.splice(i, 1); }
  for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.a += dt; d.vy += 420 * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.a > d.life) drops.splice(i, 1); }
}
function drawFish(f) {
  const air = f.state === "jump" ? Math.sin(Math.PI * Math.min(1, f.jt)) : 0, lift = air * 62, sc = 1 + air * .38, pts = f.pts;
  if (air > 0) { ctx.save(); ctx.globalAlpha = .22 * (1 - air * .5); ctx.fillStyle = "#001018"; ctx.beginPath(); ctx.ellipse(pts[3].x + 8, pts[3].y + 10, f.size * 2.2 * (1 - air * .3), f.size * .7, f.a, 0, 6.283); ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.translate(0, -lift); ctx.translate(pts[3].x, pts[3].y); ctx.scale(sc, sc); ctx.translate(-pts[3].x, -pts[3].y);
  const wd = k => { const u = k / (f.n - 1); return f.size * (.34 + Math.sin(Math.min(1, u * 1.15 + .12) * Math.PI) * .62) * (u > .85 ? (1 - (u - .85) * 4) : 1); };
  const L = [], Rr = [];
  for (let k = 0; k < f.n; k++) { const p = pts[k], q = pts[Math.min(k + 1, f.n - 1)], o = pts[Math.max(k - 1, 0)]; let dx = o.x - q.x, dy = o.y - q.y; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; const w = wd(k) * .5; L.push([p.x - dy * w, p.y + dx * w]); Rr.push([p.x + dy * w, p.y - dx * w]); }
  const tp = pts[f.n - 1], pp = pts[f.n - 2], ta = Math.atan2(tp.y - pp.y, tp.x - pp.x), tl = f.size * 1.9, sw = f.tail;
  ctx.fillStyle = f.c.patch; ctx.globalAlpha = .85; ctx.beginPath(); ctx.moveTo(tp.x, tp.y);
  ctx.quadraticCurveTo(tp.x + Math.cos(ta + .9 + sw) * tl, tp.y + Math.sin(ta + .9 + sw) * tl, tp.x + Math.cos(ta + .35 + sw) * tl * 1.25, tp.y + Math.sin(ta + .35 + sw) * tl * 1.25);
  ctx.quadraticCurveTo(tp.x + Math.cos(ta + sw) * tl * .5, tp.y + Math.sin(ta + sw) * tl * .5, tp.x + Math.cos(ta - .35 + sw) * tl * 1.25, tp.y + Math.sin(ta - .35 + sw) * tl * 1.25);
  ctx.quadraticCurveTo(tp.x + Math.cos(ta - .9 + sw) * tl, tp.y + Math.sin(ta - .9 + sw) * tl, tp.x, tp.y); ctx.fill(); ctx.globalAlpha = 1;
  [-1, 1].forEach(sd => { const b = pts[2], fa = f.a + sd * (1.15 + Math.sin(f.ph * 4) * .2); ctx.fillStyle = f.c.patch; ctx.globalAlpha = .8; ctx.beginPath(); ctx.ellipse(b.x + Math.cos(fa) * f.size * .55, b.y + Math.sin(fa) * f.size * .55, f.size * .55, f.size * .2, fa, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; });
  const g = ctx.createLinearGradient(pts[0].x, pts[0].y, tp.x, tp.y); g.addColorStop(0, f.c.body[0]); g.addColorStop(1, f.c.body[1]);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (let k = 1; k < f.n; k++) ctx.lineTo(L[k][0], L[k][1]); for (let k = f.n - 1; k >= 0; k--) ctx.lineTo(Rr[k][0], Rr[k][1]); ctx.closePath(); ctx.fill();
  f.patches.forEach(pt => { const p = pts[pt.k]; ctx.fillStyle = f.c.patch; ctx.beginPath(); ctx.ellipse(p.x, p.y, f.size * pt.r * .8, wd(pt.k) * .38, f.a, 0, 6.283); ctx.fill(); ctx.fillStyle = f.c.spot; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(p.x + 2, p.y - 1, wd(pt.k) * .12, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; });
  const h = pts[0], ex = Math.cos(f.a), ey = Math.sin(f.a); ctx.fillStyle = "#0b0b0b";
  [-1, 1].forEach(sd => { ctx.beginPath(); ctx.arc(h.x + ex * f.size * .12 - ey * sd * f.size * .24, h.y + ey * f.size * .12 + ex * sd * f.size * .24, f.size * .09, 0, 6.283); ctx.fill(); });
  ctx.restore();
  if (f.sayT > 0) {
    const a = Math.min(1, f.sayT * 2, (2.2 - f.sayT) * 5), bx = pts[0].x, by = pts[0].y - lift - f.size * 2.2;
    ctx.save(); ctx.globalAlpha = a; ctx.font = "600 15px Figtree, system-ui, sans-serif"; const tw = ctx.measureText(f.say).width + 22, bh = 30, x = Math.max(6, Math.min(W - tw - 6, bx - tw / 2)), y = Math.max(6, by - bh);
    ctx.fillStyle = "#fffaf0"; ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, tw, bh, 14) : ctx.rect(x, y, tw, bh); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 6, y + bh - 1); ctx.lineTo(bx + 4, y + bh + 9); ctx.lineTo(bx + 8, y + bh - 1); ctx.fillStyle = "#fffaf0"; ctx.fill();
    ctx.fillStyle = "#2a2314"; ctx.textBaseline = "middle"; ctx.fillText(f.say, x + 11, y + bh / 2 + 1); ctx.restore();
  }
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < 5; i++) { const x = ((t * 14 + i * 190) % (W + 200)) - 100, y = H * (.2 + i * .17) + Math.sin(t * .6 + i) * 14; const g = ctx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, "rgba(180,240,235,.07)"); g.addColorStop(1, "rgba(180,240,235,0)"); ctx.fillStyle = g; ctx.fillRect(x - 120, y - 120, 240, 240); }
  for (const r of rings) { ctx.strokeStyle = `rgba(210,250,255,${Math.max(0, r.a)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * .5, 0, 0, 6.283); ctx.stroke(); }
  for (const p of pellets) { const b = Math.sin(p.t * 3) * 1.2; ctx.fillStyle = "#d9a85a"; ctx.beginPath(); ctx.arc(p.x, p.y + b, 4.2, 0, 6.283); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.arc(p.x - 1.2, p.y + b - 1.4, 1.4, 0, 6.283); ctx.fill(); }
  fish.slice().sort((a, b) => (a.state === "jump") - (b.state === "jump")).forEach(drawFish);
  for (const d of drops) { ctx.fillStyle = `rgba(225,250,255,${1 - d.a / d.life})`; ctx.beginPath(); ctx.arc(d.x, d.y, 2.4, 0, 6.283); ctx.fill(); }
}
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000) || .016; last = now;
  if (visible && !document.hidden) { step(dt); draw(); }
  requestAnimationFrame(loop);
}
function init() {
  wrap = document.getElementById("pondWrap"); if (!wrap) return; cv = document.getElementById("pondCv"); ctx = cv.getContext("2d");
  size(); fish = Array.from({ length: 7 }, (_, i) => mkFish(i));
  new ResizeObserver(() => { const ow = W, oh = H; size(); if (ow && oh) fish.forEach(f => f.pts.forEach(p => { p.x *= W / ow; p.y *= H / oh; })); }).observe(wrap);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .1 }).observe(wrap);
  wrap.addEventListener("pointerdown", e => { const r = wrap.getBoundingClientRect(); feed(e.clientX - r.left, e.clientY - r.top); });
  window.__koi = { get fed() { return fed; }, fish: () => fish, feed, step, draw };
  requestAnimationFrame(loop);
}
window.Koi = { init };
})();
