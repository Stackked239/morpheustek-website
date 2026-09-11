# Conversion Architecture, Lead-Gen, SEO & GEO

> MorpheusTEK website — detailed plan section. Part of the master build plan.

---

I have full grounding and the SEO/AI-SEO methodology. I'll now write the deliverable section. This is a single comprehensive Markdown document — no preamble.

---

# Section 5 — Conversion Architecture, Lead-Gen, SEO & GEO

> **Scope of this section.** This is the demand-capture engine for the MorpheusTEK site: how a visitor becomes a meeting, a download, a quote, a sample request, a booth appointment, or a subscriber — and how AI assistants and search engines learn to recommend MorpheusTEK in the first place. Everything here is grounded in the Ground-Truth Brief, the two discovery transcripts, and the Product & Robotics Language guides. The **90-day risk-free trial** is treated as the single biggest differentiator throughout, the **Robotics Builder/Integrator ("Robotics Engineer Skippy")** is the primary ICP, and all compliance/federal positioning is held **internal-only** and never surfaces in any public-facing copy, keyword, schema, or AI-facing fact below.
>
> Judgment calls beyond the brief are marked **(PROPOSED)** for client confirmation. Numbers Phil/Tom cannot yet verify (e.g., true unique-visitor count) are stated as assumptions, not facts.

---

## 5.1 Conversion System

### 5.1.1 The ranked conversion ladder

