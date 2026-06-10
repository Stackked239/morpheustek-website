"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BadgeCheck, Move3d } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyeMark } from "@/components/brand/EyeMark";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// three.js viewer loads lazily, client-only, after first paint — never in SSR
const ScanViewer = dynamic(() => import("./ScanViewer").then((m) => m.ScanViewer), {
  ssr: false,
});

const chips = ["90-day risk-free trial", "Same safety class as SICK", "North American support"];

/**
 * Variant 2 hero — "Into Focus".
 * Bold navy ⇄ yellow angular duotone (live-site language) with a concentric
 * radar-sweep panel. GSAP runs ONLY under (prefers-reduced-motion: no-preference);
 * the static DOM is already the final, fully-readable state, so no-JS / reduced
 * motion / crawlers see the complete hero with zero animation.
 */
export function HeroIntoFocus() {
  const scope = useRef<HTMLElement>(null);
  const [scanOn, setScanOn] = useState(false);    // mount the 3D viewer?
  const [scanReady, setScanReady] = useState(false); // first cloud frame rendered
  const [hintDismissed, setHintDismissed] = useState(false);

  // Progressive enhancement: viewer mounts only with motion allowed, after idle —
  // the RadarPanel SVG is the SSR / no-JS / reduced-motion / loading state.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const start = () => setScanOn(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 400);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ---- entrance timeline ----
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // text lines rise into place
        tl.from(
          ".hero-line",
          { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.1 },
          0.15,
        );

        // ---- scroll-scrubbed parallax: the yellow panel lags the scroll ----
        // === TUNE ME (the "depth" feel) ============================================
        // How far the radar panel drifts vs. the page as you scroll past the hero.
        // Bigger negative = more depth/lag. Try -8 (subtle) … -22 (dramatic).
        const PARALLAX_PERCENT = -14;
        // ===========================================================================
        gsap.to(".hero-parallax", {
          yPercent: PARALLAX_PERCENT,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="dark relative isolate flex min-h-[92vh] items-center overflow-hidden bg-bg"
    >
      {/* faint point-cloud field on the navy */}
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />

      {/* ---- yellow angular scan panel (right): bezel + live point-cloud viewport ---- */}
      <div
        className="hero-parallax absolute inset-y-0 right-0 hidden w-[48%] bg-accent md:block"
        style={{ clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      >
        {/* dark viewport inset into the yellow bezel */}
        <div
          className="absolute inset-3 overflow-hidden bg-mt-navy-900"
          style={{ clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          onPointerDown={() => setHintDismissed(true)}
        >
          {/* brand circuit-eye — SSR / no-JS / reduced-motion / loading state */}
          <div
            className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${
              scanReady ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <EyeMark size={200} scanning className="opacity-90" />
          </div>

          {/* live draggable scan */}
          {scanOn && (
            <ScanViewer
              className={`absolute inset-0 transition-opacity duration-700 ${
                scanReady ? "opacity-100" : "opacity-0"
              }`}
              onReady={() => setScanReady(true)}
            />
          )}

          {/* instrumentation — true catalog facts only */}
          <div className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            LR-16F-100 · 360°×30° · simulated sweep
          </div>
          <div className="pointer-events-none absolute bottom-3 left-[24%] font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">
            GS1-5 protective field · 270° · ≤5 m
          </div>

          {/* drag affordance — appears with the cloud, leaves on first touch */}
          <div
            className={`pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
              scanReady && !hintDismissed ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="inline-flex items-center gap-2 border border-border bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text backdrop-blur-sm">
              <Move3d className="size-3.5 text-accent" /> Drag to orbit · scroll to zoom
            </span>
          </div>
        </div>
      </div>

      {/* angled navy→yellow seam accent */}
      <div
        className="hero-parallax pointer-events-none absolute inset-y-0 right-[48%] hidden w-[3px] bg-accent/70 md:block"
        style={{ clipPath: "polygon(100% 0, 100% 0, 0 100%, 0 100%)" }}
        aria-hidden
      />

      {/* pointer-events-none: the full-width container sits above the scan panel
          and must not swallow its drags; the content column re-enables its own */}
      <Container className="pointer-events-none relative z-10 py-24 md:py-28">
        <div className="pointer-events-auto max-w-2xl">
          {/* eyebrow + eye for brand presence (esp. mobile) */}
          <div className="hero-line flex items-center gap-3">
            <EyeMark size={44} scanning className="text-accent" />
            <span className="eyebrow">{site.distributor}</span>
          </div>

          {/* display headline — all-caps, "SIGHT" in accent */}
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-text-strong">
            <span className="hero-line block overflow-hidden">
              <span className="block">
                Giving <span className="text-accent">Sight</span>
              </span>
            </span>
            <span className="hero-line block overflow-hidden">
              <span className="block">to Robotics</span>
            </span>
          </h1>

          {/* keyword-rich lead (SEO) sits under the brand tagline H1 */}
          <p className="hero-line mt-7 max-w-xl text-lead text-text-muted">{site.heroHeadline}</p>

          <div className="hero-line mt-9 flex flex-wrap gap-3">
            <Button href="/book-a-meeting?intent=trial" variant="primary" size="lg">
              Start a 90-day trial
            </Button>
            <Button href="/book-a-meeting?intent=engineer" variant="ghost" size="lg">
              Talk to an engineer
            </Button>
          </div>

          <ul className="hero-line mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-text">
            {chips.map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

