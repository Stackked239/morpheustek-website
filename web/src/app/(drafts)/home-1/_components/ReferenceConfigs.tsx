import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { applications, getProduct } from "@/lib/catalog";
import { ClauseHeader } from "./ClauseHeader";

/* §05 — Reference Configurations
   Four platform rows, each resolving to a recommended sensor set with model
   chips linking into the catalog. Stacked ruled rows — no cards, no
   accordion, fully readable without JS. */

const PLATFORMS = ["amr", "agv", "autonomous-forklift", "warehouse-logistics"] as const;

export function ReferenceConfigs() {
  const configs = PLATFORMS.map((slug) => applications.find((a) => a.slug === slug)!);

  return (
    <section className="bg-bg-subtle py-24 md:py-28">
      <Container>
        <ClauseHeader
          index="05"
          eyebrow="Reference configurations"
          title="Proven layouts for your platform."
          lead="Start from the sensor set already running on machines like yours, then adjust against your own requirements."
        />

        <div className="mt-12">
          {configs.map((app, i) => (
            <div
              key={app.slug}
              className="grid gap-4 border-b border-border py-8 lg:grid-cols-[1fr_2fr] lg:gap-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="tnum font-mono text-anno-sm text-brand-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display-industrial text-h4 font-bold uppercase text-text-strong">
                  {app.title}
                </h3>
              </div>
              <div>
                <p className="text-sm text-text-muted">{app.pain}</p>
                <p className="mt-3 max-w-xl text-base text-text">{app.fit}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {app.sensors.map((slug) => {
                    const p = getProduct(slug);
                    if (!p) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/products/${slug}`}
                          className="inline-block border border-border px-3 py-1.5 font-mono text-anno-sm uppercase text-text transition-colors hover:border-border-strong hover:text-brand-blue"
                        >
                          {p.model}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/applications"
          className="mt-10 inline-block font-semibold text-brand-blue underline-offset-4 hover:underline"
        >
          All 8 applications →
        </Link>
      </Container>
    </section>
  );
}
