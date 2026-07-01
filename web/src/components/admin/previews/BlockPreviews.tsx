"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { AboutPageView } from "@/components/marketing/page-views/AboutPageView";
import { FullStackPageView } from "@/components/marketing/page-views/FullStackPageView";
import type {
  AboutPageData,
  BookMeetingPageData,
  CompareSickPageData,
  CtaBandData,
  CustomSolutionsPageData,
  FullStackPageData,
} from "@/lib/cms/page-defaults";

export function HeroBlockPreview({
  data,
}: {
  data: {
    headlineLine1: string;
    headlineAccent: string;
    headlineLine2: string;
    chips: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}) {
  return (
    <section className="dark relative overflow-hidden bg-bg">
      <Container className="relative py-12 md:py-16">
        <h1 className="max-w-3xl font-display text-[clamp(1.75rem,5vw,3rem)] font-extrabold uppercase leading-[1.02] tracking-tight text-text-strong">
          {data.headlineLine1}{" "}
          <span className="text-accent">{data.headlineAccent}</span> {data.headlineLine2}
        </h1>
        {data.chips.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {data.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-text-muted">
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={data.primaryCta.href} variant="primary" size="lg">
            {data.primaryCta.label}
          </Button>
          <Button href={data.secondaryCta.href} variant="ghost" size="lg">
            {data.secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function CtaBandBlockPreview({ data }: { data: CtaBandData & { eyebrow?: string } }) {
  return <CtaBand title={data.title} body={data.body} primary={data.primary} secondary={data.secondary} />;
}

export function TextSectionBlockPreview({ data }: { data: { eyebrow: string; title: string; body: string } }) {
  return (
    <section className="dark bg-bg py-12">
      <Container>
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">{data.title}</h2>
        <p className="mt-4 max-w-2xl text-lead text-text-muted">{data.body}</p>
      </Container>
    </section>
  );
}

export function GenericPageHeroPreview({
  eyebrow,
  title,
  lead,
  primary,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary?: { label: string; href: string };
}) {
  return (
    <PageHero eyebrow={eyebrow} title={title} lead={lead}>
      {primary ? (
        <Button href={primary.href} variant="primary" size="lg">
          {primary.label}
        </Button>
      ) : null}
    </PageHero>
  );
}

export function PageBlockPreview({ blockKey, data }: { blockKey: string; data: unknown }) {
  switch (blockKey) {
    case "page.about":
      return <AboutPageView page={data as AboutPageData} />;
    case "page.full_stack":
      return <FullStackPageView page={data as FullStackPageData} />;
    case "page.custom_solutions": {
      const page = data as CustomSolutionsPageData;
      return (
        <>
          <GenericPageHeroPreview {...page.hero} primary={page.hero.primaryCta} />
          <section className="bg-bg py-10">
            <Container>
              <div className="grid gap-4 sm:grid-cols-2">
                {page.services.slice(0, 4).map((s) => (
                  <div key={s.title} className="surface-card p-4">
                    <h3 className="font-display font-bold text-text-strong">{s.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{s.body}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
          <CtaBandBlockPreview data={page.cta} />
        </>
      );
    }
    case "page.compare.sick": {
      const page = data as CompareSickPageData;
      return (
        <>
          <GenericPageHeroPreview {...page.hero} primary={page.hero.primaryCta} />
          <section className="bg-bg py-10">
            <Container>
              <div className="grid gap-4 md:grid-cols-3">
                {page.pillars.map((p) => (
                  <div key={p.title} className="surface-card p-4">
                    <h3 className="font-display font-bold text-text-strong">{p.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{p.body}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        </>
      );
    }
    case "page.book_meeting": {
      const page = data as BookMeetingPageData;
      const cfg = page.intents.meeting;
      return (
        <section className="dark bg-bg py-12">
          <Container>
            <Eyebrow>{cfg.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-h2 font-extrabold text-text-strong">{cfg.title}</h1>
            <p className="mt-4 max-w-xl text-lead text-text-muted">{cfg.lead}</p>
            <ul className="mt-8 space-y-3">
              {page.steps.map((s) => (
                <li key={s.title} className="text-sm text-text-muted">
                  <strong className="text-text-strong">{s.title}</strong> — {s.body}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      );
    }
    case "homepage.hero":
      return <HeroBlockPreview data={data as Parameters<typeof HeroBlockPreview>[0]["data"]} />;
    case "homepage.cta_band":
      return <CtaBandBlockPreview data={data as CtaBandData} />;
    case "homepage.category_browse":
    case "homepage.range_ledger":
    case "homepage.assembly":
    case "homepage.trust_band":
    case "homepage.build_to_spec":
    case "homepage.certify":
      return <TextSectionBlockPreview data={data as { eyebrow: string; title: string; body: string }} />;
    default:
      return (
        <div className="dark p-8 text-sm text-text-muted">
          <p className="font-mono text-xs uppercase text-brand-blue">Preview</p>
          <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-bg-muted p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
}
