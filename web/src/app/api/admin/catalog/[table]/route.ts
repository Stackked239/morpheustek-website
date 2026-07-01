import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

const TABLES = ["categories", "applications", "resources"] as const;
type Table = (typeof TABLES)[number];

function isTable(t: string): t is Table {
  return (TABLES as readonly string[]).includes(t);
}

type Params = { params: Promise<{ table: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { table } = await params;
  if (!isTable(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  const sb = createServiceClient();
  const { data, error } = await sb.from(table).select("slug, data, status, sort_order").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { table } = await params;
  if (!isTable(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  const body = (await request.json()) as { slug: string; data: unknown; status?: string; sort_order?: number };
  const sb = createServiceClient();
  const { error } = await sb.from(table).upsert({
    slug: body.slug,
    data: body.data,
    status: body.status ?? "published",
    sort_order: body.sort_order ?? 0,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}
