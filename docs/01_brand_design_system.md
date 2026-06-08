# Brand & Design System

> MorpheusTEK website — detailed plan section. Part of the master build plan.

---

I now have full grounding: the MorpheusTEK brand truth, the Stackked structural conventions (spacing/radii/shadow/motion/hover/focus architecture), and the technical product context. I'll write the deliverable — a MorpheusTEK design language that inherits Stackked's *structural rigor* but carries MorpheusTEK's own bold yellow/blue/red eye-motif identity (this is the client's brand, not Stackked's warm-paper brand, so the color/type/personality are MorpheusTEK's own).

---

# 3 · Brand & Design System

> **What this section is.** A production-ready design language for the MorpheusTEK site — exact color tokens, type system, component specs, and motion rules a developer can drop into a Tailwind config on day one — plus a brand guide the MorpheusTEK team keeps and reuses across the booth, the Big Wave cold email, LinkedIn, and spec sheets. Every token is concrete (real hex, real px, real font names). Judgment calls beyond the ground-truth brief are marked **(PROPOSED)** so Phil and Tom can confirm them.
>
> **Inheritance note.** The *structure* of this system — the 4-pt spacing grid, radius ladder, warm-but-tuned shadows, 200ms ease-out motion, the 2px focus-ring discipline, the "one accent moment per view" rule — is ported from Stackked's internal build conventions, so the site is built the way Stackked builds every site. The *identity* — color, type, voice, the eye motif — is 100% MorpheusTEK. This is the client's IP and ships in the GitHub handoff.

---

## 3.1 Brand Foundation

### 3.1.1 Positioning one-liner (the thing the whole design serves)

> **MorpheusTEK is the full-stack perception partner that gives robots sight** — LiDAR, 3D cameras, safety sensing, and edge compute, deployed as one solution, backed by a 90-day risk-free trial and North American support.

The design system exists to make a skeptical robotics engineer ("Skippy") feel, in the first viewport, that this is a *serious technical partner who understands my application* — not a catalog, not "just a distributor." Every visual decision below is in service of three feelings, in order: **competence**, **clarity**, **confidence**.

**Tagline (locked):** *Giving Sight to Robotics.* Never paraphrase it in primary positions. ("Insight to robotics" and "Let perception be reality" are secondary/booth variants — usable as section eyebrows or campaign lines, never as the hero lockup.)

### 3.1.2 Personality adjectives (the design's north star)

Five adjectives, each with a concrete visual instruction so they're enforceable, not decorative:

| Adjective | What it means on screen |
|---|---|
| **Technical** | Specs above the fold; mono numerals; precise FOV/zone diagrams; nothing decorative that a buyer-engineer would read as fluff. |
| **Bold** | Saturated MorpheusTEK yellow used with conviction; large display type (88px+ heroes); high contrast; the eye motif owns space. |
| **Precise** | Tight tracking on headings; exact hairlines; aligned grids; certification language is surgically scoped (SIL2 belongs to GS1-5, full stop). |
| **Confident, not arrogant** | We concede competitors' strengths (never trash SICK) and let proof carry the claim. Visually: calm dark surfaces, restraint, room to breathe. |
| **Nimble / scrappy-but-national** | Fast, light, responsive UI (99+ Lighthouse). Big-brand polish, startup energy — the challenger who moves faster than the incumbent. |

**Voice in UI copy** (inherited Stackked discipline, MorpheusTEK content): sentence case for buttons/nav/headings, em-dashes over parentheses, Oxford commas, no emoji in product UI, no hype words ("blazing fast," "revolutionary," "100% secure"). Talk like a no-nonsense expert engineer. CTAs are plain verbs: *Start a 90-day trial*, *Talk to an engineer*, *Download the guide*.

### 3.1.3 The eye / "Giving Sight to Robotics" motif

The eye is the single most recognizable MorpheusTEK asset ("people recognize our eyeball"). It carries the brand promise literally: *vision, awareness, safety, intelligence.* Design rules:

- **The iris is the brand's heartbeat.** A circular eye form with a **red/orange iris dot** (the OLEI eye lineage) and, where MorpheusTEK-owned, a **LiDAR-scan ring** — concentric arcs or a radial sweep line that reads as "the sensor is actively seeing." (PROPOSED) Use a single 240° sweep arc inside the iris ring to echo the GS1-5 / LR-1F scan geometry — it ties the abstract eye to the actual product.
- **One eye per view, hero-scale or mark-scale, never mid-scale clutter.** The eye is either the *hero subject* (large, animated scan) or a *small mark* (nav, favicon, section anchor). Avoid sprinkling small eyes as bullet decorations.
- **Animated "blink/scan" on load only** (PROPOSED): a one-time 600ms radial sweep across the iris when the hero enters the viewport — reinforces "sensing," respects reduced-motion (static iris fallback).
- **The eye doubles as the light/dark + LiDAR-view affordance.** The sensor-view toggle (3.7.9) can *be* an eye icon: closed/real-world ↔ open/scanning.

### 3.1.4 Expressing "national but nimble/scrappy"

Phil: *"I don't want people to know we're too small… I'd like to project bigger."* Austin: *"Let perception be their reality."* The design projects scale **without claiming it in words**:

- **National scale signals (visual, not stated):** a full-bleed AI hero video, a confident wide grid, a "Shows We'll Be At" map of North American trade-show cities, an edge-to-edge dark "Manufacturing Strength Behind the Sensing Stack" band, consistent enterprise-grade polish on every page. Big companies look *finished* — so we finish everything.
- **Nimble/scrappy signals (the challenger energy):** a live "active projects / now shipping" terminal element (Austin's flourish), fast page transitions, the 90-day-trial badge everywhere (incumbents don't dare offer it), direct *Talk to an engineer* CTAs (no gatekeeping), and a willingness to show real point-cloud output. Speed *is* the brand — the 99+ Lighthouse score is a personality trait, not just SEO.
- **Never** state employee count, "small team," or "startup." Let the booth-grade polish and show presence imply the size.

### 3.1.5 The bold-challenger-to-SICK stance, visually

MorpheusTEK is the challenger; SICK is the incumbent. The stance is **"the upstart with the better deal and nothing to hide,"** never "the cheap knockoff."

