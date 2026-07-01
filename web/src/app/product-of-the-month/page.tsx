import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { CtaBand } from "@/components/marketing/CtaBand";
import { getContent, getProduct, productImage, visibleSpecs } from "@/lib/cms";
import { defaultProductOfMonth } from "@/lib/cms/home-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const merch = await getContent("merch.product_of_month", defaultProductOfMonth);
  const product = await getProduct(merch.productSlug);
  if (!product) {
    return { title: "Product of the Month", alternates: { canonical: "/product-of-the-month" } };
  }
  return {
    title: "Product of the Month",
    description: `This month's featured sensor: the ${product.name} — ${product.tagline}`,
    alternates: { canonical: "/product-of-the-month" },
  };
}

export default async function ProductOfTheMonthPage() {
  const merch = await getContent("merch.product_of_month", defaultProductOfMonth);
  if (!merch.enabled) notFound();

  const product = await getProduct(merch.productSlug);
  if (!product) notFound();

  const src = await productImage(product.slug);
  const hasCert = (product.certifications?.length ?? 0) > 0;
  const keySpecs = visibleSpecs(product.keySpecs);

  return (
    <>
      <section className="dark relative overflow-hidden bg-bg">
        <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" aria-hidden />
        <Container className="relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>Product of the month</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
              {merch.headline}
            </h1>
            <p className="mt-5 text-lead text-text-muted">{product.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {hasCert ? (
                <Badge tone="safety" icon={ShieldCheck}>
                  {product.certifications!.join(" · ")}
                </Badge>
              ) : null}
              {product.trial ? (
                <Badge tone="trial" icon={BadgeCheck}>
                  90-day trial
                </Badge>
              ) : null}
              <Badge tone="in-stock">{product.availability === "in-stock" ? "In stock" : "Available"}</Badge>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/products/${product.slug}`} variant="primary" size="lg">
                View the {product.model}
              </Button>
              <Button href="/book-a-meeting?intent=trial" variant="ghost" size="lg">
                Start a 90-day trial
              </Button>
            </div>
          </div>
          {src ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-bg-muted">
              <Image src={src} alt={product.name} fill className="object-contain p-6" unoptimized={src.startsWith("http")} />
            </div>
          ) : (
            <ProductGlyph label={product.model} className="aspect-[4/3] w-full" />
          )}
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keySpecs.map((s) => (
              <div key={s.label} className="surface-card p-5">
                <div className="font-mono text-[11px] uppercase tracking-wide text-text-muted">{s.label}</div>
                <div className="tnum mt-1 font-display text-h4 font-bold text-text-strong">{s.value}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title={merch.ctaBand.title}
        body={merch.ctaBand.body}
        primary={merch.ctaBand.primary}
        secondary={merch.ctaBand.secondary}
      />
    </>
  );
}
