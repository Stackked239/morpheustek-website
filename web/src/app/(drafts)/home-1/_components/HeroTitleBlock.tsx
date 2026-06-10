import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { site, primaryCta } from "@/lib/site";
import { getProduct, formatPrice } from "@/lib/catalog";

/* §00 — Hero "The Title Block"
   The page opens as Sheet 1 of an engineering drawing: a 1px frame inset from
   the viewport, a document-control row, the headline + the GS1-5 staged as an
   annotated figure, and a title-block strip closing the sheet.
   Every annotation states a catalog.ts fact (instrumentation test). */

const DOC_META = "DOC MT-HP-01 · REV A · 2026-06";

/* Leader-line callouts on the GS1-5 figure (md+ only; stacked list on mobile).
   Coordinates are % of the square plate. Each fact traces to catalog.ts. */
const callouts = [
  {
    label: "270° scanning aperture",
    // the scan dome, top center
    line: "54,28 30,10 7,10",
    anchor: { cx: 54, cy: 28 },
    labelPos: "left-[2%] top-[5%] text-left",
  },
  {
    label: "Type 3 · SIL2 · PL d",
    // certified housing, right side
    line: "76,62 86,52 97,52",
    anchor: { cx: 76, cy: 62 },
    labelPos: "right-[2%] top-[46%] text-right",
  },
  {
    label: "IP65 · 5 m protective",
    // lower body, left
    line: "30,70 14,80 3,80",
    anchor: { cx: 30, cy: 70 },
    labelPos: "left-[2%] top-[82%] text-left",
  },
] as const;

export function HeroTitleBlock() {
  const gs15 = getProduct("gs1-5-safety-lidar")!;

  return (
    <section className="px-4 pb-4 pt-6 md:px-6 md:pt-8">
      <div className="relative mx-auto flex min-h-[88svh] max-w-[100rem] flex-col border-y border-border md:border-x">
        {/* document-control row */}
        <div className="relative flex items-baseline justify-between gap-4 border-b border-border px-5 py-3 font-mono text-anno-sm uppercase text-text-muted md:px-10">
          <span aria-hidden className="reg-mark -bottom-[5px] -left-[5px] hidden md:block" />
          <span aria-hidden className="reg-mark -bottom-[5px] -right-[5px] hidden md:block" />
          <span className="text-text">Morpheustek · Giving sight to robotics</span>
          <span className="hidden sm:block">{DOC_META}</span>
        </div>

        {/* sheet body — 3:2 headline : annotated figure */}
        <div className="grid flex-1 items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[3fr_2fr] lg:gap-8">
          <div>
            <p className="eyebrow">{site.distributor}</p>
            <h1 className="mt-6 max-w-[13ch] font-display-industrial text-display-xl font-bold uppercase text-text-strong">
              Sight you can certify.
            </h1>
            <p className="mt-7 max-w-xl text-lead text-text-muted">
              Give your robot LiDAR, 3D cameras, safety sensing, and edge
              compute — certified, priced, and in stock, from one North
              American partner.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={primaryCta.trial.href} variant="primary" size="lg" className="rounded-sm">
                {primaryCta.trial.label}
              </Button>
              <Button href={primaryCta.engineer.href} variant="ghost" size="lg" className="rounded-sm">
                {primaryCta.engineer.label}
              </Button>
            </div>
          </div>

          {/* the figure: GS1-5 as an annotated datasheet plate */}
          <figure className="lg:border-l lg:border-border lg:pl-8">
            <div className="draft-grid relative mx-auto aspect-square w-full max-w-md">
              <Image
                src="/products/gs1-5-safety-lidar.png"
                alt="OLEI GS1-5 safety LiDAR — yellow and black housing with 270° scan dome"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 80vw"
                className="object-contain p-10 md:p-12"
              />
              {/* leader lines (decorative duplicates of the mobile list below) */}
              <svg
                aria-hidden
                viewBox="0 0 100 100"
                className="absolute inset-0 hidden h-full w-full text-line-ink md:block"
              >
                {callouts.map((c) => (
                  <g key={c.label} stroke="currentColor" fill="none">
                    <circle cx={c.anchor.cx} cy={c.anchor.cy} r="1.2" fill="currentColor" stroke="none" />
                    <polyline points={c.line} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </g>
                ))}
              </svg>
              {callouts.map((c) => (
                <span
                  key={c.label}
                  aria-hidden
                  className={`absolute hidden font-mono text-anno-sm uppercase text-text-muted md:block ${c.labelPos}`}
                >
                  {c.label}
                </span>
              ))}
            </div>
            {/* figure caption — the dimension line under the plate */}
            <figcaption className="dim-line mt-5 font-mono text-anno-sm uppercase text-text">
              {gs15.model} · {formatPrice(gs15.price)} · in stock
            </figcaption>
            {/* mobile spec list (the accessible/stacked form of the callouts) */}
            <ul className="mt-4 grid gap-y-1 font-mono text-anno-sm uppercase text-text-muted md:hidden">
              {callouts.map((c) => (
                <li key={c.label} className="border-t border-border py-2">
                  {c.label}
                </li>
              ))}
            </ul>
          </figure>
        </div>

        {/* title-block strip */}
        <div className="relative grid grid-cols-2 border-t border-border font-mono text-anno-sm uppercase text-text-muted md:grid-cols-[2fr_1fr_1fr_2fr]">
          <span aria-hidden className="reg-mark -top-[5px] -left-[5px] hidden md:block" />
          <span aria-hidden className="reg-mark -top-[5px] -right-[5px] hidden md:block" />
          {[
            "Title — giving sight to robotics",
            "Sheet 1 of 1",
            "Scale — full",
            "Exclusive NA distributor — OLEI LiDAR",
          ].map((cell, i) => (
            <span
              key={cell}
              className={`border-border px-5 py-3 md:px-6 ${i > 0 ? "border-l" : ""} ${i >= 2 ? "max-md:border-t" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}
            >
              {cell}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
