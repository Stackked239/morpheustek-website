import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/marketing/CtaBand";
import { site } from "@/lib/site";
import { HeroIntoFocus } from "./_components/HeroIntoFocus";
import { PerceptionStack } from "./_components/PerceptionStack";
import { StatBadges } from "./_components/StatBadges";
import { FeaturedProduct } from "./_components/FeaturedProduct";
import { ProductReel } from "./_components/ProductReel";
import { ScrollReveal } from "./_components/ScrollReveal";

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE DRAFT — Variant 2 · "Into Focus"  (owner: John)
//
// Bold navy ⇄ yellow angular duotone (matches the live morpheustek.com), with
// GSAP + ScrollTrigger scroll choreography. The deliberate opposite of Variant 1
// (the live-scanning HUD): refined, editorial, scroll-resolved.
//
//   [x] 1. Hero — radar-sweep panel, entrance timeline + parallax
//   [x] 2. Pillars rail
//   [x] 3. Perception-stack assembler — pinned, scrubbed (centerpiece)
//   [x] 4. Manufacturing strength — circular stat count-ups
//   [x] 5. Featured product — full-yellow band
//   [x] 6. Product reel — pinned horizontal
//   [x] 7. SICK comparison — scrubbed rows
//   [x] 8. Closing CTA
//
// All animation degrades to a static, fully-readable layout under
// prefers-reduced-motion / no-JS. Preview at /home-2; compare at /home-drafts.
// When this variant wins: copy into app/page.tsx + move _components up, then
// delete app/(drafts)/.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Homepage draft — Variant 2 · Into Focus",
  robots: { index: false, follow: false }, // drafts are never indexed
};

const compareRows: [string, string, string][] = [
  ["Safety rating", "Type 3 · SIL2 · PL d", "Type 3 · SIL2 · PL d"],
  ["Protective range", "5 m", "3 m"],
  ["Scanning angle", "270°", "275°"],
  ["Accuracy", "≤ 70 mm resolution", "Comparable"],
  ["90-day trial", "Yes", "—"],
];

export default function HomeVariant2() {
  return (
    <>
      {/* 1 */} <HeroIntoFocus />

      {/* 2 — pillars rail */}
      <section className="border-y border-border bg-bg-subtle">
        <Container className="grid gap-px md:grid-cols-3">
          {site.pillars.map((p, i) => (
            <div key={i} className="flex items-start gap-3 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
              <span className="mt-0.5 font-mono text-sm font-bold text-brand-blue">{`0${i + 1}`}</span>
              <p className="text-sm font-medium text-text">{p}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* 3 */} <PerceptionStack />
      {/* 4 */} <StatBadges />
      {/* 5 */} <FeaturedProduct />
      {/* 6 */} <ProductReel />

      {/* 7 — SICK comparison (scrubbed rows) */}
      <Section tone="subtle">
        <Container>
          <ScrollReveal className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div data-reveal>
              <Eyebrow>The honest comparison</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold uppercase leading-[1.05] tracking-tight text-text-strong">
                SICK is excellent. The question is whether you need to pay the SICK premium.
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                Our GS1-5 carries the same safety class — Type 3 / SIL2 / PL d — at a fraction of the price, and beats
                the nanoScan3 on protective range. At fleet scale, the per-unit delta is often your whole project margin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/compare/sick-alternative-lidar" variant="primary" size="lg">
                  See the comparison
                </Button>
                <Button href="/safety-lidar" variant="ghost" size="lg">
                  Explore safety LiDAR
                </Button>
              </div>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-border bg-bg-muted text-xs font-semibold uppercase tracking-wide text-text-muted">
                <span className="p-3">Spec</span>
                <span className="border-l border-border bg-accent/10 p-3 text-text-strong">OLEI GS1-5</span>
                <span className="border-l border-border p-3">SICK nanoScan3</span>
              </div>
              {compareRows.map((row, i) => (
                <div
                  key={row[0]}
                  data-reveal
                  className={`tnum grid grid-cols-[1.2fr_1fr_1fr] text-sm ${i % 2 ? "bg-bg-muted/40" : ""}`}
                >
                  <span className="p-3 text-text-muted">{row[0]}</span>
                  <span className="border-l border-border bg-accent/10 p-3 font-semibold text-text-strong">{row[1]}</span>
                  <span className="border-l border-border p-3 text-text-muted">{row[2]}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 8 — closing CTA */}
      <CtaBand
        eyebrow="Giving sight to robotics"
        title="Let's get your robot seeing."
        body="Tell us what you're building. We'll map the right perception stack and put a trial unit in your hands."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "Browse the line-up", href: "/products" }}
      />
    </>
  );
}
