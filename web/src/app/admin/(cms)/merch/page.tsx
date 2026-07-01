import Link from "next/link";
import { getProducts, getContent } from "@/lib/cms";
import { contentBlockRegistry } from "@/lib/cms/content-registry";
import { defaultBoothMode, defaultProductOfMonth } from "@/lib/cms/home-defaults";
import { BoothModeForm, ProductOfMonthForm } from "@/components/admin/editors/MerchForms";

export default async function AdminMerchPage() {
  const [booth, pom, products] = await Promise.all([
    getContent("layout.booth_mode", defaultBoothMode),
    getContent("merch.product_of_month", defaultProductOfMonth),
    getProducts(),
  ]);

  const boothDef = contentBlockRegistry.find((b) => b.key === "layout.booth_mode")!;
  const pomDef = contentBlockRegistry.find((b) => b.key === "merch.product_of_month")!;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Merchandising</h2>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Booth mode and product-of-the-month controls. Changes publish immediately.
        </p>
        <p className="mt-2 text-sm">
          <Link href="/product-of-the-month" className="text-brand-blue hover:underline">
            View product-of-the-month page →
          </Link>
        </p>
      </div>

      <BoothModeForm
        initial={booth}
        blockKey={boothDef.key}
        label={boothDef.label}
        group={boothDef.group}
      />

      <ProductOfMonthForm
        initial={pom}
        blockKey={pomDef.key}
        label={pomDef.label}
        group={pomDef.group}
        products={products}
      />
    </div>
  );
}
