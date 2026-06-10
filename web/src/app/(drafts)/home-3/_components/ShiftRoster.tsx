import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct, productImage, formatPrice } from "@/lib/catalog";

/**
 * Scene 02:48 — the crew on shift. One real product per layer of the stack,
 * presented as a duty roster: role, unit, true key specs, price. Everything
 * rendered here is read from catalog.ts.
 */

const roster = [
  { role: "Protect", duty: "Stops for people", slug: "gs1-5-safety-lidar" },
  { role: "Navigate", duty: "Maps the building", slug: "lr-16f-100-3d-lidar" },
  { role: "Perceive", duty: "Sees what stereo misses", slug: "mrdvs-s10-rgbd-camera" },
  { role: "Think", duty: "Runs the whole stack", slug: "sintrones-ibox-602p-edge-ai" },
] as const;

export function ShiftRoster() {
  return (
    <section className="border-t border-border bg-bg-subtle py-16 md:py-24">
      <Container wide>
        <Reveal>
          <p className="font-mono text-anno-sm uppercase tracking-[0.18em] text-text-subtle">
            02:48 · on shift tonight
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-bold text-text-strong">
            Four roles. One stack. One partner.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-text-muted">
            Sensors alone don&apos;t ship robots. We staff the whole perception stack — and support it
            from North America.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {roster.map((r, i) => {
            const p = getProduct(r.slug);
            if (!p) return null;
            const img = productImage(p.slug);
            return (
              <Reveal key={p.slug} delay={i * 90}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition hover:border-border-strong"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-anno-sm uppercase tracking-[0.18em] text-brand-blue">
                      {`0${i + 1}`} · {r.role}
                    </span>
                    <span className="font-mono text-anno-sm text-text-subtle">{r.duty}</span>
                  </div>
                  {img && (
                    <div className="relative mt-5 h-36">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 45vw, 90vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <h3 className="mt-5 font-display text-h4 font-bold text-text-strong">{p.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{p.tagline}</p>
                  <dl className="mt-4 space-y-1.5 border-t border-border pt-4">
                    {p.keySpecs.slice(0, 3).map((s) => (
                      <div key={s.label} className="flex justify-between gap-3 font-mono text-anno-sm">
                        <dt className="text-text-subtle">{s.label}</dt>
                        <dd className="text-right text-text">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-auto pt-5 font-mono text-anno font-bold text-text-strong">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
