import Link from "next/link";
import { getProducts } from "@/lib/cms";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Products</h2>
          <p className="mt-2 text-sm text-text-muted">Edit catalog products — specs, pricing, copy, and compare rows.</p>
        </div>
        <a href="/admin/products/new" className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold uppercase text-accent-text">
          + Add product
        </a>
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {products.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/products/${p.slug}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-bg-muted"
            >
              <span>
                <span className="font-display text-base font-bold uppercase text-text-strong">{p.model}</span>
                <span className="ml-2 font-mono text-xs text-text-subtle">{p.slug}</span>
              </span>
              <span className="font-mono text-xs text-brand-blue">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
