"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

export function Waterfall() {
  const ref = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode } = useAmbience();

  useEffect(() => {
    if (ambienceDimmed || reducedMotion || readerMode) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * 0.4;
        el.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        if (mistRef.current) {
          mistRef.current.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ambienceDimmed, reducedMotion, readerMode]);

  if (ambienceDimmed || reducedMotion || readerMode) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 z-[2] hidden h-full w-[180px] overflow-hidden md:block"
      style={{ opacity: "var(--waterfall-visible, 1)" }}
    >
      <div ref={ref} className="waterfall-sheet absolute inset-0 will-change-transform" />
      <div
        ref={mistRef}
        className="absolute right-0 bottom-0 left-0 h-40 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, color-mix(in srgb, var(--accent-teal) 28%, transparent), transparent 70%)",
          filter: "blur(18px)",
          opacity: 0.45,
        }}
      />
    </div>
  );
}
