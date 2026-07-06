import { CtaBand } from "@/components/marketing/CtaBand";
import { BoothModeBanner } from "./BoothModeBanner";
import { HeroSeam } from "./HeroSeam";
import { TrustBand } from "./TrustBand";
import { AssemblyStack } from "./AssemblyStack";
import { CertifyPlot } from "./CertifyPlot";
import { RangeLedger } from "./RangeLedger";
import { CategoryBrowse } from "./CategoryBrowse";
import { BuildToSpec } from "./BuildToSpec";
import { getCategories, getContent, getProductImagesMap, getProducts, getSiteSettings } from "@/lib/cms";
import { buildHomeCatalog } from "@/lib/cms/home-catalog";
import { APPLICATION_ASSEMBLIES } from "@/lib/cms/assemblies";
import {
  defaultAssemblyHeader,
  defaultBoothMode,
  defaultBuildToSpecContent,
  defaultCategoryBrowseContent,
  defaultCertifyContent,
  defaultHeroContent,
  defaultRangeLedgerHeader,
  defaultTrustBandContent,
} from "@/lib/cms/home-defaults";

const defaultCta = {
  eyebrow: "The 90-day acceptance test",
  title: "Try it free, 90 days. Your floor.",
  body: "Put a MorpheusTEK unit in your own environment and prove it on your robots. If it doesn't earn its place, send it back — no commitment.",
  primary: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
  secondary: { label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" },
};

export async function HomeSeam() {
  const [
    settings,
    products,
    images,
    categories,
    ctaBand,
    hero,
    rangeHeader,
    assemblyHeader,
    certify,
    categoryBrowse,
    trustBand,
    buildToSpec,
    boothMode,
  ] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getProductImagesMap(),
    getCategories(),
    getContent("homepage.cta_band", defaultCta),
    getContent("homepage.hero", defaultHeroContent),
    getContent("homepage.range_ledger", defaultRangeLedgerHeader),
    getContent("homepage.assembly", defaultAssemblyHeader),
    getContent("homepage.certify", defaultCertifyContent),
    getContent("homepage.category_browse", defaultCategoryBrowseContent),
    getContent("homepage.trust_band", defaultTrustBandContent),
    getContent("homepage.build_to_spec", defaultBuildToSpecContent),
    getContent("layout.booth_mode", defaultBoothMode),
  ]);
  const catalog = buildHomeCatalog(products, images, categories);

  return (
    <>
      <BoothModeBanner content={boothMode} />
      <HeroSeam distributor={settings.distributor} problem={settings.heroProblem} content={hero} />
      <RangeLedger catalog={catalog} section={rangeHeader} />
      <AssemblyStack catalog={catalog} section={assemblyHeader} assemblies={APPLICATION_ASSEMBLIES} />
      <CertifyPlot catalog={catalog} content={certify} />
      <CategoryBrowse catalog={catalog} content={categoryBrowse} />
      <TrustBand catalog={catalog} content={trustBand} />
      <BuildToSpec content={buildToSpec} />
      <CtaBand
        eyebrow={ctaBand.eyebrow}
        title={ctaBand.title}
        body={ctaBand.body}
        primary={ctaBand.primary}
        secondary={ctaBand.secondary}
      />
    </>
  );
}
