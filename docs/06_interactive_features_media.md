# Signature Interactive Features & AI Media Production

> MorpheusTEK website — detailed plan section. Part of the master build plan.

---

I have enough grounding to write a precise, buildable section without burning credits on live model queries. The brief already names Higgsfield, image+video, "angles"/perspective, and image→video as the toolset. I'll write the deliverable now, referencing the standard Higgsfield model families (Soul for image, image→video pipelines, the "angles" perspective feature) that Austin demonstrated in the calls.

Here is the section.

---

# Signature Interactive Features & AI Media Production Plan

> *"Giving Sight to Robotics."* This section is the difference between a competent B2B catalog and a site that makes a robotics engineer stop scrolling and book a meeting. Every feature below earns its place by doing one of three jobs: **making perception visual** (so an abstract sensor sale becomes a felt "I can see what this does"), **building trust with Robotics Engineer Skippy** (technical credibility, not gimmickry), or **driving a conversion** (the 90-day trial, a gated download, a booked call). Nothing here is decoration for its own sake — and nothing here is allowed to threaten the 99+ Lighthouse score. Every interactive feature ships with a lighter-weight fallback and a `prefers-reduced-motion` path.

**Stack assumption (grounded in the brief):** Next.js 15 (App Router) + React + TypeScript + Tailwind, deployed on Vercel, Supabase for the asset/spec/catalog DB, HubSpot for forms/CRM. All heavy media is lazy-loaded, served from a CDN (Cloudflare R2 + Vercel Edge — see the Media Pipeline note), and gated behind `IntersectionObserver` so it never blocks first paint. The hero is the *only* above-the-fold media asset that loads eagerly, and even it ships a poster-first strategy.

**Priority key:** **P0** = must-have for the late-June/Automate launch · **P1** = high-impact, ship in the rapid finishing phase or fast-follow · **P2** = delight/flourish, ship when stable.
**Effort key (PROPOSED, for sequencing):** S = ≤1 day · M = 2–4 days · L = 5–10 days, assuming assets are ready.

---

## PART 1 — SIGNATURE INTERACTIVE FEATURES

### 1.1 — Full-Screen AI Hero Video (above the fold) · **P0 · Effort M**

**Concept.** The single most important above-the-fold decision on the site. Austin: *"90% of the websites I'm doing right now is a hero video, all generated."* A cinematic, looping, full-bleed video of an AMR / autonomous forklift moving through a warehouse, with a **MorpheusTEK "eye" sensor visibly mounted on it** and a subtle perception overlay (faint scan lines / point-cloud shimmer emanating from the sensor) that ties directly to the tagline. Text overlay leads with the ICP-A dream headline; one primary CTA, one secondary.

**Exact UX / interaction.**
- Full-viewport (`100svh`, not `100vh`, to avoid mobile URL-bar jump) video, `object-fit: cover`, muted, autoplay, loop, `playsinline`.
- A **dark gradient scrim** (blue→transparent, bottom-left origin) guarantees text contrast (WCAG AA) regardless of video frame — never rely on the video staying dark behind the words.
- Overlay content, left-aligned, max-width ~640px:
  - **H1 (the one H1 on the homepage):** *"Give your robot the right LiDAR, camera, and perception stack to navigate, avoid obstacles, and operate safely — from prototype to production."* (Trim to a tighter on-screen line; full version lives in the H1 for SEO/GEO, with the long-tail framing intact.)
  - Sub-line: *"MorpheusTEK gives robots the sensing stack they need to see, navigate, avoid obstacles, and operate safely in the real world."*
  - **Primary CTA:** "Start a 90-Day Risk-Free Trial" (yellow button, the differentiator). **Secondary CTA:** "Talk to an Engineer" (outline/ghost).
- A persistent, accessible **mute/unmute + pause** control (bottom-right) — required for WCAG 2.2 (any auto-playing media >5s must be pausable). Honor it; persist the choice in `localStorage`.
- Subtle scroll-cue chevron; on scroll, video parallaxes slightly and the overlay fades — *no scroll-jacking* (engineers hate it).

**Where it lives.** Homepage hero. A second, shorter variant on the top-level **Solutions / Perception Stack** page and on key application landing pages (warehouse AMR, autonomous forklift, cleaning robot) — same component, different source clip.

**Technical implementation.**
- Native HTML5 `<video>` (no heavy player library). Sources in **AV1 + H.265/HEVC + H.264 MP4** with `<source>` fallback chain; `preload="none"`, **`poster` is a real first-frame WebP** so the LCP element is the *poster image*, not the video. This is the trick that keeps LCP fast: the poster paints instantly; the video swaps in on `canplay`.
- `IntersectionObserver` + Network Information API: only fetch/play the video when the hero is in view **and** the connection is not `save-data` / `2g` / `slow-2g`. On constrained connections, stay on the poster permanently (it already carries the headline contrast).
- Keep the loop **short (8–12s) and small (target <3–4 MB for the mobile crop)**; long hero loops are the #1 silent Lighthouse killer. Provide a **separate vertical/portrait crop** for mobile (generated via Higgsfield reframe — see Part 2) so mobile isn't downloading a letterboxed desktop file.
- LCP guard: because the poster is the LCP candidate, it is `fetchpriority="high"` and inlined into the critical path; the video element is decorative (`aria-hidden` on the video itself, real text in the DOM overlay).

