import type { ReactNode } from "react";

// Application sensor-placement diagrams (drafts, noindex) — the "imagery concept"
// from Tom's flyer, rebuilt in the site's engineering-drawing language using the
// REAL product photos at each mount point (not AI-faked sensors). Data-driven:
// each diagram = a chassis drawing + a list of nodes; wiring auto-routes to the
// controller. Render at /application-diagrams; screenshot a scene for export.

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
  lx: number;
  ly: number;
  align: "left" | "right" | "center";
  controller?: boolean;
};

function Diagram({
  eyebrow,
  title,
  caption,
  chassis,
  nodes,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  chassis: ReactNode;
  nodes: Node[];
}) {
  const ctrl = nodes.find((n) => n.controller)!;
  const wire = (n: Node) => `M ${n.x} ${n.y} L ${n.x} ${ctrl.y} L ${ctrl.x} ${ctrl.y}`;

  return (
    <section className="mt-14 first:mt-0">
      <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-brand-blue">{eyebrow}</p>
      <h2 className="mt-2 font-display text-h3 font-extrabold uppercase tracking-tight text-text-strong">{title}</h2>

      <div className="relative mt-6 aspect-[1000/720] w-full overflow-hidden rounded-xl border border-border bg-bg">
        <div className="draft-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {chassis}
          {/* yellow safety wiring traces */}
          {nodes
            .filter((n) => !n.controller)
            .map((n) => (
              <path key={n.id} d={wire(n)} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            ))}
          {/* thin leader lines node → label */}
          {nodes.map((n) => (
            <line key={n.id} x1={n.x} y1={n.y} x2={n.lx} y2={n.ly} className="stroke-border-strong" strokeWidth="1.25" />
          ))}
        </svg>

        {/* product plates (the real units) */}
        {nodes.map((n) => (
          <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: px(n.x, W), top: px(n.y, H) }}>
            <div
              className={`grid place-items-center rounded-lg border bg-bg shadow-[var(--shadow-sm)] ${
                n.controller ? "size-[5.5rem] border-border-strong p-2.5" : "size-[4.5rem] border-border p-2"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt={n.alt} className="h-full w-full object-contain" />
            </div>
          </div>
        ))}

        {/* callout labels */}
        {nodes.map((n) => (
          <div
            key={n.id}
            className={`absolute max-w-[10rem] -translate-y-1/2 ${
              n.align === "left"
                ? "-translate-x-full pr-3 text-right"
                : n.align === "right"
                  ? "pl-3 text-left"
                  : "-translate-x-1/2 pt-2 text-center"
            }`}
            style={{ left: px(n.lx, W), top: px(n.ly, H) }}
          >
            <div className="font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-text-strong">{n.label}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">{n.sub}</div>
          </div>
        ))}

        <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle">
          {caption}
        </div>
      </div>
    </section>
  );
}

// ── AGV / AMR ────────────────────────────────────────────────────────────────
const AMR_NODES: Node[] = [
  { id: "lidar-fl", x: 320, y: 250, img: "/products/gs1-5-safety-lidar.png", alt: "OLEI GS1-5 safety LiDAR", label: "Safety LiDAR", sub: "GS1-5 · 270° field", lx: 220, ly: 205, align: "left" },
  { id: "lidar-rr", x: 680, y: 470, img: "/products/gs1-5-safety-lidar.png", alt: "OLEI GS1-5 safety LiDAR", label: "Safety LiDAR", sub: "GS1-5 · 270° field", lx: 830, ly: 515, align: "right" },
  { id: "ctrl", x: 500, y: 360, img: "/products/sintrones-ibox-602p-edge-ai.png", alt: "Sintrones iBOX-602P edge controller", label: "Edge controller", sub: "iBOX-602P", lx: 500, ly: 628, align: "center", controller: true },
];

const AmrChassis = (
  <>
    <rect x="240" y="170" width="520" height="380" rx="48" className="fill-bg-subtle stroke-border-strong" strokeWidth="2" />
    {[
      [262, 210],
      [716, 210],
      [262, 488],
      [716, 488],
    ].map(([wx, wy], i) => (
      <rect key={i} x={wx} y={wy} width="22" height="52" rx="8" className="fill-mt-navy-900/70" />
    ))}
    <g className="stroke-text-subtle" strokeWidth="2" fill="none">
      <path d="M 500 110 L 500 150" />
      <path d="M 486 124 L 500 110 L 514 124" />
    </g>
  </>
);

// ── Automated forklift ───────────────────────────────────────────────────────
const FORK_NODES: Node[] = [
  { id: "nav", x: 545, y: 185, img: "/products/lr-1f-2d-lidar.png", alt: "OLEI LR-1F navigation LiDAR", label: "Navigation LiDAR", sub: "LR-1F · 360°", lx: 720, ly: 150, align: "right" },
  { id: "angled", x: 505, y: 315, img: "/products/gs1-5-safety-lidar.png", alt: "OLEI GS1-5 safety LiDAR", label: "Angled safety LiDAR", sub: "GS1-5", lx: 720, ly: 300, align: "right" },
  { id: "fwd", x: 590, y: 505, img: "/products/gs1-5-safety-lidar.png", alt: "OLEI GS1-5 safety LiDAR", label: "Forward safety LiDAR", sub: "GS1-5 · 270°", lx: 780, ly: 540, align: "right" },
  { id: "rear", x: 270, y: 505, img: "/products/gs1-5-safety-lidar.png", alt: "OLEI GS1-5 safety LiDAR", label: "Rearward safety LiDAR", sub: "GS1-5 · 270°", lx: 190, ly: 560, align: "left" },
  { id: "ctrl", x: 380, y: 420, img: "/products/sintrones-ibox-602p-edge-ai.png", alt: "Sintrones iBOX-602P edge controller", label: "Safety controller", sub: "iBOX-602P", lx: 200, ly: 290, align: "left", controller: true },
];

const ForkliftChassis = (
  <g className="stroke-border-strong" strokeWidth="2" fill="none">
    {/* counterweight body */}
    <path d="M 200 560 L 200 430 Q 200 410 220 410 L 470 410 L 470 560 Z" className="fill-bg-subtle" />
    {/* overhead guard */}
    <path d="M 250 410 L 250 250 L 480 250 L 480 410" />
    <line x1="250" y1="250" x2="480" y2="250" />
    {/* mast (front, two rails) */}
    <line x1="500" y1="190" x2="500" y2="560" strokeWidth="6" />
    <line x1="520" y1="190" x2="520" y2="560" strokeWidth="6" />
    {/* carriage + forks */}
    <line x1="520" y1="520" x2="690" y2="520" strokeWidth="5" />
    <line x1="520" y1="552" x2="690" y2="552" strokeWidth="5" />
    {/* pallet/load on the forks */}
    <rect x="545" y="430" width="120" height="92" rx="4" className="fill-bg-muted/60" strokeWidth="1.5" />
    {/* wheels */}
    <circle cx="300" cy="560" r="36" className="fill-mt-navy-900/70" strokeWidth="0" />
    <circle cx="460" cy="565" r="30" className="fill-mt-navy-900/70" strokeWidth="0" />
  </g>
);

export default function ApplicationDiagramsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-anno-sm uppercase tracking-[0.2em] text-text-subtle">MorpheusTEK · application sensor placement</p>
        <h1 className="mt-2 font-display text-h2 font-extrabold uppercase tracking-tight text-text-strong">Where the sensors go.</h1>
        <p className="mt-3 max-w-2xl text-sm text-text-muted">
          The flyer concept, rebuilt in the site&apos;s drawing language — real product photos at each mount point,
          brand-yellow safety wiring to the edge controller. Same node/wire system extends to any application.
        </p>

        <Diagram
          eyebrow="Application · AGV / AMR"
          title="AGV / AMR safety layout"
          caption="Fig · AGV/AMR sensing layout · top view · illustrative"
          chassis={AmrChassis}
          nodes={AMR_NODES}
        />

        <Diagram
          eyebrow="Application · automated forklift"
          title="Automated forklift safety layout"
          caption="Fig · automated forklift sensing layout · side view · illustrative"
          chassis={ForkliftChassis}
          nodes={FORK_NODES}
        />
      </div>
    </main>
  );
}
