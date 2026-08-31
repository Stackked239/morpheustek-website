import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "blog-images";
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const rawSlug = String(form.get("slug") ?? "").trim();
  const slug = rawSlug || `draft-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  const file = form.get("file");

  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 4 MB)" }, { status: 400 });

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
  return NextResponse.json({ ok: true, path: publicUrl.publicUrl });
}
