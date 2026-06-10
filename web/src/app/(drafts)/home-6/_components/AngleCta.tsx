import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";

/**
 * Closing band on the brand 60° angle panel — yellow field, navy ink (brand
 * rule), navy CTA since the yellow IS the surface.
 */
export function AngleCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="angle-panel bg-accent py-12 pl-[18%] pr-10 text-accent-text md:py-16 md:pr-16">
            <h2 className="max-w-2xl font-display text-h1 font-bold text-accent-text">
              Point it at your hardest aisle.
            </h2>
            <p className="mt-4 max-w-xl text-lead font-semibold">
              90 days, free, on your robot. If it can&apos;t see what you need it to see, send it
              back.
            </p>
            <div className="mt-8">
              <Button
                href={primaryCta.trial.href}
                size="lg"
                className="bg-mt-navy text-mt-yellow hover:bg-mt-navy-900"
              >
                {primaryCta.trial.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
