import type { Metadata } from "next";
import { Blocks, Cable, Cpu, Gauge, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { EyeIcon } from "@/components/brand/EyeIcon";
import { getContent } from "@/lib/cms";
import { customSolutionsPageDefaults } from "@/lib/cms/page-defaults";

const serviceIcons = {
  wrench: Wrench,
  gauge: Gauge,
  cable: Cable,
  cpu: Cpu,
  blocks: Blocks,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.custom_solutions", customSolutionsPageDefaults);
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: "/custom-solutions" },
  };
}

export default async function CustomSolutionsPage() {
  const page = await getContent("page.custom_solutions", customSolutionsPageDefaults);

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Custom solutions", href: "/custom-solutions" },
        ]}
      >
        <Button href={page.hero.primaryCta.href} variant="primary" size="lg">
          {page.hero.primaryCta.label}
        </Button>
      </PageHero>

      <Section>
        <Container>
          <Eyebrow>What we tailor</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-h2 font-extrabold uppercase text-text-strong">
            Custom from housing to firmware.
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {page.services.map((s) => {
              const Icon = serviceIcons[s.icon as keyof typeof serviceIcons] ?? Wrench;
              return (
                <div key={s.title} className="flex flex-col items-start">
                  <EyeIcon icon={Icon} size={84} />
                  <h3 className="mt-4 font-display text-h5 font-bold uppercase text-text-strong">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>{page.manufacturing.eyebrow}</Eyebrow>
              <h2 className="mt-3 font-display text-h2 font-extrabold uppercase text-text-strong">{page.manufacturing.title}</h2>
              <p className="mt-5 text-lead text-text-muted">{page.manufacturing.body}</p>
              <div className="mt-8">
                <Button href={page.manufacturing.cta.href} variant="primary" size="lg">
                  {page.manufacturing.cta.label}
                </Button>
              </div>
            </div>
            <ul className="grid gap-3">
              {page.manufacturing.bullets.map((t) => (
                <li key={t} className="surface-card flex items-start gap-3 p-4 text-sm text-text">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={page.cta.title}
        body={page.cta.body}
        primary={page.cta.primary}
        secondary={page.cta.secondary}
      />
    </>
  );
}
