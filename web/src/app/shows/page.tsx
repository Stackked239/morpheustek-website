import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { getContent } from "@/lib/cms";

const defaultShows = {
  hero: {
    eyebrow: "Shows we'll be at",
    title: "Find us on the floor.",
    lead: "We're at the major North American robotics and automation shows — a national footprint you can meet in person. Tell us you're coming and we'll save you a slot at the booth.",
  },
  shows: [
    { name: "Automate", city: "Detroit, MI", when: "Late June 2026", next: true },
    { name: "MODEX", city: "Atlanta, GA", when: "2026" },
    { name: "ProMat", city: "Chicago, IL", when: "2026" },
    { name: "Robotics Summit & Expo", city: "Boston, MA", when: "2026" },
    { name: "A3 Business Forum", city: "Orlando, FL", when: "2026" },
    { name: "CES", city: "Las Vegas, NV", when: "2026" },
  ],
  cta: {
    eyebrow: "Coming to a show?",
    title: "Tell us you'll be there.",
    body: "We'll have a demo ready and save you time on the floor.",
    primary: { label: "Meet us at the booth", href: "/shows/meet-us-at-the-booth" },
    secondary: { label: "Browse products first", href: "/products" },
  },
};

export const metadata: Metadata = {
  title: "Shows We'll Be At — Meet MorpheusTEK on the Floor",
  description:
    "MorpheusTEK is on the floor at the major North American robotics and automation shows. See where we'll be and reserve a slot at the booth.",
  alternates: { canonical: "/shows" },
};

export default async function ShowsPage() {
  const content = await getContent("page.shows", defaultShows);
  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        lead={content.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shows", href: "/shows" },
        ]}
      >
        <Button href="/shows/meet-us-at-the-booth" variant="primary" size="lg">
          Meet us at the booth
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.shows.map((s) => (
              <div key={s.name} className="surface-card flex flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <CalendarDays className="size-5" />
                  </span>
                  {"next" in s && s.next ? <Badge tone="new">Next up</Badge> : null}
                </div>
                <h2 className="mt-4 font-display text-h4 font-bold text-text-strong">{s.name}</h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted">
                  <MapPin className="size-4 text-text-subtle" /> {s.city}
                </p>
                <p className="mt-0.5 font-mono text-xs text-text-subtle">{s.when}</p>
                <Button href="/shows/meet-us-at-the-booth" variant="quiet" size="sm" className="mt-4 self-start">
                  Save me a slot →
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-xs text-text-subtle">
            Schedule updates through the year — confirm exact dates and booth numbers before you travel.
          </p>
        </Container>
      </Section>

      <CtaBand
        eyebrow={content.cta.eyebrow}
        title={content.cta.title}
        body={content.cta.body}
        primary={content.cta.primary}
        secondary={content.cta.secondary}
      />
    </>
  );
}
