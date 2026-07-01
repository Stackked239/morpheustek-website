import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

const TABLES = ["categories", "applications", "resources", "products"] as const;

type Params = { params: Promise<{ table: string; slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { table, slug } = await params;
  if (!(TABLES as readonly string[]).includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  const sb = createServiceClient();
  const { data, error } = await sb.from(table).select("*").eq("slug", slug).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { table, slug } = await params;
  if (!(TABLES as readonly string[]).includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  const body = await request.json();
  const sb = createServiceClient();
  const { error } = await sb.from(table).update(body).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}
