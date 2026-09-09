"use client";

import { useState } from "react";
import type { Product, CategorySlug, Brand, Availability } from "@/lib/catalog";
import { AdminField, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "@/components/admin/forms/AdminField";
import { SpecListEditor, StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { RichTextField } from "@/components/admin/forms/RichTextField";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";
import { ProductSpecSheetUpload } from "@/components/admin/ProductSpecSheetUpload";
import { ProductSoftwareUpload } from "@/components/admin/ProductSoftwareUpload";
import { AdminSplitLayout } from "@/components/admin/AdminSplitLayout";
import { ProductLivePreview } from "@/components/admin/previews/ProductLivePreview";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

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

const BRANDS: Brand[] = ["OLEI", "MRDVS", "Sintrones"];
const AVAILABILITY: Availability[] = ["in-stock", "pre-order", "contact"];

export function ProductEditor({
  slug,
  initial,
  imagePath,
}: {
  slug: string;
  initial: Product;
  imagePath?: string;
}) {
  const [product, setProduct] = useState<Product>(initial);

  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: product }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Save failed");
    }
  });

  function patch<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="space-y-6 pb-24">
      <AdminSplitLayout
        editor={
          <>
            <AdminSection title="Product basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Product name">
            <AdminInput value={product.name} onChange={(e) => patch("name", e.target.value)} />
          </AdminField>
          <AdminField label="Model number">
            <AdminInput value={product.model} onChange={(e) => patch("model", e.target.value)} />
          </AdminField>
          <AdminField label="Brand">
            <AdminSelect value={product.brand} onChange={(e) => patch("brand", e.target.value as Brand)}>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Category">
            <AdminSelect value={product.category} onChange={(e) => patch("category", e.target.value as CategorySlug)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Availability">
            <AdminSelect value={product.availability} onChange={(e) => patch("availability", e.target.value as Availability)}>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="List price (USD)" hint="Leave blank for “Contact for pricing”.">
            <AdminInput
              type="number"
              value={product.price ?? ""}
              onChange={(e) => patch("price", e.target.value ? Number(e.target.value) : undefined)}
            />
          </AdminField>
        </div>
        <AdminField label="Short tagline">
          <AdminInput value={product.tagline} onChange={(e) => patch("tagline", e.target.value)} />
        </AdminField>
        <AdminField label="Summary paragraph">
          <RichTextField rows={4} value={product.summary} onChange={(summary) => patch("summary", summary)} />
        </AdminField>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(product.featured)} onChange={(e) => patch("featured", e.target.checked)} />
            Featured product
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={product.trial} onChange={(e) => patch("trial", e.target.checked)} />
            90-day trial available
          </label>
        </div>
        <AdminField label="Availability note (optional)">
          <AdminInput value={product.availabilityNote ?? ""} onChange={(e) => patch("availabilityNote", e.target.value || undefined)} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Key specs" description="Shown above the fold — keep to 4–6 rows. Toggle visibility and highlight your star specs.">
        <SpecListEditor
          label=""
          hint="“Show on site” hides a row from the live page. “Highlight” adds yellow accent styling."
          items={[...product.keySpecs]}
          onChange={(keySpecs) => patch("keySpecs", keySpecs)}
        />
      </AdminSection>

      <AdminSection title="Full specifications" description="Complete spec table on the product page.">
        <SpecListEditor
          label=""
          hint="Hidden specs stay in admin for reference but won't appear on the product page or spec sheet."
          items={[...product.specs]}
          onChange={(specs) => patch("specs", specs)}
        />
      </AdminSection>

      <AdminSection title="Best for" description="Bullet list of ideal use cases.">
        <StringListEditor
          label=""
          items={product.bestFor}
          onChange={(bestFor) => patch("bestFor", bestFor)}
          placeholder="AMR navigation in warehouses"
        />
      </AdminSection>

      {(product.certifications?.length ?? 0) > 0 ? (
        <AdminSection title="Safety certifications" description="Only shown for safety-rated products like the GS1-5.">
          <StringListEditor
            label="Certification badges"
            items={product.certifications ?? []}
            onChange={(certifications) => patch("certifications", certifications)}
            placeholder="Type 3 / SIL2 / PL d"
          />
        </AdminSection>
      ) : null}

      <ProductImageUpload slug={slug} currentPath={imagePath} />
      <ProductSpecSheetUpload slug={slug} currentPath={product.specSheetPath} direct={product.specSheetDirect} />
      <ProductSoftwareUpload slug={slug} currentPath={product.softwarePath} isExternal={product.softwareIsExternal} />
          </>
        }
        preview={<ProductLivePreview product={product} />}
        previewTitle="Product page preview"
      />

      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
