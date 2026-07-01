import {
  getApplications,
  getCategories,
  getLeadMagnets,
  getProducts,
} from "@/lib/cms";
import { getAllBlogPostsAdmin } from "@/lib/cms/blog";

export type SitePageOption = {
  href: string;
  label: string;
  group: string;
};

const STATIC_PAGES: SitePageOption[] = [
  { href: "/", label: "Homepage", group: "Main pages" },
  { href: "/products", label: "Products index", group: "Main pages" },
  { href: "/applications", label: "Applications index", group: "Main pages" },
  { href: "/resources", label: "Resources index", group: "Main pages" },
  { href: "/blog", label: "Blog index", group: "Main pages" },
  { href: "/about", label: "About", group: "Main pages" },
  { href: "/contact", label: "Contact", group: "Main pages" },
  { href: "/custom-solutions", label: "Custom solutions", group: "Main pages" },
  { href: "/full-stack-perception", label: "Full-stack perception", group: "Main pages" },
  { href: "/product-of-the-month", label: "Product of the month", group: "Main pages" },
  { href: "/whats-new", label: "What's new", group: "Main pages" },
  { href: "/application-diagrams", label: "Application diagrams", group: "Main pages" },
  { href: "/applications/spotlight", label: "Applications spotlight", group: "Main pages" },
  { href: "/custom-solutions/spotlight", label: "Custom solutions spotlight", group: "Main pages" },
  { href: "/shows", label: "Trade shows", group: "Shows" },
  { href: "/shows/meet-us-at-the-booth", label: "Meet us at the booth", group: "Shows" },
  { href: "/compare/sick-alternative-lidar", label: "Compare — SICK alternative", group: "Compare" },
  { href: "/compare/hokuyo-alternative-lidar", label: "Compare — Hokuyo alternative", group: "Compare" },
  { href: "/resources/glossary", label: "Robotics glossary", group: "Resources" },
  { href: "/book-a-meeting", label: "Book a meeting", group: "Forms & CTAs" },
  { href: "/book-a-meeting?intent=trial", label: "Book a meeting — 90-day trial", group: "Forms & CTAs" },
  { href: "/book-a-meeting?intent=engineer", label: "Book a meeting — talk to engineer", group: "Forms & CTAs" },
  { href: "/book-a-meeting?intent=meeting", label: "Book a meeting — general", group: "Forms & CTAs" },
  { href: "/book-a-meeting?intent=quote", label: "Book a meeting — get a quote", group: "Forms & CTAs" },
  { href: "/privacy", label: "Privacy policy", group: "Legal" },
  { href: "/terms", label: "Terms of use", group: "Legal" },
];

/** All public site paths for the admin link picker. */
export async function buildSitePageOptions(): Promise<SitePageOption[]> {
  const [categories, products, applications, resources, blogPosts] = await Promise.all([
    getCategories(),
    getProducts(),
    getApplications(),
    getLeadMagnets(),
    getAllBlogPostsAdmin().catch(() => []),
  ]);

  const dynamic: SitePageOption[] = [
    ...categories.map((c) => ({
      href: `/${c.slug}`,
      label: c.title,
      group: "Category pillars",
    })),
    ...products.map((p) => ({
      href: `/products/${p.slug}`,
      label: `${p.model} — ${p.name}`,
      group: "Products",
    })),
    ...applications.map((a) => ({
      href: `/applications/${a.slug}`,
      label: a.title,
      group: "Applications",
    })),
    ...resources.map((r) => ({
      href: `/resources/${r.slug}`,
      label: r.title,
      group: "Resources",
    })),
    ...blogPosts.map((b) => ({
      href: `/blog/${b.slug}`,
      label: b.status === "published" ? b.title : `${b.title} (draft)`,
      group: "Blog",
    })),
  ];

  const merged = [...STATIC_PAGES, ...dynamic];
  const seen = new Set<string>();
  return merged.filter((p) => {
    if (seen.has(p.href)) return false;
    seen.add(p.href);
    return true;
  });
}
