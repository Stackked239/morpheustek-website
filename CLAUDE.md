# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This repository

The MorpheusTEK marketing + product website ("Giving Sight to Robotics"), built by Stackked Tech.

- **It is a standalone git repo** with its own remote (`Stackked-Tech/morpheustek-website`). It lives inside the `StackkedDev` tree but is *not* part of that mega-repo — git treats it as a separate repository (own `.git`). The parent `StackkedDev/CLAUDE.md` rule "never `git add -A`" is about that outer tree; here, normal `git add`/commit workflow applies.
- ⚠️ **NEVER commit or push directly to `main`** — `main` auto-deploys to the client's live production site via Vercel. All work happens on feature branches; open a PR and let John review and merge. Merging to main = deploying to the client.
- Two top-level directories:
  - **`web/`** — the Next.js 16 application (the actual site). **Vercel project root = `web/`.** Run, build, and edit everything from here.
  - **`docs/`** — the master build plan + specialist appendices (brand/design system, IA/UX, copy, technical architecture, conversion/SEO/GEO, interactive features, critique & phased build plan). Start at `docs/00_MASTER_PLAN.md`.
- Confidential client source (raw transcripts, the ICP questionnaire, internal notes) is gitignored under `/context` and `/claudedocs` — it is intentionally absent. Don't expect it.

## Commands (run from `web/`)

```bash
pnpm install          # first-run; node_modules is NOT checked in (and may not be installed yet)
pnpm dev              # http://localhost:3000  — use `PORT=3100 pnpm dev` if 3000 is taken
pnpm build            # production build — this is ALSO the only typecheck (tsconfig is noEmit)
pnpm start            # serve the production build
pnpm lint             # eslint (next core-web-vitals + typescript)
pnpm scan:gen         # regenerate the home-2 LiDAR point cloud + scene spec (public/scan/)
```

- **Package manager is pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). Do not use npm or yarn.
- `pnpm add` requires `-w` here (single-package workspace root check trips otherwise).
- There is **no separate typecheck script and no test runner** (no vitest/jest/playwright config, no test files). Verify by running `pnpm build`; never claim "tests pass."

## ⚠️ Next.js 16 — this is not the Next.js in your training data

`web/AGENTS.md` (imported by `web/CLAUDE.md`) says it directly: this is **Next.js 16 + React 19**, and APIs/conventions/file structure may differ from what you remember.

- **Before writing any Next.js code, read the relevant guide in `web/node_modules/next/dist/docs/`** (present after `pnpm install`) and heed deprecation notices.
- **Dynamic route params are async.** Signatures are `params: Promise<{ slug: string }>` and must be `await`ed (same for `searchParams`). See `web/src/app/products/[slug]/page.tsx`.
- Pages are **React Server Components by default**. Only files marked `'use client'` run on the client: `Reveal`, `MegaMenu`, `MobileNav`, `ThemeControls`, `LeadForm`, `HeroVideo`.

## Architecture

### Content lives in `src/lib/catalog.ts` — it is the CMS (for now)

`catalog.ts` is the typed single source of truth: `products`, `categories`, `applications`, `leadMagnets`, plus selector helpers (`getProduct`, `productsInCategory`, `featuredProduct`, `productImage`, …). Everything derives from it:

- The 18 product pages, category pillars, and application pages are **SSG** — built via `generateStaticParams` reading `catalog.ts` (`products/[slug]`, `applications/[slug]`, `resources/[slug]`).
- `app/sitemap.ts` and the mega menu read it directly, so they stay in sync automatically.
- **To add a product:** append a `Product` object, add a `slug → path` entry to the `productImages` map, and drop the image in `public/products/`. (Today: 18 products, 17 images — a product with no mapped image renders an on-page "Illustrative" placeholder via `ProductMedia`/`productImage()`.)
- `src/lib/site.ts` holds company facts, nav, and CTAs — the source of truth for header/footer/metadata.
- **Phase 2 replaces `catalog.ts` 1:1 with Supabase tables of the same shape** — keep the exported types/shapes stable.

### Design system — `src/app/globals.css` (Tailwind v4, CSS-first)

