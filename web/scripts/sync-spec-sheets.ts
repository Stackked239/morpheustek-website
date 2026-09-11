/**
 * Syncs the repo-hosted spec sheets in catalog.ts onto the Supabase `products`
 * rows — the live site reads product JSON wholesale from the DB, so a sheet
 * committed under public/spec-sheets/ is invisible in prod until its row points
 * at it.
 *
 * A sheet reaches a product one of two ways, and the script handles both:
 *
 *   repo-hosted   catalog.ts carries a `/spec-sheets/…` path (`specSheetPath`
 *                 and/or `specSheets[]`). The row is repointed at those paths
 *                 and the superseded Storage object is deleted.
 *   Storage       no repo path in catalog.ts — the sheet was uploaded through
 *                 /admin. The row keeps its bucket URL and the uploaded PDF is
 *                 left alone, since that object IS the live sheet. Such rows
 *                 are only touched to carry a `specSheetDirect` flag.
 *
 * Unlike `cms:seed-product`, this patches ONLY the spec-sheet fields — every
 * other field on the row keeps whatever the admin UI last saved.
 *
 * Run: pnpm cms:sync-spec-sheets [--dry-run] [--keep-storage]
 *   --dry-run       report what would change, write nothing
 *   --keep-storage  update the rows but never delete anything from the bucket
 *
 * After running, open /admin and save any record to trigger CMS cache
 * revalidation — the public site reads through unstable_cache.
 */
import { products, type Product } from "../src/lib/catalog";
import { createServiceClient } from "../src/lib/supabase/server";

const BUCKET = "product-spec-sheets";
const dryRun = process.argv.includes("--dry-run");
const keepStorage = process.argv.includes("--keep-storage");

/** True when catalog.ts owns the PDF, rather than the Storage bucket. */
const isRepoHosted = (path?: string) => Boolean(path?.startsWith("/"));

const hasRepoSheets = (p: Product) =>
  isRepoHosted(p.specSheetPath) || (p.specSheets ?? []).some((s) => isRepoHosted(s.path));

/** Every product with something to sync: a repo-hosted sheet, or the ungated flag. */
const targets = products.filter((p) => hasRepoSheets(p) || p.specSheetDirect);

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
  if (targets.length === 0) {
    console.log("No products with repo-hosted or ungated spec sheets in catalog.ts — nothing to sync.");
    return;
  }

  const sb = createServiceClient();
  console.log(dryRun ? "DRY RUN — no writes\n" : "Syncing spec sheets…\n");

  for (const product of targets) {
    const { slug, specSheetPath, specSheetNote, specSheets, specSheetDirect } = product;
    const repoHosted = isRepoHosted(specSheetPath);
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
      const merged: Record<string, unknown> = { ...current };
      const changes: string[] = [];

      // Only repo-hosted sheets repoint the row. For an /admin upload the row
      // already holds the right bucket URL, and overwriting it with catalog.ts
      // (which has no path for those) would blank the sheet entirely.
      if (repoHosted) {
        merged.specSheetPath = specSheetPath;
        changes.push(`${specSheetPath}${previous && previous !== specSheetPath ? ` (was ${previous})` : ""}`);
        if (specSheetNote) merged.specSheetNote = specSheetNote;
        else delete merged.specSheetNote;
      }
      // The variant list is authored in catalog.ts only, so it is always the
      // source of truth: replaced when present, cleared when removed.
      if (specSheets?.length) {
        merged.specSheets = specSheets;
        changes.push(`${specSheets.length} variant sheet${specSheets.length === 1 ? "" : "s"}`);
      } else if (current.specSheets) {
        delete merged.specSheets;
        changes.push("cleared variant sheets");
      }
      if (specSheetDirect) {
        merged.specSheetDirect = true;
        changes.unshift("direct");
      }
      if (!repoHosted && !specSheets?.length) {
        changes.push(`keeping uploaded ${previous ?? "(none — upload one in /admin)"}`);
      }

      const change = changes.join(" + ");
      if (dryRun) {
        console.log(`would set ${change}`);
      } else {
        const { error } = await sb
          .from("products")
          .upsert({ slug, data: merged, status: "published" }, { onConflict: "slug" });
        if (error) throw new Error(error.message);
        console.log(`set ${change}`);
      }
    }

    // Purge ONLY when the repo owns the primary sheet: any object left at
    // `<slug>.pdf` is superseded by definition, and the bucket is public, so a
    // stale one keeps serving the old PDF to anyone holding the link. When the
    // sheet came from /admin that same object IS the live sheet — deleting it
    // would break the product page.
    if (repoHosted && !keepStorage) await purgeStorage(sb, slug);
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
