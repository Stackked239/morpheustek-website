import type { Metadata } from "next";
import { NightHero } from "./_components/NightHero";
import { DualView } from "./_components/DualView";
import { ShiftRoster } from "./_components/ShiftRoster";
import { DawnBand } from "./_components/DawnBand";

/* =============================================================================
   HOME-3 — "The Night Shift" (cinematic dark)

   The homepage as one night on the warehouse floor. Image-led and quiet — the
   deliberate opposite of home-1's drawing ink and home-2's editorial motion:
   real cinematic photography, mono timestamps as scene markers, and a single
   interactive set piece (the human-view ⇄ machine-view slider). The page lives
   in forced-dark and ends by breaking into daylight (the dawn band).

   Discipline:
   - every spec/price shown is read from catalog.ts, never hand-typed
   - the machine-view rendering is clearly labeled "illustrative"
   - one yellow CTA per viewport; navy text on yellow
   - JS = one client component (the slider); everything else CSS + <Reveal>
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 3 · The Night Shift",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant3() {
  return (
    <>
      {/* Scenes 23:42 → 02:48 play in forced dark */}
      <div className="dark bg-bg text-text">
        {/* 23:42 — full-bleed night photograph, one scan sweep, the promise */}
        <NightHero />

        {/* 01:17 — the set piece: drag between what you see and what it sees */}
        <DualView />

        {/* 02:48 — the crew on shift: four real products, one per stack layer */}
        <ShiftRoster />
      </div>

      {/* 06:00 — the page breaks into daylight: results + trial CTA */}
      <DawnBand />
    </>
  );
}
