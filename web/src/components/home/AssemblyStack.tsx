"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { getProduct, productImage } from "@/lib/catalog";
import { cn } from "@/lib/cn";

/**
 * The assembly — the four-step perception stack the client raved about, now
 * pre-configured per robot type.
 *
 * The loved narrative is verbatim: 01 Protect → 02 Map → 03 See → 04 Think.
 * Above the stack sits Austin's segmented selector: pick AMR / AGV / Humanoid /
 * Mining and the four parts re-pick to that robot, animating in with a gsap
 * stagger (matchMedia-gated). The safety floor (GS1-5) is shared across every
 * build — it's the one part that never changes; the rest do, because "it's
 * always going to be different."
 *
 * Authored FINAL-STATE-FIRST: the DOM renders the default (AMR) assembly fully
 * assembled. gsap only animates the parts INTO a state they already occupy, so
 * SSR / no-JS / reduced-motion / crawlers read a complete, readable section, and
 * tabs still re-pick the parts with no motion. Tabs are real <button>s with
 * aria-pressed, keyboard-operable, with a visible focus ring.
 */

type StepRole = "Protect" | "Map" | "See" | "Think";

interface StepFrame {
  /** catalog slug — drives name + image + the /products link */
  slug: string;
  /** one real spec line, lifted from catalog.ts keySpecs (never invented) */
  spec: string;
}

interface StepCopy {
  role: StepRole;
  /** the verbatim, loved per-step claim */
  claim: string;
}

interface Assembly {
  id: string;
  label: string;
  /** the robot in one engineer-credible line */
  blurb: string;
  /** four parts, indexed to the four steps below */
  parts: [StepFrame, StepFrame, StepFrame, StepFrame];
}

// The four-step spine — copy is fixed across every assembly (the part beneath it
// is what changes). Kept verbatim from the approved AssemblyScrolly.
const STEPS: readonly StepCopy[] = [
  { role: "Protect", claim: "The safety floor goes in first." },
  { role: "Map", claim: "Then the world gets geometry." },
  { role: "See", claim: "Close range gets eyes." },
  { role: "Think", claim: "And one brain runs it all." },
] as const;

// Per-step framing copy — why this part, for this step. Stable across assemblies.
const STEP_BODY: Record<StepRole, string> = {
  Protect:
    "A 270° functional-safety scanner certified to stop for people — the same safety class as SICK, at roughly half to a third of the price. People stop being a risk calculation.",
  Map: "The robot stops inferring the building and starts measuring it — full geometry, out to range.",
  See: "Depth at arm's length: pallet pockets, bins, low obstacles, and the people who step in close.",
  Think:
    "Every sensor above lands here and leaves as one feed your software already understands — every room you just walked through, in one box.",
};

// ── The pre-configured assemblies ───────────────────────────────────────────
// Every slug + spec below is a real catalog record (verified against catalog.ts).
// GS1-5 is the shared safety floor on every build; the rest re-pick to the robot.
const ASSEMBLIES: readonly Assembly[] = [
  {
    id: "amr",
    label: "AMR",
    blurb: "Indoor autonomous mobile robot — aisles, docks, and people, all day.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: "270° · Type 3 / SIL2 / PL d · 5 m protective" },
      { slug: "lr-16f-100-3d-lidar", spec: "16 ch · 360° × 30° · 100 m · IP66" },
      { slug: "mrdvs-s10-rgbd-camera", spec: "dToF RGBD · 0.3–8 m · 120° × 80° · ≤ 3 cm" },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 2× PoE + 2× GMSL-2 · IP66" },
    ],
  },
  {
    id: "agv",
    label: "AGV",
    blurb: "Fixed-route guided vehicle — path-following at fleet scale, cost down.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: "270° · Type 3 / SIL2 / PL d · 5 m protective" },
      { slug: "lr-1f-2d-lidar", spec: "360° FOV · 50 m · 10–25 Hz · 2D point cloud" },
      { slug: "lr-f240-solid-state-lidar", spec: "Solid-state · 72° × 58° · 10 m forward avoidance" },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
  {
    id: "humanoid",
    label: "Humanoid",
    blurb: "Legged platform — stairs, terrain, and close-quarters human spaces.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: "270° · Type 3 / SIL2 / PL d · 5 m protective" },
      { slug: "lr-16f-100-3d-lidar", spec: "16 ch · 360° × 30° · 100 m · IP66" },
      { slug: "mrdvs-s11-rgbd-camera", spec: "dToF RGBD · 140° × 56° · 0.1–6 m · ±1 cm @ 2 m" },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 2× PoE + 2× GMSL-2 · IP66" },
    ],
  },
  {
    id: "mining",
    label: "Mining",
    blurb: "Heavy outdoor autonomy — direct sun, dust, and long sightlines.",
    parts: [
      { slug: "gs1-5-safety-lidar", spec: "270° · Type 3 / SIL2 / PL d · 5 m protective" },
      { slug: "vss-50-solid-state-3d-lidar", spec: "120° × 50° · 540k pts/s · 100,000 lux · IP67" },
      { slug: "mrdvs-s10-ultra-rgbd-camera", spec: "dToF RGBD + 200 Hz IMU · 0.2–42 m · IP67" },
      { slug: "sintrones-ibox-602p-edge-ai", spec: "Jetson Orin NX · 9–60 V DC · IP66 fanless" },
    ],
  },
] as const;

