import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { AssemblyStack } from "@/components/home/AssemblyStack";
import { APPLICATION_ASSEMBLIES } from "@/lib/cms/assemblies";
import { getApplication, getApplications } from "@/lib/cms";

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

  // The application has a bespoke four-part build; if one isn't authored yet the
  // assembly falls back to its first entry (AMR).
  const hasAssembly = APPLICATION_ASSEMBLIES.some((a) => a.id === app.slug);

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

      {/* Full scan render. The image carries its own aspect ratio (intrinsic
          width/height + h-auto), so it always shows whole — no fixed-ratio box to
          crop or letterbox against. Dark plate matches the render's backdrop. */}
      {appImages[app.slug] ? (
        <div className="border-b border-border bg-mt-navy-900">
          <Image
            src={appImages[app.slug]}
            alt={app.title}
            width={1376}
            height={768}
            sizes="100vw"
            priority
            className="mx-auto block h-auto w-full max-w-[1600px]"
          />
        </div>
      ) : null}

      {/* The build, in four steps — the perception stack pre-configured for this
          application, with the platform switcher to compare the others. */}
      {hasAssembly ? (
        <AssemblyStack
          assemblies={APPLICATION_ASSEMBLIES}
          defaultId={app.slug}
          section={{
            eyebrow: "The stack",
            title: "Four steps to sight you can certify.",
            body: "Protect, map, see, think — the same four-layer stack on every robot. This build is configured for the application above; the safety floor never changes, the parts above it do.",
          }}
        />
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
