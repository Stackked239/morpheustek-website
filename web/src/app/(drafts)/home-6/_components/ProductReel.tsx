import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { products, productImage, getCategory } from "@/lib/catalog";

/**
 * Horizontal snap reel of the line. The progress rule under the heading is
 * bound to the reel's own scroll position with a named CSS scroll-timeline —
 * zero JS. Browsers without support just don't show progress.
 */
export function ProductReel() {
  const featured = products.filter((p) => productImage(p.slug)).slice(0, 9);

  return (
    <section className="overflow-hidden border-y border-border bg-bg-subtle py-16 md:py-24">
      <Container wide>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-h2 font-bold text-text-strong">The instruments.</h2>
            <span className="font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle">
              scroll sideways →
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-bg-muted">
            <div className="reel-progress h-px bg-brand-blue" />
          </div>
        </Reveal>
      </Container>

      <div className="reel-track mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-12 [scrollbar-width:thin]">
        {featured.map((p, i) => {
          const img = productImage(p.slug)!;
          return (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group w-72 shrink-0 snap-start rounded-xl border border-border bg-surface p-6 transition hover:border-border-strong"
            >
              <span className="font-mono text-anno-sm text-text-subtle">
                {String(i + 1).padStart(2, "0")} · {getCategory(p.category)?.label}
              </span>
              <div className="relative mt-4 h-40">
                <Image
                  src={img}
                  alt={p.name}
                  fill
                  sizes="288px"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                />
              </div>
              <h3 className="mt-4 font-display text-h4 font-bold text-text-strong">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-text-muted">{p.tagline}</p>
            </Link>
          );
        })}
        <Link
          href="/products"
          className="flex w-72 shrink-0 snap-start items-center justify-center rounded-xl border border-border-strong p-6 text-center font-display text-h4 font-bold text-brand-blue transition hover:bg-bg-muted"
        >
          See the full line →
        </Link>
      </div>
    </section>
  );
}
