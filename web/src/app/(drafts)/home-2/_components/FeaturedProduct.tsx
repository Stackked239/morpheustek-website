"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getProduct, formatPrice } from "@/lib/catalog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const gs1 = getProduct("gs1-5-safety-lidar");

/**
 * Section 5 — the full-yellow featured-product band (the live site's signature
 * moment). Navy text on yellow (brand law); the SIL2 badge is data-driven (the
 * GS1-5 carries `certifications`). The image parallax-floats; spec rows reveal.
 * CTA is brand-blue, never yellow, so the band keeps one yellow CTA per viewport.
 */
export function FeaturedProduct() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".feat-img", {
          yPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.from(".feat-spec", {
          y: 22,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".feat-specs", start: "top 85%" },
        });
      });
    },
    { scope },
  );

  if (!gs1) return null;
  const isSafety = (gs1.certifications?.length ?? 0) > 0;

  return (
    <section ref={scope} id="featured" className="relative overflow-hidden bg-accent py-16 text-accent-text md:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          {/* product on a floating white stage */}
          <div className="order-2 lg:order-1">
            <div className="feat-img relative mx-auto aspect-[4/3] w-full max-w-md rounded-xl bg-surface shadow-[var(--shadow-xl)]">
              <Image
                src="/products/gs1-5-safety-lidar.png"
                alt="OLEI GS1-5 270° functional-safety LiDAR scanner"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain p-8"
              />
            </div>
          </div>

          {/* copy + specs */}
          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-text/70">
              Featured · Affordable safety has arrived
            </p>
            <h2 className="mt-3 font-display text-h2 font-extrabold uppercase leading-[1.02] tracking-tight">
              The OLEI GS1-5 Safety LiDAR
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {isSafety ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-text px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                  <ShieldCheck className="size-3.5" /> SIL2 · Type 3 · PL d
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-text/80">
                <BadgeCheck className="size-3.5" /> In stock · 90-day trial
              </span>
            </div>

            <p className="mt-5 max-w-xl text-lead leading-relaxed text-accent-text/90">{gs1.summary}</p>

            <dl className="feat-specs mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-accent-text/15 bg-accent-text/15">
              {gs1.keySpecs.map((s) => (
                <div key={s.label} className="feat-spec bg-accent p-4">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wide text-accent-text/70">{s.label}</dt>
                  <dd className="tnum mt-1 font-display text-h5 font-bold">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <span className="font-display text-h3 font-black">{formatPrice(gs1.price)}</span>
              <Button href="/products/gs1-5-safety-lidar" variant="secondary" size="lg">
                See the GS1-5
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
