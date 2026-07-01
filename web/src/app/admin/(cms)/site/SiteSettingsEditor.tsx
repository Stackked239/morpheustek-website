"use client";

import { useState } from "react";
import type { EditableSiteSettings } from "@/lib/cms";
import { AdminField, AdminInput, AdminSection, AdminTextarea } from "@/components/admin/forms/AdminField";
import { FooterColumnsEditor, LinkListEditor, StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { PageLinkPicker } from "@/components/admin/forms/PageLinkPicker";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

export function SiteSettingsEditor({ initial }: { initial: EditableSiteSettings }) {
  const [data, setData] = useState<EditableSiteSettings>(() => structuredClone(initial));

  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent("site.settings")}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label: "Site settings & navigation", group: "Site" }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Save failed");
    }
  });

  function patch<K extends keyof EditableSiteSettings>(key: K, value: EditableSiteSettings[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="space-y-6 pb-24">
      <AdminSection title="Company contact" description="Phone, email, and address shown in the header, footer, and contact areas.">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Company name">
            <AdminInput value={data.name} onChange={(e) => patch("name", e.target.value)} />
          </AdminField>
          <AdminField label="Tagline">
            <AdminInput value={data.tagline} onChange={(e) => patch("tagline", e.target.value)} />
          </AdminField>
          <AdminField label="Sales email">
            <AdminInput type="email" value={data.email} onChange={(e) => patch("email", e.target.value)} />
          </AdminField>
          <AdminField label="Phone (display)">
            <AdminInput value={data.phone} onChange={(e) => patch("phone", e.target.value)} />
          </AdminField>
          <AdminField label="Phone (for click-to-call)" hint="Digits only with country code, e.g. +13027890421">
            <AdminInput value={data.phoneHref} onChange={(e) => patch("phoneHref", e.target.value)} />
          </AdminField>
          <AdminField label="Website domain">
            <AdminInput value={data.domain} onChange={(e) => patch("domain", e.target.value)} />
          </AdminField>
        </div>
        <AdminField label="Mailing address">
          <AdminTextarea rows={2} value={data.address} onChange={(e) => patch("address", e.target.value)} />
        </AdminField>
        <AdminField label="Distributor line" hint='Shown in the footer, e.g. "Exclusive North American distributor for OLEI LiDAR".'>
          <AdminInput value={data.distributor} onChange={(e) => patch("distributor", e.target.value)} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Homepage messaging" description="Core copy used across the site hero and metadata.">
        <AdminField label="One-line company description">
          <AdminTextarea rows={3} value={data.oneLiner} onChange={(e) => patch("oneLiner", e.target.value)} />
        </AdminField>
        <AdminField label="Visitor problem statement" hint="The pain point above the fold on the homepage.">
          <AdminTextarea rows={2} value={data.heroProblem} onChange={(e) => patch("heroProblem", e.target.value)} />
        </AdminField>
        <AdminField label="Main headline">
          <AdminTextarea rows={2} value={data.heroHeadline} onChange={(e) => patch("heroHeadline", e.target.value)} />
        </AdminField>
        <AdminField label="Differentiator">
          <AdminTextarea rows={2} value={data.differentiator} onChange={(e) => patch("differentiator", e.target.value)} />
        </AdminField>
        <StringListEditor
          label="Three proof pillars"
          items={[...data.pillars]}
          onChange={(pillars) => patch("pillars", pillars)}
          placeholder="Same safety class as SICK…"
        />
      </AdminSection>

      <AdminSection title="Top navigation" description="Main menu tabs across the top of every page.">
        <LinkListEditor
          items={[...data.mainNav]}
          onChange={(mainNav) => patch("mainNav", mainNav)}
          addLabel="Add menu item"
        />
      </AdminSection>

      <AdminSection title="Resources menu" description="Links inside the Resources dropdown.">
        <LinkListEditor
          items={[...data.resourcesNav]}
          onChange={(resourcesNav) => patch("resourcesNav", resourcesNav)}
          showDescription
          addLabel="Add resource link"
        />
      </AdminSection>

      <AdminSection title="Products menu extras" description={`"Beyond the catalog" links in the Products dropdown.`}>
        <LinkListEditor
          items={[...data.solutionsLinks]}
          onChange={(solutionsLinks) => patch("solutionsLinks", solutionsLinks)}
          showDescription
          addLabel="Add solutions link"
        />
      </AdminSection>

      <AdminSection title="Footer columns" description="Four columns of links at the bottom of every page.">
        <FooterColumnsEditor
          columns={data.footerNav.map((g) => ({ heading: g.heading, links: [...g.links] }))}
          onChange={(footerNav) => patch("footerNav", footerNav)}
        />
      </AdminSection>

      <AdminSection title="Call-to-action buttons" description="Labels and destinations for the main buttons across the site.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["trial", "meeting", "engineer", "quote"] as const).map((key) => (
            <div key={key} className="rounded-lg border border-border bg-bg-muted/40 p-4">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                {key === "trial" ? "90-day trial" : key === "meeting" ? "Book a meeting" : key === "engineer" ? "Talk to engineer" : "Get a quote"}
              </p>
              <AdminField label="Button text">
                <AdminInput
                  value={data.primaryCta[key].label}
                  onChange={(e) =>
                    patch("primaryCta", { ...data.primaryCta, [key]: { ...data.primaryCta[key], label: e.target.value } })
                  }
                />
              </AdminField>
              <AdminField label="Button link" className="mt-3">
                <PageLinkPicker
                  value={data.primaryCta[key].href}
                  onChange={(href) =>
                    patch("primaryCta", { ...data.primaryCta, [key]: { ...data.primaryCta[key], href } })
                  }
                />
              </AdminField>
            </div>
          ))}
        </div>
      </AdminSection>

      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
