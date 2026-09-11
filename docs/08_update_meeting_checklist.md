# MorpheusTEK Website — Update-Meeting Checklist & Brand-Guide Alignment

**Source:** Fireflies meeting "MorpheusTEK and Stackked Update Meeting" (June 8, 2026 · Austin, John, Tom, Phil) + the official **MT01_D1 Brand Guide (06/26)**.
**Purpose:** Everything discussed, cross-referenced against the current build, with what needs to be **added or changed**.

**Status key:** ✅ Done · 🟡 Built but needs change · ⬜ Not started · 🔵 Phase 2 (backend/integration) · 👤 Owner action (not website code)

> ## 🔴 THE DEADLINE
> - **Automate show — Chicago — June 22** (≈2 weeks out). Tom wants to hand out **QR codes → "check out our new site"** at the booth.
> - **Target: live (or strong MVP) by end of next week**, contingent on fast Phil/Tom approval.
> - Go-live = **redirect the GoDaddy domain** to the Vercel deployment.
> - **Austin owes 3–4 homepage design options within 2 days** for the client to pick from.

---

## A. Brand alignment — per the OFFICIAL brand guide (this overrides my earlier derived system)

### A1. Colors — replace derived tokens with official PMS/HEX
- 🟡 **Primary navy** `--mt-navy` `#0A2540` → **`#0F326C`** (PMS 3581) — *the* primary brand color / logo color
- 🟡 **Primary blue** `--mt-blue` `#0057B8` → **`#007BBB`** (PMS 7461)
- 🟡 **Primary yellow** `--mt-yellow` `#FFCB05` → **`#FFCC00`** (PMS 116)
- ⬜ Add **secondary palette:** PMS 298 `#31B4E7` (cyan) · PMS 108 `#FDDA00` (bright yellow) · PMS 4195 `#616161` (gray) · Cool Gray 2 `#CCCFCE` (light gray)
- 🟡 Re-tune light/dark/sensor theme tokens + shadows to the new navy `#0F326C` base
- ⬜ Re-derive AA contrast pairings against the official hexes

### A2. Typography — switch to the official type system
- 🟡 **Headlines:** Saira → **Roboto Condensed Bold**
- 🟡 **Body:** IBM Plex Sans → **Roboto Condensed Regular** (Light/Italic Roboto allowed for emphasis)
- ⬜ Decide spec/mono face (brand guide is silent — propose **Roboto Mono** to stay in-family)
- 🟡 Update `next/font` setup + the `--font-display`/`--font-body` tokens
- 👤 Open decision: Roboto Condensed for dense spec tables can read tight — confirm vs. using regular Roboto for body

### A3. Logo & eye-con — implement the real marks
- 🟡 **Eye is the circuit-eye** (concentric circles + horizontal bars + octagonal/circuit iris), **not** my simple almond eye → rebuild `EyeMark`
- 🟡 **Lockup:** eye sits to the **RIGHT** of the wordmark (mine is on the left) → fix `Logo`
- ✅ Wordmark = "morpheus" (regular) + **"TEK"** (bold/caps); in copy "MorpheusTEK"
- 🟡 Positive logo = **PMS 3581 only**; reversed = **all white** (no other colors)
- ⬜ Tagline lockup variant "**Giving Sight to Robotics**" under the wordmark
- ⬜ Clearspace = pupil thickness; never show wordmark without the eye; never recolor positive logo
- 👤 Get the official **vector logo + eye SVGs** from Phil/the brand-guide source files (Austin pulled a raster from the live site as a stopgap)
- ⬜ Favicon/app-icon from the official eye

### A4. Brand graphic elements (from the guide)
- 🟡 **Circuit / "electric schematic" lines** — confirmed *generic* (not LiDAR-specific); align my circuit motif to the guide's style (yellow `#FFCC00` on navy at 20% black; navy on yellow; 30% white overlay on photos)
- ⬜ **Headline accent line** — bracket/accent on all-caps headlines (back line ends at cap height, bottom line extends) — used sparingly
- ⬜ **Angle graphics / corner crop** — 60° angle, ≤35% of shape height
- ⬜ **Graphic panels** — colored angled panel ≤⅓ of an image for key messaging/stats (e.g., "300% growth in last 5 years"), 75° angle, optional 30% white highlight
- ⬜ **Photo overlays** — 100% multiply a brand color over a B&W photo (muted images work best) — *use this instead of pure AI hero?* see B1
- ⬜ **Eye-con icons** — the eye used as a *framing element* around service icons: **Mechanical Housing & Mounting · Perception Performance Tuning · Cables & Connectors · Firmware Customization · Software & Middleware Integration** (icon line weight = 80% of the eye outline)

### A5. The yellow top bar
- ⬜ Add the **yellow top bar** with the logo (Phil/Tom: "make it look more like our current site," "yellow up top" — currently only have yellow lower on the page)

---

## B. Homepage / hero / StoryBrand

