// Application sensor-placement diagrams (drafts, noindex) — the "imagery concept"
// from Tom's flyer, rebuilt photoreal: fal generates a sharp studio render of the
// robot, nano-banana composites the REAL product units onto it (not AI-faked
// sensors), then we overlay callout labels + leader lines here. Renders live in
// /public/mockups (regenerate via the fal pipeline, then re-tune marker coords).

const W = 1024;
const H = 1024;
const pc = (v: number, t: number) => `${(v / t) * 100}%`;

type Marker = {
  label: string;
  sub: string;
  mx: number; // sensor point, in 1184×864 image space
  my: number;
  lx: number; // label anchor
  ly: number;
  align: "left" | "right" | "center";
};

function PhotoDiagram({
  eyebrow,
  title,
  caption,
  img,
  alt,
  markers,
}: {
  eyebrow: string;
  title: string;
  caption: string;
  img: string;
  alt: string;
  markers: Marker[];
}) {
  return (
    <section className="mt-14 first:mt-0">
      <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-brand-blue">{eyebrow}</p>
      <h2 className="mt-2 font-display text-h3 font-extrabold uppercase tracking-tight text-text-strong">{title}</h2>

      <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-xl border border-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} className="absolute inset-0 h-full w-full object-cover" />

        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {markers.map((m, i) => (
            <g key={i}>
              <line x1={m.mx} y1={m.my} x2={m.lx} y2={m.ly} className="stroke-mt-navy-900/60" strokeWidth="2" />
              <circle cx={m.mx} cy={m.my} r="8" className="fill-accent stroke-mt-navy-900" strokeWidth="2.5" />
            </g>
          ))}
        </svg>

        {markers.map((m, i) => (
          <div
            key={i}
            className={`absolute -translate-y-1/2 ${
              m.align === "left"
                ? "-translate-x-full pr-2 text-right"
                : m.align === "right"
                  ? "pl-2 text-left"
                  : "-translate-x-1/2 text-center"
            }`}
            style={{ left: pc(m.lx, W), top: pc(m.ly, H) }}
          >
            <div className="font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-mt-navy-900">{m.label}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">{m.sub}</div>
          </div>
        ))}

        <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle">
          {caption}
        </div>
      </div>
    </section>
  );
}

const AMR_MARKERS: Marker[] = [
  { label: "Safety LiDAR", sub: "GS1-5 · 270°", mx: 121, my: 585, lx: 170, ly: 400, align: "right" },
  { label: "Safety LiDAR", sub: "GS1-5 · 270°", mx: 930, my: 558, lx: 890, ly: 398, align: "right" },
  { label: "Edge controller", sub: "iBOX-602P · internal", mx: 700, my: 372, lx: 700, ly: 985, align: "center" },
];

const FORK_MARKERS: Marker[] = [
  { label: "Navigation LiDAR", sub: "LR-1F · 360°", mx: 439, my: 72, lx: 820, ly: 92, align: "left" },
  { label: "Safety LiDAR", sub: "GS1-5 · integrated", mx: 280, my: 820, lx: 130, ly: 885, align: "right" },
];

export default function ApplicationDiagramsPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-anno-sm uppercase tracking-[0.2em] text-text-subtle">MorpheusTEK · application sensor placement</p>
        <h1 className="mt-2 font-display text-h2 font-extrabold uppercase tracking-tight text-text-strong">Where the sensors go.</h1>
        <p className="mt-3 max-w-2xl text-sm text-text-muted">
          The flyer concept, rebuilt photoreal — the <em>actual</em> MorpheusTEK units (GS1-5 safety LiDAR, LR-1F
          navigation LiDAR, iBOX-602P controller) mounted on the robot, with each position called out.
        </p>

        <PhotoDiagram
          eyebrow="Application · AGV / AMR"
          title="AGV / AMR safety layout"
          caption="Fig · AGV/AMR sensing layout · illustrative"
          img="/mockups/amr-integrated.png"
          alt="AGV/AMR mobile robot with two GS1-5 safety LiDAR scanners recessed into the lower corners of the chassis"
          markers={AMR_MARKERS}
        />

        <PhotoDiagram
          eyebrow="Application · automated forklift"
          title="Automated forklift safety layout"
          caption="Fig · automated forklift sensing layout · illustrative"
          img="/mockups/forklift-integrated.png"
          alt="Automated forklift with an LR-1F navigation LiDAR on top and a GS1-5 safety LiDAR built into the lower chassis"
          markers={FORK_MARKERS}
        />
      </div>
    </main>
  );
}
