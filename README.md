# MorpheusTEK Website

The new MorpheusTEK marketing + product website — _Giving Sight to Robotics._
Designed and built by **Stackked Tech**.

## Repository layout

| Path | What's in it |
|---|---|
| [`web/`](web/) | The **Next.js 16 application** (the website). See [`web/README.md`](web/README.md) to run it. Vercel project root = `web/`. |
| [`docs/`](docs/) | The **master build plan** and its specialist appendices (brand & design system, IA/UX, copy, technical architecture, conversion/SEO/GEO, interactive features & media, and the consolidated build plan). Start with [`docs/00_MASTER_PLAN.md`](docs/00_MASTER_PLAN.md). |

> Confidential client source materials (raw meeting transcripts, the ICP questionnaire) and internal working notes are intentionally **excluded** from this repo (see `.gitignore`).

## Quick start

```bash
cd web
pnpm install
pnpm dev        # http://localhost:3000
```

## Status

**Phase 1 (foundation) — complete.** Three-theme design system (light / dark / signature LiDAR sensor-view), header + mega menu + footer, StoryBrand homepage with an AI hero video, all 18 product pages, 8 category pillars, applications, the SICK comparison, the gated resource library, about/manufacturing-strength, lead-capture forms (client-side), shows, `robots.txt` + `sitemap.xml`.

**Phase 2 (next).** HubSpot form wiring, Supabase CMS, real product photography, JSON-LD/GA4, and the remaining signature features. See `docs/07_critique_and_build_plan.md`.

Target launch: **late June 2026** (around the Automate trade show).
