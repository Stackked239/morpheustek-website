import { Footer } from "@/components/layout/Footer";
import { getLeadMagnets, getSiteSettings } from "@/lib/cms";

/** Site footer — rendered below `<main>`. */
export async function SiteFooter() {
  const [settings, magnets] = await Promise.all([getSiteSettings(), getLeadMagnets()]);
  const primaryMagnet = magnets.find((m) => m.primary) ?? magnets[0];

  return <Footer site={settings} footerNav={settings.footerNav} primaryMagnet={primaryMagnet} />;
}
