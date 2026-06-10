import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site, primaryCta } from "@/lib/site";

/**
 * Scene 06:00 — after a full page of night, the layout breaks into daylight
 * (default light tokens; this component sits OUTSIDE the page's .dark wrapper).
 * The pillars read as the morning report, and the trial CTA lands as sunrise.
 */
export function DawnBand() {
  return (
    <section className="border-t border-border bg-bg py-16 md:py-24">
      <Container>
        <Reveal>
          <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-text-subtle">
            06:00 · shift complete
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-h2 font-bold text-text-strong">
            Now run that night on your own floor — free, for 90 days.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {site.pillars.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="border-t-2 border-border-strong pt-4">
                <span className="font-mono text-anno-sm text-brand-blue">{`0${i + 1}`}</span>
                <p className="mt-2 text-lead text-text">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center gap-4">
            <Button href={primaryCta.trial.href} size="lg">
              {primaryCta.trial.label}
            </Button>
            <Button href={primaryCta.meeting.href} variant="ghost" size="lg">
              {primaryCta.meeting.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
