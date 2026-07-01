import Link from "next/link";
import { ArrowRight, Cable, Gauge, Wrench } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EyeIcon } from "@/components/brand/EyeIcon";
import { defaultBuildToSpecContent } from "@/lib/cms/home-defaults";

const PILLAR_ICONS = [Wrench, Gauge, Cable] as const;

export function BuildToSpec({ content = defaultBuildToSpecContent }: { content?: typeof defaultBuildToSpecContent }) {
  return (
    <Section tone="default" id="custom" className="border-t border-border">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            {content.title}
          </h2>
          <p className="mt-5 text-lead text-text-muted">{content.body}</p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {content.pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i] ?? Wrench;
            return (
              <div key={p.title} className="flex flex-col items-start">
                <EyeIcon icon={Icon} size={72} />
                <h3 className="mt-4 font-display text-h5 font-bold uppercase text-text-strong">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
              </div>
            );
          })}
        </div>

        <Link
          href={content.link.href}
          className="group mt-10 inline-flex items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-2"
        >
          {content.link.label}
          <ArrowRight
            className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </Container>
    </Section>
  );
}
