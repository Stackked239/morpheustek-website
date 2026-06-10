"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { getProduct, productImage, type Product } from "@/lib/catalog";

/**
 * The tool. Three segmented questions on the left; a live "build sheet" on
 * the right. Every rule below maps to a true catalog fact — the same logic an
 * engineer applies on a discovery call. Defaults are pre-selected so the
 * server-rendered page already shows a complete stack (no empty-tool state).
 */

type Env = "indoor" | "outdoor" | "hazardous";
type Job = "navigate" | "map3d" | "close";

const envOptions: { value: Env; label: string; hint: string }[] = [
  { value: "indoor", label: "Indoor floor", hint: "warehouse · plant · retail" },
  { value: "outdoor", label: "Outdoors / bright sun", hint: "yards · agriculture · campus" },
  { value: "hazardous", label: "Explosive atmosphere", hint: "ATEX-class environments" },
];

const jobOptions: { value: Job; label: string; hint: string }[] = [
  { value: "navigate", label: "Navigate a floor", hint: "SLAM · obstacle stop" },
  { value: "map3d", label: "Full 3D perception", hint: "volumetric mapping" },
  { value: "close", label: "Close-range handling", hint: "pallets · bins · picking" },
];

type StackPick = { product: Product; why: string };

function buildStack(env: Env, people: boolean, job: Job): StackPick[] {
  const picks: StackPick[] = [];
  const add = (slug: string, why: string) => {
    const p = getProduct(slug);
    if (p) picks.push({ product: p, why });
  };

  // primary navigation / perception sensor
  if (env === "hazardous") {
    add("lr-16fis-explosion-proof-3d-lidar", "The 16-line 3D platform, certified for explosive atmospheres.");
  } else if (env === "outdoor") {
    add("vss-50-solid-state-3d-lidar", "Solid-state, no moving parts — and shrugs off 100,000 lux of direct sunlight.");
  } else if (job === "map3d") {
    add("lr-16f-100-3d-lidar", "16 channels, 360° × 30°, 100 m — dense geometry for mapping and localization.");
  } else {
    add("lr-1f-2d-lidar", "Full-circle 360° 2D scanning at 50 m — the workhorse of indoor SLAM.");
  }

  // people protection
  if (people) {
    add("gs1-5-safety-lidar", "Type 3 · SIL2 · PL d — a certified stop function, same safety class as SICK.");
  }

  // close-range depth
  if (job === "close") {
    add("percipio-gm465-dual-mode-depth-camera", "Switchable high-speed or high-accuracy depth for pockets, bins, and low obstacles.");
  }

  // the brain, always
  add("sintrones-ibox-602p-edge-ai", "Fanless Jetson Orin NX, IP66 — every sensor above leaves here as one feed.");

  return picks;
}

// physical toggle: unselected sits proud on a hard shadow, selected is
// pressed flat in navy — the same top-left light as the rest of the system
const chip = (active: boolean) =>
  `relative flex-1 cursor-pointer border-2 px-4 py-3 text-left transition-all duration-150 ${
    active
      ? "translate-x-[2px] translate-y-[2px] border-mt-navy bg-mt-navy text-mt-yellow shadow-none"
      : "border-border bg-surface text-text shadow-[3px_4px_0_0_rgba(15,50,108,0.12)] hover:border-border-strong hover:shadow-[3px_4px_0_0_rgba(15,50,108,0.22)]"
  }`;

const check = (
  <span
    aria-hidden
    className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center bg-mt-yellow font-mono text-[11px] font-bold text-mt-navy"
  >
    ✓
  </span>
);

