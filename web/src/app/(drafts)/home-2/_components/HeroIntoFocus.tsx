"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyeMark } from "@/components/brand/EyeMark";
import { site } from "@/lib/site";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ---- entrance timeline ----
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // radar arcs draw themselves in (pathLength=1 normalizes the dash math)
        gsap.set(".radar-arc", { strokeDasharray: 1, strokeDashoffset: 1 });
        tl.to(".radar-arc", { strokeDashoffset: 0, duration: 1.4, stagger: 0.12 }, 0);

        // text lines rise into place
        tl.from(
          ".hero-line",
          { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.1 },
          0.15,
        );

        // crosshair + eye settle
        tl.from(".radar-cross", { opacity: 0, scale: 0.85, transformOrigin: "center", duration: 0.8 }, 0.6);
        tl.from(".hero-eye", { opacity: 0, scale: 0.6, transformOrigin: "center", duration: 0.7 }, 0.7);

        // ---- continuous radar sweep ----
        gsap.to(".radar-sweep", {
          rotation: 360,
          transformOrigin: "center",
          repeat: -1,
          duration: 6,
          ease: "none",
        });

        // ---- scroll-scrubbed parallax: the yellow panel & arcs lag the scroll ----
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

      {/* ---- yellow angular radar panel (right) ---- */}
      <div
        className="hero-parallax pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] bg-accent md:block"
        style={{ clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden
      >
        <div className="absolute inset-0 grid place-items-center">
          <RadarPanel />
        </div>
      </div>

      {/* angled navy→yellow seam accent */}
      <div
        className="hero-parallax pointer-events-none absolute inset-y-0 right-[48%] hidden w-[3px] bg-accent/70 md:block"
        style={{ clipPath: "polygon(100% 0, 100% 0, 0 100%, 0 100%)" }}
        aria-hidden
      />

      <Container className="relative z-10 py-24 md:py-28">
        <div className="max-w-2xl">
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

/** Concentric radar sweep — navy strokes on the yellow panel. */
function RadarPanel() {
  const rings = [70, 118, 166, 214];
  return (
    <svg
      viewBox="0 0 460 460"
      className="h-[78%] w-[78%] text-mt-navy"
      fill="none"
      aria-hidden
    >
      {/* concentric arcs */}
      {rings.map((r) => (
        <circle
          key={r}
          className="radar-arc"
          cx="230"
          cy="230"
          r={r}
          pathLength={1}
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      ))}

      {/* crosshair */}
      <g className="radar-cross" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2">
        <line x1="230" y1="8" x2="230" y2="452" />
        <line x1="8" y1="230" x2="452" y2="230" />
      </g>

      {/* rotating sweep wedge */}
      <g className="radar-sweep">
        <defs>
          <linearGradient id="sweep" x1="230" y1="230" x2="230" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--mt-navy)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--mt-navy)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M230 230 L188 18 A214 214 0 0 1 272 18 Z" fill="url(#sweep)" />
        <line x1="230" y1="230" x2="230" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* center "iris" focal point — the eye at the heart of the sweep */}
      <g className="hero-eye">
        <circle cx="230" cy="230" r="30" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.8" />
        <circle cx="230" cy="230" r="13" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="230" cy="230" r="5" fill="currentColor" />
      </g>
    </svg>
  );
}
