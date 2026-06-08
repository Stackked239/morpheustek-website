# Completeness Critique, Contradiction Resolutions & Consolidated Build Plan

> Adversarial review across all six sections — gaps, conflicts, build phases, and open decisions.

---

I now have full grounding in all three source documents and have read all six sections carefully. Let me produce the rigorous adversarial critique.

I have all the material I need to write a thorough, concrete critique. Here is the deliverable.

---

# Lead Reviewer Critique — MorpheusTEK Website Master Plan

*Adversarial completeness + consistency review of the six specialist sections against the Ground-Truth Brief and both discovery transcripts (May 20 + May 28, 2026). Organized into: 1) GAPS, 2) CONTRADICTIONS, 3) RISKS & SEQUENCING, 4) consolidated BUILD PHASE PLAN, 5) OPEN DECISIONS & ASSETS OWED.*

Overall assessment: the six sections are individually strong and collectively cover ~90% of the source. The gaps are concentrated in (a) the *parallel-build-with-placeholders* working rhythm and the *timeline mechanics*, (b) a few specific named source ideas that got mentioned-but-not-owned (no section takes responsibility for shipping them), and (c) several genuine cross-section contradictions in slugs, page names, and pricing facts that will cause build friction if not resolved before the "go dark" wireframe phase.

---

## 1. GAPS — source ideas no section covered, or covered weakly

I checked every item on the requested list plus the full source. Verdict per item below. "Covered" = adequately owned by a section; "Weak" = mentioned but no owner/mechanism; "MISSING" = absent.

### 1.1 Items adequately covered (no action — confirming so the merge doesn't re-flag them)
- **90-day risk-free trial prominence** — Covered strongly across brand (badge component), IA (persistent header CTA), copy (dedicated yellow banner), conversion (TRIAL variant set). Good.
- **"Meet Us at the Booth" + pre-show HubSpot sequence** — Covered (IA `/shows/meet-us-at-the-booth`, tech `shows` table + `booth_meeting` form, conversion BOOTH set).
- **Transparency/analytics dashboard** — Covered well (tech §6.4.3, conversion §5.6.4).
- **Duplicate GA tracking audit** — Covered (tech §6.4.1, conversion §5.6.1).
- **Client self-edit-via-Claude handover** — Covered (tech §6.5.5 with the branch-only guardrail — good catch).
- **how-to.md** — Covered (tech §6.5.4, full TOC).
- **Mega-menu rotating feature** — Covered (brand 3.7.10, IA 2.2, features 1.6).
- **HUADA/Great Star as PROOF not lead** — Covered (all sections enforce "proof, not lead").
- **"Don't overuse OLEI on homepage" rule** — Covered (brand 3.4.3 co-brand guardrail; IA P1).
- **Precise SIL2 scoping to GS1-5** — Covered *exceptionally* — tech enforces it at the data-model level (`certifications` jsonb null for non-GS1-5 → badge can't render). Best instance of a rule made structurally unbreakable.
- **Compliance/federal INTERNAL-ONLY** — Covered (every section flags it; conversion excludes it from `llms.txt` claim set explicitly).
- **Anonymized customer/application proof** — Covered (copy §1.9, content model `proof_media` approval-gated).
- **Product-spec-above-the-fold for the engineer** — Covered (IA P5, copy §2.1, tech `key_specs` jsonb).
- **Gated spec sheets needing a DB** — Covered (tech §6.2.3 signed-URL flow).
- **Scalable catalog** — Covered (tech CMS, IA flat `/products/<slug>`).
- **Product of the Month / Shows / What's New** — Covered (IA pages, tech `featured_content` slots).
- **Parallel-build-with-placeholders** — Covered at the *asset* level (features Part 2/3 slug-swap discipline). But see 1.2 — the *process/timeline* framing is weak.
- **ICP B & C drafted not given** — Covered (copy §8 drafts both, flagged PROPOSED).

### 1.2 GAPS — weak or missing

**GAP-1 (MISSING): Application Spotlight and Custom Solution Spotlight as recurring sections are under-built.** Brief §9 lists SIX recurring sections Phil explicitly said "Yes" to: *Product of the Month · Shows We'll Be At · Application Spotlight · Technical Resource Library · Custom Solution Spotlight · What's New.* The plan ships Product-of-the-Month, Shows, What's New, and Technical Resource Library as first-class. But **"Application Spotlight"** and **"Custom Solution Spotlight"** are only referenced in passing (features mentions them as Higgsfield asset placements; conversion mentions Custom Solution Spotlight as a lead-magnet home). Neither gets a page route, a CMS template, or a `featured_content` slot of its own in the IA. The tech `featured_content` table *does* include `application_spotlight` and `custom_solution` slots — so the data layer anticipates them — but the IA template inventory (§6.1) has no T-number for them and the sitemap has no route. **Resolution: add `/applications/spotlight` (or a homepage rotating band) and `/custom-solutions/spotlight` to the IA, each with a CMS template, so all six confirmed recurring sections actually exist and sync to the Big Wave/LinkedIn cadence.**

**GAP-2 (WEAK): The "Big Wave" mechanics are described but not wired.** Brief §9 + transcript: 25k cold emails every 4–6 weeks = product-of-the-month + show-of-the-month, and it must **coordinate with LinkedIn** posts. The conversion section correctly says Big-Wave traffic must land on message-matched pages, and IA maps entry points. But **no section owns the actual sync**: how does the Product-of-the-Month CMS record become the email's featured product *and* the LinkedIn post *and* the mega-menu feature from one source of truth? Tech's `featured_content` table is the right backbone, but there is no documented "single source → 3 channels" flow, no UTM convention spec for Big-Wave vs LinkedIn vs show emails (conversion *uses* `lead_source` from UTMs but never defines the UTM taxonomy MorpheusTEK must tag the emails with). **Resolution: add a short "campaign sync" spec — the UTM parameter taxonomy (`utm_source=bigwave|linkedin|show`, `utm_campaign=potm-2026-07`, etc.) and the rule that POTM/SOTM are authored once in `featured_content` and consumed by email/LinkedIn/site. Without the UTM taxonomy defined, the dashboard's "traffic by source" panel cannot actually attribute Big-Wave vs LinkedIn (Tom's exact pain: "where did that come from? No idea").**

