import { revalidateCms } from "@/lib/cms/revalidate";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { cmsRevalidateTag } from "@/lib/cms";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  revalidateCms(cmsRevalidateTag);
  return NextResponse.json({ ok: true });
}
