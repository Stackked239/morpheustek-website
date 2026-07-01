import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { revalidateCms } from "@/lib/cms/revalidate";
import { cmsRevalidateTag } from "@/lib/cms";
import { blogRevalidateTag } from "@/lib/cms/blog";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const sb = createServiceClient();
  const { data, error } = await sb.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const body = await request.json();
  const sb = createServiceClient();

  const patch: Record<string, unknown> = {
    title: body.title,
    excerpt: body.excerpt ?? null,
    body: body.body ?? "",
    status: body.status ?? "draft",
    updated_at: new Date().toISOString(),
  };

  if (body.status === "published") {
    patch.published_at = body.published_at ?? new Date().toISOString();
  } else if (body.status === "draft") {
    patch.published_at = null;
  }

  const { error } = await sb.from("blog_posts").update(patch).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateCms(cmsRevalidateTag);
  revalidateCms(blogRevalidateTag);
  revalidateCms(`cms-blog-post-${slug}`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const sb = createServiceClient();
  const { error } = await sb.from("blog_posts").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateCms(cmsRevalidateTag);
  revalidateCms(blogRevalidateTag);
  revalidateCms(`cms-blog-post-${slug}`);
  return NextResponse.json({ ok: true });
}
