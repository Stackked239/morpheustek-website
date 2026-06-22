"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, BadgeCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { ProductPlateBackdrop } from "@/components/product/ProductPlateBackdrop";
import { solutionsLinks } from "@/lib/site";

type Cat = { slug: string; label: string; blurb: string };
type Featured = { slug: string; name: string; tagline: string; image?: string };

export function MegaMenu({ categories, featured }: { categories: Cat[]; featured: Featured }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href="/products"
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
      >
        Products
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </Link>

      {/* Anchored to the sticky, full-width <header> (the wrapper above is
          intentionally NOT positioned), so the panel centres on the viewport —
          not on this left-of-centre trigger — and can't overflow the edge (R04).
          Don't add `relative`/positioning to the wrapper or intervening nodes. */}
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="max-h-[calc(100svh-6rem)] w-[min(60rem,92vw)] overflow-y-auto overflow-x-hidden rounded-xl border border-border border-t-2 border-t-accent bg-surface shadow-[var(--shadow-md)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem]">
            <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="group rounded-md p-3 transition-colors hover:bg-bg-muted">
                  <div className="font-display text-base font-bold text-text-strong group-hover:text-brand-blue">{c.label}</div>
                  <div className="mt-0.5 text-sm leading-snug text-text-muted">{c.blurb}</div>
                </Link>
              ))}
            </div>
            <div className="border-t border-border bg-bg-subtle p-4 md:border-l md:border-t-0">
              <p className="eyebrow mb-3">Product of the month</p>
              <Link href={`/products/${featured.slug}`} className="group block">
                {featured.image ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-bg-subtle">
                    <ProductPlateBackdrop />
                    <Image src={featured.image} alt={featured.name} fill sizes="18rem" className="object-contain p-3" />
                  </div>
                ) : (
                  <ProductGlyph label={featured.name} className="aspect-[4/3] w-full" />
                )}
                <div className="mt-3 font-display text-base font-bold text-text-strong group-hover:text-brand-blue">{featured.name}</div>
                <p className="mt-1 line-clamp-2 text-sm text-text-muted">{featured.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-text">
                  <BadgeCheck className="size-3.5" /> 90-day risk-free trial
                </span>
              </Link>
            </div>
          </div>

          {/* Beyond the catalog — the build-to-spec / full-stack differentiators,
              otherwise reachable only from the footer. Surfaced here so they're one
              click from the top nav on any page. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-bg-subtle px-4 py-3">
            <span className="font-mono text-anno-sm uppercase tracking-[0.14em] text-text-muted">
              Beyond the catalog
            </span>
            {solutionsLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text-strong transition-colors hover:text-brand-blue"
              >
                {l.label}
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