**GAP-3 (WEAK): "We've already helped robotics companies customize 2D/3D LiDAR" proof and the partner footage (Ross Video, Tennant, Anatech, BrainOS, Aethon) — sourcing is named but the public-use approval workflow is not operationalized.** Multiple sections correctly say "strip logos, anonymize, confirm before public use." But the transcript reveals the actual mechanism Phil gave: *the partners' own public websites already host this imagery* ("Their websites have them… we might just have to strip logos"). No section captures the concrete task: pull approved frames from partner sites → strip logos → get written approval → store with an approval flag. The features section has an `is_ai_placeholder` flag but no `approval_status` field for partner footage. **Resolution: add an `approval_status` (enum: `pending|approved|rejected`) + `source` field to `product_assets`/proof media, and a one-line operational task: "quarantine partner footage until written approval is on file." Tech's RLS should prevent `pending` assets from rendering publicly.**

**GAP-4 (WEAK): The "national but small/scrappy — don't let them know we're too small" tension is handled at the visual/voice level but not at the structural level.** Brief §2 and the May 28 transcript are emphatic: Phil "doesn't want people to know we're too small," wants to "project bigger," national presence, "let perception be reality." Brand §3.1.4 and copy §6 handle the *messaging*. But two concrete structural enablers from the transcript are missing: (a) **no "team" or "leadership" page is planned at all** — which is actually correct (showing 7 people undercuts "national"), but no section *states the decision to omit it* as a deliberate scale-projection choice, leaving it as an accidental gap rather than a strategy; (b) the **"Shows We'll Be At" map of 7 North American show cities** (brand proposed it as a national-scale signal) is not in the IA's `/shows` template field model. **Resolution: explicitly document "no team-size/headcount/leadership-bios page — deliberate," and add a `city`/`venue` → map visualization to the shows hub so the 7-shows-a-year national footprint is a visible scale signal.**

**GAP-5 (MISSING): The LR-1BS2 "foot-in-the-door SKU" strategy and the cheap-entry-point conversion play are not used.** Brief §4 explicitly flags OLEI LR-1BS2 ($595) as the "foot-in-the-door SKU." This is a deliberate low-price entry product to start relationships. No section builds a conversion play around it (e.g., featuring the cheapest credible unit as a low-risk first purchase, or pairing it with the 90-day trial as the lowest-commitment hardware path). Copy §3.2 even *warns* the LR-1BS2 is not safety-rated (correct) but never leverages its strategic role. **Resolution: note the LR-1BS2 as the intentional low-barrier entry SKU in the conversion/IA strategy — a candidate Product-of-the-Month for a "start small" campaign.**

**GAP-6 (WEAK): The "in-between buyer 60%" newsletter/lead-magnet on the HOMEPAGE specifically.** Austin (May 28) was explicit: *"We'll have one [lead magnet] on the homepage that… stay in touch with what's going on or what makes us different."* The plan has the SICK/Hokuyo checklist as the primary magnet and a footer newsletter, but no section places a distinct **homepage-specific** "what makes us different / stay in touch" lead magnet as Austin described — the homepage lead-magnet is conflated with the checklist. Minor, but it's a named source idea. **Resolution: confirm whether the homepage's low-commitment catcher is the SICK checklist (current plan) or a separate "what makes us different" magnet (Austin's words).**

**GAP-7 (WEAK): Real product photography vs AI — the catalog product RENDERS.** Brief §12 + transcript: engineers must trust the product shot is the *real unit*; copy §3.6.1 and features both say "replace AI product renders with real photography." But there is a credibility risk no section fully confronts: shipping **AI-generated product renders of real SKUs** (the GS1-5, LR-16F, etc.) risks showing hardware that doesn't match the real datasheet appearance — and a spec-reading engineer will notice. Features §item 7 flags "match casing to real datasheet appearance" but the safer call (use the supplier's existing real product photos, which exist on OLEI/supplier sites and spec sheets, from day one rather than AI) is not made. **Resolution: product-page hero images of real SKUs should prefer real supplier product photography (already available) over AI renders even at launch; reserve AI generation for scenes/heroes/applications, not the literal unit an engineer is evaluating.**

