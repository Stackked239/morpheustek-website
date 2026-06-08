import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/catalog";

const c = getCategory("solid-state-lidar")!;
export const metadata: Metadata = { title: c.title, description: c.blurb, alternates: { canonical: "/solid-state-lidar" } };

export default function Page() {
  return <CategoryView slug="solid-state-lidar" />;
}
