import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "The LiDAR Alternative to Hokuyo",
  description:
    "A lower-cost, full-stack alternative to Hokuyo navigation and safety scanners — with 3D LiDAR and RGBD cameras Hokuyo's 2D line can't match, plus a 90-day trial.",
  alternates: { canonical: "/compare/hokuyo-alternative-lidar" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Compare"
      title="The LiDAR alternative to Hokuyo."
      body="Hokuyo is a trusted 2D navigation and safety name. Where they're strong on reputation, we win on cost-per-coverage, a 90-day trial, and a 3D LiDAR + RGBD camera line their 2D house can't match. This head-to-head is coming together now."
      bullets={[
        "OLEI LR-1F: full 360° and 50 m at a fraction of Hokuyo pricing",
        "GS1-5 matches the UAM safety class (Type 3 / SIL2 / PL d)",
        "Expand from 2D into our 3D LiDAR and dToF RGBD cameras",
        "One stack: sensors + edge compute, not sensor-only",
      ]}
      cta={{ label: "See the SICK comparison", href: "/compare/sick-alternative-lidar" }}
    />
  );
}
