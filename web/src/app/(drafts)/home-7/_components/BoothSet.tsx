import Image from "next/image";
import Link from "next/link";
import { site, primaryCta } from "@/lib/site";
import { getProduct, productImage, getCategory } from "@/lib/catalog";
import { CircuitTraces } from "./CircuitTraces";

/**
 * The set, staged like the photo and sized like a stage: on desktop the whole
 * composition fits one viewport (the parent grid hands us a fixed height and
 * the monitor flexes to absorb whatever the headline doesn't use). A lit
 * yellow backwall (light pool, print grain, one composed trace run) carries
 * the headline and demo monitor; the framed pegboard on the right hangs the
 * GS1-5 sign and four demo units — screws, cast shadows, label tags, no cards.
 */

const mounted = ["lr-1bs2-mini-zone-lidar", "vbd1-10-2d-lidar", "mrdvs-s10-rgbd-camera", "a090-laser-rangefinder"] as const;

// hard print shadow for CTAs — same top-left light as .booth-object
const ctaShadow = "shadow-[4px_5px_0_0_rgba(92,64,0,0.30)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(92,64,0,0.30)]";

export function BoothSet() {
  const gs15 = getProduct("gs1-5-safety-lidar");
  const gs15Img = gs15 && productImage(gs15.slug);

  return (
    <section className="lg:min-h-0">
      <div className="grid lg:h-full lg:min-h-0 lg:grid-cols-[7fr_5fr]">
        {/* ── the yellow backwall ─────────────────────────────────────────── */}
        <div className="booth-light booth-grain relative isolate flex flex-col overflow-hidden px-8 py-10 text-mt-navy md:px-12 lg:min-h-0 lg:py-8">
          {/* one trace run behind everything — masked off the copy zone so it
              never reads as strikethrough through the lead text */}
          <CircuitTraces className="absolute inset-x-0 top-8 -z-10 h-auto w-full [mask-image:linear-gradient(105deg,transparent_30%,#000_52%)]" />

          {/* lockup, two calm lines instead of one cramped row */}
          <div className="relative">
            <p className="flex items-center gap-2.5 font-display text-h5 font-bold tracking-tight">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rotate-45 bg-mt-red" />
              OLEI <span className="font-normal opacity-50">×</span> morpheusTEK
            </p>
            <p className="mt-1 font-mono text-anno-sm uppercase tracking-[0.18em] opacity-80">
              {site.distributor}
            </p>
          </div>

          <h1 className="relative mt-6 max-w-2xl font-display text-[clamp(2.5rem,4.6vw,4.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.015em] text-mt-navy">
            Giving sight
            <br />
            to robotics.
          </h1>
          <p className="relative mt-4 max-w-md text-base font-semibold md:text-lg">
            {site.heroProblem} Everything on this wall is real, powered on, and yours to run for
            90 days.
          </p>

          <div className="relative mt-5 flex flex-wrap gap-4">
            <Link
              href={primaryCta.trial.href}
              className={`inline-flex h-12 items-center bg-mt-navy px-6 font-display text-sm font-bold uppercase tracking-wide text-mt-yellow transition hover:bg-mt-navy-900 ${ctaShadow}`}
            >
              {primaryCta.trial.label}
            </Link>
            <Link
              href="/shows/meet-us-at-the-booth"
              className={`inline-flex h-12 items-center border-2 border-mt-navy bg-mt-yellow px-6 font-display text-sm font-bold uppercase tracking-wide text-mt-navy transition hover:bg-mt-yellow-bright ${ctaShadow}`}
            >
              Meet us at the booth
            </Link>
          </div>

          {/* the demo monitor — flexes to absorb the remaining stage height */}
          <figure className="relative mt-7 flex max-w-2xl flex-1 flex-col lg:min-h-0">
            <div className="booth-object flex min-h-0 flex-1 flex-col rounded-lg border-[10px] border-[#10131c] bg-[#10131c]">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] max-lg:aspect-[16/9] lg:min-h-36">
                <Image
                  src="/home-drafts/night-scan.jpg"
                  alt="Demo feed: an AMR scanning a dark warehouse aisle"
                  fill
                  sizes="(min-width: 1024px) 42rem, 92vw"
                  className="object-cover"
                />
                <span aria-hidden className="monitor-scan" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mt-red" />
                  Demo loop
                </span>
                {/* caption lives on the glass so it can't push past the fold */}
                <span className="absolute bottom-2.5 left-3 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85">
                  On screen: the line&apos;s working range
                </span>
              </div>
              {/* depth legend — a labeled instrument readout, not a pride stripe */}
              <div className="px-1 pb-0.5 pt-1.5">
                <div aria-hidden className="h-1.5 w-full rounded-full bg-gradient-to-r from-pc-near via-pc-2 via-pc-3 to-pc-5" />
                <div className="flex justify-between px-0.5 pt-1 font-mono text-[9px] tracking-[0.08em] text-white/55">
                  <span>0.3 m</span>
                  <span>5 m</span>
                  <span>50 m</span>
                  <span>100 m</span>
                </div>
              </div>
            </div>
          </figure>
        </div>

        {/* ── the pegboard wall ───────────────────────────────────────────── */}
        <div className="relative flex flex-col border-l border-mt-navy/15 bg-[#f4f2ea] px-6 py-6 text-mt-navy md:px-8 lg:min-h-0">
          {/* the board is a fixture filling the column */}
          <div className="pegboard relative flex min-h-0 flex-1 flex-col rounded-sm border border-mt-navy/20 px-5 py-5 md:px-7">
            <p className="inline-block self-start bg-[#fcfbf6] pr-3 font-mono text-anno-sm font-bold uppercase tracking-[0.2em] text-mt-blue">
              Demo wall · all units live
            </p>

            {/* the sign goes up first — it's the news */}
            {gs15 && gs15Img && (
              <Link
                href={`/products/${gs15.slug}`}
                className="booth-object-on-white group mt-4 block -rotate-[1.2deg] border border-mt-navy/30 bg-white p-5 transition hover:rotate-0 hover:border-mt-blue"
              >
                <div className="flex items-center gap-5">
                  <div className="min-w-0">
                    <p className="font-display text-h3 font-bold leading-[1.02] text-mt-navy">
                      Affordable Safety has arrived.
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-mt-gray">
                      Introducing the new {gs15.model} Safety LiDAR
                    </p>
                    <p className="mt-3 border-t border-mt-navy/15 pt-2 font-mono text-[11px]">
                      Type 3 · SIL2 · PL d — 270° · 5 m protective
                    </p>
                  </div>
                  <div className="relative h-24 w-28 shrink-0">
                    <Image
                      src={gs15Img}
                      alt={gs15.name}
                      fill
                      sizes="128px"
                      className="object-contain drop-shadow-[4px_6px_6px_rgba(15,50,108,0.25)] transition-transform duration-300 group-hover:scale-[1.05]"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* demo units hung at staggered heights — screws, shadows, tags */}
            <ul className="mt-auto grid grid-cols-2 gap-x-6 pt-6">
              {mounted.map((slug, i) => {
                const p = getProduct(slug);
                const img = p && productImage(p.slug);
                if (!p || !img) return null;
                return (
                  <li key={slug} className={i % 2 === 1 ? "mt-5" : ""}>
                    <Link href={`/products/${p.slug}`} className="group block">
                      {/* two screw heads into real board holes */}
                      <span aria-hidden className="mx-auto flex w-14 justify-between">
                        <span className="h-2 w-2 rounded-full bg-mt-navy/35 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />
                        <span className="h-2 w-2 rounded-full bg-mt-navy/35 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />
                      </span>
                      <div className="relative mt-1.5 h-20 lg:h-[clamp(3rem,8vh,5.5rem)]">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          sizes="160px"
                          className="object-contain drop-shadow-[5px_8px_8px_rgba(15,50,108,0.28)] transition-transform duration-300 group-hover:-translate-y-1"
                        />
                      </div>
                      {/* label tag, solid so the holes never run through type */}
                      <span className="mt-2 inline-block border border-mt-navy/25 bg-white px-2 py-1 shadow-[2px_3px_0_rgba(15,50,108,0.12)]">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-mt-gray">
                          {getCategory(p.category)?.label}
                        </span>
                        <span className="block max-w-[11rem] truncate font-mono text-[11px] font-bold uppercase tracking-[0.06em] group-hover:text-mt-blue">
                          {p.model} · {p.keySpecs[0].value}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
