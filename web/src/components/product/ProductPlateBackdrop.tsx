/**
 * ProductPlateBackdrop — the branded, NOT-white surface behind a product image.
 *
 * A faint accent radial wash + a schematic point-cloud dot motif + a corner
 * registration tick, so a product photo reads as "an instrument on a drafting
 * table" rather than a white catalog cell. This is the single source of truth for
 * that treatment, shared by ProductMedia, CategoryBrowse's card, and the header
 * mega-menu — the client rejected the white background on the 06-12 review (R05).
 *
 * Purely decorative (aria-hidden, pointer-events-none). Render it as the first
 * child of a `relative overflow-hidden` container, before the <Image>. The dot
 * motif is theme-gated via --pc-texture-opacity (0 in light, faint in dark /
 * sensor-view); the accent wash carries the non-white read in every theme.
 */
export function ProductPlateBackdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_60%)]"
      />
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <span className="reg-mark left-3 top-3" aria-hidden />
    </>
  );
}
