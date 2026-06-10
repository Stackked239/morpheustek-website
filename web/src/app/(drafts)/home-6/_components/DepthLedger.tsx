import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Working range of the line, on one log-scale ledger (0.1 m → 100 m). Each bar
 * is a real product's true range from catalog.ts; bars draw in on scroll via
 * the CSS-only .ledger-bar view-timeline animation.
 */

const AXIS_MIN = 0.1;
const AXIS_MAX = 100;
const x = (v: number) => Math.log10(v / AXIS_MIN) / Math.log10(AXIS_MAX / AXIS_MIN);

// true ranges from catalog.ts keySpecs
const rows = [
  { model: "MRDVS S10", note: "dToF RGBD · 0.3–8 m", from: 0.3, to: 8, slug: "mrdvs-s10-rgbd-camera", cls: "from-pc-near to-pc-1" },
  { model: "GS1-5", note: "safety · 5 m protective", from: 0.1, to: 5, slug: "gs1-5-safety-lidar", cls: "from-pc-1 to-pc-2" },
  { model: "VSS-50", note: "solid-state · up to 50 m", from: 0.5, to: 50, slug: "vss-50-solid-state-3d-lidar", cls: "from-pc-2 to-pc-3" },
  { model: "LR-1F", note: "2D 360° · 50 m", from: 0.1, to: 50, slug: "lr-1f-2d-lidar", cls: "from-pc-3 to-pc-4" },
  { model: "A090", note: "1D rangefinder · up to 90 m", from: 0.1, to: 90, slug: "a090-laser-rangefinder", cls: "from-pc-4 to-pc-5" },
  { model: "LR-16F-100", note: "16-line 3D · 100 m", from: 0.5, to: 100, slug: "lr-16f-100-3d-lidar", cls: "from-pc-5 to-pc-far" },
] as const;

export function DepthLedger() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl font-display text-h2 font-bold text-text-strong">
            Centimeters to a football field, one line card.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-text-muted">
            Wherever your robot has to see — pallet pockets at 30 cm or a yard at 100 m — there&apos;s
            an instrument on the ledger that covers it.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {rows.map((r) => (
            <Link key={r.model} href={`/products/${r.slug}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-anno font-bold text-text-strong group-hover:text-brand-blue">
                  {r.model}
                </span>
                <span className="font-mono text-anno-sm text-text-subtle">{r.note}</span>
              </div>
              <div className="relative mt-1.5 h-3 rounded-full bg-bg-muted">
                <span
                  aria-hidden
                  className={`ledger-bar absolute inset-y-0 rounded-full bg-gradient-to-r ${r.cls}`}
                  style={{ left: `${x(r.from) * 100}%`, width: `${(x(r.to) - x(r.from)) * 100}%` }}
                />
              </div>
            </Link>
          ))}
          {/* log axis */}
          <div aria-hidden className="relative h-6 border-t border-border font-mono text-anno-sm text-text-subtle">
            {[0.1, 1, 10, 100].map((v) => (
              <span key={v} className="absolute -translate-x-1/2 pt-1" style={{ left: `${x(v) * 100}%` }}>
                {v < 1 ? `${v} m` : `${v} m`}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
