# Home-1 — "The Acceptance Test" (Precision Industrial)

> Supersedes `09_home1_first_light_spec.md` (deleted). The First Light build
> (scanner takeover → sticky OGL point cloud → hacker-HUD chrome) was fully
> rejected on 2026-06-09 — concept, styling, layout, and the point cloud.
> This spec was synthesized from three parallel design passes (narrative,
> art direction, skeptic) and approved by John the same day.

## The concept

**The homepage IS an engineering document** — part datasheet, part acceptance-test
report. Scrolling it is reading it. Numbered clauses (§00–§06), a drawing-sheet
hero with title block, specs with real tolerances, the GS1-5-vs-SICK gap rendered
as a dimensioned price axis, and the 90-day trial staged as a formal
acceptance-test procedure ending on a signature line.

**Page thesis:** by the bottom, a skeptical robotics engineer feels *"every claim
was numbered, certified, and priced — they behave like a supplier, not a
marketer — and they just handed me a zero-risk procedure to verify the last
variable (performance on MY robot) myself."* The trial request is the obvious
next step of a test plan the page already started.

**Personality:** Calibrated · Assured · Machined.
**Benchmark test:** any section screenshot must sit comfortably next to a Linear
page, a Vercel page, and page 1 of a Keyence datasheet — and be identifiable as
MorpheusTEK in <1s (navy ink, one yellow strike, mono tolerances).

## Locked decisions (John, 2026-06-09)

1. **Clean slate** — `web/src/components/home1/*` deleted; `ogl` dep removed
   (gsap stays — home-2 uses it). No point cloud.
2. **Full document conceit** — keep ALL furniture: `DOC MT-HP-01 · REV A` header,
   sheet frame, clause numbers, signature line under the final CTA,
   `END OF DOCUMENT` footer.
3. **One dark band** — §02 The Economics only. Everything else white paper
   (`bg-bg` ⇄ `bg-bg-subtle`). `.sensor-view` is never used on this page.
4. **Typography** — Roboto Condensed 700 at display-xl scale
   (`clamp(3rem, 9vw, 7.5rem)` uppercase). `--font-display-industrial` token
   exists so Archivo (variable, wdth, 500–900, display-only) is a one-line swap
   **if Phil/Tom sign off** (pending).
5. **SICK pricing** — relative multiples by default (1× / ~2.5× / up to ~20×,
   "vs comparable SICK safety scanners"). Absolute dollars only after Phil/Tom
   sign-off (pending).

## Governing discipline rules (enforce at every slice review)

- **The instrumentation test:** every mono annotation states a true, checkable
  fact sourced from `lib/catalog.ts` (or the OLEI datasheet). Fake dimension
  lines, decorative crosshairs, lorem-technical = the rejected HUD costume in
  navy. Delete on sight. Second check: would a SICK application engineer nod
  or smirk?
- **Annotation budget:** ≤3 mono annotations per section; leader-line callouts
  exactly once on the page (hero); dimension lines ≤3 total.
- **3-tier rule system:** 1px `border-border` (structure) · 1px `--line-ink`
  (schematic linework/section heads) · the single 4px yellow strike.
  No other line weights.
- **Yellow budget:** one yellow element per viewport — the primary CTA, or (in
  the spec strip) the 4px `bg-accent` strike under `$1,950`. Navy text on
  yellow always. Red appears nowhere on this page.
