import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * The three pillars as a sticky card stack: each card pins below the header
 * and recedes (scale + fade, CSS scroll-driven .stack-card) as the next one
 * slides over it. Without animation-timeline support the cards simply stack
 * and scroll — still a complete layout.
 */

const proofs = [
  { fact: "GS1-5 · Type 3 · SIL2 · PL d · 5 m protective field", href: "/compare/sick-alternative-lidar", link: "See the SICK comparison" },
  { fact: "Every OLEI sensor · no commitment · your environment", href: "/book-a-meeting?intent=trial", link: "Start the clock" },
  { fact: "LiDAR + cameras + safety + edge compute + NA support", href: "/full-stack-perception", link: "Tour the full stack" },
] as const;

export function StackedPillars() {
  return (
    <section className="bg-bg-subtle py-16 md:py-24">
      <Container>
        <p className="eyebrow">The three lines every deal is won on</p>
        <div className="mt-8 space-y-6">
          {site.pillars.map((pillar, i) => (
            <article
              key={i}
              className="stack-card sticky top-24 overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-lg md:p-12"
            >
              <span className="font-mono text-anno-sm uppercase tracking-[0.2em] text-brand-blue">
                {`0${i + 1}`} / 03
              </span>
              <p className="mt-4 max-w-3xl font-display text-h2 font-bold text-text-strong">
                {pillar}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <span className="font-mono text-anno-sm text-text-subtle">{proofs[i].fact}</span>
                <Link href={proofs[i].href} className="font-semibold text-brand-blue underline-offset-4 hover:underline">
                  {proofs[i].link} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
