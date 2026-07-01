"use client";

import type { Category, Application, LeadMagnet } from "@/lib/catalog";
import { CategoryForm, ApplicationForm, ResourceForm } from "@/components/admin/editors/CatalogForms";
import { JsonEditor } from "@/components/admin/JsonEditor";

export function CatalogEntityEditor({
  table,
  slug,
  initial,
}: {
  table: string;
  slug: string;
  initial: unknown;
}) {
  if (table === "categories") {
    return <CategoryForm slug={slug} initial={initial as Category} />;
  }
  if (table === "applications") {
    return <ApplicationForm slug={slug} initial={initial as Application} />;
  }
  if (table === "resources") {
    return <ResourceForm slug={slug} initial={initial as LeadMagnet} />;
  }

  return (
    <JsonEditor
      initial={JSON.stringify(initial, null, 2)}
      onSave={async (data) => {
        const res = await fetch(`/api/admin/catalog/${table}/${encodeURIComponent(slug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      }}
    />
  );
}
