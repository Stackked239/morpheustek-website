import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta, site } from "@/lib/site";

/**
 * Closing panel: glass over a second, calmer aurora. One yellow CTA.
 */
export function GlassCta() {
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-[10%] top-[10%] h-[40vh] w-[40vw] bg-brand-blue/40" />
        <div className="aurora-blob bottom-[-20%] right-[5%] h-[45vh] w-[38vw] bg-eye-warm/30 [animation-delay:-8s]" />
      </div>
      <Container>
        <Reveal>
          <div className="glass mx-auto max-w-3xl rounded-2xl p-10 text-center md:p-14">
            <p className="eyebrow">{site.pillars[1]}</p>
            <h2 className="mt-5 font-display text-h1 font-bold text-text-strong">
              Put the stack on your robot. We&apos;ll wait 90 days.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lead text-text-muted">
              Run it in your aisles, your dust, your sunlight. If it doesn&apos;t earn the slot,
              send it back.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href={primaryCta.trial.href} size="lg">
                {primaryCta.trial.label}
              </Button>
              <Button href={primaryCta.engineer.href} variant="ghost" size="lg">
                {primaryCta.engineer.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
