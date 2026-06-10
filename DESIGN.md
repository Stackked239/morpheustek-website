# DESIGN.md — MorpheusTEK design system

Implementation lives in `web/src/app/globals.css` (Tailwind v4, CSS-first). Author against
semantic tokens, never raw hex. This file summarizes; globals.css is canonical.

## Tokens
- Semantic: `bg-bg`, `bg-bg-subtle`, `bg-surface`, `text-text`, `text-text-strong`,
  `text-text-muted`, `bg-accent` (+`text-accent-text`), `text-brand-blue`, `border-border`,
  `border-border-strong`. Resolve per theme.
- Raw brand hues (graphics only): `mt-yellow #FFCC00`, `mt-blue #007BBB`, `mt-navy #0F326C`,
  `mt-cyan #31B4E7`, `mt-red #E2231A` (OLEI accents/danger only), `mt-orange #F05A28`.
- Point-cloud depth ramp `pc-near…pc-far` — data/graphics only.

## Themes
Three, via class on `<html>`: light (default), `.dark`, `.sensor-view` (signature LiDAR look).
Force-dark a band with the `dark` class on a wrapper (`Section tone="invert"`).

## Typography
- Display + body: Roboto Condensed (`--font-display`/`--font-body`); specs/annotations Roboto
  Mono (`--font-mono`). Loaded via next/font in `layout.tsx`.
- Scale: eyebrow 12 / lead 20 / h5 18 / h4 22 / h3 30 / h2 40 / h1 56 / display 88 /
  display-xl clamp(3rem→7.5rem). Drama = scale contrast: huge condensed display against 11px
  mono annotation.

## Hard rules
- Navy text on yellow, never white.
- One yellow CTA per viewport.
- mt-red never used for layout; OLEI graphics and danger states only.
- Every spec/price/annotation rendered must be a true `catalog.ts` / `site.ts` fact.
- `prefers-reduced-motion` disables all motion (enforced globally); JS effects gated behind
  `html.js` so no-JS/crawlers get full content.

## Motifs & craft kits (globals.css)
- `circuit-motif`, `pointcloud-texture`, `blade-divider`, `corner-crop`, `angle-panel` (60°).
- home-1 engineering kit: `dim-line`, `reg-mark`, `draft-grid`, `[data-draw]` rule draw-ins.
- Poster kit: `.ticker` marquee, `.poster-hollow`, `.halftone`.
- Modern kit: `.aurora-blob`, `.grid-floor`, `.border-beam` (@property), `.glass` (color-mix),
  `.spot-cell`, scroll-driven `.wordfill` / `.stack-card` / `.ledger-bar` / `.reel-progress`.
- Booth kit: `.pegboard`, `.monitor-scan`.

## Cascade discipline
Base element styles and the universal border rule live in `@layer base` so utilities can
override them. Do not add unlayered element selectors to globals.css.
