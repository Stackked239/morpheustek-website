import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "Custom LiDAR & Camera Solutions for Robotics",
  description:
    "When off-the-shelf doesn't fit: custom field of view, range, mounting, housing, environmental protection, and firmware — backed by OEM/ODM manufacturing and U.S.-based support.",
  alternates: { canonical: "/custom-solutions" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Custom solutions"
      title="When off-the-shelf doesn't fit, we build to your spec."
      body="Many robotics applications need adjustments off-the-shelf sensors can't make. Backed by OEM/ODM laser-measurement manufacturing, MorpheusTEK can tailor the sensor to your platform — and add the U.S.-based support to get it into production."
      bullets={[
        "Custom field of view, range, and resolution",
        "Mounting, housing, and environmental protection",
        "Safety-zone configuration and firmware adjustments",
        "Integration support from prototype through production",
      ]}
      cta={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
    />
  );
}
