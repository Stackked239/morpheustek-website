/**
 * Seeds Supabase from catalog.ts + site.ts + content-registry defaults.
 * Run: pnpm cms:seed (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
 */
import {
  products,
  categories,
  applications,
  leadMagnets,
  productImages,
} from "../src/lib/catalog";
import {
  site,
  primaryCta,
  mainNav,
  resourcesNav,
  solutionsLinks,
  footerNav,
} from "../src/lib/site";
import { contentBlockRegistry } from "../src/lib/cms/content-registry";
import { createServiceClient } from "../src/lib/supabase/server";

async function main() {
  const sb = createServiceClient();

  console.log("Seeding categories…");
  await sb.from("categories").upsert(
    categories.map((c, i) => ({ slug: c.slug, data: c, sort_order: i, status: "published" })),
    { onConflict: "slug" },
  );

  console.log("Seeding products…");
  await sb.from("products").upsert(
    products.map((p, i) => ({ slug: p.slug, data: p, sort_order: i, status: "published" })),
    { onConflict: "slug" },
  );

  console.log("Seeding applications…");
  await sb.from("applications").upsert(
    applications.map((a, i) => ({ slug: a.slug, data: a, sort_order: i, status: "published" })),
    { onConflict: "slug" },
  );

  console.log("Seeding resources…");
  await sb.from("resources").upsert(
    leadMagnets.map((r, i) => ({ slug: r.slug, data: r, sort_order: i, status: "published" })),
    { onConflict: "slug" },
  );

  console.log("Seeding product images…");
  await sb.from("product_images").upsert(
    Object.entries(productImages).map(([slug, path]) => ({ slug, path })),
    { onConflict: "slug" },
  );

  const siteSettings = {
    ...site,
    primaryCta,
    mainNav: [...mainNav],
    resourcesNav: [...resourcesNav],
    solutionsLinks: [...solutionsLinks],
    footerNav: footerNav.map((g) => ({ ...g, links: [...g.links] })),
  };

  const blocks = contentBlockRegistry.map((def) => {
    let data = def.defaultData;
    if (def.key === "site.settings") data = siteSettings;
    if (data === null) data = {};
    return {
      key: def.key,
      label: def.label,
      group: def.group,
      data,
    };
  });

  console.log("Seeding content blocks…");
  await sb.from("content_blocks").upsert(blocks, { onConflict: "key" });

  console.log("Done. Seeded", products.length, "products,", blocks.length, "content blocks (incl. booth mode + product of month).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
