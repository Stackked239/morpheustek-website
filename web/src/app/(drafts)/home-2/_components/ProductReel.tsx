"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { getProduct } from "@/lib/catalog";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// one representative SKU per category — all have product photography
const reel = [
  "gs1-5-safety-lidar",
  "lr-1f-2d-lidar",
  "lr-16f-100-3d-lidar",
  "lr-f240-solid-state-lidar",
  "mrdvs-s10-rgbd-camera",
  "lc-m50g-mobile-slam-mapper",
  "a090-laser-rangefinder",
  "sintrones-ibox-602p-edge-ai",
]
  .map(getProduct)
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

/**
 * Section 6 — pinned horizontal product reel. On desktop with motion enabled,
 * the section pins and the track translates sideways as you scroll down.
 * Reduced motion / mobile / no-JS: the track is a normal horizontally
 * scrollable row (native overflow), so every card stays reachable.
 */
export function ProductReel() {
  const scope = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const t = track.current;
        const s = scroller.current;
        if (!t || !s) return;

        // take over from native scroll while pinned
        gsap.set(s, { overflow: "hidden" });
        const distance = () => Math.max(0, t.scrollWidth - s.clientWidth);

        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="reel" className="flex min-h-screen flex-col justify-center overflow-hidden bg-bg-subtle py-16">
      <Container className="w-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>The line-up</Eyebrow>
            <h2 className="mt-3 font-display text-h2 font-extrabold uppercase tracking-tight text-text-strong">
              Proven sensing, in stock.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 font-mono text-xs uppercase tracking-wide text-text-subtle md:inline-flex">
              Scroll <ArrowRight className="size-4" />
            </span>
            <Button href="/products" variant="ghost" size="md">
              Browse all products
            </Button>
          </div>
        </div>
      </Container>

      {/* scroller: native horizontal scroll by default; GSAP drives it on desktop */}
      <div ref={scroller} className="mt-10 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div ref={track} className="flex w-max gap-5 px-6 md:px-12">
          {reel.map((p) => (
            <div key={p.slug} className="w-[280px] shrink-0">
              <ProductCard product={p} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
