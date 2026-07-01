"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AdminField, AdminSection } from "@/components/admin/forms/AdminField";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

export function ProductImageUpload({ slug, currentPath }: { slug: string; currentPath?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPath ?? null);
  const [file, setFile] = useState<File | null>(null);

  const { save, status, error } = useAdminSave(async () => {
    if (!file) throw new Error("Choose an image first");
    const form = new FormData();
    form.append("slug", slug);
    form.append("file", file);
    const res = await fetch("/api/admin/upload/product-image", { method: "POST", body: form });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Upload failed");
    }
    const data = await res.json();
    setPreview(data.path);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  });

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  const isRemote = preview?.startsWith("http");

  return (
    <AdminSection title="Product photo" description="Upload a new image. JPEG, PNG, or WebP — max 10 MB. Replaces the current photo on save.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-bg-muted">
          {preview ? (
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-contain"
              unoptimized={isRemote}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">No image yet</div>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <AdminField label="Choose file">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onPick}
              className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text"
            />
          </AdminField>
          {currentPath && !file ? (
            <p className="text-xs text-text-muted">
              Current: <code className="font-mono">{currentPath}</code>
            </p>
          ) : null}
        </div>
      </div>
      <SaveBar onSave={save} status={status} error={error} />
    </AdminSection>
  );
}
