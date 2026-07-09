import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductMedia } from "@/components/product/ProductMedia";
import { ProductDownloadActions } from "@/components/product/ProductDownloadActions";
import { ProductCard } from "@/components/product/ProductCard";
import { SpecTable } from "@/components/product/SpecTable";
import { CtaBand } from "@/components/marketing/CtaBand";
import {
  availabilityLabel,
  getCategory,
  getProduct,
  getProducts,
  getRobotTypes,
  productImage,
  productsInCategory,
  visibleSpecs,
} from "@/lib/cms";
import { cn } from "@/lib/cn";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const cat = await getCategory(p.category);
  return {
    title: `${p.name} — ${cat?.label ?? "Sensor"}`,
    description: p.summary,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: `${p.name} — ${cat?.label ?? "Sensor"}`, description: p.summary },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, robotTypes] = await Promise.all([getProduct(slug), getRobotTypes()]);
  if (!product) notFound();
  const cat = await getCategory(product.category);
  const isSafety = (product.certifications?.length ?? 0) > 0;
  const related = (await productsInCategory(product.category)).filter((p) => p.slug !== product.slug).slice(0, 3);
  const imageSrc = await productImage(product.slug);
  const keySpecs = visibleSpecs(product.keySpecs);
  const specs = visibleSpecs(product.specs);

  return (
    <>
      {/* ---------- ABOVE THE FOLD ---------- */}
      <section className="dark relative overflow-hidden bg-bg">
        <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" aria-hidden />
        <Container className="relative py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-text-muted">
              <li><Link href="/" className="hover:text-text">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/products" className="hover:text-text">Products</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`/${product.category}`} className="hover:text-text">{cat?.label}</Link></li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <ProductMedia
                product={product}
                imageSrc={imageSrc}
                className="aspect-[4/3] w-full rounded-lg border border-border"
                sizes="(min-width: 1024px) 45vw, 100vw"
                pad="p-8"
              />
              {!imageSrc ? (
                <p className="mt-3 text-center font-mono text-xs text-text-subtle">
                  Illustrative — real product photography supplied at launch.
                </p>
              ) : null}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                {product.featured ? <Badge tone="featured">Featured</Badge> : null}
                {isSafety ? (
                  <Badge tone="safety" icon={ShieldCheck}>
                    Type 3 · SIL2 · PL d
                  </Badge>
                ) : null}
                {product.availability === "in-stock" ? <Badge tone="in-stock">In stock</Badge> : null}
                {product.availability === "pre-order" ? <Badge tone="pre-order">Pre-order</Badge> : null}
                {product.trial ? (
                  <Badge tone="trial" icon={BadgeCheck}>
                    90-day trial
                  </Badge>
                ) : null}
              </div>

              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-brand-blue">
                {product.brand} · {cat?.label}
              </p>
              <h1 className="mt-1 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-tight tracking-[-0.02em] text-text-strong">
                {product.name}
              </h1>
              <p className="mt-3 text-lead text-text-muted">{product.tagline}</p>

              {/* key specs above the fold — the engineer's first read */}
              <dl className="mt-7 grid grid-cols-2 gap-3">
                {keySpecs.map((s) => (
                  <div
                    key={s.label}
                    className={cn(
                      "rounded-md border p-3",
                      s.highlight ? "border-accent bg-accent/15" : "border-border bg-surface",
                    )}
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
                      {s.label}
                      {s.highlight ? <span className="ml-1 text-accent" aria-hidden>★</span> : null}
                    </dt>
                    <dd className={cn("tnum mt-1 font-display text-base font-bold text-text-strong", s.highlight && "text-text-strong")}>
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs uppercase tracking-wide text-text-muted">
                  {availabilityLabel[product.availability]}
                  {product.availabilityNote ? ` · ${product.availabilityNote}` : ""}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={`/book-a-meeting?intent=quote&product=${product.slug}`} variant="primary" size="lg">
                  Get a quote
                </Button>
                {product.trial ? (
                  <Button href={`/book-a-meeting?intent=trial&product=${product.slug}`} variant="secondary" size="lg">
                    Start a 90-day trial
                  </Button>
                ) : null}
                <ProductDownloadActions product={product} robotTypes={robotTypes} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- DETAIL ---------- */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <Eyebrow>Overview</Eyebrow>
              <p className="mt-4 text-lead leading-relaxed text-text">{product.summary}</p>

              <h2 className="mt-12 font-display text-h3 font-bold text-text-strong">Best for</h2>
              <ul className="mt-4 grid gap-2.5">
                {product.bestFor.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-text-muted">
                    <Check className="mt-0.5 size-5 shrink-0 text-success" />
                    {b}
                  </li>
                ))}
              </ul>

              {isSafety && product.certifications ? (
                <>
                  <h2 className="mt-12 font-display text-h3 font-bold text-text-strong">Certifications</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-3 py-1.5 text-sm font-medium text-text">
                        <ShieldCheck className="size-4 text-brand-blue" /> {c}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}

              {product.compare ? (
                <>
                  <h2 className="mt-12 font-display text-h3 font-bold text-text-strong">How it compares</h2>
                  <div className="mt-4 overflow-hidden rounded-lg border border-border">
                    <table className="w-full border-collapse text-sm">
                      <caption className="sr-only">{product.name} vs {product.compare[0].competitorName}</caption>
                      <thead>
                        <tr className="bg-bg-muted text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                          <th scope="col" className="p-3">Spec</th>
                          <th scope="col" className="border-l border-border bg-accent/10 p-3 text-text-strong">{product.model}</th>
                          <th scope="col" className="border-l border-border p-3">{product.compare[0].competitorName}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.compare.map((row, i) => (
                          <tr key={row.spec} className={i % 2 ? "bg-bg-muted/40" : undefined}>
                            <th scope="row" className="p-3 text-left font-medium text-text-muted">{row.spec}</th>
                            <td className="tnum border-l border-border bg-accent/10 p-3 font-semibold text-text-strong">{row.mt}</td>
                            <td className="tnum border-l border-border p-3 text-text-muted">{row.competitor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-text-subtle">
                    Comparison reflects published specifications. We never trash a competitor&apos;s quality — we win on value and the trial.
                  </p>
                </>
              ) : null}
            </div>

            {/* full spec sidebar */}
            <aside className="lg:sticky lg:top-24">
              <div className="surface-card p-6">
                <h2 className="font-display text-h4 font-bold text-text-strong">Full specifications</h2>
                <div className="mt-4">
                  <SpecTable specs={specs} caption={`${product.name} specifications`} />
                </div>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm text-text-muted">Need a custom FOV, range, mounting, or housing?</p>
                  <Button href="/custom-solutions" variant="quiet" size="sm" className="mt-2">
                    Custom solutions <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ---------- RELATED ---------- */}
      {related.length > 0 ? (
        <Section tone="subtle">
          <Container wide>
            <h2 className="font-display text-h3 font-bold text-text-strong">More {cat?.label}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} className="h-full" />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title={`Put the ${product.model} on your robot.`}
        body="Get a quote, request a trial unit, or talk to an engineer about your application."
        primary={{ label: "Book a meeting", href: `/book-a-meeting?product=${product.slug}` }}
        secondary={{ label: "Back to products", href: "/products" }}
      />
    </>
  );
}
