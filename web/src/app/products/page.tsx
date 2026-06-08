import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, productsInCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products — LiDAR, 3D Cameras & Edge Compute for Robotics",
  description:
    "The MorpheusTEK line-up: 2D and 3D LiDAR, safety LiDAR, solid-state LiDAR, dToF 3D cameras, rangefinders, 3D mapping, and edge compute — all backed by a 90-day risk-free trial.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="The line-up"
        title="Robot perception, end to end."
        lead="2D and 3D LiDAR, safety scanners, solid-state units, dToF 3D cameras, rangefinders, mapping, and edge compute — selected, sourced, and supported for North American robotics. Every OLEI product ships with a 90-day risk-free trial."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
        ]}
      >
        <Button href="/book-a-meeting?intent=quote" variant="primary" size="lg">
          Get a quote
        </Button>
        <Button href="/book-a-meeting?intent=engineer" variant="ghost" size="lg">
          Talk to an engineer
        </Button>
      </PageHero>

      <Section>
        <Container wide>
          {categories.map((cat) => {
            const items = productsInCategory(cat.slug);
            if (items.length === 0) return null;
            return (
              <div key={cat.slug} className="mb-16 last:mb-0 scroll-mt-24" id={cat.slug}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                  <div className="max-w-2xl">
                    <h2 className="font-display text-h3 font-bold text-text-strong">{cat.label}</h2>
                    <p className="mt-1 text-sm text-text-muted">{cat.blurb}</p>
                  </div>
                  <Button href={`/${cat.slug}`} variant="quiet" size="sm">
                    View {cat.label} →
                  </Button>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.slug} product={p} className="h-full" />
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </Section>

      <CtaBand
        title="Tell us the application — we'll spec the sensor."
        body="Range, FOV, environment, safety needs. We map it to the right unit and put it on a 90-day trial in your own environment."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "Compare to SICK", href: "/compare/sick-alternative-lidar" }}
      />
    </>
  );
}
