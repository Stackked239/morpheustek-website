import { unstable_cache } from "next/cache";
import {
  products as seedProducts,
  categories as seedCategories,
  applications as seedApplications,
  leadMagnets as seedResources,
  productImages as seedProductImages,
  type Product,
  type Category,
  type Application,
  type LeadMagnet,
  type CategorySlug,
} from "@/lib/catalog";
import { site as seedSite, primaryCta as seedPrimaryCta, mainNav as seedMainNav, resourcesNav as seedResourcesNav, solutionsLinks as seedSolutionsLinks, footerNav as seedFooterNav, type NavLink } from "@/lib/site";
import { createAnonClient, isCmsEnabled } from "@/lib/supabase/server";

export type { Product, Category, Application, LeadMagnet, CategorySlug };

export type SiteSettings = typeof seedSite & {
  primaryCta: typeof seedPrimaryCta;
  mainNav: typeof seedMainNav;
  resourcesNav: typeof seedResourcesNav;
  solutionsLinks: typeof seedSolutionsLinks;
  footerNav: typeof seedFooterNav;
};

/** Mutable shape for the admin site settings form (seedSite uses `as const`). */
export type EditableSiteSettings = {
  name: string;
  tagline: string;
  domain: string;
  url: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: string;
  oneLiner: string;
  heroProblem: string;
  heroHeadline: string;
  heroHeadlineVariants: string[];
  differentiator: string;
  pillars: string[];
  distributor: string;
  primaryCta: Record<keyof typeof seedPrimaryCta, { label: string; href: string }>;
  mainNav: { label: string; href: string }[];
  resourcesNav: NavLink[];
  solutionsLinks: NavLink[];
  footerNav: { heading: string; links: NavLink[] }[];
};

const CMS_TAG = "cms";

async function withCmsFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

async function fetchProductsFromDb(): Promise<Product[]> {
  const sb = createAnonClient();
  const { data, error } = await sb
    .from("products")
    .select("data")
    .eq("status", "published")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => r.data as Product);
}

async function fetchCategoriesFromDb(): Promise<Category[]> {
  const sb = createAnonClient();
  const { data, error } = await sb.from("categories").select("data").eq("status", "published").order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => r.data as Category);
}

async function fetchApplicationsFromDb(): Promise<Application[]> {
  const sb = createAnonClient();
  const { data, error } = await sb.from("applications").select("data").eq("status", "published").order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => r.data as Application);
}

async function fetchResourcesFromDb(): Promise<LeadMagnet[]> {
  const sb = createAnonClient();
  const { data, error } = await sb.from("resources").select("data").eq("status", "published").order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => r.data as LeadMagnet);
}

async function fetchProductImagesFromDb(): Promise<Record<string, string>> {
  const sb = createAnonClient();
  const { data, error } = await sb.from("product_images").select("slug, path");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.slug, r.path]));
}

function mergeWithFallback<T>(fallback: T, raw: unknown): T {
  if (raw === null || raw === undefined) return fallback;
  if (
    typeof fallback === "object" &&
    fallback !== null &&
    !Array.isArray(fallback) &&
    typeof raw === "object" &&
    raw !== null &&
    !Array.isArray(raw)
  ) {
    return { ...fallback, ...(raw as Record<string, unknown>) } as T;
  }
  return raw as T;
}

async function fetchContentBlock<T>(key: string, fallback: T): Promise<T> {
  const sb = createAnonClient();
  const { data, error } = await sb.from("content_blocks").select("data").eq("key", key).maybeSingle();
  if (error) throw error;
  return mergeWithFallback(fallback, data?.data);
}

export const getProducts = unstable_cache(
  async () =>
    isCmsEnabled() ? withCmsFallback(fetchProductsFromDb, seedProducts) : seedProducts,
  ["cms-products"],
  { tags: [CMS_TAG] },
);

export const getCategories = unstable_cache(
  async () =>
    isCmsEnabled() ? withCmsFallback(fetchCategoriesFromDb, seedCategories) : seedCategories,
  ["cms-categories"],
  { tags: [CMS_TAG] },
);

export const getApplications = unstable_cache(
  async () =>
    isCmsEnabled() ? withCmsFallback(fetchApplicationsFromDb, seedApplications) : seedApplications,
  ["cms-applications"],
  { tags: [CMS_TAG] },
);

export const getLeadMagnets = unstable_cache(
  async () =>
    isCmsEnabled() ? withCmsFallback(fetchResourcesFromDb, seedResources) : seedResources,
  ["cms-resources"],
  { tags: [CMS_TAG] },
);

export const getProductImagesMap = unstable_cache(
  async () =>
    isCmsEnabled() ? withCmsFallback(fetchProductImagesFromDb, seedProductImages) : seedProductImages,
  ["cms-product-images"],
  { tags: [CMS_TAG] },
);

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    if (!isCmsEnabled()) {
      return {
        ...seedSite,
        primaryCta: seedPrimaryCta,
        mainNav: [...seedMainNav],
        resourcesNav: [...seedResourcesNav],
        solutionsLinks: [...seedSolutionsLinks],
        footerNav: seedFooterNav.map((g) => ({ ...g, links: [...g.links] })),
      };
    }
    return withCmsFallback(
      () =>
        fetchContentBlock<SiteSettings>("site.settings", {
          ...seedSite,
          primaryCta: seedPrimaryCta,
          mainNav: [...seedMainNav],
          resourcesNav: [...seedResourcesNav],
          solutionsLinks: [...seedSolutionsLinks],
          footerNav: seedFooterNav.map((g) => ({ ...g, links: [...g.links] })),
        }),
      {
        ...seedSite,
        primaryCta: seedPrimaryCta,
        mainNav: [...seedMainNav],
        resourcesNav: [...seedResourcesNav],
        solutionsLinks: [...seedSolutionsLinks],
        footerNav: seedFooterNav.map((g) => ({ ...g, links: [...g.links] })),
      },
    );
  },
  ["cms-site-settings"],
  { tags: [CMS_TAG] },
);

/** Generic content block reader — homepage sections, page copy, glossary, shows, etc. */
export async function getContent<T>(key: string, fallback: T): Promise<T> {
  if (!isCmsEnabled()) return fallback;
  const cached = unstable_cache(
    async () => withCmsFallback(() => fetchContentBlock(key, fallback), fallback),
    [`cms-block-${key}`],
    { tags: [CMS_TAG, `cms-block-${key}`] },
  );
  return cached();
}

export async function getProduct(slug: string) {
  const list = await getProducts();
  return list.find((p) => p.slug === slug);
}

export async function getCategory(slug: string) {
  const list = await getCategories();
  return list.find((c) => c.slug === slug);
}

export async function productsInCategory(slug: CategorySlug) {
  const list = await getProducts();
  return list.filter((p) => p.category === slug);
}

export async function getApplication(slug: string) {
  const list = await getApplications();
  return list.find((a) => a.slug === slug);
}

export async function getLeadMagnet(slug: string) {
  const list = await getLeadMagnets();
  return list.find((m) => m.slug === slug);
}

export async function featuredProduct() {
  const list = await getProducts();
  return list.find((p) => p.featured) ?? list[0];
}

export async function productImage(slug: string) {
  const map = await getProductImagesMap();
  return map[slug];
}

export async function getRobotTypes(): Promise<string[]> {
  const { defaultRobotTypes } = await import("@/lib/cms/page-defaults");
  return getContent("forms.robot_types", defaultRobotTypes);
}

export { formatPrice, availabilityLabel, visibleSpecs } from "@/lib/catalog";

export const cmsRevalidateTag = CMS_TAG;
