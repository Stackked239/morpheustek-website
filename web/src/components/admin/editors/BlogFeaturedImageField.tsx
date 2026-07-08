"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AdminField, AdminInput } from "@/components/admin/forms/AdminField";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function BlogFeaturedImageField({
  slug,
  image,
  imageAlt,
  onChange,
}: {
  slug: string;
  image: string;
  imageAlt: string;
  onChange: (patch: { image?: string; imageAlt?: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image is over 4 MB — please compress it first.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("slug", slug);
      form.append("file", file);
      const res = await fetch("/api/admin/upload/blog-image", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? `Upload failed (${res.status})`);
      if (!data?.path) throw new Error("Upload failed");
      // Cache-bust: the bucket path is per-slug, so replacing an image keeps the same URL.
      onChange({ image: `${data.path}?v=${Date.now()}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="relative aspect-[16/10] w-full max-w-xs shrink-0 overflow-hidden rounded-lg border border-border bg-bg-muted">
        {image ? (
          <Image src={image} alt={imageAlt || "Featured image preview"} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">No image yet</div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        <AdminField label="Choose file" hint={slug ? "JPEG, PNG, WebP, or GIF — keep under 4 MB (host request limit). Uploads immediately; save the post to keep it." : "Set the URL slug first, then upload."}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={!slug || uploading}
            onChange={onPick}
            className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text disabled:opacity-50"
          />
        </AdminField>
        <AdminField label="Image description (alt text)" hint="Describes the image for screen readers and SEO.">
          <AdminInput
            value={imageAlt}
            onChange={(e) => onChange({ imageAlt: e.target.value })}
            placeholder="LiDAR point cloud sweeping a warehouse aisle"
          />
        </AdminField>
        {uploading ? <p role="status" className="text-sm text-text-muted">Uploading…</p> : null}
        {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
        {image ? (
          <button type="button" onClick={() => onChange({ image: "", imageAlt: "" })} className="text-xs font-medium text-danger hover:underline">
            Remove image
          </button>
        ) : null}
      </div>
    </div>
  );
}
