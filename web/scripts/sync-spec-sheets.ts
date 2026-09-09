/**
 * Points the Supabase `products` rows at the repo-hosted spec sheets in
 * `public/spec-sheets/`, and permanently deletes the Storage PDFs they
 * replace — for the MRDVS S10 and S11 those are the stand-in Percipio
 * flyers (GM461 / GM465) scraped from the old WordPress site.
 *
 * Unlike `cms:seed-product`, this patches ONLY the spec-sheet fields — every
 * other field on the row keeps whatever the admin UI last saved.
 *
 * Run: pnpm cms:sync-spec-sheets [--dry-run] [--keep-storage]
 *   --dry-run       report what would change, write nothing
 *   --keep-storage  update the rows but leave the old PDFs in the bucket
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

type StorageClient = ReturnType<typeof createServiceClient>;

/**
 * Delete `<slug>.pdf` from the spec-sheet bucket, then verify it is actually
 * gone. Supabase's `remove()` reports success for a path that was never there,
 * so a listing is the only honest confirmation.
 */
async function purgeStorage(sb: StorageClient, slug: string) {
  const file = `${slug}.pdf`;
  const present = async () => {
    const { data, error } = await sb.storage.from(BUCKET).list("", { search: file });
    if (error) throw new Error(error.message);
    return (data ?? []).some((o) => o.name === file);
  };

  if (!(await present())) {
    console.log(`    storage: nothing at ${BUCKET}/${file}`);
    return;
  }
  if (dryRun) {
    console.log(`    storage: would delete ${BUCKET}/${file}`);
    return;
  }

  const { error } = await sb.storage.from(BUCKET).remove([file]);
  if (error) {
    console.log(`    ! storage: could not delete ${file} — ${error.message}`);
    return;
  }
  console.log(
    (await present())
      ? `    ! storage: ${file} still present after delete — check bucket policies`
      : `    storage: deleted ${BUCKET}/${file}`,
  );
}

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
      console.log(`no row yet — run \`pnpm cms:seed-product ${slug}\` first`);
    } else {
      const current = existing.data as Record<string, unknown>;
      const previous = current.specSheetPath as string | undefined;
      const was = previous ? ` (was ${previous})` : "";

      if (dryRun) {
        console.log(`would set ${specSheetPath}${was}`);
      } else {
        const merged = { ...current, specSheetPath, specSheetDirect };
        const { error } = await sb
          .from("products")
          .upsert({ slug, data: merged, status: "published" }, { onConflict: "slug" });
        if (error) throw new Error(error.message);
        console.log(`set ${specSheetPath}${was}`);
      }
    }

    // The repo now owns this product's sheet, so any object still sitting at
    // `<slug>.pdf` in Storage is superseded by definition. Delete it whatever
    // the row happened to point at — the bucket is public, so a stale object
    // keeps serving the old PDF to anyone holding the link long after nothing
    // in the site references it.
    if (!keepStorage) await purgeStorage(sb, slug);
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
