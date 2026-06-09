import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const isSafety = (product.certifications?.length ?? 0) > 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-md)] outline-offset-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus-visible:outline-2",
        className,
      )}
    >
      <ProductMedia product={product} className="aspect-[16/10] w-full border-b border-border" pad="p-4" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.featured ? <Badge tone="featured">Featured</Badge> : null}
          {isSafety ? (
            <Badge tone="safety" icon={ShieldCheck}>
              SIL2
            </Badge>
          ) : null}
          {product.availability === "in-stock" ? <Badge tone="in-stock">In stock</Badge> : null}
          {product.availability === "pre-order" ? <Badge tone="pre-order">Pre-order</Badge> : null}
          {product.trial ? (
            <Badge tone="trial" icon={BadgeCheck}>
              90-day trial
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-h4 font-bold leading-tight text-text-strong">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-snug text-text-muted">{product.tagline}</p>
        <div className="mt-4 flex items-center justify-end">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
            View specs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
