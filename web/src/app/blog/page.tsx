import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "Eyes at the Edge — Robotics Perception Insights",
  description: "Eyes at the Edge — technical insights on LiDAR, 3D cameras, safety sensing, and robot perception, written to help robotics engineers and buyers choose well.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Eyes at the Edge"
      title="Stay at the leading edge of robot perception."
      body="Eyes at the Edge is where we publish the technical writing that earns the ranking — long-form pieces on LiDAR selection, safety sensing, dToF vs. stereo, and real robotics perception problems. The engine of our organic and AI-answer visibility, and the landing place for our email campaigns. First posts are in the pipeline."
      bullets={[
        "Written for robotics engineers and buyers, not for fluff",
        "Optimized for both Google and AI assistants (GEO)",
        "Each post answers a real question your ICP is asking",
      ]}
      cta={{ label: "Grab a guide instead", href: "/resources" }}
    />
  );
}