**Accessibility / reduced-motion / reduced-data.**
- `@media (prefers-reduced-motion: reduce)` → **do not autoplay**; show the poster + a small play button. Motion is opt-in.
- The video is purely ambient and carries no information not present in the text overlay, so no captions are required — but we still mark it `aria-hidden` and ensure the headline/CTAs are fully in the DOM and keyboard-reachable.
- Contrast scrim is non-negotiable: validated against the brightest plausible video frame.

**Fallback (Lighthouse-safe).** If video fails to load, is blocked, or the user is on reduced-data/reduced-motion: the **poster WebP** + text overlay *is* the hero. It looks intentional, not broken. Lighthouse only ever sees the poster as LCP.

---

### 1.2 — "Sensor-View" Theme Toggle (LiDAR / point-cloud / heat-vision mode) · **P0 · Effort L**

**Concept.** The signature, brand-defining interaction — Austin's idea, on Phil's wish list. A *third* viewing mode beyond light/dark: a toggle that flips the **entire site into how a robot sees it** — a stylized LiDAR/point-cloud + thermal-vision aesthetic. This is the literal embodiment of "Giving Sight to Robotics." It is the thing people will screenshot and share, and the thing that makes the abstract product line instantly intuitive.

**How it differs from light/dark mode.** Light/dark is a *palette swap* (table stakes, auto-adapts to OS — see 1.9). Sensor-View is a *rendering mode*: it doesn't just recolor, it **re-skins the world as perception data**. Practically:
- Background shifts to deep blue-black; UI chrome adopts a HUD/heads-up-display treatment with the MorpheusTEK yellow as the "active scan" accent and red as the "alert/zone" accent.
- **Photographic imagery** (hero, application scenes, robot-with-eyeball) cross-fades from the real photo to its **pre-generated point-cloud / depth-map / thermal counterpart** (we generate the paired asset in Higgsfield — see Part 2; this is the same source pairing that powers the Before/After slider, so assets are shared).
- A subtle animated **scan-sweep line** and **circuit-board trace** motif (the brand PCB lines from the flyer) animate across section dividers, reinforced by faint point-cloud particle dots.
- Type stays fully legible — this is a *theme*, not a filter that destroys readability. Body text remains high-contrast; the effect lives in backgrounds, imagery, accents, and dividers.

**Exact UX / interaction.**
- A clearly labeled control in the header, grouped with the light/dark switch: a three-state segmented control or a dedicated **eye-icon toggle** ("View as a robot sees it" tooltip). Uses the OLEI eye motif — on activation, the iris "scans."
- One click → a ~400ms cross-fade transition site-wide (respecting reduced-motion: instant swap, no animation).
- A first-time, dismissible coach-mark: *"This is Sensor-View — see the site the way our LiDAR and 3D cameras see the world. Toggle anytime."*

**Where it lives.** Global (header), persists across every page.

