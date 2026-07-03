import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { submitLeadToHubSpot } from "@/lib/hubspot";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    // mt_hp is the current honeypot; company_url covers clients on cached HTML.
    // A filled honeypot marks the submission as a suspected bot, but never
    // discards it — overzealous autofill extensions fill hidden fields on real
    // browsers too. Flagged rows land in Supabase (reviewable) and skip HubSpot.
    const suspectedBot = Boolean(
      String(form.get("mt_hp") ?? "") || String(form.get("company_url") ?? ""),
    );

    const payload = {
      intent: String(form.get("intent") ?? "contact"),
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      robotType: String(form.get("robotType") ?? ""),
      application: String(form.get("application") ?? ""),
    };

    if (!payload.name || !payload.company || !payload.email || !payload.application) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sb = createServiceClient();
      const { error } = await sb.from("submissions").insert({
        form_type: payload.intent,
        payload,
        status: suspectedBot ? "flagged" : "pending",
      });
      if (error) console.error("Supabase submissions insert failed:", error);
    }

    if (!suspectedBot && process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        const cookies = request.headers.get("cookie") ?? "";
        const hutk = cookies.match(/(?:^|;\s*)hubspotutk=([^;]+)/)?.[1];
        await submitLeadToHubSpot(payload, {
          pageUri: request.headers.get("referer") ?? undefined,
          hutk,
        });
      } catch (err) {
        // Lead is already in Supabase — never fail the visitor on a HubSpot error.
        console.error("HubSpot lead sync failed:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
