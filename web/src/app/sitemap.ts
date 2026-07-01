import type { MetadataRoute } from "next";
import { getApplications, getCategories, getLeadMagnets, getProducts, getSiteSettings } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, categories, products, applications, leadMagnets] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
    getApplications(),
    getLeadMagnets(),
  ]);
  const base = settings.url;

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/full-stack-perception", priority: 0.9 },
    { path: "/compare/sick-alternative-lidar", priority: 0.9 },
    { path: "/safety-lidar", priority: 0.9 },
    { path: "/applications", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/custom-solutions", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/resources/glossary", priority: 0.6 },
    { path: "/compare/hokuyo-alternative-lidar", priority: 0.6 },
    { path: "/shows", priority: 0.6 },
    { path: "/shows/meet-us-at-the-booth", priority: 0.6 },
    { path: "/book-a-meeting", priority: 0.8 },
    { path: "/contact", priority: 0.5 },
    { path: "/blog", priority: 0.5 },
    { path: "/product-of-the-month", priority: 0.5 },
    { path: "/whats-new", priority: 0.4 },
  ];

  const dynamic: { path: string; priority: number }[] = [
    ...categories.map((c) => ({ path: `/${c.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7 })),
    ...applications.map((a) => ({ path: `/applications/${a.slug}`, priority: 0.6 })),
    ...leadMagnets.map((m) => ({ path: `/resources/${m.slug}`, priority: 0.6 })),
  ];

  return [...staticRoutes, ...dynamic].map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
