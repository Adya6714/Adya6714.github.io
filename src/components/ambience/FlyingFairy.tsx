"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

/**
 * Whimsical canopy sprite — soft glowing mote with wing shimmer that
 * drifts across the viewport on a slow looping path. Decorative only.
 */
export function FlyingFairy() {
  const elRef = useRef<HTMLDivElement>(null);
  const wingRef = useRef<HTMLSpanElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode } = useAmbience();

  useEffect(() => {
    if (ambienceDimmed || reducedMotion) return;
    const el = elRef.current;
    if (!el) return;

    let raf = 0;
    let running = true;
    let t = Math.random() * Math.PI * 2;
    let paused = document.hidden;

    const onVis = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      if (!running) return;
      if (!paused) {
        t += 0.0042;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const x =
          w * 0.12 +
          ((Math.sin(t * 0.7) + 1) / 2) * w * 0.7 +
          Math.sin(t * 1.9) * 28;
        const y =
          h * 0.18 +
          ((Math.cos(t * 0.55) + 1) / 2) * h * 0.55 +
          Math.cos(t * 1.4) * 22;
        const angle =
          Math.atan2(
            Math.cos(t * 0.55) * 0.5 * h + Math.sin(t * 1.4) * 22,
            Math.cos(t * 0.7) * 0.5 * w + Math.cos(t * 1.9) * 28,
          ) *
          (180 / Math.PI);

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle * 0.15}deg)`;
        el.style.opacity = String(readerMode ? 0.18 : 0.72);

        if (wingRef.current) {
          const flap = 0.65 + Math.sin(t * 18) * 0.35;
          wingRef.current.style.transform = `scaleX(${flap})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ambienceDimmed, reducedMotion, readerMode]);

  if (ambienceDimmed || reducedMotion) return null;

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[4] will-change-transform"
      style={{ opacity: 0.72, mixBlendMode: "screen" }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span
          className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-warm) 70%, transparent) 0%, color-mix(in srgb, var(--accent-teal) 25%, transparent) 45%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        <span
          ref={wingRef}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-0.5 will-change-transform"
        >
          <span
            className="h-3 w-4 -rotate-12 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent-violet) 55%, transparent), transparent)",
            }}
          />
          <span
            className="h-3 w-4 rotate-12 rounded-full"
            style={{
              background:
                "linear-gradient(225deg, color-mix(in srgb, var(--accent-teal) 55%, transparent), transparent)",
            }}
          />
        </span>
        <span
          className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "var(--accent-warm)",
            boxShadow: "0 0 8px var(--accent-warm)",
          }}
        />
      </div>
    </div>
  );
}
