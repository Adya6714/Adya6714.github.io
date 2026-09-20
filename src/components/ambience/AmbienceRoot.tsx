"use client";

import dynamic from "next/dynamic";
import { Waterfall } from "./Waterfall";
import { FairyTorch } from "./FairyTorch";
import { FlyingFairy } from "./FlyingFairy";

const AmbienceCanvas = dynamic(
  () => import("./AmbienceCanvas").then((m) => m.AmbienceCanvas),
  { ssr: false, loading: () => null },
);

const WhisperMotes = dynamic(
  () => import("./WhisperMotes").then((m) => m.WhisperMotes),
  { ssr: false, loading: () => null },
);

/** Isolated ambient stack. Layers never gate content visibility. */
export function AmbienceRoot() {
  return (
    <>
      <div className="ambient-base" aria-hidden />
      <div className="foliage-silhouette" aria-hidden />
      <AmbienceCanvas />
      <Waterfall />
      <WhisperMotes />
      <FairyTorch />
      <FlyingFairy />
    </>
  );
}
