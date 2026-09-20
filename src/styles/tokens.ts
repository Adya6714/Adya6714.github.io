/** Design tokens for Lumenwald — mirror of src/styles/tokens.css */

export const colors = {
  bgBase: "#0F1520",
  bgRaised: "#161E2B",
  bgCard: "#1B2433",
  border: "#2A3546",
  textPrimary: "#E8EEF6",
  textBody: "#B4C0D0",
  textMuted: "#7A8798",
  accentTeal: "#4FD1D9",
  accentViolet: "#A78BFA",
  accentWarm: "#FFD79A",
} as const;

export const typography = {
  display: "Cormorant Garamond",
  sans: "Geist",
  mono: "JetBrains Mono",
  bodySize: "16.5px",
  bodyLineHeight: 1.7,
  proseMaxCh: 68,
} as const;

export const layout = {
  sidebarWidth: 240,
  contentMax: 1100,
  radius: 12,
} as const;

export const ambience = {
  fogOpacity: 0.1,
  particleCount: 40,
  waterfallWidth: 180,
  waterfallParallax: 0.4,
  torchSize: 380,
  torchOpacity: 0.55,
  torchLerp: 0.08,
  readerDim: 0.3,
} as const;
