import Image from "next/image";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { ProductPlateBackdrop } from "./ProductPlateBackdrop";
import { productImage, type Product } from "@/lib/cms";
import { cn } from "@/lib/cn";

export async function ProductMedia({
  product,
  imageSrc,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  pad = "p-5",
}: {
  product: Product;
  imageSrc?: string;
  className?: string;
  sizes?: string;
  pad?: string;
}) {
  const src = imageSrc ?? (await productImage(product.slug));
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
