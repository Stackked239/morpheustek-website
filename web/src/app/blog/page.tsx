import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "Insights — Robotics Perception, LiDAR & Sensing",
  description: "Technical insights on LiDAR, 3D cameras, safety sensing, and robot perception — written to help robotics engineers and buyers choose well.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Insights"
      title="Technical writing that earns the ranking."
      body="Long-form, keyword-rich articles on LiDAR selection, safety sensing, dToF vs. stereo, and real robotics perception problems — the engine of our organic and AI-answer visibility. First posts are in the pipeline."
      bullets={[
        "Written for robotics engineers and buyers, not for fluff",
        "Optimized for both Google and AI assistants (GEO)",
        "Each post answers a real question your ICP is asking",
      ]}
      cta={{ label: "Grab a guide instead", href: "/resources" }}
    />
  );
}
