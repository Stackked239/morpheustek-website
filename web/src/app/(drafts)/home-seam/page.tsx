import type { Metadata } from "next";
import { HomeSeam } from "@/components/home/HomeSeam";

// Draft mirror of the live homepage (now at "/"). Kept noindex so the seam can be
// reviewed in isolation / linked from the /home-drafts hub. Renders the exact same
// HomeSeam composition the homepage does — single source of truth.
export const metadata: Metadata = {
  title: "Homepage draft — The Seam",
  robots: { index: false, follow: false },
};

export default function HomeSeamDraft() {
  return <HomeSeam />;
}
