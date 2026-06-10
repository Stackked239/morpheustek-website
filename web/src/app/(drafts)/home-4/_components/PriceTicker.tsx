import { products, formatPrice } from "@/lib/catalog";

/**
 * The whole catalog walks past on one navy strip. Content is rendered twice so
 * the CSS track can loop seamlessly; reduced-motion freezes it into a static
 * strip (globals.css zeroes all animation).
 */
export function PriceTicker() {
  const items = products.map((p) => ({
    model: p.model,
    price: formatPrice(p.price),
  }));

  return (
    <aside aria-label="Product price ticker" className="overflow-hidden border-b-2 border-mt-navy bg-mt-navy py-3 text-mt-yellow">
      <div className="ticker">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
            {items.map((it) => (
              <li key={`${copy}-${it.model}`} className="flex items-center whitespace-nowrap font-mono text-sm uppercase tracking-[0.12em]">
                <span className="px-4 font-bold">{it.model}</span>
                <span>{it.price}</span>
                <span className="px-4 text-mt-cyan" aria-hidden>
                  ◆
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}
