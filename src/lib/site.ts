export const siteConfig = {
  name: "Lumenwald",
  tagline: "Research notes from the canopy",
  author: "Adya Srivastava",
  description:
    "AI/ML research portfolio and writing on LLM evaluation, mechanistic interpretability, and the gap between benchmark accuracy and genuine reasoning.",
  url: "https://lumenwald.dev",
  email: "adya@lumenwald.dev",
  github: "https://github.com/adyasrivastava",
  scholar: "https://scholar.google.com",
  linkedin: "https://linkedin.com/in/adyasrivastava",
} as const;

export const navItems = [
  { href: "/", label: "Home", id: "home" },
  { href: "/research", label: "Constellation", id: "research" },
  { href: "/program", label: "Program", id: "program" },
  { href: "/grimoire", label: "Grimoire", id: "grimoire" },
  { href: "/writing", label: "Writing", id: "writing" },
  { href: "/about", label: "About", id: "about" },
] as const;
