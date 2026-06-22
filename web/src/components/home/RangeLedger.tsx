"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProduct } from "@/lib/catalog";

/**
 * SENSING ENVELOPE — the range data as a robot would experience it.
 *
 * The chart was too abstract; the useful homepage idea is coverage. Each product
 * is represented by the shape it adds around a robot: safety arc, depth cone,
 * 360° ring, long-range beam, or full 3D scan envelope.
 */

const tick = (v: number) => (v < 1 ? `${Math.round(v * 100)} cm` : `${v} m`);

type SensorId = "safety" | "close" | "avoid" | "navigate" | "survey" | "measure" | "map";

type Envelope = {
  id: SensorId;
  slug: string;
  job: string;
  band: string;
  from: number;
  to: number;
  proof: string;
  copy: string;
};

const ENVELOPES: readonly Envelope[] = [
  {
    id: "safety",
    slug: "gs1-5-safety-lidar",
    job: "Protect",
    band: "Safety field",
    from: 0.1,
    to: 5,
    proof: "270° · Type 3 / SIL2 / PL d",
    copy: "The certified stop zone around people and machines.",
  },
  {
    id: "close",
    slug: "mrdvs-s10-rgbd-camera",
    job: "See close",
    band: "Depth cone",
    from: 0.3,
    to: 8,
    proof: "dToF RGBD · 120° × 80°",
    copy: "Pallet pockets, bins, low obstacles, and near-field detail.",
  },
  {
    id: "avoid",
    slug: "lr-f240-solid-state-lidar",
    job: "Avoid",
    band: "Forward fan",
    from: 0.1,
    to: 12,
    proof: "Solid-state · 72° × 58°",
    copy: "A forward obstacle envelope with no spinning parts.",
  },
  {
    id: "navigate",
    slug: "lr-1f-2d-lidar",
    job: "Navigate",
    band: "360° ring",
    from: 0.1,
    to: 50,
    proof: "360° 2D · 10–25 Hz",
    copy: "Full-circle scanning for AMR/AGV navigation.",
  },
  {
    id: "survey",
    slug: "vss-50-solid-state-3d-lidar",
    job: "Survey",
    band: "Wide 3D fan",
    from: 0.5,
    to: 50,
    proof: "120° × 50° · 540k pts/s",
    copy: "Dense forward 3D perception for outdoor autonomy.",
  },
  {
    id: "measure",
    slug: "a090-laser-rangefinder",
    job: "Measure",
    band: "Single beam",
    from: 0.1,
    to: 90,
    proof: "0.1 mm resolution",
    copy: "A precise line to a rack, hoist, wall, or moving target.",
  },
  {
    id: "map",
    slug: "lr-16f-100-3d-lidar",
    job: "Map",
    band: "Long 3D scan",
    from: 0.5,
    to: 100,
    proof: "16-line · 360° × 30°",
    copy: "The outer geometry envelope for yard-scale perception.",
  },
] as const;

