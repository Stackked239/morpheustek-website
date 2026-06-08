import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/catalog";

const c = getCategory("safety-lidar")!;
export const metadata: Metadata = { title: c.title, description: c.blurb, alternates: { canonical: "/safety-lidar" } };

export default function Page() {
  return <CategoryView slug="safety-lidar" />;
}
