# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This repository

The MorpheusTEK marketing + product website ("Giving Sight to Robotics"), built by Stackked Tech.

- **It is a standalone git repo** with its own remote (`Stackked-Tech/morpheustek-website`). It lives inside the `StackkedDev` tree but is *not* part of that mega-repo — git treats it as a separate repository (own `.git`). The parent `StackkedDev/CLAUDE.md` rule "never `git add -A`" is about that outer tree; **here, normal git workflow applies** (branch, `git add`, commit, push as usual).
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
```

- **Package manager is pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). Do not use npm or yarn.
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
- **Forms are client-side only — there are no `/api` routes yet.** `LeadForm`, `book-a-meeting`, and `contact` don't post anywhere; Phase 2 wires them to HubSpot. Don't assume a backend exists.
- `app/robots.ts` allows AI crawlers by default (intentional GEO strategy) — confirm with the client before launch.

## Where to go deeper

- `web/README.md` — fuller architecture walkthrough and Phase-1 (done) / Phase-2 (next) status.
- `docs/00_MASTER_PLAN.md` and appendices `01`–`08` — the design, copy, SEO, and phased build plan.
