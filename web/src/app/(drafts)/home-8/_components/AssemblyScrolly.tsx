"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getProduct, productImage } from "@/lib/catalog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The assembly: a stage pinned for four steps. Each step block on the right
 * scrubs its part onto the stack (x/rotation → slot) and lights its row of
 * the bus line. Authored final-state-first: the DOM is the assembled stack,
 * gsap.from() animates INTO it, so no-JS / reduced-motion / crawlers read
 * the finished machine.
 */

const steps = [
  {
    slug: "gs1-5-safety-lidar",
    role: "Protect",
    claim: "The safety floor goes in first.",
    body: "A 270° functional-safety scanner, certified Type 3 / SIL2 / PL d — the same class as SICK, at roughly half to a third of the price. People stop being a risk calculation.",
    spec: "5 m protective · 20–30 m warning · IP65",
  },
  {
    slug: "lr-16f-100-3d-lidar",
    role: "Map",
    claim: "Then the world gets geometry.",
    body: "Sixteen channels sweep 360° × 30° out to 100 meters. The robot stops inferring the building and starts measuring it.",
    spec: "16 ch · 360°×30° · 100 m · IP66",
  },
  {
    slug: "mrdvs-s11-rgbd-camera",
    role: "See",
    claim: "Close range gets eyes.",
    body: "Ultra-wide 140° dToF depth in one rugged camera — pallet pockets, bins, and low obstacles to 6 m at ±1 cm, seeing closer than active stereo.",
    spec: "140° FOV · dToF · ±1 cm @ 2 m",
  },
  {
    slug: "sintrones-ibox-602p-edge-ai",
    role: "Think",
    claim: "And one brain runs it all.",
    body: "A fanless Jetson Orin NX box, IP66, 9–60 V — every sensor above lands here and leaves as one feed your software already understands.",
    spec: "Jetson Orin NX · 2× PoE + 2× GMSL-2 · IP66",
  },
] as const;

export function AssemblyScrolly() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: scope.current,
          start: "top top",
          end: "bottom bottom",
          pin: "[data-stage]",
          pinSpacing: false,
        });

        steps.forEach((_, i) => {
          const part = `[data-part="${i}"]`;
          const wire = `[data-wire="${i}"]`;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: `[data-step="${i}"]`,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.6,
            },
          });
          tl.from(part, {
            x: 240,
            y: -60,
            rotation: 8,
            opacity: 0,
            ease: "power2.out",
          }).from(
            wire,
            { scaleY: 0, transformOrigin: "top", ease: "none" },
            "<0.3",
          );
        });

        // step copy: quick rise as each block arrives (not scrubbed — snappy)
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-rise]"), {
            y: 26,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 70%" },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative bg-bg">
      <div className="mx-auto grid max-w-[80rem] px-6 md:px-12 lg:grid-cols-2 lg:gap-12">
        {/* ── the stage: pinned for the whole sequence ──────────────────── */}
        <div data-stage className="top-0 flex h-auto flex-col justify-center py-12 max-lg:hidden lg:h-screen">
          <p className="font-mono text-anno-sm uppercase tracking-[0.2em] text-text-subtle">
            Assembly · seq 01–04
          </p>
          <div className="mt-6">
            {steps.map((s, i) => {
              const p = getProduct(s.slug);
              const img = p && productImage(p.slug);
              return (
                <div key={s.slug} className="flex items-stretch gap-5">
                  {/* the bus line, lit per step */}
                  <div className="relative w-10 shrink-0">
                    {i > 0 && (
                      <span
                        data-wire={i}
                        aria-hidden
                        className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-brand-blue"
                      />
                    )}
                    <span aria-hidden className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-blue bg-bg" />
                  </div>
                  {/* the part */}
                  <div data-part={i} className="flex flex-1 items-center gap-5 border-b border-border py-3 last:border-b-0">
                    {img && (
                      <div className="relative h-20 w-28 shrink-0">
                        <Image src={img} alt={p!.name} fill sizes="160px" className="object-contain" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-anno-sm uppercase tracking-[0.16em] text-brand-blue">
                        {`0${i + 1}`} · {s.role}
                      </p>
                      <p className="truncate font-display text-h4 font-bold text-text-strong">{p?.name}</p>
                      <p className="truncate font-mono text-anno-sm text-text-subtle">{s.spec}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-8 max-w-sm font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle">
            Output: one integrated feed → your stack
          </p>
        </div>

        {/* ── the steps: scroll runway driving the stage ────────────────── */}
        <div>
          {steps.map((s, i) => {
            const p = getProduct(s.slug);
            const img = p && productImage(p.slug);
            return (
              <article key={s.slug} data-step={i} className="flex min-h-[60svh] flex-col justify-center py-14 lg:min-h-screen">
                <p data-rise className="font-mono text-anno-sm uppercase tracking-[0.2em] text-brand-blue">
                  Step {`0${i + 1}`} of 04 · {s.role}
                </p>
                <h2 data-rise className="mt-4 max-w-md font-display text-h1 font-bold text-text-strong">
                  {s.claim}
                </h2>
                {/* on mobile the stage is hidden, so the part rides with its step */}
                {img && (
                  <div data-rise className="relative mt-6 h-36 max-w-xs lg:hidden">
                    <Image src={img} alt={p!.name} fill sizes="320px" className="object-contain" />
                  </div>
                )}
                <p data-rise className="mt-5 max-w-md text-lead text-text-muted">
                  {s.body}
                </p>
                <p data-rise className="mt-6 font-mono text-anno-sm text-text-subtle">
                  {p?.name} — {s.spec}
                </p>
                <Link
                  data-rise
                  href={`/products/${s.slug}`}
                  className="mt-3 w-fit font-semibold text-brand-blue underline-offset-4 hover:underline"
                >
                  Inspect this part →
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
