import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getProduct } from "@/lib/catalog";
import { ClauseHeader } from "./ClauseHeader";

/* §02 — The Economics (THE dark band — the only one on the page)
   The price gap rendered as distance on a dimensioned axis. Equivalence is
   asserted first (both certified to the same class); then the premium is
   felt spatially. Relative multiples by default — absolute SICK dollars
   only after Phil/Tom sign-off.

   Axis scale: linear, 0–23×. GS1-5 = 1×. Comparable SICK safety scanners
   span ~2×–22× of the GS1-5 list price (nanoScan3 → outdoorScan3). */

const AXIS_MAX = 23;
const x = (mult: number) => `${((mult / AXIS_MAX) * 100).toFixed(1)}%`;

export function TheEconomics() {
  const gs15 = getProduct("gs1-5-safety-lidar")!;

  return (
    <section className="dark border-y border-border bg-bg py-24 md:py-28">
      <Container>
        <ClauseHeader
          index="02"
          eyebrow="The economics"
          title={
            <>
              The same safety class.
              <br />A third of the price.
            </>
          }
          lead={
            <>
              Both scanners are certified Type 3 ESPE · SIL2 · PL d. The
              certificate settles equivalence — what&apos;s left to discuss is
              the premium.
            </>
          }
        />

        {/* the price axis */}
        <div className="mt-16 max-w-5xl">
          <div className="relative h-28">
            {/* SICK band — hatched; draws left→right on scroll */}
            <div
              data-draw
              className="absolute top-4 h-7 border border-line-ink [transition-duration:1.4s]"
              style={{
                left: x(2.1),
                right: `${100 - parseFloat(x(22.6))}%`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 4px, var(--line-ink) 4px 5px)",
              }}
            />
            <p
              className="absolute top-[-8px] font-mono text-anno-sm uppercase text-text-muted"
              style={{ left: x(2.1) }}
            >
              Comparable SICK safety scanners · ~2× – 22×
            </p>
            {/* GS1-5 tick — the viewport's yellow; rises into place */}
            <div data-draw="y" className="absolute top-2 h-11 w-1 bg-accent" style={{ left: x(1) }} />
            <p className="absolute top-16 font-mono text-anno uppercase text-text-strong" style={{ left: "0%" }}>
              GS1-5 ·{" "}
              <span className="tnum" data-count="1950" data-prefix="$">
                $1,950
              </span>
              <span className="ml-2 text-text-muted">1×</span>
            </p>
            {/* baseline + scale ticks */}
            <div className="absolute inset-x-0 top-[60px] border-t border-line-ink" />
            {[1, 5, 10, 15, 20].map((m) => (
              <span key={m} className="absolute top-[60px] h-2 border-l border-line-ink" style={{ left: x(m) }} />
            ))}
            {[5, 10, 15, 20].map((m) => (
              <span
                key={m}
                className={`tnum absolute top-[72px] -translate-x-1/2 font-mono text-anno-sm text-text-subtle ${m === 5 ? "max-sm:hidden" : ""}`}
                style={{ left: x(m) }}
              >
                {m}×
              </span>
            ))}
          </div>
          <p className="mt-2 font-mono text-anno-sm uppercase text-text-subtle">
            Multiples of GS1-5 list price · nanoScan3 → outdoorScan3 · approximate
          </p>
        </div>

        {/* where they differ — 3 rows only, sourced from catalog compare data */}
        <div className="mt-16 max-w-3xl">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border pb-2 font-mono text-anno-sm uppercase text-text-muted">
            <span>Where they differ</span>
            <span className="text-right">GS1-5</span>
            <span className="text-right">nanoScan3</span>
          </div>
          {gs15.compare!.map((row) => {
            const wins = row.spec === "Protective range";
            return (
              <div
                key={row.spec}
                className="grid grid-cols-[1.4fr_1fr_1fr] items-baseline border-b border-border py-3"
              >
                <span className="text-sm text-text-muted">{row.spec}</span>
                <span className={`tnum text-right font-mono text-anno ${wins ? "font-bold text-accent" : "text-text-strong"}`}>
                  {row.mt}
                </span>
                <span className="tnum text-right font-mono text-anno text-text-muted">{row.competitor}</span>
              </div>
            );
          })}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] items-baseline border-b border-border py-3">
            <span className="text-sm text-text-muted">90-day on-robot trial</span>
            <span className="text-right font-mono text-anno text-text-strong">Yes</span>
            <span className="text-right font-mono text-anno text-text-muted">—</span>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-lead text-text">
          SICK builds excellent scanners. The question is the premium.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <Link
            href="/resources/sick-hokuyo-alternative-comparison-checklist"
            className="font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Download the SICK-alternative checklist →
          </Link>
          <Link
            href="/compare/sick-alternative-lidar"
            className="font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Read the full comparison →
          </Link>
        </div>
      </Container>
    </section>
  );
}
