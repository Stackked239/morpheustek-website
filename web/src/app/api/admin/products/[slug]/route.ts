import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const sb = createServiceClient();
  const { data, error } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
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
  const { error } = await sb.from("products").update(body).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await params;
  const sb = createServiceClient();
  const { error } = await sb.from("products").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}