export function RangeLedger() {
  const [activeId, setActiveId] = useState<SensorId | "all">("all");
  const envelopes = ENVELOPES.map((e) => {
    const product = getProduct(e.slug);
    if (!product) throw new Error(`RangeLedger: no catalog product for slug "${e.slug}"`);
    return { ...e, model: product.model, name: product.name };
  });
  const active = activeId === "all" ? null : envelopes.find((e) => e.id === activeId);
  const panel = active ?? {
    job: "Envelope stack",
    model: "Seven sensors",
    band: "Full coverage",
    from: 0.1,
    to: 100,
    proof: "Arcs · cones · rings · beams",
    copy: "All envelopes are visible together. Hover a sensing job to isolate the shape that product adds around the robot.",
  };
  const layerOpacity = (id: SensorId) => {
    if (activeId === "all") return 0.52;
    return activeId === id ? 1 : 0.12;
  };
  const rowActive = (id: SensorId) => activeId === "all" || activeId === id;

  return (
    <Section tone="subtle" className="relative border-t border-border !py-10 md:!py-12 lg:!py-8 !bg-bg-muted">
      {/* seam blend — soft tonal lift at the bottom so this muted band reads as distinct from
          the AssemblyStack band below (both !bg-bg-muted after the reorder). Lift toward --bg
          for contrast; pairs with AssemblyStack's matching top lift. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--bg),transparent)]" aria-hidden />
      <Container className="relative">
        <div className="max-w-3xl">
          <Eyebrow>The line, end to end</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2rem,3.25vw,3.25rem)] font-extrabold uppercase leading-[1.02] tracking-tight text-text-strong">
            Every robot needs a sensing envelope.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            From 30 cm pallet pockets to 100 m yard scans, the line is easier to read as
            coverage: arcs, cones, rings, and beams around the machine.
          </p>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(20rem,0.72fr)_minmax(38rem,1.28fr)] lg:items-stretch">
          <div className="order-2 flex flex-col lg:order-1">
            <div className="mb-2 flex items-center justify-between gap-4 border-b border-border pb-2">
              <p className="font-mono text-anno-sm font-bold uppercase tracking-[0.16em] text-text-strong">
                Sensing jobs
              </p>
              <button
                type="button"
                onClick={() => setActiveId("all")}
                className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-blue underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50"
              >
                Show all
              </button>
            </div>

            <ul className="grid gap-1.5">
              {envelopes.map((e, index) => (
                <li key={e.id}>
                  <Link
                    href={`/products/${e.slug}`}
                    onMouseEnter={() => setActiveId(e.id)}
                    onFocus={() => setActiveId(e.id)}
                    onMouseLeave={() => setActiveId("all")}
                    onBlur={() => setActiveId("all")}
                    className={`group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 ${
                      rowActive(e.id)
                        ? "border-border-strong bg-surface"
                        : "border-border bg-surface/55"
                    }`}
                    aria-label={`${e.name} — ${e.job}, ${tick(e.from)} to ${tick(e.to)}`}
                  >
                    <span
                      aria-hidden
                      className="grid size-7 place-items-center rounded-full border border-border bg-bg font-mono text-[9px] font-bold text-brand-blue"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-blue">
                        {e.job}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-base font-extrabold uppercase leading-none tracking-tight text-text-strong">
                        {e.model}
                        <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                          {e.band}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right font-mono text-[10px] font-bold tabular-nums text-text-strong">
                      {tick(e.from)} → {tick(e.to)}
                      <ArrowUpRight
                        aria-hidden
                        className="ml-1 inline size-3 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <figure className="order-1 flex overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_80px_rgba(15,50,108,0.10)] lg:order-2 lg:h-[calc(100svh-18rem)] lg:max-h-[32rem]">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 md:px-5">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue">
                    Coverage map
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {active
                      ? `${active.model}: ${active.band.toLowerCase()} · ${tick(active.from)} to ${tick(active.to)}`
                      : "All envelopes visible · hover a row to isolate one sensor"}
                  </p>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-text-subtle sm:block">
                  Top view
                </span>
              </div>

              <div className="relative min-h-0 flex-1 bg-bg">
              <svg
                viewBox="0 0 560 420"
                role="img"
                aria-label="Top-down robot sensing map showing safety arcs, depth cones, 360 degree rings, a long measurement beam, and a long-range 3D scan envelope."
                className="h-full w-full text-line-ink"
              >
                <defs>
                  <pattern id="range-map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 H 0 V 24" fill="none" stroke="var(--border)" strokeOpacity="0.35" strokeWidth="0.7" />
                  </pattern>
                  <radialGradient id="range-map-wash" cx="50%" cy="52%" r="62%">
                    <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="560" height="420" fill="var(--bg)" />
                <rect width="560" height="420" fill="url(#range-map-grid)" />
                <rect width="560" height="420" fill="url(#range-map-wash)" />

                {/* warehouse context */}
                <g opacity="0.58">
                  <rect x="40" y="78" width="86" height="234" rx="8" fill="var(--bg-muted)" stroke="var(--border)" />
                  <rect x="434" y="78" width="86" height="234" rx="8" fill="var(--bg-muted)" stroke="var(--border)" />
                  {[112, 160, 208, 256].map((y) => (
                    <g key={y}>
                      <line x1="52" y1={y} x2="114" y2={y} stroke="var(--line-ink)" strokeOpacity="0.28" />
                      <line x1="446" y1={y} x2="508" y2={y} stroke="var(--line-ink)" strokeOpacity="0.28" />
                    </g>
                  ))}
                  <path d="M 280 390 V 34" stroke="var(--line-ink)" strokeDasharray="3 12" strokeOpacity="0.22" />
                  <text x="66" y="334" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.14em" fill="var(--text-subtle)">
                    RACK
                  </text>
                  <text x="450" y="334" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.14em" fill="var(--text-subtle)">
                    DOCK
                  </text>
                </g>

                {/* long-range 3D scan */}
                <g style={{ opacity: layerOpacity("map") }} className="transition-opacity duration-500">
                  <circle cx="280" cy="232" r="172" fill="none" stroke="var(--brand-blue)" strokeWidth="1.6" strokeDasharray="2 8" />
                  <circle cx="280" cy="232" r="172" fill="var(--brand-blue)" fillOpacity="0.035" />
                  <text x="280" y="48" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    LR-16F-100 · 100 M 3D SCAN
                  </text>
                </g>

                {/* precise rangefinder beam */}
                <g style={{ opacity: layerOpacity("measure") }} className="transition-opacity duration-500">
                  <path d="M 302 232 L 498 110" fill="none" stroke="var(--brand-blue)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="498" cy="110" r="7" fill="var(--bg)" stroke="var(--brand-blue)" strokeWidth="2" />
                  <text x="412" y="122" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    A090 BEAM
                  </text>
                </g>

                {/* aisle-scale 360 navigation */}
                <g style={{ opacity: layerOpacity("navigate") }} className="transition-opacity duration-500">
                  <circle cx="280" cy="232" r="118" fill="none" stroke="var(--brand-blue)" strokeWidth="2.2" />
                  <circle cx="280" cy="232" r="118" fill="var(--brand-blue)" fillOpacity="0.05" />
                  <text x="156" y="226" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    LR-1F · 360°
                  </text>
                </g>

                {/* wide outdoor 3D fan */}
                <g style={{ opacity: layerOpacity("survey") }} className="transition-opacity duration-500">
                  <path d="M 280 222 L 156 66 Q 280 26 404 66 Z" fill="var(--brand-blue)" fillOpacity="0.08" stroke="var(--brand-blue)" strokeWidth="1.6" />
                  <text x="398" y="78" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    VSS-50
                  </text>
                </g>

                {/* forward obstacle cone */}
                <g style={{ opacity: layerOpacity("avoid") }} className="transition-opacity duration-500">
                  <path d="M 280 222 L 210 126 Q 280 104 350 126 Z" fill="var(--brand-blue)" fillOpacity="0.14" stroke="var(--brand-blue)" strokeWidth="1.5" />
                  <text x="280" y="118" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    LR-F240
                  </text>
                </g>

                {/* close RGBD cone */}
                <g style={{ opacity: layerOpacity("close") }} className="transition-opacity duration-500">
                  <path d="M 280 222 L 236 154 Q 280 140 324 154 Z" fill="var(--brand-blue)" fillOpacity="0.22" stroke="var(--brand-blue)" strokeWidth="1.4" />
                  <text x="280" y="160" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    S10 DEPTH
                  </text>
                </g>

                {/* certified safety field */}
                <g style={{ opacity: layerOpacity("safety") }} className="transition-opacity duration-500">
                  <path d="M 280 232 L 346 166 A 94 94 0 1 1 214 166 Z" fill="var(--brand-blue)" fillOpacity="0.13" stroke="var(--brand-blue)" strokeWidth="1.8" />
                  <path d="M 214 166 L 280 232 L 346 166" fill="none" stroke="var(--brand-blue)" strokeWidth="1" strokeDasharray="4 5" />
                  <text x="280" y="326" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" letterSpacing="0.1em" fill="var(--brand-blue)">
                    GS1-5 SAFETY FIELD
                  </text>
                </g>

                {/* robot */}
                <g>
                  <rect x="248" y="202" width="64" height="62" rx="15" fill="var(--bg)" stroke="var(--text-strong)" strokeWidth="1.6" />
                  <rect x="260" y="216" width="40" height="22" rx="6" fill="var(--brand-blue)" fillOpacity="0.12" stroke="var(--brand-blue)" />
                  <circle cx="260" cy="270" r="5" fill="var(--text-strong)" />
                  <circle cx="300" cy="270" r="5" fill="var(--text-strong)" />
                  <path d="M 280 196 L 290 212 H 270 Z" fill="var(--text-strong)" />
                  <text x="280" y="252" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" letterSpacing="0.12em" fill="var(--text-strong)">
                    ROBOT
                  </text>
                </g>
              </svg>
              </div>

              <div className="grid gap-3 border-t border-border bg-bg-muted p-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.82fr)] md:p-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-blue">
                  {panel.job}
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-text-strong">
                  {panel.model}
                </h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-muted md:text-sm">{panel.copy}</p>
              </div>
              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border font-mono text-[9px] uppercase tracking-[0.09em] text-text-subtle">
                <div className="bg-surface px-2.5 py-2">
                  <dt className="font-bold text-text-muted">Shape</dt>
                  <dd className="mt-1 text-text-strong">{panel.band}</dd>
                </div>
                <div className="bg-surface px-2.5 py-2">
                  <dt className="font-bold text-text-muted">Range</dt>
                  <dd className="mt-1 text-text-strong">
                    {tick(panel.from)} → {tick(panel.to)}
                  </dd>
                </div>
                <div className="bg-surface px-2.5 py-2">
                  <dt className="font-bold text-text-muted">Proof</dt>
                  <dd className="mt-1 text-text-strong">{panel.proof}</dd>
                </div>
              </dl>
              </div>
            </div>
          </figure>
        </div>

        <p className="mt-8 text-anno text-text-muted">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-mono font-bold text-brand-blue underline-offset-4 hover:underline"
          >
            See the full line
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </p>
      </Container>
    </Section>
  );
}
