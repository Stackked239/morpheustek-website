import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { createServiceClient } from "@/lib/supabase/server";
import { getLeadMagnet as getSeedLeadMagnet } from "@/lib/catalog";

const BUCKET = "resource-pdfs";
const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug) return NextResponse.json({ error: "Missing resource slug" }, { status: 400 });
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

  const { data: existing } = await sb.from("resources").select("data").eq("slug", slug).maybeSingle();
  const seed = getSeedLeadMagnet(slug);
  const merged = { ...(seed ?? {}), ...(existing?.data as Record<string, unknown> | undefined), pdfPath: path };

  const { error: dbError } = await sb.from("resources").upsert(
    { slug, data: merged, status: "published" },
    { onConflict: "slug" },
  );
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true, path });
}
