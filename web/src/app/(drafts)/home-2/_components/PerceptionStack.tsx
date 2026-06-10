"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Radar, Camera, ShieldCheck, Cpu, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Layer = { icon: LucideIcon; title: string; body: string };

// Top → bottom of the physical stack (sensors up high, brain at the base).
const layers: Layer[] = [
  { icon: Radar, title: "LiDAR — 2D & 3D", body: "Navigation, mapping, obstacle detection, and protective zones — mini-scanners to 16-line 3D." },
  { icon: Camera, title: "3D cameras", body: "dToF RGBD that returns valid depth on the black, reflective, and textureless surfaces stereo cameras miss." },
  { icon: ShieldCheck, title: "Safety sensing", body: "Type 3 / SIL2 / PL d safety LiDAR for personnel-protection stop functions — the same class as SICK." },
  { icon: Cpu, title: "Edge compute", body: "Rugged Jetson and Ryzen boxes that run the perception stack on top of our sensors, on the robot." },
];

/**
 * Section 3 — the pinned, scroll-scrubbed "perception-stack assembler".
 * Scroll pins the stage; each sensor slab locks onto the AMR base in turn while
 * the matching step lights up and the progress rail fills.
 *
 * Reduced motion / no-JS: no pin, no scrub — the static DOM already shows the
 * fully-assembled stack with every step lit. Same content, zero animation.
 */
export function PerceptionStack() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slabs = gsap.utils.toArray<HTMLElement>(".stack-slab", scope.current);
        const steps = gsap.utils.toArray<HTMLElement>(".stack-step", scope.current);
        if (!slabs.length) return;

        // initial (pre-scroll) state — only applied when motion is allowed
        gsap.set(slabs, { xPercent: -22, opacity: 0 });
        gsap.set(steps, { opacity: 0.35 });
        gsap.set(".stack-progress", { scaleY: 0, transformOrigin: "top" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=" + slabs.length * 360,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        slabs.forEach((slab, i) => {
          tl.to(slab, { xPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }, i)
            .to(steps[i], { opacity: 1, duration: 0.5 }, "<")
            .to(".stack-progress", { scaleY: (i + 1) / slabs.length, duration: 1, ease: "none" }, "<");
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="stack" className="dark relative flex min-h-screen items-center overflow-hidden bg-bg py-20">
      <div className="circuit-motif pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          {/* ---- LEFT: the assembling stack ---- */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto flex max-w-sm flex-col gap-3">
              {layers.map((l) => (
                <div
                  key={l.title}
                  className="stack-slab flex items-center gap-4 border border-border bg-surface-raised p-4 shadow-[var(--shadow-lg)]"
                  style={{ clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)" }}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-bg-muted text-accent">
                    <l.icon className="size-5" />
                  </span>
                  <span className="font-display text-h5 font-bold text-text-strong">{l.title}</span>
                </div>
              ))}

              {/* AMR base */}
              <div className="mt-1">
                <div
                  className="flex h-12 items-center justify-center bg-accent font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent-text"
                  style={{ clipPath: "polygon(0 0, 100% 0, 94% 100%, 6% 100%)" }}
                >
                  AMR · mobile robot
                </div>
                <div className="mx-auto flex w-3/4 justify-between px-6">
                  <span className="mt-2 size-7 rounded-full border-4 border-text-subtle" />
                  <span className="mt-2 size-7 rounded-full border-4 border-text-subtle" />
                </div>
              </div>
            </div>
          </div>

          {/* ---- RIGHT: narrative + stepped layers ---- */}
          <div className="order-1 lg:order-2">
            <Eyebrow>The full stack</Eyebrow>
            <h2 className="mt-4 font-display text-h2 font-extrabold uppercase leading-[1.02] tracking-tight text-text-strong">
              One partner for the whole perception stack.
            </h2>
            <p className="mt-5 max-w-md text-lead text-text-muted">
              LiDAR, 3D cameras, safety sensing, and edge compute — selected, sourced, and integrated to work together.
              Watch it come together.
            </p>

            <div className="mt-9 flex gap-5">
              {/* progress rail */}
              <div className="relative w-[3px] shrink-0 rounded bg-border" aria-hidden>
                <div className="stack-progress absolute inset-x-0 top-0 h-full rounded bg-accent" />
              </div>

              <ol className="flex-1 space-y-5">
                {layers.map((l, i) => (
                  <li key={l.title} className="stack-step">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm font-bold text-accent">{`0${i + 1}`}</span>
                      <h3 className="font-display text-h5 font-bold text-text-strong">{l.title}</h3>
                    </div>
                    <p className="mt-1 pl-8 text-sm leading-relaxed text-text-muted">{l.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-9 pl-8">
              <Button href="/full-stack-perception" variant="ghost" size="md">
                See how the stack fits together
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
