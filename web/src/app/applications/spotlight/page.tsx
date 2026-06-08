import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "Application Spotlight",
  description: "A rotating look at how MorpheusTEK perception shows up in real robotics applications — navigation, obstacle avoidance, safety, and mapping.",
  alternates: { canonical: "/applications/spotlight" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Application spotlight"
      title="Perception in the wild."
      body="A rotating spotlight on real robotics applications — AMRs, autonomous forklifts, cleaning platforms, warehouse automation — and the sensing that makes them work. New spotlights publish here in step with our shows and campaigns."
      bullets={[
        "Navigation, obstacle avoidance, safety, and mapping in context",
        "Anonymized until customer approval is on file",
        "Before/after point-cloud views coming with real footage",
      ]}
      cta={{ label: "Explore applications", href: "/applications" }}
    />
  );
}
