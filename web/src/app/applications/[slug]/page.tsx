import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Crosshair, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { ProductCard } from "@/components/product/ProductCard";
import { getApplication, getApplications, getProduct } from "@/lib/cms";

const appImages: Record<string, string> = {
  amr: "/media/hero-warehouse.jpg",
  "warehouse-logistics": "/media/hero-warehouse.jpg",
  "autonomous-forklift": "/media/forklift.jpg",
  "robotic-cleaning": "/media/robot-eye.jpg",
};

export async function generateStaticParams() {
  const apps = await getApplications();
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getApplication(slug);
  if (!a) return {};
  return {
    title: `${a.title} — Sensor Fit`,
    description: `${a.pain} ${a.fit}`,
    alternates: { canonical: `/applications/${a.slug}` },
  };
}

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = await getApplication(slug);
  if (!app) notFound();
  const sensors = (await Promise.all(app.sensors.map((s) => getProduct(s)))).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <>
      <PageHero
        eyebrow="Application"
        title={app.title}
        lead={app.pain}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Applications", href: "/applications" },
          { label: app.title, href: `/applications/${app.slug}` },
        ]}
      >
        <Button href="/book-a-meeting?intent=engineer" variant="primary" size="lg">
          Talk to an engineer
        </Button>
      </PageHero>

      {appImages[app.slug] ? (
        <div className="relative h-[34vh] min-h-[16rem] w-full overflow-hidden border-b border-border">
          <Image src={appImages[app.slug]} alt={app.title} fill sizes="100vw" className="object-cover" priority />
        </div>
      ) : null}

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-card p-7">
              <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                <Crosshair className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-h4 font-bold text-text-strong">The challenge</h2>
              <p className="mt-2 leading-relaxed text-text-muted">{app.pain}</p>
            </div>
            <div className="surface-card p-7">
              <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                <Layers className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-h4 font-bold text-text-strong">The sensor fit</h2>
              <p className="mt-2 leading-relaxed text-text-muted">{app.fit}</p>
            </div>
          </div>
        </Container>
      </Section>

      {sensors.length > 0 ? (
        <Section tone="subtle">
          <Container wide>
            <Eyebrow>Recommended sensing</Eyebrow>
            <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">Where our stack fits</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sensors.map((p) => (
                <ProductCard key={p.slug} product={p} className="h-full" />
              ))}
            </div>
            <div className="mt-8">
              <Button href="/products" variant="quiet" size="md">
                See the full line-up <ArrowRight className="size-4" />
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title={`Building ${app.title.toLowerCase()}?`}
        body="Tell us the environment, range, and what it must detect. We'll spec the stack and put it on a 90-day trial."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "All applications", href: "/applications" }}
      />
    </>
  );
}