Phil ranked these on the May 28 call; we keep his ranking and add the operational detail. The governing insight, also from that call: **~60% of visitors are "in-between" buyers** who are interested but not meeting-ready. A meeting-only site converts ~0% of them (which is exactly today's outcome). The ladder below is engineered so every visitor has a *next rung they're willing to step on* — and every rung routes back to the A+ meeting through HubSpot nurture.

| Rank | Conversion | Commitment | Primary ICP served | Counts as success because |
|---|---|---|---|---|
| **A+** | Book a meeting / discovery call | Highest | A (Builder), C (Buyer) | Direct sales conversation → fastest path to Discovery→Trial |
| **A** | Gated technical download | Low–Medium | A, B (Engineer) | Captures contact + intent; feeds nurture to A+ |
| **A** | Request a quote / product recommendation | High | A, C | High-intent; spins a HubSpot deal, not just a contact |
| **B** | Request a sample / demo / **90-day trial** | Medium–High | A, B | Ties to the #1 differentiator; meeting→trial is the highest-converting motion |
| **B** | Trade-show meeting ("Meet us at the booth") | Medium | A, C | Pre-books the 7-shows-a-year pipeline; the Big Wave already drives this audience |
| **C** | Newsletter / "What's New" signup | Lowest | All (esp. the 60%) | Lightweight permission to re-market; treated as a lead magnet, not a dead end |

**The 60% low-commitment path (explicit design).** The site must never present "Book a Meeting" as the *only* door. Every product page, comparison page, and resource page carries a **dual CTA**: a high-commitment primary (Book / Quote / Start a Trial) **and** a low-commitment secondary (Download the spec / Download the guide / Get the comparison). The download is the on-ramp for the 60% — it requires only name + company + business email + use case, and it *immediately* enters the contact into a HubSpot nurture sequence whose final email is a meeting CTA. This is the "full loop" Austin described on the call: download today → "how's the download / here's what makes us different" tomorrow → "book a meeting" CTA. The download is not a consolation prize; it is the conveyor belt to the A+ conversion.

### 5.1.2 CTA copy variants by conversion (for A/B testing)

Per Austin's directive — *"three or four variations of the same call to action, worded different… then AB split test which converts best"* — each conversion gets a small variant set. Variants are intentionally written in different registers (engineer-direct vs. value-direct vs. urgency) so the test reveals which *register* this ICP responds to, not just which words.

**A+ — Book a meeting (variant set "MEET")**
- `MEET-A` **Talk to an Engineer** *(engineer-direct; matches ICP-B/A trust map — "engineers must trust we understand the application")*
- `MEET-B` **Book a Discovery Call**
- `MEET-C` **Get Perception Advice** *(advisor-first voice from the brief)*
- `MEET-D` **Book a 15-Minute Technical Call** *(time-boxed to lower commitment for the 60%)*

**A — Gated technical download (variant set "DL")**
- `DL-A` **Download the Spec Sheet** *(product pages)*
- `DL-B` **Get the SICK / Hokuyo Alternative Checklist** *(comparison & cost-down contexts)*
- `DL-C` **Download the Free Guide**
- `DL-D` **See the Full Comparison** *(comparison pages)*

**A — Quote / product recommendation (variant set "QUOTE")**
- `QUOTE-A` **Get a Quote**
- `QUOTE-B` **Request a Product Recommendation** *(consultative; fits "not just buy another sensor")*
- `QUOTE-C` **Get Pricing & Lead Time** *(answers the Buyer/ICP-C pain directly)*
- `QUOTE-D` **Spec My Sensor** *(engineer-direct, application-first)*

**B — Sample / demo / 90-day trial (variant set "TRIAL")**
- `TRIAL-A` **Start Your 90-Day Risk-Free Trial** *(lead with the differentiator)*
- `TRIAL-B` **Try It Free in Your Own Environment** *(Phil's "no commitment" framing)*
- `TRIAL-C` **Request an Evaluation Unit**
- `TRIAL-D` **Put It On Your Robot — Free for 90 Days** *(most concrete; speaks to the AMR builder)*

**B — Trade-show meeting (variant set "BOOTH")**
- `BOOTH-A` **Meet Us at the Booth**
- `BOOTH-B` **Book a Meeting at [Show Name]** *(dynamic show token)*
- `BOOTH-C` **Reserve a Demo at Automate** *(specific, high-intent)*

**C — Newsletter / What's New (variant set "SUB")**
- `SUB-A` **Get the Product of the Month**
- `SUB-B` **Stay Ahead in Robotics Perception**
- `SUB-C` **Subscribe to What's New at MorpheusTEK**

### 5.1.3 Where each CTA lives (placement map)

| CTA set | Header (sticky) | Hero (above fold) | Product page | Comparison page | Resource/blog | Footer | Exit-intent / sticky bar |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| MEET (A+) | ✅ primary | ✅ primary | ✅ primary | ✅ primary | secondary | ✅ | ✅ (PROPOSED) |
| DL (A) | — | secondary | ✅ (gated spec) | ✅ (gated checklist) | ✅ primary | — | ✅ (the 60% catcher) |
| QUOTE (A) | secondary | — | ✅ secondary | ✅ secondary | — | ✅ | — |
| TRIAL (B) | — | ✅ secondary | ✅ secondary (OLEI SKUs) | ✅ secondary | secondary | ✅ | — |
| BOOTH (B) | — | (seasonal banner) | — | — | — | ✅ | seasonal pre-show bar |
| SUB (C) | — | — | — | — | ✅ inline | ✅ | ✅ low-friction |

**Rules of placement (from the calls):**
1. **Most-important content + a CTA in the first viewport, always** (Austin: "the most important stuff always needs to be on a page you don't have to scroll to"). On product pages that means critical specs *and* a dual CTA above the fold.
2. **Page-to-source matching:** when traffic arrives from the Big Wave email or a LinkedIn post, the landing page's hero CTA matches the message that drove the click (Austin: "create a page specific to whatever was discussed in that email… so your call to action is right in front of their face"). The Product-of-the-Month email lands on the POTM page with a TRIAL/QUOTE primary; the Show-of-the-Month email lands on the show page with a BOOTH primary.
3. **Vary the wording, keep the destination.** All MEET variants resolve to the same HubSpot meeting embed; all DL variants resolve to the same gated-form pattern. This is what makes split-testing clean.

### 5.1.4 A/B testing plan

We test in priority order — start where the lift is largest and the traffic is concentrated (homepage hero + the comparison/checklist path, since the Big Wave funnels there).

| Test ID | What we split | Variants | Where | Primary success metric | Guardrail metric | Min. sample / runtime (PROPOSED) |
|---|---|---|---|---|---|---|
| **T1** | Hero primary CTA register | MEET-A vs MEET-C vs TRIAL-A | Homepage hero | CTA click-through → form-start rate | Bounce rate | ~2,000 visitors/arm; 2–3 wks |
| **T2** | Download CTA wording | DL-A vs DL-B vs DL-D | SICK/Hokuyo comparison page | Gated-form completion rate | Form-abandon rate | ~1,000/arm; 2–3 wks |
| **T3** | Meeting vs. low-commitment as primary | MEET-D (primary) vs DL-B (primary) | Product pages (GS1-5, LR-1F) | Combined qualified-conversion rate (meeting **+** download) | Quote requests | ~1,500/arm; 3 wks |
| **T4** | Trial framing | TRIAL-A vs TRIAL-B vs TRIAL-D | Product pages (OLEI SKUs) | Sample/trial form submissions | Sales-rejected lead rate | ~1,200/arm; 3 wks |
| **T5** | Form length (friction test) | 4-field vs 4-field+optional-shown | Gated download form | Completion rate × lead quality (SQL%) | n/a | ~1,000/arm; 3 wks |
| **T6** | Booth CTA specificity | BOOTH-A vs BOOTH-C | Show page pre-Automate | Booth-meeting requests | n/a | Run full pre-show window |

**Testing discipline (from Austin's own warning on the call):** do **not** read results daily and tinker — Google and the AI engines "take about a week to learn and approve." Apply the same patience to CTA tests: **let each test reach its minimum sample before calling it**, and don't ship mid-flight changes. Use a single experimentation tool (GA4 + a lightweight client-side split, or HubSpot's native A/B on forms/CTAs) so attribution is consistent. **One test per surface at a time** to avoid interaction effects. Statistical call at ~95% confidence or the runtime cap, whichever comes first; if inconclusive, keep the lower-friction variant (it protects the 60% path).

---

## 5.2 Lead Magnets — Full Specifications

Five lead magnets, each mapped to an ICP, each with contents, gated-form fields, and the HubSpot nurture it triggers. All sequences end in a **Book-a-Meeting** CTA (the "full loop"). Subject-line variants are written so two can be A/B-tested inside HubSpot.

**Design principles common to all five:**
- **Open the answer, gate the artifact.** The web page hosting each magnet carries an *ungated*, answer-first summary (so AI engines and the 60% can read it and so we earn the click), then gates the downloadable PDF/asset. AI cannot cite gated content — so the summary is public; only the formatted, printable deliverable is gated.
- **Defensible claims only.** SIL2 / Type 3 / PL d language appears **only** in the GS1-5 / safety context, never blanket-applied. Price-delta framing on public assets stays directional and supportable ("a fraction of premium-brand pricing"), never a fabricated exact percentage. No customer names/logos. No federal/compliance positioning.
- **HubSpot mechanics on every submit** (from §7 of the brief): create/update contact → associate company → tag lead source + ICP/use-case → record the asset captured → assign lead owner → enroll in the matching nurture → (for high-intent magnets) create a sales task/deal.

---

### Lead Magnet 1 — SICK / Hokuyo Alternative Comparison Checklist *(PRIMARY)*

- **Target ICP:** A — Robotics Builder/Integrator (and C — Buyer doing a cost-down). The brief names this as the #1 magnet for the hero persona.
- **Where it lives:** Comparison pages, the GS1-5 and LR-1F product pages, the Resource Library, the cost-down blog cluster, and as the DL-B exit-intent catcher site-wide.
- **Contents / outline:**
  1. The decision in one page: when a premium safety/nav scanner is right vs. over-spec
  2. Side-by-side checklist: safety class (Type 3 / SIL2 / PL d), protective range, scanning angle, FOV, range, interface/SDK, lead time, support model, price posture — *MorpheusTEK option vs. SICK class vs. Hokuyo class* (GS1-5 vs. nanoScan3 framing kept accurate: same safety class, 5 m vs 3 m protective range; UAM/URG framing for Hokuyo)
  3. Fleet-economics worksheet: per-unit delta × fleet size = project-margin impact (blank fields for the buyer to fill)
  4. "Same safety class, fraction of the price, prove it in 90 days" — the three golden lines, defensibly stated
  5. Migration checklist: mounting, FOV, firmware/zone config, ROS/driver, trial success criteria
- **Gated-form fields:** Required — **Full name · Company · Business email · Primary application / use case.** Optional (shown) — Robot type (AMR/AGV/forklift/cleaning/other) · Current supplier · Timeline.
- **HubSpot nurture (3 emails → meeting), source tag `cost-down`:**
  - **Email 1 (T+1 day) "How's the checklist?"** — Subj A: *"Your SICK/Hokuyo comparison checklist (+ the one line most teams miss)"* / Subj B: *"Did the comparison checklist make the call easier?"* — Body: recap the three golden lines; link the fleet-economics worksheet.
  - **Email 2 (T+3 days) "What 'same safety class' actually means"** — Subj A: *"Type 3 / SIL2 / PL d — at a fraction of the price"* / Subj B: *"Lower-cost safety LiDAR without dropping a safety class"* — Body: GS1-5 vs nanoScan3 accurate framing; protective-range edge (5 m vs 3 m); CTA to the GS1-5 page.
  - **Email 3 (T+6 days) "See it on your own robot"** — Subj A: *"Try the GS1-5 free for 90 days — no commitment"* / Subj B: *"Put our safety LiDAR next to your SICK and compare the data"* — Body: 90-day trial; **primary CTA: Book a Technical Discovery Call** (MEET-A), secondary CTA: Start a Trial (TRIAL-A).

---

### Lead Magnet 2 — LiDAR Selection Guide for Robotics OEMs

- **Target ICP:** A — Builder/Integrator scaling prototype→production (also B).
- **Where it lives:** 2D/3D LiDAR category pages, "LiDAR for robotics" pillar page, Resource Library.
- **Contents / outline:**
  1. 2D vs. 3D vs. solid-state vs. depth-camera — decision matrix by application (warehouse AMR, autonomous forklift, cleaning robot, outdoor mobile, inspection) — drawn from the Robotics Language Guide §10 sensor-fit table
  2. The 8 spec axes that actually decide fit: range, FOV (H×V), accuracy, update rate, IP rating, sunlight/ambient-light tolerance, interface (Ethernet/PoE/USB/CAN), ROS/SDK support
  3. Prototype→production checklist: customization options (FOV/range/mounting/housing/firmware), stocking, lead-time planning, long-term availability
  4. Single-source full-stack vs. piecemeal sourcing — integration-risk comparison
  5. "When to bring in an engineer" — and how the 90-day trial de-risks the spec decision
- **Gated-form fields:** Required — Name · Company · Business email · Use case. Optional (shown) — Robot type · Product interest (2D/3D/solid-state/camera/compute) · Timeline · Annual volume.
- **HubSpot nurture (3 emails → meeting), source tag `lidar-selection`:**
  - **E1 (T+1) "Your LiDAR selection guide"** — Subj A: *"The 8 specs that decide your LiDAR (your guide inside)"* / Subj B: *"Picking the right LiDAR for your robot — start here"*.
  - **E2 (T+3) "2D, 3D, or solid-state for your platform?"** — Subj A: *"Which LiDAR fits an AMR vs. a forklift vs. a cleaning robot"* / Subj B: *"Stop over-buying resolution your robot won't use"* — CTA to relevant category page.
  - **E3 (T+6) "From prototype to production without a redesign"** — Subj A: *"Lock in the right sensor before production — talk to an engineer"* / Subj B: *"De-risk your spec with a 90-day trial"* — **CTA: Book a Discovery Call** (MEET-B); secondary Trial.

---

### Lead Magnet 3 — Safety LiDAR Buyer's Guide for AMRs & Mobile Robots

- **Target ICP:** A (safety/controls engineer inside the builder) + C (buyer signing off on a safety-rated program). Maps to top pain #2: safety & compliance / safety-rated zones.
- **Where it lives:** GS1-5 product page, Safety LiDAR category page, "safety LiDAR for AMR" / "SIL2 safety LiDAR" pages, Resource Library.
- **Contents / outline:**
  1. Safety-rated vs. perception sensing — the careful distinction (a standard scanner is **not** safety-rated; the safety function needs the right architecture, safety-rated components, risk assessment, validation — language drawn directly from the Robotics Language Guide §9)
  2. Reading a safety datasheet: Type 3 (IEC 61496), SIL2 (IEC 61508)/SILCL2 (EN 62061), Cat 3/PL d (EN ISO 13849), Class 1 laser — what each means for an AMR personnel-protection stop function
  3. Protective field vs. warning field; warning-zone 1/2 + protection-zone diagrams (the flyer's safety-field model)
  4. Sizing protective range to platform speed and stopping distance
  5. Buyer's checklist: certification fit, range, resolution settings, fleet cost, trial validation plan
- **Gated-form fields:** Required — Name · Company · Business email · Use case. Optional (shown) — Robot type · Safety requirement (SIL2/PL d required? yes/no/unsure) · Timeline.
- **HubSpot nurture (3 emails → meeting), source tag `safety`, **higher lead score** (safety intent = production intent):**
  - **E1 (T+1) "Your safety LiDAR buyer's guide"** — Subj A: *"Is your robot's safety function actually rated? (guide inside)"* / Subj B: *"Safety LiDAR for AMRs — the buyer's checklist"*.
  - **E2 (T+3) "What Type 3 / SIL2 / PL d really requires"** — Subj A: *"Don't call a sensor 'safety-rated' until you've checked these 4 things"* / Subj B: *"The GS1-5: Type 3 / SIL2 / PL d, 5 m protective range"*.
  - **E3 (T+6) "Validate the stop function on your own robot"** — Subj A: *"Trial our safety LiDAR free for 90 days"* / Subj B: *"Talk to a safety engineer about your AMR"* — **CTA: Talk to an Engineer** (MEET-A).

---

### Lead Magnet 4 — Custom LiDAR Requirements Worksheet

- **Target ICP:** A & B — engineers with a customization trigger (custom FOV/range/mounting/housing/environment/firmware). This is a **high-intent** magnet — completing it is itself a near-spec.
- **Where it lives:** "Custom LiDAR for robotics" page, Custom Solution Spotlight section, OEM/ODM page, product pages' "need a variant?" module.
- **Contents / outline (fillable worksheet):**
  1. Application & robot platform; what the robot must detect/measure/avoid/map (Robotics Language Guide discovery framework)
  2. Environment grid: indoor/outdoor, dust, wet, reflective/black/glass surfaces, light (lux), temperature, vibration
  3. Spec targets: range (min/max), FOV (H×V), accuracy, update rate, IP rating
  4. Integration: interface, ROS/ROS 2, SDK/driver/API, edge-compute platform, time-sync needs
  5. Safety: is a safety-rated function involved? required class?
  6. Commercials: target unit cost, annual volume, timeline (prototype/pilot/production)
- **Gated-form fields (highest-capture, per §7 "high-intent forms capture more"):** Required — Name · Company · Business email · Application/use case · Sensor type of interest. Optional (shown) — Range · FOV · Interface · Environment · Safety requirement · Target unit cost · Annual volume · Timeline.
- **HubSpot behavior:** create contact + company **and a deal** (high intent), assign to a sales owner with a **same-day task**; enroll in a **2-email** nurture (short, because sales should engage directly), source tag `custom`:
  - **E1 (T+1, but sales should call first) "Got your custom requirements"** — Subj A: *"Reviewing your custom LiDAR requirements — one quick question"* / Subj B: *"Let's spec your custom LiDAR"* — sets the engineering call.
  - **E2 (T+3) "Let's get your variant on the bench"** — Subj A: *"Custom FOV/range/mounting — and a 90-day trial to prove it"* / Subj B: *"Book time with our engineering team"* — **CTA: Book a Technical Call** (MEET-D).

---

### Lead Magnet 5 — Sample Point-Cloud / Application Demo Pack

- **Target ICP:** B — Engineer/Evaluator who wants *proof it works* (and A who needs to show their team). Maps to "proof that converts: sample point clouds, demo videos."
- **Where it lives:** 3D LiDAR / 3D camera pages, Application Spotlight section, homepage proof section, the before/after-slider feature.
- **Contents / outline:**
  - Downloadable sample point-cloud files (`.pcd`/`.ply`) and SLAM map captures from representative OLEI/MRDVS units (2D SLAM map, 3D point cloud, dToF RGBD on black/reflective surfaces) — supplier-supplied footage Phil will provide; logos stripped/anonymized
  - Short application demo videos (AMR navigation, obstacle avoidance, pallet detection)
  - A "what you're looking at" annotation guide so an evaluator can judge point-cloud quality
  - Spec card per asset (which sensor produced it, conditions)
- **Gated-form fields:** Required — Name · Company · Business email · Use case. Optional (shown) — Robot type · Product interest · ROS version / software stack.
- **HubSpot nurture (3 emails → meeting), source tag `demo-pack`:**
  - **E1 (T+1) "Your sample point-cloud pack"** — Subj A: *"See what our sensors actually output (files inside)"* / Subj B: *"Point clouds, SLAM maps, and dToF on black surfaces"*.
  - **E2 (T+3) "How to read point-cloud quality"** — Subj A: *"Judging a LiDAR by its point cloud — what to look for"* / Subj B: *"dToF vs. stereo on the surfaces that break RealSense"*.
  - **E3 (T+6) "Generate this on your own robot"** — Subj A: *"Want this point cloud from your robot? Start a 90-day trial"* / Subj B: *"Book a demo with our engineering team"* — **CTA: Request a Sample/Trial** (TRIAL-C) primary; Book a Meeting secondary.

---

## 5.3 Gated Form Design

**Friction-vs-data principle.** Low-commitment conversions (download, newsletter) ask the **minimum** so the 60% don't bounce; high-commitment conversions (quote, sample/trial, custom) ask **more** because the visitor's intent is already high and richer data routes a better sales response. The brief's floor is fixed and non-negotiable: **name + company + business email + primary application/use case.** "Can't just be name and email" — Tom, May 28.

**Validation/UX rules (apply to all forms):**
- Business-email validation (reject free webmail softly with a nudge, not a hard block — PROPOSED, to avoid losing real leads).
- Optional fields are **visible but clearly optional** (no progressive-profiling tricks on first touch); HubSpot progressive profiling can fill the rest on later visits.
- Single-column, large tap targets (≥48px), labels above fields, inline errors — also a Lighthouse/accessibility win.
- Honeypot + reCAPTCHA-v3-style invisible spam protection (no visible captcha friction).
- On submit: instant on-page success state + the asset (or meeting confirmation), **not** a redirect to a dead "thank you" page — keep them on a page that cross-sells the next rung.

### Exact field lists by form type

| Field | Download (A) | Quote/Rec (A) | Sample/Trial (B) | Meeting (A+) | Booth (B) | Newsletter (C) |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Full name | **Req** | **Req** | **Req** | **Req** | **Req** | **Req** |
| Company | **Req** | **Req** | **Req** | **Req** | **Req** | Opt |
| Business email | **Req** | **Req** | **Req** | **Req** | **Req** | **Req** |
| Primary application / use case | **Req** | **Req** | **Req** | **Req** | Opt | — |
| Phone | Opt | **Req** | **Req** | Opt | Opt | — |
| Job title | Opt | Opt | Opt | **Req** | Opt | — |
| Robot type | Opt | **Req** | **Req** | Opt | Opt | — |
| Product / sensor interest | Opt | **Req** | **Req** | Opt | Opt | Opt |
| Inquiry type | — | **Req** | **Req** | Opt | — | — |
| Range target | — | Opt | Opt | — | — | — |
| FOV (H×V) | — | Opt | Opt | — | — | — |
| Interface (Eth/PoE/USB/CAN) | — | Opt | Opt | — | — | — |
| Environment (indoor/outdoor/dust/light) | — | Opt | Opt | — | — | — |
| Safety requirement (SIL2/PL d?) | — | Opt | Opt | — | — | — |
| Target unit cost | — | Opt | Opt | — | — | — |
| Annual volume | Opt | **Req** | Opt | Opt | — | — |
| Timeline (proto/pilot/production) | Opt | **Req** | **Req** | Opt | — | — |
| Current supplier | Opt | Opt | Opt | Opt | — | — |
| Which show | — | — | — | — | **Req** | — |
| Preferred meeting time | — | — | — | **Req** (calendar) | Opt | — |
| Consent / marketing opt-in | **Req** | **Req** | **Req** | **Req** | **Req** | **Req** |

**Notes.** The **Meeting** form is thinnest because we want the booking — qualification happens on the call (calendar embed + the 4 required fields + opt-in). The **Quote** and **Sample/Trial** forms are the richest because §7 of the brief calls for them to capture application, sensor type, range, FOV, interface, environment, safety, target cost, volume, timeline — these route a precise sales response and (per the sales process) let the rep "match the trial unit precisely to the discovery findings." **Booth** captures *which show* so HubSpot can fire the show-specific pre-show sequence. **Newsletter** is deliberately near-frictionless to serve the 60%.

---

## 5.4 SEO Plan

### 5.4.1 Strategy frame

Per the brief and Austin's call guidance: **do not chase the broad head term "lidar" first** (MorpheusTEK is not on page 1–2 for it, and it's dominated by giants). Win **specific, high-intent** queries where the ICP is already in-market, then expand. Classic SEO is the floor; GEO (§5.5) is the new ceiling. Target **99+ Lighthouse**, fix the audit gaps the brief flagged (**missing alt text, missing/incorrect H1–H2 structure, performance**).

### 5.4.2 Keyword → Page Map

Every priority and secondary keyword from §8 of the brief is assigned to exactly one canonical page/template (prevents keyword cannibalization — a real risk given overlapping terms). Title tags are 50–60 chars; meta descriptions 150–160 chars; one H1 per page.

| Priority keyword(s) | Page / template | URL slug | H1 | Title tag | Meta description |
|---|---|---|---|---|---|
| LiDAR for robotics; robot perception sensor supplier | **Pillar: LiDAR for Robotics** | `/lidar-for-robotics` | LiDAR for Robotics: Give Your Robot Sight | LiDAR for Robotics \| Full-Stack Perception \| MorpheusTEK | Choose the right LiDAR, 3D camera, and edge-compute stack for your robot. Full-stack perception, US support, and a 90-day risk-free trial. |
| safety LiDAR for AMR; SIL2 safety LiDAR | **Product: OLEI GS1-5 Safety LiDAR** | `/products/gs1-5-safety-lidar` | OLEI GS1-5 Safety LiDAR — Type 3 / SIL2 / PL d | Safety LiDAR for AMRs — SIL2 / Type 3 / PL d \| GS1-5 | Functional-safety laser scanner for AMRs: Type 3, SIL2, PL d, 270°, 5 m protective range. Affordable safety, 90-day trial. Get the spec sheet. |
| LiDAR alternative to Sick; safety scanner alternative | **Comparison: MorpheusTEK vs SICK** | `/compare/sick-alternative-lidar` | A Lower-Cost Alternative to SICK Safety LiDAR | SICK Safety LiDAR Alternative \| Same Safety Class \| MorpheusTEK | A SICK safety-LiDAR alternative in the same safety class (Type 3/SIL2/PL d) at a fraction of the price. See the comparison and try it free 90 days. |
| Hokuyo LiDAR alternative | **Comparison: MorpheusTEK vs Hokuyo** | `/compare/hokuyo-alternative-lidar` | A Lower-Cost Alternative to Hokuyo LiDAR | Hokuyo LiDAR Alternative for AMRs & AGVs \| MorpheusTEK | Need a Hokuyo URG/UST or UAM alternative? Full-circle 2D and 3D perception at a lower cost, with a 90-day risk-free trial. Compare now. |
| 2D LiDAR for robot navigation; AGV LiDAR; AMR LiDAR | **Product: OLEI LR-1F 360° 2D LiDAR** | `/products/lr-1f-2d-lidar` | OLEI LR-1F — 360° 2D LiDAR for AGV/AMR Navigation | 360° 2D LiDAR for Robot Navigation \| OLEI LR-1F | Full-circle 360° 2D LiDAR, 50 m range, for AGV/AMR navigation and obstacle detection. One scanner replaces two. 90-day trial. Get specs. |
| 3D LiDAR for obstacle avoidance | **Product: OLEI LR-16F-100 3D LiDAR** | `/products/lr-16f-100-3d-lidar` | OLEI LR-16F-100 — 360° 16-Channel 3D LiDAR | 3D LiDAR for Obstacle Avoidance \| 16-Channel \| LR-16F-100 | 16-channel 360° 3D LiDAR, 100 m range, dense point clouds for mobile-robot perception and obstacle avoidance. 90-day trial. Download the datasheet. |
| custom LiDAR for robotics; custom 2D/3D LiDAR supplier | **Capability: Custom LiDAR** | `/custom-lidar-for-robotics` | Custom LiDAR for Robotics — FOV, Range, Mounting, Firmware | Custom LiDAR for Robotics \| OEM/ODM \| MorpheusTEK | Need a custom FOV, range, mounting, housing, or firmware? We engineer custom 2D/3D LiDAR for robotics OEMs. Start with the requirements worksheet. |
| 3D cameras for robotics; depth camera; 3D camera; dToF camera | **Category: 3D Cameras** | `/3d-cameras-for-robotics` | 3D Cameras for Robotics — Depth, dToF & RGBD | 3D Cameras for Robotics \| dToF Depth & RGBD \| MorpheusTEK | Industrial 3D depth and dToF RGBD cameras for robotics: see black, reflective, and textureless surfaces in sunlight. RealSense alternative. |
| LiDAR and camera perception solutions; full-stack robot perception | **Solutions: Full-Stack Perception** | `/full-stack-perception` | Full-Stack Robot Perception: LiDAR + Cameras + Edge Compute | Full-Stack Robot Perception Solutions \| MorpheusTEK | One partner for LiDAR, 3D cameras, safety sensing, and edge compute — less integration risk, faster prototype to production. 90-day trial. |
| LiDAR supplier North America | **About / Why MorpheusTEK** | `/why-morpheustek` | Your North American Robotics-Perception Partner | LiDAR Supplier in North America \| MorpheusTEK | North American robotics-perception partner: LiDAR, 3D cameras, safety sensing, edge compute, US-based support, and a 90-day risk-free trial. |

**Secondary keywords → page assignments** (supporting content; no new top-level pages unless noted):

| Secondary keyword | Assigned page | Treatment |
|---|---|---|
| AMR LiDAR / AGV LiDAR | `/lidar-for-robotics` + LR-1F page | H2 sections + internal anchors |
| autonomous forklift LiDAR | `/lidar-for-robotics` (application H2) + 3D camera page | Application section / blog cluster |
| cost-down LiDAR replacement | `/compare/sick-alternative-lidar` | H2 + fleet-economics block |
| robot obstacle-avoidance sensor | LR-F240 solid-state page + 3D camera page | Product H2 |
| full-stack robot perception | `/full-stack-perception` | Primary (also pillar) |
| solid-state LiDAR (VSS-50, LR-F240) | `/products/lr-f240-solid-state-lidar`, `/products/vss-50-solid-state-lidar` | Product pages |
| RealSense replacement / alternative | Percipio + MRDVS S10/S11 pages | Comparison block (S11 vs D435) |
| ROS 2 LiDAR / 3D camera | Integration/Resource page | "Works with ROS 2" content block |

**Geographic SEO (US/Canada + metros) — without faking locations.** MorpheusTEK is a *national* distributor with no regional offices to fabricate. So:
- Establish entity geography honestly via **Organization schema** `areaServed: ["United States","Canada"]`, a real `address`/`contactPoint`, and consistent NAP (name/address/phone `(302) 416-5989`, `sales@morpheustek.com`) everywhere.
- **Do not** build fake city landing pages. Instead, win the named robotics/automation hubs through **application + trade-show content** that legitimately references those metros: e.g., a Resource/blog cluster like *"LiDAR for AMRs at [Automate / ProMat] in [Detroit/Chicago]"*, *"Robotics perception for Pittsburgh's autonomy ecosystem"*, *"Serving robotics builders in Boston, Silicon Valley, Austin, Atlanta, and North Carolina."* These are editorial/proof pages tied to real shows and real ecosystems — not doorway pages.
- A single **`/locations` or `/coverage` page (PROPOSED)** stating "We ship and support robotics builders across the US and Canada" with the served-metro list — honest national coverage, good for "LiDAR supplier North America."

### 5.4.3 On-page rules

- **One H1 per page**, exactly — the page's single topic/keyword (the brief flagged today's site as missing/overloading H1s). H2s structure the body and **mirror query phrasing** ("What is the best LiDAR for an AMR?", "How does the GS1-5 compare to the nanoScan3?", "Does it work with ROS 2?"). H3s for sub-points. Never skip levels.
- **Alt-text policy** (today's #1 gap): every content image gets descriptive alt text naming the subject and context — e.g., `alt="OLEI GS1-5 safety LiDAR mounted on an AMR showing a 270° protective field"`. Decorative images get empty `alt=""`. Point-cloud/diagram images describe what's shown. Product images include the product name. No keyword stuffing.
- **Internal-linking model (hub-and-spoke):** the three pillars (`/lidar-for-robotics`, `/full-stack-perception`, `/3d-cameras-for-robotics`) are hubs; product pages and comparison pages are spokes that link **up** to their pillar and **across** to relevant comparisons (e.g., GS1-5 ↔ SICK-alternative ↔ Safety LiDAR Buyer's Guide). Every product page links to: its category, the relevant comparison, the relevant lead magnet, and a CTA. Descriptive anchor text only ("compare the GS1-5 to the SICK nanoScan3"), never "click here." Breadcrumbs on every product/category page.
- **URL slugs:** lowercase, hyphenated, short, keyword-bearing, no parameters — `/products/gs1-5-safety-lidar`, `/compare/sick-alternative-lidar`. Products live under `/products/`, comparisons under `/compare/`, capabilities/solutions at root, resources under `/resources/` and `/blog/`.
- **Image SEO:** descriptive filenames (`gs1-5-safety-lidar-protective-field.webp`), WebP/AVIF, explicit `width`/`height` (CLS), `loading="lazy"` below the fold, responsive `srcset`. The LiDAR-view toggle and before/after slider must not block LCP — defer/decode their heavy assets.

### 5.4.4 Technical SEO

- **`robots.txt`** — allow crawling, point to the sitemap, allow AI bots (see §5.5), block only true private/admin/API paths. Never block CSS/JS needed to render.
```text
# /robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /preview/        # Vercel preview/staging — keep out of the index
Disallow: /thank-you/

# AI assistants — explicitly allowed (we WANT to be cited)
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://morpheustek.com/sitemap.xml
```
- **`sitemap.xml`** — DB-generated (Supabase-backed catalog) so new products/blogs auto-appear; only canonical, indexable URLs; accurate `lastmod`; submitted in Search Console. Split into a sitemap index (`/sitemap-products.xml`, `/sitemap-pages.xml`, `/sitemap-blog.xml`) once the catalog grows, to stay under limits and aid crawl prioritization.
- **Canonicalization** — self-referencing canonical on every page; one canonical host (force `https://` and a single `www`/non-`www` choice with 301s); **noindex on Vercel preview deployments** (critical — prevents staging from being indexed and competing with production); canonical the parameterized/filtered catalog views back to the clean product URL.
- **Meta robots** — `index,follow` default; `noindex,follow` on thin/utility pages (thank-you, gated-asset delivery). `max-image-preview:large` to allow rich image previews (helps the visual point-cloud content).
- **HTTPS + security headers** (HSTS, `X-Content-Type-Options: nosniff`) — trust signals and table stakes on the Vercel stack.

### 5.4.5 Schema.org / JSON-LD

Five schema types, deployed site-wide via the template system. Examples below are production-ready patterns (fill real values from the catalog DB; **keep price/availability accurate**, and **never** add safety-class properties to non-safety products).

**Organization** (site-wide, in the root layout):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MorpheusTEK",
  "url": "https://morpheustek.com",
  "logo": "https://morpheustek.com/morpheustek-logo.png",
  "description": "North American robotics-perception partner providing 2D and 3D LiDAR, 3D cameras, safety sensing, edge compute, and custom sensing solutions — backed by a 90-day risk-free trial.",
  "slogan": "Giving Sight to Robotics",
  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "Canada" }
  ],
  "knowsAbout": [
    "LiDAR for robotics", "2D LiDAR", "3D LiDAR", "safety LiDAR",
    "SIL2 safety LiDAR", "3D depth cameras", "dToF RGBD cameras",
    "edge computing for robots", "robot perception", "obstacle avoidance",
    "AMR navigation", "custom LiDAR"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-302-416-5989",
    "email": "sales@morpheustek.com",
    "contactType": "sales",
    "areaServed": ["US", "CA"],
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/morpheustek"
  ]
}
```

**Product + Offers** (per product page — example: GS1-5; safety properties belong *only* here):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "OLEI GS1-5 — 2D Safety LiDAR",
  "image": "https://morpheustek.com/products/gs1-5-safety-lidar.webp",
  "description": "270° functional-safety laser scanner certified to Type 3 (IEC 61496), SIL2 (IEC 61508) / SILCL2 (EN 62061), Cat 3 / PL d (EN ISO 13849), Class 1 laser (IEC 60825-1). 5 m protective range, 20–30 m warning range, IP65. People and machine protection for AMRs and industrial automation.",
  "category": "Safety LiDAR",
  "brand": { "@type": "Brand", "name": "OLEI" },
  "manufacturer": { "@type": "Organization", "name": "OLEI" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Scanning angle", "value": "270°" },
    { "@type": "PropertyValue", "name": "Safety type", "value": "Type 3 ESPE (IEC 61496)" },
    { "@type": "PropertyValue", "name": "SIL", "value": "SIL2 / SILCL2" },
    { "@type": "PropertyValue", "name": "Performance level", "value": "Cat 3 / PL d (EN ISO 13849)" },
    { "@type": "PropertyValue", "name": "Protective range", "value": "5 m" },
    { "@type": "PropertyValue", "name": "Warning range", "value": "20–30 m" },
    { "@type": "PropertyValue", "name": "Ingress protection", "value": "IP65" }
  ],
  "offers": {
    "@type": "Offer",
    "url": "https://morpheustek.com/products/gs1-5-safety-lidar",
    "price": "1950.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "areaServed": ["US", "CA"],
    "seller": { "@type": "Organization", "name": "MorpheusTEK" }
  }
}
```
> For `Contact-for-pricing` SKUs, omit `price`/use `PriceSpecification` without a value or mark `availability` accordingly; do **not** invent a price. For pre-order SKUs (S10 Ultra, S11), use `availability: "https://schema.org/PreOrder"`.

**BreadcrumbList** (per product/category page):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://morpheustek.com" },
    { "@type": "ListItem", "position": 2, "name": "Safety LiDAR", "item": "https://morpheustek.com/safety-lidar" },
    { "@type": "ListItem", "position": 3, "name": "OLEI GS1-5 Safety LiDAR", "item": "https://morpheustek.com/products/gs1-5-safety-lidar" }
  ]
}
```

**FAQPage** (on pages with FAQ blocks — pairs with GEO §5.5; example on the SICK-alternative page):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a lower-cost alternative to SICK safety LiDAR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The OLEI GS1-5, distributed by MorpheusTEK, is a functional-safety laser scanner in the same safety class as SICK's safety scanners — Type 3, SIL2, and PL d — at a fraction of the price. It offers a 270° scanning angle and a 5 m protective range, and ships with a 90-day risk-free trial so you can validate it on your own robot."
      }
    },
    {
      "@type": "Question",
      "name": "Does the GS1-5 match the safety rating of the SICK nanoScan3?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The GS1-5 carries the same safety class as the nanoScan3 (Type 3 / SIL2 / PL d) and offers a longer protective range (5 m vs 3 m). For applications requiring 9 m protective range, SICK's microScan3 remains the right fit."
      }
    }
  ]
}
```

