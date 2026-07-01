"use client";

import { useState } from "react";
import type { Category, Application, LeadMagnet, CategorySlug } from "@/lib/catalog";
import { AdminField, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "@/components/admin/forms/AdminField";
import { StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";
import { ResourcePdfUpload } from "@/components/admin/ResourcePdfUpload";

const CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "lidar-for-robotics", label: "2D LiDAR" },
  { value: "safety-lidar", label: "Safety LiDAR" },
  { value: "3d-lidar-for-robotics", label: "3D LiDAR" },
  { value: "solid-state-lidar", label: "Solid-state LiDAR" },
  { value: "3d-cameras-for-robotics", label: "3D cameras" },
  { value: "rangefinders", label: "Rangefinders" },
  { value: "3d-mapping", label: "3D mapping" },
  { value: "edge-compute", label: "Edge compute" },
];

export function CategoryForm({ slug, initial }: { slug: string; initial: Category }) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/catalog/categories/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <FormShell save={save} status={status} error={error}>
      <AdminSection title="Category page">
        <AdminField label="Menu label (short)">
          <AdminInput value={data.label} onChange={(e) => setData({ ...data, label: e.target.value })} />
        </AdminField>
        <AdminField label="Page title (H1)">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="SEO keyword phrase">
          <AdminInput value={data.keyword} onChange={(e) => setData({ ...data, keyword: e.target.value })} />
        </AdminField>
        <AdminField label="Short blurb">
          <AdminTextarea rows={2} value={data.blurb} onChange={(e) => setData({ ...data, blurb: e.target.value })} />
        </AdminField>
        <AdminField label="Intro paragraph">
          <AdminTextarea rows={4} value={data.intro} onChange={(e) => setData({ ...data, intro: e.target.value })} />
        </AdminField>
        <AdminField label="URL slug" hint="Changing this affects the page URL. Contact your developer if unsure.">
          <AdminSelect value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value as CategorySlug })}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} (/{c.value})
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      </AdminSection>
    </FormShell>
  );
}

export function ApplicationForm({ slug, initial }: { slug: string; initial: Application }) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/catalog/applications/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <FormShell save={save} status={status} error={error}>
      <AdminSection title="Application page">
        <AdminField label="Title">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="The problem (pain point)">
          <AdminTextarea rows={3} value={data.pain} onChange={(e) => setData({ ...data, pain: e.target.value })} />
        </AdminField>
        <AdminField label="How MorpheusTEK fits">
          <AdminTextarea rows={3} value={data.fit} onChange={(e) => setData({ ...data, fit: e.target.value })} />
        </AdminField>
        <StringListEditor
          label="Recommended product slugs"
          items={data.sensors}
          onChange={(sensors) => setData({ ...data, sensors })}
          placeholder="lr-1f-2d-lidar"
        />
        <p className="text-xs text-text-subtle">One product ID per line. Ask your developer if you need help matching products.</p>
      </AdminSection>
    </FormShell>
  );
}

export function ResourceForm({ slug, initial }: { slug: string; initial: LeadMagnet }) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/catalog/resources/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <FormShell save={save} status={status} error={error}>
      <AdminSection title="Download / lead magnet">
        <AdminField label="Title">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Audience tag" hint='e.g. "Builder / Integrator · Buyer"'>
          <AdminInput value={data.icp} onChange={(e) => setData({ ...data, icp: e.target.value })} />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea rows={3} value={data.blurb} onChange={(e) => setData({ ...data, blurb: e.target.value })} />
        </AdminField>
        <StringListEditor
          label="What's inside (bullet list)"
          items={data.contents}
          onChange={(contents) => setData({ ...data, contents })}
          placeholder="Comparison worksheet for SICK vs OLEI"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(data.primary)} onChange={(e) => setData({ ...data, primary: e.target.checked })} />
          Mark as featured resource in footer
        </label>
      </AdminSection>
      <ResourcePdfUpload slug={slug} currentPath={data.pdfPath} />
    </FormShell>
  );
}

function FormShell({
  children,
  save,
  status,
  error,
}: {
  children: React.ReactNode;
  save: () => void;
  status: "idle" | "saving" | "saved";
  error: string | null;
}) {
  return (
    <div className="space-y-6 pb-24">
      {children}
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
