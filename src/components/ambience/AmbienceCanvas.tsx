"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  hue: "teal" | "violet";
  alpha: number;
};

/**
 * Layers 1 + 3: fog noise clouds + drifting particles.
 * Decorative only — never gates content visibility.
 */
export function AmbienceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode, pointerRef, isTouch } =
    useAmbience();

  useEffect(() => {
    if (ambienceDimmed || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: 1 + Math.random() * 2,
          speed: 0.12 + Math.random() * 0.25,
          drift: (Math.random() - 0.5) * 0.2,
          hue: Math.random() > 0.45 ? "teal" : "violet",
          alpha: 0.25 + Math.random() * 0.35,
        });
      }
    };

    resize();
    seedParticles();

    let t0 = performance.now();
    const fogA = { x: 0.3, y: 0.4, phase: 0 };
    const fogB = { x: 0.7, y: 0.55, phase: Math.PI };

    const drawFog = (cx: number, cy: number, phase: number, color: string) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ox = Math.sin(phase) * w * 0.04;
      const oy = Math.cos(phase * 0.7) * h * 0.03;
      const g = ctx.createRadialGradient(
        cx * w + ox,
        cy * h + oy,
        0,
        cx * w + ox,
        cy * h + oy,
        Math.max(w, h) * 0.35,
      );
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(32, now - t0);
      t0 = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const baseOpacity = readerMode ? 0.3 : 1;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.1 * baseOpacity;

      fogA.phase += dt * 0.00008;
      fogB.phase += dt * 0.00006;
      drawFog(fogA.x, fogA.y, fogA.phase, "rgba(79, 209, 217, 1)");
      drawFog(fogB.x, fogB.y, fogB.phase, "rgba(167, 139, 250, 1)");

      // Torch brightening of particles within radius (decorative only)
      const px = pointerRef.current.x;
      const py = isTouch ? h * 0.5 : pointerRef.current.y;
      const torchR = 190;

      ctx.globalAlpha = 1;
      for (const p of particles) {
        p.y -= p.speed * (dt / 16);
        p.x += p.drift * (dt / 16);
        if (p.y < -4) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;

        const dx = p.x - px;
        const dy = p.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = dist < torchR ? 1 + (1 - dist / torchR) * 0.8 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === "teal"
            ? `rgba(79, 209, 217, ${p.alpha * boost * baseOpacity})`
            : `rgba(167, 139, 250, ${p.alpha * boost * baseOpacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [ambienceDimmed, reducedMotion, readerMode, isTouch]);

  if (ambienceDimmed || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: "var(--ambience-opacity)" }}
    />
  );
}
