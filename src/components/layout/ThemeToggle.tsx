"use client";

import { useAmbience } from "@/components/ambience/AmbienceProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAmbience();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex w-full items-center justify-between rounded-[12px] border border-border bg-bg-card px-3 py-2 text-sm text-text-body transition-colors hover:border-accent-teal/40 hover:text-text-primary"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span>Theme</span>
      <span className="font-mono text-xs text-accent-teal">
        {theme === "dark" ? "night" : "mist"}
      </span>
    </button>
  );
}

export function AmbienceToggle() {
  const { ambienceDimmed, toggleAmbience, reducedMotion } = useAmbience();
  return (
    <button
      type="button"
      onClick={toggleAmbience}
      disabled={reducedMotion}
      className="flex w-full items-center justify-between rounded-[12px] border border-border bg-bg-card px-3 py-2 text-sm text-text-body transition-colors hover:border-accent-violet/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
      aria-pressed={ambienceDimmed}
      aria-label="Dim ambience"
    >
      <span>Dim ambience</span>
      <span className="font-mono text-xs text-accent-violet">
        {reducedMotion ? "reduced" : ambienceDimmed ? "on" : "off"}
      </span>
    </button>
  );
}
