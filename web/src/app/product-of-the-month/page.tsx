import type { Metadata } from "next";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductGlyph } from "@/components/brand/ProductGlyph";
import { CtaBand } from "@/components/marketing/CtaBand";
import { featuredProduct } from "@/lib/catalog";

const product = featuredProduct();

export const metadata: Metadata = {
  title: "Product of the Month",
  description: `This month's featured sensor: the ${product.name} — ${product.tagline}`,
  alternates: { canonical: "/product-of-the-month" },
};

export default function ProductOfTheMonthPage() {
  return (
    <>
      <section className="dark relative overflow-hidden bg-bg">
        <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" aria-hidden />
        <Container className="relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>Product of the month</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
              Affordable safety has arrived.
            </h1>
            <p className="mt-5 text-lead text-text-muted">{product.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone="safety" icon={ShieldCheck}>
                Type 3 · SIL2 · PL d
              </Badge>
              <Badge tone="trial" icon={BadgeCheck}>
                90-day trial
              </Badge>
              <Badge tone="in-stock">In stock</Badge>
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
          <ProductGlyph label={product.model} className="aspect-[4/3] w-full" />
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.keySpecs.map((s) => (
              <div key={s.label} className="surface-card p-5">
                <div className="font-mono text-[11px] uppercase tracking-wide text-text-muted">{s.label}</div>
                <div className="tnum mt-1 font-display text-h4 font-bold text-text-strong">{s.value}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Same safety class as SICK. A fraction of the price."
        body="See the GS1-5 on your own AGV next to the incumbent — risk-free for 90 days."
        primary={{ label: "Request a trial unit", href: "/book-a-meeting?intent=trial" }}
        secondary={{ label: "Compare to SICK", href: "/compare/sick-alternative-lidar" }}
      />
    </>
  );
}
