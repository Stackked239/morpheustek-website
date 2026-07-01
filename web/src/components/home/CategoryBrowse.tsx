"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { ProductPlateBackdrop } from "@/components/product/ProductPlateBackdrop";
import {
  getCategory,
  productImage,
  productsInCategory,
  type CategorySlug,
  type Product,
} from "@/lib/catalog";
import type { HomeCatalog } from "@/lib/cms/home-catalog";
import { homeImage } from "@/lib/cms/home-catalog";
import { defaultCategoryBrowseContent } from "@/lib/cms/home-defaults";
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
const DEFAULT_CATEGORY_ORDER: CategorySlug[] = defaultCategoryBrowseContent.categoryOrder;

// Only categories that actually carry products render as tabs.
function buildTabs(catalog: HomeCatalog | undefined, order: CategorySlug[]) {
  return order.map((slug) => ({
    slug,
    category: catalog?.categories.find((c) => c.slug === slug) ?? getCategory(slug),
    items:
      catalog?.products.filter((p) => p.category === slug) ??
      productsInCategory(slug),
  })).filter((t) => t.category && t.items.length > 0);
}

function runBrowseBuildIn(cards: HTMLElement[]) {
  if (!cards.length) return;
  if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  gsap.killTweensOf(cards);
  gsap.fromTo(
    cards,
    { opacity: 0, y: 40, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.08,
      clearProps: "transform,opacity",
      overwrite: true,
    },
  );
}

function ProductPlate({ product, catalog }: { product: Product; catalog?: HomeCatalog }) {
  const src = homeImage(catalog, product.slug, productImage);
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-border bg-bg-subtle">
      {/* branded backdrop — NOT white (shared source of truth, R05) */}
      <ProductPlateBackdrop />

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

function ProductCard({ product, catalog }: { product: Product; catalog?: HomeCatalog }) {
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
      <ProductPlate product={product} catalog={catalog} />

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

export function CategoryBrowse({
  catalog,
  content = defaultCategoryBrowseContent,
}: {
  catalog?: HomeCatalog;
  content?: typeof defaultCategoryBrowseContent;
}) {
  const order = content.categoryOrder?.length ? content.categoryOrder : DEFAULT_CATEGORY_ORDER;
  const tabs = buildTabs(catalog, order);
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CategorySlug>(tabs[0]?.slug ?? "lidar-for-robotics");
  const [revealKey, setRevealKey] = useState(0);
  const current = tabs.find((t) => t.slug === active) ?? tabs[0];
  const panelId = "browse-category-panel";

  const selectCategory = (slug: CategorySlug) => {
    if (slug === active) return;
    setActive(slug);
    setRevealKey((k) => k + 1);
  };

  // Replay-on-scroll: re-fire the card build-in each time the grid re-enters.
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setRevealKey((k) => k + 1);
      },
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (revealKey === 0) return;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".browse-card");
    if (!cards?.length) return;
    runBrowseBuildIn(Array.from(cards));
    return () => {
      gsap.set(cards, { clearProps: "all", opacity: 1 });
    };
  }, [active, revealKey]);

  return (
    <Section tone="default" className="relative overflow-hidden">
      {/* seam blend — soft tonal lift at the top edge so this light band separates from
          CertifyPlot's matching bottom lift instead of butting it on a hard same-tone seam. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,var(--bg-muted),transparent)]" aria-hidden />
      {/* dot field (NOT a grid) — differentiates this band's background from CertifyPlot's
          square draft-grid above it; same --motif-line ink so it stays visible across all themes. */}
      <div className="dot-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <Container className="relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-lead text-text-muted">{content.body}</p>
          </div>

          <Button href="/products" variant="ghost" size="lg" className="self-start md:self-auto">
            See the full line
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        {/* segmented category selector */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="mt-9 flex flex-wrap gap-2 border-b border-border pb-1"
        >
          {tabs.map((t) => {
            const isActive = t.slug === active;
            const tabId = `browse-tab-${t.slug}`;
            return (
              <button
                key={t.slug}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectCategory(t.slug)}
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

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`browse-tab-${active}`}
        >
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-text-muted">{current?.category?.blurb}</p>

          <div ref={gridRef} className="mt-7">
            <div key={active} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {current?.items.map((product) => (
                <div key={product.slug} className="browse-card">
                  <ProductCard product={product} catalog={catalog} />
                </div>
              ))}
            </div>
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
