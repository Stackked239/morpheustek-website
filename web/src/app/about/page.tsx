import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { aboutPageDefaults } from "@/lib/cms/page-defaults";
import { pageMetadata } from "@/lib/seo";
import { AboutPageView } from "@/components/marketing/page-views/AboutPageView";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.about", aboutPageDefaults);
  return pageMetadata({
    title: page.meta.title,
    description: page.meta.description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await getContent("page.about", aboutPageDefaults);
  return <AboutPageView page={page} />;
}
