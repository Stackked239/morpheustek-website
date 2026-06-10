import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getProduct } from "@/lib/catalog";
import { ClauseHeader } from "./ClauseHeader";

/* §01 — The Instrument
   The GS1-5's certified protective field, drawn to scale as a plan-view polar
   plot (FIG 01). This is the page's one spectacle — in Slice 5 it draws itself
   on first viewport entry; until then (and for no-JS/reduced-motion/crawlers)
   it is the fully-drawn diagram a safety engineer would actually need.

   Geometry: 1 m = 5 px. 270° aperture (90° blind wedge at rear/bottom).
   Protective 5 m solid · warning 20–30 m dashed — values from catalog.ts. */

const C = { x: 200, y: 160 }; // sensor position
// arc endpoints for radius r, sweeping -45° → 225° (the 270° aperture)
const pt = (r: number, deg: number) => ({
  x: C.x + r * Math.cos((deg * Math.PI) / 180),
  y: C.y - r * Math.sin((deg * Math.PI) / 180),
});
const arc = (r: number) => {
  const a = pt(r, -45);
  const b = pt(r, 225);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 1 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export function TheInstrument() {
  const gs15 = getProduct("gs1-5-safety-lidar")!;

  return (
    <section className="bg-bg py-24 md:py-32">
      <Container>
        <ClauseHeader
          index="01"
          eyebrow="The instrument"
          title="The safety case, drawn to scale."
          lead={
            <>
              The OLEI GS1-5 is a 270° functional-safety scanner. FIG 01 is its
              certified protective field at 1:1 proportions — the drawing your
              safety engineer needs, not a render.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-8">
          {/* FIG 01 — the protective-field plan view */}
          <figure>
            <svg
              viewBox="0 0 400 300"
              role="img"
              aria-label="Plan view of the GS1-5 protective field: a 270° sector with a 5 metre protective boundary and a 20 to 30 metre warning boundary, drawn to scale"
              className="w-full max-w-2xl text-line-ink"
            >
              {/* blind-wedge edges */}
              <line x1={C.x} y1={C.y} x2={pt(150, -45).x} y2={pt(150, -45).y} stroke="currentColor" strokeWidth="0.5" />
              <line x1={C.x} y1={C.y} x2={pt(150, 225).x} y2={pt(150, 225).y} stroke="currentColor" strokeWidth="0.5" />
              {/* warning boundaries — dashed (20–30 m configurable max) */}
              <path d={arc(150)} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <path d={arc(100)} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              {/* protective boundary — solid, 5 m */}
              <path
                d={`M ${C.x} ${C.y} L ${pt(25, -45).x.toFixed(1)} ${pt(25, -45).y.toFixed(1)} A 25 25 0 1 0 ${pt(25, 225).x.toFixed(1)} ${pt(25, 225).y.toFixed(1)} Z`}
                fill="currentColor"
                fillOpacity="0.08"
                stroke="var(--text-strong)"
                strokeWidth="1.5"
              />
              {/* sensor */}
              <rect x={C.x - 4} y={C.y - 4} width="8" height="8" fill="var(--text-strong)" />
              {/* range labels along the vertical axis */}
              <g
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
                fontSize="10"
                textAnchor="middle"
              >
                <text x={C.x} y={C.y - 31}>5 m</text>
                <text x={C.x} y={C.y - 88}>20 m</text>
                <text x={C.x} y={C.y - 138}>30 m</text>
                <text x={pt(150, 225).x - 14} y={pt(150, 225).y + 14}>0°</text>
                <text x={pt(150, -45).x + 16} y={pt(150, -45).y + 14}>270°</text>
              </g>
            </svg>
            <figcaption className="dim-line mt-6 max-w-2xl font-mono text-anno-sm uppercase text-text-muted">
              Fig 01 · protective field · plan view · to scale
            </figcaption>
          </figure>

          {/* spec + certification column */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <p className="font-mono text-anno uppercase text-text">
              {gs15.name} safety scanner
            </p>
            <dl className="mt-4 border-t border-border">
              {gs15.specs.slice(0, 6).map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-6 border-b border-border py-3">
                  <dt className="text-sm text-text-muted">{s.label}</dt>
                  <dd className="tnum text-right font-mono text-anno text-text-strong">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-mono text-anno-sm uppercase text-text-muted">Certified to</p>
            <ul className="mt-3 border-t border-border font-mono text-anno">
              {gs15.certifications!.map((c) => {
                const [name, standard] = c.replace(")", "").split(" (");
                return (
                  <li key={c} className="flex items-baseline justify-between gap-6 border-b border-border py-3">
                    <span className="text-text-strong">{name}</span>
                    <span className="text-text-muted">{standard}</span>
                  </li>
                );
              })}
            </ul>
            <Link
              href={`/products/${gs15.slug}`}
              className="mt-8 inline-block font-semibold text-brand-blue underline-offset-4 hover:underline"
            >
              View the GS1-5 datasheet →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
