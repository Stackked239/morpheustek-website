import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { site, primaryCta } from "@/lib/site";
import { getProduct } from "@/lib/catalog";

/**
 * Scene 23:42 — full-bleed cinematic night photograph (an AMR mid-aisle, its
 * LiDAR plane skimming the floor). One slow zoom, one scan sweep from the
 * existing sensor kit, and very little chrome: a timestamp, the line, the CTA.
 */
export function NightHero() {
  const gs15 = getProduct("gs1-5-safety-lidar");

  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
      {/* photograph */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/home-drafts/night-scan.jpg"
          alt="An autonomous mobile robot scanning a dark warehouse aisle with a plane of LiDAR light"
          fill
          priority
          sizes="100vw"
          className="hero-zoom object-cover"
        />
        {/* readability scrim, bottom-weighted like the shared .hero-scrim */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgba(3,8,15,0.92)] via-[rgba(3,8,15,0.35)] to-[rgba(3,8,15,0.25)]" />
      </div>

      {/* timestamp slate, top-left like a camera log */}
      <p className="absolute left-6 top-24 font-mono text-anno-sm uppercase tracking-[0.18em] text-text-muted md:left-12">
        23:42 · aisle 14 · <span className="text-brand-blue">scan active</span>
      </p>

      <div className="mt-container pb-20 pt-48 md:pb-28">
        <p className="eyebrow">{site.distributor}</p>
        <h1 className="mt-4 max-w-3xl font-display text-display-xl font-bold text-text-strong">
          The night shift that never blinks.
        </h1>
        <p className="mt-5 max-w-xl text-lead text-text-muted">
          {site.oneLiner}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href={primaryCta.trial.href} size="lg">
            {primaryCta.trial.label}
          </Button>
          <Button href={primaryCta.engineer.href} variant="ghost" size="lg">
            {primaryCta.engineer.label}
          </Button>
        </div>
        {/* three true readouts under the fold line — all from catalog.ts */}
        {gs15 && (
          <dl className="mt-12 flex max-w-2xl flex-wrap gap-x-10 gap-y-4 border-t border-border pt-5">
            {gs15.keySpecs.slice(0, 3).map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle">{s.label}</dt>
                <dd className="mt-1 font-mono text-anno text-text">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
