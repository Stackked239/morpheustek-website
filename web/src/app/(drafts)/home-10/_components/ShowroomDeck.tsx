"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site, primaryCta } from "@/lib/site";
import { getProduct, productImage } from "@/lib/catalog";

/**
 * Six scenes on one horizontal snap track. The shell is the only JS: arrow
 * keys page the deck, an IntersectionObserver lights the progress rail, and
 * clicking a dot scrolls to its scene. All in-scene motion (parallax, copy
 * rise) is CSS view(inline) animation. On <lg the track becomes a vertical
 * stack and the rail disappears.
 */

const SCENES = ["The showroom", "Safety", "Sunlight", "Depth", "Edge", "Your floor"] as const;

export function ShowroomDeck() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = [...track.querySelectorAll("[data-scene]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.scene));
        }
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      track.scrollBy({ left: e.key === "ArrowRight" ? track.clientWidth : -track.clientWidth, behavior: "smooth" });
    };
    track.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      track.removeEventListener("keydown", onKey);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.querySelector<HTMLElement>(`[data-scene="${i}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const gs15 = getProduct("gs1-5-safety-lidar");
  const vss = getProduct("vss-50-solid-state-3d-lidar");
  const gm465 = getProduct("mrdvs-s11-rgbd-camera");
  const ibox = getProduct("sintrones-ibox-602p-edge-ai");

  const slide = "relative shrink-0 snap-start overflow-hidden lg:h-full lg:w-full max-lg:min-h-[88svh]";
  const placard = "font-mono text-anno-sm uppercase tracking-[0.18em]";

  return (
    <section aria-label="MorpheusTEK showroom" className="relative lg:h-[calc(100svh-7rem)]">
      <div
        ref={trackRef}
        tabIndex={0}
        className="flex flex-col outline-none lg:h-full lg:snap-x lg:snap-mandatory lg:flex-row lg:overflow-x-auto lg:overflow-y-hidden [scrollbar-width:none]"
      >
        {/* ── 1 · title card: the dusk lab ──────────────────────────────── */}
        <div data-scene={0} className={`${slide} flex items-end bg-mt-navy-900`}>
          <div aria-hidden className="deck-parallax absolute inset-0">
            <Image src="/home-drafts/lab-dusk.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgba(4,10,26,0.88)] via-transparent to-transparent" />
          <div className="relative w-full px-8 pb-14 md:px-16">
            <p className={`deck-rise ${placard} text-mt-cyan`}>{site.distributor}</p>
            <h1 className="deck-rise mt-4 max-w-3xl font-display text-display-xl font-bold text-white">
              Walk the line.
            </h1>
            <p className="deck-rise mt-4 max-w-md text-lead text-white/75">
              Six rooms, one perception stack. {site.tagline}.
            </p>
            <p className={`deck-rise mt-10 ${placard} text-white/50 max-lg:hidden`}>
              scroll sideways → or use arrow keys
            </p>
          </div>
        </div>

        {/* ── 2 · the safety hall ───────────────────────────────────────── */}
        <div data-scene={1} className={`${slide} bg-bg`}>
          <div className="grid h-full lg:grid-cols-2">
            <div className="flex flex-col justify-center px-8 py-14 md:px-16">
              <p className={`deck-rise ${placard} text-brand-blue`}>Room 01 · Safety</p>
              <h2 className="deck-rise mt-4 font-display text-h1 font-bold text-text-strong">
                Certified to stop
                <br />
                for people.
              </h2>
              <p className="deck-rise mt-5 max-w-md text-lead text-text-muted">
                The {gs15?.model} carries the same Type 3 · SIL2 · PL d rating as SICK&apos;s
                scanners — at roughly half to a third of the price.
              </p>
              <dl className="deck-rise mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-5">
                {gs15?.keySpecs.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-h3 font-bold text-text-strong">{s.value.split(" ")[0]}</dd>
                    <dt className="mt-1 font-mono text-anno-sm text-text-subtle">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <Link href={`/products/${gs15?.slug}`} className="deck-rise mt-7 w-fit font-semibold text-brand-blue underline-offset-4 hover:underline">
                Inspect the {gs15?.model} →
              </Link>
            </div>
            <div className="relative flex items-center justify-center bg-bg-subtle max-lg:py-16">
              {gs15 && (
                <div className="deck-rise relative h-64 w-72 lg:h-[55%] lg:w-[70%]">
                  <Image src={productImage(gs15.slug)!} alt={gs15.name} fill sizes="(min-width:1024px) 35vw, 80vw" className="object-contain drop-shadow-[0_24px_32px_rgba(10,35,80,0.25)]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 3 · sunlight: the outdoor proof ───────────────────────────── */}
        <div data-scene={2} className={`${slide} flex items-end`}>
          <div aria-hidden className="deck-parallax absolute inset-0">
            <Image src="/home-drafts/sun-field.jpg" alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgba(20,16,4,0.92)] via-[rgba(20,16,4,0.30)] to-transparent" />
          <div className="relative w-full px-8 pb-14 md:px-16">
            <p className={`deck-rise ${placard} text-mt-yellow-bright`}>Room 02 · Sunlight</p>
            <h2 className="deck-rise mt-4 max-w-2xl font-display text-h1 font-bold text-white">
              100,000 lux of direct sun. Still scanning.
            </h2>
            <p className="deck-rise mt-4 max-w-lg text-lead text-white/80">
              The {vss?.model} is solid-state — no moving parts — and paints 540,000 points a
              second through the brightest part of the day.
            </p>
            <Link href={`/products/${vss?.slug}`} className="deck-rise mt-6 inline-block font-semibold text-mt-yellow-bright underline-offset-4 hover:underline">
              Inspect the {vss?.model} →
            </Link>
          </div>
        </div>

        {/* ── 4 · the depth room ────────────────────────────────────────── */}
        <div data-scene={3} className={`${slide} dark bg-bg`}>
          <div className="grid h-full lg:grid-cols-2">
            <div className="relative flex items-center justify-center max-lg:order-2 max-lg:py-16">
              {gm465 && (
                <div className="deck-rise relative h-64 w-72 lg:h-[50%] lg:w-[65%]">
                  <Image src={productImage(gm465.slug)!} alt={gm465.name} fill sizes="(min-width:1024px) 35vw, 80vw" className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                </div>
              )}
              <span aria-hidden className="absolute inset-x-16 bottom-12 h-1 rounded-full bg-gradient-to-r from-pc-near via-pc-2 via-pc-3 to-pc-5 opacity-70" />
            </div>
            <div className="flex flex-col justify-center px-8 py-14 md:px-16">
              <p className={`deck-rise ${placard} text-brand-blue`}>Room 03 · Depth</p>
              <h2 className="deck-rise mt-4 font-display text-h1 font-bold text-text-strong">
                Arm&apos;s length,
                <br />
                measured.
              </h2>
              <p className="deck-rise mt-5 max-w-md text-lead text-text-muted">
                The {gm465?.model} switches between high-speed and high-accuracy depth in one
                rugged industrial camera — pallet pockets, bins, and low obstacles, resolved.
              </p>
              <Link href={`/products/${gm465?.slug}`} className="deck-rise mt-7 w-fit font-semibold text-brand-blue underline-offset-4 hover:underline">
                Inspect the {gm465?.model} →
              </Link>
            </div>
          </div>
        </div>

        {/* ── 5 · the edge rack ─────────────────────────────────────────── */}
        <div data-scene={4} className={`${slide} bg-mt-navy text-white`}>
          <div className="flex h-full flex-col justify-center px-8 py-14 md:px-16">
            <p className={`deck-rise ${placard} text-mt-cyan`}>Room 04 · Edge</p>
            <h2 className="deck-rise mt-4 max-w-3xl font-display text-h1 font-bold text-white">
              Every room you just walked through, in one box.
            </h2>
            <div className="mt-10 grid max-w-4xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <p className="deck-rise max-w-md text-lead text-white/75">
                The {ibox?.model} — fanless NVIDIA Jetson Orin NX, IP66, 9–60 V — takes the
                scanners, the camera, and the safety field and hands your software one feed.
              </p>
              {ibox && (
                <div className="deck-rise relative h-44 w-64">
                  <Image src={productImage(ibox.slug)!} alt={ibox.name} fill sizes="256px" className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]" />
                </div>
              )}
            </div>
            <dl className="deck-rise mt-10 flex max-w-3xl flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-5">
              {ibox?.keySpecs.map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-anno-sm uppercase tracking-[0.12em] text-white/45">{s.label}</dt>
                  <dd className="mt-1 font-mono text-anno text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── 6 · finale: your floor ────────────────────────────────────── */}
        <div data-scene={5} className={`${slide} bg-mt-yellow text-mt-navy`}>
          <div className="flex h-full flex-col items-start justify-center px-8 py-14 md:px-16">
            <p className={`deck-rise ${placard}`}>Last room · Yours</p>
            <h2 className="deck-rise mt-4 max-w-3xl font-display text-[clamp(3rem,7vw,6.5rem)] font-bold uppercase leading-[0.92] text-mt-navy">
              The tour ends
              <br />
              on your floor.
            </h2>
            <p className="deck-rise mt-6 max-w-md text-lead font-semibold">
              Take any of it home for 90 days, free. If it can&apos;t see what your robot needs to
              see, send it back.
            </p>
            <div className="deck-rise mt-9 flex flex-wrap gap-4">
              <Link
                href={primaryCta.trial.href}
                className="inline-flex h-13 items-center bg-mt-navy px-8 font-display text-base font-bold uppercase tracking-wide text-mt-yellow transition hover:bg-mt-navy-900"
              >
                {primaryCta.trial.label}
              </Link>
              <Link
                href="/products"
                className="inline-flex h-13 items-center border-2 border-mt-navy px-8 font-display text-base font-bold uppercase tracking-wide text-mt-navy transition hover:bg-mt-yellow-bright"
              >
                Browse the full line
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* progress rail (desktop deck only) */}
      <nav aria-label="Showroom scenes" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full bg-black/55 px-4 py-2 backdrop-blur-sm lg:flex">
        {SCENES.map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            aria-label={`Go to scene: ${label}`}
            aria-current={active === i ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i ? "w-8 bg-mt-yellow" : "w-2 bg-white/45 hover:bg-white/75"
            }`}
          />
        ))}
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
          {SCENES[active]}
        </span>
      </nav>
    </section>
  );
}
