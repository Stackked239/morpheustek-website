# Technical Architecture, CMS, Integrations & Delivery

> MorpheusTEK website — detailed plan section. Part of the master build plan.

---

I now have full ground truth. I have all the technical signals I need (Vercel on Stackked's account, preview→promote, GitHub + how-to.md, Supabase DB for spec sheets, HubSpot create contact/account/opportunity + 2-3 emails, GA4 owner→Phil + duplicate-tracking audit + transparency dashboard, 99+ Lighthouse, Higgsfield hero video, edit-via-Claude-desktop, ~2,000 visitors/mo claimed). Let me write the deliverable section.

I'll produce the engineer-ready plan now.

---

# Section 6 — Technical Architecture, CMS, Integrations & Delivery

> **Scope of this section.** This is the engineer-ready build plan for the MorpheusTEK site: the runtime stack, the content/CMS backend that lets a non-developer run the catalog, the HubSpot lead-engine wiring, GA4 + a transparency dashboard, the GitHub→Vercel delivery workflow, the performance budget to hit a 99+ Lighthouse score, and the search/security plumbing underneath it. SEO/GEO *content and keyword strategy* lives in the SEO section; here we build the rails it runs on. Brand, IA, and page design live in their own sections; this section makes those sections *buildable, fast, and maintainable by any new-age developer.*
>
> Judgment calls beyond the brief are marked **(PROPOSED)** so Austin and Phil can confirm.

---

## 6.0 Architecture at a Glance

```
                              ┌───────────────────────────────────────────────┐
                              │                  VISITOR                       │
                              │   (Skippy the Robotics Engineer, on a phone    │
                              │    at MODEX or a laptop after a Big-Wave email)│
                              └───────────────────┬───────────────────────────┘
                                                  │  HTTPS (HTTP/3, TLS 1.3)
                                                  ▼
                ┌─────────────────────────────────────────────────────────────────┐
                │                  VERCEL EDGE NETWORK (global CDN)                 │
                │  • Static HTML/CSS/JS (SSG)   • ISR cache for catalog/blog        │
                │  • next/image AVIF·WebP optimizer   • Edge middleware (bot/geo)   │
                └───────┬──────────────────────────────────────────┬──────────────┘
                        │ cache HIT (most traffic)                  │ cache MISS / dynamic
                        ▼                                           ▼
            ┌────────────────────┐                  ┌───────────────────────────────────┐
            │  Pre-rendered page │                  │  Next.js App Router (RSC + Routes) │
            │  (instant, 0 origin│                  │  • Server Components fetch content │
            │   round-trip)      │                  │  • Route Handlers = serverless API │
            └────────────────────┘                  └───────┬───────────────┬───────────┘
                                                            │               │
                                          ┌─────────────────▼──┐   ┌────────▼────────────┐
                                          │  SUPABASE          │   │  HUBSPOT            │
                                          │  • Postgres (CMS)  │   │  • Contacts/Co/Deals│
                                          │  • Storage (PDFs,  │   │  • Forms API        │
                                          │    point-cloud mp4)│   │  • Workflows/nurture│
                                          │  • Auth (admin)    │   │  (system of record) │
                                          │  • RLS access ctrl │   └─────────────────────┘
                                          └────────────────────┘
                        ▲                                   ▲                    ▲
        ┌───────────────┴──────────┐        ┌───────────────┴───────┐  ┌─────────┴──────────┐
        │  ADMIN / CONTENT EDITOR  │        │  GA4 + Search Console  │  │  Higgsfield (assets)│
        │  Phil · Tom · Greg       │        │  → Transparency        │  │  hero video, robot  │
        │  (web admin + Claude     │        │     Dashboard          │  │  "eyeball", angles  │
        │   desktop sessions)      │        │  (Phil/Tom read-only)  │  │  (build-time, not   │
        └──────────────────────────┘        └────────────────────────┘  │   runtime dep.)     │
                                                                         └─────────────────────┘
```

**One-paragraph summary.** The site is a **Next.js (App Router) + React + TypeScript + Tailwind** application deployed on **Vercel** (Stackked's account while on retainer; client owns the GitHub repo and IP). Product, blog, and section content live in **Supabase** (Postgres + Storage + Auth), so Phil's team self-serves the growing catalog. Every gated form and CTA routes through a serverless API to **HubSpot**, which remains MorpheusTEK's system of record and runs the 2–3-email nurtures. Analytics flow into **GA4 + Search Console**, surfaced in a lightweight **transparency dashboard** for Phil/Tom. The whole thing is built and shipped through a **branch → preview → promote-to-production** workflow, and is engineered against a hard **99+ Lighthouse budget**.

---

## 6.1 Stack Recommendation & Justification

### 6.1.1 The stack

| Layer | Choice | Version target (PROPOSED) |
|---|---|---|
| Framework | **Next.js, App Router** (React Server Components) | 15.x |
| UI runtime | **React** | 19.x |
| Language | **TypeScript** (strict mode) | 5.x |
| Styling | **Tailwind CSS** + CSS variables for theme tokens | 4.x |
| UI primitives | **shadcn/ui** (Radix under the hood) — accessible, unstyled, owned in-repo (not an npm black box) | latest |
| Animation | **Framer Motion** for build-on-scroll / before-after slider; CSS for micro-interactions | latest |
| Content/data | **Supabase** (Postgres, Storage, Auth) | hosted |
| Forms/CRM | **HubSpot** via Forms API + serverless route | existing portal |
| Hosting/CDN | **Vercel** | Pro (Stackked) |
| Analytics | **GA4** + Google Search Console; `@vercel/analytics` + `@vercel/speed-insights` for RUM | — |
| Spam/abuse | **Cloudflare Turnstile** (invisible) + Upstash rate limiting | — |
| Email validation | lightweight MX/disposable-domain check in the form route | — |

This is exactly the stack the calls and brief converged on: Phil explicitly rejected WordPress/Squarespace ("getting hacked… DDoS'd… old and outdated infrastructure"), Tom restated the requirement as "a modern stack… any developer worth his salt is going to look at this and go, oh yeah, I know exactly where… here's all the code," and the brief codifies **Next.js + React + TypeScript + Tailwind on Vercel** as the implied stack (§11).

### 6.1.2 Why this satisfies "custom, modern, maintainable, not WordPress, 99+ Lighthouse"

- **"Not WordPress / not boutique."** No PHP, no plugin-server to patch, no MySQL host to keep alive. The app is a static-first React codebase plus a managed Postgres. Phil's stated fear — "I don't want to have a boutique website that nobody else can work on" — is answered by the single most common modern web stack on the market. Next.js + Tailwind is what new-age developers (and AI coding tools like Claude/Cursor) are fluent in; onboarding a replacement dev is a normal hire, not a rescue mission.
- **"Maintainable by any new-age dev."** Conventional file-based routing, typed data access, and a `how-to.md` (see §6.5) mean a competent React developer can orient in an afternoon. TypeScript strict mode turns "if I get hit by a bus" risk into compiler-enforced contracts — the data shapes are documented in the types themselves.
- **"99+ Lighthouse."** SSG/ISR means most pages ship as pre-rendered HTML from Vercel's edge with near-zero origin work — the single biggest lever on the Performance score. React Server Components keep JavaScript off the client for content that doesn't need interactivity. `next/image` and `next/font` close the two largest remaining Lighthouse gaps (image weight, font CLS). The current site's specific failings — **no alt text, broken/over-loaded H1/H2 structure, weak performance** (brief §8, May 28 call) — are structurally prevented here (see §6.6, §6.7).
- **Security posture.** The attack surface that got their WordPress hacked simply doesn't exist: there's no long-running origin server executing arbitrary plugin code. Static assets are served from a CDN; the only dynamic code is a handful of audited serverless routes (see §6.8).

### 6.1.3 Rendering strategy (performance + SEO/GEO)

The site is **static-first**; we only reach for dynamic rendering where it earns its keep.

| Route / surface | Strategy | Why |
|---|---|---|
| Home, About, Solutions, Applications, Manufacturing-Strength, comparison/landing pages | **SSG** (static at build) | Pure marketing/IA content; fastest possible; perfect Lighthouse; crawler- and LLM-friendly raw HTML |
| Product detail (`/products/[slug]`), Category pages | **ISR** (`revalidate`, e.g. 300s) + **on-demand revalidation webhook** | Catalog is DB-backed and *growing* (Phil wants it scalable). Pages stay static/fast, but when Phil edits a product the Supabase webhook fires `revalidatePath()` so the change is live in seconds without a redeploy |
| Blog post (`/blog/[slug]`), Resource library | **ISR** + on-demand revalidation | Same: SEO/GEO content authored by the client must publish instantly but serve as static HTML |
| "Product of the Month", "Shows We'll Be At", "What's New" | **ISR** (short revalidate) or static section fed by DB | Rotates frequently; must be editable without a dev |
| Form submission, gated-download unlock, quote/sample intake | **Route Handlers** (serverless functions, Node runtime) | Need secrets (HubSpot token, Supabase service key); never run on the client |
| Bot/geo middleware, Turnstile pre-check, redirects | **Edge middleware** | Runs at the CDN edge before the request hits origin — fast, and keeps abuse off the functions |
| `sitemap.xml`, `robots.txt`, `llms.txt`, RSS | Generated at build (with ISR for sitemap so new products/posts appear) | See §6.7 |

**GEO note (rails, not strategy):** because content pages render to **complete, semantic HTML at the edge** — not hydrated-from-JSON client shells — the facts the SEO section wants AI engines to repeat (NA perception partner; 2D/3D LiDAR + 3D cameras + safety + edge compute; exclusive NA OLEI distributor; 90-day trial — brief §8) are present in the raw document an LLM crawler fetches. That is the single most important *technical* enabler of GEO, and SSG/ISR gives it to us for free.

---

## 6.2 Content Model & CMS

### 6.2.1 The decision: Supabase (Postgres + Storage + Auth) as the backend

**Decision: use Supabase as the database, file store, and admin auth — with a custom, on-brand admin UI built into the Next.js app (route group `/admin`).** This is the option the brief and calls point to directly ("Database required (Supabase recommended)… for spec sheets / software / downloadable assets and scalable product catalog + blog," §11; Austin on the call: "you'll need a database… to be scalable").

**Why Supabase over a headless/git-based CMS (Sanity, Payload, Contentful):**

| Criterion | Supabase (chosen) | Sanity / Contentful (headless SaaS) | Payload (self-host) | Git-based (MDX in repo) |
|---|---|---|---|---|
| Spec-sheet **PDF / point-cloud video storage** (the explicit requirement) | ✅ First-class object Storage with signed URLs + RLS — *one system* for data **and** the 50MB+ assets Austin flagged | Asset CDN exists but you're now running DB-less; gated-PDF access control is awkward | Needs its own DB + storage adapter | ❌ Large binaries don't belong in git |
| **Gated-download access control** (core to the lead engine) | ✅ Row-Level Security + short-lived signed URLs is purpose-built for this | Token gymnastics | Possible, more glue | Manual |
| Non-dev editing ("if I get hit by a bus") | ✅ Custom admin + Supabase Studio fallback | ✅ Polished studio | ✅ Decent admin | ❌ Editing MDX/Git is dev-only |
| Cost on a small client | ✅ Generous free/low tier, predictable | $$ seat/usage pricing scales against a small team | Hosting + DB cost | Free |
| **Edit-via-Claude-desktop** (Austin's promised workflow) | ✅ Claude can run typed SQL/MCP against Supabase *and* edit code in the repo — one mental model | Two systems to reason about | Possible | Code-only |
| Vendor lock-in / IP ownership ("client owns it") | ✅ Plain Postgres — fully portable, dumpable, self-hostable | Proprietary content lake | OSS but coupled | Fully owned |
| Query power for filtered catalog (by category, FOV, range, safety) | ✅ Real SQL + indexes | Limited query language | ✅ | ❌ |

A headless CMS would give a slightly more polished editing studio out of the box, but it **splits the world into two systems** (content lake + separate file CDN + separate access logic for gated PDFs) and adds per-seat SaaS cost on a deliberately lean team. Supabase keeps **data, files, and access control in one place**, is plain Postgres (so the client truly owns and can export it), and is the one backend that makes Austin's "edit via Claude desktop" promise coherent — Claude touches *one* database and *one* repo. **(PROPOSED)** We ship a lightweight in-app `/admin` for the day-to-day editors and keep Supabase Studio as the power-user/Greg fallback.

### 6.2.2 Schema

Conventions: `snake_case` columns, UUID PKs, `created_at`/`updated_at` timestamps on every table, `slug` unique per content type, soft `status` enum (`draft|published|archived`) so editors can stage. Junction tables give many-to-many (a product serves many applications; a resource gates many products).

```
┌──────────────┐        ┌────────────────────┐        ┌───────────────┐
│  categories  │◄──────┤      products       ├───────►│ applications  │
└──────────────┘  1   N │  (the catalog)      │ N    N └───────────────┘
                        └─────────┬───────────┘  (product_applications)
                                  │ 1
                                  │ N
                        ┌─────────▼───────────┐        ┌───────────────┐
                        │   product_assets    │        │   resources    │
                        │ (spec PDFs, images, │        │ (lead magnets, │
                        │  point-cloud video) │        │  gated PDFs)   │
                        └─────────────────────┘        └──────┬────────┘
                                                              │ N  N
                        ┌─────────────────────┐               │ (resource_products)
                        │     blog_posts      │        ┌──────▼────────┐
                        └─────────────────────┘        │  submissions   │  ← every form/CTA
                        ┌─────────────────────┐        │ (lead capture, │     hit lands here
                        │       shows         │        │  HubSpot sync) │     as a durable log
                        │ ("Shows We'll Be At")│       └────────────────┘
                        └─────────────────────┘
            ┌─────────────────────┐   ┌──────────────────────┐
            │  featured_content   │   │      site_settings    │
            │ ("Product/Show of   │   │ (toggles, hero copy,  │
            │  the Month" slots)  │   │  contact info)        │
            └─────────────────────┘   └──────────────────────┘
```

**`products`** — the heart of the catalog (every SKU in brief §4):

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | e.g. `olei-gs1-5` → `/products/olei-gs1-5` |
| `name` | text | "OLEI GS1-5" |
| `category_id` | fk → categories | 2D LiDAR · Safety LiDAR · 3D LiDAR · Solid-State · 3D Cameras · 1D Rangefinder · 3D Mapping · Edge Compute |
| `one_liner` | text | the above-the-fold hook (engineer reads specs fast) |
| `supplier` | enum | `OLEI · Percipio · MRDVS · Sintrones` — **flagged so we can keep supplier names off the homepage and de-emphasized in UI** (brief HARD RULE) |
| `list_price` | numeric **nullable** | many are "Contact for pricing" → null renders a "Request a Quote" CTA |
| `price_display` | enum | `list · contact · preorder` (drives UI + CTA) |
| `availability` | enum | `available · preorder · contact` (e.g. MRDVS S10 Ultra = preorder Q2 2026) |
| `key_specs` | jsonb | ordered array of `{label, value}` — renders the **above-the-fold spec block in one viewport** (Phil's hard requirement); flexible across wildly different SKUs |
| `full_description` | rich text (markdown) | |
| `certifications` | jsonb **nullable** | **GS1-5 only:** `Type 3 (IEC 61496)`, `SIL2/SILCL2`, `Cat 3 / PL d`, `Class 1 laser`. Stored *per product* so the precise-certification HARD RULE is enforced by the data model — a product without certs literally cannot render a safety badge |
| `has_90day_trial` | boolean | true for OLEI products; drives the trial badge — *the single biggest differentiator*, featured prominently |
| `comparison_notes` | jsonb nullable | defensible, supportable competitor framing (e.g. GS1-5 5m vs nanoScan3 3m). **No price-trash; only what's supportable** |
| `seo_title`, `seo_description`, `og_image_id` | | per-page SEO, handed to the SEO section's plumbing |
| `is_featured`, `sort_order`, `status` | | featured drives mega-menu/Product-of-the-Month |

**`categories`** — `id, slug, name, description, icon, sort_order, seo_*`. Powers the mega menu and `/products/category/[slug]` ISR pages.

**`applications`** — `id, slug, name, description, hero_asset_id, icp_focus` (A/B/C), `seo_*`. The robot-outcome verticals from the language guide (Warehouse AMR/AGV, autonomous forklift, cleaning robot, outdoor mobile, inspection, mapping…). Many-to-many with products via `product_applications`.

**`resources`** (lead magnets / gated assets) — `id, slug, title, description, type` (`comparison_checklist | selection_guide | spec_pack | worksheet | pointcloud_pack | whitepaper`), `file_path` (Supabase Storage key), `is_gated` (bool), `icp_target` (A/B/C), `hubspot_form_type`, `nurture_sequence_id`, `seo_*`. Seeded with the brief's named magnets — the **SICK/Hokuyo Alternative Comparison Checklist** (primary), LiDAR Selection Guide, Safety-LiDAR Buyer's Guide, Custom LiDAR Requirements Worksheet, Sample Point-Cloud Pack. Linked to relevant products via `resource_products`.

**`blog_posts`** — `id, slug, title, excerpt, body` (markdown), `cover_asset_id`, `author`, `tags[]`, `published_at`, `reading_time`, `seo_*`, `status`. Custom templating so every post renders identically (Tom: "automatically be in the same shape and format for every single blog"). SEO/GEO is the primary purpose (brief §11) — long-form, keyword-rich.

**`shows`** ("Shows We'll Be At") — `id, name, slug, venue, city, start_date, end_date, booth_number, description, hero_asset_id, cta_form_type` (`booth_meeting`), `is_upcoming`, `status`. Seeded with Automate (late June). Each show renders a **"Meet Us at the Booth"** form → HubSpot pre-show sequence (brief §9).

**`featured_content`** — slot-based: `slot` (`product_of_month | show_of_month | application_spotlight | custom_solution | whats_new`), `ref_table`, `ref_id`, `active_from`, `active_to`. Lets Phil rotate the homepage features and keeps them in sync with the LinkedIn + Big-Wave cadence (brief §9) without touching code.

**`product_assets`** — `id, product_id, type` (`image | spec_pdf | pointcloud_video | datasheet | drawing`), `storage_path`, `alt_text` (**required, non-null for images** — directly fixes the current site's missing-alt-text failure), `caption`, `sort_order`. Point-cloud/SLAM videos Phil is sourcing from suppliers live here.

**`submissions`** — durable log of every form/CTA (see §6.3): `id, form_type, payload jsonb, resource_id nullable, hubspot_contact_id, hubspot_deal_id, lead_source, icp_guess, status, error nullable, created_at`. This is our **audit trail** — if HubSpot sync ever fails, the lead is never lost; we replay from here.

**`site_settings`** — global toggles and editable strings (hero copy variants for A/B testing, contact `sales@morpheustek.com` / `(302) 803-5357`, social links, **LiDAR-view toggle on/off**, feature flags).

### 6.2.3 Gated-asset storage & access control

```
GATED DOWNLOAD FLOW (no PDF URL is ever guessable or public)

 Visitor clicks "Download the SICK/Hokuyo Comparison Checklist"
        │
        ▼
 [Form modal]  name · company · business email · primary application   (+ Turnstile)
        │  POST /api/lead
        ▼
 Route Handler (server):
   1. Verify Turnstile token, rate-limit, reject disposable email
   2. Insert row → submissions (durable log)
   3. Create/update HubSpot contact + company + deal (see §6.3)
   4. Generate a SHORT-LIVED Supabase signed URL for resources.file_path
      (e.g. 5-min expiry, single resource)        ← Storage bucket is PRIVATE
   5. Return { downloadUrl } to the client
        │
        ▼
 Browser auto-starts the download from the signed URL; link dies in 5 min.
```

- **Storage buckets are private by default.** `spec-sheets/`, `lead-magnets/`, `software/` are non-public; `product-images/` and `hero-media/` are public (served via CDN + `next/image`). Gated files are *never* reachable by URL guessing — access is minted server-side only after the form succeeds.
- **Row-Level Security (RLS)** on every table: anon role can `SELECT` only `status = 'published'` content; writes require the authenticated admin role; the `submissions` table is write-only for anon (insert via the service-role route) and read-restricted to admins. **(PROPOSED)** This RLS posture is the default; we'll confirm exact roles with Greg during handover.
- **Alternative for very large media (R2):** Supabase Storage covers the brief's needs; *if* supplier point-cloud video libraries grow large, we can offload heavy video to **Cloudflare R2** (zero egress fees) behind the same signed-URL pattern. We default to Supabase Storage and treat R2 as a documented escape hatch, not day-one scope **(PROPOSED)**.

---

## 6.3 HubSpot Integration

HubSpot is MorpheusTEK's **system of record** (brief §6; Tom on the call: "it would have to create the contact, create the account, create an opportunity… and then if it automatically sends them two or three emails in a row"). Every conversion on the site flows through one hardened serverless route into HubSpot.

### 6.3.1 Architecture & data flow

**Pattern decision:** we **do not** embed HubSpot's native form iframes (they tank Lighthouse and break the brand). We render our own on-brand React forms and POST to a **Next.js Route Handler** that talks to HubSpot's **Forms API** (for form-submission + tracking-cookie association) and the **CRM API** (for explicit contact/company/deal creation and association). This keeps the front end fast and on-brand while still firing HubSpot's workflow triggers.

```
ASCII DATA FLOW — site → HubSpot

  ┌───────────────┐   submit (JSON)   ┌──────────────────────────────────────┐
  │ Branded React │ ────────────────► │  POST /api/lead   (serverless, Node)  │
  │ form + CTA    │                   │                                        │
  │ + hutk cookie │ ◄──── 200 / URL ─ │  step 1  validate (Turnstile, email,  │
  └───────────────┘                   │          honeypot, rate-limit)         │
                                      │  step 2  write submissions row         │
                                      │  step 3  HubSpot Forms API submit      │
                                      │          (carries hutk → attribution)  │
                                      │  step 4  CRM: upsert Contact           │
                                      │  step 5  CRM: upsert Company,          │
                                      │          associate Contact↔Company     │
                                      │  step 6  (high-intent only) create     │
                                      │          Deal + Task, assign owner     │
                                      │  step 7  set props: lead_source, ICP,  │
                                      │          asset, application, use_case   │
                                      │  step 8  gated? mint signed URL        │
                                      └───────────────┬──────────────────────┘
                                                      │
                              ┌───────────────────────▼───────────────────────┐
                              │                 HUBSPOT                          │
                              │  Contact ── associated ── Company                │
                              │     │                                            │
                              │     └── (high-intent) Deal + Task → Owner        │
                              │                                                  │
                              │  Workflow triggers on property/enrollment:       │
                              │   • download → 2–3 email cost-down nurture →     │
                              │       invite to book a technical discovery call  │
                              │   • show signup → pre-show email sequence        │
                              │   • quote/sample → high-priority sales task      │
                              └──────────────────────────────────────────────────┘
```

**Lead-source & ICP tagging.** The route stamps HubSpot properties on every contact:
- `lead_source` — derived from UTM params + referrer (Big-Wave email, LinkedIn, organic/GEO, trade show, direct). Closes Tom's exact gap: "we had 2,000 visitors… where did that come from? No idea."
- `icp_segment` — inferred from the form context and answers: **ICP-A Builder/Integrator** (default/primary), **ICP-B Engineer**, **ICP-C Buyer**. Heuristic from form type + title/robot-type/inquiry fields; never blocks submission. (Compliance/federal flags from §5 are **internal-only** and **never collected or shown publicly**.)
- `asset_downloaded`, `primary_application`, `robot_type`, `current_supplier`, `inquiry_type` — captured where the form asks.

**Owner assignment.** Round-robin or territory-based owner assignment is configured **in HubSpot** (workflow/rotation), not hard-coded in our route — so MorpheusTEK can re-route ownership without a code change. High-intent deals (quote/sample) additionally create a **Task** for the assigned owner. **(PROPOSED)** Default to HubSpot's native round-robin; confirm owner rules with Phil/Tom.

**Gated-download unlock.** As in §6.2.3: the signed URL is minted **after** steps 2–7 succeed. The download is the *reward* for the capture; the contact already exists in HubSpot before the file is in their hands.

**Quote / sample → high-priority deal.** These forms create a **Deal** (pipeline stage = Discovery), a high-priority **Task**, and tag `inquiry_type = quote|sample`. This wires the site directly into the **Discovery → Trial/Loaner → Proposal → Close** sales motion, and the **sample request ties to the 90-day risk-free trial** — the brief's single biggest conversion engine.

**Reliability.** HubSpot is called server-side with the token never exposed to the browser. Every attempt is logged to `submissions`; on a HubSpot 5xx/timeout we still return success to the user (they got their download/confirmation), enqueue a retry, and never drop the lead. (Optional: a Vercel Cron replays failed `submissions` rows — see §6.4 dashboard infra.)

### 6.3.2 Fields per form type

Minimum gate everywhere (Tom's hard rule, May 28): **name · company · business email · primary application/use case**. High-intent forms capture more (brief §7).

| Form type | Conversion rank (brief §7) | Required fields | Optional / progressive | HubSpot action | Workflow |
|---|---|---|---|---|---|
| **Book a meeting / discovery call** | **A+** | name, company, business email | phone, title, robot type, timeline | Contact+Company; **Deal** (Discovery) + Task | meeting-confirmation; owner alert |
| **Gated technical download** (e.g. SICK/Hokuyo checklist) | **A** | name, company, business email, primary application | phone, title, product interest | Contact+Company; tag asset+ICP | **2–3 email cost-down nurture → book a call** |
| **Request a quote / product rec** | **A** | name, company, business email, application | sensor type, range, FOV, interface, environment, safety req, target cost, volume, timeline | Contact+Company; **Deal** + **high-pri Task** | quote-ack; sales alert |
| **Request a sample / eval unit** (→ 90-day trial) | **B** | name, company, business email, application | robot type, current supplier, timeline, volume | Contact+Company; **Deal** (Trial) + **high-pri Task** | trial-logistics; owner alert |
| **Meet us at the booth** (Shows) | **B** | name, company, business email | title, which show | Contact+Company; tag `show_id` | **pre-show email sequence** |
| **Newsletter signup** | **C** | business email | name, company | Contact; tag newsletter | welcome; light nurture |
| **"Ask an Engineer"** (ICP-B) | A/B | name, company, business email, question/application | robot type, ROS version, interface | Contact+Company; **Task** to technical owner | engineer-followup |

Forms are **multi-variant for A/B testing** (Free Estimate / Get a Quote / Start a Trial / Talk to an Engineer / Book a Meeting / Download the Guide — brief §7), with the wording driven by `site_settings` so Tom can split-test copy without a deploy.

---

## 6.4 Analytics & Transparency Dashboard

The recurring theme across both calls: **MorpheusTEK has near-zero analytics transparency.** Phil/Tom hear "we moved from rank 9 to rank 3" and "2,000 visitors/month" with no way to validate it; Tom: "Is that unique visitors? Is that one bot searching 300 pages? I have no idea." This subsection fixes ownership, integrity, and transparency.

### 6.4.1 GA4 setup, ownership migration & duplicate-tracking audit

1. **Ownership migration to Phil.** Current owner is Sean; Greg also has access (calls). We move **owner-level** access to Phil (his name/email), then he grants admin to Austin/Tom. Per Austin's own advice on the call, **Stackked does not take owner access** ("if I get hit by a bus, it's going to be hard for you to get into your account"). This directly executes the brief's "moving owner access to Phil" (§8).
2. **Duplicate-tracking audit** (brief §8; Austin: "make sure there's no duplicate counting… you put your GA tag in two places… double counting your traffic"). Concrete checks on the **current** site before cutover:
   - Scan the deployed HTML/GTM container for **two GA4 tags / two `gtag` configs / duplicate Measurement IDs**.
   - Confirm `page_view` isn't fired twice (hard-coded snippet **and** GTM tag).
   - Validate **unique-visitor** counts against the claimed ~2,000/mo and segment bots vs. humans, so Phil gets a *true* baseline (answers Tom's exact question).
   - Document findings; correct on the new build.
3. **New-site GA4 instrumentation.** Single GA4 property, one Measurement ID, loaded **after interactive** so it never costs Lighthouse points (`@next/third-parties` GoogleAnalytics or a deferred loader). Consent-aware. RUM via `@vercel/speed-insights` to keep Core Web Vitals honest in the field.

### 6.4.2 Event & conversion tracking mapped to A+/A/B/C

Every CTA fires a typed GA4 event; conversions mirror the brief's ranked weighting (§7) so the dashboard reflects what the *business* values, not just clicks.

| GA4 event | Trigger | Mapped conversion | Value weight (PROPOSED) |
|---|---|---|---|
| `book_meeting_submit` | discovery-call form success | **A+** | 100 |
| `gated_download` | gated asset unlocked | **A** | 60 |
| `quote_request` | quote/product-rec form | **A** | 60 |
| `sample_request` | sample/eval (→ trial) | **B** | 40 |
| `booth_meeting_request` | "Meet us at the booth" | **B** | 40 |
| `newsletter_signup` | newsletter form | **C** | 10 |
| `cta_click` (with `cta_variant`) | any CTA button | — (feeds A/B test) | — |

`cta_variant` on `cta_click` powers the **A/B split-test readout** (which wording converts best — brief §7). The same events post to HubSpot's tracking via the `hutk` association, so on-site behavior and CRM lifecycle reconcile.

### 6.4.3 Transparency / rankings dashboard for Phil & Tom

A lightweight, read-only dashboard so Phil/Tom can self-validate rankings and traffic (Tom: "something so we can validate that… I know exactly how we stand today"). **(PROPOSED)** ship as a protected route in the same Next.js app (`/dashboard`, behind Supabase auth) — no third tool to learn, no extra subscription.

```
┌────────────────────────────────────────────────────────────────────────┐
│  MorpheusTEK — Traffic & Visibility           (read-only · Phil · Tom)   │
├──────────────────────────┬─────────────────────────────────────────────┤
│  TRUE UNIQUE VISITORS     │  CONVERSIONS (weighted)                      │
│  1,940 /30d  (▲ vs prev)  │  A+ meetings: 12  ·  A downloads: 88         │
│  bots filtered: 312       │  A quotes: 9  ·  B samples: 6  ·  C news: 41 │
│  Source: GA4              │  Source: GA4 events + HubSpot                │
├──────────────────────────┼─────────────────────────────────────────────┤
│  TOP ORGANIC QUERIES      │  KEYWORD RANK MOVERS (high-intent set)       │
│  "lidar alternative sick" │  "SIL2 safety lidar for AMR"  #14 ▲6         │
│  "safety lidar AMR"       │  "custom lidar for robotics"  #9  ▲3         │
│  "dToF camera"            │  "Hokuyo lidar alternative"   #21 ▲2         │
│  Source: Search Console   │  Source: Search Console (+ SEMrush optional) │
├──────────────────────────┴─────────────────────────────────────────────┤
│  TRAFFIC BY SOURCE (Big-Wave email · LinkedIn · Organic/GEO · Shows)     │
│  CORE WEB VITALS (LCP / INP / CLS, field)        LIGHTHOUSE: 99 ✓        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Data sources:**
- **GA4 Data API** → true unique visitors (bot-filtered), traffic by source, conversion counts by A+/A/B/C.
- **Google Search Console API** → impressions, clicks, average position, and **rank movement on the high-intent keyword set** (brief §8: "custom LiDAR for robotics," "LiDAR alternative to Sick," "SIL2 safety LiDAR for AMR" — *not* the broad "lidar" head term). This is the honest answer to "what's our rank?" that incognito/IP-cached Google searches can't give them (May 28 call).
- **HubSpot** → meetings/deals created, to reconcile site conversions with pipeline.
- **SEMrush (optional, brief §8 / call):** if MorpheusTEK keeps a SEMrush seat, add competitive rank-tracking; otherwise Search Console covers the core need at no extra cost. **(PROPOSED)** start Search-Console-only; add SEMrush only if Tom wants competitor share-of-voice.

Data is fetched server-side on a **Vercel Cron** (e.g. nightly) and cached in a small Supabase table, so the dashboard loads instantly and never burns API quota on page view. Same cron can replay any failed HubSpot `submissions`.

---

## 6.5 Delivery Workflow

This is the operational backbone Austin promised on the calls: Vercel staging, a GitHub repo the client owns, a `how-to.md`, and safe "edit via Claude desktop."

### 6.5.1 GitHub repository structure

```
morpheustek-website/                 ← client-owned repo (IP handed over)
├─ README.md                         ← quickstart for any new-age dev
├─ how-to.md                         ← THE plain-English operations manual (see 6.5.4)
├─ .env.example                      ← every required var, documented, no secrets
├─ next.config.ts                    ← image domains, headers, redirects
├─ tailwind.config.ts                ← brand tokens (yellow/blue/red, light/dark)
├─ middleware.ts                     ← edge: bot/geo/Turnstile pre-check
├─ app/
│  ├─ (marketing)/                   ← SSG: home, about, solutions, applications,
│  │                                    manufacturing-strength, comparison pages
│  ├─ products/[slug]/page.tsx       ← ISR product detail (specs above the fold)
│  ├─ products/category/[slug]/      ← ISR category pages
│  ├─ blog/[slug]/page.tsx           ← ISR blog (consistent template)
│  ├─ resources/                     ← lead-magnet library
│  ├─ shows/[slug]/                  ← "Shows We'll Be At" + booth form
│  ├─ admin/                         ← protected content editor (Supabase auth)
│  ├─ dashboard/                     ← protected transparency dashboard
│  ├─ api/
│  │  ├─ lead/route.ts               ← THE HubSpot + gated-download route
│  │  ├─ revalidate/route.ts         ← Supabase webhook → on-demand ISR
│  │  └─ cron/                       ← dashboard refresh + failed-sync replay
│  ├─ sitemap.ts  robots.ts          ← generated (see 6.7)
│  └─ llms.txt/route.ts              ← GEO manifest (see 6.7)
├─ components/                       ← UI (shadcn/ui-based), brand components,
│  │                                   LiDAR-view toggle, before/after slider,
│  │                                   build-on-scroll, mega menu
├─ lib/
│  ├─ supabase/                      ← typed client + generated DB types
│  ├─ hubspot/                       ← API wrapper + field maps per form type
│  ├─ analytics/                     ← typed GA4 event helpers
│  └─ validation/                    ← zod schemas per form
├─ content/                          ← MDX for static legal/about (non-DB copy)
├─ public/                           ← favicons, static svg, manifest
├─ supabase/
│  ├─ migrations/                    ← versioned SQL schema (source of truth)
│  └─ seed.sql                       ← catalog seed from brief §4
└─ .github/workflows/
   ├─ ci.yml                         ← lint · typecheck · build
   └─ lighthouse.yml                 ← automated Lighthouse/SEO gate (see 6.6)
```

### 6.5.2 Branch → preview → promote-to-production (Vercel)

Exactly the workflow Austin described ("preview is your sandbox… if you like it, hit promote to production"):

```
  feature branch ──push──► Vercel builds a unique PREVIEW URL  (the "sandbox")
        │                         │
        │                         ├─ Phil/Tom review the preview link
        │                         ├─ Lighthouse CI runs on the preview
        │                         └─ liked it?
        ▼                                 │ yes
   open PR ──► review/CI green ──► merge to `main` ──► PRODUCTION deploy
                                                 (or: "Promote to Production"
                                                  button on a preview, Vercel)
```

- **`main` = production.** Every other branch / PR gets an isolated, shareable preview deployment — the staging environment MorpheusTEK currently lacks (Phil: "one of the things we're struggling with right now is we don't have a sandbox"). Production is never touched until a human promotes.
- Vercel's **"Promote to Production"** on any preview lets the client ship a reviewed change with one click; instant **rollback** to any prior deployment if something looks wrong.

### 6.5.3 Environment variables & secrets

Managed in Vercel project settings (per-environment: Production / Preview / Development), mirrored in `.env.example` (documented, no values). Secrets never enter the repo or the client bundle.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `…_ANON_KEY` | public | client reads of published content (RLS-guarded) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | admin writes, signed-URL minting |
| `HUBSPOT_PRIVATE_APP_TOKEN` | **server only** | CRM + Forms API |
| `HUBSPOT_PORTAL_ID` / `…_FORM_GUIDs` | server | form submission targets |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | server / public | spam protection |
| `UPSTASH_REDIS_*` | server | rate limiting |
| `GA4_PROPERTY_ID` + service-account JSON | server | dashboard Data API |
| `GSC_*` | server | Search Console API |
| `REVALIDATE_WEBHOOK_SECRET` | server | authenticate Supabase → ISR webhook |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | public | GA4 tag |

### 6.5.4 `how-to.md` contents (the maintainability deliverable)

Phil's "if I get hit by a bus" insurance and the brief's explicit deliverable (§11). Written in plain English for **both** a future developer and a non-technical editor:

1. **What this site is** — stack overview, the architecture diagram (§6.0), what's static vs. dynamic.
2. **Run it locally** — clone, `pnpm install`, copy `.env.example`, `pnpm dev`.
3. **How to add/edit a product** — via `/admin` (click-path) *and* via Supabase Studio; what each field does; how to upload a spec-sheet PDF and image (with required alt text).
4. **How to publish a blog post** — and why it's for SEO/GEO.
5. **How to update "Product of the Month" / "Shows We'll Be At" / "What's New."**
6. **How gated downloads & HubSpot work** — the lead flow, where leads land, what to check if a form misbehaves.
7. **How to ship a change** — branch → preview → review → promote; how to roll back.
8. **How to edit via Claude desktop** (§6.5.5).
9. **Where everything lives** — env vars, Supabase project, HubSpot portal, GA4 property, Vercel project; how ownership/access is set up.
10. **The performance/SEO rules** the site must keep passing (the Lighthouse CI gate).

### 6.5.5 "Edit via Claude desktop," safely

Austin's promised power-move ("connect it to which website I want to edit… change the color to red… it pushes to preview, then I promote to production"). Made safe with guardrails:

- A documented MCP setup (GitHub + Supabase + Vercel MCP servers) so a Claude desktop session can read the repo, propose a change, and open a branch.
- **Guardrail: Claude pushes to a branch/preview only — never directly to `main`.** The human reviews the preview and clicks promote. This preserves the "preview is the sandbox" safety net even for AI-driven edits.
- A short prompt-library in `how-to.md` for common tasks ("update GS1-5 price," "add a new show," "swap the hero copy variant"). Schema types + RLS mean even an AI edit can't silently break data contracts or expose private buckets.

### 6.5.6 Handover (client owns IP/repo)

Per the brief (§0) and calls: **the GitHub repo, the brand/design guide, and the data are the client's IP.** At handover, repo ownership transfers to MorpheusTEK; Supabase, HubSpot, GA4, and Search Console are all under MorpheusTEK accounts (Vercel stays on Stackked's account while on retainer, with a documented one-step migration to the client's own Vercel team if the retainer ends). Nothing about the site is locked to Stackked.

---

## 6.6 Performance & Quality Budget (99+ Lighthouse)

The 99+ Lighthouse score is a contractual line in the sand (brief §8; Austin promised it on the call and referenced "an agent that audits Lighthouse"). We hit it by budget, not by luck.

### 6.6.1 Core Web Vitals targets

| Metric | Target | How |
|---|---|---|
| **LCP** | < 1.8s (good ≤ 2.5s) | hero served as optimized poster image first; SSG/ISR pre-render; CDN edge; preload LCP asset |
| **INP** | < 200ms | RSC keeps JS minimal; interactivity (toggles, sliders) is small client islands |
| **CLS** | < 0.05 | explicit width/height on all media; `next/font` (no FOUT/FOIT); reserved space for the hero video |
| **TBT** | < 150ms | code-split, defer third-party (GA4) until interactive |
| **Total JS (initial)** | budget ≤ ~120KB gzip on content pages (PROPOSED) | server components; lazy-load heavy interactive bits |

### 6.6.2 Image strategy

- **`next/image` everywhere**, serving **AVIF with WebP fallback**, responsive `srcset`, and `sizes`; lazy by default, `priority` only on the LCP image.
- **Every image has alt text** — enforced by the non-null `alt_text` column (§6.2.2) and a lint rule. This directly closes the current site's #1 SEO failing (no alt text — brief §8).
- Product/point-cloud imagery uploaded to Supabase Storage is delivered through the image optimizer (transform + cache at edge).

### 6.6.3 The AI hero **video** delivery (the signature element)

Austin: "90% of the websites I'm doing right now is a hero video, all generated" (Higgsfield). Video is the heaviest thing on the page, so it gets the strictest budget:

- **Poster-first paint.** A lightweight optimized **poster image** is the LCP element and renders instantly; the video layers in after. LCP is scored on the poster, not the video bytes.
- **`muted` + `autoplay` + `loop` + `playsInline`** (required for mobile autoplay), **`preload="none"`**, and the `<video>` is **lazy-mounted** (only when in/near viewport).
- **Encoding:** ship **AV1/H.265 + H.264 fallback**, short loop, capped bitrate; serve from Vercel/CDN. Target a small loop file, not a 4K showpiece.
- **Mobile fallback:** below a breakpoint (and on `prefers-reduced-motion` / Save-Data), serve the **static poster image only** — no video download. This protects mobile Lighthouse and data-conscious trade-show visitors.
- **A11y/honesty:** poster carries alt text; respects reduced-motion (accessibility section owns full audit). Note the brief's caution (§12): AI-generated media is a placeholder strategy — the delivery pipeline above works identically when Phil swaps in real supplier footage.

The same lazy/poster discipline applies to the **before/after point-cloud slider**, **build-on-scroll** animations, and **LiDAR-view toggle** — all are client islands that load only when needed and never block first paint.

### 6.6.4 Fonts, code-splitting, caching

- **`next/font`** self-hosts brand fonts (no render-blocking Google Fonts request, no layout shift), `font-display: swap`, subset to used glyphs.
- **Code-splitting** is automatic per route (App Router); heavy libs (Framer Motion, slider, dashboard charts) are dynamically imported so they never weigh down content pages.
- **Caching/CDN:** SSG/ISR pages cached at Vercel's edge; immutable hashed asset filenames; long-cache headers on static assets; ISR `stale-while-revalidate` keeps pages instant while refreshing in the background.

### 6.6.5 Automated Lighthouse/SEO CI gate

Ties directly to Austin's "agent that audits Lighthouse" (May 20 call). `.github/workflows/lighthouse.yml` runs **Lighthouse CI on every preview deploy** and **fails the PR if any category drops below threshold** — so a 99+ score is *enforced by the pipeline*, not re-checked by hand.

```
PR opened ──► Vercel preview ──► Lighthouse CI (mobile + desktop)
                                   ├─ Performance ≥ 99   ┐
                                   ├─ Accessibility ≥ 100 ├─ any fail → ❌ PR blocked
                                   ├─ Best-Practices ≥ 100│
                                   └─ SEO ≥ 100          ┘  all pass → ✅ promote-able
```

Asserts also check the things the current site got wrong: **exactly one H1 per page, valid H1/H2 hierarchy, all images have alt text, valid meta description, mobile viewport.** **(PROPOSED)** thresholds: Perf ≥ 99, A11y/Best-Practices/SEO = 100. A scheduled Cron can additionally run a weekly Lighthouse audit against production and post the report (Tom asked "does it run every day or once a week?" — answer: CI on every change + a weekly production audit).

---

## 6.7 Search, sitemap, robots, llms.txt & structured-data plumbing

*The SEO/GEO section owns keyword targets, copy, and schema content. This section builds the rails so that work plugs in cleanly.*

- **`sitemap.xml`** — generated by `app/sitemap.ts` from the DB: static routes + every published product, category, application, blog post, resource, and show. ISR-revalidated so new content appears automatically (no manual sitemap edits when Phil adds a product).
- **`robots.txt`** — `app/robots.ts`: allow crawl of all public content, disallow `/admin` and `/dashboard` and `/api`, reference the sitemap. **Explicitly allows reputable AI crawlers** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — GEO is a stated priority, so we *invite* the LLM crawlers rather than block them. **(PROPOSED, confirm with SEO section.)**
- **`llms.txt`** — a route serving a clean, plain-text manifest of the canonical facts the brief wants AI to repeat (NA robotics-perception partner; full sensing stack; exclusive NA OLEI distributor; 90-day trial; high-intent capabilities) plus a map of key pages. This is the GEO equivalent of a sitemap for LLMs. Content authored by the SEO section; the route + caching are built here. **Compliance/federal positioning is excluded** per the HARD RULE.
- **Structured data (JSON-LD) plumbing** — a typed `<JsonLd>` component injects schema generated from the DB, so it's always in sync with content:
  - `Organization` / `LocalBusiness`-style (national NA presence), `WebSite` with `SearchAction`.
  - `Product` schema per product page (name, category, brand, offer/price-or-`PriceSpecification`, plus spec properties) — fed from the `products` row.
  - `Article`/`BlogPosting` per blog post; `BreadcrumbList` site-wide; `FAQPage` where the SEO section supplies Q&A (strong for AI overviews).
  - **Certification claims rendered into schema only from the per-product `certifications` field** — so SIL2/Type 3/PL d can *only* attach to the GS1-5, enforcing the precise-certification HARD RULE in structured data too.
- **Canonical URLs, Open Graph, Twitter cards** — generated from each content type's `seo_*` fields via Next.js Metadata API; one source of truth, no per-page hand-editing.

---

## 6.8 Security & Reliability (why this beats the hacked WordPress)

The brief and both calls are emphatic: they are **leaving WordPress because it kept getting hacked and DDoS'd** on "old and outdated infrastructure." This stack removes the class of problems that bit them.

| Threat on old WP | Why it's gone / mitigated here |
|---|---|
| Plugin/theme RCE, vulnerable PHP | **No PHP, no plugins, no long-running CMS server.** Public surface is static HTML/CDN; dynamic code is a few audited serverless routes |
| Server compromise / outdated host | **Vercel managed edge** + **Supabase managed Postgres**; no server for the client to patch; automatic TLS, DDoS protection at the CDN layer |
| SQL injection | All DB access via Supabase client/parameterized queries + **Row-Level Security**; no raw string SQL from user input |
| Exposed admin / weak login | Admin and dashboard behind **Supabase Auth**; `/admin`, `/dashboard`, `/api` disallowed in robots and access-gated; secrets server-only |
| Credential leakage | HubSpot token, service-role key, etc. live in **Vercel env (server scope)** — never in the client bundle or repo |
| Direct asset theft (spec sheets) | Private Storage buckets + **short-lived signed URLs**; no guessable file paths |

**Forms spam protection & rate limiting** (the lead engine is the most attacked surface):
- **Cloudflare Turnstile** (invisible CAPTCHA) on every form; verified server-side in `/api/lead` before any HubSpot write.
- **Honeypot field** + minimum-time-to-submit heuristic to filter bots.
- **Disposable/role-email rejection** and MX sanity check (we want *business* emails — Tom's hard rule).
- **Rate limiting** (Upstash Redis or Vercel KV) per IP/route, plus **edge middleware** to drop obvious bot traffic before it reaches the functions — which *also* keeps GA4 numbers honest (bot filtering ties back to §6.4's "true unique visitors").
- **Security headers** (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame-ancestors) set in `next.config.ts`/middleware.

**Reliability:** static-first means the marketing site stays up even if Supabase or HubSpot has a blip (cached pages serve from edge); every lead is logged to `submissions` before external calls, so a HubSpot outage never loses a lead; instant Vercel rollback if a deploy regresses. This is the durable, low-maintenance posture Phil asked for — "if I get hit by a bus, the site keeps running."

---

### Open items to confirm with Phil/Tom/Greg (all marked PROPOSED above)
1. In-app `/admin` editor + Supabase Studio fallback (vs. Studio-only) — confirm the editing experience Phil's team wants.
2. R2 only if supplier point-cloud video libraries get large; default is Supabase Storage.
3. Dashboard as a route in the app (vs. a separate tool); Search-Console-only vs. adding SEMrush.
4. HubSpot owner-assignment rules (default round-robin) and exact pipeline stages for quote/sample deals.
5. Lighthouse CI thresholds (Perf ≥ 99; A11y/BP/SEO = 100) and which AI crawlers to allow in robots/llms.txt (coordinate with SEO section).
6. RLS role definitions, finalized with Greg at handover.