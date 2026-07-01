import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import {
  featuredProduct,
  getCategories,
  getProductImagesMap,
  getSiteSettings,
  getContent,
  productImage,
} from "@/lib/cms";

const defaultTopBar = {
  message: "Catch us at Automate — June 22, Chicago",
  href: "/shows/meet-us-at-the-booth",
  boothCta: "Meet us at the booth →",
};

/** Top bar + sticky header — rendered above `<main>`. */
export async function SiteHeader() {
  const [settings, categories, featured, images, topbar] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    featuredProduct(),
    getProductImagesMap(),
    getContent("layout.topbar", defaultTopBar),
  ]);

  const featuredImg = featured ? images[featured.slug] ?? (await productImage(featured.slug)) : undefined;

  return (
    <>
      <TopBar
        message={topbar.message}
        href={topbar.href}
        boothCta={topbar.boothCta}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <Header
        mainNav={settings.mainNav}
        primaryCta={settings.primaryCta}
        resourcesNav={settings.resourcesNav}
        categories={categories.map((c) => ({ slug: c.slug, label: c.label, blurb: c.blurb }))}
        navCategories={categories.map((c) => ({ slug: c.slug, label: c.label }))}
        featured={
          featured
            ? {
                slug: featured.slug,
                name: featured.name,
                tagline: featured.tagline,
                image: featuredImg,
              }
            : undefined
        }
      />
    </>
  );
}
