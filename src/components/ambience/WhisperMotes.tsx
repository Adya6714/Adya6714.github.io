"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

type Mote = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  hue: "warm" | "teal" | "violet";
};

/**
 * Soft bioluminescent motes that blink and drift — whimsical canopy life.
 * Opacity capped low; disabled with dim ambience / reduced motion.
 */
export function WhisperMotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode, pointerRef } = useAmbience();

  useEffect(() => {
    if (ambienceDimmed || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const motes: Mote[] = [];

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    for (let i = 0; i < 18; i++) {
      motes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 1.2 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
        hue: (["warm", "teal", "violet"] as const)[i % 3],
      });
    }

    resize();
    let t0 = performance.now();

    const color = (h: Mote["hue"], a: number) => {
      if (h === "warm") return `rgba(255, 215, 154, ${a})`;
      if (h === "teal") return `rgba(79, 209, 217, ${a})`;
      return `rgba(167, 139, 250, ${a})`;
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(32, now - t0);
      t0 = now;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const base = readerMode ? 0.3 : 1;
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;

      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.phase += m.speed * (dt / 16);
        m.x += Math.sin(m.phase * 0.7) * 0.15;
        m.y -= 0.08 * (dt / 16);
        if (m.y < -6) {
          m.y = h + 6;
          m.x = Math.random() * w;
        }
        const blink = 0.15 + (Math.sin(m.phase * 2.2) * 0.5 + 0.5) * 0.55;
        const dist = Math.hypot(m.x - px, m.y - py);
        const boost = dist < 160 ? 1 + (1 - dist / 160) * 0.9 : 1;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * boost, 0, Math.PI * 2);
        ctx.fillStyle = color(m.hue, blink * 0.55 * base * boost);
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
    };
  }, [ambienceDimmed, reducedMotion, readerMode, pointerRef]);

  if (ambienceDimmed || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3]"
      style={{ opacity: "var(--ambience-opacity)" }}
    />
  );
}
