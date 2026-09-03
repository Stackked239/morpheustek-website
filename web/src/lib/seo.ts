import type { Metadata } from "next";

/**
 * Default social share image (the hero point cloud). Relative URLs resolve
 * against `metadataBase` (the canonical www host) set in the root layout.
 */
export const defaultOgImage = {
  url: "/media/hero-pointcloud.jpg",
  width: 1376,
  height: 768,
  alt: "MorpheusTEK — a 3D LiDAR point-cloud view of a warehouse aisle in depth-mapped color",
} as const;

/**
 * Build page metadata with a canonical URL plus matching page-level Open Graph
 * and Twitter cards. Without this, Next replaces the parent `openGraph`/`twitter`
 * only where a child sets them — so a page that sets just title/description would
 * otherwise fall back to the homepage's OG title. Every page gets its own
 * title/description/url and keeps a brand share image.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
}): Metadata {
  const ogImage = image ?? defaultOgImage;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
