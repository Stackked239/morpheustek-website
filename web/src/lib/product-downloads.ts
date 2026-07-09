import type { Product } from "@/lib/catalog";

export type ProductDownloadKind = "spec" | "software";

export function specSheetIntent(slug: string) {
  return `download:spec:${slug}`;
}

export function softwareIntent(slug: string) {
  return `download:software:${slug}`;
}

/** Official PDF if uploaded; otherwise the auto-generated print template. */
export function specSheetAccess(product: Pick<Product, "slug" | "specSheetPath">) {
  if (product.specSheetPath) {
    return { downloadUrl: product.specSheetPath, openUrl: undefined as string | undefined };
  }
  return { downloadUrl: undefined as string | undefined, openUrl: `/templates/spec-sheet/${product.slug}` };
}

export function softwareAccess(product: Pick<Product, "softwarePath" | "softwareIsExternal">) {
  if (!product.softwarePath) return null;
  if (product.softwareIsExternal) {
    return { downloadUrl: undefined as string | undefined, openUrl: product.softwarePath };
  }
  return { downloadUrl: product.softwarePath, openUrl: undefined as string | undefined };
}

export function storageDownloadHref(url: string) {
  return url.includes("/storage/") && !url.includes("?") ? `${url}?download=` : url;
}
