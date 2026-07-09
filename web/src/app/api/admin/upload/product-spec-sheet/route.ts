import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { mergeProductData } from "@/lib/admin/product-data";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-spec-sheets";
const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing PDF file" }, { status: 400 });
  if (file.type !== "application/pdf") return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 400 });

  const storagePath = `${slug}.pdf`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const sb = createServiceClient();

  const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  const path = publicUrl.publicUrl;

  try {
    await mergeProductData(slug, { specSheetPath: path });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Database update failed" }, { status: 500 });
  }

  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true, path });
}