**Technical implementation.**
- Implemented as a **CSS theme via `data-theme="sensor"` on `<html>`** driving CSS custom properties (color tokens, accent tokens, divider treatments) — the same token architecture that powers light/dark. **No re-render of content**, just a class/attribute swap → cheap and instant.
- Image swapping: each photographic asset is authored as a `<picture>`/`<img>` pair where the sensor-view variant is a **second, equally optimized source** that is **lazy-prefetched only after the toggle is first used** (don't pay the byte cost for users who never toggle). Use a small React context (`ThemeProvider`) to coordinate.
- Animated scan-line / particles: pure CSS where possible (`@keyframes` on a masked gradient); for the richer point-cloud particle dividers, a **lightweight canvas** capped at a small particle count and **paused when offscreen** (`IntersectionObserver`) and **disabled entirely on mobile + reduced-motion**. No WebGL/Three.js in the global theme — that's reserved for the one opt-in 3D module (1.8).
- Persist choice in `localStorage` + reflect via the `data-theme` attribute set in an **inline blocking script in `<head>`** (the standard no-flash-of-wrong-theme pattern) so there's no flash on reload.

**Performance / accessibility / reduced-motion.**
- Because it's CSS-token-driven, the toggle adds **near-zero runtime cost** and zero impact on Lighthouse for the default (light/dark) load. The sensor-view image variants are only fetched on demand.
- `prefers-reduced-motion`: all scan animations and particle canvases off; the toggle still works as a static palette/imagery swap.
- Maintain WCAG AA contrast in Sensor-View — audit it as its own theme. The "alert red" must never be the *only* signal for anything (no color-only meaning).
- Keyboard + screen-reader: the toggle is a labeled `button`/`switch` with `aria-pressed`/`aria-checked` and an announced state ("Sensor-View on").

**Fallback (Lighthouse-safe).** Default state is light/dark; Sensor-View is strictly opt-in and additive. If JS is disabled or assets fail, the site renders normally in light/dark — Sensor-View simply never activates. It can never block or slow the baseline experience.

---

### 1.3 — Before/After Point-Cloud Slider · **P0 · Effort S–M**

**Concept.** Austin generated a draft of exactly this on the call; Phil confirmed *"that's exactly the type of imagery."* A draggable split between a **real-world warehouse/robot photo** and the **LiDAR / 3D point-cloud view of the same scene** — *from the robot's perspective, not a car* (Phil was explicit). This is the fastest way to make a non-visual product visceral: "this is what your robot sees."

**Exact UX / interaction.**
- A horizontal (and optionally vertical on mobile) drag handle. Drag/tap-and-hold to reveal more of either side. On load, an animated auto-sweep runs once (then stops) to signal it's interactive. Handle has a clear grabber + "drag" affordance and a center divider line styled in brand yellow.
- Labels pinned to each side: **"Real World"** / **"What the robot sees"** (point cloud). A small caption identifies the sensor that produced the view (e.g., "OLEI LR-16F-100 · 3D LiDAR").
- Works with mouse, touch, **and keyboard** (focus the handle → arrow keys move the split; `Home`/`End` snap to edges).

**Where it lives.** A homepage "see perception" section; repeated on **3D LiDAR**, **2D LiDAR**, and **3D Camera** category pages with sensor-appropriate pairs (2D pair shows a 2D SLAM line-map; 3D pairs show dense point clouds; camera pair shows an RGB-D / depth view). Also the natural anchor for a **"Sample Point-Cloud / Application Demo Pack"** gated download CTA (a confirmed ICP-A lead magnet).

**Technical implementation.**
- Two stacked, identically-sized images; reveal via CSS `clip-path: inset()` driven by a single state value (the split %). No library strictly required (~60 lines), but if used, prefer a tiny dependency-free implementation over a heavy carousel lib.
- Both images are responsive `<picture>` (AVIF/WebP), lazy-loaded via `IntersectionObserver`, with explicit `width`/`height` to reserve layout (zero CLS).
- Pointer Events API (unified mouse/touch); `requestAnimationFrame`-throttled updates; `touch-action: none` on the handle only.

**Performance / accessibility / reduced-motion.**
- `prefers-reduced-motion`: skip the intro auto-sweep; render at a sensible default split (e.g., 50%).
- Each image has descriptive `alt` (feeds SEO and screen readers — directly fixes the current site's missing-alt-text problem). Provide a visually-hidden text alternative describing what the comparison shows.
- Tiny JS, two optimized images → negligible Lighthouse impact.

**Fallback (Lighthouse-safe).** No-JS / failure → the two images render **side-by-side** (or stacked) with their labels. Still communicates "real vs. perception." Nothing breaks.

---

### 1.4 — 2D vs 3D LiDAR vs Depth-Camera Comparison + Safety-Field / Protective-Zone Diagram · **P0 · Effort M**

Two related interactive explainers that do heavy lifting for ICP-B (the engineer) and tie straight to the catalog.

**(A) Sensor-type comparison.**
- **Concept.** An interactive, tabbed/segmented module — **2D LiDAR · 3D LiDAR · Depth Camera** — each showing an animated stylized visualization of *how that sensor perceives a scene* (2D: a single scanning plane sweeping; 3D: a volumetric point cloud filling out; Depth camera: a near-field RGB-D frustum with depth shading). Pulls directly from the Robotics Language Guide's strengths/fit/watch-outs table.
- **UX.** Tap a sensor type → the central visualization morphs + a concise spec/fit panel updates ("Best for: AMR navigation, safety zones…", "Watch-out: sees one plane unless tilted"). Each links to the matching catalog category and recommended product (e.g., 2D → LR-1F / GS1-5; 3D → LR-16F-100; Depth → MRDVS S10 / Percipio).
- **Implementation.** SVG + CSS/Web Animations API (no 3D engine — these are *stylized diagrams*, not real renders). State-driven, fully keyboard-navigable tablist (`role="tablist"`/`tab`/`tabpanel`, arrow-key roving tabindex). Lightweight.

**(B) Safety-field / protective-zone diagram.**
- **Concept.** Recreate the flyer's safety zone graphic as an interactive diagram: a robot/AGV at center with **Warning Zone 1**, **Warning Zone 2**, and a **Protection Zone**, each as a colored arc/field. This is the GS1-5's story made visual.
- **UX.** Hover/tap a zone → it highlights and explains its function ("Protection Zone: intrusion here triggers a safety-rated stop"). An optional slider lets the user **resize the protective field (e.g., the GS1-5's up to 5 m protective range vs. warning range)** and watch the zones scale — concretely demonstrating the 5 m protective / 20–30 m warning envelope.
- **⚠ Certification-language guardrail (HARD RULE).** All precise safety claims (**Type 3 / SIL2 / PL d**) attach **only to the GS1-5** and are labeled as such inline. The diagram's copy must never imply other products are safety-rated. The Robotics Language Guide's caution is enforced in the microcopy: standard perception sensors support *awareness*; a *safety-rated function* requires the correct architecture.
- **Implementation.** SVG arcs driven by a range value; CSS transitions; `role="img"` + visually-hidden description for the static state, with interactive zones as labeled buttons.

**Where they live.** Comparison on the **Solutions / Perception Stack** hub and relevant category pages; the safety-zone diagram on the **GS1-5 product page** and the **Safety LiDAR** category page (and as a supporting visual for the "SICK Alternative" comparison content).

**Reduced-motion / fallback.** Reduced-motion → diagrams render in a static, fully-labeled end state (no sweep/morph animation). No-JS → static SVG with all zones/labels visible and a caption. SVG means crisp at any DPI, tiny bytes, zero Lighthouse risk.

---

### 1.5 — "Build-on-Scroll" Product Animation · **P1 · Effort L**

**Concept.** Austin's window-company example, applied to robotics: as you scroll, a robot **assembles its sensor stack** — or a single LiDAR unit **explodes into its components/specs** — with callouts firing for each feature. This makes the "full-stack" message *literal*: navigation LiDAR snaps on, then safety LiDAR, then 3D camera, then the Sintrones edge-compute "brain," each with a one-line benefit. It visually argues the core differentiator: *one partner, one integrated stack, less integration risk.*

**Exact UX / interaction.**
- A pinned/sticky section; as the user scrolls through it, a sequence of states advances (component flies in → callout label appears → next). Scroll *drives* the animation but **does not hijack** it — the user can scroll past at any time; we never trap them. Progress is mapped to scroll position, not forced.
- Two candidate executions (recommend the first for launch): **(a)** a robot silhouette gaining sensors with labeled callouts (warmer, "your robot, equipped"); **(b)** an exploded-view of the GS1-5 or LR-16F rotating into labeled specs (more technical, great on a product page).

**Where it lives.** Homepage "Full-Stack Perception" section (robot-assembles version) and/or a flagship product page (exploded-view version).

**Technical implementation.**
- **Image-sequence (sprite-frame) approach, not WebGL**, for the launch version: pre-render the assembly as an ordered set of optimized frames (or a handful of layered transforms) and advance them on scroll. This is dramatically lighter and more reliable than a live 3D scene and keeps Lighthouse safe.
- Use a small scroll library (e.g., a thin `IntersectionObserver` + scroll-progress hook, or GSAP ScrollTrigger if the timeline complexity justifies it) — but **lazy-load the animation engine and frames only when the section approaches the viewport**, and only on viewports above a width threshold.
- Decode frames progressively; cap frame count; serve as AVIF/WebP. Never block initial render.

**Performance / accessibility / reduced-motion.**
- `prefers-reduced-motion`: **render the final, fully-assembled state as a single static image with all callouts visible** — the message lands without any scroll animation. This is the primary fallback and must be authored as a first-class deliverable, not an afterthought.
- The information in the callouts is also present as real text (a labeled feature list) so screen-reader users and crawlers get everything; the animation is an enhancement layered on top.
- Mobile: default to the static assembled image (scroll-driven sprite sequences are heavier and jankier on phones); only enable the animation on larger screens with good connections.

**Fallback (Lighthouse-safe).** Static final-state image + text feature list. The scroll choreography is pure progressive enhancement.

---

### 1.6 — Rotating Mega-Menu with Featured Product · **P0 · Effort M**

**Concept.** Austin recommended a half-page mega-menu; Phil needs it **scalable** (DB-backed) as the catalog grows, and confirmed B2B engineers want to get to specs fast. A rich, imagery-led mega-menu organized by **category** (2D LiDAR · Safety LiDAR · 3D LiDAR · Solid-State · 3D Cameras · 1D Rangefinders · 3D Mapping · Edge Compute) with a **rotating "Featured / Product of the Month"** panel.

**Exact UX / interaction.**
- Hover (desktop) / tap (mobile) the nav item → a half-viewport panel opens: left = category list with icons; center = the products in the hovered category (name + the 1–2 critical specs above the fold, per Phil's spec-first requirement); right = a **Featured Product panel** with imagery that **rotates** (e.g., GS1-5 this month) and a CTA ("View product" / "Start a trial").
- The rotation is gentle and **pauses on hover/focus**; it's a content rotator, not a distracting auto-carousel. Driven by the same "Product of the Month" data that powers the Big Wave email + LinkedIn — single source of truth.

**Where it lives.** Global header navigation.

**Technical implementation.**
- Content from **Supabase** (products, categories, featured flag/schedule) so Phil's team edits it without a developer — directly serves the "if I get hit by a bus" requirement. Rendered server-side for SEO/GEO (the mega-menu links are real, crawlable `<a>` tags — important for internal linking and AI discoverability).
- Images optimized + lazy-loaded; the featured rotator preloads only the next image.
- Full keyboard support (WCAG menu pattern): focus opens the panel, `Esc` closes, arrow keys move within, focus is trapped appropriately and returns on close. Mobile uses an accessible disclosure/accordion, not hover.

**Performance / accessibility / reduced-motion.**
- Reduced-motion: rotation becomes a static featured product (or advances only on explicit user action). Provide visible prev/next controls so it's never motion-only.
- Because links are SSR'd and images lazy-load, the menu adds nothing to LCP.

**Fallback (Lighthouse-safe).** No-JS → a standard accessible nav with category links (the SSR'd `<a>` structure still works). The rich panel is enhancement.

---

### 1.7 — "Robot with a MorpheusTEK Eyeball" Ambient Background Scene · **P1 · Effort M**

**Concept.** Tom's explicit request: *"build a robot with a MorpheusTEK eyeball on it… running around there in the background."* An ambient, AI-generated robot (AMR/forklift) bearing the MorpheusTEK eye motif, living as a quiet background element in select sections — making the brand's "eye = vision/awareness" identity tangible without shouting.

**Exact UX / interaction.**
- A subtle, looping background scene (or a parallax still that gently animates — the eye "scans," a faint perception overlay pulses) behind a content section (e.g., the "Who We Are / full-stack" band, or a footer pre-CTA band). Low contrast, never competes with foreground text.
- In **Sensor-View mode**, this robot's perception overlay intensifies (it's the natural showpiece for the toggle).

**Where it lives.** One or two homepage bands + the brand/about section. *Not* behind dense spec content (engineers want clean spec pages).

**Technical implementation.**
- Prefer a **looping ambient video or a CSS/canvas-animated still** depending on weight; treat it with the **same poster-first, lazy, reduced-data discipline as the hero**. Keep it small and offscreen-paused.
- Decorative → `aria-hidden`, never carries information.

**Reduced-motion / fallback.** Reduced-motion → static image. Reduced-data → static image or omitted. Decorative, so omission costs nothing semantically.

---

### 1.8 — Live Point-Cloud / SLAM-Map Visual Element · **P1 · Effort M–L**

**Concept.** *"We're giving sight to robotics"* made literal and a little mesmerizing — a live, animated point-cloud or 2D **SLAM map being built** (the robot path tracing walls into existence, exactly the 2D SLAM example Phil shared on the call). The clearest possible proof that MorpheusTEK lives in perception data.

**Exact UX / interaction.**
- A contained visual module (not full-page): either **(a)** a 2D SLAM map animating as if a robot is mapping a warehouse (lightweight, recommended for launch), or **(b)** a slowly rotating 3D point cloud the user can drag to orbit (richer, heavier — gate behind opt-in).
- Optional: a small "live data" framing ("This is how an AMR maps a 10,000 sq ft warehouse in real time") to reinforce the application story.

**Where it lives.** Homepage "see perception" zone and/or the 3D LiDAR / 3D Mapping category pages.

**Technical implementation.**
- **2D SLAM (launch):** Canvas 2D or animated SVG drawing a path + accreting wall points — **tiny, no 3D library**. This is the P1 default.
- **3D point cloud (opt-in flourish):** Three.js / `react-three-fiber` rendering a **decimated** point cloud (a few thousand points max, not the raw millions). This is the **only** place WebGL is permitted, it is **lazy-loaded on interaction** ("Explore in 3D" button — don't ship the 3D engine to users who don't click), capped by device/connection, and disabled on low-end/mobile. Real point-cloud data from Phil's suppliers replaces the placeholder later.

**Performance / accessibility / reduced-motion.**
- The Three.js bundle is **never in the initial JS payload** — dynamically imported only when the user opts in. This protects TBT/Lighthouse.
- Reduced-motion → static representative point-cloud/SLAM image with a caption.
- Provide a text description; the 3D canvas is supplementary, not the only source of meaning.

**Fallback (Lighthouse-safe).** Static point-cloud / SLAM-map image. The animated/3D versions are strictly additive and code-split.

---

### 1.9 — Light/Dark Mode · **P0 · Effort S**

**Concept.** Table stakes (the brief calls it out explicitly), and the architectural foundation that the Sensor-View toggle (1.2) extends. Auto-adapts to OS preference; user can override.

**Implementation.** CSS custom-property token system; `prefers-color-scheme` default; inline head script to set `data-theme` before paint (no flash); choice persisted in `localStorage`. Both palettes hold the brand (bold yellow + blue + red, circuit-board accents) and pass WCAG AA. This is the same token plumbing Sensor-View reuses — build it once, cleanly.

**Reduced-motion / fallback.** Theme transitions respect reduced-motion (instant, no cross-fade). No-JS → respects OS preference via CSS only.

---

### 1.10 — Live "Active Projects / Terminal" Element · **P2 · Effort S–M**

**Concept.** Austin's own-site flourish: a small terminal-style widget hinting at live activity. Recast for MorpheusTEK as a **credibility ambient** — *not* a real ops feed (no customer names without approval — HARD RULE).

**Exact UX / interaction.**
- A compact, monospaced "terminal" that types out **anonymized, approved** status lines, e.g.:
  `> deploying GS1-5 trial unit → AMR integrator (Midwest)`
  `> point-cloud validated · obstacle avoidance ✓`
  `> 90-day trial active · 14 days remaining`
  Pure brand storytelling, on the circuit-board aesthetic. Cycles through a small, curated, **non-identifying** script.

**Where it lives.** A homepage "how we work / proof" band or footer. **P2** — ship only after the P0/P1 set is solid.

**Technical implementation.** Trivial JS typewriter on a fixed array of approved strings (or Supabase-driven so Phil controls the copy). No real data, no PII, no customer identification — content is reviewed/approved, consistent with the "no customer names/logos without approval" rule. Decorative.

**Reduced-motion / fallback.** Reduced-motion → static list of the lines (no typing). No-JS → static list. Tiny footprint.

> **Compliance guardrail across all features:** none of these elements may surface federal/DoD/DOT positioning or compliance claims — that's **internal-only**. The terminal, captions, and any "applications" framing stay strictly commercial-robotics. OLEI/supplier names appear as *proof points* (product pages, manufacturing-strength proof section) and never dominate the hero or ambient features.

---

### Feature Priority Summary

| # | Feature | Priority | Effort | Primary job |
|---|---|---|---|---|
| 1.1 | AI Hero Video | **P0** | M | Stop-scroll + lead CTA (trial) |
| 1.2 | Sensor-View Toggle | **P0** | L | Signature brand moment |
| 1.3 | Before/After Point-Cloud Slider | **P0** | S–M | Make perception visceral |
| 1.4 | 2D/3D/Depth Comparison + Safety-Zone | **P0** | M | ICP-B credibility, GS1-5 story |
| 1.6 | Rotating Mega-Menu | **P0** | M | Scalable catalog UX |
| 1.9 | Light/Dark Mode | **P0** | S | Table stakes + token foundation |
| 1.5 | Build-on-Scroll | **P1** | L | "Full-stack" made literal |
| 1.7 | Robot-with-Eyeball Ambient | **P1** | M | Brand identity (the eye) |
| 1.8 | Live Point-Cloud / SLAM | **P1** | M–L | "Giving sight" proof |
| 1.10 | Active-Projects Terminal | **P2** | S–M | Credibility flourish |

---

## PART 2 — AI MEDIA PRODUCTION LIST (Higgsfield)

**Toolset (grounded in the calls):** **Higgsfield** for image generation, **"angles" / perspective generation** (Austin: *"hit angles and get as many angle shots of this exact same image… a whole photo shoot"*), and **image→video**. Workflow per asset: generate the master still → use **angles** to spin a coherent set → select → **image→video** for any motion asset → **reframe** for mobile/social crops.

**Global brand + style spec (paste into every prompt's style block):**
> *Cinematic, high-end industrial-tech photography. Brand palette: bold MorpheusTEK/OLEI yellow (#FFD200) and royal/navy blue (#005EB8–#0B2A6B), with a red/orange accent (#F05A28) used sparingly for the "eye"/alert. Subtle circuit-board / PCB line traces and a stylized eye motif where appropriate. Clean, confident, technical, premium — not cartoonish. Realistic robotics: AMRs, autonomous forklifts/AGVs, robotic floor-cleaning machines, warehouse/factory/logistics environments. Crisp depth of field, controlled lighting, slight haze for depth.*

**Global negative prompt (paste into every generation):**
> *No cars, no passenger vehicles, no automotive/self-driving-car scenes. No food, no beverages, no restaurant/kitchen scenes. No humanoid sci-fi fantasy robots, no cute/toy robots. No fake/garbled text, no gibberish logos, no real competitor logos (no SICK, Hesai, Ouster, etc.), no real customer logos. No watermarks. No gore, no weapons, no military/defense imagery. No clutter, no low-res, no oversaturation, no uncanny faces.*

**⚠ AI-content + asset-replacement note (HARD RULE, applies to the whole list):** Treat every AI asset below as a **launch placeholder destined for replacement.** Phil will supply **real product video and point-cloud footage** from suppliers; **partner application footage** (Ross Video, Tennant, Anatech, BrainOS, Aethon) exists but must be **logo-stripped/anonymized and explicitly approved before any public use.** Don't represent AI imagery as real where it matters (some platforms flag AI content — Austin's caution). Author the build so swapping an AI placeholder for real footage is a single DB/CDN file replacement (consistent slugs), not a rebuild.

---

### Priority P0 — launch-critical assets

**1. `hero-warehouse-amr-perception.mp4` (+ poster `.webp`)** · *Used:* homepage hero (1.1) · *Spec:* 16:9, 1920×1080, 8–12s seamless loop, plus a 9:16 mobile crop and a real first-frame WebP poster.
> Prompt: *Cinematic wide tracking shot inside a vast modern logistics warehouse, golden-hour light hazing through high windows. A sleek autonomous mobile robot (AMR) glides down an aisle between tall racking, a glowing MorpheusTEK yellow "eye" sensor mounted on its front. Faint blue point-cloud scan lines and circuit-board traces emanate softly from the sensor, suggesting LiDAR perception. Premium, confident, slightly futuristic but grounded and real. Yellow and royal-blue accents. Shallow depth of field, slow dolly motion.* → generate still, **angles** for 3–4 framings, pick best, **image→video** (slow forward dolly, subtle scan pulse), **reframe** to 9:16.

**2. `hero-poster-warehouse-amr.webp`** · *Used:* hero LCP poster + reduced-data fallback · *Spec:* 16:9 + 9:16, high-quality WebP, the exact first frame of asset 1 (generated as a still so it's pin-sharp). Carries the headline contrast on its own.

**3. `robot-eyeball-amr.webp`** · *Used:* ambient robot-with-eyeball (1.7), Sensor-View showpiece, OG fallback · *Spec:* 16:9 + a transparent-friendly framing. *(Tom's request.)*
> Prompt: *A purpose-built autonomous warehouse robot, clearly engineered and manufactured (not a toy), with a prominent stylized MorpheusTEK "eye" sensor as its visual centerpiece — the eye subtly glowing, red/orange iris accent. Industrial yellow-and-blue body panels with fine circuit-board line detailing. Three-quarter hero angle, clean studio-meets-warehouse lighting, volumetric haze. Looks real, premium, and field-ready.* → **angles** to get front / three-quarter / profile / scanning poses; **image→video** for the ambient "eye scans" loop.

**4. `before-after/3d-lidar-warehouse-{real,pointcloud}.webp`** · *Used:* Before/After slider (1.3) + Sensor-View image swap (1.2) · *Spec:* a matched PAIR, identical framing, 4:3 or 16:9, robot's-eye POV (NOT a car). Repeat the pair for 2D and depth-camera variants.
> Real prompt: *First-person view from a robot moving through a warehouse aisle — racking, pallets, a forklift ahead, a person at the end of the aisle — natural lighting, photorealistic.*
> Point-cloud prompt: *The exact same warehouse-aisle scene rendered as a dense 3D LiDAR point cloud — millions of small blue-and-yellow points forming the racking, pallets, forklift, and person, on a deep blue-black background, depth-shaded by distance, subtle scan lines. Clean, beautiful, technical.* → generate real first, then use it as a **reference/angles** anchor to produce the perfectly-aligned point-cloud twin.

**5. `safety-zones-gs1-5-diagram.svg/.webp`** · *Used:* safety-field diagram (1.4B), GS1-5 page · *Spec:* clean vector-style diagram; AGV center, Warning Zone 1, Warning Zone 2, Protection Zone as concentric colored fields (yellow warning, red protection). *(Prefer hand-built SVG for the interactive version; AI image is a design-reference comp only.)* Label precisely: **Type 3 / SIL2 / PL d — GS1-5 only.**

**6. Category scene images** `category-{2d-lidar,safety-lidar,3d-lidar,solid-state,3d-camera,rangefinder,3d-mapping,edge-compute}.webp` · *Used:* mega-menu (1.6), category page headers · *Spec:* 16:9 + 4:3 crop, consistent treatment across all eight.
> Prompt (per category, swap the robot/application): *A [autonomous forklift detecting a pallet pocket / cleaning robot navigating a lobby / outdoor AMR mapping a yard / robot arm with a depth camera over a bin] in a clean industrial setting, the relevant MorpheusTEK sensor visible and subtly highlighted with yellow accent and a faint perception overlay. Cinematic, premium, yellow-and-blue palette, circuit-board motif in the background.*

**7. Product hero renders** `product/{slug}-hero.webp` (e.g., `gs1-5-hero`, `lr-1f-hero`, `lr-16f-100-hero`, `mrdvs-s10-hero`, `ibox-602p-hero`) · *Used:* product pages, mega-menu featured panel, Product-of-the-Month · *Spec:* 1:1 + 4:3, consistent studio lighting on a clean gradient (blue→dark) with circuit-board floor reflection.
> Prompt: *Studio product hero of a [sensor type] industrial LiDAR/3D-camera unit — compact, ruggedized, professional casing — on a dark blue gradient backdrop with subtle yellow rim light and faint circuit-board reflection. Three-quarter angle, crisp, premium, photoreal. No text on the device.* → **angles** for front/three-quarter/top/detail; replace with real product photography as Phil supplies it. *(Match casing to real datasheet appearance once references are provided — avoid inventing inaccurate hardware.)*

**8. `og-default.png` + per-page OG images** `og/{page}.png` · *Used:* social/link sharing, GEO/social cards · *Spec:* 1200×630 PNG, headline + eye motif + brand gradient. Generate a template, populate per key page (home, solutions, GS1-5, each category, blog).

**9. Favicon + app icons** `favicon.svg`, `favicon-32.png`, `favicon-180.png`, `icon-512.png`, `maskable-512.png` · *Used:* browser tab, PWA/manifest · *Spec:* the **OLEI/MorpheusTEK eye** simplified to an icon mark (eye + yellow/blue), legible at 16px. Hand-finish the SVG from an AI concept; do not ship raw AI for a favicon.

---

### Priority P1 — high-impact, fast-follow

**10. `build-on-scroll/robot-assembly-frames/` (frame sequence)** · *Used:* Build-on-Scroll (1.5) · *Spec:* ordered AVIF/WebP frames + a single **final assembled static image** (the reduced-motion fallback).
> Prompt: *An exploded-then-assembling view of a warehouse AMR gaining its sensor stack one piece at a time — 360° navigation LiDAR, forward safety LiDAR, a 3D depth camera, and an edge-compute "brain" box — each component clean and labeled-ready, on a neutral studio-blue background with circuit-board underlay. Consistent lighting and camera across all frames.* → generate the assembled master, use **angles**/consistent reference to produce the staged frames.

**11. Application scene images** `application/{warehouse-amr,autonomous-forklift,cleaning-robot,outdoor-amr,inspection-robot,mobile-mapping}.webp` · *Used:* Application Spotlight, solutions pages, blog headers · *Spec:* 16:9 + 4:3.
> Prompt (per application, from the Robotics Language Guide sensor-fit table): e.g. *A commercial floor-cleaning robot navigating a bright retail/airport concourse, MorpheusTEK 2D LiDAR scanning a safety field around it (subtle yellow zone overlay), photoreal and premium.* / *An autonomous forklift approaching a pallet, a 3D camera highlighting the pallet pockets with a faint depth overlay.*

**12. `slam-map-loop.mp4` / `point-cloud-orbit.webp`** · *Used:* Live SLAM/point-cloud module (1.8) · *Spec:* a stylized 2D SLAM-build loop (for the canvas-style reference/placeholder) and a hero point-cloud still for the 3D fallback. **Replace with Phil's real supplier point-cloud footage when available.**
> Prompt: *A top-down 2D SLAM map of a warehouse forming in real time — a moving robot icon tracing aisles while walls and racking accrete as crisp yellow-and-blue point lines on a dark grid, circuit-board aesthetic.*

**13. Booth / trade-show imagery** `booth/{automate,promat,modex}-{wide,detail}.webp` · *Used:* "Shows We'll Be At" / "Meet Us at the Booth" (Section 9), about/brand · *Spec:* 16:9 + 4:3. *(Phil noted AI booth renders already look real — generate a polished, on-brand booth; clearly an illustrative render, swapped for real show photos after each event.)*
> Prompt: *A striking 20×20 trade-show booth in bold MorpheusTEK yellow and royal blue against a sea of plain white/black booths, the eye-logo and "Giving Sight to Robotics" tagline prominent, sensor product displays and a demo AMR, professional expo lighting, busy show floor softly blurred behind.* (No real attendee faces in focus; no real competitor branding.)

**14. Brand texture/background assets** `bg/circuit-traces-{light,dark,sensor}.svg`, `bg/point-cloud-particles.webp` · *Used:* section dividers, Sensor-View motif, ambient backgrounds · *Spec:* seamless/tileable, theme-specific variants. Lightweight SVG preferred.

---

### Priority P2 — polish / nice-to-have

**15. Manufacturing-strength proof imagery** `proof/manufacturing-{1,2}.webp` · *Used:* "Manufacturing Strength Behind the Sensing Stack" proof section · *Spec:* 16:9. *(Convey high-tech laser-measurement manufacturing scale WITHOUT implying specific real facilities/partners — generic, premium clean-room/precision-optics vibe. No real logos.)*

**16. Team/about ambient + secondary hero variants** `about/brand-ambient.webp`, alt hero clips for A/B testing the homepage hero (the brief calls for A/B testing CTAs/hero). · *Spec:* match primary hero specs.

**17. Lead-magnet cover images** `lead-magnets/{sick-hokuyo-checklist,lidar-selection-guide,safety-buyers-guide,custom-requirements-worksheet,sample-pointcloud-pack}.webp` · *Used:* gated download cards/HubSpot forms · *Spec:* 4:3 "document cover" style, on-brand, so each gated asset has an enticing visual.

---

### Replacement / sourcing roadmap (per asset class)

| Asset class | Launch (AI placeholder) | Replace with |
|---|---|---|
| Product hero renders | Higgsfield studio renders | Real product photography (Phil) |
| Point-cloud / before-after | AI point-cloud twins | **Phil's real supplier point-cloud + camera footage** |
| SLAM / 3D module | AI/stylized loop | Real supplier SLAM + point-cloud capture |
| Application scenes | AI robotics scenes | **Anonymized, approved** partner footage (Ross Video, Tennant, Anatech, BrainOS, Aethon — logos stripped, approval first) |
| Booth imagery | AI booth render | Real show photos post-event |

---

## PART 3 — MEDIA PIPELINE NOTE

**Formats & compression.**
- **Images:** author at 2× for retina, serve **AVIF first → WebP fallback → JPEG/PNG last** via `<picture>`/Next `<Image>`. Target: hero poster <150 KB, category/scene images <120 KB, product renders <100 KB, OG images 1200×630 PNG. Every image gets explicit `width`/`height` (zero CLS) and meaningful `alt` text (fixes the current site's missing-alt problem; helps SEO/GEO).
- **Video:** encode **AV1 (primary) + H.265/HEVC + H.264 MP4 (fallback)**; hero loop muted/`playsinline`; target <3–4 MB for the mobile crop, <6–8 MB desktop; always paired with a WebP poster as the LCP element. Provide a 9:16 reframe for mobile. No audio tracks on ambient loops (smaller, no autoplay-sound issues).
- **Vectors:** diagrams and the favicon/eye mark as **SVG** (crisp, tiny, theme-able) wherever the content is illustrative rather than photographic.
- Strip all metadata; lossless-optimize SVGs (SVGO); run AVIF/WebP through a quality-tuned encode (not max quality — perceptual target).

**Where assets live.**
- **Cloudflare R2** (object storage; the Cloudflare account is available) as the **canonical media bucket** for heavy/swappable assets (hero videos, point-cloud footage, large scene images, lead-magnet covers), served via Cloudflare CDN — cheap egress, easy to swap a file without a redeploy.
- **Supabase Storage + Postgres** for **product-bound, DB-managed assets**: product images, spec-sheet PDFs (gated downloads), Product-of-the-Month rotation, blog header images — anything the client edits through the backend without a developer (the "hit by a bus" requirement). Supabase row → public/signed URL.
- **Vercel/Next static + Edge** for small, build-time, rarely-changing assets (favicon set, OG templates, brand background SVGs, critical poster images that must be in the critical path).
- Rule of thumb: **>~50 MB collectively or client-editable → DB/object storage** (per the brief's threshold), not site-hosted. Real supplier footage (often large) goes to R2.

**Naming conventions (kebab-case, consistent, swap-friendly — so an AI placeholder is replaced by editing one file at one slug):**
- Pattern: `{category}/{subject}-{descriptor}-{variant}.{ext}`
- Examples: `hero/warehouse-amr-perception-16x9.mp4`, `hero/warehouse-amr-perception-9x16.mp4`, `hero/warehouse-amr-poster-16x9.webp`, `product/gs1-5-hero-1x1.webp`, `category/safety-lidar-16x9.webp`, `before-after/3d-lidar-warehouse-real.webp`, `before-after/3d-lidar-warehouse-pointcloud.webp`, `diagram/safety-zones-gs1-5.svg`, `og/home.png`, `application/autonomous-forklift-16x9.webp`, `theme/sensor/circuit-traces.svg`.
- **Theme variants** suffixed `-light` / `-dark` / `-sensor` so the Sensor-View toggle resolves the right asset by convention.
- **Provenance flag (PROPOSED):** carry an `is_ai_placeholder` boolean (DB) or an `-ai` slug marker on placeholder assets so the team can query "what still needs real footage" and so AI-content can be managed/declared where platforms flag it (Phil's caution). Drop the marker when replaced with real media.

**Operational discipline.**
- Every interactive feature points at a slug, not an inline import → replacing AI with real footage is a CDN/DB file swap, no code change.
- Partner footage (Ross Video, Tennant, Anatech, BrainOS, Aethon) is **quarantined** until logos are stripped and written approval is on file; until then, AI placeholders stand in. Customer names/logos never ship without approval.
- All media decisions are validated against the **99+ Lighthouse** bar before promote-to-production: poster-first hero, lazy/observer-gated media, code-split WebGL, reduced-data + reduced-motion paths. If an asset can't meet the budget, it ships as its static fallback.