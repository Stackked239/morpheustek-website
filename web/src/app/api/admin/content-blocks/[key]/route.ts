import { NextResponse } from "next/server";
import { revalidateCms } from "@/lib/cms/revalidate";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

type Params = { params: Promise<{ key: string }> };

type ShowsPayload = { shows?: { name?: string; city?: string; when?: string; next?: boolean }[] };
type TopBarData = { message?: string; href?: string; boothCta?: string };

/**
 * Saving the shows page drives the site-wide announcement bar: the show marked
 * "Next up" becomes the banner message. Link + right-side CTA are preserved so
 * a manually customized banner destination survives the sync.
 */
async function syncTopBarToNextShow(sb: ReturnType<typeof createServiceClient>, payload: ShowsPayload) {
  const nextShow = payload.shows?.find((s) => s?.next && s.name);
  if (!nextShow?.name) return;
  const detail = [nextShow.when, nextShow.city].filter(Boolean).join(", ");
  const message = detail ? `Catch us at ${nextShow.name} — ${detail}` : `Catch us at ${nextShow.name}`;

  const { data: row } = await sb.from("content_blocks").select("data").eq("key", "layout.topbar").maybeSingle();
  const current = (row?.data ?? {}) as TopBarData;
  await sb.from("content_blocks").upsert({
    key: "layout.topbar",
    data: {
      href: "/shows/meet-us-at-the-booth",
      boothCta: "Meet us at the booth →",
      ...current,
      message,
    },
    label: "Top bar announcement",
    group: "Layout",
    updated_at: new Date().toISOString(),
  });
  revalidateCms("cms-block-layout.topbar");
}

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
  if (decoded === "page.shows") {
    await syncTopBarToNextShow(sb, (body.data ?? {}) as ShowsPayload);
  }
  revalidateCms(cmsRevalidateTag);
  revalidateCms(`cms-block-${decoded}`);
  return NextResponse.json({ ok: true });
}
