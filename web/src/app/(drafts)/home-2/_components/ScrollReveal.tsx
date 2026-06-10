"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Reveal-on-scroll wrapper for Variant 2. Any descendant with the
 * `data-reveal` attribute rises + fades in (staggered) as the block enters.
 *
 * Progressive enhancement: GSAP only runs under (prefers-reduced-motion:
 * no-preference). The static DOM is the final, visible state, so no-JS /
 * reduced-motion / crawlers see everything with no animation.
 */
export function ScrollReveal({
  children,
  className,
  y = 28,
  stagger = 0.1,
  start = "top 82%",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current);
        if (!items.length) return;
        gsap.from(items, {
          y,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: scope.current, start },
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
