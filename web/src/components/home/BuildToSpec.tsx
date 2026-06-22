import Link from "next/link";
import { ArrowRight, Cable, Gauge, Wrench } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EyeIcon } from "@/components/brand/EyeIcon";

// ─────────────────────────────────────────────────────────────────────────────
// BUILT TO SPEC — "The Seam" homepage  (Phil's ask: surface the custom-solutions
// differentiator, which was buried — only in the footer, absent from the home).
//
// Rides the manufacturing-backing beat established just above in the Trust band:
// OEM/ODM manufacturing → therefore we can TAILOR the sensor (not just resell a
// fixed SKU) → start a trial. Claim + three concrete tailoring pillars (mirrored
// from /custom-solutions, same EyeIcon language) + a path to the full page. Light
// plate between the muted Trust band and the dark closing CTA. Server component;
// fully legible with no JS.
// ─────────────────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: Wrench,
    title: "Housing & mounting",
    body: "Custom enclosures, mounting, environmental protection, and form factors for your platform.",
  },
  {
    icon: Gauge,
    title: "Perception tuning",
    body: "Field of view, range, resolution, scan rate, and safety zones tuned to the application.",
  },
  {
    icon: Cable,
    title: "Cables & connectors",
    body: "Connectors, harnesses, and interfaces matched to your robot's wiring and I/O.",
  },
];

export function BuildToSpec() {
  return (
    <Section tone="default" id="custom" className="border-t border-border">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Built to your spec</Eyebrow>
          <h2 className="mt-5 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            Custom from housing to firmware.
          </h2>
          <p className="mt-5 text-lead text-text-muted">
            When off-the-shelf doesn&apos;t fit, we build to it. Backed by OEM/ODM laser-measurement
            manufacturing, MorpheusTEK tailors the sensor to your platform — then supports it into
            production. We build sensors; we don&apos;t just resell a fixed part number.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="flex flex-col items-start">
              <EyeIcon icon={p.icon} size={72} />
              <h3 className="mt-4 font-display text-h5 font-bold uppercase text-text-strong">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
            </div>
          ))}
        </div>

        <Link
          href="/custom-solutions"
          className="group mt-10 inline-flex items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-2"
        >
          Explore custom solutions
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </Container>
    </Section>
  );
}
