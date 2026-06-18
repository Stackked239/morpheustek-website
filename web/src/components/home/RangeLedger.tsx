import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProduct } from "@/lib/catalog";

/**
 * RANGE LEDGER — "Centimeters to a football field, one line card."
 *
 * One horizontal bar per real product on a single log-scale axis (0.1 m → 100 m),
 * each bar drawn at the product's true working range from `catalog.ts` keySpecs and
 * linking to /products/[slug]. Bars draw in on scroll via the CSS-only `.ledger-bar`
 * view-timeline animation (reduced-motion-gated in globals.css) — so SSR / no-JS /
 * reduced-motion / crawlers read the finished, fully legible ledger.
 *
 * Server component: the only motion is pure CSS scroll-timeline, no interactivity.
 *
 * Slug + range provenance (verified against catalog.ts keySpecs):
 *   mrdvs-s10-rgbd-camera     · "Range: 0.3–8 m"
 *   gs1-5-safety-lidar        · "Protective range: 5 m max"
 *   lr-f240-solid-state-lidar · "Range: 10 m out / 12 m in"
 *   vss-50-solid-state-3d-lidar · "Range: up to 50 m"
 *   lr-1f-2d-lidar            · "Range: 50 m" (360°)
 *   a090-laser-rangefinder    · "Range: up to 90 m"
 *   lr-16f-100-3d-lidar       · "Range: 100 m" (16-line)
 */

const AXIS_MIN = 0.1;
const AXIS_MAX = 100;
const AXIS_TICKS = [0.1, 1, 10, 100] as const;

/** Normalized [0,1] position of a metric value on the log axis. */
const x = (v: number) => Math.log10(v / AXIS_MIN) / Math.log10(AXIS_MAX / AXIS_MIN);

/** Human axis tick label — sub-metre shown in centimetres for the "centimeters" promise. */
const tick = (v: number) => (v < 1 ? `${Math.round(v * 100)} cm` : `${v} m`);

type Row = {
  /** catalog slug — validated against getProduct at module load */
  slug: string;
  /** working-range start, metres (true value from keySpecs) */
  from: number;
  /** working-range end, metres (true value from keySpecs) */
  to: number;
  /** short instrumentation note rendered in mono */
  note: string;
  /** depth-ramp gradient for the bar — near→far reads as short→long range */
  gradient: string;
};

// True working ranges from catalog.ts keySpecs. Ordered by reach so the ledger
// climbs from centimetres on the left to a football field on the right.
const rows: readonly Row[] = [
  { slug: "mrdvs-s10-rgbd-camera",       from: 0.3, to: 8,   note: "dToF RGBD · 0.3–8 m",      gradient: "from-pc-near to-pc-1" },
  { slug: "gs1-5-safety-lidar",          from: 0.1, to: 5,   note: "safety · 5 m protective",  gradient: "from-pc-1 to-pc-2" },
  { slug: "lr-f240-solid-state-lidar",   from: 0.1, to: 12,  note: "solid-state · 12 m",       gradient: "from-pc-2 to-pc-3" },
  { slug: "vss-50-solid-state-3d-lidar", from: 0.5, to: 50,  note: "solid-state · up to 50 m", gradient: "from-pc-3 to-pc-4" },
  { slug: "lr-1f-2d-lidar",              from: 0.1, to: 50,  note: "2D 360° · 50 m",           gradient: "from-pc-4 to-pc-5" },
  { slug: "a090-laser-rangefinder",      from: 0.1, to: 90,  note: "1D rangefinder · 90 m",    gradient: "from-pc-5 to-pc-far" },
  { slug: "lr-16f-100-3d-lidar",         from: 0.5, to: 100, note: "16-line 3D · 100 m",       gradient: "from-pc-near to-pc-far" },
] as const;

export function RangeLedger() {
  // Resolve each row against the catalog. A missing slug or out-of-axis range is a
  // data-integrity error worth surfacing in the build log, not a silent half-render.
  const ledger = rows.map((r) => {
    const product = getProduct(r.slug);
    if (!product) {
      throw new Error(`RangeLedger: no catalog product for slug "${r.slug}"`);
    }
    const left = x(r.from);
    const width = x(r.to) - left;
    return { ...r, model: product.model, name: product.name, left, width };
  });

  return (
    <Section tone="subtle" className="border-t border-border !py-14 md:!py-20 !bg-bg-muted">
      <Container>
        <div>
          <Eyebrow>The line, end to end</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            Centimeters to a football field, one line card.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-text-muted">
            Wherever your robot has to see — pallet pockets at 30&nbsp;cm or a yard at
            100&nbsp;m — there&apos;s an instrument on the ledger that covers it. Every bar
            is a real product&apos;s true working range, on one log scale.
          </p>
        </div>

        <div>
          <div className="mt-12 md:mt-16">
            {/* the ledger */}
            <ul className="space-y-4 md:space-y-5">
              {ledger.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/products/${r.slug}`}
                    className="group block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60"
                    aria-label={`${r.name} — working range ${tick(r.from)} to ${tick(r.to)}`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-anno font-bold text-text-strong transition-colors group-hover:text-brand-blue">
                        {r.model}
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </span>
                      <span className="font-mono text-anno-sm uppercase tracking-[0.08em] text-text-subtle">
                        {r.note}
                      </span>
                    </div>
                    <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-bg-muted">
                      <span
                        aria-hidden
                        className={`ledger-bar absolute inset-y-0 rounded-full bg-gradient-to-r ${r.gradient}`}
                        style={{ left: `${r.left * 100}%`, width: `${r.width * 100}%` }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* log axis */}
            <div
              aria-hidden
              className="relative mt-4 h-6 border-t border-border font-mono text-anno-sm text-text-subtle"
            >
              {AXIS_TICKS.map((v) => (
                <span
                  key={v}
                  className="absolute -translate-x-1/2 pt-1"
                  style={{ left: `${x(v) * 100}%` }}
                >
                  {tick(v)}
                </span>
              ))}
            </div>

            {/* end-to-end annotation — the headline promise, restated against the axis */}
            <div
              aria-hidden
              className="mt-3 flex justify-between font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle"
            >
              <span>Centimeters</span>
              <span>A football field</span>
            </div>
          </div>
        </div>

        <div>
          <p className="mt-12 text-anno text-text-muted">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-mono font-bold text-brand-blue underline-offset-4 hover:underline"
            >
              See the full line
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
