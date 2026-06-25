import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { getProduct, productImage } from "@/lib/catalog";

/**
 * The overture: the four parts knolled on a drafting-grid bench, each tagged
 * with its sequence number, around a dashed assembly target. The hero shows
 * the kit; the scroll builds it. Parts drift in staggered via <Reveal>.
 */

const kit = [
  { slug: "gs1-5-safety-lidar", tag: "01 · Protect", pos: "left-[4%] top-[6%] -rotate-3", w: "w-[34%]" },
  { slug: "lr-16f-100-3d-lidar", tag: "02 · Map", pos: "right-[6%] top-[10%] rotate-2", w: "w-[30%]" },
  { slug: "mrdvs-s11-rgbd-camera", tag: "03 · See", pos: "bottom-[10%] left-[8%] rotate-1", w: "w-[32%]" },
  { slug: "sintrones-ibox-602p-edge-ai", tag: "04 · Think", pos: "bottom-[6%] right-[4%] -rotate-2", w: "w-[34%]" },
] as const;

export function KitHero() {
  return (
    <section className="overflow-hidden border-b border-border bg-bg-subtle">
      <Container wide className="grid items-center gap-10 py-16 lg:min-h-[78svh] lg:grid-cols-[6fr_5fr] lg:py-12">
        {/* the words */}
        <div>
          <p className="eyebrow">{site.distributor}</p>
          <h1 className="mt-4 max-w-3xl font-display text-display-xl font-bold text-text-strong">
            Four parts.
            <br />
            One sense of sight.
          </h1>
          <p className="mt-5 max-w-xl text-lead text-text-muted">
            A robot doesn&apos;t buy sensors, it needs a stack. The kit is on the bench — scroll,
            and watch us build it.
          </p>
          <p className="mt-10 font-mono text-anno-sm uppercase tracking-[0.18em] text-text-subtle">
            ↓ keep scrolling — assembly in progress
          </p>
        </div>

        {/* the bench: drafting grid, knolled parts, dashed assembly target */}
        <div className="draft-grid relative aspect-[5/4] rounded-lg border border-border bg-surface">
          {/* registration marks at the sheet corners */}
          <span aria-hidden className="reg-mark left-3 top-3" />
          <span aria-hidden className="reg-mark right-3 top-3" />
          <span aria-hidden className="reg-mark bottom-3 left-3" />
          <span aria-hidden className="reg-mark bottom-3 right-3" />

          {/* the target the scroll will fill */}
          <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-2 border-dashed border-brand-blue/50">
            <span className="px-3 text-center font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue">
              Assembly
              <br />
              seq 01–04
            </span>
          </div>

          {/* the knolled parts */}
          {kit.map((k, i) => {
            const p = getProduct(k.slug);
            const img = p && productImage(p.slug);
            if (!p || !img) return null;
            return (
              <Reveal key={k.slug} delay={150 + i * 120} className={`absolute ${k.pos} ${k.w}`}>
                <div className="group">
                  {/* specimen card: uniform white plate under every part */}
                  <div className="border border-border bg-white p-2 shadow-[4px_6px_14px_-4px_rgba(10,35,80,0.18)] transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        priority={i < 2}
                        sizes="(min-width: 1024px) 16vw, 36vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-center">
                    <span className="inline-block border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                      {k.tag} · {p.model}
                    </span>
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
