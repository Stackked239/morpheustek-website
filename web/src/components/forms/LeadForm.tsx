"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const inputCls =
  "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-text outline-none transition-colors placeholder:text-text-subtle focus:border-border-strong focus-visible:outline-2";
const labelCls = "mb-1.5 block text-sm font-medium text-text";

const defaultRobotTypes = [
  "AMR",
  "AGV",
  "Autonomous forklift",
  "Robotic cleaning",
  "Outdoor mobile robot",
  "Inspection robot",
  "Other / not sure yet",
];

/**
 * Gated lead form. Required: name, company, business email, application/use case.
 * Phase 1: validates and shows a confirmation. Phase 2 wires the submit to the
 * /api/lead route -> HubSpot (contact + company + deal + nurture).
 */
export function LeadForm({
  intent = "meeting",
  submitLabel = "Book a meeting",
  mode = "meeting",
  downloadUrl,
  robotTypes = defaultRobotTypes,
}: {
  intent?: string;
  submitLabel?: string;
  mode?: "meeting" | "download";
  downloadUrl?: string;
  robotTypes?: string[];
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Honeypot — silently drop bots. The field name must stay meaningless:
    // autofill-recognizable names (company_url) get filled by real browsers
    // and silently eat real submissions.
    if ((form.elements.namedItem("mt_hp") as HTMLInputElement | null)?.value) return;
    setStatus("submitting");
    try {
      const formData = new FormData(form);
      const res = await fetch("/api/lead", { method: "POST", body: formData });
      if (!res.ok) {
        setStatus("error");
        return;
      }
    } catch {
      setStatus("error");
      return;
    }
    setStatus("done");
    // Instant access: trigger the download immediately (no waiting on email).
    if (mode === "download" && downloadUrl) {
      const a = document.createElement("a");
      // The download attribute is ignored cross-origin; Supabase storage
      // honors ?download= by serving Content-Disposition: attachment.
      a.href = downloadUrl.includes("/storage/") && !downloadUrl.includes("?")
        ? `${downloadUrl}?download=`
        : downloadUrl;
      a.setAttribute("download", "");
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  if (status === "done" && mode === "download") {
    return (
      <div className="surface-card flex flex-col items-start gap-4 p-7">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="font-display text-h4 font-bold text-text-strong">Your download is ready.</h3>
        <p className="text-sm leading-relaxed text-text-muted">
          Instant access — no waiting on an email.{" "}
          {downloadUrl ? "It should start automatically; if not, use the button below." : "A copy is on its way to your inbox too."}
        </p>
        {downloadUrl ? (
          <Button href={downloadUrl} variant="primary" size="md">
            Download again
          </Button>
        ) : null}
        <Button href="/book-a-meeting?intent=engineer" variant="ghost" size="md">
          Talk to an engineer
        </Button>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="surface-card flex flex-col items-start gap-4 p-7">
        <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="font-display text-h4 font-bold text-text-strong">Thanks — we&apos;ll be in touch.</h3>
        <p className="text-sm leading-relaxed text-text-muted">
          A MorpheusTEK engineer will reach out shortly to understand your application and line up the right sensing
          solution — and, if it fits, a 90-day trial unit. Watch your inbox.
        </p>
        <Button href="/resources" variant="ghost" size="md">
          Grab a guide while you wait
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card grid gap-4 p-6 sm:p-7">
      <input type="hidden" name="intent" value={intent} />
      {/* honeypot — meaningless name so browser autofill never touches it */}
      <input
        type="text"
        name="mt_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className={labelCls}>
            Full name <span className="text-eye">*</span>
          </label>
          <input id="lf-name" name="name" required autoComplete="name" className={inputCls} placeholder="Jane Engineer" />
        </div>
        <div>
          <label htmlFor="lf-company" className={labelCls}>
            Company <span className="text-eye">*</span>
          </label>
          <input id="lf-company" name="company" required autoComplete="organization" className={inputCls} placeholder="Acme Robotics" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-email" className={labelCls}>
            Business email <span className="text-eye">*</span>
          </label>
          <input id="lf-email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="jane@acme.com" />
        </div>
        <div>
          <label htmlFor="lf-phone" className={labelCls}>
            Phone <span className="text-text-subtle">(optional)</span>
          </label>
          <input id="lf-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} placeholder="(555) 555-5555" />
        </div>
      </div>
      <div>
        <label htmlFor="lf-robot" className={labelCls}>
          What are you building?
        </label>
        <select id="lf-robot" name="robotType" className={inputCls} defaultValue="">
          <option value="" disabled>
            Select a platform…
          </option>
          {robotTypes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lf-app" className={labelCls}>
          What does your robot need to sense? <span className="text-eye">*</span>
        </label>
        <textarea
          id="lf-app"
          name="application"
          required
          rows={4}
          className={`${inputCls} h-auto py-3 leading-relaxed`}
          placeholder="e.g. 270° safety stop on an AMR, 50 m navigation, pallet detection at 0.3–3 m…"
        />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={status === "submitting"} className="mt-1 w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          submitLabel
        )}
      </Button>
      {status === "error" ? (
        <p className="text-sm font-medium text-eye" role="alert">
          Something went wrong sending your details — please try again, or email us and we&apos;ll sort it out.
        </p>
      ) : null}
      <p className="text-xs leading-relaxed text-text-subtle">
        We&apos;ll only use this to talk about your application. No spam — and you can ask us to delete it anytime.
      </p>
    </form>
  );
}
