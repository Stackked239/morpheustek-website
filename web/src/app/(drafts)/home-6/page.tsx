import type { Metadata } from "next";
import { PointCloudHero } from "./_components/PointCloudHero";
import { StackedPillars } from "./_components/StackedPillars";
import { DepthLedger } from "./_components/DepthLedger";
import { ProductReel } from "./_components/ProductReel";
import { AngleCta } from "./_components/AngleCta";

/* =============================================================================
   HOME-6 — "A Million Points of Sight" (luminous interactive)

   The light, kinetic counterpart to home-5's dark control room: a live
   interactive point-cloud hero (hand-rolled canvas — the cursor is the
   scanner), a sticky pillar card-stack, a log-scale depth ledger whose bars
   draw on scroll, and a snap reel with a scroll-timeline progress rule.
   Deliberately NOT the rejected dark hacker-HUD: white page, editorial type,
   brand blues with the pc depth ramp reserved for data.

   Discipline:
   - every spec/range on the ledger is a true catalog.ts figure
   - scroll/draw effects are CSS scroll-driven animations behind @supports;
     canvas pauses offscreen, respects reduced-motion, and no-JS still gets
     a complete page over the static point texture
   - one yellow CTA per viewport; navy text on yellow
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 6 · A Million Points of Sight",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant6() {
  return (
    <>
      {/* live point-cloud scan; you are the scanner */}
      <PointCloudHero />

      {/* the three pillars, stacking as you scroll */}
      <StackedPillars />

      {/* 0.1 m → 100 m coverage, every bar a true catalog range */}
      <DepthLedger />

      {/* horizontal snap reel with scroll-timeline progress */}
      <ProductReel />

      {/* 60° brand-angle close */}
      <AngleCta />
    </>
  );
}
