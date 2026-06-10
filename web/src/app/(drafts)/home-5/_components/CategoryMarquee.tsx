import { categories, productsInCategory } from "@/lib/catalog";

/**
 * Eight disciplines on one rolling strip (reuses the home-4 .ticker track).
 * Each chip is a real category with its live product count from catalog.ts.
 */
export function CategoryMarquee() {
  const chips = categories.map((c) => ({
    label: c.label,
    count: productsInCategory(c.slug).length,
    href: `/${c.slug}`,
  }));

  return (
    <aside aria-label="Product categories" className="overflow-hidden border-y border-border py-4">
      <div className="ticker">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-3 pr-3">
            {chips.map((c) => (
              <li key={`${copy}-${c.href}`}>
                <a
                  href={copy === 0 ? c.href : undefined}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="glass inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-anno-sm uppercase tracking-[0.12em] text-text transition-colors hover:border-border-strong"
                >
                  {c.label}
                  <span className="text-text-subtle">{c.count}</span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}
