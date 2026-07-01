import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { blogRevalidateTag } from "@/lib/cms/blog";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const sb = createServiceClient();
  const { data, error } = await sb.from("blog_posts").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const slug = String(body.slug ?? "").trim();
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  const sb = createServiceClient();
  const row = {
    slug,
    title: String(body.title ?? "Untitled post"),
    excerpt: body.excerpt ?? null,
    body: String(body.body ?? ""),
    status: body.status ?? "draft",
    published_at: body.status === "published" ? body.published_at ?? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateCms(cmsRevalidateTag);
  revalidateCms(blogRevalidateTag);
  revalidateCms(`cms-blog-post-${slug}`);
  return NextResponse.json({ ok: true });
}
