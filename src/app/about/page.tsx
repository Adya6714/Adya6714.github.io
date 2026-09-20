import type { Metadata } from "next";
import { AboutSection } from "@/components/about/AboutSection";
import { getExperience } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const experience = getExperience();
  return <AboutSection experience={experience} />;
}
