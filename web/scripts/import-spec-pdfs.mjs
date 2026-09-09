#!/usr/bin/env node
/**
 * Scrape spec-sheet PDFs from the live morpheustek.com WordPress site and
 * upload them to Supabase `product-spec-sheets` for the new catalog.
 *
 * Usage (from web/):
 *   node --env-file=.env.local scripts/import-spec-pdfs.mjs
 *   node --env-file=.env.local scripts/import-spec-pdfs.mjs --dry-run
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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
const BUCKET = "product-spec-sheets";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * new catalog slug → best spec PDF on the live WordPress site
 *
 * The MRDVS S10 / S10 Ultra / S11 are deliberately absent: they now ship with
 * official MorpheusTEK spec sheets committed under `public/spec-sheets/`. The
 * old site only had stand-in Percipio flyers (GM461/GM465) for the S10 and S11,
 * so re-scraping them here would overwrite the real sheets with the stand-ins.
 */
const SPEC_MAP = [
  {
    slug: "lr-16f-100-3d-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/LR-16F-EN-2025.05｣ｨOnly-can-be-edited-in-PS｣ｩ.pdf",
    note: "WP product page wrongly links LR-16FIS; media library has correct LR-16F EN 2025",
  },
  {
    slug: "lr-1f-2d-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2023/06/LR-1F-EN-Update2.pdf",
  },
  {
    slug: "a090-laser-rangefinder",
    url: "https://morpheustek.com/wp-content/uploads/2023/06/A090-A200-EN.pdf",
  },
  {
    slug: "gs1-5-safety-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/GS1-5-EN-2025.06｣ｨOnly-can-be-edited-in-PS｣ｩ.pdf",
  },
  {
    slug: "lr-1bs2-mini-zone-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/LR-1BS2-V2-EN-2025.07｣ｨOnly-can-be-edited-in-PS｣ｩ.pdf",
    note: "Live page links 57 MB PDF (over storage limit); using 2025 V2 EN datasheet from media library",
  },
  {
    slug: "lr-1bs5-mini-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/LR-1BS5-V2-EN-2025.07｣ｨOnly-can-be-edited-in-PS｣ｩ.pdf",
  },
  {
    slug: "lr-16fis-explosion-proof-3d-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/LR-16FIS-EN-2024｣ｨOnly-can-be-edited-in-PS｣ｩ.pdf",
  },
  {
    slug: "lr-dds-2-tripod-3d-mapper",
    url: "https://morpheustek.com/wp-content/uploads/2024/03/3D-Scanner-DDS-2-compressed.pdf",
    note: "Gated on live site; found in WP media library",
  },
  {
    slug: "lr-f240-solid-state-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2024/04/LR-F240-EN-datasheet.pdf",
    note: "Gated on live site; found in WP media library",
  },
  {
    slug: "vbd1-10-2d-lidar",
    url: "https://morpheustek.com/wp-content/uploads/2025/12/VBD1-10-Olei-Datasheet.pdf",
  },
  {
    slug: "vss-50-solid-state-3d-lidar",
    url: "https://morpheustek.com/wp-content/uploads/dlm_uploads/2026/01/VSS-50-EN-2025.12.pdf",
  },
  {
    slug: "sintrones-ibox-602p-edge-ai",
    url: "https://morpheustek.com/wp-content/uploads/2025/12/IBOX-602P-IP66_Manual_20260302.pdf",
    note: "Live site links manual (no separate datasheet for 602P)",
  },
  {
    slug: "sintrones-sbox-2624p-embedded",
    url: "https://morpheustek.com/wp-content/uploads/dlm_uploads/2026/01/SBOX-2624P_Datasheet_20251231.pdf",
  },
  {
    slug: "thermal-camera",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/CBT-3C-EN-2023.11.pdf",
  },
  {
    slug: "lc-m50g-mobile-slam-mapper",
    url: "https://morpheustek.com/wp-content/uploads/2021/02/3D-Scanner-LC-M50G-EN-2025.12.pdf",
    note: "Gated on live site; found in WP media library",
  },
];

async function fetchPdf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("pdf") && !url.toLowerCase().includes(".pdf")) {
    throw new Error(`Unexpected content-type ${ct} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error(`Suspiciously small file (${buf.length} bytes)`);
  if (buf.slice(0, 4).toString() !== "%PDF") throw new Error("Not a valid PDF (missing %PDF header)");
  return buf;
}

async function mergeProductData(slug, specSheetPath) {
  const { data: existing } = await sb.from("products").select("data").eq("slug", slug).maybeSingle();
  if (!existing?.data) {
    throw new Error(`Product not in Supabase — run: cd web && pnpm cms:seed`);
  }
  const merged = { ...existing.data, specSheetPath };
  const { error } = await sb.from("products").upsert(
    { slug, data: merged, status: "published" },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
  return merged;
}

async function main() {
  console.log(dryRun ? "DRY RUN — no uploads\n" : "Importing spec sheet PDFs…\n");
  const results = [];

  for (const item of SPEC_MAP.filter((i) => !onlySlug || i.slug === onlySlug)) {
    const { slug, url, note } = item;
    process.stdout.write(`• ${slug} … `);
    try {
      if (dryRun) {
        const head = await fetch(url, { method: "HEAD" });
        if (!head.ok) throw new Error(`HEAD ${head.status}`);
        console.log(`OK (${head.headers.get("content-length") ?? "?"} bytes)${note ? ` — ${note}` : ""}`);
        results.push({ slug, status: "dry-run", url });
        continue;
      }

      const bytes = await fetchPdf(url);
      const storagePath = `${slug}.pdf`;
      const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
      await mergeProductData(slug, publicUrl.publicUrl);
      console.log(`uploaded (${(bytes.length / 1024).toFixed(0)} KB)${note ? ` — ${note}` : ""}`);
      results.push({ slug, status: "ok", path: publicUrl.publicUrl });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAILED — ${msg}`);
      results.push({ slug, status: "error", error: msg });
    }
  }

  const ok = results.filter((r) => r.status === "ok" || r.status === "dry-run").length;
  const fail = results.filter((r) => r.status === "error").length;
  console.log(`\nDone: ${ok} ok, ${fail} failed, ${SPEC_MAP.length} total.`);

  const noPdf = ["mrdvs-v2-pro-fusion-slam-rtls"];
  if (noPdf.length) {
    console.log("\nNo matching PDF on live site (auto-generated spec sheet fallback):");
    for (const s of noPdf) console.log(`  - ${s}`);
  }

  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
