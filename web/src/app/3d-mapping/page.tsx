import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/cms";

const slug = "3d-mapping" as const;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getCategory(slug);
  if (!c) return {};
  return { title: c.title, description: c.blurb, alternates: { canonical: `/${slug}` } };
}

export default function Page() {
  return <CategoryView slug={slug} />;
}
