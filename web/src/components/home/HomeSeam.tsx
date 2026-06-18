import { CtaBand } from "@/components/marketing/CtaBand";
import { site } from "@/lib/site";
import { getProduct } from "@/lib/catalog";
import { HeroSeam } from "./HeroSeam";
import { TrustBand } from "./TrustBand";
import { AssemblyStack } from "./AssemblyStack";
import { CertifyPlot } from "./CertifyPlot";
import { RangeLedger } from "./RangeLedger";
import { CategoryBrowse } from "./CategoryBrowse";

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE — "The Seam"
//
// The synthesized winner of the 2026-06-12 client review, assembled from the
// components the client said they loved. Section order is tuned for FLOW —
// hook → payoff → proof → breadth → explore → authority → act. Sections alternate
// tone (lift/recess) with hairline borders so each reads as its own plate.
//
//   1. Hero — the draggable reality ⇄ LiDAR seam (the hook)              [dark]
//   2. Assembly — the loved 4-step stack + AMR/AGV/Humanoid/Mining tabs  [lift]
//   3. Certify — GS1-5 field drawn to scale, on a blueprint grid (peak)  [recess]
//   4. Range — "centimeters to a football field" (breadth)              [lift]
//   5. Browse — products by category, real images, no white catalog     [recess]
//   6. Trust — "30 years, not fly-by-night" + SICK reframe (authority)   [lift]
//   7. Closing CTA — "Try it free, 90 days. Your floor."                 [dark]
//
// Deliberately NOT included (client rejected on the call): pricing/$ figures, the
// "spec your robot" wizard (too simplistic for engineers), the control-room page.
// Everything degrades to a static, fully-readable layout under no-JS / reduced motion.
// ─────────────────────────────────────────────────────────────────────────────

export function HomeSeam() {
  // Hero cert caption, data-driven from the GS1-5 record (the safety-badge rule —
  // it can't describe another SKU). 2.5 m = the configured field the scan renders.
  const gs15 = getProduct("gs1-5-safety-lidar");
  const spec = (label: string, fallback: string) =>
    gs15?.keySpecs?.find((s) => s.label === label)?.value ?? fallback;
  const cert = {
    configured: "2.5 m",
    max: spec("Protective range", "5 m max"),
    rating: spec("Safety rating", "Type 3 · SIL2 · PL d"),
    angle: spec("Scanning angle", "270°"),
  };

  return (
    <>
      <HeroSeam distributor={site.distributor} problem={site.heroProblem} cert={cert} />
      <AssemblyStack />
      <CertifyPlot />
      <RangeLedger />
      <CategoryBrowse />
      <TrustBand />
      <CtaBand
        eyebrow="The 90-day acceptance test"
        title="Try it free, 90 days. Your floor."
        body="Put a MorpheusTEK unit in your own environment and prove it on your robots. If it doesn't earn its place, send it back — no commitment."
        primary={{ label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" }}
        secondary={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
      />
    </>
  );
}
