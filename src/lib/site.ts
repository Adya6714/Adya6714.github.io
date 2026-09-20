export const siteConfig = {
  name: "Lumenwald",
  tagline: "Research notes from the canopy",
  author: "Adya Srivastava",
  description:
    "AI/ML research portfolio on LLM evaluation methodology, mechanistic interpretability, and the gap between benchmark accuracy and genuine reasoning.",
  url: "https://portfolio-ebon-theta-79.vercel.app",
  email: "adyasrivastava6714@gmail.com",
  github: "https://github.com/Adya6714",
  linkedin: "https://www.linkedin.com/in/adya-srivastava",
} as const;

export const navItems = [
  { href: "/", label: "Home", id: "home" },
  { href: "/research", label: "Research", id: "research" },
  { href: "/library", label: "Library", id: "library" },
  { href: "/writing", label: "Writing", id: "writing" },
  { href: "/about", label: "About", id: "about" },
] as const;
