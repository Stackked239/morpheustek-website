import type { Metadata } from "next";
import { CategoryView } from "@/components/marketing/CategoryView";
import { getCategory } from "@/lib/catalog";

const c = getCategory("lidar-for-robotics")!;
export const metadata: Metadata = { title: c.title, description: c.blurb, alternates: { canonical: "/lidar-for-robotics" } };

export default function Page() {
  return <CategoryView slug="lidar-for-robotics" />;
}