const DEFAULT_ID = ASSEMBLIES[0].id; // AMR — the no-JS / SSR state

function runAssemblyBuildIn(parts: HTMLElement[]) {
  if (!parts.length) return;
  if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  gsap.killTweensOf(parts);
  gsap.fromTo(
    parts,
    { opacity: 0, y: 48, scale: 0.94 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.14,
      clearProps: "transform,opacity",
      overwrite: true,
    },
  );
}

function StepCard({
  index,
  step,
  part,
}: {
  index: number;
  step: StepCopy;
  part: StepFrame;
}) {
  const product = getProduct(part.slug);
  const img = productImage(part.slug);
  // Safety badge stays strictly data-driven — only the GS1-5 carries certifications.
  const isCertified = Boolean(product?.certifications?.length);
  const seq = `0${index + 1}`;

  return (
    <li
      data-step
      className="relative flex items-stretch gap-5 md:gap-7"
    >
      {/* the bus line — the spine the whole stack hangs off (lit per step) */}
      <div className="relative w-9 shrink-0 sm:w-11" aria-hidden>
        {index > 0 && (
          <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-border" />
        )}
        {index < STEPS.length - 1 && (
          <span className="absolute bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-border" />
        )}
        <span className="absolute left-1/2 top-[1.65rem] grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-blue bg-bg font-mono text-[10px] font-bold tracking-[0.04em] text-brand-blue">
          {seq}
        </span>
      </div>

      {/* the part — a non-white branded tile that re-picks per assembly */}
      <article
        data-part
        className={cn(
          "assembly-part group flex min-w-0 flex-1 flex-col gap-5 rounded-lg border border-border bg-bg-muted p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6",
          "transition-colors duration-200 hover:border-border-strong",
        )}
      >
        {/* product image on a dark, branded plate (never white) */}
        <div className="relative grid aspect-[4/3] w-full shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-mt-navy-900 p-3 sm:aspect-square sm:w-32 md:w-36">
          <span
            aria-hidden
            className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.14]"
          />
          {img ? (
            <Image
              src={img}
              alt={product?.name ?? step.role}
              fill
              sizes="(min-width: 768px) 144px, 40vw"
              className="object-contain"
            />
          ) : (
            <span className="font-mono text-anno-sm uppercase tracking-[0.16em] text-text-subtle">
              Illustrative
            </span>
          )}
        </div>

        {/* the part's identity + the step it serves */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-anno-sm uppercase tracking-[0.16em] text-brand-blue">
              {seq} · {step.role}
            </span>
            {isCertified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-accent-text">
                SIL2 · Type 3 · PL d
              </span>
            )}
          </div>

          {/* the loved claim — the line Tom raved about ("that's so good") */}
          <h3 className="mt-2 font-display text-h4 font-bold leading-tight text-text-strong">
            {step.claim}
          </h3>

          {/* the part that fulfills it — name + one real spec line */}
          <p className="mt-2 font-mono text-anno-sm uppercase tracking-[0.1em] text-text">
            {product?.name ?? step.role}
            <span className="text-text-subtle"> · {part.spec}</span>
          </p>

          <p className="mt-3 max-w-prose text-anno text-text-muted">
            {STEP_BODY[step.role]}
          </p>

          <Link
            href={`/products/${part.slug}`}
            className="mt-4 inline-flex w-fit items-center gap-1 font-semibold text-brand-blue underline-offset-4 hover:underline focus-visible:underline"
          >
            Inspect this part
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    </li>
  );
}

