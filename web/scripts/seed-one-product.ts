/**
 * Upserts a single product (and its image mapping) from catalog.ts into Supabase
 * without touching any other product's data — unlike `cms:seed`, which overwrites
 * every row and would clobber admin edits.
 *
 * Also realigns every seed-known product's sort_order to the catalog.ts array
 * position (an UPDATE on sort_order only), so a product inserted mid-array lands
 * in the right spot on /products and in the mega menu.
 *
 * Run: pnpm cms:seed-product <slug> [<slug> ...]   (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
 *
 * After running, open /admin and save any record (or site settings) to trigger
 * the CMS cache revalidation — the public site reads through unstable_cache.
 */
import { products, productImages } from "../src/lib/catalog";
import { createServiceClient } from "../src/lib/supabase/server";

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error("Usage: pnpm cms:seed-product <slug> [<slug> ...]");
    process.exit(1);
  }

  const sb = createServiceClient();

  for (const slug of slugs) {
    const index = products.findIndex((p) => p.slug === slug);
    if (index === -1) {
      console.error(`No product with slug "${slug}" in catalog.ts`);
      process.exit(1);
    }
    const product = products[index];

    console.log(`Upserting product ${slug} (sort_order ${index})…`);
    const { error } = await sb
      .from("products")
      .upsert({ slug, data: product, sort_order: index, status: "published" }, { onConflict: "slug" });
    if (error) throw error;

    const imagePath = productImages[slug];
    if (imagePath) {
      console.log(`Upserting product image ${slug} → ${imagePath}…`);
      const { error: imgError } = await sb
        .from("product_images")
        .upsert({ slug, path: imagePath }, { onConflict: "slug" });
      if (imgError) throw imgError;
    }
  }

  console.log("Realigning sort_order for all seed-known products…");
  for (let i = 0; i < products.length; i++) {
    const { error } = await sb.from("products").update({ sort_order: i }).eq("slug", products[i].slug);
    if (error) throw error;
  }

  console.log("Done. Open /admin and save any record to revalidate the site cache.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
