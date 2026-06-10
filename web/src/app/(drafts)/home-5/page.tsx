import type { Metadata } from "next";
import { AuroraHero } from "./_components/AuroraHero";
import { ControlBento } from "./_components/ControlBento";
import { SignalBeam } from "./_components/SignalBeam";
import { WordFillManifesto } from "./_components/WordFillManifesto";
import { CategoryMarquee } from "./_components/CategoryMarquee";
import { GlassCta } from "./_components/GlassCta";

/* =============================================================================
   HOME-5 — "The Control Room" (aurora glass / product-OS)

   The 2026 SaaS-grade register, adapted from the current 21st.dev canon:
   aurora shader wash + infinite perspective grid (pure CSS), glass surfaces
   (color-mix + backdrop-filter), a cursor-spotlight bento grid with an
   orbiting border beam (@property conic), an animated signal-chain diagram
   (offset-path pulses), a scroll-driven word-fill manifesto, and count-up
   stat tickers. MorpheusTEK presented as the operating layer for robot
   perception.

   Discipline:
   - every spec/price/stat is read from catalog.ts / site.ts
   - scroll effects are CSS scroll-driven animations behind @supports;
     no-JS / no-support / reduced-motion all get a complete static page
   - one yellow CTA per viewport; navy text on yellow
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 5 · The Control Room",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant5() {
  return (
    <div className="dark bg-bg text-text">
      {/* aurora + grid-floor hero with count-up readout strip */}
      <AuroraHero />

      {/* the stack as a control surface: spotlight bento, border beam on safety */}
      <ControlBento />

      {/* sensors → edge → your stack, with pulses riding the wires */}
      <SignalBeam />

      {/* the differentiator inks itself in as you scroll */}
      <WordFillManifesto />

      {/* eight disciplines on one strip */}
      <CategoryMarquee />

      {/* glass closing panel over the aurora */}
      <GlassCta />
    </div>
  );
}