**GAP-8 (WEAK): The Robotics Language Guide / glossary as a GEO asset.** Brief §3/§5 reference a "Robotics Language Training Guide" with a sensor-fit table (§10) and safety-vs-perception distinction (§9). IA includes `/resources/glossary` and conversion uses the guide's discovery questions for FAQ. But no section commits to **publishing the glossary as an open, GEO-citable asset built from the Language Guide** — it's listed as a route but its content source (the Language Guide) and its GEO purpose are only implied. This is the single highest-leverage low-effort GEO win (self-contained definitional answers AI loves to cite). **Resolution: explicitly task the glossary as a launch GEO asset populated from the Robotics Language Guide, with `DefinedTerm`/`FAQPage` schema.**

**GAP-9 (MISSING): UAV / drone and Agriculture use cases from the flyer.** Brief §14 flyer use-case icons include **UAV** and **Agriculture** and "Mobile Mapping." The IA applications list and copy application strip cover AMR/AGV/forklift/cleaning/outdoor/inspection/mapping but **drop UAV and Agriculture**. The features negative-prompt correctly excludes *cars and food&beverage* — but UAV and agriculture are in-scope per the flyer and were never excluded. This may be intentional scope-narrowing, but no section states the decision. **Resolution: confirm whether UAV and Agriculture are in or out. If in, add application pages; if out, document why (the brief lists them as capabilities).**

**GAP-10 (WEAK): "Insight to Robotics" / "Reality" tagline variants and booth consistency.** Transcript (May 28): Phil says the booth tagline is "**insight to robotics**" and they want the website to **stay consistent with booth design**. Brief §1 notes "Giving Sight to Robotics" is primary with "Insight to robotics"/"Reality" as variants. Brand §3.1.1 handles the tagline hierarchy well. But **no section addresses booth-to-web design consistency as a deliverable** — Phil explicitly asked to "stay consistent with our booth design," and the brand guide is meant to "permeate throughout the brand… booths." The brand system mentions reuse "across the booth" once but there's no booth-design-token handoff. Minor — flag that the brand guide deliverable should include booth-applicable tokens.

