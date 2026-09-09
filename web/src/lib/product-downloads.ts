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

/**
 * Ungated spec sheets — the PDF downloads on click, no lead form. Only for
 * products explicitly opted in *and* carrying a real PDF; the auto-generated
 * template has nothing to hand over, so it always keeps the gate.
 */
export function specSheetDirectHref(
  product: Pick<Product, "specSheetPath" | "specSheetDirect">,
): string | null {
  if (!product.specSheetDirect || !product.specSheetPath) return null;
  return storageDownloadHref(product.specSheetPath);
}

/** Filename the browser saves as, rather than the slug-shaped path. */
export function specSheetFilename(product: Pick<Product, "brand" | "model">) {
  return `${[product.brand, product.model, "Spec Sheet"].join(" ").replace(/\s+/g, "-")}.pdf`;
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
