"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getProduct } from "@/lib/catalog";

/* ============================================================================
   SITE YOU CAN CERTIFY — "Sight you can certify."
   ----------------------------------------------------------------------------
   Phil's note: "really like the safety case drawn to scale." This is the GS1-5's
   certified 270° protective field, plotted at true proportions: a 270° arc with a
   90° rear blind sector, the configured protective radius dimensioned against the
   5 m max ring, an AMR footprint at the origin, and concentric metric scale rings.

   Discipline (Blueprint, inherited from home-1 FIG 01): linework is structural
   ink only — brand-blue / --line-ink — NEVER neon, never glowing, never looping.
   The protective field is a low-opacity accent fill, not a glow.

   Data: every number comes from getProduct("gs1-5-safety-lidar") — the
   Type 3 / SIL2 / PL d badge renders ONLY because that product carries a
   `certifications` array, so it can't leak onto another SKU. The drawn
   configured radius is 2.5 m (the field configured in the hero scan); the catalog
   "Protective range" (5 m max) is the outer ring it's dimensioned against.

   Motion: a local IntersectionObserver toggles `is-visible` (re-triggers on every
   re-entry — the client asked for replay-on-scroll). All hidden/animated states
   live under `.js [data-certplot]` + are gated behind prefers-reduced-motion:
   no-preference, so SSR / no-JS / reduced-motion / crawlers read the FINAL,
   fully-drawn diagram. Geometry scale: 1 m = 30 px.
   ========================================================================== */

// ---- geometry (plan view, SVG user units; 1 m = SCALE px) ------------------
const VIEW = { w: 460, h: 360 };
const C = { x: 230, y: 196 }; // sensor / field origin (AMR footprint), nudged up for the rear wedge
const SCALE = 30; // px per metre
const CONFIGURED_M = 2.5; // drawn protective radius (the field configured in the hero scan)
const RINGS_M = [1, 2, 3, 4, 5] as const; // concentric scale rings, metres

// the 270° aperture sweeps -45° → 225° (a 90° blind wedge centred on the rear / bottom)
const APERTURE_START = -45;
const APERTURE_END = 225;

const pt = (r: number, deg: number) => ({
  x: C.x + r * Math.cos((deg * Math.PI) / 180),
  y: C.y - r * Math.sin((deg * Math.PI) / 180),
});

