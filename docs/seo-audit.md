# SEO Audit Report — Production Launch Pass

**Generated:** 2026-07-13
**Framework:** Next.js 16 (App Router) + React 19
**Pages analyzed:** 49 routable pages (34 public with per-page metadata; drafts + admin excluded)
**Scope:** Pre-launch cutover audit — technical SEO, analytics continuity, structured data. The old
WordPress site at morpheustek.com is replaced by this app tonight; this pass ensures nothing is lost
in the switch.

## Phase 1: Project Overview

- **Rendering:** SSG for all product/category/application/resource pages (`generateStaticParams`),
  static for pillars/marketing pages. No SEO-critical CSR pages.
- **Old site (scraped 2026-07-13):** WordPress + WooCommerce + HubSpot plugin + Google Site Kit.
  Tracking found: Google tag `GT-NFJ9PT8` (Site Kit → GA4), HubSpot portal `22485651`.
  Old robots.txt: allow-all, **no sitemap.xml** (404). No google-site-verification meta (Site Kit
  verifies via the connected Google account).

| Asset | Status before | Status after |
|---|---|---|
| robots.ts | ✅ Present (allow all, disallow /admin, sitemap + host) | unchanged |
| sitemap.ts | ✅ Present — 59 URLs from CMS/catalog | unchanged |
| metadataBase / canonicals | ✅ Set; 47/49 pages define `alternates` | unchanged |
| OG + Twitter cards | ✅ Root layout + per-page | unchanged |
| GA4 / Google tag | ❌ Missing (Phase-2 TODO) | ✅ `GT-NFJ9PT8` carried over |
| HubSpot tracking | ✅ Portal 22485651 (matches old site) | unchanged |
| Leadsy.ai pixel | ✅ pid FXPn93H0lUabmQS3 | unchanged |
| Legacy URL redirects | ❌ None — every old WP URL would 404 | ✅ 32 permanent redirects |
| JSON-LD structured data | ❌ None (Phase-2 TODO) | ✅ Organization, WebSite, Product, BreadcrumbList |
| Drafts / spec-sheet templates | ✅ `robots: { index: false }` | unchanged |

## Phase 2: Technical SEO — Fixes Applied

**`web/next.config.ts` — 32 permanent (308) redirects** covering every URL discoverable on the old
site (homepage nav + all five WooCommerce category pages scraped for `/product/` links):

- Pages: `/about-us→/about`, `/mtek-blog(/:path*)→/blog`, `/downloads→/resources`,
  `/privacy-policy→/privacy`, `/terms-and-conditions→/terms`, `/wpautoterms/:path*→/terms`,
  `/refund_returns→/terms`, `/my-account→/contact`
- Categories: `/products/2d-lidar→/lidar-for-robotics`, `/products/3d-lidar→/3d-lidar-for-robotics`,
  `/products/3d-camera→/3d-cameras-for-robotics`, `/products/1d-rangefinders→/rangefinders`,
  `/products/3d-mapping→/3d-mapping`
- All 17 old `/product/<woo-slug>` URLs → new `/products/<slug>` equivalents
  (Percipio GM461/GM465 — line discontinued → `/3d-cameras-for-robotics`)
- Catch-all: any other `/product/:slug*` → `/products`

## Phase 3: Analytics & Structured Data — Fixes Applied

**`web/src/app/layout.tsx`**
- Google tag `GT-NFJ9PT8` (gtag.js, `afterInteractive`) replicating the Site Kit config from the
  old site, including the cross-domain `linker` for `morpheustek.com`. Same container → GA4
  reporting history continues across the relaunch.
- `Organization` + `WebSite` JSON-LD (name, url, logo, contact, LinkedIn sameAs).

**`web/src/app/products/[slug]/page.tsx`** — `Product` + `BreadcrumbList` JSON-LD on all 20
product pages, generated from catalog data (no fabricated prices/ratings, per policy).

**`web/src/components/seo/JsonLd.tsx`** — new shared renderer (Next-documented pattern,
`<`-escaped).

## Verification (production build, `next start`)

- `pnpm build` clean; 103 static pages generated
- `/robots.txt` ✅ allow-all + admin disallow + sitemap/host
- `/sitemap.xml` ✅ 59 URLs, base `https://morpheustek.com`
- Redirect spot checks ✅ all 308 to correct targets (incl. catch-all)
- Homepage HTML ✅ GT-NFJ9PT8 loader + Organization/WebSite JSON-LD
- Product page HTML ✅ Product + BreadcrumbList (4 ListItems) JSON-LD

## Launch-Night Checklist (outside the repo — needs human/DNS/console access)

1. **Vercel domains:** add `morpheustek.com` (primary) + `www.morpheustek.com` (redirect → apex).
   Canonical URLs use the apex; the www→apex redirect happens at the Vercel layer.
2. **Google Search Console:** the old site was verified via Site Kit/WordPress — that verification
   dies with WordPress. Re-verify with a **DNS TXT record** (survives platform changes), then
   submit `https://morpheustek.com/sitemap.xml`. The old site never had a sitemap, so this is a
   net upgrade.
3. **GA4 Realtime:** after DNS cutover, confirm hits arrive on the existing property (tag
   `GT-NFJ9PT8`).
4. **robots.ts AI-crawler policy:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are allowed by
   default as an intentional GEO strategy — the code comment says to confirm with the client
   before launch. Confirm tonight or ship as-is.
5. **Privacy policy:** `/privacy` still needs the Leadsy.ai visitor-identification disclosure
   (open item from PR #13).

## Open Items (post-launch, non-blocking)

- `llms.txt` (GEO) — planned in docs/05, not yet built
- `FAQPage` JSON-LD on glossary/application pages
- Old blog posts redirect to the blog hub, not per-post equivalents (old posts weren't migrated)
- IndexNow key for Bing instant indexing
