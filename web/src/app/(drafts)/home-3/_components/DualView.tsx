"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Scene 01:17 — the set piece. One photograph, two ways of seeing it: drag the
 * divider between the human view and an illustrative machine view (depth-ramp
 * wash + point grid + detection frames). Driven by a single full-surface range
 * input, so it is keyboard-accessible for free; without JS it renders as a
 * fixed 50/50 split with both labels visible.
 */

// Detection frames drawn on the machine side. Positions are eyeballed to the
// photograph; ranges are illustrative (and labeled as such in the caption).
const detections = [
  { label: "PALLET LOAD · 3.4 m", color: "var(--color-pc-2)", left: "8%", top: "30%", width: "33%", height: "52%" },
  { label: "PERSON · 7.1 m", color: "var(--color-pc-near)", left: "55.5%", top: "40%", width: "9%", height: "38%" },
  { label: "RACKING · 12 m+", color: "var(--color-pc-4)", left: "72%", top: "12%", width: "26%", height: "70%" },
] as const;

export function DualView() {
  const [pos, setPos] = useState(50);

  return (
    <section className="py-16 md:py-24">
      <Container wide>
        <Reveal>
          <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-text-subtle">
            01:17 · same aisle · two ways of seeing
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-bold text-text-strong">
            You see a forklift. Your robot sees geometry.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-text-muted">
            Drag the line. dToF depth cameras return a valid distance on every pixel — including the
            black, reflective, and textureless surfaces where stereo cameras leave holes.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <figure className="group relative aspect-[16/9] select-none overflow-hidden rounded-lg border border-border">
            {/* human view (base layer) */}
            <Image
              src="/home-drafts/aisle-day.jpg"
              alt="A bright warehouse aisle: an autonomous forklift carries a pallet while a worker walks behind it"
              fill
              sizes="(min-width: 1440px) 1376px, 100vw"
              className="object-cover"
            />

            {/* machine view (top layer, clipped at the divider) */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            >
              <Image
                src="/home-drafts/aisle-day.jpg"
                alt=""
                fill
                sizes="(min-width: 1440px) 1376px, 100vw"
                className="object-cover [filter:grayscale(1)_contrast(1.6)_brightness(0.5)]"
              />
              {/* depth-ramp wash: near (bottom) → far (top), point-cloud palette */}
              <div className="absolute inset-0 mix-blend-color [background:linear-gradient(to_top,var(--color-pc-near)_0%,var(--color-pc-2)_30%,var(--color-pc-3)_52%,var(--color-pc-4)_72%,var(--color-pc-far)_100%)]" />
              {/* point grid */}
              <div className="absolute inset-0 opacity-50 mix-blend-screen [background-image:radial-gradient(circle,rgba(49,180,231,0.9)_0.7px,transparent_0.7px)] [background-size:14px_14px]" />
              {/* detection frames */}
              {detections.map((d) => (
                <div
                  key={d.label}
                  className="absolute border"
                  style={{ left: d.left, top: d.top, width: d.width, height: d.height, borderColor: d.color }}
                >
                  <span
                    className="absolute -top-6 left-0 whitespace-nowrap font-mono text-[11px] tracking-[0.12em]"
                    style={{ color: d.color }}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </div>

            {/* divider + handle */}
            <div
              aria-hidden
              className="absolute inset-y-0 w-px bg-border-strong shadow-[0_0_12px_rgba(79,181,236,0.8)]"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-bg font-mono text-xs text-text">
                ⇄
              </span>
            </div>

            {/* corner labels */}
            <span className="absolute bottom-3 left-4 font-mono text-anno-sm uppercase tracking-[0.18em] text-white/90">
              Human view
            </span>
            <span className="absolute bottom-3 right-4 font-mono text-anno-sm uppercase tracking-[0.18em] text-brand-blue">
              Machine view
            </span>

            {/* the control: one full-surface slider (keyboard + pointer + touch) */}
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Reveal the machine view"
              className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
            />
          </figure>
          <figcaption className="mt-3 flex flex-wrap justify-between gap-2 font-mono text-anno-sm text-text-subtle">
            <span>FIG · machine view is illustrative — ranges shown are not measurements</span>
            <span>Source: MRDVS dToF RGBD · 0.3–8 m · valid depth on every pixel</span>
          </figcaption>
        </Reveal>
      </Container>
    </section>
  );
}
