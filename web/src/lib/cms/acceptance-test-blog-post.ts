import type { BlogPost } from "@/lib/cms/blog";

/** "Designing a 90-Day LiDAR Acceptance Test" — Eyes at the Edge, Vol. 02. Seeded as a draft. */
export const acceptanceTestBlogPost: Omit<BlogPost, "updated_at"> & { updated_at?: string } = {
  slug: "designing-a-90-day-lidar-acceptance-test",
  title: "Designing a 90-Day LiDAR Acceptance Test",
  excerpt:
    "A demonstration proves a sensor can work. An acceptance test proves it will. Here is how to pre-register the criterion and run a defensible 90-day LiDAR test.",
  status: "draft",
  published_at: null,
  body: `::meta::
category:Evaluation Method
readTime:9 min
series:Eyes at the Edge · Vol. 02
::end::

::lede::
Most sensor evaluations end without a defensible result. The cause is usually the test design rather than the sensor — no pre-registered acceptance criterion, no baseline, and a sample size too small to distinguish the thing being measured from noise.
::end::

An evaluation unit arrives. It goes onto a bench test, then maybe on a test rig, finally, mounted on a robot/AMR/vehicle. Someone drives it around for a few days collecting data and reports that it looks fine. The engineer who ran it rotates to another project. Ninety days later the available conclusion is an impression, and an impression does not survive procurement review or a safety case.

This is a test design problem. A demonstration shows that a sensor can work under conditions the demonstrator selected. An acceptance test produces a measurement, against a criterion fixed in advance, under conditions you selected, with enough samples to bound the uncertainty. The two differ almost entirely in what gets decided before the unit ships.

## Pre-register the acceptance criterion

The criterion has to be written and agreed upon before any data is collected. This is not a formality, it is what prevents the analysis from drifting toward whatever the data happened to show.

A usable criterion specifies the measurand, the threshold, the conditions under which it must hold, and the sample size. A criterion that cannot produce a failure is not a criterion.

*Insufficient:* "Evaluate whether the sensor detects obstacles reliably."

*Sufficient:* "Detect a 70 mm diameter, matte-grey, 2% reflectivity test cylinder at 3.0 m in ≥ 99.5% of 500 approaches at 1.5 m/s, on our floor surface, under our lighting, with the sensor at production mounting height and tilt. Lower bound of the 95% confidence interval must exceed 99.0%."

The second version fixes the measurand (detection of a specified target at a specified range), the threshold (99.5%), the conditions (surface, lighting, speed, mounting geometry), and the sample size — and it states the criterion against a confidence bound rather than a point estimate, which matters more than it appears to.

## Sample size is not arbitrary

If you want to demonstrate a detection rate of 99.5%, you cannot do it in 50 approaches. Fifty clean detections are consistent with a true rate anywhere from roughly 93% upward — the data cannot distinguish 99.5% from 94%.

The rule of three is the fastest way to size this. For a test with zero observed failures in n trials, the upper 95% bound on the true failure rate is approximately:

*p_fail_upper ≈ 3 / n*

So 500 clean approaches bound the failure rate at roughly 0.6%; 1,000 bound it near 0.3%. If your requirement is a 99.5% detection rate, a 500-approach run with zero misses is the minimum that speaks to it, and any observed misses push the required n up substantially. Decide this before you start, because discovering it at day 80 means the test does not support the claim you need it to support.

The same logic applies to any rate you intend to assert. If the number ends up in a safety case or a supplier qualification, the sample size is part of the claim.

## Record four things before the unit ships

- The criterion, as above — measurand, threshold, conditions, n (the number of runs), and required confidence level.
- The action on pass, with a date.
- The action on fail, including whether a partial result triggers a second round or a stop. Define partial in advance.
- The named owner, with hours actually allocated. An unowned test collects whatever time remains after the sprint, which is reliably zero.

## Establish a baseline

Run the identical protocol against the incumbent sensor. Same targets, same distances, same lighting, same mounting, same n.

Without a baseline, every number you produce is unanchored. A 99.2% detection rate is either a problem or an improvement depending entirely on what the incumbent does under the same conditions, and nobody in the day-90 meeting will know which. Teams routinely discover that the sensor they have been running for three years does not meet the criterion they just wrote for its replacement — which is a useful finding in itself, and one you can only get by measuring both.

The baseline also controls for your test rig. If both units show the same anomaly at the same location or environmental condition, the anomaly is probably not in the sensor.

## Phase structure

::specs::
Bench · Days 1–10 | Does the unit meet its own datasheet on my bench, and what does the incumbent do on the same bench?
Controlled · Days 11–30 | How does it behave against my known-difficult targets, background, floor and lighting, with enough samples to bound the rate?
In situ · Days 31–70 | What fails that nobody predicted — in the real environment, on the real machine, logged continuously?
Duty / drift · Days 71–85 | Does performance hold under production duty cycle, and does the bench measurement repeat at the end?
Decision · Days 86–90 | Does the measured result clear the pre-registered criterion, and what happens next?
::end::

*Fig. 1 — Phase structure. Windows are indicative; the ordering is not.*

### Bench (days 1–10)

Verify range and accuracy at three or more known distances against a reference — a surveyed target or a laser distance meter with an order of magnitude better uncertainty than the unit under test. Confirm interface, data format, timestamp behavior, and integration into your stack. Run the incumbent through the identical sequence.

Record the raw numbers, not a pass/fail. You will need them at day 85.

### Controlled (days 11–30)

Test the specific things you have reason to worry about, under conditions you set. Difficult targets from your own facility — low-reflectance surfaces, specular surfaces, textureless panels. Difficult geometry. Difficult lighting: if direct sun touches the work area, the same test at 09:00 and 14:00 is two different tests, and reporting only one of them is a choice.

Repeat to your pre-registered n. A single successful detection is an anecdote; a distribution is a measurement.

### In situ (days 31–70)

Production machine, production task, production environment. This phase is long because it is the only one that surfaces the conditions you did not think to construct — the specific aisle where a reflection off racking degrades the scan match, the pallet wrap that reads as a surface 4 cm off the true face, the thermal transient at a dock door in the afternoon.

Log continuously and at full rate. The value of this phase is in the events nobody was watching for; if you rely on an operator noticing an anomaly and writing it down, you will capture the anomalies that were obvious and miss the ones that matter.

### Duty and drift (days 71–85)

Run at production duty cycle. If the machine will run three shifts, run three shifts — this phase answers whether performance holds, which is a different question from whether it was ever achieved.

Then repeat the day-10 bench measurement on the same unit, against the same reference, at the same distances. The delta between day 10 and day 85 is the finding. Drift within a 90-day window on a unit that will serve for four years is worth understanding before it becomes a fleet-wide characteristic.

### Decision (days 86–90)

Compile against the criterion written on day zero. Report the measured value with its confidence bound, the baseline value under the same conditions, and every anomaly logged — including the ones that were explained away, with the explanation.

---

## Instrumentation and confounds

A few things that quietly invalidate otherwise well-run tests:

- *Mounting geometry.* Bench height and tilt must match production. A sensor evaluated at 400 mm and deployed at 250 mm is a different sensor as far as ground-plane returns and minimum-detectable-height are concerned.
- *Timestamp alignment.* If sensor timestamps and ego-motion are not aligned to a common clock, apparent accuracy error at speed is really a synchronization error. Verify this on the bench, at day 5, not in the analysis at day 88.
- *Reference uncertainty.* Your reference needs materially better uncertainty than the unit under test. Measuring a ±3 cm sensor against a ±2 cm reference produces a number, but not the one you think.
- *Target specification.* "A box" is not a target. Reflectance, size, and surface finish all belong in the criterion — detection rate against a 90% white target and a 10% matte black target are unrelated numbers.
- *Firmware changes mid-test.* A firmware update during the window resets the test. Record the version at every phase boundary.
- *Single-unit inference.* One unit tells you about one unit. Unit-to-unit variation is a separate question, and if the fleet is large it may be the more important one.

## Review scope beyond the sensing performance

Three items that are cheap to check in week one and expensive to discover at day 88.

- *Certification.* If a protective function is in scope, the certification chain — IEC 61496 for the device, ISO 13849 for the system-level PL assessment — should be reviewed by whoever signs the safety case before the field work begins, not after. A certification gap discovered at day 88 invalidates the schedule regardless of how good the point cloud was. No amount of measured obstacle-detection performance substitutes for a certificate; they are different claims evaluated by different means.
- *Integration surface.* Data format, driver maturity, interface stability, and behavior on fault — what the unit does when it is occluded, saturated, or losing power — are part of the evaluation. Fault behavior in particular is rarely on a datasheet and always relevant.
- *Supply and lifecycle.* Lead time, revision policy, and end-of-life notice period determine whether a unit that passes is a unit you can build on. This is not a sensing question, but it is an acceptance question.

## Who reviews the result

A test that produces a clean result and then stalls has still failed, later and at higher cost. The set of people whose review the outcome requires should be identified at day zero and see the criterion then — not at day 90.

- *The engineer who owns the sensing stack* ran the test, holds the data, and is generally the only person who knows what actually happened in week six.
- *Whoever owns the budget line and the supplier relationship* — a procurement cycle started at day 90 begins from zero at the moment the evidence is freshest, and evidence does not stay fresh.
- *The safety engineer,* if a protective function is in scope — they sign the field drawing, and they should have seen the certification documentation in week one.
- *Operations,* who will live with the unit and who know things about the environment that will not appear in any log.

## What a completed test produces

At day 90 the artifact should contain:

- The pre-registered criterion, verbatim, with its date.
- The measured result with sample size and confidence bound.
- The baseline result under identical conditions.
- Bench measurements at day 10 and day 85 on the same unit, against the same reference.
- Performance against enumerated difficult targets, with counts and target specifications.
- A complete anomaly log, including explained anomalies and their explanations.
- Firmware versions at each phase boundary.
- Certification documentation reviewed and accepted, where in scope.
- A dated next action with a named owner.

The last line is not administrative. A test that concludes without a dated next action does not conclude — it goes quiet, and quiet is operationally identical to a negative result, minus the information.

## Loaner and purchased units are different experiments

Worth stating because the distinction changes the design.

A loaner has a return date, which functions as an externally imposed deadline. That is a real advantage: it forces the decision meeting to exist. Schedule the day-90 review the week the unit arrives and let the return date hold it.

A purchased unit has no forcing function, so the evaluation can extend indefinitely at no apparent cost — which is how a ninety-day question becomes a nine-month one. If you buy the unit, the deadline has to be manufactured and owned deliberately.

---

::callout|A note on how we would rather this go::
MorpheusTEK ships units on a 90-day trial. That is only worth something if the ninety days produce a number, so we would rather help write the criterion at day zero than receive an impression at day 90. If the measured result comes in under your threshold, that is a finding, and it is considerably cheaper on your bench than in your fleet.
::end::

::takeaways::
- Pre-register the acceptance criterion — measurand, threshold, conditions, and sample size — before any data is collected.
- Size the sample to the rate you're claiming; the rule of three (p_fail_upper ≈ 3/n) shows why 50 clean runs can't support a 99.5% claim.
- Run an identical protocol against the incumbent sensor — without a baseline, every number is unanchored.
- Structure the 90 days into bench, controlled, in-situ, duty/drift, and decision phases, and repeat the bench measurement at the end to catch drift.
- Loop in the safety engineer, procurement, and operations at day zero, not day 90 — and produce a dated next action either way.
::end::

::cta::
Start a 90-day trial|/book-a-meeting?intent=trial
Get the requirements worksheet|/resources/custom-lidar-requirements-worksheet
::end::
`,
};
