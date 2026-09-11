# Information Architecture, Navigation & UX Journey

> MorpheusTEK website — detailed plan section. Part of the master build plan.

---

I have full grounding in all five sources. Now I'll produce the deliverable section directly.

# Information Architecture, Navigation & UX Journey

**MorpheusTEK — "Giving Sight to Robotics"** · Master Build Plan, Section: IA / Nav / UX
*Grounded in the Ground-Truth Brief, the Product & Competitive Training Guide, the Robotics Language Guide, and both discovery transcripts (May 20 + May 28, 2026). This section defines the skeleton every other workstream hangs on: what pages exist, how they connect, how the three ICPs travel through them, and how the StoryBrand arc maps to the homepage scroll.*

---

## 0. Governing Principles (the rules this IA obeys)

These are non-negotiable and constrain every decision below.

| # | Principle | Source / Why |
|---|---|---|
| P1 | **Lead with MorpheusTEK as the full-stack perception PARTNER**, not a distributor. OLEI/Percipio/MRDVS/Sintrones are proof points only — they never anchor the homepage or top nav. | Brief §2, §12; Phil "solutions based, not just hardware." |
| P2 | **ICP-A (Robotics Builder/Integrator, "Skippy") is the hero.** The home page and nav default to A. B (Engineer) is served by depth; C (Buyer) is served by reassurance. ~70/20/10 revenue split today; grow the production/OEM share. | Brief §3. |
| P3 | **The 90-day risk-free trial is the single biggest differentiator** and must appear as a persistent, low-commitment CTA — not buried on one page. | Brief §6, §7; Training Guide §4. |
| P4 | **~60% of visitors are "in-between" buyers** not ready to meet. Every page must offer a low-commitment path (gated guide, spec sheet, "Talk to an Engineer," sample request) alongside the high-commitment "Book a Meeting." | Brief §7; transcript 5/28. |
| P5 | **B2B engineers read specs.** Critical specs live **above the fold** on every product page; full datasheet is a **gated PDF download** (lead capture into HubSpot). | Brief §4, §10; transcript 5/20 (Phil). |
| P6 | **Precise certification language.** SIL2 / Type 3 / PL d belongs to the **GS1-5 specifically**. Site copy and schema must scope these claims to that product; never apply blanket. | Brief §12; Training Guide GS1-5 page. |
| P7 | **Compliance / federal positioning is INTERNAL ONLY.** No public page, nav item, filter, schema, or comparison may position into DoD/DOT/federal or make compliance claims. Comparison pages stay commercial-value framed. | Brief §5; Training Guide §3. |
| P8 | **Scalable, DB-backed catalog.** Product and content pages are template-driven off a CMS (Supabase) so Phil's team self-serves a growing catalog. | Brief §4, §11; transcript 5/20. |
| P9 | **SEO + GEO first.** Slugs, IA, and breadcrumbs are built around the priority high-intent keywords; structure must be citable by AI answer engines. One H1 per page. | Brief §8; transcripts. |
| P10 | **No unsupported claims, no customer names/logos without approval.** Application pages use anonymized proof until sign-off. | Brief §12. |

---

## 1. Full Sitemap

### 1.1 Slug Conventions (decided)

- All lowercase, hyphenated, no trailing slash, no `.html`. (PROPOSED) Flat where it aids keyword targeting; shallow nesting (≤2 levels) for crawl + GEO.
- **Products** live at `/products/<slug>` (flat, not nested under category) so individual product URLs are short and keyword-clean, and a product can belong to multiple categories without URL conflicts. Category pages at `/lidar/...` and `/cameras/...` use the **keyword as the path**, not the supplier name.
- **Applications** at `/applications/<slug>` — these target "[sensor] for [use case]" intent.
- **Comparison** pages at `/compare/<competitor>-alternative` — targets "LiDAR alternative to Sick," "Hokuyo LiDAR alternative."
- Category slugs deliberately **embed the priority keyword** (e.g., `/lidar/safety-lidar`, not `/safety`). Supplier brand never appears in a slug.

### 1.2 The Tree

