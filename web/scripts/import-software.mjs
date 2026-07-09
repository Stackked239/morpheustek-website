#!/usr/bin/env node
/**
 * Scrape software downloads from live morpheustek.com and upload to Supabase
 * `product-software` for the new catalog.
 *
 * Resolves WordPress Download Monitor links (/download/{id}/), keeps .zip
 * files only, bundles multiples into one archive per product.
 *
 * Usage (from web/):
 *   pnpm import:software
 *   pnpm import:software -- --dry-run
 *   pnpm import:software -- --only=lr-1f-2d-lidar
 */

import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const onlySlug = onlyArg?.split("=")[1];

function loadEnv() {
  const path = join(__dirname, "../.env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i);
      const v = t.slice(i + 1);
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* rely on shell env */
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-software";
const LIVE = "https://morpheustek.com";
/** Stay under Supabase bucket limit (250 MB after migration 006). */
const MAX_BUNDLE_BYTES = 240 * 1024 * 1024;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

/** WordPress product slug → new catalog slug */
const WP_TO_CATALOG = {
  "olei-lr-16f-100-3d": "lr-16f-100-3d-lidar",
  "olei-lr-1f-lidar": "lr-1f-2d-lidar",
  "olei-a090-rangefinder": "a090-laser-rangefinder",
  "olei-gs1-5-2d-safety-lidar": "gs1-5-safety-lidar",
  "olei-2d-lr-1bs2-series-mini-lidar": "lr-1bs2-mini-zone-lidar",
  "olei-2d-lr-1bs5-mini-lidar-series": "lr-1bs5-mini-lidar",
  "olei-lr-16fis-3d-lidar": "lr-16fis-explosion-proof-3d-lidar",
  "olei-lr-dds-2-3d-mapper": "lr-dds-2-tripod-3d-mapper",
  "olei-lr-v240-3d-solid-state-obstacle-avoidance-lidar": "lr-f240-solid-state-lidar",
  "olei-vbd1-10": "vbd1-10-2d-lidar",
  "olei-vss-50": "vss-50-solid-state-3d-lidar",
  "percipio-gm461-e1": "mrdvs-s10-rgbd-camera",
  "percipio-gm465-e1": "mrdvs-s11-rgbd-camera",
  "sintrones-ibox-602p": "sintrones-ibox-602p-edge-ai",
  "sintrones-sbox-2624p": "sintrones-sbox-2624p-embedded",
  "olei-thermal-camera": "thermal-camera",
  "olei-lc-m50g": "lc-m50g-mobile-slam-mapper",
};

/** Hub /downloads/ software when the product page Software tab is empty */
const HUB_DOWNLOAD_IDS = {
  "lr-16f-100-3d-lidar": [709],
  "lr-16fis-explosion-proof-3d-lidar": [709],
  "lr-f240-solid-state-lidar": [2841],
  "a090-laser-rangefinder": [712],
};

/** When a full bundle exceeds the size cap, keep the most important zips first. */
const DOWNLOAD_PRIORITY = {
  "gs1-5-safety-lidar": [2914, 4622, 4625, 4628, 4631, 4604, 4610],
  "lr-1bs2-mini-zone-lidar": [4634, 701, 4616, 4604, 4610],
  "lr-1bs5-mini-lidar": [4634, 701, 4616, 4604, 4610],
  "lr-1f-2d-lidar": [701, 4616, 4604, 4610],
  "vbd1-10-2d-lidar": [701, 4604, 4610],
};

/** Extra zips to merge (hub kits not always linked on the product Software tab) */
const EXTRA_DOWNLOAD_IDS = {
  "gs1-5-safety-lidar": [2914],
  "lr-1f-2d-lidar": [701],
  "lr-1bs2-mini-zone-lidar": [701],
  "lr-1bs5-mini-lidar": [701],
  "vbd1-10-2d-lidar": [701],
};

const CATALOG_SLUGS = [...new Set(Object.values(WP_TO_CATALOG))];

function catalogToWpSlug(catalogSlug) {
  return Object.entries(WP_TO_CATALOG).find(([, c]) => c === catalogSlug)?.[0];
}

async function scrapeSoftwareDownloadIds(wpSlug) {
  const res = await fetch(`${LIVE}/product/${wpSlug}/`);
  if (!res.ok) throw new Error(`Product page HTTP ${res.status}`);
  const html = await res.text();
  const start = html.indexOf('id="SoftwareSection-tab"');
  if (start === -1) return [];
  const chunk = html.slice(start, start + 15000);
  const ids = [...chunk.matchAll(/\/download\/(\d+)\//g)].map((m) => Number(m[1]));
  return [...new Set(ids)];
}

function parseFilename(contentDisposition, fallback) {
  if (!contentDisposition) return fallback;
  const star = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (star) return decodeURIComponent(star[1].trim());
  const plain = contentDisposition.match(/filename="([^"]+)"/i);
  if (plain) return plain[1];
  return fallback;
}

async function fetchDownloadZip(id) {
  const res = await fetch(`${LIVE}/download/${id}/`, { redirect: "follow" });
  if (!res.ok) throw new Error(`download/${id} HTTP ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("zip")) {
    return null;
  }
  const filename = parseFilename(res.headers.get("content-disposition"), `download-${id}.zip`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 32) throw new Error(`download/${id} suspiciously small`);
  return { id, filename: filename.replace(/[^\w.\-()+ ]/g, "_"), buf };
}

function trimZipsToLimit(zips, catalogSlug) {
  const priority = DOWNLOAD_PRIORITY[catalogSlug];
  const ordered = priority
    ? [...zips].sort((a, b) => {
        const ai = priority.indexOf(a.id);
        const bi = priority.indexOf(b.id);
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      })
    : zips;

  const kept = [];
  let total = 0;
  for (const z of ordered) {
    if (total + z.buf.length > MAX_BUNDLE_BYTES) continue;
    kept.push(z);
    total += z.buf.length;
  }
  return kept.length ? kept : ordered.slice(0, 1);
}

function bundleSize(zips) {
  return zips.reduce((n, z) => n + z.buf.length, 0);
}

function bundleZips(files, outPath) {
  if (files.length === 1) {
    writeFileSync(outPath, files[0].buf);
    return files[0].filename.endsWith(".zip") ? files[0].filename : `${files[0].filename}.zip`;
  }
  const dir = mkdtempSync(join(tmpdir(), "mt-sw-"));
  try {
    const names = [];
    for (const f of files) {
      const safe = `${f.id}-${f.filename}`;
      writeFileSync(join(dir, safe), f.buf);
      names.push(safe);
    }
    execFileSync("zip", ["-q", "-j", outPath, ...names], { cwd: dir });
    return "software-bundle.zip";
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function mergeProductSoftware(slug, softwarePath, isExternal = false) {
  const { data: existing } = await sb.from("products").select("data").eq("slug", slug).maybeSingle();
  if (!existing?.data) {
    throw new Error(`Product not in Supabase — run: cd web && pnpm cms:seed`);
  }
  const merged = { ...existing.data, softwarePath, softwareIsExternal: isExternal };
  const { error } = await sb.from("products").upsert(
    { slug, data: merged, status: "published" },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}

async function collectDownloadIds(catalogSlug) {
  const wpSlug = catalogToWpSlug(catalogSlug);
  const scraped = wpSlug ? await scrapeSoftwareDownloadIds(wpSlug) : [];
  const hub = HUB_DOWNLOAD_IDS[catalogSlug] ?? [];
  const extra = EXTRA_DOWNLOAD_IDS[catalogSlug] ?? [];
  return [...new Set([...scraped, ...hub, ...extra])];
}

async function ensureBucketLimit() {
  const { error } = await sb.storage.updateBucket(BUCKET, {
    public: true,
    fileSizeLimit: 262144000,
  });
  if (error && !error.message.includes("not found")) {
    console.warn(`Note: could not raise bucket limit (${error.message}). Run supabase/migrations/006_product_software_limit.sql`);
  }
}

async function main() {
  const targets = CATALOG_SLUGS.filter((s) => !onlySlug || s === onlySlug);
  console.log(dryRun ? "DRY RUN — no uploads\n" : "Importing product software…\n");
  if (!dryRun) await ensureBucketLimit();

  const results = [];

  for (const slug of targets) {
    process.stdout.write(`• ${slug} … `);
    try {
      const ids = await collectDownloadIds(slug);
      if (!ids.length) {
        console.log("skip (no software on live site)");
        results.push({ slug, status: "skip" });
        continue;
      }

      const zips = [];
      const skipped = [];
      for (const id of ids) {
        const file = await fetchDownloadZip(id);
        if (file) zips.push(file);
        else skipped.push(id);
      }

      if (!zips.length) {
        console.log(`skip (download IDs ${ids.join(", ")} are PDFs or missing)`);
        results.push({ slug, status: "skip", ids });
        continue;
      }

      let selected = trimZipsToLimit(zips, slug);
      const trimmed = selected.length < zips.length;
      const label = selected.map((z) => `${z.id}:${z.filename}`).join(", ");
      if (dryRun) {
        const note = skipped.length ? `; skipped non-zip IDs: ${skipped.join(", ")}` : "";
        const trimNote = trimmed ? `; trimmed from ${zips.length} to ${selected.length}` : "";
        console.log(`${selected.length} zip(s) [${label}] (~${(bundleSize(selected) / 1024 / 1024).toFixed(1)} MB)${note}${trimNote}`);
        results.push({ slug, status: "dry-run", count: selected.length });
        continue;
      }

      // Hosted file still too large for bucket — link to live download instead.
      if (selected.length === 1 && selected[0].buf.length > MAX_BUNDLE_BYTES) {
        const url = `${LIVE}/download/${selected[0].id}/`;
        await mergeProductSoftware(slug, url, true);
        console.log(`external link (file ${(selected[0].buf.length / 1024 / 1024).toFixed(1)} MB) → download/${selected[0].id}/`);
        results.push({ slug, status: "external", url });
        continue;
      }

      const tmp = mkdtempSync(join(tmpdir(), "mt-sw-out-"));
      try {
        const outFile = join(tmp, `${slug}.zip`);
        bundleZips(selected, outFile);
        const bytes = readFileSync(outFile);
        const storagePath = `${slug}.zip`;

        let uploadError;
        ({ error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
          contentType: "application/zip",
          upsert: true,
        }));

        if (uploadError?.message?.includes("maximum allowed size") && selected.length > 1) {
          selected = [selected[0]];
          bundleZips(selected, outFile);
          const smaller = readFileSync(outFile);
          ({ error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, smaller, {
            contentType: "application/zip",
            upsert: true,
          }));
          if (!uploadError) {
            const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
            await mergeProductSoftware(slug, publicUrl.publicUrl);
            console.log(`uploaded ${(smaller.length / 1024).toFixed(0)} KB (primary zip only after size limit)`);
            results.push({ slug, status: "ok", bytes: smaller.length, files: 1 });
            continue;
          }
        }

        if (uploadError?.message?.includes("maximum allowed size") && selected.length === 1) {
          const url = `${LIVE}/download/${selected[0].id}/`;
          await mergeProductSoftware(slug, url, true);
          console.log(`external link (bucket limit) → download/${selected[0].id}/`);
          results.push({ slug, status: "external", url });
          continue;
        }

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
        await mergeProductSoftware(slug, publicUrl.publicUrl);
        const note = [
          skipped.length ? `skipped PDF IDs: ${skipped.join(", ")}` : "",
          trimmed ? `bundled ${selected.length}/${zips.length} zips` : "",
        ]
          .filter(Boolean)
          .join("; ");
        console.log(
          `uploaded ${(bytes.length / 1024).toFixed(0)} KB from ${selected.length} file(s)${note ? ` (${note})` : ""}`,
        );
        results.push({ slug, status: "ok", bytes: bytes.length, files: selected.length });
      } finally {
        rmSync(tmp, { recursive: true, force: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAILED — ${msg}`);
      results.push({ slug, status: "error", error: msg });
    }
  }

  const ok = results.filter((r) => r.status === "ok" || r.status === "dry-run").length;
  const skip = results.filter((r) => r.status === "skip").length;
  const fail = results.filter((r) => r.status === "error").length;
  console.log(`\nDone: ${ok} with software, ${skip} skipped (none on live site), ${fail} failed.`);

  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
