import { getProduct as getSeedProduct, type Product } from "@/lib/catalog";
import { createServiceClient } from "@/lib/supabase/server";

/** Merge a partial patch into the product JSONB row (seed + existing + patch). */
export async function mergeProductData(slug: string, patch: Partial<Product>) {
  const sb = createServiceClient();
  const { data: existing } = await sb.from("products").select("data").eq("slug", slug).maybeSingle();
  const seed = getSeedProduct(slug);
  const merged = { ...(seed ?? {}), ...(existing?.data as Product | undefined), ...patch };

  const { error } = await sb.from("products").upsert(
    { slug, data: merged, status: "published" },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);

  return merged;
}
