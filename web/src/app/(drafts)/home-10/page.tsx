import type { Metadata } from "next";
import { ShowroomDeck } from "./_components/ShowroomDeck";

/* =============================================================================
   HOME-10 — "The Showroom" (horizontal scene deck)

   The homepage as a walk down a product showroom: six full-viewport scenes on
   a horizontal snap track, each art-directed to its subject (dusk lab title
   card, the safety hall, blinding sunlight for the solid-state unit, the
   depth room, the edge rack, a yellow finale). Parallax and copy-rise inside
   each scene are CSS scroll-driven animations on the inline axis — no JS for
   motion; one small client shell handles arrow keys and the progress rail.

   The only horizontal paradigm in the ten-variant shootout.

   Discipline:
   - every figure on the placards is a true catalog.ts spec
   - mobile and no-JS fall back to a normal vertical stack of scenes
   - one yellow CTA per viewport (the finale slide)
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 10 · The Showroom",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant10() {
  return <ShowroomDeck />;
}