```
morpheustek.com
│
├── /                                    ……… HOME  (ICP-A hero; StoryBrand scroll — see §4)
│
├── /solutions                           ……… SOLUTIONS HUB (the "full-stack" story)
│   └── /solutions/full-stack-perception ……… ★ FLAGSHIP: "Not just a sensor — the whole stack"
│                                              (LiDAR + 3D cameras + safety + edge compute + guidance)
│
├── /lidar                               ……… CATEGORY HUB: LiDAR  (pillar page, kw: "LiDAR for robotics")
│   ├── /lidar/2d-lidar                   …… 2D LiDAR            (kw: "2D LiDAR for robot navigation")
│   ├── /lidar/safety-lidar              …… Safety LiDAR        (kw: "safety LiDAR for AMR","SIL2 safety LiDAR")
│   ├── /lidar/3d-lidar                   …… 3D LiDAR            (kw: "3D LiDAR for obstacle avoidance")
│   └── /lidar/solid-state-lidar         …… Solid-State LiDAR   (kw: "solid-state LiDAR obstacle avoidance")
│
├── /cameras                             ……… CATEGORY HUB: 3D Cameras (kw: "3D cameras for robotics","dToF camera")
│   └── /cameras/3d-depth-cameras        …… 3D / dToF RGBD Cameras (RealSense-replacement intent)
│
├── /rangefinders                        ……… CATEGORY: 1D Laser Rangefinders (kw: "1D laser rangefinder positioning")
│
├── /mapping                             ……… CATEGORY: 3D Mapping (kw: "3D mapping scanner","digital twin LiDAR")
│
├── /edge-compute                        ……… CATEGORY: Edge Computing (kw: "edge compute for robot perception")
│
├── /products                            ……… ALL-PRODUCTS INDEX (filterable: category · application · interface · range · safety-rated)
│   ├── /products/olei-lr-1f             …… 360° 2D LiDAR
│   ├── /products/olei-lr-1bs2           …… Mini Zone 2D LiDAR  (foot-in-the-door SKU)
│   ├── /products/olei-vbd1-10           …… High-frequency 2D LiDAR
│   ├── /products/olei-gs1-5             …… ★ 2D Safety LiDAR (FEATURED — only product carrying SIL2/Type3/PLd copy)
│   ├── /products/olei-lr-16f-100        …… 3D 16-Channel LiDAR
│   ├── /products/olei-lr-16fis          …… Explosion-Proof 3D LiDAR
│   ├── /products/olei-lr-f240           …… Solid-State Obstacle-Avoidance LiDAR
│   ├── /products/olei-vss-50            …… Solid-State 3D LiDAR
│   ├── /products/percipio-gm461-e1      …… 3D Depth Camera
│   ├── /products/percipio-gm465-e1      …… Dual-Mode 3D Depth Camera
│   ├── /products/mrdvs-s10              …… dToF RGBD Camera (available now)
│   ├── /products/mrdvs-s10-ultra        …… Long-Range dToF RGBD (pre-order Q2 2026)
│   ├── /products/mrdvs-s11              …… Ultra-Wide dToF RGBD (pre-order Q2 2026)
│   ├── /products/olei-a090              …… 1D Laser Rangefinder
│   ├── /products/olei-lr-dds-2          …… Tripod 3D Mapper
│   ├── /products/olei-lc-m50g           …… Mobile SLAM 3D Mapper
│   ├── /products/sintrones-ibox-602p    …… Edge AI Computer
│   └── /products/sintrones-sbox-2624p   …… Embedded Computer
│        (catalog GROWS — every new product = one CMS row, auto-rendered by the product template)
│
├── /applications                        ……… APPLICATIONS HUB (by use case; the "we understand your robot" layer for ICP-B)
│   ├── /applications/amr                       … Autonomous Mobile Robots
│   ├── /applications/agv                        … Automated Guided Vehicles
│   ├── /applications/autonomous-forklift        … Autonomous Forklifts (pallet/dock/people)
│   ├── /applications/robotic-cleaning           … Robotic / Commercial Cleaning Platforms
│   ├── /applications/warehouse-logistics        … Warehouse & Logistics Automation
│   ├── /applications/outdoor-autonomy           … Outdoor Mobile Robots (sunlight/dust/terrain)
│   ├── /applications/mapping-digital-twin       … Mapping & Digital-Twin Capture
│   ├── /applications/inspection                  … Inspection Robots
│   └── /applications/safety-protective-field    … Safety & Protective-Field Sensing (anchors GS1-5)
│
├── /compare                             ……… COMPARISON HUB ("alternative to…")  [COMMERCIAL FRAMING ONLY — P7]
│   ├── /compare/sick-alternative        …… ★ LiDAR Alternative to SICK (same safety class, fraction of price, 90-day trial)
│   └── /compare/hokuyo-alternative      …… Hokuyo LiDAR Alternative (price + 90-day trial + expand 2D→3D)
│        (NO Hesai/Vanjee/RoboSense/Ouster public compare pages — compliance/China framing is internal only)
│
├── /custom-solutions                    ……… CUSTOM SOLUTIONS (custom FOV/range/mounting/housing/firmware; OEM/ODM)
│
├── /resources                           ……… TECHNICAL RESOURCE LIBRARY (hub; mix of open + gated)
│   ├── /resources/guides                       … Gated lead-magnet guides index
│   │   ├── /resources/guides/sick-hokuyo-alternative-checklist   ★ PRIMARY lead magnet (gated)
│   │   ├── /resources/guides/lidar-selection-guide-robotics-oem  (gated)
│   │   ├── /resources/guides/safety-lidar-buyers-guide-amr       (gated)
│   │   ├── /resources/guides/custom-lidar-requirements-worksheet (gated)
│   │   └── /resources/guides/point-cloud-application-demo-pack    (gated)
│   ├── /resources/spec-sheets                   … Datasheet library (each gated PDF; also linked from product pages)
│   ├── /resources/glossary                       … Robotics/LiDAR glossary (OPEN — GEO/SEO citable; from Language Guide)
│   └── /resources/faq                            … Open FAQ (GEO answer targets; FAQPage schema)
│
├── /insights                            ……… BLOG / INSIGHTS (SEO+GEO engine; also future technical newsletter)
│   ├── /insights/<post-slug>                    … Individual post (one consistent template — Phil's requirement)
│   └── /insights/category/<topic>               … Topic archives (navigation, safety, 3D, integration, etc.)
│
├── /shows                               ……… SHOWS WE'LL BE AT (events hub; syncs LinkedIn + "Big Wave")
│   ├── /shows/<event-slug>                       … Individual show page → "Meet Us at the Booth" form
│   └── /shows/meet-us-at-the-booth               … Generic booth-meeting request (HubSpot pre-show sequence)
│
├── /product-of-the-month                ……… PRODUCT OF THE MONTH (rotating featured SKU; powers mega-menu feature + Big Wave)
│
├── /whats-new                           ……… WHAT'S NEW AT MORPHEUSTEK (releases, pre-orders e.g. S10 Ultra/S11, milestones)
│
├── /about                               ……… ABOUT MORPHEUSTEK (the guide; national presence, scrappy/nimble, advisor)
│   └── /about/manufacturing-strength    …… ★ "Manufacturing Strength Behind the Sensing Stack"
│                                              (HUADA / Great Star proof — credibility, NOT lead; P1)
│
├── /contact                             ……… CONTACT (sales@morpheusTEK.com · (302) 416-5989 · LocalBusiness schema)
│
├── /book-a-meeting                      ……… BOOK A MEETING / DISCOVERY CALL  (A+ conversion; calendar embed)
│
├── /request-a-quote                     ……… REQUEST A QUOTE / PRODUCT RECOMMENDATION (high-intent capture)
│
├── /start-a-trial                       ……… START YOUR 90-DAY RISK-FREE TRIAL (sample/eval-unit request)
│
└── /legal
    ├── /legal/privacy-policy
    ├── /legal/terms-of-use
    ├── /legal/cookie-policy
    └── /legal/accessibility-statement
   (utility, sitewide, not in main nav)

  Utility / system pages (no nav):  /search · /404 · /500 · /thank-you (post-form) ·
  /sitemap.xml · /robots.txt · /llms.txt (GEO: curated facts AI should repeat — Brief §8)
```

