import type { BlogPost } from "@/lib/cms/blog";

/** Canonical sample article — the template all future posts should match. */
export const sampleBlogPost: Omit<BlogPost, "updated_at"> & { updated_at?: string } = {
  slug: "choosing-safety-lidar-for-amrs",
  title: "Choosing a safety LiDAR for your AMR — without overpaying for the incumbent",
  excerpt:
    "The protective field is not a marketing diagram. It is the geometry your safety engineer signs off on. Here is how to size, certify, and trial a scanner that stops for people — on your floor, not in a datasheet.",
  status: "draft",
  published_at: null,
  body: `::meta::
category:Safety LiDAR
readTime:12 min
series:Eyes at the Edge · Vol. 01
::end::

::lede::
Every AMR buyer faces the same quiet question on the loading dock: *will this scanner actually stop for a person?* Not in a slide deck. Not in a trade-show demo lane. In your aisle, at your speed, with your pallet overhang and your reflective tape.
::end::

The answer lives in one drawing — the protective field plotted at true scale, dimensioned against the configured radius and the maximum range ring. That drawing is what functional safety is buying. Everything else is navigation fluff.

## Start with the stop geometry, not the point cloud

Navigation LiDAR tells the robot where it is. Safety LiDAR tells the robot when it must stop. The categories look similar on a line card. In a risk assessment, they are different instruments with different failure modes, different reaction times, and different signatures on the safety case.

For an AMR carrying pallets through mixed traffic, the geometry you care about first is the **protective field**: a certified zone where a person or object triggers a stop output wired into your safety chain.

> Nobody gets fired for choosing the safe option. Nobody should get fired for choosing a certified alternative either — if the field is drawn honestly and proven on the floor.
> — The question your safety engineer is actually asking

### The three numbers that matter

Before you compare brands, write these down from your own layout — not from a competitor's datasheet:

::specs::
Stop distance required | From your risk assessment (m)
Vehicle speed at detection | Worst-case approach (m/s)
Field shape needed | Arc, zone, or full ring
Configured protective radius | What you will actually deploy (m)
Maximum catalog range | The outer ring you dimension against (m)
Safety performance level | e.g. Type 3 · SIL2 · PL d
::end::

If you cannot fill in the configured radius, you are not ready to spec a scanner. You are ready to spec a hope.

---

## Draw the field at true proportions

Datasheets show cheerful cones and fans. Safety cases show arcs with blind sectors, scale rings in metres, and an AMR footprint at the origin. The GS1-5's 270° protective field, for example, sweeps a deliberate rear blind wedge — the geometry is not a full donut, and your layout drawing should reflect that honestly.

::callout|Why we plot to scale::
MorpheusTEK publishes the certified field as an engineering drawing on the homepage — configured to a 2.5 m protective radius, dimensioned against the 5 m maximum. That is the document your safety engineer recognizes. If a vendor will not show you the field at true proportions, ask why.
::end::

When you overlay your aisle width, pick stations, and pedestrian pinch points on that drawing, three things become obvious quickly:

- Whether the configured radius clears your worst-case approach path
- Whether reflective rack legs sit inside the field or just outside it — a common false-clearance trap
- Whether a rear blind sector leaves an unguarded approach you assumed was covered

::steps::
01|Print the field at 1:100|Tape it to the floor in an empty aisle before you mount anything.
02|Walk the approaches|Include the paths people actually use, not the paths on the evacuation map.
03|Mark your stop line|Where must the vehicle halt with full load and worst-case brake latency?
::end::

---

## Same safety class — prove it on your floor

"SAME safety class as SICK" is a sentence buyers hear often. The useful version is narrower: **same performance level, same reaction chain, demonstrated on your AGV next to the incumbent.**

That is what a 90-day trial is for. Not a loaner on a bench. A unit on your vehicle, in your traffic, logging stops you can show an integrator and a safety reviewer.

::callout|Trial discipline::
Run paired approaches — incumbent vs. candidate — at the speeds in your risk assessment. Log every nuisance stop and every missed reflection. A scanner that stops too often gets bypassed. One that stops too late does not get a second meeting.
::end::

### Certification badges are data, not decoration

A safety-rated scanner carries explicit tokens: Type 3, SIL2, PL d — parsed from the product record, not hand-typed into a hero banner. If a SKU does not carry a \`certifications\` array in the catalog, it does not get a safety badge on the site. Your documentation should follow the same rule: certify the exact model, firmware, and configuration you deploy.

---

## Navigation sensing is the second conversation

Once the stop geometry is settled, the navigation envelope is the easier read — a 360° ring for AMR localization, a forward fan for obstacle avoidance, a depth cone for pallet pockets. The assembly stack is always the same four jobs: **protect, map, see, think.**

Safety is the floor. It does not move when you swap navigation sensors. That is why we size the protective field first — the rest of the line card snaps into place around a certified stop.

::specs::
GS1-5 · Safety | 270° arc · 0.1–5 m · Type 3 / SIL2 / PL d
LR-1F · Navigate | 360° ring · 50 m class · 10–25 Hz
MRDVS S10 · See close | dToF RGBD · 120° × 80° · pallet pockets
::end::

---

::takeaways::
- Size the **configured protective radius** from your risk assessment before you compare brands.
- Insist on a **field drawing at true scale** — arcs, blind sectors, and metre rings — not a marketing render.
- Run a **paired floor trial** at operational speed; log nuisance stops and reflection failures.
- Treat certification tokens as **model-specific data** tied to the exact firmware and configuration you ship.
- Only after the safety floor is set, spec the **navigation and near-field** envelopes as separate jobs.
::end::

::cta::
Start a 90-day trial|/book-a-meeting?intent=trial
Read the GS1-5 specs|/products/gs1-5-safety-lidar
::end::
`,
};
