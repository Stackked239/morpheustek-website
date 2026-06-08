import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/catalog";

const c = getCategory("edge-compute")!;
export const metadata: Metadata = { title: c.title, description: c.blurb, alternates: { canonical: "/edge-compute" } };

export default function Page() {
  return <CategoryView slug="edge-compute" />;
}
