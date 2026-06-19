import Image from "next/image";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { ProductPlateBackdrop } from "./ProductPlateBackdrop";
import { productImage, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";

/**
 * Product visual: the real product photo (from morpheustek.com) on a branded,
 * NOT-white plate (accent wash + point-cloud motif via ProductPlateBackdrop),
 * object-contain — or the branded ProductGlyph when no photo exists. The white
 * "catalog" backdrop was dropped per the 06-12 client review (R05).
 */
export function ProductMedia({
  product,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  pad = "p-5",
}: {
  product: Product;
  className?: string;
  sizes?: string;
  pad?: string;
}) {
  const src = productImage(product.slug);
  if (!src) {
    return <ProductGlyph label={product.model} className={className} />;
  }
  return (
    <div className={cn("relative overflow-hidden bg-bg-subtle", className)}>
      <ProductPlateBackdrop />
      <Image
        src={src}
        alt={`${product.name} — ${product.tagline}`}
        fill
        sizes={sizes}
        className={cn("object-contain", pad)}
      />
    </div>
  );
}