export function AssemblyStack() {
  // gsap scope lives on an inner div (Container is a plain wrapper and doesn't
  // forward a ref) — it still encloses every [data-part] in the stack.
  const scope = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLOListElement>(null);
  const [activeId, setActiveId] = useState<string>(DEFAULT_ID);
  const [revealKey, setRevealKey] = useState(0); // bumped on viewport re-entry → replays the build-in

  const active = ASSEMBLIES.find((a) => a.id === activeId) ?? ASSEMBLIES[0];

  // Replay-on-scroll: re-fire the build-in each time the section re-enters.
  useEffect(() => {
    const node = scope.current;
    if (!node) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealKey((k) => k + 1); },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Tab change / scroll re-entry: animate after React commits the stack DOM.
  useLayoutEffect(() => {
    if (revealKey === 0) return;
    const parts = stackRef.current?.querySelectorAll<HTMLElement>(".assembly-part");
    if (!parts?.length) return;
    runAssemblyBuildIn(Array.from(parts));
    return () => {
      gsap.set(parts, { clearProps: "all", opacity: 1 });
    };
  }, [activeId, revealKey]);

  const selectPlatform = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setRevealKey((k) => k + 1);
  };

  // overflow-x-clip (not -hidden) contains the gsap x build-in WITHOUT making a
  // scroll container — so the sticky selector below can pin to the page.
  return (
    <Section tone="subtle" className="relative overflow-x-clip !bg-bg-muted">
      {/* seam blend — soft tonal lift at the top, meeting RangeLedger's matching bottom lift so
          the two muted bands separate via one soft valley instead of a hard same-tone seam. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,var(--bg),transparent)]" aria-hidden />
      <Container className="relative">
        <div ref={scope}>
        {/* ── section header ──────────────────────────────────────────────── */}
        <div className="max-w-2xl">
          <Eyebrow>The assembly</Eyebrow>
          <h2 className="mt-4 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            Four steps to sight you can certify.
          </h2>
          <p className="mt-5 text-lead text-text-muted">
            Protect, map, see, think — the same four-layer stack on every robot. Pick the
            platform and the parts re-pick themselves. It&apos;s always going to be different;
            the safety floor never is.
          </p>
        </div>

        {/* ── the segmented selector (Austin's idea) ──────────────────────────
            Sticky: stays pinned just below the 72px site header while you scroll
            the parts, so you can switch platforms without scrolling back up. Its
            containing block is the scope div, so it releases at the bottom of the
            whole component. bg-bg is opaque so parts scroll cleanly underneath. */}
        <div
          role="group"
          aria-label="Choose a robot platform"
          className="sticky top-20 z-30 mt-9 inline-flex flex-wrap gap-1.5 rounded-xl border border-border bg-bg p-1.5 shadow-md"
        >
          {ASSEMBLIES.map((a) => {
            const selected = a.id === activeId;
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectPlatform(a.id)}
                className={cn(
                  "rounded-lg px-4 py-2 font-mono text-anno-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  selected
                    ? "bg-surface text-text-strong shadow-sm ring-1 ring-border-strong"
                    : "text-text-muted hover:bg-bg-muted hover:text-text-strong",
                )}
              >
                {a.label}
              </button>
            );
          })}
        </div>

        {/* the chosen platform, in one line — live-updates, announced politely */}
        <p
          aria-live="polite"
          className="mt-4 font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle"
        >
          <span className="text-text-muted">Configured for {active.label}</span> · {active.blurb}
          <span className="sr-only">
            {" "}
            — {active.parts.map((p) => getProduct(p.slug)?.model).filter(Boolean).join(", ")}
          </span>
        </p>

        {/* ── the stack — remounted per platform so parts swap cleanly, then
            stagger in via runBuildIn after React commits the new DOM ── */}
        <ol ref={stackRef} key={activeId} className="mt-10 flex flex-col gap-5 md:gap-6">
          {STEPS.map((step, i) => (
            <StepCard key={step.role} index={i} step={step} part={active.parts[i]} />
          ))}
        </ol>

        {/* ── output line + section CTA (NOT yellow — hero/closing own that) ─ */}
        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle">
            Output: one integrated feed → your stack. Thirty years of measurement
            instruments behind every part.
          </p>
          <Button href="/full-stack-perception" variant="ghost" size="lg">
            See the full-stack approach
          </Button>
        </div>
        </div>
      </Container>
    </Section>
  );
}
