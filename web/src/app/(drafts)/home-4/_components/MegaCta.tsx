import { Button } from "@/components/ui/Button";
import { primaryCta, site } from "@/lib/site";

/**
 * The closing block: navy field, the offer at billboard scale, and the page's
 * single yellow CTA. White type is allowed here — the field is navy, not yellow.
 */
export function MegaCta() {
  return (
    <section className="bg-mt-navy py-20 text-white md:py-28">
      <div className="mt-container mt-container-wide">
        <p className="font-mono text-anno-sm font-bold uppercase tracking-[0.2em] text-mt-cyan">
          The offer
        </p>
        <h2 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-white">
          Try it free.
          <br />
          90 days.
          <br />
          Your floor.
        </h2>
        <p className="mt-8 max-w-md text-lead text-mt-gray-light">
          No commitment. If the sensor doesn&apos;t earn its place on your robot, send it back.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Button
            href={primaryCta.trial.href}
            size="lg"
            className="rounded-none bg-mt-yellow px-10 text-mt-navy hover:bg-mt-yellow-bright hover:shadow-none"
          >
            {primaryCta.trial.label}
          </Button>
          <a
            href={`tel:${site.phoneHref}`}
            className="font-mono text-sm uppercase tracking-[0.12em] text-mt-cyan underline-offset-4 hover:underline"
          >
            or call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