- **Yellow is the challenger color.** Phil: most booths are white/black — *"yellow sticks out with blue."* The site weaponizes that. Where competitor sites (SICK, Hesai, Ouster) trend cool blue/black/clinical, MorpheusTEK leads with **confident yellow against deep navy** — instantly differentiated in a sea of blue LiDAR sites.
- **Comparison tables are a signature component** (3.7.7), styled "from quiet to confident" left→right: the incumbent column reads neutral/muted; the MorpheusTEK column reads bold (yellow-accented spec wins, the green "In Stock," the 90-day badge). The visual argument is made before the words are read.
- **Concede gracefully, in design too:** the SICK column is never styled as "bad" (no red X's on SICK quality, no mockery) — it's styled *fair and grey*. We win on the contrast of *value*, not by trashing the incumbent. This matches the golden rule and protects credibility.
- **The protective-zone / safety-field diagram** (warning zone 1/2 + protection zone, like the flyer) is the hero proof object for the GS1-5 — it's where "same safety class, fraction of the price" becomes visual.

---

## 3.2 Color System

Derived from the OLEI×MorpheusTEK booth, flyer (circuit-board header/footer, yellow chevrons), the morpheusTEK wordmark (blue), and the OLEI eye (red/orange iris). Three complete themes ship: **Light**, **Dark**, and the signature **Sensor-View (LiDAR)** theme. All pairings below are checked for **WCAG 2.2 AA** (4.5:1 body text, 3:1 large text ≥24px/≥19px-bold and UI/graphic objects).

### 3.2.1 Brand core palette (raw tokens — theme-independent)

These are the immutable brand hues. Themes reference them; they don't change between modes.

| Token | Hex | Role | Sourced from |
|---|---|---|---|
| `mt-yellow` | `#FFCB05` | **Primary brand / challenger accent** | OLEI/MorpheusTEK booth + flyer yellow |
| `mt-yellow-bright` | `#FFD200` | Hi-vis variant (badges, hero hits) | Booth "Pantone Yellow" register |
| `mt-yellow-deep` | `#E6A700` | Yellow on light bg (AA text fix) | Darkened for contrast |
| `mt-blue` | `#0057B8` | **Primary blue (wordmark "TEK")** | morpheusTEK wordmark royal blue |
| `mt-blue-600` | `#004A9E` | Blue hover/press | Derived |
| `mt-navy` | `#0A2540` | **Deep navy — primary dark surface** | Blue range deepened for backgrounds |
| `mt-navy-900` | `#061626` | Darkest navy (dark-mode base) | Derived |
| `mt-red` | `#E2231A` | **Eye-accent / danger / iris dot** | OLEI eye red |
| `mt-orange` | `#F05A28` | Warm eye-accent / energy / iris glow | OLEI/flyer orange |

> **Token naming convention** (inherited from Stackked's flat-CSS-var approach so it ports to Tailwind `theme.extend` 1:1): raw brand hues use the `mt-` prefix; *semantic* tokens (`--surface`, `--text`, `--accent`, `--border`) resolve per theme. **Always author against semantic tokens, never raw hex** — that's what makes the three themes swap cleanly.

### 3.2.2 Accent-use discipline (inherited rule, MorpheusTEK accent)

**One dominant accent moment per view.** Yellow is MorpheusTEK's "expensive" color — the equivalent of Stackked's ember rule. If a section has two CTAs, only one is solid yellow; the other is a blue or ghost outline. Red is reserved for the eye/iris and for true danger/error states — it is *never* a casual accent (it would dilute the eye). Blue is the workhorse structural color (links, secondary actions, headers).

### 3.2.3 LIGHT MODE — full token set

Default for first-time daytime visitors; clean, technical, "spec-sheet legible."

| Semantic token | Hex | Usage |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--bg-subtle` | `#F5F7FA` | Alt section band, sunken areas |
| `--bg-muted` | `#ECEFF3` | Hover surfaces, table zebra |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-raised` | `#FFFFFF` | Elevated cards (uses shadow) |
| `--text` | `#0A2540` | Body text (navy-ink) |
| `--text-strong` | `#061626` | Headings |
| `--text-muted` | `#51607A` | Captions, secondary |
| `--text-subtle` | `#8190A6` | Placeholders, disabled labels |
| `--text-inverse` | `#FFFFFF` | Text on dark/yellow fills |
| `--accent` | `#FFCB05` | Primary CTA fill (yellow) |
| `--accent-text` | `#0A2540` | Text *on* yellow (navy — see contrast note) |
| `--accent-hover` | `#E6A700` | Yellow hover |
| `--accent-press` | `#CC9400` | Yellow press |
| `--brand-blue` | `#0057B8` | Links, secondary actions, headers |
| `--brand-blue-hover` | `#004A9E` | Blue hover |
| `--eye` | `#E2231A` | Eye/iris, brand red accents |
| `--eye-warm` | `#F05A28` | Iris glow, warm energy |
| `--border` | `#D5DBE3` | Hairlines, card borders |
| `--border-strong` | `#0057B8` | Emphasis borders (active field) |
| `--ring` | `#0057B8` | Focus ring (see 3.2.7) |
| `--success` | `#1E874B` | "In Stock", pass |
| `--success-soft` | `#E3F3EA` | Success bg |
| `--warning` | `#B7791F` | "Pre-order", caution |
| `--warning-soft` | `#FBF0DA` | Warning bg |
| `--danger` | `#C0140C` | Error, "Discontinued" |
| `--danger-soft` | `#FBE3E1` | Danger bg |
| `--info` | `#0057B8` | Info notes |

**Light-mode AA pairings (verified):**

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--text` `#0A2540` | `--bg` `#FFFFFF` | **14.0:1** | ✅ AAA |
| `--text-muted` `#51607A` | `#FFFFFF` | **5.4:1** | ✅ AA |
| `#0A2540` (navy) | `--accent` `#FFCB05` | **9.9:1** | ✅ AAA — **navy text on yellow is the required pairing** |
| `#FFFFFF` | `--accent` `#FFCB05` | **1.4:1** | ❌ **never put white text on yellow** |
| `--brand-blue` `#0057B8` | `#FFFFFF` | **6.5:1** | ✅ AA (links) |
| `--text-inverse` `#FFFFFF` | `--brand-blue` `#0057B8` | **6.5:1** | ✅ AA (blue buttons) |
| `--eye` `#E2231A` | `#FFFFFF` | **4.6:1** | ✅ AA (use only ≥16px/bold or as graphic) |
| `--success` `#1E874B` | `#FFFFFF` | **4.0:1** | ✅ AA large/UI; pair with text label for small |

> **Critical rule:** **Yellow is a fill color carrying navy text, or a graphic accent — never a text color on white and never a background under white text.** This single rule prevents 90% of contrast failures with this palette.

### 3.2.4 DARK MODE — full token set

Auto-activates on OS `prefers-color-scheme: dark` (table stakes). Deep navy, not black — keeps the brand blue lineage and makes yellow/point-clouds glow.

| Semantic token | Hex | Usage |
|---|---|---|
| `--bg` | `#061626` | Page background (navy-900) |
| `--bg-subtle` | `#0A2540` | Alt band (navy) |
| `--bg-muted` | `#12314F` | Hover surfaces, zebra |
| `--surface` | `#0E2840` | Cards |
| `--surface-raised` | `#143656` | Elevated cards |
| `--text` | `#E8EEF6` | Body text |
| `--text-strong` | `#FFFFFF` | Headings |
| `--text-muted` | `#9DB0C8` | Captions |
| `--text-subtle` | `#647A98` | Placeholders |
| `--text-inverse` | `#0A2540` | Text on yellow fills |
| `--accent` | `#FFD200` | Primary CTA (brighter yellow reads better on navy) |
| `--accent-text` | `#0A2540` | Navy text on yellow |
| `--accent-hover` | `#FFCB05` | Hover |
| `--accent-press` | `#E6A700` | Press |
| `--brand-blue` | `#4D9FFF` | Links (lightened — `#0057B8` fails on navy) |
| `--brand-blue-hover` | `#7FB8FF` | Link hover |
| `--eye` | `#FF5A4D` | Eye/iris (lightened red for AA on navy) |
| `--eye-warm` | `#FF7A45` | Iris glow |
| `--border` | `#1E3E5E` | Hairlines |
| `--border-strong` | `#4D9FFF` | Active field |
| `--ring` | `#FFD200` | Focus ring (yellow on dark — high visibility) |
| `--success` | `#4ECB7D` | "In Stock" |
| `--success-soft` | `#10322050` | Success bg (alpha) |
| `--warning` | `#F0B541` | "Pre-order" |
| `--warning-soft` | `#3A2D0E50` | Warning bg |
| `--danger` | `#FF6B5E` | Error |
| `--danger-soft` | `#3A161250` | Danger bg |

**Dark-mode AA pairings (verified):**

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--text` `#E8EEF6` | `--bg` `#061626` | **15.6:1** | ✅ AAA |
| `--text-muted` `#9DB0C8` | `#061626` | **7.6:1** | ✅ AAA |
| `--brand-blue` `#4D9FFF` | `#061626` | **6.9:1** | ✅ AA (links) |
| `#0A2540` | `--accent` `#FFD200` | **11.1:1** | ✅ AAA (navy text on yellow) |
| `--eye` `#FF5A4D` | `#061626` | **4.9:1** | ✅ AA |
| `--success` `#4ECB7D` | `#061626` | **8.5:1** | ✅ AAA |
| `--text` `#E8EEF6` | `--surface` `#0E2840` | **12.4:1** | ✅ AAA |

### 3.2.5 SENSOR-VIEW (LiDAR) THEME — the signature mode

This is the wow-factor toggle (Austin's idea, on Phil's wish list) — flips the *whole site* into a point-cloud / heat-vision view. It is **not** a third color scheme for reading long copy; it's an *atmosphere* layered over the dark-mode token base. Treat it as a themed skin: text stays legible (inherits dark-mode text tokens), surfaces become near-black "sensor void," and accents become **point-cloud depth-ramp** colors. Hero imagery cross-fades from photoreal → point-cloud; backgrounds gain a subtle point-cloud texture and scan-line shimmer.

**Base (atmosphere) tokens:**

| Semantic token | Hex | Usage |
|---|---|---|
| `--bg` | `#03080F` | Sensor void (near-black, faint blue) |
| `--bg-subtle` | `#06121F` | Depth band |
| `--surface` | `#081826CC` | Glass-dark card (alpha over point-cloud) |
| `--text` | `#DCF2FF` | Body (cool white) |
| `--text-strong` | `#FFFFFF` | Headings |
| `--text-muted` | `#7FA8C8` | Captions |
| `--accent` | `#FFE14D` | CTA — yellow stays MorpheusTEK's, slightly hotter |
| `--accent-text` | `#03080F` | Void text on yellow |
| `--ring` | `#39FF14` `(PROPOSED)` | Focus ring uses the near-field point-cloud green for visibility |
| `--border` | `#16344E` | Faint scan hairlines |

**Point-cloud depth ramp** (the heat-vision palette — maps sensor distance to color, near→far; use for point-cloud renders, FOV gradients, the before/after slider, data viz):

| Token | Hex | Depth meaning |
|---|---|---|
| `--pc-near` | `#FF2D55` | Closest returns (hazard / hot) |
| `--pc-1` | `#FF7A18` | Near |
| `--pc-2` | `#FFD200` | Mid-near (brand yellow anchors the ramp) |
| `--pc-3` | `#39FF14` | Mid |
| `--pc-4` | `#00E5FF` | Mid-far (cyan) |
| `--pc-5` | `#2E7DFF` | Far |
| `--pc-far` | `#7A3CFF` | Farthest returns (cold / violet) |

> **Why this ramp:** it's the genuine LiDAR/depth-map convention (hot=near, cold=far), so it reads as *real sensor output* to an engineer, not arbitrary neon — and it still hero-features MorpheusTEK yellow at its center (`--pc-2`). The ramp also powers the **2D vs 3D LiDAR vs depth-camera comparison** and the **safety-zone diagram** (warn zone = `--pc-2`/yellow, protect zone = `--pc-near`/red).

**Sensor-View AA note:** `--text` `#DCF2FF` on `--bg` `#03080F` = **17.8:1** (AAA). Point-cloud ramp colors are **graphics/data, not text** — they only need 3:1 against the void for non-text contrast (all pass). Never set body copy in ramp colors. When the toggle is on, a small persistent control + "Sensor view" label stays in brand colors so users can always exit.

### 3.2.6 Gradients & textures (used sparingly)

- **Hero scrim (over video):** `linear-gradient(180deg, rgba(6,22,38,0) 0%, rgba(6,22,38,0.75) 100%)` — guarantees AA on hero headline text over any AI video frame. Mandatory before placing white/yellow text on imagery.
- **Yellow chevron/blade:** flat `mt-yellow`, no gradient (the booth blades are solid).
- **Point-cloud texture:** low-opacity (6–10%) dotted/particle field, `--pc` ramp, dark themes only. Never under body copy at readable sizes.
- **Circuit-board lines:** single-hue line art at 8–14% opacity (3.5), never multicolor.

### 3.2.7 Focus rings (cross-theme)

Inherited Stackked discipline: **focus is always visible, never removed.** MorpheusTEK uses **2px ring + 2px offset**, color per theme: **blue `#0057B8`** (light), **yellow `#FFD200`** (dark), **point-cloud green `#39FF14`** (sensor-view). Rationale: the ring must clear 3:1 against its own background in each theme, which a single color can't do across white/navy/void.

---

## 3.3 Typography

A three-face system: a **technical display** face with engineering character, a **highly legible body/spec** face that holds up in dense datasheets, and a **mono** for specs/terminals/IDs.

### 3.3.1 The type system (recommended, decisive)

| Role | Face | Why this one | Source |
|---|---|---|---|
| **Display / headings** | **Saira** (700/800; Saira Condensed for hero) | Slightly extended, technical, "instrument-panel" character that reads bold and industrial without being a novelty face — echoes the squared geometry of the morpheusTEK wordmark and the booth chevrons. Carries 88px heroes with weight. | Google Fonts |
| **Body / spec / UI** | **Inter** (400/500/600/700) | The reference workhorse for dense technical UI — exceptional legibility at 12–14px (critical for spec tables an engineer actually reads), tabular-figure support for spec columns, huge weight range, ships every weight we need. | Google Fonts |
| **Mono / specs / terminal** | **JetBrains Mono** (400/500/700) | Designed for code/spec legibility; powers the live "active projects" terminal element, spec values (FOV, range, IP rating), part numbers, the `DOC/###` style stamps, and point-cloud data labels. | Google Fonts |

> **(PROPOSED) rationale for Saira over alternatives:** Saira's mild extension and squared terminals give the "technical/precise/bold" register without looking like a sci-fi display font (which would undercut credibility with engineers). Strong runner-ups if Phil wants to audition: **Chakra Petch** (more overtly "tech," higher risk of gimmick) or **Archivo** (cleaner, less industrial). Body face is non-negotiable — **Inter** is the correct choice for spec-dense B2B and should not be substituted.

### 3.3.2 Loading guidance — self-host, don't CDN

For the required **99+ Lighthouse score**, do **not** load fonts from Google's CDN at runtime (render-blocking + extra DNS/connection cost). Instead:

- **Self-host via `next/font/google`** (Next.js) — it downloads, subsets, and serves the fonts from your own origin at build time, auto-adds `font-display: swap`, and eliminates the render-blocking request. This is the single highest-leverage perf move for type.
- Subset to **Latin** only. Preload the two faces used above the fold (Saira display + Inter body). Self-host JetBrains Mono the same way; it's below-the-fold-heavy so it need not preload.
- Set `font-display: swap` and define a metrics-matched fallback (`size-adjust`) to kill CLS — `next/font` does this automatically.

### 3.3.3 Type scale (rem-anchored, 16px base)

| Token | px | rem | Line-height | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| `--fs-display` | 88 | 5.5 | 1.02 | −0.03em | 800 | Hero H1 (Saira Condensed) |
| `--fs-h1` | 56 | 3.5 | 1.05 | −0.02em | 800 | Page H1 |
| `--fs-h2` | 40 | 2.5 | 1.1 | −0.015em | 700 | Section H2 |
| `--fs-h3` | 30 | 1.875 | 1.15 | −0.01em | 700 | Subsection H3 |
| `--fs-h4` | 22 | 1.375 | 1.25 | 0 | 600 | Card titles, product names |
| `--fs-h5` | 18 | 1.125 | 1.35 | 0 | 600 | Small headings, spec group labels |
| `--fs-lead` | 20 | 1.25 | 1.55 | 0 | 400 | Hero subhead, intro paragraphs |
| `--fs-body` | 16 | 1.0 | 1.6 | 0 | 400 | Body copy |
| `--fs-sm` | 14 | 0.875 | 1.5 | 0 | 400/500 | Dense spec text, secondary |
| `--fs-xs` | 12 | 0.75 | 1.45 | 0.01em | 500 | Captions, table meta, badge text |
| `--fs-eyebrow` | 12 | 0.75 | 1 | 0.14em | 600 UPPER | Section eyebrows, kickers |
| `--fs-mono-sm` | 13 | 0.8125 | 1.5 | 0 | 500 | Spec values, terminal, part #s |

Responsive: hero `--fs-display` clamps `clamp(48px, 8vw, 88px)`; H1 `clamp(36px, 5vw, 56px)`; H2 `clamp(28px, 4vw, 40px)`.

### 3.3.4 H1/H2 hierarchy rules (SEO-critical — non-negotiable)

The current site's audited gaps were *missing H1/H2 structure* and *missing alt text*. This system fixes both at the design-token level so they're enforced, not hoped for:

- **Exactly one `<h1>` per page**, containing the page's primary keyword/topic. Homepage `<h1>` carries the ICP-A dream headline ("Give your robot the right LiDAR, camera, and perception stack…"). The hero *tagline* ("Giving Sight to Robotics") may be a styled visual lockup but is **not** the `<h1>` unless it contains the keyword — prefer the keyword-rich headline as `<h1>`, tagline as accompanying display text.
- **`<h2>` opens every major section**, keyword-aligned ("Safety LiDAR for AMRs", "Full-stack robot perception"). Never skip levels (no `<h1>` → `<h3>`).
- **Visual size is decoupled from semantic level** via utility classes (`.h2-style` on an `<h3>` when needed) so SEO structure is never sacrificed for layout. Heading *rank* = document outline; heading *class* = visual size.
- **Product pages:** `<h1>` = product name + category ("OLEI GS1-5 — 2D Safety LiDAR"); `<h2>`s = "Key specs", "How it compares", "Applications", "Download the spec sheet".
- Every heading uses `text-wrap: balance` for clean multi-line display titles.

---

## 3.4 Logo & Lockups

> **Action item:** the canonical vector wordmark and eye are pending from MorpheusTEK (Sean's asset folder). Rules below are the system; final SVGs slot in. Until then, AI/placeholder marks follow these constraints.

### 3.4.1 morpheusTEK wordmark

- **Form:** lowercase `morpheus` + uppercase `TEK`, "TEK" emphasized, set in **`mt-blue` `#0057B8`** on light surfaces.
- **Reversed:** white wordmark on `mt-navy`/dark; **never** yellow wordmark (yellow is for the eye/accents, not the name).
- **Eye + wordmark lockup (primary):** the eye mark sits to the **left** of the wordmark, optically centered to the cap-height of "TEK." Horizontal lockup for nav/footer; stacked (eye above wordmark) for square/social.
- **Clearspace:** minimum clearspace on all sides = the **height of the `T` in TEK**. Nothing (text, image edge, button) enters that zone.
- **Min sizes:** wordmark **min 120px wide** (digital), **24px tall** in dense nav; eye mark **min 24px**. Below 120px wide, use the eye mark alone.
- **Placement:** nav left, 28–32px rendered height, on a `--bg` plate (never directly on busy hero video — sits in the solid nav bar).

### 3.4.2 The eye mark

- Standalone in square contexts (favicon, app icon, social avatar, section anchors, the sensor-view toggle).
- Iris dot in **`mt-red` `#E2231A`** (light) / **`#FF5A4D`** (dark); never recolor the iris to yellow.
- On yellow surfaces, the eye renders navy/blue outline with red iris (maintains contrast).

### 3.4.3 OLEI co-brand lockup rules (the guardrail)

This is where the brief's hard rule lives: **lead with MorpheusTEK; OLEI is proof, not headline.**

- **OLEI logo never appears in the primary nav, hero, or homepage masthead.** It appears in: product pages (the product *is* OLEI), the "Manufacturing Strength Behind the Sensing Stack" proof band, the partners/proof strip, and spec sheets.
- **Co-brand lockup pattern:** `morpheusTEK` primary + small "Exclusive North American Distributor for OLEI" lockup, with OLEI mark rendered **≤60% the visual weight** of the MorpheusTEK wordmark, separated by a thin `--border` divider. MorpheusTEK always reads first and largest.
- **Never** a 50/50 co-brand lockup; never OLEI alone as a page identity. Supplier names (OLEI, Percipio, MRDVS, Sintrones) are *content within product/proof contexts*, never brand chrome.
- The HUADA / Great Star manufacturing-credibility marks (PROPOSED, pending approval) live only in the proof band, smaller still.

### 3.4.4 Favicon / app icon

- **Favicon:** the eye mark — red iris on `mt-yellow` square (high recognizability in a browser tab), with a navy outline ring. Ship 16/32/48px ICO + 180px Apple touch + 512px maskable PNG + monochrome SVG mask icon.
- **Dark-tab variant:** eye on `mt-navy` with bright iris.

### 3.4.5 Logo don'ts

Don't: recolor the wordmark to yellow; stretch/distort; rotate the eye; place the wordmark on busy imagery without a plate; let OLEI equal or exceed MorpheusTEK in any lockup; add drop shadows/bevels/glows to the wordmark; rebuild "TEK" in a different font; use the eye as a repeating bullet/texture.

---

## 3.5 Iconography & Motif

### 3.5.1 Icon library

**Lucide** (1.5px stroke, open-source, 1500+ icons) — inherited Stackked default, correct for a clean technical UI. Type-safe via `lucide-react`. **Do not mix** with filled icon sets. Sizing: 16px inline, 20px in buttons/nav, 24px standalone, 32px+ for marketing/empty states. Color inherits `currentColor`; use `--text-muted` decorative, `--text` active, **`--accent` (yellow) only for a primary-action icon**, `--eye` (red) only for the eye/sensing motif.

For domain-specific marks Lucide lacks (FOV cones, scan zones, point clouds, the eye), commission a **small custom SVG set** in the same 1.5px-stroke language so it sits seamlessly beside Lucide.

### 3.5.2 Circuit-board / PCB line system

The flyer's signature texture. Rules to use it *without clutter*:

- **One hue, low opacity:** PCB traces render single-color (`--brand-blue` or `--accent` at **8–14% opacity**), never multicolor, never at full strength behind text.
- **Edge framing, not field fill:** traces live in the **header band, footer band, and section seams** (echoing the flyer header/footer), or as a corner motif — they *frame*, they don't carpet.
- **Animated trace (PROPOSED):** a subtle "current flowing" pulse traveling along a few traces on the hero/footer (2–4s loop, 1px bright dot), off under reduced-motion. Reads as "live technology" — supports the nimble/active energy.
- **Never** behind dense spec tables or body paragraphs.

### 3.5.3 Yellow chevron / blade shapes

The booth's directional yellow blades. Use as: section dividers (a single angled yellow blade between bands), CTA accents (a chevron tail on the primary button on hover — slides 2px), and "forward/next" wayfinding. Always **solid `mt-yellow`**, angular (not rounded), used singly per section. They imply *motion and direction* — apt for a navigation/perception brand.

### 3.5.4 Sensor / FOV / zone iconography

The proprietary visual vocabulary that makes MorpheusTEK look like it *knows robotics*:

- **FOV cones / wedges:** a sensor origin with a swept arc showing horizontal/vertical field — 270°, 360°, 120°×50°, etc. Render with a faint `--pc` gradient fill at low opacity, solid stroke. One per product page, matched to the real spec.
- **Safety-zone diagram:** concentric zones — **warning zone** (`--pc-2`/yellow, dashed), **protection zone** (`--pc-near`/red, solid), per the GS1-5/flyer. The hero proof object for safety pages. Label zones in mono. (Certification text on this diagram is GS1-5-scoped only.)
- **Point-cloud icon/texture:** dotted depth-ramp particles; used as a small icon for "3D perception" and as the texture in dark themes.
- **2D vs 3D vs depth-camera comparison glyphs:** a single plane (2D), a volumetric cloud (3D), a depth-gradient frame (camera) — a consistent triptych reused across compare modules.

### 3.5.5 Clutter governance (the rule that keeps it premium)

**Per section, choose at most ONE motif element** (PCB lines *or* a chevron *or* an FOV diagram *or* point-cloud texture) — never stack them. The brand is bold but *precise*; restraint is what separates "serious technical partner" from "busy catalog."

---

## 3.6 Imagery & Art Direction

### 3.6.1 AI-generated vs real (the honest policy)

Per the brief's caution (some platforms flag AI content; plan to swap in real later):

- **AI-generated is the launch default** for heroes, robot scenes, booth renders, and atmosphere — built in **Higgsfield** (image + video + angles/perspective + image→video). This unblocks the late-June timeline with placeholders that look finished.
- **Real wins where it matters and where it exists:** real **point-cloud / SLAM footage** from suppliers (Phil is sourcing), real **product photography** of the actual SKUs (a spec-reading engineer must trust the product shot is the real unit), and anonymized partner application footage (Ross Video, Tennant, Anatech, BrainOS, Aethon — **strip logos, confirm before public use**, no customer names/logos without approval).
- **Disclosure discipline:** never present an AI booth/scene as a literal photo of a real event or a real customer install. Generic robots-in-context = fine to generate; specific factual claims (real deployments, real booths) = real or clearly illustrative.
- **Roadmap:** every AI placeholder is tracked for replacement by real product video/photography as Phil supplies assets. Mark AI hero assets in the CMS so they can be swapped without a rebuild.

### 3.6.2 Subject matter — what to show

- **Robots first:** AMRs, AGVs, autonomous forklifts, robotic cleaning platforms, service/delivery robots, quadrupeds, UAVs (in scope), industrial mobile robots — in warehouses, factories, hospitals, yards, outdoor sites.
- **The "MorpheusTEK eyeball on a robot"** (Tom's request) running in background scenes — AI-generated, looks like Phil built it.
- **Point-cloud aesthetics:** dense 3D clouds and 2D SLAM maps, depth-ramp colored, from the *robot's* perspective — the literal expression of "Giving Sight to Robotics."
- **Before/after slider:** real-world photo ↔ LiDAR/point-cloud view of the *same scene*, drag-to-reveal — from a robot's POV.
- **Safety-zone diagrams** (3.5.4) — schematic, not photographic.

### 3.6.3 What to avoid (hard exclusions)

- **No automotive / cars / self-driving-car scenes.** MorpheusTEK does not serve automotive (Phil & Tom explicit; sample point clouds must be re-shot "from the robot perspective, not a car").
- **No food & beverage** vertical imagery (Tom flagged it as out of scope).
- No stock-photo clichés (handshakes, generic "global network" globes), no glossy/over-saturated automotive-LiDAR marketing tropes, no fake customer logos.
- **No federal/DoD/DOT/military scenes or compliance claims** — compliance positioning is INTERNAL ONLY and must never appear in public imagery or copy.

### 3.6.4 Treatment

- **Matte, technical, slightly desaturated** base photography so the **yellow accent and point-cloud colors pop** — the image supports the brand color, doesn't compete.
- Heroes: full-bleed AI video above the fold (Austin's standard), always with the sensor scrim (3.2.6) for AA text.
- Every image ships **alt text** (the audited gap) — descriptive, keyword-aware where natural ("OLEI GS1-5 safety LiDAR mounted on an AMR scanning a warehouse aisle"). This is a CMS-required field, not optional.

---

## 3.7 Components & Tokens

All tokens below are **Tailwind-theme-ready** (flat values, port 1:1 into `tailwind.config` `theme.extend`). Structure ladders are inherited from Stackked; values are tuned for MorpheusTEK's bolder register.

### 3.7.1 Spacing scale (4-pt grid)

| Token | px | rem | Typical use |
|---|---|---|---|
| `--sp-1` | 4 | 0.25 | Icon↔label gap, hairline insets |
| `--sp-2` | 8 | 0.5 | Tight cluster |
| `--sp-3` | 12 | 0.75 | Compact padding |
| `--sp-4` | 16 | 1 | Base unit |
| `--sp-5` | 24 | 1.5 | Card padding |
| `--sp-6` | 32 | 2 | Card→card |
| `--sp-7` | 48 | 3 | Section inner |
| `--sp-8` | 64 | 4 | Section→section |
| `--sp-9` | 96 | 6 | Marketing section rhythm |
| `--sp-10` | 128 | 8 | Hero vertical breathing |

Layout: **max content 1200px** (marketing), **1440px** (catalog/app views). Gutter **24px mobile / 48px desktop**. Sticky nav **72px** (slightly taller than Stackked's 64px to seat the eye+wordmark lockup + mega-menu trigger comfortably).

### 3.7.2 Radii

| Token | px | Use |
|---|---|---|
| `--r-xs` | 2 | Code chips, tiny tags |
| `--r-sm` | 4 | Inputs (compact) |
| `--r-md` | 8 | **Buttons, inputs, badges** (default) |
| `--r-lg` | 12 | Cards |
| `--r-xl` | 16 | Modals, mega-menu panel |
| `--r-2xl` | 24 | Hero/marketing feature cards (sparingly) |
| `--r-pill` | 999 | Chips, status pills, avatars |

> MorpheusTEK runs **8px** as the default button/input radius (vs Stackked's 6px) — marginally softer reads more "modern product," still firmly technical (not pill-rounded). Modest by rule; **never** pill-round buttons.

### 3.7.3 Elevation / shadows (cool-tuned to the navy palette)

Stackked's shadows are warm (graphite alpha); MorpheusTEK's palette is cool, so shadows use a **navy alpha** to sit naturally on blue/navy surfaces.

| Token | Value | Use |
|---|---|---|
| `--sh-sm` | `0 1px 2px rgba(10,37,64,0.08), 0 1px 1px rgba(10,37,64,0.04)` | Hover lift on flat rows |
| `--sh-md` | `0 4px 12px -2px rgba(10,37,64,0.12), 0 2px 4px rgba(10,37,64,0.06)` | Cards, dropdowns, mega-menu |
| `--sh-lg` | `0 16px 32px -8px rgba(10,37,64,0.16), 0 4px 8px rgba(10,37,64,0.06)` | Modals |
| `--sh-xl` | `0 32px 64px -16px rgba(10,37,64,0.20)` | Hero feature cards |
| `--sh-accent` | `0 8px 24px -6px rgba(255,203,5,0.40)` | One-off yellow hero CTA glow only |
| `--sh-glow-pc` | `0 0 24px rgba(0,229,255,0.35)` | Sensor-view point-cloud glow (theme-scoped) |

**Rule (inherited):** **never `box-shadow` AND `border` on the same element** — surface cards use border, elevated cards use shadow.

### 3.7.4 Borders

1px hairlines in `--border`; `--border-strong` (blue) for active/emphasis; 2px focus per 3.2.7. Dark/sensor themes use the theme `--border` tokens. No double-bordering nested cards (use surface step instead).

### 3.7.5 Button system

Radius `--r-md` (8px), `--fs-sm`/`--fs-body` weight 600, Inter, sentence case, 20px Lucide icon optional, motion per 3.8. Min tap target 44×44px.

| Variant | Resting | Hover | Press | Use |
|---|---|---|---|---|
| **Primary (yellow)** | `--accent` fill, **navy `--accent-text`**, no border | `--accent-hover` + `--sh-md` lift, chevron tail slides 2px | scale `0.98` 120ms + `--accent-press` | The ONE main CTA per view — *Start a 90-day trial*, *Book a meeting* |
| **Secondary (blue)** | `--brand-blue` fill, white text | `--brand-blue-hover` + `--sh-sm` | scale 0.98 | Second action — *Get a quote* |
| **Ghost / outline** | transparent, 1px `--border-strong` (blue), blue text | fill `--bg-muted` | bg step `--bg-subtle` | Tertiary — *Download the guide* |
| **Quiet / text** | no bg, blue text | underline appears (1.5px, yellow underline color) | — | Inline, low-priority links-as-buttons |
| **Danger** | `--danger` fill, white text | darken 8% | scale 0.98 | Destructive only (rare on marketing) |

**CTA wording variants** (per brief — scatter, vary, A/B test): *Start a 90-day trial · Get a quote · Talk to an engineer · Book a meeting · Download the guide · Request a sample · Meet us at the booth*. Same component, different label, tracked separately. **Accent discipline:** only one *yellow* button per viewport; everything else is blue/ghost.

### 3.7.6 Form fields

- Height 44px, `--r-sm`/`--r-md`, 1px `--border`, `--surface` bg, 16px padding-x. **Label always visible** (never placeholder-as-label — accessibility). Placeholder `--text-subtle`.
- **Focus:** border → `--border-strong` + 2px focus ring (3.2.7).
- **Error:** 1px `--danger` border, `--danger` helper text + Lucide `alert-circle`, `aria-describedby`. **Never color-only** error signaling (icon + text always).
- **Gated lead forms** (HubSpot-wired): minimum fields = **name · company · business email · primary application/use case**; high-intent (quote/sample) forms expand to sensor type, range, FOV, interface, environment, safety, target cost, volume, timeline. Inline validation, success state in `--success`.

### 3.7.7 Cards

Two flavors, never mixed on one surface (inherited): **Surface card** (`--surface` + 1px `--border` + `--r-lg`, no shadow) for spec/info-dense areas; **Elevated card** (`--surface` + `--sh-md` + `--r-lg`, no border) for featured product / hover-interactive grids.

**Comparison card/table (signature — "from quiet to confident"):** two/three-column grid. Incumbent column (SICK): `--text-muted` values, `--bg-subtle` background, neutral. MorpheusTEK column: `--text` values, **yellow-accented spec wins**, the green "In Stock" badge, the "90-Day Trial" badge, a faint `--accent` top-border. The visual argument lands before reading. SICK column styled *fair*, never mocked.

### 3.7.8 Badges (status & marketing)

`--r-pill`, `--fs-xs` (12px) weight 600, mono optional, 4px×10px padding, icon optional.

| Badge | Style | Use |
|---|---|---|
| **90-Day Trial** | `--accent` fill, navy text, `flask-conical`/`badge-check` icon | The hero differentiator — appears on every OLEI product + CTAs |
| **SIL2 / Type 3 / PL d** | `--brand-blue` fill, white text, `shield-check` | **GS1-5 ONLY** — component is gated so it can't be applied to non-safety SKUs |
| **In Stock** | `--success-soft` bg, `--success` text, dot | Availability |
| **Pre-order (Q2 2026)** | `--warning-soft` bg, `--warning` text, `clock` | S10 Ultra, S11, etc. |
| **New / Product of the Month** | `--eye` outline + red dot | Rotation feature |
| **Featured** | `--accent` outline, navy text | GS1-5, hero SKUs |

> **Certification guardrail (engineered, not just styled):** the SIL2/Type 3/PL d badge is a **data-driven component** bound to a product's `certifications` field. Only the GS1-5 record carries those values, so the badge *cannot* render on another SKU. This makes the brief's "precise certification language" rule structurally impossible to violate.

### 3.7.9 Spec tables

The engineer's primary read. **Tabular figures (Inter `font-variant-numeric: tabular-nums`)** so columns align; mono for part numbers and units. Zebra rows `--bg`/`--bg-muted`; sticky header on long tables; first column (spec name) `--text-muted`, values `--text`. **Critical specs surface above the fold** in a compact "key specs" card before the full table. Right-aligned numeric columns. Each table has a real `<caption>` and `<th scope>` for accessibility + SEO.

### 3.7.10 Mega-menu

Half-page panel (Phil/Austin discussed), `--surface` bg, `--sh-md`, `--r-xl`, top `--accent` hairline. Left: category columns (2D LiDAR · Safety LiDAR · 3D LiDAR · Solid-State · 3D Cameras · 1D Rangefinders · 3D Mapping · Edge Compute). Right: **rotating featured product** (Product-of-the-Month) with image, name, one-liner, 90-Day Trial badge. DB-backed and scalable (catalog is growing). Keyboard-navigable, `Esc` to close, focus-trapped, `aria-expanded`. Opens on hover (desktop) with 120ms intent delay; click/tap on touch.

### 3.7.11 Dark/light toggle + Sensor-View toggle treatment

Two distinct controls in the nav, never merged:

- **Light/Dark:** standard `sun`/`moon` Lucide toggle, respects OS `prefers-color-scheme` by default, choice persisted (`localStorage`). Quiet, `--text-muted`.
- **Sensor-View (LiDAR) toggle:** the **signature control**, styled as the **eye mark** — closed/real-world ↔ open/scanning, with a small "Sensor view" label. Activating it cross-fades the whole site into the Sensor-View theme (3.2.5): hero swaps to point-cloud, backgrounds gain texture + scan shimmer, accents shift to the depth ramp. A persistent affordance always lets the user exit. **Respects reduced-motion** (instant theme swap, no shimmer) and is fully usable with point-cloud-green focus rings. This is the "wow" moment — give it a dedicated, slightly larger control with a one-time pulse hint on first visit (PROPOSED).

### 3.7.12 Tailwind theme config (ready to paste)

```js
// tailwind.config.js — theme.extend (port from CSS custom properties 1:1)
extend: {
  colors: {
    // raw brand
    'mt-yellow':        '#FFCB05',
    'mt-yellow-bright': '#FFD200',
    'mt-yellow-deep':   '#E6A700',
    'mt-blue':          '#0057B8',
    'mt-blue-600':      '#004A9E',
    'mt-navy':          '#0A2540',
    'mt-navy-900':      '#061626',
    'mt-red':           '#E2231A',
    'mt-orange':        '#F05A28',
    // point-cloud depth ramp
    pc: { near:'#FF2D55', 1:'#FF7A18', 2:'#FFD200', 3:'#39FF14',
          4:'#00E5FF', 5:'#2E7DFF', far:'#7A3CFF' },
    // semantic tokens resolve via CSS vars per theme (.theme-light/.dark/.sensor-view)
    bg:        'var(--bg)',         'bg-subtle':'var(--bg-subtle)',  'bg-muted':'var(--bg-muted)',
    surface:   'var(--surface)',    text:'var(--text)',  'text-strong':'var(--text-strong)',
    'text-muted':'var(--text-muted)', accent:'var(--accent)', 'brand-blue':'var(--brand-blue)',
    eye:'var(--eye)', border:'var(--border)', ring:'var(--ring)',
    success:'var(--success)', warning:'var(--warning)', danger:'var(--danger)',
  },
  fontFamily: {
    display: ['Saira', 'system-ui', 'sans-serif'],
    body:    ['Inter', 'system-ui', 'sans-serif'],
    mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    'eyebrow':['0.75rem',{lineHeight:'1',letterSpacing:'0.14em'}],
    'xs':['0.75rem',{lineHeight:'1.45'}], 'sm':['0.875rem',{lineHeight:'1.5'}],
    'body':['1rem',{lineHeight:'1.6'}],   'lead':['1.25rem',{lineHeight:'1.55'}],
    'h5':['1.125rem',{lineHeight:'1.35'}],'h4':['1.375rem',{lineHeight:'1.25'}],
    'h3':['1.875rem',{lineHeight:'1.15',letterSpacing:'-0.01em'}],
    'h2':['2.5rem',{lineHeight:'1.1',letterSpacing:'-0.015em'}],
    'h1':['3.5rem',{lineHeight:'1.05',letterSpacing:'-0.02em'}],
    'display':['5.5rem',{lineHeight:'1.02',letterSpacing:'-0.03em'}],
  },
  spacing: { 1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.5rem',
             6:'2rem',7:'3rem',8:'4rem',9:'6rem',10:'8rem' },
  borderRadius: { xs:'2px',sm:'4px',md:'8px',lg:'12px',xl:'16px','2xl':'24px',pill:'999px' },
  boxShadow: {
    sm:'0 1px 2px rgba(10,37,64,0.08), 0 1px 1px rgba(10,37,64,0.04)',
    md:'0 4px 12px -2px rgba(10,37,64,0.12), 0 2px 4px rgba(10,37,64,0.06)',
    lg:'0 16px 32px -8px rgba(10,37,64,0.16), 0 4px 8px rgba(10,37,64,0.06)',
    xl:'0 32px 64px -16px rgba(10,37,64,0.20)',
    accent:'0 8px 24px -6px rgba(255,203,5,0.40)',
  },
  transitionTimingFunction: { 'out-soft':'cubic-bezier(0.22,1,0.36,1)' },
  transitionDuration: { fast:'120ms', base:'200ms', slow:'320ms' },
}
```

Themes are toggled by a class on `<html>` (`.theme-light` default / `.dark` / `.sensor-view`) that re-binds the `--bg`, `--text`, `--accent`, `--ring`, etc. custom properties — so every component above swaps modes for free with zero per-component theme code.

---

## 3.8 Motion Principles

Inherited Stackked discipline — **motion is functional, calm, and fast**, never decorative — tuned for MorpheusTEK's one signature flourish (the sensor scan).

- **Easing:** default `cubic-bezier(0.22, 1, 0.36, 1)` (gentle ease-out) for entrances/UI. `ease-spring` reserved for nothing on this site unless Phil wants a specific accent (PROPOSED: none).
- **Durations:** **120ms** hover/press snaps, **200ms** standard UI transitions, **320ms** larger theme/panel changes, **600ms** one-time hero sensor-scan reveal, **theme cross-fade ~400ms** for the Sensor-View toggle.
- **Scroll-reveal:** content fades + **8px translate-up** on first entry into viewport, once, staggered ≤80ms across siblings. **Build-on-scroll** product animations (the robot assembling its sensor stack / LiDAR exploding into specs, per the calls) are the deliberate scroll showpiece — scrubbed to scroll progress, GPU-transform only, with a static end-state for non-scroll/reduced-motion users.
- **No** bounces, springs, parallax drift, or full-page route transitions (they cost Lighthouse and read as gimmicky to engineers).
- **Hover:** color/elevation snaps in 120ms; never animate hover color longer. Links underline-in, no color shift. Never opacity-as-primary-signal.
- **Press:** scale `0.98` for 120ms + accent-press shade.
- **The signature scan** (eye iris sweep, PCB current-pulse, point-cloud shimmer): subtle, looped 2–4s where ambient, one-shot 600ms where triggered — all gated behind reduced-motion.
- **Reduced-motion fallback (mandatory):** `@media (prefers-reduced-motion: reduce)` disables all transforms/loops/shimmer/scrubbed animations and renders **static end-states** — the build-on-scroll robot shows fully assembled, the sensor scan shows a static iris, the Sensor-View toggle swaps instantly. The site must be fully usable, attractive, and AA-compliant with all motion off.

---

### Open items to confirm with MorpheusTEK (flagged, not blocking)

1. **Final vector assets** — canonical morpheusTEK wordmark + OLEI eye SVGs from Sean's folder (replaces AI/placeholder marks).
2. **Display face** — Saira recommended; confirm or audition Chakra Petch/Archivo. Body = Inter (locked recommendation).
3. **Exact brand yellow/blue** — `#FFCB05` / `#0057B8` derived from booth+flyer+wordmark; confirm against any existing print Pantone spec if one exists.
4. **HUADA / Great Star credibility marks** in the proof band — pending Phil's approval to display.
5. **Sensor-View first-visit pulse hint** and **PCB current-pulse animation** — proposed flourishes; confirm appetite.
6. **Iris scan-arc detail** on the MorpheusTEK-owned eye — proposed refinement to the OLEI eye lineage.