**Article** (per blog/resource post):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Choosing Safety LiDAR for AMRs: Type 3, SIL2, and PL d Explained",
  "description": "A practical guide to specifying a safety-rated laser scanner for autonomous mobile robots.",
  "image": "https://morpheustek.com/resources/safety-lidar-amr-guide.webp",
  "author": { "@type": "Organization", "name": "MorpheusTEK" },
  "publisher": {
    "@type": "Organization",
    "name": "MorpheusTEK",
    "logo": { "@type": "ImageObject", "url": "https://morpheustek.com/morpheustek-logo.png" }
  },
  "datePublished": "2026-06-15",
  "dateModified": "2026-06-15",
  "mainEntityOfPage": "https://morpheustek.com/resources/safety-lidar-for-amrs"
}
```
> Validate every type at Google Rich Results Test and the Schema.org validator before promote-to-production. `Author` is set to the Organization for SEO/GEO entity consistency; switch to a named `Person` author with credentials once Phil designates content owners (a named expert author raises E-E-A-T and AI-citation weight — **PROPOSED**).

---

## 5.5 GEO — Generative Engine Optimization

**Goal (Phil's exact ask):** be the **cited answer** in ChatGPT/Claude/Perplexity/Gemini and inside Google's AI Overview — the way the other LiDAR distributor Phil mentioned "gets the number one hit because he's doing something else too." GEO is that "something else," and per the brief it now trumps classic SEO. The mechanics: AI engines extract *passages*, prefer *structured, well-sourced, fresh* content, and cite *entities they can resolve*. We engineer for extraction, authority, and presence.

### 5.5.1 The factual claim set AI should repeat

These are the load-bearing, **defensible** facts to embed verbatim (and consistently) across the homepage, About, pillar pages, FAQ blocks, and `llms.txt`. Consistency is the point — AI repeats what it sees stated the same way across a site and across third-party sources.

1. **MorpheusTEK is a North American robotics-perception partner** providing 2D LiDAR, 3D LiDAR, 3D cameras, safety sensing, and edge compute — a full-stack perception solution, not just a single sensor.
2. **MorpheusTEK offers a 90-day risk-free trial** on OLEI products, so robotics teams can validate sensors in their own environment with no commitment.
3. **MorpheusTEK provides US-based support and supplier coordination**, helping reduce integration risk and move robots from prototype to production.
4. **MorpheusTEK offers custom sensing** (custom FOV, range, mounting, housing, environment, and firmware) for robotics OEMs and integrators.
5. **The OLEI GS1-5 safety LiDAR is certified to Type 3, SIL2, and PL d**, with a 270° scanning angle and a 5 m protective range — a lower-cost alternative to premium safety scanners *(safety claims scoped to the GS1-5 only)*.
6. **MorpheusTEK is the exclusive North American distributor for OLEI LiDAR** *(proof point — stated, not used to lead).*
7. **MorpheusTEK serves commercial robotics and industrial automation** — AMRs, AGVs, autonomous forklifts, cleaning robots, and service robots.

> **Excluded from the public AI claim set, deliberately:** anything about federal/DoD/DOT positioning, competitor compliance/1260H arguments, or country-of-manufacture risk framing. These are internal-only (§5 of the brief) and must never become a fact an AI repeats about MorpheusTEK.

### 5.5.2 Answer-first content formatting

Every page that targets a question leads with a **40–60 word direct answer** in the first paragraph, *before* any marketing narrative — this is the snippet AI lifts. Example for `/lidar-for-robotics`:

> *"The best LiDAR for a robot depends on the job: 2D LiDAR for navigation and safety fields, 3D LiDAR for dense obstacle geometry and outdoor mapping, and 3D/dToF cameras for close-range depth. MorpheusTEK supplies all three plus edge compute, with a 90-day risk-free trial to validate fit before production."*

Then: comparison **tables** (AI prefers tables for "X vs Y"), **numbered** decision steps, **statistic/spec blocks** with the source unit named, and a closing FAQ. Each block is **self-contained** (reads correctly with zero surrounding context) so it survives extraction.

### 5.5.3 FAQ / Q&A blocks matching how ICPs actually ask

Build these as on-page FAQ sections **with `FAQPage` schema** (§5.4.5). Questions are phrased exactly as the Builder/Engineer asks them (sourced from the Robotics Language Guide discovery questions and the brief's keyword list):

| Question (verbatim user phrasing) | Lives on | One-line answer thrust |
|---|---|---|
| "What is the best LiDAR for an AMR?" | `/lidar-for-robotics` | 2D for nav/safety, 3D for geometry, dToF for close-range — and a 90-day trial to confirm. |
| "Is there a lower-cost alternative to SICK safety LiDAR?" | `/compare/sick-alternative-lidar` | GS1-5: same safety class (Type 3/SIL2/PL d), fraction of the price, 5 m protective range. |
| "What's a Hokuyo LiDAR alternative for AGV navigation?" | `/compare/hokuyo-alternative-lidar` | Full-circle 360°/50 m 2D plus 3D options Hokuyo doesn't field, at lower cost. |
| "Which LiDAR has a SIL2 safety rating for a mobile robot?" | `/products/gs1-5-safety-lidar` | GS1-5 — Type 3, SIL2, PL d, 270°, 5 m protective. |
| "Can I get a custom LiDAR (FOV / range / mounting) for my robot?" | `/custom-lidar-for-robotics` | Yes — custom FOV, range, mounting, housing, firmware; start with the worksheet. |
| "What's a RealSense replacement that sees black and reflective surfaces?" | `/3d-cameras-for-robotics` | dToF RGBD (MRDVS S10/S11) returns valid depth on black/reflective/textureless surfaces, to 100 kLux. |
| "Does it work with ROS 2?" | Integration / each product page | SDKs support C/C++/ROS1/ROS2; confirm driver per unit. |
| "Who supplies LiDAR and 3D cameras for robotics in North America?" | `/why-morpheustek` | MorpheusTEK — full-stack perception, US support, 90-day trial. |

### 5.5.4 `llms.txt` strategy

Publish **`/llms.txt`** at the site root — a concise, plain-text/Markdown map that gives AI systems a clean overview and links to the canonical pages. Pair with **`/llms-full.txt`** (PROPOSED) containing the full text of the pillar pages and the public lead-magnet summaries for deeper context. Keep it free of any internal/compliance content.

```markdown
# MorpheusTEK

