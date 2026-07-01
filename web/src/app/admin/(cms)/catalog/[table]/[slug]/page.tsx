import { notFound } from "next/navigation";
import { getCategory, getApplication, getLeadMagnet } from "@/lib/cms";
import { CatalogEntityEditor } from "./CatalogEntityEditor";

const GETTERS: Record<string, (slug: string) => Promise<unknown>> = {
  categories: getCategory,
  applications: getApplication,
  resources: getLeadMagnet,
  products: async (slug) => {
    const { getProduct } = await import("@/lib/cms");
    return getProduct(slug);
  },
};

type Params = { params: Promise<{ table: string; slug: string }> };

export default async function AdminCatalogEntityPage({ params }: Params) {
  const { table, slug } = await params;
  const getter = GETTERS[table];
  if (!getter) notFound();
  const data = await getter(slug);
  if (!data) notFound();
  return (
    <div className="space-y-4">
      <h2 className="font-display text-h3 font-bold uppercase text-text-strong">{slug}</h2>
      <CatalogEntityEditor table={table} slug={slug} initial={data} />
    </div>
  );
}
