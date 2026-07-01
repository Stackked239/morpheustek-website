import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const sb = createServiceClient();
  const { data, error } = await sb.from("products").select("slug, data, status, sort_order").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = (await request.json()) as { slug: string; data: unknown; status?: string; sort_order?: number };
  const sb = createServiceClient();
  const { error } = await sb.from("products").upsert({
    slug: body.slug,
    data: body.data,
    status: body.status ?? "published",
    sort_order: body.sort_order ?? 0,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}