**Notable IA decisions, flagged:**

- **Category hubs split LiDAR from "everything else."** LiDAR gets its own four-child hub (`/lidar/...`) because it carries the most priority keywords and is the revenue core. Cameras, rangefinders, mapping, edge compute are single-tier categories — keeps the tree shallow while still giving each a keyword-owning page.
- **`/llms.txt`** is added as a GEO asset (PROPOSED): a curated plain-text file restating the "facts AI should repeat" (Brief §8) so answer engines cite MorpheusTEK accurately. Commercial framing only — no compliance content.
- **No federal/government/compliance pages anywhere** (P7). The internal Section-3 talk track never becomes a URL.
- **Comparison hub is deliberately limited to SICK + Hokuyo** — the two competitors the brief sanctions for public, commercial-value comparison. Hesai/Vanjee/RoboSense/Ouster are *not* given public compare pages because their differentiator is compliance/China-sourcing, which is internal-only.

---

## 2. Navigation Design

### 2.1 Top Bar (sticky header)

Three-zone header, persistent across the site.

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ [◉ morpheusTEK]   Solutions ▾  Products ▾  Applications ▾  Why Us ▾  Resources ▾     │
│   (eye logo,        (mega)     (mega)      (mega)        (panel)   (panel)            │
│    links home)                                                                         │
│                          [ ☼/☾ theme ] [ ◉ sensor-view ] [ Start 90-Day Trial ] [ Book a Meeting ] │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Left:** MorpheusTEK eye/wordmark (blue), links to home. The eye motif doubles as the brand's "sight" promise.
- **Center — 5 nav triggers:**
  1. **Solutions** (mega) — leads with full-stack story (P1).
  2. **Products** (mega — the half-page menu) — by-category + by-application + rotating featured product.
  3. **Applications** (mega) — by use case, with imagery.
  4. **Why Us** (panel) — Custom Solutions · Manufacturing Strength · SICK/Hokuyo Alternative · The 90-Day Trial · About.
  5. **Resources** (panel) — Guides (gated) · Spec Sheets · Insights/Blog · Glossary · FAQ · Shows We'll Be At · What's New.
- **Right — two utility toggles + two CTAs:**
  - **Theme toggle** (☼/☾) — light/dark, auto-adapts to OS preference. *Table stakes.*
  - **Sensor-view toggle** (◉) — the signature "LiDAR / night-vision" mode that flips the whole site into a point-cloud/heat-vision view (Austin's idea, on Phil's wish list). Distinct icon and tooltip ("See the site in sensor view") so it's not confused with dark mode.
  - **Primary CTA #1 (low-commitment, persistent):** **"Start 90-Day Trial"** → `/start-a-trial`. This makes the single biggest differentiator omnipresent (P3, P4).
  - **Primary CTA #2 (high-commitment):** **"Book a Meeting"** → `/book-a-meeting` (A+ conversion).

### 2.2 The Half-Page MEGA MENU (Products) — the centerpiece

Half-viewport-height panel. Three structural columns + a featured rail. Two organizing axes per Phil's request: **by category** and **by application**.

```
╔════════════════════════════════════════════════════════════════════════════════════════════╗
║  PRODUCTS                                                                                     ║
║                                                                                              ║
║  ┌── BY CATEGORY ───────────┐  ┌── BY APPLICATION ────────┐  ┌── FEATURED ──────────────┐  ║
║  │ ▸ 2D LiDAR               │  │ ▸ AMR                    │  │  ┌────────────────────┐  │  ║
║  │ ▸ Safety LiDAR    SIL2   │  │ ▸ AGV                    │  │  │  [rotating image]  │  │  ║
║  │ ▸ 3D LiDAR              │  │ ▸ Autonomous Forklift     │  │  │  PRODUCT OF THE    │  │  ║
║  │ ▸ Solid-State LiDAR     │  │ ▸ Robotic Cleaning        │  │  │  MONTH             │  │  ║
║  │ ▸ 3D Cameras            │  │ ▸ Warehouse & Logistics   │  │  │  e.g. OLEI GS1-5   │  │  ║
║  │ ▸ 1D Rangefinders       │  │ ▸ Outdoor Autonomy        │  │  │  "Affordable       │  │  ║
║  │ ▸ 3D Mapping            │  │ ▸ Mapping / Digital Twin  │  │  │   safety has       │  │  ║
║  │ ▸ Edge Compute          │  │ ▸ Inspection              │  │  │   arrived."        │  │  ║
║  │                         │  │ ▸ Safety / Protective Fld │  │  │  [View product →]  │  │  ║
║  │ [ View all products → ] │  │ [ Browse applications → ] │  │  │  [Start a trial →] │  │  ║
║  └─────────────────────────┘  └──────────────────────────┘  │  └────────────────────┘  │  ║
║                                                              │  ◦ Auto-rotates 3 SKUs    │  ║
║  ── Each category row reveals a thumbnail strip of its SKUs on hover (visual-first) ──    │  ║
║                                                              └──────────────────────────┘  ║
║  Footer strip:  [ Download the SICK/Hokuyo Alternative Checklist ]   [ Talk to an Engineer ] ║
╚════════════════════════════════════════════════════════════════════════════════════════════╝
```

