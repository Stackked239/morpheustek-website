import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { categories, getProduct, formatPrice, availabilityLabel } from "@/lib/catalog";
import { ClauseHeader } from "./ClauseHeader";

/* §03 — The Line Card
   The densest section on the page, deliberately sandwiched between airy ones.
   One full-width ruled table, zero cards. The focal element is the price
   column: unlike every competitor, the prices are simply listed. */

const CURATED: string[] = [
  // 2D LiDAR
  "lr-1f-2d-lidar",
  "lr-1bs2-mini-zone-lidar",
  "lr-1bs5-mini-lidar",
  // Safety
  "gs1-5-safety-lidar",
  // 3D LiDAR
  "lr-16f-100-3d-lidar",
  "lr-16fis-explosion-proof-3d-lidar",
  // Solid-state
  "lr-f240-solid-state-lidar",
  "vss-50-solid-state-3d-lidar",
  // 3D cameras
  "mrdvs-s10-rgbd-camera",
  "mrdvs-s11-rgbd-camera",
  // Rangefinder / mapping / edge
  "a090-laser-rangefinder",
  "lc-m50g-mobile-slam-mapper",
  "sintrones-ibox-602p-edge-ai",
];

export function LineCard() {
  const rows = CURATED.map((slug) => getProduct(slug)!).filter(Boolean);
  const byCategory = categories
    .map((c) => ({ category: c, products: rows.filter((p) => p.category === c.slug) }))
    .filter((g) => g.products.length > 0);

  return (
    <section className="bg-bg py-20 md:py-24">
      <Container wide>
        <ClauseHeader
          index="03"
          eyebrow="The line card"
          title="Eighteen instruments. Prices listed."
          lead="A supplier publishes its prices. Every OLEI sensor ships with the 90-day trial."
        />

        <div className="mt-12">
          {/* column headers */}
          <div className="hidden grid-cols-[7rem_1fr_7rem_6rem_5rem] gap-4 border-b border-border pb-2 font-mono text-anno-sm uppercase text-text-muted sm:grid">
            <span>Model</span>
            <span>Key specification</span>
            <span className="text-right">Price</span>
            <span className="text-right">Status</span>
            <span className="text-right">Trial</span>
          </div>

          {byCategory.map(({ category, products }) => (
            <div key={category.slug}>
              <div className="border-b border-line-ink pb-1 pt-6 font-mono text-anno-sm uppercase text-text">
                {category.label}
              </div>
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-3 border-b border-border py-3 transition-colors hover:bg-bg-subtle sm:grid-cols-[7rem_1fr_7rem_6rem_5rem] sm:gap-4"
                >
                  <span className="font-mono text-anno font-medium text-text-strong group-hover:text-brand-blue">
                    {p.model}
                  </span>
                  <span className="truncate text-sm text-text-muted">
                    {p.keySpecs.slice(0, 3).map((s) => s.value).join(" · ")}
                  </span>
                  <span className="tnum text-right font-mono text-anno text-text-strong">
                    {p.price ? formatPrice(p.price) : "Contact"}
                  </span>
                  <span className="hidden items-baseline justify-end gap-2 text-right font-mono text-anno-sm uppercase text-text-muted sm:flex">
                    <span
                      aria-hidden
                      className={`inline-block size-1.5 rounded-full ${p.availability === "in-stock" ? "bg-success" : "border border-text-subtle"}`}
                    />
                    {availabilityLabel[p.availability]}
                  </span>
                  <span className="hidden text-right font-mono text-anno-sm uppercase text-text-muted sm:block">
                    {p.trial ? "90-day" : "—"}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Link
          href="/products"
          className="mt-10 inline-block font-semibold text-brand-blue underline-offset-4 hover:underline"
        >
          Browse all 18 instruments →
        </Link>
      </Container>
    </section>
  );
}
