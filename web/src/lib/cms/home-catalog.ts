import type { Category, Product } from "@/lib/catalog";

/** Product + image lookups passed from server parents into client homepage sections. */
export type HomeCatalog = {
  productsBySlug: Record<string, Product>;
  imagesBySlug: Record<string, string | undefined>;
  products: Product[];
  categories: Category[];
};

export function buildHomeCatalog(
  products: Product[],
  images: Record<string, string>,
  categories: Category[],
): HomeCatalog {
  return {
    productsBySlug: Object.fromEntries(products.map((p) => [p.slug, p])),
    imagesBySlug: images,
    products,
    categories,
  };
}

export function homeProduct(
  catalog: HomeCatalog | undefined,
  slug: string,
  fallback: (slug: string) => Product | undefined,
) {
  return catalog?.productsBySlug[slug] ?? fallback(slug);
}

export function homeImage(
  catalog: HomeCatalog | undefined,
  slug: string,
  fallback: (slug: string) => string | undefined,
) {
  return catalog?.imagesBySlug[slug] ?? fallback(slug);
}
