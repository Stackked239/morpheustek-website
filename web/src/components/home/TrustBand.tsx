import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProduct } from "@/lib/catalog";

// ─────────────────────────────────────────────────────────────────────────────
// TRUST BAND — "The Seam" homepage  (Phil's #1 cross-cutting ask)
//
// The neighbor that peeks above the fold under the hero: credibility, not
// catalog. Two beats — the heritage line ("30 years, not a fly-by-night
// manufacturer") and the SICK reframe ("nobody gets fired for choosing us
// either") — backed by a row of mono credibility facts. The functional-safety
// stat is DATA-DRIVEN from the GS1-5 record, so it can never describe another
// SKU (the safety-badge rule). One screen-band; one brand-blue text link, no
// yellow (the hero and the closing CTA own the yellow). Server component; the
// Reveal wrappers are html.js-gated and re-trigger on viewport entry, so SSR /
// no-JS / reduced-motion / crawlers read the finished, fully-legible band.
// ─────────────────────────────────────────────────────────────────────────────

type Stat = { value: string; label: string };

export function TrustBand() {
  // Pull the cert straight from the GS1-5 record — never hard-code the rating.
  // "Safety rating" → "Type 3 · SIL2 · PL d" (catalog.keySpecs); fall back to the
  // same string the hero uses so the band is legible even if the seed shifts.
  const gs15 = getProduct("gs1-5-safety-lidar");
  const safetyRating =
    gs15?.keySpecs?.find((s) => s.label === "Safety rating")?.value ?? "Type 3 · SIL2 · PL d";

  const stats: Stat[] = [
    { value: "30 yr", label: "Instrument heritage" },
    { value: safetyRating, label: "Functional safety · GS1-5" },
    { value: "90 day", label: "Trial on your floor" },
    { value: "OLEI", label: "Exclusive NA distributor" },
  ];

  return (
    <Section
      tone="subtle"
      className="relative isolate overflow-hidden border-t border-border !py-14 md:!py-20 !bg-bg-muted"
      id="trust"
    >
      {/* faint point-cloud field — graphics texture only, never reads as content */}
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />

      <Container className="relative grid gap-x-12 gap-y-10 md:grid-cols-[1.25fr_1fr] md:items-center">
        {/* ---- the claim ---- */}
        <div>
          <Eyebrow>Why MorpheusTEK</Eyebrow>

          <h2 className="mt-5 max-w-2xl font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            Not a fly-by-night brand. Thirty years building{" "}
            <span className="text-brand-blue">high-tech measurement instruments.</span>
          </h2>

          <p className="mt-5 max-w-xl text-lead text-text-muted">
            SICK is excellent — and nobody gets fired for choosing it. Nobody gets fired for
            choosing us either: the{" "}
            <span className="font-semibold text-text">same safety class</span>, proven on your
            floor, without the premium.
          </p>

          <Link
            href="/compare/sick-alternative-lidar"
            className="group mt-7 inline-flex items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-2"
          >
            See the line-by-line comparison
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>

        {/* ---- the proof: mono credibility facts, instrument-panel rhythm ---- */}
        <dl
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border"
          aria-label="MorpheusTEK credibility facts"
        >
            {stats.map((s, i) => (
              <div key={s.label} className="relative flex flex-col gap-1.5 bg-bg px-4 py-5">
                {/* data-driven safety badge — renders only on the GS1-5 cert cell */}
                {i === 1 && (
                  <ShieldCheck
                    className="absolute right-3 top-4 size-4 text-accent"
                    aria-hidden
                  />
                )}
                <dt className="font-mono text-h4 font-bold leading-none tracking-tight text-text-strong">
                  {s.value}
                </dt>
                <dd className="font-mono text-anno-sm uppercase tracking-[0.14em] text-text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

        {/* ---- world-scale supply: Phil's manufacturing-scale beat, echoed from /about.
             Full-width row under the grid; borrowed credibility, not-a-startup signal. ---- */}
        <div className="relative flex flex-col gap-3 rounded-r-md border-l-2 border-l-accent bg-bg px-5 py-5 sm:flex-row sm:items-center sm:gap-6 md:col-span-2">
          <p className="flex shrink-0 items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue">
            <Globe className="size-4" aria-hidden />
            World-scale supply
          </p>
          <p className="text-text">
            Backed by{" "}
            <span className="font-semibold text-text-strong">
              one of the world&apos;s largest laser-diode purchasing footprints
            </span>{" "}
            — not a startup, a manufacturing-backed perception partner.
          </p>
        </div>
      </Container>
    </Section>
  );
}
