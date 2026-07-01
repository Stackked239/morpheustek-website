"use client";

import { useState } from "react";

export function SaveBar({
  onSave,
  status,
  error,
}: {
  onSave: () => void;
  status: "idle" | "saving" | "saved";
  error: string | null;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={status === "saving"}
          className="rounded-md bg-brand-blue px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg disabled:opacity-50"
        >
          {status === "saving" ? "Publishing…" : "Publish changes"}
        </button>
        {status === "saved" ? (
          <span className="text-sm text-success">Published — changes are live on the website.</span>
        ) : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
      </div>
    </div>
  );
}

export function useAdminSave(saveFn: () => Promise<void>) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    setStatus("saving");
    try {
      await saveFn();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setStatus("idle");
    }
  }

  return { save, status, error };
}
