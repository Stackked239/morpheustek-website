import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = {
  title: "What's New at MorpheusTEK",
  description: "New products, new applications, and where to find us next — the latest from MorpheusTEK.",
  alternates: { canonical: "/whats-new" },
};

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="What's new"
      title="New sensors, new applications, new shows."
      body="The latest from MorpheusTEK — product launches, application spotlights, and where to meet us next. This feed syncs with our Big Wave email and LinkedIn so the news only has to be written once."
      bullets={["Product launches and availability updates", "New application spotlights", "Upcoming shows and booth slots"]}
      cta={{ label: "See product of the month", href: "/product-of-the-month" }}
    />
  );
}