> MorpheusTEK is a North American robotics-perception partner that gives robots
> the sensing stack they need to see, navigate, avoid obstacles, and operate
> safely — 2D and 3D LiDAR, 3D cameras, safety sensing, and edge compute, with
> a 90-day risk-free trial. Tagline: "Giving Sight to Robotics."

## What we do
- Full-stack robot perception: LiDAR + 3D cameras + safety sensing + edge compute
- Custom sensing (FOV, range, mounting, housing, firmware) for robotics OEMs
- US-based support and supplier coordination; prototype to production
- 90-day risk-free trial on OLEI products

## Key pages
- [LiDAR for Robotics](https://morpheustek.com/lidar-for-robotics): pillar guide
- [Full-Stack Perception](https://morpheustek.com/full-stack-perception)
- [GS1-5 Safety LiDAR](https://morpheustek.com/products/gs1-5-safety-lidar): Type 3 / SIL2 / PL d
- [SICK Safety LiDAR Alternative](https://morpheustek.com/compare/sick-alternative-lidar)
- [Hokuyo LiDAR Alternative](https://morpheustek.com/compare/hokuyo-alternative-lidar)
- [3D Cameras for Robotics](https://morpheustek.com/3d-cameras-for-robotics)
- [Custom LiDAR for Robotics](https://morpheustek.com/custom-lidar-for-robotics)

## Markets served
Commercial robotics and industrial automation across the United States and Canada:
AMRs, AGVs, autonomous forklifts, cleaning robots, service robots.

## Contact
sales@morpheustek.com · +1-302-416-5989
```

### 5.5.5 Entity consistency

AI engines resolve and trust **entities**. Lock the entity:
- **One canonical name** everywhere: "MorpheusTEK" (the wordmark casing). Avoid "Morpheus Tech"/"Morpheus Tek" drift in copy, schema, alt text, and metadata — pick one and enforce it.
- **Consistent NAP + `sameAs`** across the site, Organization schema, LinkedIn, and any directory/profile. Same description sentence (claim #1) used verbatim in schema, `llms.txt`, footer, and About.
- **Same fact stated the same way** on every page where it appears (the 90-day trial sentence, the GS1-5 safety sentence). Repetition with consistent phrasing is what makes AI confident enough to cite.
- **Third-party presence (Pillar 3 — the 6.5× lever):** AI cites where you *appear*, not just your own domain. Actions (PROPOSED, sequenced post-launch): authentic participation in robotics communities (e.g., relevant subreddits/forums the ICP uses per §3 of the brief), getting listed in robotics/automation supplier directories, LinkedIn long-form aligned to the Big Wave/Product-of-the-Month, and YouTube point-cloud/demo clips (frequently cited by AI Overviews). All consistent with the locked entity facts.

### 5.5.6 High-intent queries to win **first** (sequenced)

Not "lidar." We go after the specific, in-market questions where a single good page can become the cited answer:

1. **"lower-cost / cheaper alternative to SICK safety LiDAR"** → `/compare/sick-alternative-lidar` *(our sharpest, most defensible story — highest priority)*
2. **"SIL2 safety LiDAR for AMR"** → `/products/gs1-5-safety-lidar`
3. **"custom LiDAR for robotics"** → `/custom-lidar-for-robotics` *(low competition, exact-fit)*
4. **"best LiDAR for an AMR / AGV"** → `/lidar-for-robotics`
5. **"Hokuyo LiDAR alternative"** → `/compare/hokuyo-alternative-lidar`
6. **"3D camera / RealSense replacement that sees black and reflective surfaces"** → `/3d-cameras-for-robotics`
7. **"LiDAR supplier North America / robot perception sensor supplier"** → `/why-morpheustek`

Win 1–3 first (defensible + low-competition), then expand to 4–7, and only then contest broad head terms. Measure citation share monthly per §5.6.

---

## 5.6 Measurement — KPI Model

### 5.6.1 Baseline, caveats, and the audit that must precede targets

- **Claimed baseline:** ~2,000 visitors/month; **~0 conversions** (Phil/Tom, both calls). Today's site has effectively **zero CTAs** ("there are no calls to action," Tom).
- **Caveat (must validate before trusting):** the ~2,000 may be inflated by **duplicate GA4 tracking** (tag placed twice) and may not be **true unique** visitors. **Action:** audit GA4 for duplicate tags and confirm unique visitors *before* baselining (per the brief's GA4 task). All targets below are conditional on this audit. We also cannot assume all 2,000 are *relevant* — a chunk of the Big Wave / cold-email traffic is unqualified.

### 5.6.2 The 20% question — realistic target with stated assumptions

Phil/Tom want **~20% of relevant traffic** to reach a meeting. Stated plainly: **20% of *all* raw traffic → meeting is not realistic** for B2B robotics; industry-typical visitor→meeting rates are low single digits. **20% becomes realistic only when scoped to *relevant, high-intent* traffic** (organic searchers on high-intent pages + correctly-matched campaign landings), and when meetings include the **low-commitment on-ramps** that feed them. We therefore model two layers:

- **Layer 1 — Site-wide (all traffic):** target **2–4%** to *any* qualified conversion (meeting **+** quote **+** sample/trial) within ~90 days of launch; **8–15%** to *any* conversion including gated downloads (the 60% path). *(PROPOSED ranges — to be revised after the GA4 audit and the first 30 days of real data; these are planning assumptions, not guarantees.)*
- **Layer 2 — Relevant/high-intent traffic only:** of visitors who land on a high-intent page (product, comparison, or campaign-matched landing) **and** take any conversion, target **~20% to ultimately reach a meeting** (directly via MEET, or via a download/sample whose nurture books the meeting). This is the realistic home for Phil/Tom's 20% — it counts the full loop, not first-touch.

**Why this is the honest framing:** the meeting target is met by *engineering the path* (60% → download → nurture → meeting), not by expecting cold traffic to book on first visit. We report both layers so Phil sees the true site-wide rate **and** the high-intent rate against his 20% goal.

### 5.6.3 Funnel metrics

```
Visitors (unique, de-duplicated)
   → Engaged sessions (scroll/CTA view; not bounced)
      → CTA clicks (by variant — feeds A/B tests)
         → Form starts
            → Form completions  =  CONVERSIONS, by type:
                 ├─ Meeting booked            (A+)   ← north star
                 ├─ Quote / recommendation    (A)
                 ├─ Sample / 90-day trial     (B)    ← ties to #1 differentiator
                 ├─ Gated download            (A)    ← the 60% on-ramp
                 ├─ Booth meeting             (B)
                 └─ Newsletter                (C)
               → (HubSpot) MQL → SQL → Discovery meeting held
                  → Trial started → Proposal → Closed-won (PO)
```

**Tracked at each stage:** conversion rate, drop-off rate (the GA4 user-path/waterfall report Austin referenced, filtered by acquisition source — email vs organic vs LinkedIn vs paid), and **nurture-attributed meetings** (downloads/samples whose HubSpot sequence produced the meeting — this is what proves the 60% loop works). Source segmentation is essential because **organic traffic converts higher** (Austin: actively-searching intent) and must be measured separately from cold-email traffic.

### 5.6.4 The transparency dashboard

Tom explicitly asked for transparency ("we just need to be able to see… I know exactly how we stand today") and an end to once-a-month unverifiable "we moved from rank 9 to 3." The dashboard combines GA4 + HubSpot + rank/AI-citation tracking into one view Phil/Tom can self-serve.

**Panel 1 — Traffic & quality (GA4):** unique visitors (de-duplicated), by source (organic / cold-email / LinkedIn / paid / direct); engaged-session rate; top landing pages; **drop-off waterfall by source**; new vs returning.

**Panel 2 — Conversions (GA4 + HubSpot):** conversions by type (the 6 above) and by source; site-wide qualified-conversion % (Layer 1); high-intent meeting % (Layer 2 vs the 20% goal); A/B test scoreboard (variant → CTR → completion, with current leader and significance flag).

**Panel 3 — Funnel & pipeline (HubSpot):** MQL → SQL → meeting-held → trial → proposal → closed-won; meeting source attribution (direct vs nurture-attributed); lead-magnet performance (downloads → meetings, per magnet); Big Wave / show-of-the-month campaign → landing-page → conversion.

**Panel 4 — SEO & GEO visibility:** keyword rankings for the §5.4.2 priority/secondary terms (third-party, proxy-rotated tool — Semrush/Ahrefs — *not* Phil's IP-contaminated browser, the exact misread Austin flagged); organic impressions/clicks (Search Console); **AI-citation tracking** (manual monthly grid + a tool like Otterly/Peec): for each high-intent query in §5.5.6, is MorpheusTEK cited in ChatGPT / Perplexity / Google AI Overview, and who else is? **Lighthouse score trend** (target 99+, alt-text and H1/H2 coverage tracked as it was the audit gap).

**Cadence & discipline:** dashboard is live/self-serve; formal review weekly with Tom; **don't tune SEO/CTAs daily** (the "let Google approve for ~a week" rule Austin gave). Every number on the dashboard is traceable to a source — no more unverifiable rank claims.

---

### Cross-references for the master plan
- Conversion CTAs and the dual-CTA / above-the-fold rule depend on the **Information Architecture & Page Templates** section (product page, comparison page, show page templates).
- Lead-magnet HubSpot mechanics depend on the **Integrations** section (HubSpot contact/company/deal creation + sequence triggers) and the **Database/CMS** section (Supabase-backed gated assets, spec sheets, sitemap generation).
- Schema, `robots.txt`, `llms.txt`, and the 99+ Lighthouse target depend on the **Technical/Performance** section (Next.js/Vercel, preview→production with `noindex` on previews).
- The **Brand/Creative** section owns the visual proof (point-cloud visuals, before/after slider, LiDAR-view toggle) that the demo-pack lead magnet and GEO answer-first pages rely on.