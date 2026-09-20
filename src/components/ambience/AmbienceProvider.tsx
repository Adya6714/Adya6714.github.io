"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type Theme = "dark" | "light";

type AmbienceContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  ambienceDimmed: boolean;
  setAmbienceDimmed: (v: boolean) => void;
  toggleAmbience: () => void;
  readerMode: boolean;
  setReaderMode: (v: boolean) => void;
  reducedMotion: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
  isTouch: boolean;
};

const AmbienceContext = createContext<AmbienceContextValue | null>(null);

const THEME_KEY = "lumenwald-theme";
const AMBIENCE_KEY = "lumenwald-ambience-dim";

export function AmbienceProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [ambienceDimmed, setAmbienceDimmedState] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [ready, setReady] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const storedDim = localStorage.getItem(AMBIENCE_KEY);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    }
    if (storedDim === "1") setAmbienceDimmedState(true);
    setReducedMotion(mq.matches);
    setIsTouch(touch);
    pointerRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setReady(true);

    const onMotion = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMotion);
    return () => mq.removeEventListener("change", onMotion);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    const dim = ambienceDimmed || reducedMotion;
    document.documentElement.setAttribute("data-ambience", dim ? "dim" : "full");
    localStorage.setItem(AMBIENCE_KEY, ambienceDimmed ? "1" : "0");
  }, [ambienceDimmed, reducedMotion, ready]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-reader",
      readerMode ? "true" : "false",
    );
  }, [readerMode]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );
  const setAmbienceDimmed = useCallback(
    (v: boolean) => setAmbienceDimmedState(v),
    [],
  );
  const toggleAmbience = useCallback(
    () => setAmbienceDimmedState((v) => !v),
    [],
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      ambienceDimmed: ambienceDimmed || reducedMotion,
      setAmbienceDimmed,
      toggleAmbience,
      readerMode,
      setReaderMode,
      reducedMotion,
      pointerRef,
      isTouch,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
      ambienceDimmed,
      reducedMotion,
      setAmbienceDimmed,
      toggleAmbience,
      readerMode,
      isTouch,
    ],
  );

  return (
    <AmbienceContext.Provider value={value}>{children}</AmbienceContext.Provider>
  );
}

export function useAmbience() {
  const ctx = useContext(AmbienceContext);
  if (!ctx) throw new Error("useAmbience must be used within AmbienceProvider");
  return ctx;
}
