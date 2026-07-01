import { Compass, Factory, Globe, HandshakeIcon, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import type { AboutPageData } from "@/lib/cms/page-defaults";

const statIcons = {
  factory: Factory,
  shield: ShieldCheck,
  compass: Compass,
  handshake: HandshakeIcon,
} as const;

export function AboutPageView({ page }: { page: AboutPageData }) {
  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lead={page.hero.lead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why MorpheusTEK", href: "/about" },
        ]}
      >
        <Button href={page.hero.primaryCta.href} variant="primary" size="lg">
          {page.hero.primaryCta.label}
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>{page.intro.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">{page.intro.title}</h2>
              <p className="mt-4 text-lead text-text-muted">{page.intro.body1}</p>
              <p className="mt-3 text-sm text-text-muted">{page.intro.body2}</p>
            </div>
            <div className="corner-crop relative aspect-[4/3] w-full overflow-hidden">
              <Image src="/media/robot-eye.jpg" alt="" fill className="object-cover" sizes="40vw" />
              <div className="angle-panel absolute bottom-0 right-0 bg-accent py-3 pl-7 pr-5 text-accent-text">
                <div className="font-display text-3xl font-black uppercase leading-none">{page.intro.statValue}</div>
                <div className="mt-1 max-w-[10rem] font-display text-[10px] font-bold uppercase leading-snug">{page.intro.statCaption}</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <section className="dark relative overflow-hidden bg-bg">
        <Container className="relative grid gap-8 py-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{page.manufacturing.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-h3 font-extrabold text-text-strong">{page.manufacturing.title}</h2>
            <p className="mt-3 text-sm text-text-muted">{page.manufacturing.lead}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {page.statCards.map((s) => {
              const Icon = statIcons[s.icon as keyof typeof statIcons] ?? Factory;
              return (
                <div key={s.title} className="surface-card p-4">
                  <Icon className="size-5 text-accent" />
                  <div className="mt-2 font-display text-sm font-bold text-text-strong">{s.title}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaBand title={page.cta.title} body={page.cta.body} primary={page.cta.primary} secondary={page.cta.secondary} />
    </>
  );
}