**GAP-11 (MISSING): The "two or three emails in a row" nurture creating contact + account + OPPORTUNITY.** Tom (May 28) was precise: the HubSpot automation must *"create the contact, create the account, create an opportunity, and then… automatically send them two or three emails in a row."* Tech §6.3 covers contact + company + deal + nurture well. But note Tom said this should happen for the **download** path too (his exact framing was general), whereas the plan only creates a Deal/Opportunity for *high-intent* forms (quote/sample/meeting), not for plain gated downloads. This is arguably *better* practice (downloads shouldn't all spawn opportunities), but it **contradicts Tom's literal request** and should be surfaced as a decision, not silently overridden. **Resolution: confirm with Tom whether every gated download should create an Opportunity (his literal ask) or only high-intent forms (the plan's recommendation). Recommend the latter but make it an explicit, agreed deviation.**

**GAP-12 (WEAK): Discovery interviews with Phil, Tom, Greg, Eli as a Phase-0 input.** Brief §13 + transcript: Phil wants *separate* discovery interviews with Phil, Tom, Greg, and Eli "for better perspective," and the ICP is "the gate that starts the real build." No section's phase plan accounts for these interviews as a gating Phase-0 activity. The plan treats the Ground-Truth Brief as complete input, but the brief itself notes ICP B/C are drafted and the interviews are pending. **Resolution: Phase 0 must include the four separate discovery interviews + ICP B/C confirmation as the gate before "go dark."**

**GAP-13 (WEAK): Competitor-site study as an input artifact.** Phil gave a specific list to study: **Hesai (best-looking), SICK, RoboSense, Hokuyo, Ouster, Alistair** (likely "Outsight" or a mis-transcription). Brief §14 captures this. No section commits to a competitive visual/UX teardown as a design input, though brand §3.1.5 references competitor color trends. Minor — flag that the brand/design phase should include the documented competitor teardown Phil requested.

**GAP-14 (MISSING): Pricing-fact errors that propagate from the sections (this is also a contradiction — see §2.7).** Several sections invent or alter prices that contradict the brief's catalog. Flagged in detail under Contradictions, but called out here as a GAP because the *correct* canonical prices from Brief §4 must seed the CMS and none of the sections used them consistently.

---

## 2. CONTRADICTIONS / INCONSISTENCIES across sections

These will cause real build conflicts. Each needs a single resolution before the CMS is seeded and routes are built.

**CONTRA-1: Product URL slugs are inconsistent across IA, copy, and conversion.**
- IA (§1.2) decides **flat** `/products/olei-gs1-5`, `/products/olei-lr-1f`, etc. (with `olei-` prefix, supplier-in-slug).
- Copy (§2.1) uses `/products/gs1-5-safety-lidar`.
- Conversion SEO map (§5.4.2) uses `/products/gs1-5-safety-lidar`, `/products/lr-1f-2d-lidar`, `/products/lr-16f-100-3d-lidar` (no `olei-` prefix, keyword-suffixed).
- IA's own rule says "supplier brand never appears in a slug" — yet IA's own product slugs are `/products/olei-gs1-5` (supplier IN the slug). **IA contradicts itself.**
**Resolution: adopt the conversion section's SEO-optimized pattern — `/products/{model}-{category-keyword}` (e.g., `gs1-5-safety-lidar`, `lr-1f-2d-lidar`) — no `olei-` prefix (honors the "no supplier in slug" rule and is more keyword-clean). Update IA's product list and breadcrumbs accordingly. This is the single most important slug decision to lock because product `slug` is a CMS primary key and changing it later breaks URLs + SEO.**

**CONTRA-2: Category URL structure conflicts — `/lidar/safety-lidar` vs `/safety-lidar` vs `/products/category/[slug]`.**
- IA (§1.2) uses nested `/lidar/safety-lidar`, `/lidar/2d-lidar`, plus single-tier `/cameras`, `/rangefinders`.
- Conversion SEO map uses flat `/3d-cameras-for-robotics`, `/custom-lidar-for-robotics`, and the SICK breadcrumb references `/safety-lidar` (flat, no `/lidar/` parent).
- Tech (§6.5.1) routes `products/category/[slug]`.
- Three different category URL schemes across three sections. **Resolution: pick ONE. Recommend the conversion section's keyword-pillar approach for the marketing/category hubs (`/lidar-for-robotics`, `/3d-cameras-for-robotics`, `/safety-lidar`) because it's explicitly SEO-mapped to priority keywords, and reconcile IA's nested `/lidar/safety-lidar` to it. The tech `products/category/[slug]` is an implementation detail that must match whichever public scheme wins.**

**CONTRA-3: Comparison page slugs differ.**
- IA: `/compare/sick-alternative`, `/compare/hokuyo-alternative`.
- Conversion SEO map: `/compare/sick-alternative-lidar`, `/compare/hokuyo-alternative-lidar`.
- Copy: "the full SICK comparison" links unspecified.
**Resolution: use `/compare/sick-alternative-lidar` (conversion's version — keyword "lidar alternative to sick" is the target term, so the slug should carry "lidar").**

**CONTRA-4: The Solutions/Full-Stack page slug and name.**
- IA: `/solutions/full-stack-perception` (under a `/solutions` hub).
- Conversion SEO map: `/full-stack-perception` (root-level).
- Copy: "full sensing solutions stack."
**Resolution: root-level `/full-stack-perception` (conversion) is better for SEO (shorter, keyword-clean) and the brief gives no reason for a `/solutions` hub yet (IA itself flags this as an open question in its §8.5). Drop the thin `/solutions` hub unless multi-bundle solutions are confirmed.**

**CONTRA-5: "Why Us" vs "Why MorpheusTEK" vs "About" — page identity collision.**
- IA nav has a **"Why Us"** panel (Custom Solutions, Manufacturing Strength, SICK Alternative, 90-Day Trial, About) AND a separate `/about` + `/about/manufacturing-strength`.
- Conversion maps the keyword "LiDAR supplier North America" to `/why-morpheustek` (a page that doesn't exist in the IA sitemap).
- Copy §6 builds the About page as "Manufacturing Strength Behind the Sensing Stack" with H1 "We're giving sight to robotics."
- So there are potentially three overlapping pages: `/about`, `/about/manufacturing-strength`, and `/why-morpheustek`, plus a "Why Us" nav grouping. **Resolution: consolidate. One About page (`/about`) with the manufacturing-strength section in it (or as `/about/manufacturing-strength`), and map the "LiDAR supplier North America" keyword to `/about` — do not create a separate `/why-morpheustek`. "Why Us" in nav is a grouping label, not a page. Reconcile the conversion SEO map's `/why-morpheustek` to `/about`.**

**CONTRA-6: Nav structure differs between brand, IA, and copy.**
- IA top nav (§2.1): **Solutions · Products · Applications · Why Us · Resources** (5 items).
- Copy global header (§1.0): **Products · Solutions · Compare · Resources · About · Shows We'll Be At** (6 items).
- Brand mega-menu categories list (3.7.10) matches Products but doesn't define the full nav.
These are materially different navs (IA has "Applications" and "Why Us" as top-level; copy has "Compare" and "Shows" as top-level). **Resolution: lock one nav. The IA section owns IA, so its 5-item nav should win — but "Compare" and "Shows" from copy are strong candidates for top-level given they're high-intent/seasonal. Recommend a reconciled 6-item nav: Products · Applications · Compare · Resources · Why Us · [Shows as a seasonal banner, not permanent nav]. Resolve before building the header component (everything hangs off it).**

**CONTRA-7: Pricing facts contradict the brief's canonical catalog.**
- **OLEI LR-1F:** Brief §4 = **$1,449**. Conversion SEO map describes it as "one scanner replaces two" with no price; copy doesn't price it. Features/copy reference it without the $1,449. No contradiction yet, but the price must seed correctly.
- **LR-F240:** Brief = **$749**. Copy §2.7 says "$749." ✓ consistent.
- **SICK nanoScan3 price:** Copy and conversion both use "**~$4,500+**." The brief gives no SICK list price — it only says SICK is "~40% more expensive" (internal framing) and "~½–⅓ price." **"~$4,500+" is an invented number not in the source.** Brief §12 explicitly warns: "Be careful with competitor price comparisons — only state what's supportable." A specific "$4,500+" SICK price on a public comparison page is **not supportable from the source** and contradicts the brief's caution. **Resolution: remove specific invented SICK dollar figures from public pages; use the supportable framing ("a fraction of the price," "same safety class at lower cost"). Keep exact competitor pricing internal only.**
- **"40% more expensive" (Tom's transcript figure) vs "½–⅓ the price" (brief framing) vs "$4,500+" (sections):** three different magnitudes. The GS1-5 at $1,950 vs "40% more" = ~$2,730; vs "½–⅓" = $3,900–5,850; vs "$4,500+." These are inconsistent. **Resolution: pick the brief's "fraction of the price / same safety class" qualitative framing for public copy; never publish a computed percentage or competitor dollar figure.**

**CONTRA-8: Manufacturing-credibility facts differ between brand and copy.**
- Brief §2 says HUADA/Great Star has "30+ years serving **Bosch, Hilti, Leica, Trimble**."
- Copy §1.9/§6.3 says "30+ years of OEM/ODM experience" and "one of the largest purchasers of laser diodes" but **drops the named customers (Bosch, Hilti, Leica, Trimble)** and flags the stats as "(PROPOSED — confirm figures)."
- The named blue-chip customers (Bosch/Hilti/Leica/Trimble) are the *strongest* credibility proof in the brief and they're in the source — yet copy treats the manufacturing stats as unconfirmed. **Resolution: the Bosch/Hilti/Leica/Trimble heritage IS in the ground truth — use it as the headline manufacturing proof (pending Phil's confirmation it's publishable), rather than the vaguer "largest purchaser of laser diodes" stat. Confirm which manufacturing claims are publishable.**

**CONTRA-9: Sintrones edge-compute product naming.**
- Brief §4: **Sintrones SBOX-2624(P)**.
- IA §1.2: `/products/sintrones-sbox-2624p`.
- Copy §1.5 references "Sintrones iBOX-602P" and the iBOX with "NVIDIA Jetson." Consistent on iBOX-602P. Minor — just ensure both Sintrones SKUs (iBOX-602P and SBOX-2624P) are in the catalog seed; copy only ever features the iBOX.

**CONTRA-10: `llms.txt` / `robots.txt` AI-crawler allowlist is "PROPOSED" in three places with no owner.** Tech §6.7, conversion §5.4.4/§5.5.4, and IA §1.2 all propose `/llms.txt` and an AI-bot allowlist, each marking it PROPOSED and deferring to "the SEO section" / "coordinate." This is circular — everyone defers to everyone. **Resolution: assign the conversion/SEO section as the owner of `llms.txt` content + robots AI-crawler policy; tech builds the route. Decision needed: confirm AI crawlers are *allowed* (the plan assumes yes; this is correct for GEO but should be an explicit client-acknowledged decision since it means feeding content to LLMs).**

**CONTRA-11: Theme architecture — number of themes and the focus-ring color story.** Brand ships **three** full themes (Light, Dark, Sensor-View) with theme-specific focus-ring colors (blue/yellow/green). IA §7.3 and features §1.2/§1.9 treat Sensor-View as a *re-skin layered on dark mode*, not a third independent token set. These are reconcilable (brand's Sensor-View inherits dark text tokens) but the **focus-ring color** differs: brand says sensor-view ring = point-cloud green `#39FF14` (PROPOSED); IA says "point-cloud-green focus rings"; features says rings must clear 3:1 in all themes. Consistent enough, but the green `#39FF14` on near-black needs the AA/AAA check the brand table doesn't show. Minor — confirm the green ring passes 3:1 (it does, ~15:1 on `#03080F`).

**CONTRA-12: Whether Sensor-View ships at launch (P0) or fast-follow.** Features marks Sensor-View **P0** (must-have for launch). IA §8.4 lists it as an **open decision** ("ships at launch vs. fast-follow"). Brand treats it as a core deliverable. Tech treats it as a `site_settings` toggle (implying it can be turned off). **Resolution: given it's Effort-L and the timeline is tight (late June), recommend Sensor-View as a **fast-follow** immediately after the Automate launch, not a launch blocker — but the token architecture (light/dark) that enables it must be built at launch. Confirm with Phil; it's his wish-list item so he may want it for the show.**

**CONTRA-13: Conversion-rate target framing.** Tom (May 28) said the goal is "**20%** of [2,000/mo] convert to a meeting." Conversion §5.6.2 correctly pushes back that 20% site-wide → meeting is unrealistic and reframes to two layers (2–4% site-wide qualified; ~20% of *high-intent* traffic via the full loop). This is honest and correct per the brief's "no fake metrics" rule — but it **contradicts the client's stated expectation** and must be surfaced as an explicit expectation-reset conversation, not buried in §5.6.2. **Resolution: flag for the kickoff — "the 20% goal is achievable only as a high-intent-traffic + full-loop metric; site-wide it will be low single digits. Align Phil/Tom before launch so the dashboard doesn't read as failure."**

---

## 3. RISKS & SEQUENCING ISSUES

**RISK-1: The ICP-B/C and discovery interviews are a hard gate that the plan treats as already-passed.** The brief is explicit: the **ICP is the gate that starts the real build**, ICP B/C were drafted not given, and four separate discovery interviews are planned. Several sections build extensively on the drafted ICP B/C personas. If Phil's confirmed ICP B/C diverge from the drafts, conversion paths, lead-magnet targeting, and FAQ phrasing shift. **Sequence fix: Phase 0 must close ICP B/C + interviews before the "go dark" wireframe phase, exactly as Austin described.**

**RISK-2: Asset-dependency timeline collision with late-June Automate.** The brief says first weeks are slower while Phil gathers logos, ICP, analytics access, real product video/point-cloud footage. The plan's parallel-placeholder approach is the right mitigation, but several P0 features depend on assets Phil controls and may not deliver in time: real point-cloud footage (before/after slider, SLAM module), brand vector logos (currently AI placeholders), GA4 owner access (dashboard + duplicate audit). **Sequence fix: explicitly mark which P0 items ship with AI placeholders at launch and which are blocked on Phil's assets, so Automate-launch scope is honest.** The before/after slider and product renders can launch on AI placeholders; the GA4 duplicate audit and dashboard *cannot* launch until Sean→Phil owner transfer happens (a third-party dependency entirely outside Stackked's control).

**RISK-3: "Go dark for 1–2 weeks, notes-only, no nitpicking placeholders" working rhythm is not reflected in any section's phase plan.** This is a core working-style constraint from both the brief (§13) and transcript (Austin: "it'll literally say tagline goes here… don't bug us"). No section's phasing builds in the (a) go-dark structure-first sprint, (b) notes-only early access, (c) rapid back-and-forth finishing phase. The build plan below fixes this.

**RISK-4: Three-theme + heavy interactive media vs the 99+ Lighthouse contractual line.** The plan stacks AI hero video, Sensor-View image-swaps, before/after slider, build-on-scroll sprite sequences, live SLAM/point-cloud (potentially WebGL), mega-menu imagery, and an ambient robot scene. Each section *individually* asserts Lighthouse safety (poster-first, lazy, code-split, reduced-motion). But **no section validates the cumulative budget on a real page** — the homepage carries hero video + before/after + build-on-scroll + ambient robot + mega-menu simultaneously. The tech section sets a ~120KB initial-JS budget but doesn't reconcile it against the homepage's feature stack. **Risk: the homepage specifically may not hit 99+ with all P0 features live. Mitigation: enforce the Lighthouse CI gate (tech §6.6.5) on the homepage preview early, and be prepared to demote a homepage feature (e.g., ambient robot, build-on-scroll) to below-the-fold or fast-follow if the homepage can't hold 99+.**

**RISK-5: GA4 owner-transfer is a third-party blocker on a critical-path deliverable.** Sean owns GA4; transfer to Phil requires a meeting Phil hadn't completed at the time of the call. The transparency dashboard, the duplicate-tracking audit, and the true-unique-visitor baseline all depend on this. **Sequence: treat GA4 owner transfer as a Phase-0 client task with a named owner (Phil↔Sean) and a date; the dashboard and SEO baseline are blocked until it lands.**

**RISK-6: Vercel-on-Stackked's-account creates a handover/lock-in question that's acknowledged but not de-risked.** Tech §6.5.6 says "Vercel stays on Stackked's account while on retainer, with a documented one-step migration." Phil's explicit fear is being "stuck" with a "boutique website nobody else can work on." The GitHub repo + how-to.md mitigate code lock-in, but the *hosting* (Vercel under Stackked) is a soft lock-in if the retainer ends. **Risk: low, but document the exact Vercel-team-transfer steps in how-to.md, not just "one-step migration."**

**RISK-7: HubSpot is described as system-of-record but the existing HubSpot portal's current state is unknown.** Tech §6.3 assumes clean contact/company/deal creation and workflow triggers. No section audits the *existing* HubSpot setup (pipelines, properties, existing workflows, owner-rotation config). If MorpheusTEK's HubSpot already has conflicting properties or a different pipeline structure, the integration spec may not map. **Sequence: add a HubSpot portal audit to Phase 0 (alongside the GA4 audit).**

**RISK-8: AI-content-flagging risk to SEO/GEO is noted but not mitigated in sequencing.** Austin (May 28) warned that platforms increasingly flag AI content and may penalize it in ranking/social algorithms — directly relevant to a GEO-first strategy that launches on AI placeholders. The features section flags it; no section sequences the **real-asset replacement** as a ranking-protection priority. **Sequence: prioritize replacing AI hero/proof imagery with real supplier footage in the first post-launch sprint, especially on the pages targeting priority keywords, to protect GEO standing.**

---

## 4. CONSOLIDATED BUILD PHASE PLAN

De-duplicated synthesis of all six sections' phasing, reconciled with the brief's working rhythm (§13) and the late-June Automate milestone. Each phase has explicit gates.

### PHASE 0 — Discovery, Inputs & Audits (the gate before "go dark")
*Owner: Stackked + MorpheusTEK. Cannot proceed to Phase 1 until gates close.*
- **Client tasks (MorpheusTEK):** confirm ICP B/C (Phil, this weekend per transcript); four separate discovery interviews (Phil, Tom, Greg, Eli); GA4 **owner** transfer Sean→Phil; assemble asset folder (logos, fonts, colors, booth photos) from Sean; provide competitor-site list (Hesai/SICK/RoboSense/Hokuyo/Ouster/Outsight).
- **Stackked audits:** GA4 duplicate-tracking audit + true-unique-visitor baseline; current-site Lighthouse/SEO baseline (alt-text, H1/H2 gaps documented); **HubSpot portal audit** (pipelines, properties, workflows, owner rotation); competitor visual/UX teardown.
- **GATE 0:** Confirmed 3 ICPs + GA4 owner access + brand asset folder (or confirmed placeholders) + HubSpot audit complete. **This is the brief's explicit "ICP is the gate" — the real build does not start without it.**

### PHASE 1 — "Go Dark" Structure/Wireframe Sprint (1–2 weeks)
*Foundation before aesthetics. Notes-only client access. No placeholder-text nitpicking (the brief's hard working-style rule).*
- Next.js + TS + Tailwind + Vercel project scaffold; GitHub repo created (client-owned IP); branch→preview→promote workflow live.
- Supabase schema migrated (products, categories, applications, resources, blog_posts, shows, featured_content, product_assets, submissions, site_settings) + catalog seeded from **Brief §4 canonical prices**.
- Design-token foundation: light/dark theme tokens (the architecture Sensor-View later extends); Tailwind config from brand §3.7.12.
- IA skeleton: all routes stubbed; nav/header/footer/mega-menu structure; product/category/application/comparison/resource templates as wireframes.
- **Slug + nav decisions LOCKED** (resolve CONTRA-1 through CONTRA-6 here — changing slugs/routes after this is costly).
- **GATE 1:** Wireframe structure shared for **notes-only** review; foundation approved.

### PHASE 2 — Core Build (parallel tracks, placeholders allowed)
*Runs in parallel per the brief; AI placeholders stand in for un-delivered assets.*
- **Content/CMS track:** product detail template (specs above fold, gated spec-sheet flow with signed URLs), category hubs, application pages (sensor-fit tables from Language Guide), comparison pages (SICK/Hokuyo, defensible claims only, no invented $ figures), About/Manufacturing-Strength, resource library + 5 lead magnets, glossary (GEO asset), blog template.
- **Copy track:** homepage StoryBrand sections, GS1-5 product page (highest priority — carries launch keywords + 90-day trial), SICK comparison page, hero A/B variants.
- **Integration track:** HubSpot serverless `/api/lead` (contact + company + deal + nurture; signed-URL gated download); form variants; GA4 instrumentation; Cloudflare Turnstile + rate limiting.
- **Media track:** P0 AI assets via Higgsfield (hero video + poster, robot-with-eyeball, before/after pairs, category scenes, product render *placeholders* — but prefer real supplier product photos where available, per GAP-7); favicon/eye mark.
- **Features track:** AI hero video, mega-menu, light/dark mode, before/after slider, 2D/3D/depth + safety-zone diagrams — all with reduced-motion + Lighthouse-safe fallbacks.
- **GATE 2:** Lighthouse CI gate enforced on every preview (Perf ≥99, A11y/BP/SEO targets); homepage specifically validated against cumulative-feature budget (RISK-4).

### PHASE 3 — Rapid Finishing (back-and-forth) + SEO/GEO + Dashboard
- Schema.org/JSON-LD (Organization, Product, BreadcrumbList, FAQPage, Article); sitemap/robots/`llms.txt` (SEO-owned content); GEO answer-first formatting + FAQ blocks; entity-consistency pass (one canonical "MorpheusTEK" everywhere).
- Transparency dashboard (GA4 + Search Console + HubSpot panels) — **blocked on GA4 owner transfer (RISK-5)**.
- A/B test harness wired (CTA variants, hero); HubSpot nurture sequences built per lead magnet.
- Rapid client back-and-forth, onboarding/hand-holding; `how-to.md` written; client self-edit-via-Claude documented with branch-only guardrail.
- **GATE 3:** Client can self-serve (add product/blog/show); dashboard validated; 99+ Lighthouse confirmed on key pages.

### PHASE 3.5 — LATE-JUNE / AUTOMATE LAUNCH MILESTONE
*A "meaningful version live around Automate (late June)."*
- **Ships:** homepage, GS1-5 + core product pages, SICK comparison, About/Manufacturing-Strength, applications, resource library + primary SICK/Hokuyo checklist magnet, Shows hub + "Meet Us at the Booth" form + Automate pre-show HubSpot sequence, blog scaffold, light/dark, hero video, mega-menu, before/after slider, dashboard (if GA4 transferred).
- **Explicitly deferred to fast-follow (not launch blockers):** Sensor-View toggle (Effort-L; confirm with Phil — he may want it for the show), build-on-scroll, live SLAM/3D point-cloud (WebGL), ambient robot, terminal element, full catalog of all 18 SKUs (template + a few; client uploads the rest), real-footage replacement.
- **GATE 3.5:** Automate-ready site live on production via promote-to-production.

### PHASE 4 — Post-Launch Fast-Follow & Asset Replacement
- Sensor-View toggle; build-on-scroll; live SLAM/point-cloud; ambient robot; terminal.
- **Replace AI placeholders with real supplier point-cloud/product footage** (RISK-8 — protects GEO ranking); partner application footage (Ross/Tennant/Anatech/BrainOS/Aethon) — logo-stripped, approval-on-file only.
- Big-Wave/LinkedIn campaign sync operationalized (GAP-2: UTM taxonomy + POTM/SOTM single-source); Application Spotlight + Custom Solution Spotlight sections (GAP-1).
- A/B tests run to significance (let Google/AB "learn" ~1 week — don't tune daily); weekly Tom check-ins.

---

## 5. OPEN DECISIONS (Phil/Tom) & ASSETS MORPHEUSTEK OWES

### 5.1 Open decisions requiring Phil/Tom sign-off
1. **Slug + nav + page-name reconciliation** (CONTRA-1–6) — lock product/category/comparison slugs, the Solutions-hub question, About vs Why-MorpheusTEK consolidation, and the final nav before Phase 1 closes.
2. **Sensor-View at launch vs fast-follow** (CONTRA-12) — Phil's wish-list item; does he want it live for Automate despite Effort-L?
3. **The 20% conversion expectation reset** (CONTRA-13) — agree the metric is high-intent-traffic + full-loop, not site-wide.
4. **Competitor pricing on public pages** (CONTRA-7) — confirm only qualitative "fraction of the price" framing is published; no invented SICK dollar figures or computed percentages.
5. **Manufacturing claims that are publishable** (CONTRA-8) — Bosch/Hilti/Leica/Trimble heritage, "largest laser-diode purchaser," "30+ years," HUADA/Great Star marks — which can go public?
6. **Does every gated download create a HubSpot Opportunity?** (GAP-11) — Tom's literal ask vs the plan's high-intent-only recommendation.
7. **UAV + Agriculture in or out of scope** (GAP-9) — flyer lists them; applications dropped them.
8. **AI crawler allowlist** (CONTRA-10) — confirm GPTBot/ClaudeBot/PerplexityBot/Google-Extended are allowed (correct for GEO; needs explicit acknowledgment).
9. **Homepage lead magnet** (GAP-6) — SICK checklist (plan) or a separate "what makes us different" magnet (Austin's words)?
10. **Display font** (brand) — Saira recommended; confirm or audition Chakra Petch/Archivo. Inter (body) locked.
11. **ICP B & C personas** — confirm the drafted personas (or correct them) — this is the build gate.
12. **HubSpot owner-assignment rules** — round-robin vs territory.

### 5.2 Assets MorpheusTEK still owes (named owners where known)
- **Brand vectors:** canonical morpheusTEK wordmark + OLEI eye SVGs (from **Sean's** asset folder) — currently AI placeholders.
- **Brand spec:** existing Pantone/print color spec if one exists (to confirm `#FFCB05`/`#0057B8` derivations); **booth photos** (for booth-to-web consistency, GAP-10).
- **ICP B/C confirmation** (Phil) + four discovery interviews (Phil, Tom, Greg, Eli).
- **GA4 owner access** transfer Sean→Phil (then admin to Austin/Tom) — blocks dashboard + audit + SEO baseline.
- **HubSpot portal access** + current-state audit input.
- **Real supplier point-cloud / product video footage** (Phil sourcing from suppliers) — for before/after slider, SLAM module, product renders; replaces AI placeholders.
- **Real product photography** of actual SKUs (engineer-trust requirement, GAP-7).
- **Partner application footage** (Ross Video, Tennant, Anatech, BrainOS, Aethon) — from partners' own websites; **logo-stripped + written approval required before any public use** (GAP-3).
- **Customer-story approvals** — written sign-off for any named customer/logo (none ship without it; anonymized until then).
- **Competitor-site list** for the design teardown (Phil to send/Tom to forward).
- **HUADA/Great Star credibility marks** approval to display (brand proof band).
- **Manufacturing stat confirmation** (the "30+ years / Bosch-Hilti-Leica-Trimble / largest laser-diode purchaser" figures Phil must verify as publishable).

---

*Files reviewed: `/Users/austinwarren/Morpheus Tek - Website/claudedocs/GROUND_TRUTH_BRIEF.md`, `/Users/austinwarren/Morpheus Tek - Website/context/MorpheusTEK-and-Stackked-Tech-Website-Conversation-1f6a9892-19b1.md`, `/Users/austinwarren/Morpheus Tek - Website/context/MorpheusTEK-and-Stackked-Tech-55d3033f-ceb3.md`, plus the six in-line specialist sections.*

**Highest-priority items to resolve before the "go dark" wireframe sprint:** the slug/nav/page-name contradictions (CONTRA-1–6, because routes and CMS keys are expensive to change later), the invented-competitor-pricing issue (CONTRA-7, a brief-rule violation and credibility risk), the ICP-B/C confirmation gate (RISK-1), and the GA4 owner-transfer dependency (RISK-5).