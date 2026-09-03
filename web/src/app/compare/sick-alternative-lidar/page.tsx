import type { Metadata } from "next";
import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { getContent, getSiteSettings } from "@/lib/cms";
import { compareSickPageDefaults } from "@/lib/cms/page-defaults";
import { pageMetadata } from "@/lib/seo";

const pillarIcons = [ShieldCheck, Check, BadgeCheck] as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.compare.sick", compareSickPageDefaults);
  return pageMetadata({
    title: page.meta.title,
    description: page.meta.description,
    path: "/compare/sick-alternative-lidar",
  });
}

export default async function SickAlternativePage() {
  const [page, site] = await Promise.all([
    getContent("page.compare.sick", compareSickPageDefaults),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare/sick-alternative-lidar" },
        ]}
      >
        <Button href={page.hero.primaryCta.href} variant="primary" size="lg">
          {page.hero.primaryCta.label}
        </Button>
        <Button href={page.hero.secondaryCta.href} variant="ghost" size="lg">
          {page.hero.secondaryCta.label}
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {page.pillars.map((c, i) => {
              const Icon = pillarIcons[i] ?? ShieldCheck;
              return (
                <div key={c.title} className="surface-card p-6">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-4 font-display text-h5 font-bold text-text-strong">{c.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <Eyebrow>{page.table.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">{page.table.title}</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-lg">
              <caption className="sr-only">OLEI GS1-5 compared with SICK nanoScan3 and microScan3</caption>
              <thead>
                <tr className="bg-bg-muted text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <th scope="col" className="p-4">Spec</th>
                  <th scope="col" className="border-l border-border bg-accent/15 p-4 text-text-strong">OLEI GS1-5</th>
                  <th scope="col" className="border-l border-border p-4">SICK nanoScan3</th>
                  <th scope="col" className="border-l border-border p-4">SICK microScan3</th>
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((r, i) => (
                  <tr key={r.spec} className={i % 2 ? "bg-bg-muted/40" : "bg-surface"}>
                    <th scope="row" className="p-4 text-left font-medium text-text-muted">{r.spec}</th>
                    <td className="tnum border-l border-border bg-accent/10 p-4 font-semibold text-text-strong">{r.mt}</td>
                    <td className="tnum border-l border-border p-4 text-text-muted">{r.nano}</td>
                    <td className="tnum border-l border-border p-4 text-text-muted">{r.micro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-text-muted">{page.table.footnote}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>{page.fleet.eyebrow}</Eyebrow>
              <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">{page.fleet.title}</h2>
              <p className="mt-5 text-lead text-text-muted">{page.fleet.body}</p>
              <ul className="mt-6 grid gap-2.5">
                {site.pillars.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-text-muted">
                    <Check className="mt-0.5 size-5 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-7">
              <p className="eyebrow">Free download</p>
              <h3 className="mt-2 font-display text-h4 font-bold text-text-strong">{page.fleet.resourceTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{page.fleet.resourceBlurb}</p>
              <Button href={page.fleet.resourceHref} variant="primary" size="lg" className="mt-6">
                Download the checklist
              </Button>
            </div>
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
