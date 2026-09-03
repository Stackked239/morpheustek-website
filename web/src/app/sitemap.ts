import type { MetadataRoute } from "next";
import { getApplications, getCategories, getLeadMagnets, getProducts, getSiteSettings } from "@/lib/cms";
import { getPublishedBlogPosts } from "@/lib/cms/blog";
import { site } from "@/lib/site";

/**
 * Force the canonical host (www) and strip any trailing slash, regardless of
 * what the CMS `site.settings` block stores. The apex 308-redirects to www, so
 * every sitemap <loc> must already be the www form to avoid redirect chains.
 */
function canonicalBase(rawUrl: string | undefined): string {
  const base = (rawUrl || site.url).replace(/\/+$/, "");
  return base.replace(/^https?:\/\/morpheustek\.com/i, "https://www.morpheustek.com");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, categories, products, applications, leadMagnets, blogPosts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
    getApplications(),
    getLeadMagnets(),
    getPublishedBlogPosts(),
  ]);
  const base = canonicalBase(settings.url);

  type Entry = { path: string; priority: number; lastModified?: string | Date };

  const staticRoutes: Entry[] = [
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

  const dynamic: Entry[] = [
    ...categories.map((c) => ({ path: `/${c.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7 })),
    ...applications.map((a) => ({ path: `/applications/${a.slug}`, priority: 0.6 })),
    ...leadMagnets.map((m) => ({ path: `/resources/${m.slug}`, priority: 0.6 })),
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.5,
      lastModified: post.updated_at || post.published_at || undefined,
    })),
  ];

  // Dedupe by path (e.g. `/safety-lidar` is both a keyword pillar in the static
  // list and a category slug). Keep the highest priority and any lastmod.
  const byPath = new Map<string, Entry>();
  for (const entry of [...staticRoutes, ...dynamic]) {
    const existing = byPath.get(entry.path);
    if (!existing) {
      byPath.set(entry.path, entry);
      continue;
    }
    byPath.set(entry.path, {
      path: entry.path,
      priority: Math.max(existing.priority, entry.priority),
      lastModified: existing.lastModified ?? entry.lastModified,
    });
  }

  return [...byPath.values()].map(({ path, priority, lastModified }) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  }));
}
