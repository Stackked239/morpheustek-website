import type { Metadata } from "next";
import { BoothSet } from "./_components/BoothSet";
import { TableSkirt } from "./_components/TableSkirt";

/* =============================================================================
   HOME-7 — "The Booth" (trade-show replica)

   The homepage as the Modex/Automate booth itself, recreated from the booth
   photo (context/Modex booth Image…jpg): the dark expo hall around a bright
   yellow set, a hanging banner overhead, the circuit-trace backwall, the live
   demo monitor, the white pegboard wall with demo units mounted on it, the
   "Affordable Safety has arrived" GS1-5 sign, and the OLEI × morpheusTEK
   table skirt as the closing band.

   Intended future use: a show-mode flag could swap this in for / during trade
   shows so the website and the physical booth read identically.

   Discipline:
   - every product, spec, and claim on the boards is read from catalog.ts
   - mt-red appears only as OLEI trace/diamond graphics (its brand role)
   - navy text on yellow everywhere; one yellow CTA per viewport (the set is
     yellow, so CTAs on it go navy)
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 7 · The Booth",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant7() {
  return (
    /* one staged viewport: the whole booth — wall, monitor, pegboard, skirt —
       fits above the fold on desktop (100svh minus topbar+header ≈ 7rem) */
    <div className="lg:grid lg:h-[calc(100svh-7rem)] lg:grid-rows-[minmax(0,1fr)_auto]">
      {/* the set: backwall + demo monitor + pegboard product wall, full bleed */}
      <BoothSet />

      {/* the table skirt: OLEI × morpheusTEK band with the wave traces */}
      <TableSkirt />
    </div>
  );
}
