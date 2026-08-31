"use client";

import { useRef, useState } from "react";
import { AdminField, AdminSection } from "@/components/admin/forms/AdminField";

export function BlogDocumentImport({
  onImported,
  confirmReplace,
}: {
  onImported: (data: { title: string; excerpt: string; slug: string; body: string }) => void;
  confirmReplace: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedName, setImportedName] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (confirmReplace && !window.confirm("Replace the current draft with this document?")) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setImporting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/blog/import", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? `Import failed (${res.status})`);
      if (!data?.body) throw new Error("Import failed");
      onImported({
        title: String(data.title ?? ""),
        excerpt: String(data.excerpt ?? ""),
        slug: String(data.slug ?? ""),
        body: String(data.body),
      });
      setImportedName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <AdminSection
      title="Import a draft"
      description="Already wrote this in Word or Google Docs? Upload the file and we'll fill the title and article — you can edit everything after."
    >
      <AdminField
        label="Choose file"
        hint="Word (.docx), Markdown, HTML, or plain text — keep under 4 MB. Google Docs: File → Download → Microsoft Word."
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,.md,.markdown,.txt,.html,.htm,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain,text/html"
          disabled={importing}
          onChange={onPick}
          className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text disabled:opacity-50"
        />
      </AdminField>
      {importing ? (
        <p role="status" className="text-sm text-text-muted">
          Importing…
        </p>
      ) : null}
      {importedName ? (
        <p role="status" className="text-sm text-success">
          Imported {importedName}. Review the sections below, then save.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </AdminSection>
  );
}
