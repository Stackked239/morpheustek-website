# Spec — "The Seam" homepage: close the 06-12 review gaps (batch 1)

**Date:** 2026-06-19
**Branch:** `feat/home-seam-review-gaps`
**Source of truth:** `_review/change-request-register.md` (the 06-12 client review cross-referenced against the live homepage).

## Scope
Three live-homepage gaps from the 06-12 review, each shipped as its own small commit, then a PR for John to review/merge (merging to `main` deploys to the client's live site, so this never goes direct to `main`).

In scope: **R20b**, **R05**, **R10**.
Out of scope (explicit client/Austin decisions): **R08 deferred** (most prominent live element + blocked on a client-supplied dome-LiDAR point cloud); R09 / R11 / R12 / R20 (separate decisions); all asset-pending items.

## Fix 1 — R20b · RangeLedger redesign
**Problem:** the "Centimeters to a football field" section uses rainbow depth-gradient bars (`pc-near…pc-far`); client: *"the colored lines don't do anything to me… better define what we're talking about."*
**Approved direction:** mono bars + a to-scale field reference.
- Remove the per-row `gradient` field and the `bg-gradient-to-r ${r.gradient}`; render bars in a single ink (**brand-blue**, not accent/yellow — preserves the one-yellow-CTA rule) on the existing muted track.
- Add a to-scale reference strip beneath the log axis: labeled zones **pallet (~0.3 m) → aisle → football field (100 m)**, positioned with the same `x()` log scale so the 100 m bar visibly reaches "a football field." Show the claim, don't just label it.
- Preserve: the `.ledger-bar` scroll-draw (that's R01 — keep), all links/aria, server-component status, reduced-motion/no-JS legibility.

## Fix 2 — R05 · remove white "catalog" backgrounds
**Problem:** client (Tom): *"I don't love the white background… looks like a catalog."* The branded plate fix only landed in `CategoryBrowse`'s `ProductPlate`; the shared `ProductMedia.tsx:26` (`bg-white`) and the mega-menu "Product of the month" card (`MegaMenu.tsx:65`, `bg-white`) are still white.
**Approach:** single branded plate, reused everywhere.
- Update `ProductMedia` to render the branded backdrop (`bg-bg-subtle` + radial accent wash + `.pointcloud-texture` + `.reg-mark`) instead of `bg-white`; keep the `ProductGlyph` no-photo fallback; fix the stale "clean light backdrop" docstring.
- Point `MegaMenu.tsx:65` at the same treatment, and refactor `CategoryBrowse`'s `ProductPlate` to reuse it (one source of truth / DRY).
- Flows to `/products`, `/products/[slug]`, `/applications/[slug]`, the 8 category pillars, and the homepage mega-menu. Verify in light, `.dark`, `.sensor-view`.

## Fix 3 — R10 · hero re-entry replay completeness
**Problem:** client wanted *"the eyeball, and then you have the scan. Boom."* to re-fire on scroll-back. Today only the divider seam re-sweeps; the eye doesn't re-open (`scanReady` set once — `HeroSeam.tsx:213-215, 228`), the acquisition sweep doesn't re-run (`uSweep` pinned — `SeamViewer.tsx:370, 534-538`), and replay is disabled on touch (`HeroSeam.tsx:155`).
**Approach:**
- In `replayIntro()` + the re-entry observer, reset eye state (re-open + crossfade `EyeMark`) and reset the sweep (`uSweep`/sweepStart) so the ring-by-ring acquisition re-runs.
- Enable replay on touch/mobile (relax the non-touch guard), lighter if needed for perf.
- Stay JS-/motion-gated; reduced-motion stays static. Riskiest item (WebGL/GSAP timing on the most prominent live element) — verify in-browser.

## Verification
- `pnpm build` after each fix (the only typecheck; tsconfig is noEmit). Never claim "tests pass" — there is no test runner.
- `pnpm dev` visual check: R20b (range section), R05 (a product page + the mega-menu card), R10 (hero scroll-away/return), across the three themes where relevant.

## Commit plan
1. spec + `.gitignore` (`_review/` ignore)
2. R20b — RangeLedger mono + to-scale field
3. R05 — branded ProductMedia + mega-menu + CategoryBrowse reuse
4. R10 — hero re-entry replay (eye + sweep + touch)