Mega-menu rules:
- **Imagery-led** (Austin: "visuals are a number-one winner; people don't read websites that well") — but each category row, on hover, surfaces a thumbnail strip of its SKUs so an engineer can jump straight to the part (serves both ICP-A visual scan and ICP-B spec-hunt).
- **Featured rail = Product of the Month**, auto-rotating 3 SKUs, pulled live from the `/product-of-the-month` CMS record. Default seed = **GS1-5** (the line's centerpiece).
- **Footer strip embeds two low-commitment CTAs** so the ~60% browser (P4) converts without leaving the menu: the primary gated checklist + "Talk to an Engineer."
- **OLEI/Percipio/MRDVS/Sintrones names do NOT appear as menu headers** — categories and applications do (P1). Supplier names appear only inside product detail pages and proof sections.

The **Applications** mega menu and **Solutions** mega menu follow the same half-page imagery pattern; Applications leads with use-case photography (anonymized robots), Solutions leads with the full-stack diagram.

### 2.3 Sticky Header Behavior

- **At top of page:** transparent/over-hero header (so the full-screen hero video reads cleanly), wordmark + nav in white.
- **On scroll-down past hero:** header condenses to a solid bar (brand blue in light mode, near-black in dark), shrinks height ~64→52px, drops shadow. Both CTAs remain visible.
- **On scroll-up:** header reappears immediately (reveal-on-scroll-up) so CTAs are always one gesture away.
- **Reduced-motion users:** no shrink animation; header simply switches to solid state (respect `prefers-reduced-motion`).

### 2.4 Mobile Navigation

- Header collapses to: **wordmark · theme toggle · sensor-view toggle · hamburger**. The **"Book a Meeting"** CTA persists as a thumb-reachable sticky bottom bar element (not hidden in the menu).
- Hamburger opens a **full-screen drawer**, accordion structure mirroring desktop:
  - Solutions → Full-Stack Perception
  - Products → (accordion) By Category / By Application / Product of the Month
  - Applications → list
  - Why Us → Custom Solutions / Manufacturing Strength / SICK Alternative / Hokuyo Alternative / 90-Day Trial / About
  - Resources → Guides / Spec Sheets / Insights / Glossary / FAQ / Shows / What's New
- **Sticky bottom action bar (mobile only):** `[ Download the Checklist ]   [ Book a Meeting ]` — pairs the low- and high-commitment CTAs for the ~60% (P4).
- Search accessible from drawer top.

### 2.5 Footer Architecture

Five-column footer + utility row, circuit-board line motif as the divider (brand).

```
┌─ PERCEPTION STACK ─┬─ APPLICATIONS ─┬─ WHY MORPHEUSTEK ─┬─ RESOURCES ──────┬─ CONNECT ─────────┐
│ 2D LiDAR           │ AMR            │ Full-Stack        │ Technical Guides  │ Book a Meeting     │
│ Safety LiDAR       │ AGV            │ Custom Solutions  │ Spec Sheets       │ Start 90-Day Trial │
│ 3D LiDAR           │ Forklift       │ SICK Alternative  │ Insights / Blog   │ Request a Quote    │
│ Solid-State LiDAR  │ Cleaning       │ Hokuyo Alternative│ Glossary          │ Talk to an Engineer│
│ 3D Cameras         │ Warehouse      │ Manufacturing     │ FAQ               │ sales@morpheusTEK  │
│ 1D Rangefinders    │ Outdoor        │   Strength        │ Shows We'll Be At │ (302) 416-5989     │
│ 3D Mapping         │ Mapping/Twin   │ Product of Month  │ What's New        │ [LinkedIn]         │
│ Edge Compute       │ Inspection     │ About             │                   │                    │
│                    │ Safety Field   │                   │                   │                    │
├────────────────────┴────────────────┴───────────────────┴───────────────────┴────────────────────┤
│  [◉ morpheusTEK — Giving Sight to Robotics]   Newsletter: [ email ▸ ]                              │
│  © MorpheusTEK · Privacy · Terms · Cookies · Accessibility · North American LiDAR & Perception      │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Footer carries the **newsletter signup** (the C-tier conversion / lead magnet, P4) and the tagline.
- Footer is the global SEO/GEO link surface — every category, application, comparison, and conversion path is reachable in one click from any page (flat link graph aids crawl + answer-engine comprehension).
- **No federal/compliance links.** Comparison links are SICK/Hokuyo only.

### 2.6 Breadcrumbs

Present on every page below home; emit `BreadcrumbList` schema (GEO).

| Page type | Breadcrumb |
|---|---|
| Product | Home › LiDAR › Safety LiDAR › OLEI GS1-5 |
| Product (multi-category) | Primary category wins the trail; e.g. Home › LiDAR › Solid-State LiDAR › OLEI VSS-50 |
| Category | Home › LiDAR › Safety LiDAR |
| Application | Home › Applications › Autonomous Forklift |
| Comparison | Home › Compare › LiDAR Alternative to SICK |
| Resource (guide) | Home › Resources › Guides › SICK/Hokuyo Alternative Checklist |
| Blog post | Home › Insights › Navigation › <post title> |
| Show | Home › Shows We'll Be At › Automate 2026 |

Home is always the root; breadcrumb labels use the keyword-bearing category name, not the supplier.

---

## 3. The Unified 3-ICP Customer Journey

**One primary journey, three branches.** All three ICPs are often the same deal at different stages (Brief §3), so the journey is a single funnel with reassurance injected where each persona needs it. The four sales stages — **Discovery → Trial/Loaner → Proposal → Close** (Training Guide §4) — sit underneath; the website's job is to feed Discovery and accelerate to Trial.

### 3.1 Entry Points → Landing Logic

Every paid/owned channel lands on a **purpose-built page that matches the message** (Austin: "create a page specific to whatever was discussed in that email or ad so the CTA is right in front of their face").

| Entry point | Typical ICP | Lands on | Why |
|---|---|---|---|
| **Cold email — "Big Wave"** (~25k, every 4–6 wks: product-of-month + show-of-month) | A / C | `/product-of-the-month` or the featured product page; show emails → `/shows/<event>` | Mirrors the email's hook; carries 90-day-trial CTA (cold-email→trial is the highest-converting path, Brief §6) |
| **LinkedIn** (organic posts + outreach, ~800 connects/mo, ~10 mtgs/mo) | A / B | Application page or `/insights/<post>`; outreach → `/book-a-meeting` | Warm, education-seeking; route to depth then meeting |
| **Trade show** (Automate, MODEX, ProMat, IROS; ~100 contacts/show) | A / B | `/shows/meet-us-at-the-booth` pre-show; post-show → application or comparison page | Pre-show sequence books booth meetings; post-show nurtures |
| **Organic search (SEO)** | A / B / C | Best-match: product, category, application, or comparison page | Intent-matched; highest conversion (active buyers) |
| **AI answer (GEO)** — ChatGPT/Claude/AI Overview citation | A / B | Home, comparison, glossary, or FAQ (the cited page) + `/llms.txt` facts | "Increasingly ChatGPT/Claude" (Brief §3); must be the cited answer |
| **Direct / brand** | any | Home | StoryBrand scroll qualifies and routes |

### 3.2 The Journey Map (one funnel, three reassurance branches)

```
                    ┌─────────────────────────────────────────────────────────┐
   ENTRY  ────────► │  LAND  (message-matched page; hero speaks to ICP-A)      │
 (email/LinkedIn/   └───────────────────────────┬─────────────────────────────┘
  show/organic/AI)                              │
                                                 ▼
                         ┌───────────────────────────────────────────────┐
                         │  ORIENT  — "Do they understand my robot?"      │
                         │  Full-stack value · application relevance ·    │
                         │  visual proof (point cloud, before/after)      │
                         └───────────────┬───────────────────────────────┘
                                         │
            ┌────────────────────────────┼────────────────────────────┐
            ▼ (A — hero)                 ▼ (B — engineer)              ▼ (C — buyer)
 ┌────────────────────┐     ┌────────────────────────┐    ┌──────────────────────────┐
 │ BUILDER /          │     │ ENGINEER / EVALUATOR    │    │ BUYER / ECONOMIC          │
 │ INTEGRATOR         │     │                         │    │ DECISION-MAKER            │
 │ Reassure:          │     │ Reassure:               │    │ Reassure:                 │
 │ • full-stack =     │     │ • specs above the fold  │    │ • cost vs SICK / fleet    │
 │   less integ. risk │     │ • SIL2 (GS1-5 only)     │    │   economics               │
 │ • prototype→prod   │     │ • ROS/SDK/driver, IP,   │    │ • single-source full stack│
 │ • customization    │     │   range/FOV/accuracy    │    │ • lead time / availability│
 │ • "we've helped    │     │ • sample point clouds,  │    │ • US-based support /      │
 │   robotics cos     │     │   test data, demo video │    │   stocking program        │
 │   customize 2D/3D" │     │ • gated datasheet PDF   │    │ • supplier stability      │
 │ Pages: solutions/  │     │ Pages: product (specs), │    │ Pages: compare/sick,      │
 │  full-stack,       │     │  resources/spec-sheets, │    │  request-a-quote,         │
 │  applications/*,   │     │  applications/*,        │    │  about/manufacturing-     │
 │  custom-solutions  │     │  glossary, FAQ          │    │  strength, 90-day trial   │
 └─────────┬──────────┘     └───────────┬─────────────┘    └────────────┬─────────────┘
           │                            │                               │
           └──────────────┬─────────────┴───────────────┬───────────────┘
                          ▼                              ▼
              ┌───────────────────────┐     ┌───────────────────────────┐
              │ LOW-COMMITMENT  (~60%) │     │ HIGH-COMMITMENT            │
              │ • Gated checklist/guide│     │ • Book a Meeting (A+)      │
              │ • Gated spec sheet     │     │ • Request a Quote          │
              │ • Talk to an Engineer  │     │ • Start 90-Day Trial /     │
              │ • Newsletter (C-tier)  │     │   Request a Sample (B)     │
              └───────────┬────────────┘     └─────────────┬─────────────┘
                          │                                │
                          ▼                                ▼
              ┌────────────────────────────────────────────────────────┐
              │  HUBSPOT: create/update contact → associate company →   │
              │  tag lead source + ICP/use case → 2–3 email nurture →   │
              │  invite to discovery call  →  SALES: Discovery → TRIAL  │
              └────────────────────────────────────────────────────────┘
```

**How each ICP is reassured, page-by-page:**

- **A (Builder/Integrator) — the hero.** Reassured on the **home page**, `/solutions/full-stack-perception`, `/applications/*`, and `/custom-solutions`: the message is "one partner for the whole stack → less integration risk, faster prototype→production, customization, and we've already helped robotics companies do exactly this." Directly answers A's objections ("are you just a distributor," "can you support us long-term," "production volumes").
- **B (Engineer) — served by depth.** Reassured on **product pages** (specs above the fold, P5), `/resources/spec-sheets` (gated datasheets), `/resources/glossary`, `/resources/faq`, and application pages' sensor-fit detail. The "Talk to an Engineer" CTA and the Custom LiDAR Requirements Worksheet are B's low-friction conversions.
- **C (Buyer) — served by reassurance.** Reassured on `/compare/sick-alternative` (fleet economics, same safety class at a fraction of price), `/about/manufacturing-strength` (turns "unknown supplier" into "serious laser-measurement manufacturer"), `/start-a-trial` (de-risks the purchase), and `/request-a-quote`. C's path emphasizes cost-down, single-source, US support, stocking.

**Critical insight baked into the IA:** because the same deal moves A→B→C, no page is single-ICP. A product page leads with A-style outcome framing in its hero band, exposes B-style specs in the middle, and closes with C-style trial/quote reassurance in the conversion band. (See template content model, §6.)

---

## 4. StoryBrand Arc → Homepage Scroll Order

Tom drives the StoryBrand approach (Brief §0); the customer is the hero, MorpheusTEK is the guide (Brief §6). The homepage scroll maps the seven SB beats to **named sections in exact order**. Section IDs below are the build anchors.

```
┌── HOMEPAGE SCROLL (top → bottom) ──────────────────────────────────────────────────────────┐
│                                                                                             │
│  SB1 CHARACTER (hero)      §hero          FULL-SCREEN HERO VIDEO (AI-gen, Higgsfield).      │
│                                           H1: "Give your robot the right LiDAR, camera, and │
│                                           perception stack to navigate, avoid obstacles,    │
│                                           and operate safely — from prototype to production."│
│                                           Sub: tagline "Giving Sight to Robotics."          │
│                                           Primary CTA: [Book a Meeting]  Secondary:         │
│                                           [Start 90-Day Trial].  ICP-A speaks here.         │
│                                                                                             │
│  SB2 PROBLEM               §problem       "Building robots that see reliably is hard."      │
│                                           3 pains (A): navigation/obstacle reliability ·    │
│                                           safety & compliance zones · integration risk &    │
│                                           cost vs. expensive legacy / long lead times.      │
│                                           (Internal/external villain = piecemeal sourcing & │
│                                           the SICK premium — framed as value, not attack.)  │
│                                                                                             │
│  SB3 GUIDE                 §guide         "MorpheusTEK is your full-stack perception        │
│                                           partner." Empathy ("we're engineers too") +       │
│                                           authority (national presence, supplier            │
│                                           coordination, US support). Advisor > vendor.       │
│                                           [Before/After point-cloud slider lives here —      │
│                                            shows we literally give sight.]                   │
│                                                                                             │
│  SB4 PLAN                  §plan          "A simple path from prototype to production."     │
│                                           3–4 steps: 1) Tell us your application →          │
│                                           2) We recommend the right stack →                 │
│                                           3) Try it free for 90 days in your environment →  │
│                                           4) Ship on time, on budget. (Mirrors Discovery→   │
│                                           Trial→Proposal→Close sales motion.)                │
│                                                                                             │
│  SB4.5 STACK PREVIEW        §stack         "One partner, the whole stack." Visual of LiDAR  │
│        (supports PLAN)                     + 3D cameras + safety + edge compute + guidance.  │
│                                           8 category cards → category hubs. (Build-on-scroll │
│                                           assembly animation: robot acquires its sensors.)   │
│                                                                                             │
│  SB5 CALL TO ACTION        §cta-primary   Direct CTA band: [Book a Meeting] (A+).           │
│        (direct)                           Transitional CTA inline throughout: [Download the │
│                                           SICK/Hokuyo Alternative Checklist] (for the ~60%).│
│                                                                                             │
│  SB6 SUCCESS               §success        "What success looks like." Outcomes for A: robot │
│                                           sees reliably, passes safety cert, hits unit cost,│
│                                           wins the OEM contract, avoids late redesigns.      │
│                                           Anonymized application proof + sample point clouds.│
│                                           Featured: GS1-5 "Affordable safety has arrived."   │
│                                                                                             │
│  SB7 AVOID FAILURE         §stakes         "Don't ship blind." The cost of getting          │
│        (the stakes)                        perception wrong: failed nav, missed safety cert,│
│                                           blown timelines, over-paying the legacy premium.  │
│                                           Reframes to the 90-day risk-free trial as the      │
│                                           zero-risk way to avoid all of it.                  │
│                                                                                             │
│  ── PROOF / CREDIBILITY ──  §proof         "Manufacturing Strength Behind the Sensing Stack" │
│        (reinforces GUIDE)                  (HUADA / Great Star — proof, NOT lead). 90-day    │
│                                           trial restated. National presence. (P1, P3)        │
│                                                                                             │
│  ── FINAL CTA ──────────── §cta-final      Repeat conversion band: [Book a Meeting] ·        │
│                                           [Start 90-Day Trial] · [Download the Checklist].   │
│                                                                                             │
│  FOOTER                    §footer         Full link graph + newsletter (see §2.5).          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- **One H1, in §hero**, carrying the ICP-A dream headline (Brief §1). All other section headers are H2 (P9).
- The **before/after point-cloud slider** sits in §guide (proves "we give sight"); the **build-on-scroll robot assembly** sits in §stack (Austin's window-company technique applied to a robot acquiring its sensor stack).
- Most-important content (hero + first CTA) is in the **first viewport** (Brief §7; transcript).

---

## 5. Conversion-Path Map (which CTA, where, for which ICP)

CTAs are scattered with varied wording for A/B split testing (Brief §7). The map below assigns the **dominant** CTA per surface, always pairing one low-commitment option for the ~60% in-between buyer (P4).

| Surface | Primary CTA (high) | Always-present low-commitment CTA (the ~60% path) | Dominant ICP |
|---|---|---|---|
| Global header | Book a Meeting | Start 90-Day Trial | A |
| Mobile sticky bar | Book a Meeting | Download the Checklist | A / C |
| Home §hero | Book a Meeting | Start 90-Day Trial | A |
| Home §cta-primary / §cta-final | Book a Meeting | Download the SICK/Hokuyo Checklist | A / C |
| `/solutions/full-stack-perception` | Book a Meeting | Talk to an Engineer | A |
| Category hubs | Request a Quote | Download category buyer's guide | A / B |
| **Product page (conversion band)** | Request a Quote / Start a Trial | **Download Spec Sheet (gated)** | B (specs) → C (quote) |
| Product page (sticky in-page bar) | Start 90-Day Trial | Talk to an Engineer | B |
| Application pages | Book a Meeting | Download the relevant guide | A / B |
| `/compare/sick-alternative` | Start 90-Day Trial ("put it next to your SICK") | Download SICK Alternative Checklist | C |
| `/compare/hokuyo-alternative` | Request a Quote | Download the Checklist | C |
| `/custom-solutions` | Talk to an Engineer | Download Custom LiDAR Requirements Worksheet | A / B |
| `/resources/guides/*` (gated) | Book a Meeting (post-download) | (the gate itself is the conversion) | A / B / C |
| `/about/manufacturing-strength` | Book a Meeting | Start 90-Day Trial | C |
| `/shows/*` | Meet Us at the Booth | Add to calendar / Newsletter | A / B |
| `/insights/*` (blog) | Book a Meeting | Download related guide · Newsletter | A / B |
| Footer (every page) | Request a Quote | Newsletter signup (C-tier) | C |

**The low-commitment path, explicitly (for the ~60%):**

```
Browser arrives (not meeting-ready)
   │
   ▼
Sees a gated lead magnet matched to context
   (product page → spec sheet; SICK page → Alternative Checklist;
    custom → Requirements Worksheet; app page → buyer's guide)
   │
   ▼  fills minimal gate: name + company + business email + primary application/use case
   │
   ▼
HubSpot: contact + company + ICP/use-case tag + lead source
   │
   ▼
2–3 email nurture ("How's the download? Here's what makes us different…")
   │
   ▼  each nurture email ends in:  → Book a Meeting  (the full-circle loop)
   │
   ▼
Re-engagement: invite to discovery call → Trial.  In-between buyer converts on their timeline.
```

Conversion **ranking** the IA optimizes for (Brief §7): A+ Book-a-Meeting › A Gated Download / Request-a-Quote › B Request-a-Sample / Trade-show meeting › C Newsletter.

---

## 6. Page-Template Inventory & Content Model

Catalog and content are **CMS-driven (Supabase)** so Phil's team self-serves a growing catalog (P8). Below: which template powers which pages, then the field model per template to brief the CMS.

### 6.1 Template → Page Map

| # | Template | Powers | Count |
|---|---|---|---|
| T1 | **Home (StoryBrand)** | `/` | 1 |
| T2 | **Solutions / Full-Stack** | `/solutions`, `/solutions/full-stack-perception` | 2 |
| T3 | **Category Hub** | `/lidar`, `/lidar/2d-lidar`, `/lidar/safety-lidar`, `/lidar/3d-lidar`, `/lidar/solid-state-lidar`, `/cameras`, `/cameras/3d-depth-cameras`, `/rangefinders`, `/mapping`, `/edge-compute` | ~10 |
| T4 | **Product Detail** | every `/products/*` (18 now, grows) | 18+ |
| T5 | **Products Index (filterable)** | `/products` | 1 |
| T6 | **Application** | every `/applications/*` | 9 |
| T7 | **Applications Hub** | `/applications` | 1 |
| T8 | **Comparison ("alternative to")** | `/compare/sick-alternative`, `/compare/hokuyo-alternative`, `/compare` hub | 3 |
| T9 | **Custom Solutions** | `/custom-solutions` | 1 |
| T10 | **Resource Hub** | `/resources`, `/resources/guides`, `/resources/spec-sheets` | 3 |
| T11 | **Gated Lead Magnet / Guide** | every `/resources/guides/*` | 5+ |
| T12 | **Blog Post** | every `/insights/*` (consistent template — Phil's req) | grows |
| T13 | **Blog Index / Topic Archive** | `/insights`, `/insights/category/*` | grows |
| T14 | **Glossary** | `/resources/glossary` | 1 |
| T15 | **FAQ** | `/resources/faq` | 1 |
| T16 | **Shows Hub + Event** | `/shows`, `/shows/<event>`, `/shows/meet-us-at-the-booth` | grows |
| T17 | **Recurring Spotlight** | `/product-of-the-month`, `/whats-new` | 2 |
| T18 | **About / Manufacturing Strength** | `/about`, `/about/manufacturing-strength` | 2 |
| T19 | **Conversion / Form** | `/book-a-meeting`, `/request-a-quote`, `/start-a-trial`, `/contact`, `/thank-you` | 5 |
| T20 | **Legal / Utility** | `/legal/*`, `/search`, `/404`, `/500` | ~7 |

### 6.2 Content Model Sketch (key templates)

**T4 — Product Detail** (the workhorse; serves B above the fold, A in framing, C in conversion):

| Field | Type | Notes |
|---|---|---|
| `name` | text | e.g., "OLEI GS1-5" |
| `slug` | text | `olei-gs1-5` |
| `category` | ref[] | many-to-many → categories (drives breadcrumb primary) |
| `applications` | ref[] | many-to-many → applications |
| `one_liner` | text | A-style outcome framing for hero band |
| `hero_media` | media | image/video/point-cloud (alt text required) |
| `key_specs` | repeater (label/value) | **renders above the fold** — FOV, range, accuracy, IP, interface, etc. (P5) |
| `safety_cert` | structured | **GS1-5 only:** Type 3 / SIL2 / PL d, scoped per-product (P6); empty/null for all others |
| `price_display` | text | "$1,950" or "Contact for pricing" |
| `availability` | enum | available / pre-order(date) / contact |
| `spec_sheet_pdf` | file (gated) | triggers HubSpot lead capture on download |
| `point_cloud_demo` | media | sample point cloud / demo video (B proof) |
| `comparison_block` | ref | optional → SICK/Hokuyo equivalent (commercial framing only; P7) |
| `related_products` | ref[] | cross-sell (e.g., 360° scanner + LR-F240) |
| `conversion_band` | component | Request a Quote / Start a Trial / Talk to an Engineer |
| `seo` | group | title, meta, H1 (one), `Product` schema, alt-text enforcement |

**T3 — Category Hub:**

| Field | Type | Notes |
|---|---|---|
| `name`, `slug`, `intro` | text | keyword-bearing intro (e.g., "2D LiDAR for robot navigation") |
| `products` | auto-query | pulls all products where `category` matches |
| `buyer_guide` | ref | the gated guide CTA for this category |
| `application_links` | ref[] | "where it's used" |
| `seo` | group | pillar-page schema (`CollectionPage`) |

**T6 — Application:**

| Field | Type | Notes |
|---|---|---|
| `name`, `slug` | text | e.g., "Autonomous Forklift" |
| `customer_pain` | rich text | from Language Guide §10 sensor-fit table |
| `sensor_fit` | repeater | which categories/products fit + why (B value) |
| `recommended_products` | ref[] | |
| `proof_media` | media | anonymized application footage (logo-stripped; approval-gated — P10) |
| `guide_cta` | ref | matched lead magnet |
| `seo` | group | targets "[sensor] for [use case]" |

**T8 — Comparison:**

| Field | Type | Notes |
|---|---|---|
| `competitor` | enum | SICK \| Hokuyo (only) |
| `value_table` | repeater | spec/price/safety rows — **supportable claims only** (P6, P10) |
| `talk_track` | rich text | "concede quality, reframe to value"; 90-day trial; fleet economics |
| `trial_cta`, `checklist_cta` | ref | C-tier conversions |
| `compliance_fields` | — | **NONE.** No China/federal/DoD content (P7) |

**T11 — Gated Lead Magnet:**

| Field | Type | Notes |
|---|---|---|
| `title`, `slug`, `summary` | text | |
| `asset_pdf` | file | the download |
| `gate_form` | component | name + company + business email + primary application (min); optional: phone, title, robot type, timeline, volume, current supplier |
| `target_icp` | enum[] | A / B / C (HubSpot tagging) |
| `hubspot_workflow` | ref | nurture sequence to trigger |
| `seo` | group | `thank-you` redirect |

**T16 — Shows:** `event_name`, `dates`, `location`, `booth`, `hero`, `booth_form` (Meet-Us-at-the-Booth → HubSpot pre-show sequence), `related_products`.

**T12 — Blog Post:** `title`, `slug`, `topic`, `header_image` (alt required), `body` (rich), `author`, `related_products`, `related_guide_cta`, `Article` schema, one H1.

All form templates (T19) and all gates (T11) write to **HubSpot** (create/update contact → associate company → tag lead source + ICP/use case → trigger nurture → assign owner). High-intent forms (quote/sample) capture the extended field set (application, sensor type, range, FOV, interface, environment, safety, target cost, volume, timeline).

---

## 7. Accessibility & Responsive IA Notes

Target: WCAG 2.2 AA, 99+ Lighthouse including a11y (Brief §8, §11). The IA must be operable without a mouse and legible across themes (light/dark + the sensor-view toggle).

### 7.1 Mega Menu — Keyboard & Focus

- **Trigger buttons** are `<button aria-expanded>` with `aria-controls` pointing at the panel; not hover-only. Open on Enter/Space and on hover, but **never require hover** (P-a11y).
- **Focus order inside the open mega menu:** By-Category column (top→bottom) → By-Application column → Featured rail (image link → product link → trial link) → footer-strip CTAs. Logical left-to-right, top-to-bottom — matches visual order.
- **Esc** closes the panel and returns focus to the trigger. **Tab** out of the last item closes the panel and moves to the next header item (no focus trap on a navigation menu).
- **Arrow keys** move within a column; Up/Down within a list, Left/Right between columns (APG menu/disclosure pattern).
- Hover-reveal SKU thumbnail strips also have a **keyboard equivalent**: focusing a category row expands its strip; the strip's links are in the tab order.
- Every menu image has meaningful `alt`; the rotating featured product announces changes politely (`aria-live="polite"`) but pauses rotation on focus/hover and respects `prefers-reduced-motion`.

### 7.2 Global Focus Order (per page)

`Skip-to-content link` (first focusable) → header wordmark → nav triggers → theme toggle → sensor-view toggle → trial CTA → meeting CTA → **main content (H1 first)** → in-page CTAs in reading order → footer. Visible focus ring on **every** interactive element, with a 3:1 contrast ring that works in light, dark, **and** sensor-view themes.

### 7.3 Theme & Sensor-View a11y

- **Theme toggle** persists choice and honors OS `prefers-color-scheme`.
- **Sensor-view toggle** is decorative/experiential — it must **not** reduce text contrast below AA. Implementation rule: sensor-view restyles backgrounds/imagery (point-cloud/heat aesthetic) but text layers keep AA contrast; provide an obvious "return to standard view" affordance, and disable/auto-revert under `prefers-reduced-motion` for users sensitive to the visual shift. The toggle has a clear text label/tooltip, not icon-only.
- All three view states are tested for contrast independently.

### 7.4 Responsive Breakpoints (PROPOSED)

| Breakpoint | Range | Nav behavior | Layout |
|---|---|---|---|
| `xs` | <480px | Hamburger drawer; sticky bottom action bar (`Download` + `Book a Meeting`) | 1-col; specs as stacked label/value |
| `sm` | 480–767px | Hamburger drawer | 1-col, larger media |
| `md` | 768–1023px | Condensed top nav; mega menus become tap-accordions; CTAs collapse to "Book a Meeting" + overflow | 2-col product/category grids |
| `lg` | 1024–1439px | Full top nav + half-page mega menus; both CTAs visible | 3-col grids; product specs side-by-side with media |
| `xl` | ≥1440px | Full nav; mega menu at fixed half-viewport height | 4-col category grids; full StoryBrand canvas |

Responsive IA rules:
- **Product page specs stay above the fold at every breakpoint** — on `xs/sm` they sit immediately under the product title/media, before marketing copy (P5).
- **The 90-day trial CTA is reachable in ≤1 interaction on every breakpoint** (header on desktop, sticky bar / drawer on mobile) (P3).
- **Breadcrumbs** collapse to "‹ Parent" on `xs` but keep full `BreadcrumbList` schema in markup.
- **Hero video** serves a poster image + reduced asset on small/low-bandwidth and respects `prefers-reduced-motion` (poster only); LCP target protected.
- Touch targets ≥44×44px; tap-accordion mega menus on `md` and below.

---

## 8. Open Decisions to Confirm with Phil/Tom

These are the (PROPOSED) calls beyond the brief that need a yes:

1. **Slug architecture** — flat `/products/*` + keyword category paths `/lidar/safety-lidar` (recommended for SEO/GEO + multi-category products). Confirm.
2. **`/llms.txt`** GEO asset (curated, commercial-only facts AI should repeat). Confirm inclusion.
3. **Comparison hub limited to SICK + Hokuyo only** (no Hesai/Vanjee/RoboSense/Ouster public pages, per P7). Confirm this is the public boundary.
4. **Sensor-view toggle** as a first-class header control alongside theme toggle. Confirm it ships at launch vs. fast-follow.
5. **Single Solutions page vs. a hub + children** — currently one flagship `/solutions/full-stack-perception` under a thin `/solutions` hub. Confirm the catalog won't soon need multiple "solution" bundles (e.g., navigation kit, safety kit) that would justify expanding the hub.
6. **Breakpoint set** (xs/sm/md/lg/xl above) — confirm against the final design system from Stackked's creative team.

*All other IA decisions trace directly to the Ground-Truth Brief and discovery transcripts and require no further input to build against.*