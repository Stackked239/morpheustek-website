import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { buildSitePageOptions } from "@/lib/admin/site-pages";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const pages = await buildSitePageOptions();
  return NextResponse.json(pages);
}