- **Author against semantic tokens, never raw hex:** `bg-bg`, `text-text`, `text-text-muted`, `bg-accent`, `text-brand-blue`, `border-border`. They resolve per theme. Tokens are CSS vars defined per theme, then mapped to utilities inside `@theme inline`.
- **Three themes via a class on `<html>`:** light (default), `.dark`, `.sensor-view` (the signature LiDAR look). Force a dark band on a light page by wrapping a section in the `dark` class (`Section tone="invert"`).
- Raw brand hues (`mt-yellow`, `mt-blue`, `mt-navy`, `mt-red`) and the point-cloud depth ramp (`pc-near`…`pc-far`) are **graphics/data only** — rarely used in layout.
- **Brand rules baked into the system — keep them:** navy text on yellow (never white); the SIL2 / Type 3 / PL d safety badge is **data-driven** and renders only for products with a `certifications` field (today only the GS1-5, so it can't leak onto another SKU); **one yellow CTA per viewport.**
- Fonts: **Roboto Condensed** (display + body) and **Roboto Mono** (specs) loaded via `next/font` in `layout.tsx`, exposed as `--font-condensed` / `--font-mono-rc`.

### No-flash theming + progressive enhancement

- `public/theme-init.js` is a parser-blocking script wired in `layout.tsx` (`<script src="/theme-init.js">`). It resolves the `.dark`/`.sensor-view` class from `localStorage('mt-theme')` or OS preference **before first paint**, and adds the `js` class to `<html>`.
- **`src/lib/theme-script.ts` is a duplicate of that script that is currently unused** — change behavior in `public/theme-init.js` (keep them in sync, or delete the dead copy).
- JS-only effects (scroll `<Reveal>`, sensor overlay) are gated behind `html.js`, so no-JS visitors and crawlers always get the full content. `<html>` carries `suppressHydrationWarning` because the theme class is applied client-side before hydration.
- `prefers-reduced-motion` disables all animation/reveal in `globals.css`. Honor it.

### Routing notes

- The **8 category pillar pages are top-level routes** whose folder name equals the `CategorySlug` (e.g. `/safety-lidar`, `/3d-cameras-for-robotics`) — SEO keyword pillars, *not* nested under `/products`.
- **Lead forms post to `/api/lead`**, which logs every submission to the Supabase `submissions` table (durable log) and then submits to HubSpot via the Forms Submission API — per-intent form GUIDs live in `src/lib/hubspot.ts`, token in `HUBSPOT_ACCESS_TOKEN` (set in `web/.env.local` and Vercel). A HubSpot failure never fails the visitor's request.
- `app/robots.ts` allows AI crawlers by default (intentional GEO strategy) — confirm with the client before launch.
- `app/(drafts)/` holds the homepage-variant shootout (`/home-1`…`/home-10`, hub at `/home-drafts`) — noindex, never linked from nav. Austin (austin@stackked.tech) builds variants 3–10; home-1/home-2 are John's. Hero experiments go behind a top-of-file boolean flag + a draft PR, never straight to main.

### home-2 LiDAR scan hero (drafts)

- `web/scripts/generate-scan.mjs` raycasts a warehouse scene → `public/scan/warehouse-aisle.bin` (8 B/point: int16 xyz ÷512, uint8 intensity, uint8 flag) + `.scene.json` (same geometry, kind-tagged, for the realistic-render twin). Regenerate with `pnpm scan:gen` after scene edits.
- `ScanViewer.tsx` dev-only tuning hooks: `host.dataset.cam` readout and `host.__scanView(yaw, pitch)` (suspends idle-return). Scout camera angles with these — never infer camera pose from screenshots; the idle sway/ease-home moves the camera between tool calls.
- Realism rules learned the hard way: tiny near-constant point size (fat distance-scaled blobs read as fake), hue by elevation × brightness by intensity, imperfection is the realism (speckle, dropouts, occlusion shadows).

### Hard-won gotchas

- **Synthetic pointer events bypass hit-testing.** `dispatchEvent(new PointerEvent(...))` on a canvas proves nothing about real mice — verify pointer paths with `document.elementFromPoint`. (A full-width z-10 hero Container silently ate all panel drags below ~1900px for a whole session.)
- **Changing a `public/` image in place serves stale pixels** — next/image and browsers cache by URL. Rename the file (`-v2`) when pixels change.
- **`catalog.ts` edits can vanish behind `unstable_cache`** — `.next/cache/fetch-cache` persists across builds, so a rebuilt page can prerender with the *previous* product list (page 404s while its `.html` exists, sitemap misses new slugs). `rm -rf .next` before the build when catalog/CMS data changes. In production the equivalent is the CMS tag cache: after DB changes, save any record in /admin to `revalidateTag`.
- **Official spec-sheet PDFs live in `web/public/spec-sheets/<slug>.pdf`** and are referenced by `specSheetPath`; series pages add per-variant sheets via `specSheets[]` (the product page then shows a model picker inside the gate, or a menu when `specSheetDirect`). The live site reads product JSON from Supabase, so after changing sheets in `catalog.ts` run `pnpm cms:sync-spec-sheets` — it repoints the rows and deletes the superseded Storage PDFs. The variant list is not editable in /admin; the single upload there only replaces `specSheetPath`.
- **Adding a product needs a Supabase row in prod, not just `catalog.ts`** — the live site reads the DB (`getProducts`); seed data is only the fallback. Use `pnpm cms:seed-product <slug>` (targeted upsert; full `cms:seed` clobbers admin edits).
- The brand eye PNGs are `morpheustek-eye-v2.png` / `morpheustek-eye-white-v2.png` (left tip reconstructed; originals were cropped at the canvas edge). Always render them via `EyeMark`; its aspect constant (0.66) matches the repaired art.
- The chrome-devtools MCP browser window is on John's desktop — he interacts with it live during sessions. Unexplained pointer events / moved cameras are usually him, not a bug.

## Where to go deeper

- `web/README.md` — fuller architecture walkthrough and Phase-1 (done) / Phase-2 (next) status.
- `docs/00_MASTER_PLAN.md` and appendices `01`–`08` — the design, copy, SEO, and phased build plan.