// open arc from APERTURE_START → APERTURE_END at radius r (large-arc, CCW in SVG)
const arc = (r: number) => {
  const a = pt(r, APERTURE_START);
  const b = pt(r, APERTURE_END);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 1 0 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

// closed 270° sector wedge (origin → edge → arc → origin) for the protective fill
const sector = (r: number) => {
  const a = pt(r, APERTURE_START);
  const b = pt(r, APERTURE_END);
  return `M ${C.x} ${C.y} L ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 1 0 ${b.x.toFixed(2)} ${b.y.toFixed(2)} Z`;
};

// pull "Type 3", "SIL2", "PL d" tokens out of the catalog cert strings — keeps
// the badge a projection of real data, not hand-typed text that could drift.
function certTokens(certifications: string[]): string[] {
  const find = (re: RegExp) => certifications.map((c) => c.match(re)?.[0]).find(Boolean);
  return [
    find(/Type\s*\d+/i),
    find(/SIL\s*\d+/i),
    find(/PL\s*[a-e]/i),
  ].filter((t): t is string => Boolean(t));
}

export function CertifyPlot() {
  const product = getProduct("gs1-5-safety-lidar");
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  // Local draw-in: toggle `is-visible` on the figure as it enters / leaves the
  // viewport. Toggling (not once-only) gives the client's replay-on-scroll.
  // Gated to html.js (set before paint) + reduced-motion: no-preference; the
  // final, fully-drawn state is the SSR / no-JS / reduced-motion default.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setDrawn(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Defensive: the GS1-5 should always exist in the catalog. If it ever doesn't,
  // render nothing rather than fabricating uncertified specs.
  if (!product) return null;

  // Real catalog facts. "Protective range" is the spec we dimension against.
  const protectiveSpec =
    product.specs.find((s) => s.label === "Protective range") ??
    product.keySpecs.find((s) => s.label === "Protective range");
  const protectiveMax = protectiveSpec?.value ?? "5 m max"; // e.g. "5 m max"
  const angleSpec = product.specs.find((s) => s.label === "Scanning angle")?.value ?? "270°";
  const certs = product.certifications ?? [];
  const badge = certTokens(certs);

  const configuredEdge = pt(CONFIGURED_M * SCALE, 90); // top of field — anchors the dimension caption
  const startEdge = pt(5 * SCALE, APERTURE_START);
  const endEdge = pt(5 * SCALE, APERTURE_END);

  return (
    <Section tone="default" id="certify" className="relative isolate overflow-hidden border-t border-border">
      {/* blueprint drafting grid — this section IS an engineering drawing; the
          grid makes it the recessed "drawing board" that anchors the page rhythm */}
      <div className="draft-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      {/* seam blend — soft tonal lift at the bottom edge so this light section eases into
          CategoryBrowse's matching top lift instead of a hard same-tone seam. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--bg-muted),transparent)]" aria-hidden />
      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* ---- copy column ---- */}
          <div className="max-w-xl">
            <Eyebrow>The safety case</Eyebrow>
            <h2 className="mt-5 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
              Sight you can <span className="text-brand-blue">certify.</span>
            </h2>
            <p className="mt-6 text-lead text-text-muted">
              The {product.name} is a {angleSpec} functional-safety scanner — the same safety
              class as SICK, certified to stop for people. This is its protective field at true
              proportions: the drawing your safety engineer signs off on, not a render.
            </p>
            <p className="mt-4 text-text-muted">
              Configured to a {CONFIGURED_M} m protective radius and
              dimensioned against the {protectiveMax.replace(" max", "")} maximum — 30 years of
              high-tech measurement instruments behind every ring. Nobody gets fired for choosing
              the safe option, and nobody gets fired for choosing us either.
            </p>

            {/* data-driven cert badge — renders ONLY because the GS1-5 carries
                a `certifications` array. Tokens are parsed from that array. */}
            {badge.length > 0 && (
              <div className="mt-8 inline-flex items-stretch border border-border bg-surface">
                <span className="flex items-center bg-accent px-3 font-mono text-anno-sm uppercase tracking-[0.12em] text-accent-text">
                  Certified
                </span>
                <ul className="flex divide-x divide-border font-mono text-anno uppercase tracking-[0.06em] text-text-strong">
                  {badge.map((t) => (
                    <li key={t} className="px-4 py-2.5">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <Button href="/safety-lidar" variant="ghost" size="lg">
                See the safety LiDAR
              </Button>
              <Link
                href="/compare/sick-alternative-lidar"
                className="mt-4 block font-mono text-anno uppercase tracking-[0.08em] text-brand-blue underline-offset-4 hover:underline"
              >
                Compare to the SICK alternative →
              </Link>
            </div>
          </div>

          {/* ---- FIG: the protective field, drawn to scale ---- */}
          <figure
            ref={ref}
            data-certplot
            className={drawn ? "is-visible" : undefined}
          >
            <svg
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              role="img"
              aria-label={`Plan view of the ${product.name} protective field: a ${angleSpec} sector with a 90 degree rear blind zone, drawn to scale with a ${CONFIGURED_M} metre configured protective radius and a ${protectiveMax} maximum, with concentric one-metre scale rings.`}
              className="w-full text-line-ink"
            >
              {/* concentric scale rings (1–5 m) + their metric labels */}
              <g className="certplot-rings">
                {RINGS_M.map((m) => (
                  <path
                    key={m}
                    d={arc(m * SCALE)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={m === 5 ? 1 : 0.6}
                    strokeDasharray={m === 5 ? "5 4" : "2 4"}
                  />
                ))}
              </g>

              {/* blind-wedge edges (the 90° rear sector the scanner cannot see) */}
              <g className="certplot-rings">
                <line
                  x1={C.x}
                  y1={C.y}
                  x2={startEdge.x.toFixed(2)}
                  y2={startEdge.y.toFixed(2)}
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
                <line
                  x1={C.x}
                  y1={C.y}
                  x2={endEdge.x.toFixed(2)}
                  y2={endEdge.y.toFixed(2)}
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              </g>

              {/* protective field — solid boundary, low-opacity accent fill.
                  pathLength=1 lets CSS draw the stroke via stroke-dashoffset
                  without measuring the geometry (no hydration risk). */}
              <path
                className="certplot-field"
                pathLength={1}
                d={sector(CONFIGURED_M * SCALE)}
                fill="var(--accent)"
                fillOpacity="0.1"
                stroke="var(--brand-blue)"
                strokeWidth="1.5"
              />

              {/* to-scale radius dimension line: origin → configured edge */}
              <g className="certplot-dim" fill="var(--brand-blue)">
                <line
                  x1={C.x}
                  y1={C.y}
                  x2={configuredEdge.x.toFixed(2)}
                  y2={configuredEdge.y.toFixed(2)}
                  stroke="var(--brand-blue)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* end tick at the configured boundary */}
                <line
                  x1={configuredEdge.x - 5}
                  y1={configuredEdge.y}
                  x2={configuredEdge.x + 5}
                  y2={configuredEdge.y}
                  stroke="var(--brand-blue)"
                  strokeWidth="1"
                />
                <text
                  x={C.x + 8}
                  y={C.y - (CONFIGURED_M * SCALE) / 2}
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  letterSpacing="0.05em"
                >
                  R {CONFIGURED_M} m
                </text>
              </g>

              {/* ring labels along the up axis (right of the dimension line) */}
              <g
                className="certplot-labels"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.06em"
                textAnchor="start"
              >
                {RINGS_M.map((m) => {
                  const p = pt(m * SCALE, 68); // up-and-right of vertical, off the dim line
                  return (
                    <text key={m} x={p.x + 4} y={p.y}>
                      {m} m
                    </text>
                  );
                })}
              </g>

              {/* AMR footprint at the origin — a robot chassis, drawn to scale
                  (~0.7 m wide), with the sensor mark at the field centre */}
              <g className="certplot-amr">
                <rect
                  x={C.x - 0.35 * SCALE}
                  y={C.y - 0.2 * SCALE}
                  width={0.7 * SCALE}
                  height={0.55 * SCALE}
                  fill="var(--bg-muted)"
                  stroke="var(--text-strong)"
                  strokeWidth="1"
                />
                <rect
                  x={C.x - 3}
                  y={C.y - 3}
                  width="6"
                  height="6"
                  fill="var(--text-strong)"
                />
              </g>

              {/* aperture annotations: the two field edges + the rear blind label */}
              <g
                className="certplot-labels"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.06em"
              >
                <text x={endEdge.x - 4} y={endEdge.y + 14} textAnchor="end">
                  0°
                </text>
                <text x={startEdge.x + 4} y={startEdge.y + 14} textAnchor="start">
                  {angleSpec}
                </text>
                <text x={C.x} y={C.y + 0.55 * SCALE + 22} textAnchor="middle" fill="var(--text-muted)">
                  90° blind
                </text>
              </g>
            </svg>

            <figcaption className="dim-line mt-6 font-mono text-anno-sm uppercase text-text-muted">
              Fig · {product.model} protective field · plan view · to scale
            </figcaption>
          </figure>
        </div>
      </Container>

      {/* Component-scoped draw-in. All hidden / animated states live under
          .js + reduced-motion: no-preference; the static SVG above is the final,
          fully-readable state for SSR / no-JS / reduced-motion / crawlers.
          Re-triggers every time the figure re-enters the viewport. */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .js [data-certplot] .certplot-field {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            fill-opacity: 0;
            transition:
              stroke-dashoffset 1.5s var(--ease-rule),
              fill-opacity 0.6s var(--ease-soft) 1.2s;
          }
          .js [data-certplot].is-visible .certplot-field {
            stroke-dashoffset: 0;
            fill-opacity: 0.1;
          }
          .js [data-certplot] .certplot-rings,
          .js [data-certplot] .certplot-amr {
            opacity: 0;
            transition: opacity 0.7s var(--ease-soft);
          }
          .js [data-certplot] .certplot-dim,
          .js [data-certplot] .certplot-labels {
            opacity: 0;
            transition: opacity 0.6s var(--ease-soft) 1.3s;
          }
          .js [data-certplot].is-visible .certplot-rings,
          .js [data-certplot].is-visible .certplot-amr,
          .js [data-certplot].is-visible .certplot-dim,
          .js [data-certplot].is-visible .certplot-labels {
            opacity: 1;
          }
        }
      `}</style>
    </Section>
  );
}
