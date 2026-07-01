import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { getApplications } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Applications — Robot Perception by Use Case",
  description:
    "How MorpheusTEK LiDAR, 3D cameras, safety sensing, and edge compute fit AMRs, AGVs, autonomous forklifts, robotic cleaning, warehouse automation, outdoor robots, mapping, and inspection.",
  alternates: { canonical: "/applications" },
};

export default async function ApplicationsPage() {
  const applications = await getApplications();
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Perception, matched to what your robot does."
        lead="Every robot has a different sensing problem. Start with the application — environment, range, what it must detect — and we'll map the right LiDAR, camera, safety, and compute combination."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Applications", href: "/applications" },
        ]}
      >
        <Button href="/book-a-meeting?intent=engineer" variant="primary" size="lg">
          Talk to an engineer
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {applications.map((a) => (
              <Link
                key={a.slug}
                href={`/applications/${a.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <h2 className="font-display text-h4 font-bold text-text-strong group-hover:text-brand-blue">{a.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{a.pain}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                  See the sensor fit
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Don't see your exact application?"
        body="We work across commercial robotics and industrial automation. Tell us what you're building."
        primary={{ label: "Book a meeting", href: "/book-a-meeting" }}
        secondary={{ label: "Custom solutions", href: "/custom-solutions" }}
      />
    </>
  );
}
