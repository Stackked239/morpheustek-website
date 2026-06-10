import { Button } from "@/components/ui/Button";
import { site, primaryCta } from "@/lib/site";
import { products } from "@/lib/catalog";
import { CountUp } from "./CountUp";

/**
 * Aurora hero: three drifting blur blobs (screen-blended brand hues) over an
 * infinite perspective grid floor — the 21st.dev "shader hero" register built
 * from pure CSS. The readout strip counts up on first view (CountUp) and
 * renders final values for no-JS / reduced-motion.
 */
export function AuroraHero() {
  const stats = [
    { value: products.length, suffix: "", label: "instruments in the line" },
    { value: 270, suffix: "°", label: "safety scanning angle" },
    { value: 100, suffix: " m", label: "3D LiDAR range" },
    { value: 90, suffix: "", label: "days free on your floor" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      {/* aurora field */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-[-10%] top-[-18%] h-[55vh] w-[55vw] bg-brand-blue/50" />
        <div className="aurora-blob right-[-12%] top-[6%] h-[48vh] w-[44vw] bg-eye-warm/40 [animation-delay:-6s]" />
        <div className="aurora-blob bottom-[-30%] left-[24%] h-[50vh] w-[50vw] bg-accent/25 [animation-delay:-11s]" />
      </div>
      {/* grid floor */}
      <div aria-hidden className="grid-floor absolute inset-x-[-20%] bottom-0 -z-10 h-[46vh]" />

      <div className="mt-container flex min-h-[88svh] flex-col justify-center py-24">
        <p className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 font-mono text-anno-sm uppercase tracking-[0.16em] text-text-muted">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
          {site.distributor}
        </p>
        <h1 className="mt-7 max-w-4xl font-display text-display-xl font-bold text-text-strong">
          Robot perception,
          <br />
          under control.
        </h1>
        <p className="mt-6 max-w-xl text-lead text-text-muted">{site.oneLiner}</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button href={primaryCta.trial.href} size="lg">
            {primaryCta.trial.label}
          </Button>
          <Button href="/products" variant="ghost" size="lg">
            Open the line card
          </Button>
        </div>

        {/* glass readout strip */}
        <dl className="glass mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 rounded-xl px-7 py-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-figure font-bold text-text-strong">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-1 font-mono text-anno-sm uppercase tracking-[0.1em] text-text-subtle">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
