import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-images";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug) return NextResponse.json({ error: "Missing product slug" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const storagePath = `${slug}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const sb = createServiceClient();
  const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  const path = publicUrl.publicUrl;

  const { error: dbError } = await sb.from("product_images").upsert({ slug, path }, { onConflict: "slug" });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true, path });
}
