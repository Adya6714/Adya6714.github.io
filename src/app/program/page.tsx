import type { Metadata } from "next";
import { ResearchProgram } from "@/components/program/ResearchProgram";

export const metadata: Metadata = {
  title: "Research Program",
};

export default function ProgramPage() {
  return <ResearchProgram />;
}
