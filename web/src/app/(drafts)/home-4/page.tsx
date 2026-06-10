import type { Metadata } from "next";
import { PosterHero } from "./_components/PosterHero";
import { PriceTicker } from "./_components/PriceTicker";
import { TheList } from "./_components/TheList";
import { Manifesto } from "./_components/Manifesto";
import { MegaCta } from "./_components/MegaCta";

/* =============================================================================
   HOME-4 — "The Price List" (poster broadsheet)

   The homepage as an industrial trade poster: yellow field, enormous condensed
   caps, hard 2px navy rules, and the catalog hung on the wall with the prices
   in your face. The loud opposite of all three siblings — home-1's fine ink,
   home-2's choreography, home-3's cinema. The argument IS the price list.

   Discipline:
   - zero client JS: server components + the CSS ticker only
   - flat ink: no shadows, no radii, no gradients anywhere on this page
   - every price/spec is read from catalog.ts, never hand-typed
   - navy text on yellow (never white); one yellow CTA per viewport
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 4 · The Price List",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant4() {
  return (
    <>
      {/* the headline poster: ROBOTS ARE BLIND / WE FIX THAT */}
      <PosterHero />

      {/* rolling price strip — the whole catalog walks past */}
      <PriceTicker />

      {/* the line card as a poster wall: hover a row, it inverts */}
      <TheList />

      {/* the three pillars as numbered proclamations */}
      <Manifesto />

      {/* full-bleed closing block: 90 days, free, signed in yellow */}
      <MegaCta />
    </>
  );
}
