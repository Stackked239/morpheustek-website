# MorpheusTEK Website — Master Build Plan

**Client:** MorpheusTEK · **Agency:** Stackked Tech · **Prepared by:** Austin Warren
**Tagline:** *Giving Sight to Robotics* · **Target launch:** late June 2026 (around **Automate**)
**Status:** v1.0 — synthesized from 2 discovery calls, the 49-page ICP questionnaire, both training guides, the flyer, and the MODEX booth photo.

> **How this document works.** This is the executive layer — the whole strategy in one read, with every cross-cutting decision **locked** so the build is internally consistent. The deep specs live in seven appendix docs (linked in §13). Where this master plan and an appendix ever disagree, **this document wins** — it already reconciles the contradictions the appendices contained.

---

## 1. The vision in one paragraph

The current MorpheusTEK site gets ~2,000 visitors/month and converts essentially **zero** of them to meetings. It looks fine and sells nothing. We are replacing it with a **custom, modern, conversion-engineered site** that does three things the old one can't: (1) tells a **story** — MorpheusTEK as the *full-stack perception partner that gives robots sight*, not "just a distributor"; (2) **converts** in-market robotics engineers and buyers into booked meetings, gated downloads, quote requests, and 90-day trials, wired straight into HubSpot; and (3) **gets found** — 99+ Lighthouse, SEO + GEO so MorpheusTEK is the cited answer in Google's AI overview and in ChatGPT/Claude. It will be visually extraordinary (full-screen AI hero video, a signature LiDAR "sensor-view" mode, a before/after point-cloud slider) while staying technically credible for a spec-reading engineer. Built on Next.js + Supabase + Vercel, handed over as a client-owned GitHub repo so MorpheusTEK is never locked in.

---

## 2. Who we're talking to — the three ICPs (this drives everything)

One **primary customer journey with branches**. The homepage speaks to **A**; technical depth serves **B**; conversion/trust elements reassure **C**. All three are usually the *same deal* at different stages. Revenue split today ≈ 70% A / 20% B / 10% C.

| | ICP | Who | What they need to believe to convert |
|---|---|---|---|
| **A — PRIMARY (the hero)** | Robotics Builder / Integrator — "Robotics Engineer Skippy" | Engineer-led, inside a robotics OEM/integrator buying committee building AMRs, AGVs, autonomous forklifts, cleaning/service robots at scale | "This partner understands my application and can take me from prototype to production without the piecemeal-vendor risk." |
| **B** | Engineer / Technical Evaluator | Hands-on, specifies the sensor stack, must make it work | "The specs, SIL2 safety, ROS/SDK integration, and proof are real — this will work." |
| **C** | Buyer / Economic Decision-Maker | Owns budget + make-vs-buy / sourcing | "I cut cost and lead time vs. SICK without taking on supply-chain or support risk." |

