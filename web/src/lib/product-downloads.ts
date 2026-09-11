import type { Product } from "@/lib/catalog";

export type ProductDownloadKind = "spec" | "software";

export function specSheetIntent(slug: string) {
  return `download:spec:${slug}`;
}

export function softwareIntent(slug: string) {
  return `download:software:${slug}`;
}

/** One downloadable official PDF, ready for an anchor or the gate form. */
export type SpecSheetOption = {
  /** Model printed on the sheet — the picker label. */
  model: string;
  /** One-line differentiator shown under the model in the picker. */
  note?: string;
  /** Repo-hosted `/spec-sheets/…` path or a Storage public URL. */
  path: string;
  /** Filename the browser saves as. */
  filename: string;
};

type SpecSheetSource = Pick<Product, "brand" | "model" | "specSheetPath" | "specSheetNote" | "specSheets">;

/**
 * Every official PDF for a product, series/base sheet first, then the variant
 * sheets in catalog order. Empty when the product only has the auto-generated
 * template. More than one entry means the product page shows a picker.
 */
export function specSheetOptions(product: SpecSheetSource): SpecSheetOption[] {
  const options: SpecSheetOption[] = [];
  if (product.specSheetPath) {
    options.push({
      model: product.model,
      note: product.specSheetNote,
      path: product.specSheetPath,
      filename: specSheetFilename(product),
    });
  }
  for (const sheet of product.specSheets ?? []) {
    options.push({
      model: sheet.model,
      note: sheet.note,
      path: sheet.path,
      filename: specSheetFilename({ brand: product.brand, model: sheet.model }),
    });
  }
  return options;
}

/** Official PDF if uploaded; otherwise the auto-generated print template. */
export function specSheetAccess(product: Pick<Product, "slug"> & SpecSheetSource) {
  const [first] = specSheetOptions(product);
  if (first) {
    return { downloadUrl: first.path, openUrl: undefined as string | undefined };
  }
  return { downloadUrl: undefined as string | undefined, openUrl: `/templates/spec-sheet/${product.slug}` };
}

/**
 * Ungated spec sheets — the PDF downloads on click, no lead form. Only for
 * products explicitly opted in *and* carrying a real PDF; the auto-generated
 * template has nothing to hand over, so it always keeps the gate. Returns every
 * sheet the product has, with Storage URLs rewritten to force a download.
 */
export function directSpecSheets(product: SpecSheetSource & Pick<Product, "specSheetDirect">): SpecSheetOption[] {
  if (!product.specSheetDirect) return [];
  return specSheetOptions(product).map((o) => ({ ...o, path: storageDownloadHref(o.path) }));
}

/** Filename the browser saves as, rather than the slug-shaped path. */
export function specSheetFilename(product: Pick<Product, "brand" | "model">) {
  return `${[product.brand, product.model, "Spec Sheet"].join(" ").replace(/\+/g, " Plus").replace(/\s+/g, "-")}.pdf`;
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
