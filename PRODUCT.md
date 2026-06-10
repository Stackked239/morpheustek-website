# PRODUCT.md — MorpheusTEK website

## What this is
The marketing + product site for MorpheusTEK ("Giving Sight to Robotics"), a robotics-perception
value-added distributor and the exclusive North American distributor for OLEI LiDAR. Built by
Stackked Tech. Source of truth for plan/copy/brand: `docs/00_MASTER_PLAN.md` + appendices.

## Register
brand — the homepage and category pillars are identity-driven marketing surfaces. Product pages
lean informational but stay inside the brand system.

## Users
- ICP-A: robotics OEM engineers and engineering managers (AMR/AGV, autonomous forklifts,
  cleaning robots) choosing sensors; spec-literate, allergic to marketing fluff.
- ICP-B: integrators and plant/automation engineers replacing SICK/Hokuyo scanners on cost.
- They read datasheets for fun. Evidence and exact numbers persuade; superlatives repel.

## Brand voice
Confident, factual, a little blunt ("Robots can't see. We fix that."). Engineering-document
energy: claims are always backed by a true spec from the catalog. Never salesy, never vague.
Three words: machined, legible, unafraid.

## Visual identity (official brand guide MT01_D1)
- Colors: navy #0F326C (primary), blue #007BBB, yellow #FFCC00 (the brand surface), cyan #31B4E7;
  OLEI red #E2231A for OLEI graphics only. Navy text on yellow, never white.
- Fonts: Roboto Condensed (headlines + body), Roboto Mono (specs/annotations). Non-negotiable.
- Motifs: circuit traces, the circuit-eye logo, 60° angle panels, point-cloud depth ramp
  (graphics/data only).
- One yellow CTA per viewport.

## Anti-references
- Generic SaaS landing pages (gradient hero, icon-card grids, testimonial walls).
- Hacker-HUD / terminal-green point cloud aesthetics (an earlier homepage in this register was
  explicitly rejected by the team).
- Anything that invents specs, prices, or competitor claims not present in `web/src/lib/catalog.ts`.

## Strategic principles
- Lead with MorpheusTEK, not OLEI. SIL2/Type 3/PL d safety claims are scoped to the GS1-5 only.
- The 90-day free trial and the SICK price gap are the two conversion arguments.
- Hard deadline pressure: live for the Automate show (June 22, Chicago); booth QR codes will point here.
