import Image from "next/image";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { productImage, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";

/**
 * Product visual: the real product photo (from morpheustek.com) on a clean light
 * backdrop with object-contain, or the branded ProductGlyph when no photo exists.
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
    <div className={cn("relative overflow-hidden bg-white", className)}>
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
