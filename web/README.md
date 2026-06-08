# MorpheusTEK Website

The MorpheusTEK marketing + product site — *Giving Sight to Robotics*.
Built by Stackked Tech. Custom, modern, fast (targeting 99+ Lighthouse), and owned by MorpheusTEK.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config) with a three-theme token system
- **lucide-react** icons, self-hosted **Saira / IBM Plex Sans / IBM Plex Mono** via `next/font`
- Deploy target: **Vercel** (preview → promote-to-production)

## Run it

```bash
cd web
pnpm install      # first time
pnpm dev          # http://localhost:3000  (use PORT=3100 pnpm dev if 3000 is taken)
pnpm build        # production build (also typechecks)
pnpm start        # serve the production build
```

## How it's organized

```
src/
  app/                      # routes (one folder = one URL)
    layout.tsx              # fonts, metadata, theme init, Header + Footer shell
    page.tsx                # homepage (StoryBrand scroll)
    globals.css             # design tokens + 3 themes + utilities (the heart of the design system)
    products/               # /products + /products/[slug] (18 SSG product pages)
    <category>/             # 8 keyword-pillar category pages (safety-lidar, 3d-cameras-for-robotics, ...)
    applications/           # hub + [slug] + spotlight
    compare/                # sick-alternative-lidar (full), hokuyo-alternative-lidar (stub)
    resources/              # gated lead-magnet library + [slug] + glossary
    about, full-stack-perception, book-a-meeting, shows/, contact, ...
    robots.ts, sitemap.ts   # auto-generated /robots.txt and /sitemap.xml
  components/
    brand/                  # EyeMark, Logo, ProductGlyph (placeholder sensor visual)
    ui/                     # Button, Badge, Container, Section, Eyebrow, Reveal
    layout/                 # Header, MegaMenu, MobileNav, Footer, ThemeControls
    product/                # ProductCard, SpecTable
    marketing/              # PageHero, CategoryView, CtaBand, PlaceholderPage
    forms/                  # LeadForm (gated form — Phase-2 wires to HubSpot)
  lib/
    site.ts                 # company facts, nav, CTAs
    catalog.ts              # products / categories / applications / lead magnets (the seed data)
    cn.ts                   # className joiner
public/
  theme-init.js             # no-flash theme + `js` class, runs before paint
```

## The design system (globals.css)

- **Author against semantic tokens, never raw hex**: `bg-bg`, `text-text`, `text-text-muted`,
  `bg-accent`, `text-brand-blue`, `border-border`, etc. They resolve per theme automatically.
- **Three themes**, toggled by a class on `<html>`: light (default), `.dark`, `.sensor-view`.
  A forced-dark band on a light page = wrap a section in the `dark` class (see `Section tone="invert"`).
- **Raw brand hues** (rare): `mt-yellow`, `mt-blue`, `mt-navy`, `mt-red`. **Point-cloud ramp**: `pc-near…pc-far`.
- **Rules baked in**: navy text on yellow (never white); the SIL2 badge is data-driven and only renders
  for the GS1-5 (`certifications` field); one yellow CTA per viewport.
- **Scroll reveal** (`<Reveal>`) is gated behind `html.js`, so no-JS users and crawlers always see content.

## Editing content (no developer required)

Today the catalog lives in `src/lib/catalog.ts` (typed seed data). Add a product by appending an object;
add a category, application, or lead magnet the same way. Pages, sitemap, and the mega menu update
automatically. **Phase 2** replaces this file 1:1 with Supabase tables of the same shape, plus an admin UI.

## What's wired vs. what's next (Phase 2)

Built and working now: full design system + 3 themes, header/mega-menu/footer, homepage (StoryBrand),
all 18 product pages, 8 category pillars, applications, the SICK comparison, the gated resource library,
about/manufacturing-strength, book-a-meeting/contact/booth forms (client-side), shows, recurring-section
pages, `robots.txt` + `sitemap.xml`, custom 404.

Phase-2 TODOs (placeholders are clearly marked in code):
- `components/forms/LeadForm.tsx` → POST to `/api/lead` → **HubSpot** (contact + company + deal + nurture)
- Move `lib/catalog.ts` → **Supabase** (products/categories/applications/resources/blog/shows) + gated
  spec-sheet storage (signed URLs)
- Replace AI/placeholder visuals (`ProductGlyph`, hero) with **real product photography + AI hero video**
- **JSON-LD** schema (Organization, Product, FAQ, Breadcrumb), `llms.txt`, GA4 + transparency dashboard
- Signature features fast-follow: before/after point-cloud slider, build-on-scroll, live SLAM/point-cloud

See `../docs/00_MASTER_PLAN.md` for the full plan and `../docs/07_critique_and_build_plan.md` for the phases.
