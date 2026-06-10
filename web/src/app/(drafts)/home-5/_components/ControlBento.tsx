"use client";

import Link from "next/link";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/catalog";

/**
 * The perception stack as a control surface: a six-cell bento grid. One
 * pointermove handler on the grid feeds --spot-x/--spot-y to whichever cell
 * the cursor is over (the .spot-cell radial highlight); the featured safety
 * cell carries the orbiting .border-beam. All content is server-derivable
 * facts — JS here is presentation only.
 */
export function ControlBento() {
  const gridRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    const grid = gridRef.current;
    if (!grid) return;
    for (const cell of grid.querySelectorAll<HTMLElement>(".spot-cell")) {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      cell.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    }
  };

  const gs15 = getProduct("gs1-5-safety-lidar");
  const lr16 = getProduct("lr-16f-100-3d-lidar");
  const s10 = getProduct("mrdvs-s10-rgbd-camera");
  const ibox = getProduct("sintrones-ibox-602p-edge-ai");

  const cellCls =
    "spot-cell glass group relative flex flex-col rounded-xl p-6 transition-colors hover:border-border-strong";
  const kicker = "font-mono text-anno-sm uppercase tracking-[0.16em] text-brand-blue";
  const big = "mt-3 font-display text-h3 font-bold text-text-strong";
  const body = "mt-2 text-sm leading-relaxed text-text-muted";

  return (
    <section className="py-16 md:py-24">
      <Container wide>
        <Reveal>
          <h2 className="max-w-2xl font-display text-h2 font-bold text-text-strong">
            Every layer of sight, on one surface.
          </h2>
        </Reveal>

        <div
          ref={gridRef}
          onPointerMove={onPointerMove}
          className="mt-10 grid gap-4 md:grid-cols-4 lg:grid-rows-[repeat(2,minmax(15rem,auto))]"
        >
          {/* featured — safety, with the border beam */}
          {gs15 && (
            <Link href={`/products/${gs15.slug}`} className={`${cellCls} md:col-span-2 md:row-span-2`}>
              <span aria-hidden className="border-beam" />
              <span className={kicker}>Protect · {gs15.model}</span>
              <span className="mt-4 font-display text-figure font-bold leading-none text-text-strong">
                Type&nbsp;3 · SIL2 · PL&nbsp;d
              </span>
              <p className={`${body} max-w-sm`}>
                The same safety class as SICK&apos;s scanners — 270° coverage, 5 m protective field —
                at roughly half to a third of the price.
              </p>
              {/* protective-field fan: 270° of coverage, the 90° blind wedge
                  points down/behind the scanner (true GS1-5 aperture) */}
              <svg viewBox="0 0 200 190" aria-hidden className="mt-auto w-full max-w-[17rem] self-center">
                <path
                  d="M 100 110 L 163.6 173.6 A 90 90 0 1 0 36.4 173.6 Z"
                  fill="currentColor"
                  className="text-brand-blue/15"
                  stroke="var(--brand-blue)"
                  strokeWidth="1.5"
                />
                <circle cx="100" cy="110" r="5" fill="var(--accent)" />
                <text x="100" y="38" textAnchor="middle" fill="var(--text-subtle)" fontSize="9" fontFamily="var(--font-mono)">
                  270° · 5 m PROTECTIVE
                </text>
              </svg>
              <ul className="mt-4 space-y-1 border-t border-border pt-3">
                {gs15.certifications?.slice(0, 3).map((c) => (
                  <li key={c} className="font-mono text-anno-sm text-text-subtle">✓ {c}</li>
                ))}
              </ul>
            </Link>
          )}

          {/* 3D LiDAR */}
          {lr16 && (
            <Link href={`/products/${lr16.slug}`} className={`${cellCls} md:col-span-2`}>
              <span className={kicker}>Map · {lr16.model}</span>
              <span className={big}>360° × 30° · 100 m · 16 lines</span>
              <p className={body}>{lr16.tagline}</p>
            </Link>
          )}

          {/* 3D cameras */}
          {s10 && (
            <Link href={`/products/${s10.slug}`} className={cellCls}>
              <span className={kicker}>See · {s10.model}</span>
              <span className={big}>Depth on every pixel</span>
              <p className={body}>Black, reflective, textureless — dToF fills the holes stereo leaves.</p>
              <span aria-hidden className="mt-auto h-1.5 w-full rounded-full bg-gradient-to-r from-pc-near via-pc-2 to-pc-5 opacity-80" />
            </Link>
          )}

          {/* edge compute */}
          {ibox && (
            <Link href={`/products/${ibox.slug}`} className={cellCls}>
              <span className={kicker}>Think · {ibox.model}</span>
              <span className={big}>Jetson Orin NX, IP66</span>
              <p className={body}>Fanless edge AI that runs the whole stack on the robot.</p>
            </Link>
          )}

          {/* trial */}
          <Link href="/book-a-meeting?intent=trial" className={`${cellCls} md:col-span-2`}>
            <span className={kicker}>Prove</span>
            <span className={big}>90 days, free, in your environment</span>
            <p className={body}>
              No commitment. The sensor earns its place on your robot, or it goes back.
            </p>
          </Link>

          {/* support */}
          <Link href="/about" className={`${cellCls} md:col-span-2`}>
            <span className={kicker}>Support</span>
            <span className={big}>North American, human, on the phone</span>
            <p className={body}>Engineering help from Silverton, OR — not a distributor portal.</p>
          </Link>
        </div>
      </Container>
    </section>
  );
}
