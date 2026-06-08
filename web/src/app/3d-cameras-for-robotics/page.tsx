import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/catalog";

const c = getCategory("3d-cameras-for-robotics")!;
export const metadata: Metadata = { title: c.title, description: c.blurb, alternates: { canonical: "/3d-cameras-for-robotics" } };

export default function Page() {
  return <CategoryView slug="3d-cameras-for-robotics" />;
}
