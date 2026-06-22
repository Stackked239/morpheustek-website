// Application sensor-placement diagrams (drafts, noindex) — the "imagery concept"
// from Tom's flyer, rebuilt in the site's engineering-drawing language using the
// REAL product photos at each mount point (not AI-faked sensors). Render at
// /application-diagrams, screenshot a node for export, or graft onto an app page.

const W = 1000;
const H = 720;
const px = (v: number, total: number) => `${(v / total) * 100}%`;

type Node = {
  id: string;
  x: number;
  y: number;
  img: string;
  alt: string;
  label: string;
  sub: string;
  /** label text anchor (diagram coords) + which side the text sits */
  lx: number;
  ly: number;
  align: "left" | "right" | "center";
  controller?: boolean;
};

// AGV / AMR — two 270° GS1-5 safety scanners at diagonal corners (full 360°
// coverage) wired to the central edge controller. Mirrors the flyer's AGV layout.
const NODES: Node[] = [
  {
    id: "lidar-fl",
    x: 320,
    y: 250,
    img: "/products/gs1-5-safety-lidar.png",
    alt: "OLEI GS1-5 safety LiDAR",
    label: "Safety LiDAR",
    sub: "GS1-5 · 270° field",
    lx: 220,
    ly: 205,
    align: "left",
  },
  {
    id: "lidar-rr",
    x: 680,
    y: 470,
    img: "/products/gs1-5-safety-lidar.png",
    alt: "OLEI GS1-5 safety LiDAR",
    label: "Safety LiDAR",
    sub: "GS1-5 · 270° field",
    lx: 830,
    ly: 515,
    align: "right",
  },
  {
    id: "ctrl",
    x: 500,
    y: 360,
    img: "/products/sintrones-ibox-602p-edge-ai.png",
    alt: "Sintrones iBOX-602P edge controller",
    label: "Edge controller",
    sub: "iBOX-602P",
    lx: 500,
    ly: 628,
    align: "center",
    controller: true,
    // (label nudged up so it clears the figure caption)
  },
];

const CTRL = NODES.find((n) => n.controller)!;
// orthogonal "wiring trace" from a sensor into the controller
const wire = (n: Node) => `M ${n.x} ${n.y} L ${n.x} ${CTRL.y} L ${CTRL.x} ${CTRL.y}`;

export default function ApplicationDiagramsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-brand-blue">
          Application · sensor placement
        </p>
        <h1 className="mt-2 font-display text-h2 font-extrabold uppercase tracking-tight text-text-strong">
          AGV / AMR safety layout
        </h1>

        {/* ── the diagram scene ───────────────────────────────────────────── */}
        <div className="relative mt-10 aspect-[1000/720] w-full overflow-hidden rounded-xl border border-border bg-bg">
          <div className="draft-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

          {/* vector layer: robot body, wiring, leaders */}
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            {/* AMR chassis (top view) */}
            <rect
              x="240"
              y="170"
              width="520"
              height="380"
              rx="48"
              className="fill-bg-subtle stroke-border-strong"
              strokeWidth="2"
            />
            {/* wheels */}
            {[
              [262, 210],
              [716, 210],
              [262, 488],
              [716, 488],
            ].map(([wx, wy], i) => (
              <rect key={i} x={wx} y={wy} width="22" height="52" rx="8" className="fill-mt-navy-900/70" />
            ))}
            {/* travel direction */}
            <g className="stroke-text-subtle" strokeWidth="2" fill="none">
              <path d="M 500 110 L 500 150" />
              <path d="M 486 124 L 500 110 L 514 124" />
            </g>

            {/* yellow safety wiring traces */}
            {NODES.filter((n) => !n.controller).map((n) => (
              <path
                key={n.id}
                d={wire(n)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* thin leader lines from each node to its label */}
            {NODES.map((n) => (
              <line key={n.id} x1={n.x} y1={n.y} x2={n.lx} y2={n.ly} className="stroke-border-strong" strokeWidth="1.25" />
            ))}
          </svg>

          {/* travel label */}
          <div
            className="absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle"
            style={{ left: "50%", top: px(80, H) }}
          >
            Travel
          </div>

          {/* product plates (the real units) */}
          {NODES.map((n) => (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: px(n.x, W), top: px(n.y, H) }}
            >
              <div
                className={`grid place-items-center rounded-lg border bg-bg shadow-[var(--shadow-sm)] ${
                  n.controller ? "size-24 border-border-strong p-2.5" : "size-20 border-border p-2"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.img} alt={n.alt} className="h-full w-full object-contain" />
              </div>
            </div>
          ))}

          {/* callout labels */}
          {NODES.map((n) => (
            <div
              key={n.id}
              className={`absolute max-w-[10rem] -translate-y-1/2 ${
                n.align === "left" ? "-translate-x-full pr-3 text-right" : n.align === "right" ? "pl-3 text-left" : "-translate-x-1/2 pt-2 text-center"
              }`}
              style={{ left: px(n.lx, W), top: px(n.ly, H) }}
            >
              <div className="font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-text-strong">
                {n.label}
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">{n.sub}</div>
            </div>
          ))}

          {/* figure caption */}
          <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle">
            Fig · AGV/AMR sensing layout · top view · illustrative
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm text-text-muted">
          Concept rebuild of the flyer in the site's drawing language — real product photos at each
          mount point, brand-yellow safety wiring to the edge controller. Forklift and other
          applications follow the same node/wire system.
        </p>
      </div>
    </main>
  );
}
