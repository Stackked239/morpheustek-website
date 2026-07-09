import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { mergeProductData } from "@/lib/admin/product-data";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-software";
const MAX_BYTES = 100 * 1024 * 1024;

const EXT_MIME: Record<string, string> = {
  zip: "application/zip",
  gz: "application/gzip",
  tgz: "application/gzip",
  tar: "application/x-tar",
  exe: "application/x-msdownload",
  dmg: "application/x-apple-diskimage",
};

function mimeForFile(file: File) {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? "application/octet-stream";
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing software file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 100 MB)" }, { status: 400 });

  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
  const storagePath = `${slug}.${ext}`;
  const contentType = mimeForFile(file);
  const bytes = Buffer.from(await file.arrayBuffer());
  const sb = createServiceClient();

  const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  const path = publicUrl.publicUrl;

  try {
    await mergeProductData(slug, { softwarePath: path, softwareIsExternal: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Database update failed" }, { status: 500 });
  }

  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true, path });
}

/** Save an external software URL (no file upload). */
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const slug = String(body.slug ?? "").trim();
  const url = String(body.url ?? "").trim();

  if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });
  if (!url) return NextResponse.json({ error: "Missing software URL" }, { status: 400 });
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    await mergeProductData(slug, { softwarePath: url, softwareIsExternal: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Database update failed" }, { status: 500 });
  }

  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true, path: url });
}
