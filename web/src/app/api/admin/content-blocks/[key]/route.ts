import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

type Params = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const sb = createServiceClient();
  const { data, error } = await sb.from("content_blocks").select("*").eq("key", decoded).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: Params) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const body = (await request.json()) as { data: unknown; label?: string; group?: string };
  const sb = createServiceClient();
  const { error } = await sb
    .from("content_blocks")
    .upsert({
      key: decoded,
      data: body.data,
      label: body.label ?? decoded,
      group: body.group ?? "Custom",
      updated_at: new Date().toISOString(),
    });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateCms(cmsRevalidateTag);
  revalidateCms(`cms-block-${decoded}`);
  return NextResponse.json({ ok: true });
}
