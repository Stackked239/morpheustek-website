import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "Custom Solution Spotlight",
  description: "Anonymized examples of custom LiDAR and camera solutions MorpheusTEK has built for robotics applications.",
  alternates: { canonical: "/custom-solutions/spotlight" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Custom solution spotlight"
      title="Real custom builds, anonymized."
      body="A rotating look at custom sensing solutions we've shipped — custom FOV, range, mounting, and safety-zone work for real robotics applications. Customer-specific spotlights publish here as approvals land."
      bullets={[
        "Anonymized application examples — no customer names without approval",
        "What changed, why, and how it performed",
        "Synced with our LinkedIn and Big Wave campaigns",
      ]}
      cta={{ label: "Discuss a custom build", href: "/book-a-meeting?intent=engineer" }}
    />
  );
}
