/* Animated painted backdrop: WebGL flow-map water, with a static fallback. */
(() => {
"use strict";
const A = window.ASSETS || {}, MAP_W = 848, MAP_H = 1264;
const $ = s => document.querySelector(s);
const canvas = $("#scene"), bg = $("#bg"), fxc = $("#fx"), fx = fxc.getContext("2d");
let gl = null, prog, U = {}, ready = false, W = innerWidth, H = innerHeight, dirty = true;
let target = 0, p = 0, last = performance.now(), t0 = last, night = 0, nightT = 0;
const rips = [], ripBuf = new Float32Array(24);
const S = window.SceneState = { calm: matchMedia("(prefers-reduced-motion: reduce)").matches, night: false };

function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; }
function init() {
  try { gl = canvas.getContext("webgl2", { antialias: false, alpha: false }) || canvas.getContext("webgl", { antialias: false, alpha: false }); } catch (e) { gl = null; }
  if (!gl) return false;
  const vs = sh(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
  const fs = sh(gl.FRAGMENT_SHADER, document.getElementById("sceneFrag").textContent);
  if (!vs || !fs) return false;
  prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
  gl.useProgram(prog);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const l = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  ["uPlate", "uFlow", "uFoam", "uCam", "uRes", "uMap", "uTime", "uMotion", "uRip", "uNight"].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.uniform1i(U.uPlate, 0); gl.uniform1i(U.uFlow, 1); gl.uniform1i(U.uFoam, 2); gl.uniform2f(U.uMap, MAP_W, MAP_H);
  return true;
}
const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function tex(unit, img, fmt, mip) {
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE); let src = img;
  if (img.width > max) { const c = document.createElement("canvas"), k = max / img.width; c.width = max; c.height = Math.floor(img.height * k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); src = c; }
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, src);
  const isGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
  if (mip && isGL2) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
  else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
function resize() {
  W = innerWidth; H = innerHeight;
  const q = Math.min(window.devicePixelRatio || 1, 1.5) * (W > 1700 ? .8 : 1);
  canvas.width = Math.round(W * q); canvas.height = Math.round(H * q);
  const d = Math.min(window.devicePixelRatio || 1, 2); fxc.width = Math.round(W * d); fxc.height = Math.round(H * d); fx.setTransform(d, 0, 0, d, 0, 0);
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  dirty = true;
}
function scrollP() { const m = document.documentElement.scrollHeight - H; return m > 0 ? Math.min(1, Math.max(0, scrollY / m)) : 0; }
function cam() {
  let visW, visH;
  if (W / H >= MAP_W / MAP_H) { visW = MAP_W; visH = MAP_W * H / W; } else { visH = MAP_H; visW = MAP_H * W / H; }
  const x0 = (MAP_W - visW) / 2, y0 = p * (MAP_H - visH);
  return [x0 / MAP_W, y0 / MAP_H, visW / MAP_W, visH / MAP_H];
}
addEventListener("pointermove", e => { const n = performance.now(); if (n - (cam.lr || 0) > 160 && Math.hypot(e.clientX - (cam.lx || 0), e.clientY - (cam.ly || 0)) > 36) { rips.push({ x: e.clientX / W, y: e.clientY / H, a: 0 }); if (rips.length > 8) rips.shift(); cam.lr = n; cam.lx = e.clientX; cam.ly = e.clientY; dirty = true; } }, { passive: true });
addEventListener("pointerdown", e => { rips.push({ x: e.clientX / W, y: e.clientY / H, a: 0 }); if (rips.length > 8) rips.shift(); dirty = true; }, { passive: true });
addEventListener("resize", resize);
addEventListener("scroll", () => { dirty = true; }, { passive: true });

/* fireflies */
const flies = Array.from({ length: 44 }, () => ({ x: Math.random(), y: Math.random(), z: .35 + Math.random() * .9, ph: Math.random() * 6.28, warm: Math.random() < .4 }));
function drawFx(t) {
  fx.clearRect(0, 0, W, H);
  if (S.calm) return;
  fx.globalCompositeOperation = "lighter";
  const n = S.night ? 44 : 18;
  for (let i = 0; i < n; i++) {
    const f = flies[i], x = f.x * W + Math.sin(t * .3 + f.ph * 2) * 40, y = ((f.y * H - scrollY * .15 * f.z + Math.sin(t * .45 + f.ph) * 30) % H + H) % H;
    const a = (.25 + .75 * Math.abs(Math.sin(t * (.6 + f.z * .5) + f.ph))) * (S.night ? .9 : .6), r = 5 * f.z + 2;
    const c = S.night ? (f.warm ? "185,166,255" : "114,241,223") : (f.warm ? "255,207,134" : "114,241,223");
    const g = fx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`);
    fx.fillStyle = g; fx.beginPath(); fx.arc(x, y, r * 3, 0, 6.283); fx.fill();
  }
  fx.globalCompositeOperation = "source-over";
}
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000) || .016; last = now;
  const tp = scrollP(), k = S.calm ? 1 : 1 - Math.exp(-dt * 6); const pp = p; p += (tp - p) * k; if (Math.abs(p - pp) > 1e-5) dirty = true;
  nightT = S.night ? 1 : 0; const pn = night; night += (nightT - night) * (1 - Math.exp(-dt * 3)); if (Math.abs(night - pn) > 1e-4) dirty = true;
  for (let i = 0; i < 8; i++) { const r = rips[i]; if (r) { r.a += dt; ripBuf[i * 3] = r.x; ripBuf[i * 3 + 1] = r.y; ripBuf[i * 3 + 2] = Math.max(r.a, .001); } else ripBuf[i * 3 + 2] = -1; }
  while (rips.length && rips[0].a > 3.5) rips.shift();
  if (ready && !document.hidden && (!S.calm || dirty)) {
    const c = cam();
    gl.uniform4f(U.uCam, c[0], c[1], c[2], c[3]); gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, (now - t0) / 1000); gl.uniform1f(U.uMotion, S.calm ? 0 : 1); gl.uniform1f(U.uNight, night); gl.uniform3fv(U.uRip, ripBuf);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); dirty = false;
  } else if (!ready) { bg.style.backgroundPosition = `50% ${p * 100}%`; }
  if (!document.hidden) drawFx((now - t0) / 1000);
  requestAnimationFrame(frame);
}
resize();
const ok = init();
if (ok) {
  Promise.all([load(A.plate), load(A.flow), load(A.foam)]).then(([a, b, c]) => {
    tex(0, a, gl.RGB, true); tex(1, b, gl.RGB, false); tex(2, c, gl.LUMINANCE, false); ready = true; dirty = true; document.body.classList.remove("loading");
  }).catch(() => { document.body.classList.add("nowebgl"); bg.style.backgroundImage = `url(${A.plate})`; bg.style.backgroundSize = "cover"; document.body.classList.remove("loading"); });
} else { document.body.classList.add("nowebgl"); bg.style.backgroundImage = `url(${A.plate})`; document.body.classList.remove("loading"); }
requestAnimationFrame(frame);
window.addEventListener("scene:dirty", () => { dirty = true; });
})();
