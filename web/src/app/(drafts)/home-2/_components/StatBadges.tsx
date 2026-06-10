"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { to: 300, suffix: "%", label: "Growth in the last five years" },
  { to: 90, suffix: " days", label: "Risk-free trial on every OLEI product" },
  { to: 270, suffix: "°", label: "Safety scanning field — the GS1-5" },
  { to: 18, suffix: "", label: "Sensors in the line-up, in stock" },
];

/**
 * Section 4 — manufacturing-strength proof with circular stat badges that
 * count up on entry (echoes the live site's "300% growth" badge).
 * Reduced motion / no-JS: numbers render at their final value (the JSX default).
 */
export function StatBadges() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".stat-num", scope.current).forEach((el) => {
          const to = Number(el.dataset.to ?? "0");
          const obj = { v: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            v: to,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toString();
            },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="proof" className="dark relative overflow-hidden bg-bg py-16 md:py-24">
      <div className="pointcloud-texture pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Eyebrow>Manufacturing strength behind the stack</Eyebrow>
          <AccentHeading className="mt-4">Lesser-known in the U.S. doesn&apos;t mean unproven.</AccentHeading>
          <p className="mt-5 text-lead text-text-muted">
            MorpheusTEK partners with OLEI — part of a high-tech laser-measurement manufacturing network with deep
            OEM/ODM capability and one of the largest laser-diode purchasing footprints in the world. We add the
            U.S.-based application support, customization, stocking, and supplier coordination North American robotics
            companies need.
          </p>
          <div className="mt-8">
            <Button href="/about" variant="ghost" size="lg">
              The story behind the stack
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="grid aspect-square w-full max-w-[11rem] place-items-center rounded-full bg-accent text-accent-text">
                <span className="tnum font-display text-[clamp(2rem,4.5vw,3rem)] font-black leading-none">
                  <span className="stat-num" data-to={s.to}>
                    {s.to}
                  </span>
                  {s.suffix}
                </span>
              </div>
              <p className="mt-4 max-w-[12rem] text-sm font-medium leading-snug text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
