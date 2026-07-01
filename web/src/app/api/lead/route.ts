import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const honeypot = String(form.get("company_url") ?? "");
    if (honeypot) return NextResponse.json({ ok: true });

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
      await sb.from("submissions").insert({
        form_type: payload.intent,
        payload,
        status: "pending",
      });
    }

    // HubSpot wiring lands here in a follow-up — submissions table is the durable log.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
