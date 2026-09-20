"use client";

import { useEffect, useRef } from "react";
import { useAmbience } from "./AmbienceProvider";

/**
 * Layer 2: right-edge indoor waterfall — vertical flow sheets, mist bloom,
 * soft bioluminescent caustics. 0.4x scroll parallax. Hidden in reader mode.
 */
export function Waterfall() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheet2Ref = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const causticRef = useRef<HTMLDivElement>(null);
  const { ambienceDimmed, reducedMotion, readerMode } = useAmbience();

  useEffect(() => {
    if (ambienceDimmed || reducedMotion || readerMode) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * 0.4;
        if (sheetRef.current)
          sheetRef.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        if (sheet2Ref.current)
          sheet2Ref.current.style.transform = `translate3d(0, ${y * -0.22}px, 0)`;
        if (mistRef.current)
          mistRef.current.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
        if (causticRef.current)
          causticRef.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
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
      <div ref={sheetRef} className="waterfall-sheet absolute inset-0 will-change-transform" />
      <div
        ref={sheet2Ref}
        className="waterfall-sheet-secondary absolute inset-0 will-change-transform"
      />
      <div
        ref={causticRef}
        className="waterfall-caustics absolute inset-0 will-change-transform"
      />
      <div
        ref={mistRef}
        className="absolute right-0 bottom-0 left-0 h-48 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at 50% 85%, color-mix(in srgb, var(--accent-teal) 32%, transparent), color-mix(in srgb, var(--accent-violet) 12%, transparent) 45%, transparent 72%)",
          filter: "blur(20px)",
          opacity: 0.5,
        }}
      />
      {/* Soft spray dots at base */}
      <div className="waterfall-spray absolute bottom-8 left-1/2 h-24 w-28 -translate-x-1/2" />
    </div>
  );
}
