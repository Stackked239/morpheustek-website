"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EyeMark } from "@/components/brand/EyeMark";
import type { SeamApi } from "./SeamViewer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// three.js viewer loads lazily, client-only, after first paint — never in SSR
const SeamViewer = dynamic(() => import("./SeamViewer").then((m) => m.SeamViewer), { ssr: false });

const chips = ["90-day risk-free trial", "Same safety class as SICK", "North American support"];

/**
 * Home hero — "The Seam".
 *
 * One warehouse aisle, one camera, a divider you drag: the aisle as you see it
 * on the left, the same aisle as an OLEI sensor sees it on the right. The
 * choreography: the brand eye opens → the scan acquires ring-by-ring → the seam
 * sweeps once across the forklift, so you know it moves. Everything below the
 * EyeMark poster runs ONLY under html.js + prefers-reduced-motion: no-preference;
 * the poster is the complete,
 * readable SSR / no-JS / reduced-motion hero.
 */
export function HeroSeam({ distributor, problem }: { distributor: string; problem: string }) {
  const scope = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);     // inner viewport — projection reference box
  const eyeRef = useRef<HTMLDivElement>(null);
  const api = useRef<SeamApi | null>(null);
  const replayingRef = useRef(false); // guards against overlapping re-entry replays

  const [scanOn, setScanOn] = useState(false);       // mount the 3D viewer?
  const [scanReady, setScanReady] = useState(false); // first cloud frame rendered
  const [hintDismissed, setHintDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pill, setPill] = useState<"lidar" | "camera">("lidar");

  // Progressive enhancement: mount only with motion allowed and not on Save-Data,
  // after idle. The EyeMark poster is the SSR / no-JS / reduced-motion state.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;
    const start = () => setScanOn(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // mobile: the pill drives the seam fully (no 1px handle on touch)
  useEffect(() => {
    if (!isMobile || !scanReady) return;
    api.current?.setSplitTarget(pill === "lidar" ? 0.06 : 0.94);
  }, [isMobile, scanReady, pill]);

  // ---- re-entry replay: re-run the full "eyeball → scan acquires → Boom" beat ----
  // The client (06-12, R10) wanted the entry choreography to re-fire on scroll-back,
  // not just on first load: bring the brand eye back, then crossfade to a freshly
  // re-acquiring scan. Runs on touch too (the pill re-applies its seam after).
  // All deps are refs / stable setters, so the deps:[] effect closure stays valid.
  useEffect(() => {
    const section = scope.current;
    if (!section) return;
    let leftAt = 0;
    const runReplay = () => {
      if (replayingRef.current || !api.current) return;
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
      replayingRef.current = true;
      setScanReady(false); // eye crossfades back in, scan fades out
      if (eyeRef.current) {
        gsap.fromTo(eyeRef.current, { scale: 0.7 }, { scale: 1, duration: 0.7, ease: "power3.out" });
      }
      // …then, once the eye has read, restart acquisition and crossfade to the scan
      window.setTimeout(() => {
        api.current?.replayIntro(); // reset sweepStart → ring-by-ring acquisition re-runs
        setScanReady(true);
        replayingRef.current = false;
      }, 760);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // replay only after a real absence (avoids re-firing on tiny scroll jitter)
          if (leftAt && performance.now() - leftAt > 1200) runReplay();
        } else {
          leftAt = performance.now();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // the brand eye opens first — the locked "eyeball, then the scan, Boom" beat.
        // scale only: the crossfade-out lives on the parent's opacity, so we must
        // not leave an inline opacity on this element.
        if (eyeRef.current) tl.from(eyeRef.current, { scale: 0.7, duration: 0.7 }, 0);
        // headline + supporting lines rise into place
        tl.from(".hero-line", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.09 }, 0.12);

        // the instrument panel lags the scroll — depth without parallax nausea
        gsap.to(".hero-parallax", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="dark relative isolate flex flex-col overflow-hidden bg-bg md:block md:min-h-[78vh]"
    >
      {/* faint point-cloud field on the navy */}
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />

      {/* ---- the instrument: scan card on mobile (in flow, on top), angular panel on desktop ---- */}
      <div
        className="hero-parallax relative h-[52svh] w-full bg-accent md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[44%] md:[clip-path:polygon(22%_0%,100%_0%,100%_100%,0%_100%)]"
      >
        {/* dark viewport inset into the yellow bezel */}
        <div
          ref={panelRef}
          className="absolute inset-0 overflow-hidden bg-mt-navy-900 md:inset-3 md:[clip-path:polygon(22%_0%,100%_0%,100%_100%,0%_100%)]"
          onPointerDown={() => setHintDismissed(true)}
        >
          {/* brand circuit-eye — SSR / no-JS / reduced-motion / loading state.
              Outer wrapper owns the crossfade; inner element owns the GSAP "open"
              (scale only — animating opacity here would leave an inline value that
              defeats the scanReady fade-out). */}
          <div
            className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${
              scanReady ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div ref={eyeRef}>
              <EyeMark size={200} scanning className="opacity-90" />
            </div>
          </div>

          {/* live draggable reality ⇄ scan seam */}
          {scanOn && (
            <SeamViewer
              api={api}
              className={`absolute inset-0 transition-opacity duration-700 ${scanReady ? "opacity-100" : "opacity-0"}`}
              onReady={() => setScanReady(true)}
            />
          )}

          {/* fixed instrumentation — true catalog model */}
          <div className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            OLEI LR-16F-100 · 360°×30°
          </div>

          {/* mobile-only CAMERA / LiDAR driver (no 1px handle on touch) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
            <div role="group" aria-label="Reality or LiDAR view" className="flex overflow-hidden rounded-full border border-accent/60 bg-mt-navy-900/85 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-sm">
              {(["camera", "lidar"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={pill === m}
                  onClick={() => setPill(m)}
                  className={`px-4 py-2 transition-colors ${
                    pill === m ? "bg-accent text-accent-text" : "text-text-muted"
                  }`}
                >
                  {m === "camera" ? "Camera" : "LiDAR"}
                </button>
              ))}
            </div>
          </div>

          {/* drag affordance (desktop) — appears with the cloud, leaves on first touch */}
          <div
            className={`pointer-events-none absolute bottom-6 left-[24%] hidden transition-opacity duration-500 md:block ${
              scanReady && !hintDismissed ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="inline-flex items-center gap-2 border border-border bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text backdrop-blur-sm">
              Drag the line · what you see / what it sees
            </span>
          </div>
        </div>
      </div>

      {/* ---- headline column ---- */}
      <Container className="pointer-events-none relative z-10 py-14 md:py-28">
        <div className="pointer-events-auto max-w-2xl">
          <div className="hero-line flex items-center gap-3">
            <EyeMark size={40} scanning />
            <span className="eyebrow">{distributor}</span>
          </div>

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

          <p className="hero-line mt-7 max-w-xl text-lead text-text-muted">{problem}</p>

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
