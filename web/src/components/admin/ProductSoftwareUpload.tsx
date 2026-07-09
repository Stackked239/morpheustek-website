"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { AdminField, AdminInput, AdminSection } from "@/components/admin/forms/AdminField";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

type Mode = "file" | "url";

export function ProductSoftwareUpload({
  slug,
  currentPath,
  isExternal,
}: {
  slug: string;
  currentPath?: string;
  isExternal?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(currentPath ?? "");
  const [external, setExternal] = useState(Boolean(isExternal));
  const [mode, setMode] = useState<Mode>(isExternal ? "url" : "file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState(isExternal ? (currentPath ?? "") : "");

  const { save, status, error } = useAdminSave(async () => {
    if (mode === "file") {
      if (!file) throw new Error("Choose a file first");
      const form = new FormData();
      form.append("slug", slug);
      form.append("file", file);
      const res = await fetch("/api/admin/upload/product-software", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }
      const data = await res.json();
      setPath(data.path);
      setExternal(false);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
      return;
    }

    if (!url.trim()) throw new Error("Enter a software download URL");
    const res = await fetch("/api/admin/upload/product-software", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, url: url.trim() }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Save failed");
    }
    const data = await res.json();
    setPath(data.path);
    setExternal(true);
    router.refresh();
  });

  return (
    <AdminSection
      title="Software / applications"
      description="Optional SDK, driver, or application package. When set, the Software button appears on the product page."
    >
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" name={`sw-mode-${slug}`} checked={mode === "file"} onChange={() => setMode("file")} />
          Upload file (.zip, .exe, …)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name={`sw-mode-${slug}`} checked={mode === "url"} onChange={() => setMode("url")} />
          External download link
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-muted text-brand-blue">
          <Download className="size-10" />
        </div>
        <div className="flex-1 space-y-3">
          {mode === "file" ? (
            <AdminField label="Choose file">
              <input
                ref={inputRef}
                type="file"
                accept=".zip,.gz,.tgz,.tar,.exe,.dmg,application/zip,application/gzip,application/x-tar,application/octet-stream"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text"
              />
            </AdminField>
          ) : (
            <AdminField label="Software download URL" hint="OLEI portal, Google Drive direct link, etc.">
              <AdminInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </AdminField>
          )}
          {path ? (
            <p className="text-xs text-text-muted">
              Current:{" "}
              <a href={path} target="_blank" rel="noopener noreferrer" className="font-mono text-brand-blue hover:underline">
                {path}
              </a>
              {external ? " (external link)" : " (hosted file)"}
            </p>
          ) : (
            <p className="text-xs text-text-muted">No software configured — the Software button is hidden on the live product page.</p>
          )}
        </div>
      </div>
      <SaveBar onSave={save} status={status} error={error} />
    </AdminSection>
  );
}
