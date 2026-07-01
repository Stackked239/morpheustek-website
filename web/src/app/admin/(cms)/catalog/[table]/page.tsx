import Link from "next/link";
import { getCategories, getApplications, getLeadMagnets } from "@/lib/cms";
import { notFound } from "next/navigation";

const META: Record<string, { title: string; getList: () => Promise<{ slug: string; title?: string; label?: string; name?: string; model?: string }[]> }> = {
  categories: { title: "Categories", getList: getCategories },
  applications: { title: "Applications", getList: getApplications },
  resources: { title: "Resources", getList: getLeadMagnets },
};

type Params = { params: Promise<{ table: string }> };

export default async function AdminCatalogTablePage({ params }: Params) {
  const { table } = await params;
  const meta = META[table];
  if (!meta) notFound();
  const rows = await meta.getList();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">{meta.title}</h2>
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {rows.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/admin/catalog/${table}/${r.slug}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-bg-muted"
            >
              <span className="font-display text-base font-bold uppercase text-text-strong">
                {"title" in r && r.title ? r.title : "label" in r && r.label ? r.label : r.slug}
              </span>
              <span className="font-mono text-xs text-brand-blue">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
