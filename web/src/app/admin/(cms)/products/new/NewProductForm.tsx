"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { AdminField, AdminInput, AdminSection, AdminSelect } from "@/components/admin/forms/AdminField";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

export function NewProductForm({ templates }: { templates: Product[] }) {
  const [templateSlug, setTemplateSlug] = useState(templates[0]?.slug ?? "");
  const [slug, setSlug] = useState("");
  const [model, setModel] = useState("");

  const { save, status, error } = useAdminSave(async () => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    if (!cleanSlug) throw new Error("Enter a URL slug");
    if (!model.trim()) throw new Error("Enter a model name");
    const template = templates.find((p) => p.slug === templateSlug);
    if (!template) throw new Error("Choose a template product");

    const data: Product = {
      ...template,
      slug: cleanSlug,
      model: model.trim(),
      name: model.trim(),
      featured: false,
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: cleanSlug, data, status: "published" }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Create failed");
    window.location.href = `/admin/products/${encodeURIComponent(cleanSlug)}`;
  });

  return (
    <div className="space-y-6 pb-24">
      <AdminSection title="New product" description="Start from an existing SKU template — specs, copy structure, and category carry over. Edit everything after creation.">
        <AdminField label="Template product" hint="Copies category, specs layout, and field structure from this SKU.">
          <AdminSelect value={templateSlug} onChange={(e) => setTemplateSlug(e.target.value)}>
            {templates.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.model} ({p.slug})
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="New URL slug" hint="Lowercase letters, numbers, and hyphens only — e.g. lr-2f-2d-lidar">
          <AdminInput value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="new-product-slug" />
        </AdminField>
        <AdminField label="Model name" hint="Shown in menus and on the product page.">
          <AdminInput value={model} onChange={(e) => setModel(e.target.value)} placeholder="LR-2F" />
        </AdminField>
      </AdminSection>
      <SaveBar onSave={save} status={status} error={error} />
      <p className="text-sm text-text-muted">
        After creation you can upload a photo, edit specs, and{" "}
        <Link href="/templates/morpheustek-pdf-template.html" className="text-brand-blue hover:underline">
          open the branded PDF template
        </Link>{" "}
        to export a PDF.
      </p>
    </div>
  );
}
