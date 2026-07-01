"use client";

import { useState } from "react";
import { AdminField, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "@/components/admin/forms/AdminField";
import { PageLinkPicker } from "@/components/admin/forms/PageLinkPicker";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";
import type { Product } from "@/lib/catalog";
import { defaultBoothMode, defaultProductOfMonth } from "@/lib/cms/home-defaults";

type Cta = { label: string; href: string };

function CtaEditor({ cta, onChange, title }: { cta: Cta; onChange: (c: Cta) => void; title: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-sm font-semibold text-text">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="Button text">
          <AdminInput value={cta.label} onChange={(e) => onChange({ ...cta, label: e.target.value })} />
        </AdminField>
        <AdminField label="Link">
          <PageLinkPicker value={cta.href} onChange={(href) => onChange({ ...cta, href })} />
        </AdminField>
      </div>
    </div>
  );
}

export function BoothModeForm({
  initial,
  blockKey,
  label,
  group,
}: {
  initial: typeof defaultBoothMode;
  blockKey: string;
  label: string;
  group: string;
}) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <div className="space-y-6 pb-24">
      <AdminSection title="Trade-show booth mode" description="When enabled, a prominent booth banner appears at the top of the homepage.">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} />
          Booth mode active on homepage
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField label="Show name">
            <AdminInput value={data.showName} onChange={(e) => setData({ ...data, showName: e.target.value })} />
          </AdminField>
          <AdminField label="Booth number (optional)">
            <AdminInput value={data.boothNumber ?? ""} onChange={(e) => setData({ ...data, boothNumber: e.target.value })} />
          </AdminField>
          <AdminField label="Location">
            <AdminInput value={data.location ?? ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
          </AdminField>
        </div>
        <AdminField label="Banner headline">
          <AdminInput value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} />
        </AdminField>
        <AdminField label="Banner subheadline">
          <AdminTextarea rows={2} value={data.subheadline ?? ""} onChange={(e) => setData({ ...data, subheadline: e.target.value })} />
        </AdminField>
        <CtaEditor title="Primary CTA" cta={data.cta} onChange={(cta) => setData({ ...data, cta })} />
      </AdminSection>
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}

export function ProductOfMonthForm({
  initial,
  blockKey,
  label,
  group,
  products,
}: {
  initial: typeof defaultProductOfMonth;
  blockKey: string;
  label: string;
  group: string;
  products: Product[];
}) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <div className="space-y-6 pb-24">
      <AdminSection title="Product of the month" description="Controls the /product-of-the-month landing page.">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} />
          Page is live
        </label>
        <AdminField label="Featured product">
          <AdminSelect value={data.productSlug} onChange={(e) => setData({ ...data, productSlug: e.target.value })}>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.model} — {p.name}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Page headline">
          <AdminInput value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Bottom CTA band">
        <AdminField label="Title">
          <AdminInput value={data.ctaBand.title} onChange={(e) => setData({ ...data, ctaBand: { ...data.ctaBand, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Body">
          <AdminTextarea rows={2} value={data.ctaBand.body} onChange={(e) => setData({ ...data, ctaBand: { ...data.ctaBand, body: e.target.value } })} />
        </AdminField>
        <CtaEditor
          title="Buttons"
          cta={data.ctaBand.primary}
          onChange={(primary) => setData({ ...data, ctaBand: { ...data.ctaBand, primary } })}
        />
        <CtaEditor
          title="Secondary button"
          cta={data.ctaBand.secondary}
          onChange={(secondary) => setData({ ...data, ctaBand: { ...data.ctaBand, secondary } })}
        />
      </AdminSection>
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