- **Nothing loops** — no pulses, sweeps, scanlines, blinking dots. Draw-in once
  on entry, then static. No GSAP (home-2's identity), no pinning, no parallax:
  IntersectionObserver + CSS only.
- **Focal-element rule:** every full-viewport scroll position has exactly ONE
  dominant element. Verify via squint test (50% zoom) + grayscale screenshot.
- **Token-only:** no raw hex in components.

## Page blueprint

| § | Section | Layout | Focal element | Content source |
|---|---------|--------|---------------|----------------|
| 00 | **Hero "Title Block"** — 1px sheet frame inset ~24px, mono doc-control row top (`MORPHEUSTEK · DOC MT-HP-01 · REV A · 2026-06`), title-block strip bottom (`SHEET 1/1 · EXCLUSIVE NA DISTRIBUTOR — OLEI`) | 3:2 split, min-h 88vh | GS1-5 photo with ≤3 SVG leader-line callouts (`270° APERTURE`, `SIL2 · PL d`, `$1,950 · IN STOCK`) | `site.heroHeadlineVariants`, `oneLiner`, `primaryCta`, GS1-5 `keySpecs`, `site.distributor` |
| 00b | **Document-control strip** — hairline-ruled mono row, 3 equal cols, NO boxes | ~56px | typography only | `site.pillars` compressed |
| 01 | **The Instrument** — THE SPECTACLE | 2:1 (plot : specs) | to-scale 270° polar protective-field plot (SVG): 5 m solid, 20–30 m dashed; certs as hairline-divided mono list (not pills) | GS1-5 `specs`, `certifications` |
| 02 | **The Economics** — THE DARK BAND (`.dark` wrap, hard 1px rule entry/exit, frame verticals continue) | full-width axis + 3-row diff | dimensioned price number line: GS1-5 tick (yellow) at 1× vs SICK hatched band ~2.5×–20×; certification-equivalence rule spans both first | GS1-5 `compare` rows; concession line "SICK builds excellent scanners. The question is the premium."; checklist lead magnet |
| 03 | **The Line Card** — densest section, sandwiched between airy ones | full-width ruled table, zero cards | the price column (prices listed = the message) | `products`+`categories`+`formatPrice`+`availabilityLabel`, ~10–12 curated rows, "Browse all 18 →" |
| 04 | **The Signal Chain** — horizontal block diagram, mono port labels (Ethernet, OSSD, GMSL-2, ROS1/2), terminates at "YOUR STACK" | full-width diagram over 2:1 | the wiring diagram — interface labels from real `specs` | `site.differentiator`; LR-1F, GS1-5, S10, iBOX-602P |
| 05 | **Reference Configurations** — numbered TOC index + detail panel; no-JS = stacked panels | 1:2 split | active config panel with model chips | `applications[].pain/fit/sensors` (amr, agv, autonomous-forklift, warehouse-logistics) |
| 06 | **The Acceptance Test** — clauses 1.0 SCOPE / 2.0 DURATION / 3.0 PROCEDURE / 4.0 PASS-FAIL, signature line, yellow CTA at the sign-off position | single centered col, max-w-3xl, airiest | signature line + "Start the 90-day acceptance test" | production `plan` copy, `primaryCta` |
| — | Footer rule: `END OF DOCUMENT · MT-HP-01 REV A` (mono) above global footer | | | |

**Mobile reflow:** hero frame → top/bottom rules only, leader lines → stacked
spec rows; §02 axis rotates vertical (exaggerates the gap); §03 drops to 3 cols
(MODEL · KEY SPEC · PRICE); §04 chain rotates vertical; §05 stacks.

## The one spectacle (§01)

On first viewport entry: a thin radial sweep rotates 0°→270° while the
protective/warning field boundaries draw in behind it (SVG `stroke-dasharray` +
`pathLength={1}` — no `getTotalLength()`; rotating clip; ~2.5 s, `--ease-rule`).
Three mono readouts tick up and settle (`ANGLE 270.0°`, `PROTECTIVE 5.0 m`,
`RESOLUTION 20 mm`). It reads as instrumentation because it IS the product's
certified field, to scale, with axes and units — animated the way a test
instrument behaves. No-JS / reduced-motion / crawlers get the fully-drawn plot
(server-rendered default; undrawn state applied only under `html.js`).

**Supporting motion (not spectacles):** hairline rules draw in on scroll
(`[data-draw]`, scaleX 0→1, origin left — "the page drafts itself"); spec
figures count up once (~20-line rAF leaf, SSR renders final value); §02 axis
bars grow to scale. Timing: tap 120 ms / enter 320 ms / draw 700 ms /
count 900 ms. Easings: `--ease-soft` entrances, `--ease-rule` draws. No bounce.

## Craft kit (in globals.css + home-1/_components/)

- Tokens: `--line-ink`, `--grid-minor/major` (all three themes),
  `--text-display-xl`, `--text-figure`, `--text-anno`, `--text-anno-sm`,
  `--font-display-industrial`, `--ease-rule`.
- Utilities: `.dim-line` (dimension line with end ticks), `.reg-mark`
  (9×9 crosshair — only at true rule intersections), `.draft-grid` (blueprint
  paper — hero/footer/product-plate only, never behind body copy),
  `.js [data-draw]` rule draw-in.
- Components: `Annotation.tsx` (leader-line overlay md+ / stacked mono list on
  mobile), draw-in variant of `Reveal`, count-up leaf. Page armature: two
  full-height frame verticals at container edges; section rules cross them
  (intersections get reg-marks).
- **Component DNA:** section header = reg-mark + mono index + `.eyebrow` +
  uppercase display heading; spec display = `<dl>` figure + mono unit +
  `.dim-line` label (no boxes/cards); comparison emphasis via structure (double
  vertical rules + tone), not yellow flooding; `Button` with `rounded-sm`.
- **Banned:** noise/grain images, gradient meshes, glassmorphism, glows,
  `ProductCard`, `CtaBand`, full-bleed photos behind text.

## Build slices (~9 working days; freeze June 19, Automate June 22)

| Slice | Scope | Status |
|-------|-------|--------|
| 0 | Teardown (home1/* deleted, ogl removed), scaffold route, tokens/utilities, this spec | ✅ 2026-06-09 |
| 1 | Hero §00 + 00b — static-first, sheet frame, annotated GS1-5 photo | |
| 2 | §01 Instrument (static drawn plot first) + §03 Line Card | |
| 3 | §02 Economics dark band (relative multiples) — ∥ with 4 | |
| 4 | §04 Signal Chain + §05 Configs + §06 Acceptance Test — **shippable floor** | |
| 5 | Motion pass (the only `'use client'` slice) — **cut-line, not dependency** | |
| 6 | Hardening: Lighthouse 99+, a11y, contrast, keyboard, 390/768/1280 | |

Verify every slice: `node_modules/.bin/next build` green; eyeball desktop +
390 px; JS-disabled check; grayscale + squint test. Slice 5+: reduced-motion
emulation, CLS overlay.

## Failure-mode watchlist

1. Restraint → emptiness (squint test; dense→air→dense rhythm)
2. Hairline gray mush (grayscale screenshot must show hierarchy)
3. Parts catalog, not brand (H2 read-through must form an argument)
4. **Schematic slop — the #1 risk** (instrumentation test on every annotation)
5. Timid type (hero must be the loudest thing vs linear.app side-by-side)
6. Yellow leakage (per-viewport yellow count = 1)
7. CLS / no-JS breakage (`html.js` gating + SSR-final-state; aspect-ratio boxes)

## Pending sign-offs (Phil/Tom)

- [ ] Archivo display font (display-only; one-line token swap)
- [ ] Absolute SICK dollars on the §02 price axis (relative multiples until then)
