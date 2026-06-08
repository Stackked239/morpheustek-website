import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { leadMagnets } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Technical Resource Library — Guides, Checklists & Worksheets",
  description:
    "Free technical resources for robotics engineers and buyers: the SICK / Hokuyo Alternative Comparison Checklist, LiDAR selection and safety buyer's guides, a custom requirements worksheet, and sample point-cloud packs.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Technical resource library"
        title="Guides that help you choose — before you talk to anyone."
        lead="Practical, vendor-honest resources for robotics engineers and buyers. Trade an email, get the guide, and decide on your own terms."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
        ]}
      >
        <Button href="/resources/glossary" variant="ghost" size="lg">
          Robotics glossary
        </Button>
      </PageHero>

      <Section>
        <Container wide>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {leadMagnets.map((m) => (
              <Link
                key={m.slug}
                href={`/resources/${m.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <FileText className="size-5" />
                  </span>
                  {m.primary ? <Badge tone="featured">Most popular</Badge> : null}
                </div>
                <h2 className="mt-4 font-display text-h5 font-bold leading-tight text-text-strong group-hover:text-brand-blue">{m.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{m.blurb}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-text-subtle">{m.icp}</span>
                  <ArrowRight className="size-4 text-brand-blue transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ready to talk specifics?"
        body="Skip the guide — tell us your application and we'll recommend the right sensing stack."
        primary={{ label: "Talk to an engineer", href: "/book-a-meeting?intent=engineer" }}
        secondary={{ label: "Browse products", href: "/products" }}
      />
    </>
  );
}
