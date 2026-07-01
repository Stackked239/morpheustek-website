import { Camera, Cpu, Radar, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import type { FullStackPageData } from "@/lib/cms/page-defaults";

const layerIcons = { radar: Radar, shield: ShieldCheck, camera: Camera, cpu: Cpu } as const;

export function FullStackPageView({ page }: { page: FullStackPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Full-stack perception", href: "/full-stack-perception" },
        ]}
      >
        <Button href={page.hero.primaryCta.href} variant="primary" size="lg">
          {page.hero.primaryCta.label}
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {page.layers.map((l) => {
              const Icon = layerIcons[l.icon as keyof typeof layerIcons] ?? Radar;
              return (
                <div key={l.title} className="flex gap-4 rounded-lg border border-border bg-surface p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-text-strong">{l.title}</h2>
                    <p className="mt-1 text-sm text-text-muted">{l.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <Eyebrow>{page.stack.eyebrow}</Eyebrow>
          <h2 className="mt-2 font-display text-h3 font-extrabold text-text-strong">{page.stack.title}</h2>
          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            {page.stack.rows.slice(0, 3).map((s, i) => (
              <div key={s.layer} className={`p-4 text-sm ${i % 2 ? "bg-bg-muted/40" : "bg-surface"} ${i ? "border-t border-border" : ""}`}>
                <span className="font-display font-bold text-text-strong">{s.layer}</span>
                <span className="ml-2 text-text-muted">{s.does}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title={page.cta.title} body={page.cta.body} primary={page.cta.primary} secondary={page.cta.secondary} />
    </>
  );
}
