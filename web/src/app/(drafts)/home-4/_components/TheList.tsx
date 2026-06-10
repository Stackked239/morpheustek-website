import Link from "next/link";
import { products, categories, formatPrice } from "@/lib/catalog";

/**
 * The line card hung on the wall. Every product, one ruled row each, grouped
 * by category — hover a row and it inverts to navy. Pure server markup.
 */
export function TheList() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mt-container mt-container-wide">
        <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold uppercase leading-none tracking-[-0.01em] text-mt-navy">
          The list.
        </h2>
        <p className="mt-4 max-w-xl text-lead text-text-muted">
          Eighteen instruments, listed in public. If a price says contact, that&apos;s the real
          answer — not a sales funnel.
        </p>

        <div className="mt-12 border-t-2 border-mt-navy">
          {categories.map((cat) => {
            const rows = products.filter((p) => p.category === cat.slug);
            if (rows.length === 0) return null;
            return (
              <div key={cat.slug}>
                <h3 className="border-b border-mt-navy/30 pt-8 pb-2 font-mono text-anno-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
                  {cat.label}
                </h3>
                <ul>
                  {rows.map((p) => (
                    <li key={p.slug} className="border-b border-mt-navy/30">
                      <Link
                        href={`/products/${p.slug}`}
                        className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-3 transition-colors hover:bg-mt-navy sm:grid-cols-[minmax(10rem,1fr)_2fr_auto]"
                      >
                        <span className="font-display text-h3 font-bold uppercase leading-none text-text-strong group-hover:text-mt-yellow">
                          {p.model}
                        </span>
                        <span className="hidden truncate text-sm text-text-muted group-hover:text-mt-gray-light sm:block">
                          {p.tagline}
                        </span>
                        <span className="text-right font-mono text-base font-bold tabular-nums text-text group-hover:text-mt-yellow">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
