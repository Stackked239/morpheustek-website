/**
 * Points the Supabase `products` rows at the repo-hosted spec sheets in
 * `public/spec-sheets/`, and clears out the Storage PDFs they replace.
 *
 * Unlike `cms:seed-product`, this patches ONLY the spec-sheet fields — every
 * other field on the row keeps whatever the admin UI last saved.
 *
 * Run: pnpm cms:sync-spec-sheets [--dry-run] [--keep-storage]
 *
 * After running, open /admin and save any record to trigger CMS cache
 * revalidation — the public site reads through unstable_cache.
 */
import { products } from "../src/lib/catalog";
import { createServiceClient } from "../src/lib/supabase/server";

const BUCKET = "product-spec-sheets";
const dryRun = process.argv.includes("--dry-run");
const keepStorage = process.argv.includes("--keep-storage");

/** Products whose spec sheet ships with the repo rather than Storage. */
const repoHosted = products.filter((p) => p.specSheetPath?.startsWith("/"));

async function main() {
  if (repoHosted.length === 0) {
    console.log("No repo-hosted spec sheets in catalog.ts — nothing to sync.");
    return;
  }

  const sb = createServiceClient();
  console.log(dryRun ? "DRY RUN — no writes\n" : "Syncing spec sheets…\n");

  for (const product of repoHosted) {
    const { slug, specSheetPath, specSheetDirect } = product;
    process.stdout.write(`• ${slug} … `);

    const { data: existing, error: readError } = await sb
      .from("products")
      .select("data")
      .eq("slug", slug)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!existing?.data) {
      console.log(`SKIPPED — not in Supabase yet (run \`pnpm cms:seed-product ${slug}\` first)`);
      continue;
    }

    const current = existing.data as Record<string, unknown>;
    const previous = current.specSheetPath as string | undefined;
    const merged = { ...current, specSheetPath, specSheetDirect };

    if (dryRun) {
      console.log(`would set ${specSheetPath}${previous ? ` (was ${previous})` : ""}`);
      continue;
    }

    const { error } = await sb
      .from("products")
      .upsert({ slug, data: merged, status: "published" }, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    console.log(`set ${specSheetPath}${previous ? ` (was ${previous})` : ""}`);

    // The Storage PDF this replaces is now unreferenced — drop it so the old
    // sheet can't be served from a stale link.
    if (!keepStorage && previous?.includes(`/${BUCKET}/`)) {
      const { error: removeError } = await sb.storage.from(BUCKET).remove([`${slug}.pdf`]);
      if (removeError) console.log(`    ! could not delete old ${slug}.pdf — ${removeError.message}`);
      else console.log(`    removed old ${BUCKET}/${slug}.pdf`);
    }
  }

  console.log(
    dryRun
      ? "\nDry run complete."
      : "\nDone. Open /admin and save any record to revalidate the site cache.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
