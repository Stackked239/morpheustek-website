import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { CtaBand } from "@/components/marketing/CtaBand";
import { PageHero } from "@/components/marketing/PageHero";
import { getCategory, productsInCategory, type CategorySlug } from "@/lib/cms";

export async function CategoryView({ slug }: { slug: CategorySlug }) {
  const category = await getCategory(slug);
  if (!category) return null;
  const items = await productsInCategory(slug);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={category.title}
        lead={category.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.label, href: `/${category.slug}` },
        ]}
      >
        <Button href="/book-a-meeting?intent=quote" variant="primary" size="lg">
          Get a quote
        </Button>
        <Button href="/book-a-meeting?intent=trial" variant="ghost" size="lg">
          Start a 90-day trial
        </Button>
      </PageHero>

      <Section>
        <Container wide>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} className="h-full" />
            ))}
          </div>
          {items.length === 0 ? <p className="text-text-muted">Products in this category are coming soon.</p> : null}
        </Container>
      </Section>

      <CtaBand
        title="Not sure which sensor fits?"
        body="Tell us the application, range, and environment. We'll recommend the right unit and put it on a 90-day trial."
        primary={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
        secondary={{ label: "Compare to SICK", href: "/compare/sick-alternative-lidar" }}
      />
    </>
  );
}
