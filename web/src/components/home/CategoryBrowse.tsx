"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import {
  getCategory,
  productImage,
  productsInCategory,
  type CategorySlug,
  type Product,
} from "@/lib/catalog";
import { cn } from "@/lib/cn";

/**
 * Home — "Browse by category".
 *
 * Both client reps asked to see the line split by category; Tom "loved how you
 * split them into categories (2D / safety / 3D)". So we lead with exactly those
 * three, then carry the rest of the line. A mono segmented selector swaps the
 * active category; remounting the grid (keyed on the active slug) replays the
 * card entrance per category, and a CSS scroll-driven reveal replays it on
 * viewport re-entry (the client explicitly asked for replay-on-scroll). All
 * motion is final-state-first, html.js-gated, and off under reduced-motion —
 * SSR / no-JS / crawlers always read the finished, fully-readable grid.
 *
 * Tom rejected the white "catalog" look, so the product plate is NOT white —
 * every image sits on a branded bg-bg-subtle plate with a faint point-cloud
 * motif and an accent tint. Products with no photo fall back to the branded
 * ProductGlyph rather than an empty box. The SIL2 badge stays data-driven: it
 * renders only where `certifications` exists (today, only the GS1-5).
 */

// Lead with the three the client named, then the rest of the line.
const CATEGORY_ORDER: CategorySlug[] = [
  "lidar-for-robotics", // 2D LiDAR
  "safety-lidar", // Safety LiDAR
  "3d-lidar-for-robotics", // 3D LiDAR
  "solid-state-lidar",
  "3d-cameras-for-robotics",
  "rangefinders", // 1D rangefinders
];

// Only categories that actually carry products render as tabs.
const TABS = CATEGORY_ORDER.map((slug) => ({
  slug,
  category: getCategory(slug),
  items: productsInCategory(slug),
})).filter((t) => t.category && t.items.length > 0);

function ProductPlate({ product }: { product: Product }) {
  const src = productImage(product.slug);
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-border bg-bg-subtle">
      {/* branded backdrop — NOT white. Faint accent wash + schematic point-cloud
          dot motif, so the plate reads as instrument, not catalog. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_60%)]"
        aria-hidden
      />
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      {/* corner registration tick — drafting-table detail */}
      <span className="reg-mark left-3 top-3" aria-hidden />

      {src ? (
        <Image
          src={src}
          alt={`${product.name} — ${product.tagline}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        // No photo → branded glyph (a sensor scanning a point cloud), never a blank box.
        <ProductGlyph
          label={product.model}
          className="absolute inset-0 size-full rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isSafety = (product.certifications?.length ?? 0) > 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-surface outline-offset-2",
        "transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-lg)]",
        "focus-visible:outline-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <ProductPlate product={product} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-anno-sm uppercase tracking-[0.12em] text-text-subtle">
            {product.brand} · {product.model}
          </span>
          {/* data-driven safety badge — renders ONLY where certifications exist (GS1-5). */}
          {isSafety ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold leading-none text-accent-text">
              <ShieldCheck className="size-3" /> SIL2
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 font-display text-h4 font-bold leading-tight text-text-strong">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-snug text-text-muted">{product.tagline}</p>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
          View specs
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </span>
      </div>
    </Link>
  );
}

export function CategoryBrowse() {
  const [active, setActive] = useState<CategorySlug>(TABS[0]?.slug ?? "lidar-for-robotics");
  const current = TABS.find((t) => t.slug === active) ?? TABS[0];

  return (
    <Section tone="default" className="relative overflow-hidden border-t border-border">
      {/* faint schematic grid behind the whole band — structural ink, never behind copy */}
      <div className="circuit-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <Container className="relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Browse the line by category</Eyebrow>
            <h2 className="mt-5 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
              The right sensor, sorted the way you spec.
            </h2>
            <p className="mt-4 max-w-xl text-lead text-text-muted">
              2D, safety, 3D — and everything between. Every unit ships on a 90-day risk-free trial, backed by 30
              years of high-tech measurement instruments, not a fly-by-night manufacturer.
            </p>
          </div>

          <Button href="/products" variant="ghost" size="lg" className="self-start md:self-auto">
            See the full line
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        {/* segmented category selector */}
        <div
          role="group"
          aria-label="Product categories"
          className="mt-9 flex flex-wrap gap-2 border-b border-border pb-1"
        >
          {TABS.map((t) => {
            const isActive = t.slug === active;
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(t.slug)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3.5 py-2 font-mono text-anno-sm uppercase tracking-[0.1em]",
                  "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2",
                  isActive
                    ? "bg-surface text-text-strong shadow-[var(--shadow-sm)] ring-1 ring-border-strong"
                    : "text-text-muted hover:bg-bg-muted hover:text-text",
                )}
              >
                {t.category?.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none tnum",
                    isActive ? "bg-accent text-accent-text" : "bg-bg-muted text-text-subtle",
                  )}
                >
                  {t.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* active category intro + grid live in one tabpanel, remounted per slug so
            the entrance animation replays on every category switch. */}
        <div key={active}>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-text-muted">{current?.category?.blurb}</p>

          {/* product grid — final-state-first (visible by default). The .js gate
              below adds a staggered reveal that replays per category (key remount)
              and on viewport re-entry (CSS scroll-driven), off under reduced-motion. */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {current?.items.map((product) => (
              <div key={product.slug}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-9 text-sm text-text-muted">
          Not sure which sensor fits your platform?{" "}
          <Link
            href="/book-a-meeting?intent=engineer"
            className="font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Talk to an engineer
          </Link>{" "}
          — they spec it with you.
        </p>
      </Container>

    </Section>
  );
}
