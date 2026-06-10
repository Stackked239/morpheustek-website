import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { site, primaryCta } from "@/lib/site";
import { getProduct, productImage, formatPrice } from "@/lib/catalog";

/**
 * The headline poster. A solid yellow field, navy ink only (brand rule), type
 * at billboard scale, and the GS1-5 pinned like product evidence over a
 * halftone plate with its real price stamped beside it.
 */
export function PosterHero() {
  const gs15 = getProduct("gs1-5-safety-lidar");
  const img = gs15 && productImage(gs15.slug);

  return (
    <section className="border-b-2 border-mt-navy bg-mt-yellow text-mt-navy">
      <div className="mt-container mt-container-wide grid gap-10 py-16 md:grid-cols-[7fr_5fr] md:items-center md:py-24">
        <div>
          <p className="font-mono text-anno-sm font-bold uppercase tracking-[0.2em]">
            {site.distributor}
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.25rem,10vw,8.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em]">
            Robots
            <br />
            are blind.
            <br />
            <span className="poster-hollow">We fix that.</span>
          </h1>
          <p className="mt-8 max-w-md text-lead font-semibold">
            {site.heroProblem} LiDAR, 3D cameras, safety sensing, and edge compute — one partner,
            one price list, no mystery quotes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {/* on a yellow field the CTA goes navy — the yellow IS the page */}
            <Button
              href={primaryCta.trial.href}
              size="lg"
              className="rounded-none bg-mt-navy text-mt-yellow hover:bg-mt-navy-900 hover:shadow-none"
            >
              {primaryCta.trial.label}
            </Button>
            <Button
              href="/products"
              size="lg"
              className="rounded-none border-2 border-mt-navy bg-transparent text-mt-navy hover:bg-transparent hover:shadow-none"
            >
              See the full list
            </Button>
          </div>
        </div>

        {gs15 && img && (
          <figure className="halftone relative border-2 border-mt-navy p-8">
            <div className="relative aspect-square">
              <Image
                src={img}
                alt={gs15.name}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-6 flex items-end justify-between gap-4 border-t-2 border-mt-navy pt-4">
              <span className="font-display text-h4 font-bold uppercase">
                {gs15.name}
                <span className="mt-1 block font-mono text-anno-sm font-normal normal-case tracking-[0.08em]">
                  Type 3 · SIL2 · PL d — same safety class as SICK
                </span>
              </span>
              <span className="font-display text-figure font-bold tabular-nums">
                {formatPrice(gs15.price)}
              </span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