**The hero line (seeded from Phil's own words):**
> **Give your robot the right LiDAR, camera, and perception stack to navigate, avoid obstacles, and operate safely — from prototype to production.**

**Sharpest differentiator (verbatim-grade):**
> Unlike everyone else, MorpheusTEK helps robotics companies **deploy the right full-stack perception solution — not just buy another sensor.**

---

## 3. Positioning, voice & the non-negotiable rules

- **Position:** The **bold challenger to SICK** and legacy LiDAR/safety-sensor suppliers — national in presence, **nimble and scrappy** in delivery. Project bigger than we are *without overstating* ("let perception be reality").
- **Voice:** Advisor-first, no-nonsense expert engineer — confident not arrogant, technical not complicated, direct not aggressive. Concede SICK's quality; win on **value + the 90-day trial + the full stack**.
- **The 3 lines in every deal:** ① "Same safety class as SICK (Type 3 / SIL2 / PL d) at a fraction of the price." ② "Try it free for 90 days in your own environment — no commitment." ③ "We sell the whole solution — sensor, edge compute, cameras, and North American support."

**Hard rules baked into the build (these constrain copy, data model, and design):**
1. **Lead with MorpheusTEK as the solution provider.** OLEI is a *proof point*, never the homepage lead; **don't let supplier names dominate.**
2. **Precise certification language.** SIL2 / Type 3 / PL d belongs to the **GS1-5 specifically** — enforced at the *data-model* level (a product without a `certifications` record literally cannot render a safety badge).
3. **No unsupported claims.** No invented competitor prices, no computed "X% cheaper" on public pages — only the qualitative "fraction of the price / same safety class" framing. **Exact competitor pricing stays internal.**
4. **No customer names/logos without written approval.** Anonymized application proof until sign-off is on file; partner footage (Ross Video, Tennant, Anatech, BrainOS, Aethon) is **logo-stripped + approval-gated** and cannot render publicly while `pending`.
5. **Compliance/federal positioning is INTERNAL ONLY.** MorpheusTEK has its own China-sourcing exposure; the site never positions into federal/DoD/DOT deals or makes compliance claims. Core public market = **commercial robotics & industrial automation.**
6. **No team-size / headcount / leadership-bios page** — a *deliberate* scale-projection choice, not an oversight.

---

## 4. The site at a glance (locked sitemap & navigation)

**Top navigation (LOCKED — 5 items + seasonal):** **Products · Applications · Compare · Resources · Why Us** — plus **"Shows We'll Be At"** surfaced as a **seasonal banner/utility link**, not permanent nav. Persistent header CTAs: **Start a 90-day trial** (primary) + **Talk to an engineer**.

```
/                                   Home (StoryBrand scroll, hero video)
/full-stack-perception              The full-stack solution (root-level, SEO pillar)
/products                           Catalog (mega-menu + filter, DB-backed, scalable)
  /lidar-for-robotics               Category pillar — 2D LiDAR
  /safety-lidar                     Category pillar — Safety LiDAR (GS1-5 home)
  /3d-lidar-for-robotics            Category pillar — 3D LiDAR
  /solid-state-lidar                Category pillar
  /3d-cameras-for-robotics          Category pillar — depth/RGBD cameras
  /rangefinders                     1D rangefinders
  /3d-mapping                       Mapping / digital-twin
  /edge-compute                     Sintrones edge compute
  /products/{model}-{keyword}       Product detail  → e.g. /products/gs1-5-safety-lidar,
                                                       /products/lr-1f-2d-lidar,
                                                       /products/lr-16f-100-3d-lidar
/applications                       Applications hub
  /applications/amr ... /agv ... /autonomous-forklift ... /robotic-cleaning ...
  /warehouse-logistics ... /outdoor-mobile ... /mapping-digital-twin ... /inspection ...
  /applications/spotlight           Application Spotlight (recurring section)
/compare
  /compare/sick-alternative-lidar   "The LiDAR alternative to SICK" (target keyword)
  /compare/hokuyo-alternative-lidar
/custom-solutions                   Custom LiDAR/camera solutions
  /custom-solutions/spotlight        Custom Solution Spotlight (recurring section)
/resources                          Technical Resource Library (gated magnets)
  /resources/{slug}                  Each lead magnet
  /resources/glossary                Robotics glossary (GEO citation asset)
/blog        + /blog/{slug}         Insights/blog (SEO/GEO engine)
/shows       + /shows/meet-us-at-the-booth   Shows hub w/ NA city map + booth form
/about       (incl. Manufacturing Strength Behind the Sensing Stack)
/contact  ·  /book-a-meeting        A+ conversion
/product-of-the-month  ·  /whats-new
```

**URL/CMS conventions (LOCKED, resolving the appendix conflicts):**
- Product slugs: `/products/{model}-{category-keyword}` — **no `olei-`/supplier prefix** (e.g., `gs1-5-safety-lidar`). `slug` is a CMS primary key — changing it later breaks SEO, so it's locked at wireframe time.
- Category hubs are **keyword pillars** (`/safety-lidar`, `/3d-cameras-for-robotics`) — not nested under `/lidar/...`.
- Comparison slugs carry the keyword: `/compare/sick-alternative-lidar`.
- Full-stack page is **root-level** `/full-stack-perception` (no thin `/solutions` hub).
- **One About page** owns manufacturing-strength + "Why MorpheusTEK"; the "LiDAR supplier North America" keyword maps to `/about`. No separate `/why-morpheustek`.

All six recurring sections Phil approved exist as real routes/CMS templates: **Product of the Month · Shows We'll Be At · Application Spotlight · Technical Resource Library · Custom Solution Spotlight · What's New** — authored once and synced to the Big Wave email + LinkedIn (see §8).

---

## 5. The homepage story (StoryBrand scroll order)

1. **Hero** — full-screen AI video; hero line (§2) + dual CTA; live "sensing" eye motif. (3 A/B headline variants ready.)
2. **The problem** — the engineer's pains: unreliable navigation/obstacle avoidance, safety certification, integration risk, cost & lead-time pressure vs. legacy suppliers.
3. **The guide** — MorpheusTEK understands the application; full-stack perception partner.
4. **The simple plan** — **Discovery → 90-day Trial → Deploy** (mirrors the real sales process; the trial is the conversion engine).
5. **The full stack** — LiDAR (2D/3D) + 3D cameras + safety sensing + edge compute, as one solution.
6. **90-day risk-free trial banner** — the single biggest differentiator, bold and yellow.
7. **Products/categories showcase** — scalable, mega-menu-linked.
8. **Applications strip** — AMR, AGV, forklift, cleaning, warehouse, outdoor, mapping, inspection.
9. **Proof — "Manufacturing Strength Behind the Sensing Stack"** — OLEI / HUADA / Great Star, 30+ years serving Bosch/Hilti/Leica/Trimble (pending publish-approval). *Proof, not lead.*
10. **The SICK reframe** — "same safety class, a fraction of the price" (qualitative; no invented numbers).
11. **Recurring teasers** — Product of the Month + Shows We'll Be At.
12. **Final CTA** — book a meeting / start a trial, plus the low-commitment catcher for the 60% "in-between" buyers.

---

## 6. Signature experiences (the "wow", all Lighthouse-safe)

| Feature | What it does | Launch priority |
|---|---|---|
| **AI hero video** | Full-screen, above-the-fold, AI-generated (Higgsfield), poster-first + lazy + muted autoplay + mobile fallback | **P0 (launch)** |
| **Before/after point-cloud slider** | Drag to reveal real-world photo ↔ LiDAR/3D point-cloud, from a robot's POV | **P0** |
| **Light / Dark mode** | Auto-adapts to OS; the token foundation that enables sensor-view | **P0** |
| **Mega-menu w/ rotating featured product** | Half-page, imagery, by-category + by-application | **P0** |
| **2D vs 3D vs depth + safety-zone diagrams** | Interactive perception explainers; warning-zone 1/2 + protection zone (the GS1-5 proof object) | **P0** |
| **LiDAR "Sensor-View" theme toggle** | Flips the whole site into a point-cloud/heat-vision aesthetic — the showpiece | **Fast-follow** (confirm with Phil — he may want it live for Automate) |
| **Build-on-scroll** | A robot assembles its sensor stack / a unit explodes into specs as you scroll | **Fast-follow** |
| **Live point-cloud / SLAM-map element** | WebGL perception visual — "we give sight to robotics" | **Fast-follow** |
| **Ambient robot-with-MorpheusTEK-eyeball scene** | AI-generated background presence | **Fast-follow** |
| **Live "active projects / now shipping" terminal** | Scrappy-challenger flourish | **P2 / optional** |

The full media plan ships with a **prioritized Higgsfield shoot list** (hero video, robot-with-eyeball, category/application scenes, before/after pairs, safety-zone diagrams, OG images, favicon) — each with a ready-to-paste prompt — in appendix doc 06. **Product renders of real SKUs prefer real supplier photography** (an engineer will notice an AI-faked unit); AI generation is reserved for scenes/heroes/applications.

---

## 7. The conversion engine

**Ranked conversions:** **A+** Book a meeting · **A** Gated download (primary magnet: *SICK / Hokuyo Alternative Comparison Checklist*) · **A** Request a quote/recommendation · **B** Request a sample/demo (ties to the 90-day trial) · **B** Trade-show meeting ("Meet Us at the Booth") · **C** Newsletter.

- **CTAs everywhere, varied wording, A/B split-tested** (Start a 90-day trial / Get a quote / Talk to an engineer / Download the guide). The **60% in-between buyers** always get a low-commitment path.
- **5 lead magnets**, each mapped to an ICP, gated behind a form (min: name + company + business email + use case) and wired to a **HubSpot nurture** (2–3 emails → book-a-meeting): SICK/Hokuyo Alternative Comparison Checklist · LiDAR Selection Guide for Robotics OEMs · Safety LiDAR Buyer's Guide · Custom LiDAR Requirements Worksheet · Sample Point-Cloud/Application Demo Pack.
- **HubSpot is the system of record.** Download → create/update contact + company → tag source + ICP → store asset → assign owner → nurture → invite to book. Quote/sample → high-priority deal/task. (One open decision: whether *every* download spawns an Opportunity — Tom's literal ask — or only high-intent forms — our recommendation. See §11.)
- **The LR-1BS2 ($595)** is positioned as the intentional **low-barrier "foot-in-the-door" SKU** — a "start small + 90-day trial" entry play and a Product-of-the-Month candidate.

---

## 8. Getting found — SEO + GEO + the campaign sync

- **Technical SEO from day one:** 99+ Lighthouse, one H1/page + clean H2 structure, alt text on every image, sitemap.xml, robots.txt, canonical URLs, and **schema.org** (Organization, Product+Offer, BreadcrumbList, FAQPage, Article, DefinedTerm for the glossary).
- **Keyword → page map:** every priority term is assigned to a specific page (e.g., "SIL2 safety LiDAR" → `/safety-lidar` + `/products/gs1-5-safety-lidar`; "LiDAR alternative to Sick" → `/compare/sick-alternative-lidar`; "custom LiDAR for robotics" → `/custom-solutions`). **Win specific high-intent queries first**, not broad "lidar."
- **GEO (be the AI's answer):** a published **factual claim set** (`llms.txt`), answer-first content, FAQ/Q&A blocks phrased the way ICPs actually ask ChatGPT/Claude, the **glossary as a citation magnet**, and entity-consistency everywhere. AI-crawler allowlist (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) — **on** for GEO (client-acknowledged).
- **Campaign sync (Big Wave + LinkedIn):** Product-of-the-Month and Show-of-the-Month are authored **once** in the CMS and consumed by the site, the ~25k Big-Wave email, and LinkedIn — with a defined **UTM taxonomy** (`utm_source=bigwave|linkedin|show`, `utm_campaign=potm-2026-07`) so the dashboard can finally answer Tom's question: *"where did that traffic come from?"*
- **Measurement & the expectation reset:** GA4 owner moves to Phil; we audit for **duplicate tracking** and set a true-unique-visitor baseline; a **transparency dashboard** (GA4 + Search Console + HubSpot) shows rankings, traffic-by-source, and the A+/A/B/C funnel. **Honest target:** the "20% to a meeting" goal is realistic only as a *high-intent-traffic + full-loop* metric; site-wide conversion will be low single digits. This must be agreed at kickoff so the dashboard isn't misread as failure.

---

## 9. Technology & delivery

- **Stack:** **Next.js (App Router) + React + TypeScript + Tailwind**, deployed on **Vercel** — custom, modern, maintainable by any developer, **not WordPress** (which they're leaving after hacks/DDoS). SSG/ISR for product & blog pages for speed + SEO.
- **CMS / backend: Supabase** (Postgres + Storage + Auth). Tables: `products, categories, applications, resources, blog_posts, shows, featured_content, product_assets, submissions, site_settings`. The non-dev client adds/edits products, posts, spec sheets, shows, and the recurring sections themselves. **Gated spec-sheet PDFs** live in Supabase Storage and unlock via **signed URLs** after form submit. Row-level security keeps `pending`/unapproved assets from ever rendering.
- **HubSpot integration** via a serverless `/api/lead` route (contact + company + deal + nurture); Cloudflare Turnstile + rate-limiting for spam.
- **Delivery & no-lock-in:** client-owned **GitHub repo** + **how-to.md** (including the exact Vercel-team-transfer steps); **branch → preview → promote-to-production** workflow; safe **"edit via Claude desktop"** documented with a branch-only guardrail. Hosting sits on Stackked's Vercel while on retainer, with a one-step documented migration.
- **Performance gate:** a **Lighthouse CI check on every preview**, validated against the *homepage's cumulative feature budget* (the one page carrying hero video + slider + mega-menu must still hit 99+ — features get demoted below the fold or to fast-follow if it can't).

---

## 10. The build roadmap (phased, to the late-June Automate milestone)

| Phase | What happens | Gate |
|---|---|---|
| **0 — Discovery & Audits** | Confirm ICP **B/C**; 4 separate interviews (Phil, Tom, Greg, Eli); **GA4 owner transfer** Sean→Phil; brand asset folder from Sean; **GA4 duplicate-tracking audit** + current-site SEO baseline; **HubSpot portal audit**; competitor teardown | ICP confirmed + GA4 access + assets/placeholders + HubSpot audit → *the real build doesn't start without this* |
| **1 — "Go Dark" wireframe (1–2 wks)** | Next.js/Supabase/Vercel scaffold; client repo; **slugs + nav LOCKED**; light/dark token foundation; all routes + templates as wireframes; catalog seeded from canonical prices | Structure shared for **notes-only** review; foundation approved |
| **2 — Core build (parallel, placeholders OK)** | Product/category/application/comparison templates; homepage + GS1-5 page + SICK comparison copy; HubSpot `/api/lead`; GA4 events; P0 media via Higgsfield; P0 features (hero video, mega-menu, light/dark, before/after, diagrams) | **Lighthouse CI ≥99** enforced on every preview |
| **3 — Rapid finishing + SEO/GEO + dashboard** | Schema/JSON-LD, sitemap/robots/llms.txt, GEO formatting; transparency dashboard; A/B harness; nurture sequences; `how-to.md`; client onboarding | Client can self-serve; 99+ confirmed on key pages |
| **3.5 — AUTOMATE LAUNCH (late June)** | Ships: home, GS1-5 + core products, SICK comparison, About/Manufacturing, applications, resource library + primary magnet, Shows + booth form + Automate pre-show sequence, blog scaffold, light/dark, hero video, mega-menu, before/after, dashboard (if GA4 transferred) | Live via promote-to-production |
| **4 — Fast-follow** | Sensor-View toggle, build-on-scroll, live SLAM/point-cloud, ambient robot; **replace AI placeholders with real supplier footage** (protects GEO); approved partner footage; Big-Wave/LinkedIn sync; Application + Custom-Solution Spotlights; A/B tests to significance | Ongoing, weekly Tom check-ins |

**Sequencing risks to manage:** GA4 owner transfer (third-party blocker on the dashboard); asset delivery vs. the Automate date (mitigated by parallel placeholders); the go-dark "notes-only, don't nitpick placeholders" rule; and the cumulative-feature Lighthouse budget on the homepage.

---

## 11. Open decisions I need from you (Phil/Tom + Austin)

1. **Sensor-View toggle — launch or fast-follow?** It's your wish-list item but Effort-L; do you want it live for Automate?
2. **The 20%-to-meeting expectation** — agree it's a high-intent-traffic + full-loop metric, not site-wide.
3. **Manufacturing claims that are publishable** — Bosch/Hilti/Leica/Trimble heritage, "largest laser-diode purchaser," "30+ years," HUADA/Great Star marks?
4. **Does every gated download create a HubSpot Opportunity** (Tom's literal ask) or only high-intent forms (our recommendation)?
5. **UAV + Agriculture** — in or out? (The flyer lists them; the current application set drops them.)
6. **Homepage low-commitment catcher** — the SICK checklist, or a separate "what makes us different" magnet (Austin's words on the call)?
7. **Display font** — Saira recommended (Inter for body, locked); confirm or audition an alternative.
8. **ICP B & C personas** — confirm/correct the drafted versions (this is the build gate).
9. **Slug/nav** — confirm the locked schemes in §4 (cheap now, expensive later).

## 12. Assets MorpheusTEK still owes

Brand vector logos (wordmark + OLEI eye SVGs, from Sean) · existing color/print spec + booth photos · ICP B/C confirmation + the 4 interviews · GA4 owner access (Sean→Phil) · HubSpot portal access · real supplier point-cloud/product video + **real product photography of actual SKUs** · partner footage (logo-stripped + written approval) · customer-story approvals · competitor-site list · manufacturing-claim publish approval.

---

## 13. The detailed plan (appendix documents)

| Doc | Contents |
|---|---|
| `01_brand_design_system.md` | Exact color tokens (light/dark/sensor-view), type system, logo/eye/OLEI lockups, components → Tailwind config, motion |
| `02_ia_ux_journey.md` | Full sitemap, mega-menu, the 3-ICP journey, StoryBrand order, template & content-model inventory |
| `03_content_copy_blueprint.md` | Real draft copy (home, product, category, application, comparison, about, resources) + the 3 personas + voice guide |
| `04_technical_architecture.md` | Next.js/Vercel, Supabase schema, HubSpot flow, GA4 + dashboard, 99+ Lighthouse budget, repo/handover |
| `05_conversion_seo_geo.md` | Ranked CTAs + A/B plan, the 5 lead magnets + nurtures, keyword→page map, JSON-LD, GEO/llms.txt, KPIs |
| `06_interactive_features_media.md` | Every signature feature spec + the prioritized Higgsfield shoot list with ready-to-paste prompts |
| `07_critique_and_build_plan.md` | Adversarial completeness review, contradiction resolutions, full phased build plan, open decisions |
| `claudedocs/GROUND_TRUTH_BRIEF.md` | The distilled single source of truth all of the above was built from |
