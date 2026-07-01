import Link from "next/link";
import { getProducts } from "@/lib/cms";
import { NewProductForm } from "./NewProductForm";

export default async function AdminNewProductPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Add product</h2>
          <p className="mt-2 text-sm text-text-muted">Create a new SKU from an existing template, then edit specs and upload imagery.</p>
        </div>
        <Link href="/admin/products" className="font-mono text-xs text-brand-blue hover:underline">
          ← Back to products
        </Link>
      </div>
      <NewProductForm templates={products} />
    </div>
  );
}
