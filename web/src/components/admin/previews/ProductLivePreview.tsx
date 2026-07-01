"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/catalog";
import { visibleSpecs } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function ProductLivePreview({ product }: { product: Product }) {
  const keySpecs = visibleSpecs(product.keySpecs);
  const isSafety = (product.certifications?.length ?? 0) > 0;

  return (
    <div className="dark bg-bg p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        {product.featured ? <Badge tone="featured">Featured</Badge> : null}
        {isSafety ? (
          <Badge tone="safety" icon={ShieldCheck}>
            Type 3 · SIL2 · PL d
          </Badge>
        ) : null}
        {product.trial ? (
          <Badge tone="trial" icon={BadgeCheck}>
            90-day trial
          </Badge>
        ) : null}
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-brand-blue">{product.brand}</p>
      <h1 className="mt-1 font-display text-2xl font-extrabold text-text-strong">{product.name || "Product name"}</h1>
      <p className="mt-2 text-lead text-text-muted">{product.tagline || "Tagline"}</p>
      <dl className="mt-6 grid grid-cols-2 gap-2">
        {keySpecs.map((s) => (
          <div
            key={s.label}
            className={cn("rounded-md border p-2.5", s.highlight ? "border-accent bg-accent/15" : "border-border bg-surface")}
          >
            <dt className="font-mono text-[10px] uppercase text-text-muted">{s.label}</dt>
            <dd className="mt-0.5 font-display text-sm font-bold text-text-strong">{s.value || "—"}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm leading-relaxed text-text-muted">{product.summary || "Summary paragraph…"}</p>
      <div className="mt-6 flex gap-2">
        <Button href="#" variant="primary" size="md">
          Get a quote
        </Button>
        {product.trial ? (
          <Button href="#" variant="secondary" size="md">
            Start trial
          </Button>
        ) : null}
      </div>
    </div>
  );
}
