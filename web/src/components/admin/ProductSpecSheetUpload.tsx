"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { AdminField, AdminSection } from "@/components/admin/forms/AdminField";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

export function ProductSpecSheetUpload({
  slug,
  currentPath,
  direct,
}: {
  slug: string;
  currentPath?: string;
  direct?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState(currentPath ?? "");
  const [file, setFile] = useState<File | null>(null);

  const { save, status, error } = useAdminSave(async () => {
    if (!file) throw new Error("Choose a PDF first");
    const form = new FormData();
    form.append("slug", slug);
    form.append("file", file);
    const res = await fetch("/api/admin/upload/product-spec-sheet", { method: "POST", body: form });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Upload failed");
    }
    const data = await res.json();
    setPath(data.path);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  });

  return (
    <AdminSection
      title="Spec sheet PDF"
      description="Optional official manufacturer PDF. If none is uploaded, visitors get the auto-generated spec sheet (print/save as PDF) after the gate form."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-muted text-brand-blue">
          <FileText className="size-10" />
        </div>
        <div className="flex-1 space-y-3">
          <AdminField label="Choose PDF">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text"
            />
          </AdminField>
          {path ? (
            <>
              <p className="text-xs text-text-muted">
                Current:{" "}
                <a href={path} target="_blank" rel="noopener noreferrer" className="font-mono text-brand-blue hover:underline">
                  {path}
                </a>
              </p>
              <p className="text-xs text-text-muted">
                {direct
                  ? "Downloads directly from the product page — no lead form, so these visits are not captured."
                  : "Released after the lead-capture form."}
              </p>
            </>
          ) : (
            <p className="text-xs text-text-muted">
              No official PDF — visitors receive the{" "}
              <a href={`/templates/spec-sheet/${slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                auto-generated spec sheet
              </a>{" "}
              after the gate form.
            </p>
          )}
        </div>
      </div>
      <SaveBar onSave={save} status={status} error={error} />
    </AdminSection>
  );
}
