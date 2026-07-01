"use client";

import { useState } from "react";

export function JsonEditor({
  initial,
  onSave,
  label,
}: {
  initial: string;
  label?: string;
  onSave: (parsed: unknown) => Promise<void>;
}) {
  const [text, setText] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSave() {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("Invalid JSON — fix syntax before saving.");
      return;
    }
    setStatus("saving");
    try {
      await onSave(parsed);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("idle");
    }
  }

  return (
    <div className="space-y-3">
      {label ? (
        <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p>
      ) : null}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="min-h-[28rem] w-full rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-text outline-none focus:border-border-strong focus-visible:ring-2 focus-visible:ring-brand-blue/40"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-md bg-brand-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" ? (
          <span className="font-mono text-xs text-success">Saved — site cache cleared.</span>
        ) : null}
      </div>
    </div>
  );
}
