import type { Metadata } from "next";
import { getContent } from "@/lib/cms";
import { fullStackPageDefaults } from "@/lib/cms/page-defaults";
import { FullStackPageView } from "@/components/marketing/page-views/FullStackPageView";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.full_stack", fullStackPageDefaults);
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: "/full-stack-perception" },
  };
}

export default async function FullStackPage() {
  const page = await getContent("page.full_stack", fullStackPageDefaults);
  return <FullStackPageView page={page} />;
}
