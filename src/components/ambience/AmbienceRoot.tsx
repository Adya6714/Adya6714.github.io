"use client";

import dynamic from "next/dynamic";
import { Waterfall } from "./Waterfall";
import { FairyTorch } from "./FairyTorch";

const AmbienceCanvas = dynamic(
  () =>
    import("./AmbienceCanvas").then((m) => m.AmbienceCanvas),
  { ssr: false, loading: () => null },
);

/** Isolated ambient stack: Layer 0 is CSS; 1–4 mount client-side and tear down cleanly. */
export function AmbienceRoot() {
  return (
    <>
      <div className="ambient-base" aria-hidden />
      <AmbienceCanvas />
      <Waterfall />
      <FairyTorch />
    </>
  );
}
