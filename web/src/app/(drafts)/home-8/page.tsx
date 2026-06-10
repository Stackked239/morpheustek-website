import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site, primaryCta } from "@/lib/site";
import { AssemblyScrolly } from "./_components/AssemblyScrolly";
import { KitHero } from "./_components/KitHero";

/* =============================================================================
   HOME-8 — "The Assembly" (scrollytelling product cinema)

   The homepage as an assembly sequence: a pinned stage on which the full
   perception stack builds itself, part by part, as the visitor scrolls four
   engineering steps. GSAP ScrollTrigger scrubs each part into its slot and
   draws the bus line that joins them. The deliberate contrast to home-2
   (editorial choreography): here the scroll IS the narrative, one continuous
   pinned scene instead of many sections.

   Discipline:
   - the four parts, their specs, and the step copy are all true catalog.ts
   - gsap runs only under prefers-reduced-motion: no-preference; the static
     DOM is the assembled end state (no-JS / crawlers see the finished stack)
   - one yellow CTA per viewport
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 8 · The Assembly",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant8() {
  return (
    <>
      {/* the overture: the kit, unboxed and tagged, waiting for the scroll */}
      <KitHero />

      {/* the pinned assembly sequence */}
      <AssemblyScrolly />

      {/* the close */}
      <section className="border-t border-border bg-bg-subtle">
        <Container className="py-20 text-center md:py-28">
          <h2 className="mx-auto max-w-2xl font-display text-h1 font-bold text-text-strong">
            Assembled. Integrated. On your floor in days.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lead text-text-muted">
            We spec it, ship it, and support it from North America — and you get 90 days to prove
            it on your own robot.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={primaryCta.trial.href} size="lg">
              {primaryCta.trial.label}
            </Button>
            <Button href={primaryCta.engineer.href} variant="ghost" size="lg">
              {primaryCta.engineer.label}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
