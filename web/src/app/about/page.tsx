import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { aboutPageDefaults } from "@/lib/cms/page-defaults";
import { AboutPageView } from "@/components/marketing/page-views/AboutPageView";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.about", aboutPageDefaults);
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const page = await getContent("page.about", aboutPageDefaults);
  return <AboutPageView page={page} />;
}