export function Configurator() {
  const [env, setEnv] = useState<Env>("indoor");
  const [people, setPeople] = useState(true);
  const [job, setJob] = useState<Job>("navigate");

  const stack = useMemo(() => buildStack(env, people, job), [env, people, job]);
  const trialCount = stack.filter((s) => s.product.trial).length;

  return (
    <section className="py-14 md:py-20">
      <Container wide className="grid gap-12 lg:grid-cols-[5fr_6fr]">
        {/* ── the questions, on a numbered spine ────────────────────────── */}
        <div className="relative space-y-12 lg:pl-14">
          {/* the spine: a rule connecting the three stations */}
          <span aria-hidden className="absolute bottom-10 left-5 top-2 hidden w-px bg-border lg:block" />

          <fieldset className="relative">
            <span aria-hidden className="absolute -left-14 top-0 hidden h-10 w-10 place-items-center border-2 border-mt-navy bg-surface font-display text-h4 font-bold text-text-strong lg:grid">
              1
            </span>
            <legend className="font-display text-h3 font-bold text-text-strong">Where does it run?</legend>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {envOptions.map((o) => (
                <label key={o.value} className={chip(env === o.value)}>
                  {env === o.value && check}
                  <input
                    type="radio"
                    name="env"
                    value={o.value}
                    checked={env === o.value}
                    onChange={() => setEnv(o.value)}
                    className="sr-only"
                  />
                  <span className="block font-display text-base font-bold">{o.label}</span>
                  <span className={`block font-mono text-anno-sm ${env === o.value ? "text-mt-yellow/70" : "text-text-subtle"}`}>
                    {o.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="relative">
            <span aria-hidden className="absolute -left-14 top-0 hidden h-10 w-10 place-items-center border-2 border-mt-navy bg-surface font-display text-h4 font-bold text-text-strong lg:grid">
              2
            </span>
            <legend className="font-display text-h3 font-bold text-text-strong">Do people share the space?</legend>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {[true, false].map((v) => (
                <label key={String(v)} className={chip(people === v)}>
                  {people === v && check}
                  <input
                    type="radio"
                    name="people"
                    checked={people === v}
                    onChange={() => setPeople(v)}
                    className="sr-only"
                  />
                  <span className="block font-display text-base font-bold">
                    {v ? "Yes — people nearby" : "No — caged or segregated"}
                  </span>
                  <span className={`block font-mono text-anno-sm ${people === v ? "text-mt-yellow/70" : "text-text-subtle"}`}>
                    {v ? "needs a certified stop function" : "standard obstacle detection"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="relative">
            <span aria-hidden className="absolute -left-14 top-0 hidden h-10 w-10 place-items-center border-2 border-mt-navy bg-surface font-display text-h4 font-bold text-text-strong lg:grid">
              3
            </span>
            <legend className="font-display text-h3 font-bold text-text-strong">What&apos;s the perception job?</legend>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {jobOptions.map((o) => (
                <label key={o.value} className={chip(job === o.value)}>
                  {job === o.value && check}
                  <input
                    type="radio"
                    name="job"
                    value={o.value}
                    checked={job === o.value}
                    onChange={() => setJob(o.value)}
                    className="sr-only"
                  />
                  <span className="block font-display text-base font-bold">{o.label}</span>
                  <span className={`block font-mono text-anno-sm ${job === o.value ? "text-mt-yellow/70" : "text-text-subtle"}`}>
                    {o.hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="max-w-md font-mono text-anno-sm leading-relaxed text-text-subtle">
            Rules of thumb, not a quote — your aisle widths, speeds, and duty cycle move the
            answer. That&apos;s what the call is for.
          </p>
        </div>

        {/* ── the build sheet: a work-order document, pinned and tilted ─── */}
        <aside aria-live="polite" className="lg:sticky lg:top-24 lg:self-start">
          <div className="booth-object-on-white -rotate-[0.6deg] border-2 border-mt-navy bg-surface transition-transform duration-300 hover:rotate-0">
            <header className="flex items-center justify-between gap-4 border-b-2 border-mt-navy px-6 py-3">
              <div>
                <span className="block font-display text-h4 font-bold text-text-strong">Build sheet</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-text-subtle">
                  doc MT-BS-01 · {stack.length} line items · recalculated live
                </span>
              </div>
              {/* barcode block — print furniture, pure CSS */}
              <span
                aria-hidden
                className="h-9 w-24 shrink-0 [background:repeating-linear-gradient(90deg,var(--text-strong)_0_2px,transparent_2px_5px,var(--text-strong)_5px_6px,transparent_6px_10px)]"
              />
            </header>

            <ul>
              {stack.map(({ product, why }, i) => {
                const img = productImage(product.slug);
                return (
                  <li
                    key={product.slug}
                    className="animate-[sheet-in_0.45s_var(--ease-soft)_both] border-b border-border last:border-b-0"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <Link href={`/products/${product.slug}`} className="group flex items-center gap-5 px-6 py-4 transition-colors hover:bg-bg-subtle">
                      <span className="font-mono text-anno-sm text-text-subtle">{`0${i + 1}`}</span>
                      <div className="relative h-16 w-20 shrink-0">
                        {img ? (
                          <Image src={img} alt={product.name} fill sizes="120px" className="object-contain" />
                        ) : (
                          <span className="absolute inset-0 grid place-items-center border border-border font-mono text-[10px] uppercase text-text-subtle">
                            {product.model}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-h5 font-bold text-text-strong group-hover:text-brand-blue">
                          {product.name}
                          {product.trial && (
                            <span className="ml-2 align-middle font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-success">
                              90-day trial
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm leading-snug text-text-muted">{why}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <footer className="relative border-t-2 border-mt-navy px-6 py-5">
              {/* rubber stamp, struck when the stack qualifies */}
              {trialCount > 0 && (
                <span
                  aria-hidden
                  className="absolute -top-4 right-5 rotate-[4deg] border-[3px] border-success px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-success opacity-85"
                >
                  90-day trial · approved
                </span>
              )}
              <p className="font-mono text-anno-sm text-text-muted">
                {trialCount > 0
                  ? `${trialCount} of ${stack.length} items eligible for the free 90-day trial.`
                  : "Ask us about evaluation options for this stack."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-a-meeting?intent=quote"
                  className="inline-flex h-12 items-center rounded-md bg-accent px-6 font-semibold text-accent-text transition hover:bg-accent-hover"
                >
                  Quote this exact stack
                </Link>
                <Link href="/book-a-meeting?intent=engineer" className="font-semibold text-brand-blue underline-offset-4 hover:underline">
                  Sanity-check it with an engineer
                </Link>
              </div>
            </footer>
          </div>
        </aside>
      </Container>
    </section>
  );
}
