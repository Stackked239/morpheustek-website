import type { Metadata } from "next";
import { HeroTitleBlock } from "./_components/HeroTitleBlock";
import { DocControlStrip } from "./_components/DocControlStrip";
import { TheInstrument } from "./_components/TheInstrument";
import { TheEconomics } from "./_components/TheEconomics";
import { LineCard } from "./_components/LineCard";
import { SignalChain } from "./_components/SignalChain";
import { ReferenceConfigs } from "./_components/ReferenceConfigs";
import { AcceptanceTest } from "./_components/AcceptanceTest";

/* =============================================================================
   HOME-1 — "The Acceptance Test" (precision industrial)

   The homepage IS an engineering document: part datasheet, part acceptance-test
   report. Numbered clauses §00–§06, a drawing-sheet hero with title block, the
   GS1-5-vs-SICK gap as a dimensioned price axis, and the 90-day trial staged as
   a formal acceptance-test procedure ending on a signature line.

   Spec: docs/10_home1_acceptance_test_spec.md
   Discipline rules (enforced at every review):
   - instrumentation test: every mono annotation = a true catalog.ts fact
   - one yellow element per viewport; navy text on yellow; red appears nowhere
   - one dark band only (§02 The Economics); never .sensor-view
   - nothing loops; IntersectionObserver + CSS only (no GSAP — that's home-2's)
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 1 · The Acceptance Test",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant1() {
  return (
    <>
      {/* §00 — Hero "Title Block": sheet frame, doc-control row, annotated GS1-5 */}
      <HeroTitleBlock />

      {/* §00b — Document-control strip (pillars as a ruled mono row) */}
      <DocControlStrip />
      {/* §01 — The Instrument: to-scale 270° protective-field plot (the spectacle) */}
      <TheInstrument />

      {/* §02 — The Economics: dark band, dimensioned price axis vs SICK */}
      <TheEconomics />

      {/* §03 — The Line Card: full-width ruled table, prices listed */}
      <LineCard />

      {/* §04 — The Signal Chain: block diagram ending at YOUR STACK */}
      <SignalChain />

      {/* §05 — Reference Configurations: numbered index + detail panel */}
      <ReferenceConfigs />

      {/* §06 — The Acceptance Test: numbered clauses + signature line + final CTA */}
      <AcceptanceTest />
    </>
  );
}
