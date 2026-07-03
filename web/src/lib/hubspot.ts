// Server-only HubSpot Forms Submission API client.
// Leads submit to per-intent HubSpot forms so they land as real form
// submissions (attribution + workflow triggers), not bare CRM contacts.
// The Supabase `submissions` table remains the durable log — a HubSpot
// failure must never lose a lead or fail the visitor's request.

const PORTAL_ID = "22485651";

// Form GUIDs created via the Marketing Forms API ("Website — …" forms in HubSpot).
const FORM_GUIDS = {
  contact: "87cb212c-0832-4ae7-8eae-3f25c19ff821",
  meeting: "ceb1d359-50c8-4c36-85bf-bcf5099449e9",
  booth: "0e3d597b-9c08-4c1c-85e8-6b6cfb080389",
  download: "ee2926d9-87aa-4e02-a878-6d44cf6e96c4",
} as const;

// Intent strings from LeadForm: "contact", "booth", "download:<resource-slug>",
// and the book-a-meeting family "meeting" | "trial" | "engineer" | "quote",
// optionally suffixed ":<product-slug>".
function formGuidForIntent(intent: string): string {
  const base = intent.split(":")[0];
  if (base === "contact") return FORM_GUIDS.contact;
  if (base === "booth") return FORM_GUIDS.booth;
  if (base === "download") return FORM_GUIDS.download;
  return FORM_GUIDS.meeting;
}

export type LeadPayload = {
  intent: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  robotType: string;
  application: string;
};

export type LeadContext = {
  pageUri?: string;
  hutk?: string;
};

export async function submitLeadToHubSpot(payload: LeadPayload, context: LeadContext = {}) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");

  const [firstname, ...rest] = payload.name.trim().split(/\s+/);
  const lastname = rest.join(" ");

  const fields = [
    { name: "firstname", value: firstname },
    { name: "lastname", value: lastname },
    { name: "company", value: payload.company },
    { name: "email", value: payload.email },
    { name: "phone", value: payload.phone },
    { name: "robot_type", value: payload.robotType },
    { name: "application_description", value: payload.application },
    { name: "lead_intent", value: payload.intent },
  ]
    .filter((f) => f.value)
    .map((f) => ({ objectTypeId: "0-1", ...f }));

  const formGuid = formGuidForIntent(payload.intent);
  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/secure/submit/${PORTAL_ID}/${formGuid}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields,
        context: {
          ...(context.hutk ? { hutk: context.hutk } : {}),
          ...(context.pageUri ? { pageUri: context.pageUri } : {}),
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`HubSpot submission failed (${res.status}): ${await res.text()}`);
  }
}
