import { notFound } from "next/navigation";
import { getProduct, productImage } from "@/lib/cms";
import { ProductEditor } from "./ProductEditor";

type Params = { params: Promise<{ slug: string }> };

export default async function AdminProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, imagePath] = await Promise.all([getProduct(slug), productImage(slug)]);
  if (!product) notFound();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-h3 font-bold uppercase text-text-strong">{product.model}</h2>
          <p className="mt-1 font-mono text-xs text-text-subtle">{slug}</p>
        </div>
        <a
          href={`/templates/spec-sheet/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-brand-blue hover:underline"
        >
          Open spec sheet →
        </a>
      </div>
      <ProductEditor slug={slug} initial={product} imagePath={imagePath} />
    </div>
  );
}
