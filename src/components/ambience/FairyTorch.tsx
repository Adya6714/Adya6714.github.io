"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

/**
 * Layer 4: Fairy torch — warm radial following pointer with lerp + sine wobble.
 * Brightens decorative layers only; never masks or hides content.
 */
export function FairyTorch() {
  const elRef = useRef<HTMLDivElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode, isTouch, pointerRef } =
    useAmbience();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (ambienceDimmed || reducedMotion) return;

    const el = elRef.current;
    if (!el) return;

    target.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    current.current = { ...target.current };

    let raf = 0;
    let running = true;
    let t = 0;

    const onMove = (e: PointerEvent) => {
      if (isTouch) return;
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onResize = () => {
      if (!isTouch) return;
      target.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    };

    const tick = () => {
      if (!running) return;
      t += 0.016;
      const lerp = 0.08;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      const wobbleX = Math.sin(t * 1.3) * 6;
      const wobbleY = Math.cos(t * 1.1) * 5;
      const x = current.current.x + wobbleX;
      const y = current.current.y + wobbleY;

      el.style.transform = `translate3d(${x - 190}px, ${y - 190}px, 0)`;
      pointerRef.current = { x, y };

      const cards = document.querySelectorAll<HTMLElement>(".card-surface");
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(cx - x, cy - y);
        card.dataset.rim = dist < 220 ? "true" : "false";
      });

      raf = requestAnimationFrame(tick);
    };

    if (isTouch) {
      target.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      pointerRef.current = { ...target.current };
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.querySelectorAll<HTMLElement>(".card-surface").forEach((c) => {
        c.dataset.rim = "false";
      });
    };
  }, [ambienceDimmed, reducedMotion, isTouch, pointerRef]);

  if (ambienceDimmed || reducedMotion) return null;

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[3] h-[380px] w-[380px] will-change-transform"
      style={{
        opacity: readerMode ? 0.3 * 0.55 : 0.55,
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--accent-warm) 55%, transparent) 0%, color-mix(in srgb, var(--accent-warm) 18%, transparent) 42%, transparent 70%)",
      }}
    />
  );
}