- 🔴🟡 **B1. Hero subject = the POINT CLOUD, not a robot.** Phil: the most impressive display is the LiDAR's **point-cloud output** (mimic the **VSS-50** scanner / VBD-series output), not a robot in a warehouse. → Rework the hero to feature the point cloud; keep robot context secondary.
- 🔴🟡 **B2. Problem statement ABOVE the fold (StoryBrand).** Tom's #1 note: the visitor's problem is currently *below* the hero. Put it in the hero so they "land and see their problem" first — e.g., *"Your robot can't see well enough, safely enough, or affordably enough — yet."* → then the solution headline.
- ✅ **B3. Hero solution line** — "Give your robot the right LiDAR, camera, and perception stack to navigate, avoid obstacles, and operate safely" — approved (refine length).
- ✅ **B4. Sensor-view / "LiDAR vision" toggle** — approved & loved (point cloud w/ red/green/yellow). Enhancement: make the scan line actually **render content as point cloud as it passes** (Austin's described behavior), not just an overlay.
- ✅ **B5. 90-day-trial primary CTA** → routes to **schedule a meeting** (they can't get the trial without talking to us) — already wired.
- ✅ **B6. "Talk to an engineer" CTA** (not "talk to sales") — approved.
- 🟡 **B7. Mention OLEI** on the homepage + the **manufacturing / high-reliability ICP** (proof) + emphasize **customization** ("a really big deal for us"). Have the manufacturing-strength + custom-solutions sections — ensure OLEI + customization are explicit on the homepage scroll.
- ⬜ **B8. Booth/brand consistency** — match the new homepage to the booth look (yellow/red/blue + schematic lines + eye).

---

## C. Products, comparison & backend

- 🔴🟡 **C1. REMOVE ALL PRICING.** Tom: "we're going to remove the dollar amount." → strip prices from product cards, detail pages, mega-menu, and the cheat-sheet. (Currently prices are shown prominently.)
- 🟡 **C2. Comparison table fields = FOV, Range, Accuracy only.** Phil: start with **field of view + range**, then add **accuracy**; **no product name/"origin" column**, no price. → rewrite the compare rows (GS1-5, LR-1F, S11, etc.) to FOV/range/accuracy and drop "origin."
- ✅ **C3. Real product images** — pulled from the live site and wired in (15 SKUs; MRDVS S10/S10 Ultra/S11 fall back to the glyph).
- 🟡 **C4. Highlight vs. full specs.** Each product has many attributes (FOV, range, scan rate, output, accuracy…30+); a **star/toggle** picks 2–3 *highlighted* specs, the rest live in **full specs**. Have key-specs + full-specs split ✅; the per-product "star to highlight" is the 🔵 backend piece.
- ✅ **C5. Sticky full-specs column** while scrolling — already built.
- 🟡 **C6. Spec-sheet download** — keep the "Spec sheet" button; make it an **instant gated download** (see D1).
- ⬜ **C7. Add a separate "Software / Applications" download** per product (distinct from the spec sheet).
- 🔵 **C8. Backend product admin** — `/admin` with categories + **drag-and-drop** new product (image, description, spec sheet, software, editable comparison, selectable highlights). Currently a static catalog seed → Phase-2 Supabase CMS.

---

## D. Resources, gating & downloadable content

- 🔴🟡 **D1. Gating = instant download + lightweight lead.** Phil prefers **download immediately** (no "wait for email"), captured as a **light lead**. → change `LeadForm` resource flow from "Email me the guide" to **download-on-submit**; still record the lead.
- 🔵 **D2. Lead routing** — leads → **sales@morpheustek.com** (to Phil, Tom, Eli) **and** create a HubSpot contact (same as today's form behavior).
- 👤 **D3. Branded PDF template + Claude skill** — Austin to build a **MorpheusTEK PDF template** and a **Claude skill** so the team can generate on-brand downloadables ("6 steps on choosing LiDAR," checklists, blogs). *(Deliverable to client, separate from site code.)*
- 👤/⬜ **D4. Real lead-magnet content** — the team will produce checklists/guides; the current "checklist" button is an empty placeholder → populate. (Phil: "we're starting to write better blogs.")

---

## E. Blog / content section — "Eyes at the Edge"

- 🟡 **E1. Rebrand "Blog."** Don't call it Blog. Front-runner: **"Eyes at the Edge"** (also floated: "The Edge," "Sight at the Edge"). Style it distinctly (almost cursive/branded). Tagline vibe: *"Stay up to date with leading technology — subscribe to Eyes at the Edge."* → rename `/blog` section + nav label (confirm final name).
- ✅ **E2. Dedicated section exists** (`/blog` stub) — purpose is SEO + a **landing place for email campaigns** (never send email traffic to the homepage → send to the education hub, then to product/highlight).
- 👤 **E3. Content** — team loads real posts (Austin will keep the route as "blog" internally until content lands).
- 💡 **E4.** Their old newsletter was **"Eyes on Autonomy"** — possible reuse for the email/newsletter.

---

## F. Recurring sections

- ✅ **F1. Product of the Month** — hero/header slot + backend star to set it. Tom sends a **monthly blast** for it. (Have product-of-the-month + `featured`.)
- 🟡 **F2. "Catch us at" / Show of the Month** — they attend **8 shows/year**. Section with **"Catch us at [show]"** + **booth info + what's being demonstrated**. Monthly email to **30,000 people** drives to the show page. → rename my Shows CTA to "Catch us at," add booth-detail + demo fields. (Next show: **Automate, June 22**.)
- 🔵 **F3.** Both recurring sections feed the email cadence (product-of-month email + show email).

---

## G. Integrations & marketing automation

- 🔵 **G1. HubSpot** — form submissions create a contact (matches current behavior). System of record for leads.
- 🔵 **G2. Instantly** *(new — not in prior plan)* — their cold-email product. Add the **Instantly embed/cookie-tracking code** so a visitor arriving **from one of their emails** gets a light auto follow-up ("anything I can help with?"). John: the embed ties **IP ↔ email** on first action.
- 🔵 **G3. Cookie consent** — visitors get cookied on first click-through from an email (needed for G2). Add cookie/consent handling.
- 🔵 **G4. Email routing** — confirm `sales@morpheustek.com` distribution (Phil, Tom, Eli).
- 🔵 **G5. Trade-show flow** — they scan badge QR codes at the booth → HubSpot follow-up sequence (not website forms at the show); still want a **pre-show "Catch us at the booth" form**.

---

## H. Deployment & timeline

- 🟡 **H1. Vercel staging link** — `morpheustek-website…vercel.app` to share with Phil/Tom for rolling review. *(Currently blocked by the Vercel project issues — paused project + the `morpheustek-website.vercel.app` name being unavailable. Recommend re-importing the project with Root Directory `web`, a free name like `morpheus-tek`, protection off.)*
- ⬜ **H2. Rapid iteration** — updates every other day / daily; Phil + Tom must approve fast.
- ⬜ **H3. Go-live** — redirect the **GoDaddy** domain to the Vercel production deployment once approved.
- 🔴 **H4. MVP live for June 22** so Tom can hand out QR codes at Automate.

---

## I. Contact info & legal (fix discrepancies)

- ✅ **I1. Phone** — RESOLVED (09/26): the one correct number is **(302) 416-5989**. Supersedes both the brand-guide number (789-0421) and the flyer number (803-5357). Live in `site.ts` and in the CMS `site.settings` block.
- ⬜ **I2. Mailing address** — add **Morpheus Tek, Inc., PO Box 1988, Silverton, OR 97381** (from brand guide).
- 🟡 **I3. Email/domain** — brand guide: **sales@morpheustek.com**; meeting said "morpheustech.com" (likely a slip). Confirm the canonical domain (morpheustek.com) and sales address.

---

## J. Action items by owner (from the meeting)

**Austin (Stackked)**
- ⬜ Send the Vercel staging link for ongoing review
- ⬜ Deliver **3–4 homepage design options in 2 days** (brand colors yellow/red/blue, schematic lines, eye logos)
- 🔵 Backend product admin (drag-drop add, editable FOV/range/accuracy comparison, star-to-highlight)
- 👤 Build the **branded PDF template + Claude skill** for downloadables
- 🔴🟡 Move the **problem statement above the fold** (StoryBrand)
- 🟡 **Instant-access** resource downloads with lightweight lead → HubSpot
- 🟡 Build **Product-of-the-Month** + **"Catch us at"** show sections into the backend
- 🔵 Set up **Instantly** embed + cookie tracking
- ⬜ Coordinate **GoDaddy DNS** redirect for go-live

**John (Stackked)**
- ✅/🟡 Continue the **LiDAR point-cloud visualization** components (hero + product display)
- 🔵 Help with Instantly email↔IP association details

**Phil (MorpheusTEK)**
- 👤 Provide **eye logos, booth pictures, color references** (now largely covered by the official brand guide)
- 👤 Fast review/approval of homepage iterations with Tom
- 👤 Produce blog/downloadable content; help name the blog ("Eyes at the Edge")

**Tom (MorpheusTEK / Sales Pro)**
- 👤 Fast feedback/approval loop with Phil
- 👤 StoryBrand input — ensure the problem is above the fold
- 👤 Show schedule + booth/product highlights aligned to the email blasts
- 👤 Lead the **Instantly** automation (embed code + cookie tracking)
- 👤 Confirm **sales@morpheustek.com** routing (Phil, Tom, Eli)

---

## K. Open decisions to confirm with Phil/Tom

1. Final **blog name** — "Eyes at the Edge"? ("The Edge" / "Sight at the Edge")
2. ~~**Phone number** — 789-0421 (brand guide) vs 803-5357 (flyer)?~~ → **Answered: (302) 416-5989.**
3. **Roboto Condensed for body copy** as-specified, or regular Roboto for dense spec tables?
4. Which **homepage design option** (of the 3–4) to adopt site-wide.
5. Hero point-cloud — mimic **VSS-50** output specifically?
6. Keep **MRDVS S10/S10 Ultra/S11** placeholders, or generate AI renders / wait for real photos?
7. Confirm OK to **remove pricing entirely** (vs. "Contact for pricing").
