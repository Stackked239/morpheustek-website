import { CtaBand } from "@/components/marketing/CtaBand";
import { site } from "@/lib/site";
import { HeroSeam } from "./HeroSeam";
import { TrustBand } from "./TrustBand";
import { AssemblyStack } from "./AssemblyStack";
import { CertifyPlot } from "./CertifyPlot";
import { RangeLedger } from "./RangeLedger";
import { CategoryBrowse } from "./CategoryBrowse";
import { BuildToSpec } from "./BuildToSpec";

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
  return (
    <>
      <HeroSeam distributor={site.distributor} problem={site.heroProblem} />
      <RangeLedger />
      <AssemblyStack />
      <CertifyPlot />
      <CategoryBrowse />
      <TrustBand />
      <BuildToSpec />
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
